import type { Client } from 'pg';
import { connectionManager } from '../connectionManager.ts';
import type { FriendRequestPayload, FriendResponsePayload } from '../types.ts';

// ============================================
// Friend Handlers
// Schema (main repo):
//   friend_requests: id, user_from_id, user_to_id, created_at
//   friends:         user1_id, user2_id, created_at  (PK: user1_id, user2_id)
// ============================================

export async function handleFriendRequest(
  db: Client,
  userId: string,
  data: FriendRequestPayload
): Promise<void> {
  const { target_user_id } = data;

  if (userId === target_user_id) {
    connectionManager.send(userId, 'error', {
      error: "Can't send friend request to yourself",
    });
    return;
  }

  // Check target user exists
  const targetResult = await db.query(
    'SELECT id, username, avatar_filename AS avatar_url FROM users WHERE id = $1',
    [target_user_id]
  );
  if (targetResult.rows.length === 0) {
    connectionManager.send(userId, 'error', { error: 'User not found' });
    return;
  }

  // Check if already friends
  const friendCheck = await db.query(
    `SELECT 1 FROM friends
     WHERE (user1_id = $1 AND user2_id = $2)
        OR (user1_id = $2 AND user2_id = $1)`,
    [userId, target_user_id]
  );
  if (friendCheck.rows.length > 0) {
    connectionManager.send(userId, 'error', {
      error: 'Already friends with this user',
    });
    return;
  }

  // Check if a request exists in either direction
  const existingResult = await db.query(
    `SELECT id, user_from_id FROM friend_requests
     WHERE (user_from_id = $1 AND user_to_id = $2)
        OR (user_from_id = $2 AND user_to_id = $1)`,
    [userId, target_user_id]
  );

  if (existingResult.rows.length > 0) {
    const { id: existingId, user_from_id } = existingResult.rows[0];

    if (String(user_from_id) === String(userId)) {
      // We already sent a request
      connectionManager.send(userId, 'error', {
        error: 'Friend request already sent',
      });
      return;
    }

    // They sent us a request - auto-accept it
    await db.query('DELETE FROM friend_requests WHERE id = $1', [existingId]);
    const [u1, u2] = [userId, target_user_id].sort();
    await db.query('INSERT INTO friends (user1_id, user2_id) VALUES ($1, $2)', [
      u1,
      u2,
    ]);

    const ourInfo = await db.query(
      'SELECT id, username, avatar_filename AS avatar_url FROM users WHERE id = $1',
      [userId]
    );
    connectionManager.send(userId, 'friend:accepted', {
      request_id: existingId,
      friend: targetResult.rows[0],
    });
    if (connectionManager.isOnline(String(user_from_id))) {
      connectionManager.send(String(user_from_id), 'friend:accepted', {
        request_id: existingId,
        friend: ourInfo.rows[0],
      });
    }
    return;
  }

  // Insert new friend request
  const insertResult = await db.query(
    `INSERT INTO friend_requests (user_from_id, user_to_id)
     VALUES ($1, $2)
     RETURNING id`,
    [userId, target_user_id]
  );
  const requestId = insertResult.rows[0].id;

  // Notify target if online
  if (connectionManager.isOnline(target_user_id)) {
    const ourInfo = await db.query(
      'SELECT id, username, avatar_filename AS avatar_url FROM users WHERE id = $1',
      [userId]
    );
    connectionManager.send(target_user_id, 'friend:request_received', {
      request_id: requestId,
      from: ourInfo.rows[0],
    });
  }

  connectionManager.send(userId, 'friend:request_sent', {
    request_id: requestId,
    to_user_id: target_user_id,
  });
}

export async function handleFriendAccept(
  db: Client,
  userId: string,
  data: FriendResponsePayload
): Promise<void> {
  const { request_id } = data;

  // Verify request exists and current user is the recipient
  const requestResult = await db.query(
    `SELECT fr.id, fr.user_from_id,
            u.id as from_id, u.username as from_username, u.avatar_url as from_avatar
     FROM friend_requests fr
     JOIN users u ON fr.user_from_id = u.id
     WHERE fr.id = $1 AND fr.user_to_id = $2`,
    [request_id, userId]
  );

  if (requestResult.rows.length === 0) {
    connectionManager.send(userId, 'error', {
      error: 'Friend request not found or already processed',
    });
    return;
  }

  const { user_from_id, from_id, from_username, from_avatar } =
    requestResult.rows[0];

  await db.query('DELETE FROM friend_requests WHERE id = $1', [request_id]);
  const [u1, u2] = [userId, String(user_from_id)].sort();
  await db.query('INSERT INTO friends (user1_id, user2_id) VALUES ($1, $2)', [
    u1,
    u2,
  ]);

  const acceptorInfo = await db.query(
    'SELECT id, username, avatar_filename AS avatar_url FROM users WHERE id = $1',
    [userId]
  );

  connectionManager.send(userId, 'friend:accepted', {
    request_id,
    friend: { id: from_id, username: from_username, avatar_url: from_avatar },
  });

  if (connectionManager.isOnline(String(user_from_id))) {
    connectionManager.send(String(user_from_id), 'friend:accepted', {
      request_id,
      friend: acceptorInfo.rows[0],
    });
  }
}

export async function handleFriendDecline(
  db: Client,
  userId: string,
  data: FriendResponsePayload
): Promise<void> {
  const { request_id } = data;

  const requestResult = await db.query(
    `DELETE FROM friend_requests
     WHERE id = $1 AND user_to_id = $2
     RETURNING user_from_id`,
    [request_id, userId]
  );

  if (requestResult.rows.length === 0) {
    connectionManager.send(userId, 'error', {
      error: 'Friend request not found or already processed',
    });
    return;
  }

  const { user_from_id } = requestResult.rows[0];

  connectionManager.send(userId, 'friend:declined', { request_id });

  if (connectionManager.isOnline(String(user_from_id))) {
    connectionManager.send(String(user_from_id), 'friend:declined', {
      request_id,
    });
  }
}

// ============================================
// Online Status Notifications to Friends
// ============================================

export async function notifyFriendsOnline(
  db: Client,
  userId: string
): Promise<void> {
  const result = await db.query(
    `SELECT CASE WHEN user1_id = $1 THEN user2_id ELSE user1_id END as friend_id
     FROM friends
     WHERE user1_id = $1 OR user2_id = $1`,
    [userId]
  );

  for (const row of result.rows) {
    const friendId = String(row.friend_id);
    if (connectionManager.isOnline(friendId)) {
      connectionManager.send(friendId, 'user:online', { userId });
    }
  }
}

export async function notifyFriendsOffline(
  db: Client,
  userId: string
): Promise<void> {
  const result = await db.query(
    `SELECT CASE WHEN user1_id = $1 THEN user2_id ELSE user1_id END as friend_id
     FROM friends
     WHERE user1_id = $1 OR user2_id = $1`,
    [userId]
  );

  for (const row of result.rows) {
    const friendId = String(row.friend_id);
    if (connectionManager.isOnline(friendId)) {
      connectionManager.send(friendId, 'user:offline', { userId });
    }
  }
}
