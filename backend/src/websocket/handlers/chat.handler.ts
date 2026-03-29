import type { Client } from 'pg';
import { connectionManager } from '../connectionManager.ts';
import type { ChatMessagePayload, ChatSendPayload } from '../types.ts';

// ============================================
// Chat Handlers
// ============================================

export async function handleChatSend(
  db: Client,
  userId: string,
  data: ChatSendPayload
): Promise<void> {
  const { room_id, content } = data;

  // Validate content
  if (!content || content.trim().length === 0) {
    connectionManager.send(userId, 'error', { error: 'Empty message' });
    return;
  }

  if (content.length > 500) {
    connectionManager.send(userId, 'error', {
      error: 'Message too long (max 500 chars)',
    });
    return;
  }

  try {
    // 1. Get sender info
    const userResult = await db.query(
      'SELECT id, username, avatar_filename AS avatar_url FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      connectionManager.send(userId, 'error', { error: 'User not found' });
      return;
    }

    const sender = userResult.rows[0];

    // 2. Insert message into DB
    const messageResult = await db.query(
      `INSERT INTO messages (sender_id, room_id, content, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id, created_at`,
      [userId, room_id, content.trim()]
    );

    const message = messageResult.rows[0];

    // 3. Build payload
    const chatPayload: ChatMessagePayload = {
      id: message.id,
      sender: {
        id: sender.id,
        username: sender.username,
        avatar_url: sender.avatar_url,
      },
      room_id,
      content: content.trim(),
      created_at: message.created_at,
    };

    // 4. Broadcast to appropriate channel
    if (room_id === null) {
      // Global chat
      connectionManager.broadcast('global_chat', 'chat:message', chatPayload);
      console.log(
        `💬 Global: ${sender.username}: ${content.substring(0, 50)}...`
      );
    } else {
      // Room chat
      const roomName = `room_${room_id}`;
      connectionManager.broadcast(roomName, 'chat:message', chatPayload);
      console.log(
        `💬 Room ${room_id}: ${sender.username}: ${content.substring(0, 50)}...`
      );
    }
  } catch (err) {
    console.error('❌ handleChatSend error:', err);
    connectionManager.send(userId, 'error', {
      error: 'Failed to send message',
    });
  }
}

// ============================================
// Chat History
// ============================================

export async function handleChatHistory(
  db: Client,
  userId: string,
  data: { room_id: number | null; limit?: number }
): Promise<void> {
  const { room_id, limit = 50 } = data;
  const messageLimit = Math.min(limit, 100); // Cap at 100

  try {
    const result = await db.query(
      `SELECT m.id, m.content, m.created_at, m.room_id,
              u.id as sender_id, u.username as sender_username, u.avatar_filename as sender_avatar
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.room_id IS NOT DISTINCT FROM $1
       ORDER BY m.created_at DESC
       LIMIT $2`,
      [room_id, messageLimit]
    );

    // Reverse so oldest first
    const messages: ChatMessagePayload[] = result.rows
      .reverse()
      .map(
        (row: {
          id: number;
          content: string;
          created_at: string;
          room_id: number | null;
          sender_id: string;
          sender_username: string;
          sender_avatar: string | null;
        }) => ({
          id: row.id,
          sender: {
            id: row.sender_id,
            username: row.sender_username,
            avatar_url: row.sender_avatar,
          },
          room_id: row.room_id,
          content: row.content,
          created_at: row.created_at,
        })
      );

    connectionManager.send(userId, 'chat:history', { room_id, messages });
    console.log(
      `📋 Chat history: sent ${messages.length} messages to user ${userId} (room: ${room_id ?? 'global'})`
    );
  } catch (err) {
    console.error('❌ handleChatHistory error:', err);
    connectionManager.send(userId, 'error', {
      error: 'Failed to load chat history',
    });
  }
}
