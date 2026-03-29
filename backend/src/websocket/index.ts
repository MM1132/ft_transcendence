import type { WebSocket } from '@fastify/websocket';
import websocket from '@fastify/websocket';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { Client } from 'pg';
import { encryptWithSalt } from '../utils/controllerUtils.ts';
import { connectionManager } from './connectionManager.ts';
import { handleChatHistory, handleChatSend } from './handlers/chat.handler.ts';
import {
  handleFriendAccept,
  handleFriendDecline,
  handleFriendRequest,
  notifyFriendsOffline,
  notifyFriendsOnline,
} from './handlers/friend.handler.ts';
import { handleGameInput } from './handlers/game.handler.ts';
import {
  handlePlayerDisconnect,
  handleRoomCreate,
  handleRoomInvite,
  handleRoomJoin,
  handleRoomKick,
  handleRoomLeave,
  handleRoomReady,
} from './handlers/room.handler.ts';
import type {
  AuthPayload,
  ChatHistoryPayload,
  ChatSendPayload,
  ClientEvent,
  FriendRequestPayload,
  FriendResponsePayload,
  GameInputPayload,
  RoomCreatePayload,
  RoomInvitePayload,
  RoomJoinPayload,
  RoomKickPayload,
  RoomLeavePayload,
  RoomReadyPayload,
  WSMessage,
} from './types.ts';

// ============================================
// WebSocket Setup
// ============================================

export async function setupWebSocket(
  server: FastifyInstance,
  db: Client
): Promise<void> {
  // Register WebSocket plugin
  await server.register(websocket);

  // WebSocket route
  server.get(
    '/ws',
    { websocket: true },
    (socket: WebSocket, _req: FastifyRequest) => {
      console.log('🔌 WS: New connection attempt');

      let authenticatedUserId: string | null = null;

      // ============================================
      // Message Handler
      // ============================================
      socket.on('message', async (rawMessage: Buffer) => {
        try {
          const message: WSMessage = JSON.parse(rawMessage.toString());
          const { event, data } = message;

          // ============================================
          // Auth (must be first message)
          // ============================================
          if (event === 'auth') {
            const authData = data as AuthPayload;
            const user = await authenticateToken(db, authData.token);

            if (!user) {
              socket.send(
                JSON.stringify({
                  event: 'auth:error',
                  data: { error: 'Invalid or expired token' },
                })
              );
              socket.close();
              return;
            }

            authenticatedUserId = user.id;
            const oldConn = connectionManager.addConnection(
              user.id,
              user.username,
              socket
            );

            // Clean up stale room membership from previous connection
            if (oldConn?.currentRoomId) {
              await handlePlayerDisconnect(
                db,
                authenticatedUserId,
                oldConn.currentRoomId
              );
            }

            /*If: backend restarted or room websocket was lost or DB still has old room row
              then on next auth: clean that ghost row now.” */
            const staleRoomResult = await db.query(
              'SELECT room_id FROM room_players WHERE user_id = $1',
              [user.id]
            );

            if (staleRoomResult.rows.length > 0 && !oldConn?.currentRoomId) {
              const staleRoomId = Number(staleRoomResult.rows[0].room_id);

              console.log(
                `🧹 Cleaning stale room membership for user ${user.id} in room ${staleRoomId}`
              );

              await handlePlayerDisconnect(db, user.id, staleRoomId);
            }

            // Update user online status in DB
            // await db.query('UPDATE users SET is_online = true WHERE id = $1', [
            //   user.id,
            // ]);

            socket.send(
              JSON.stringify({
                event: 'auth:success',
                data: { userId: user.id, username: user.username },
              })
            );

            // Send the room list after successful authentication
            const roomsResult = await db.query(
              `SELECT r.id, r.name, r.creator_id, r.max_players, r.status, r.is_permanent, r.buy_in_amount,
                        COUNT(rp.user_id) AS current_players
                  FROM rooms r
              LEFT JOIN room_players rp ON r.id = rp.room_id
              GROUP BY r.id, r.name, r.creator_id, r.max_players, r.status, r.is_permanent , r.buy_in_amount`
            );
            const rooms = roomsResult.rows.map((room) => ({
              id: room.id,
              name: room.name,
              creator_id: room.creator_id ? String(room.creator_id) : null,
              max_players: room.max_players,
              status: room.status,
              is_permanent: room.is_permanent,
              current_players: room.current_players,
              buy_in_amount: room.buy_in_amount,
            }));

            connectionManager.send(user.id, 'room:list', rooms);

            // Notify accepted friends that this user is online
            await notifyFriendsOnline(db, user.id);

            console.log(`✅ WS: User ${user.username} authenticated`);
            return;
          }

          // ============================================
          // All other events require auth
          // ============================================
          if (!authenticatedUserId) {
            socket.send(
              JSON.stringify({
                event: 'error',
                data: { error: 'Not authenticated. Send auth event first.' },
              })
            );
            return;
          }

          // ============================================
          // Route to handlers
          // ============================================
          await routeMessage(
            db,
            authenticatedUserId,
            event as ClientEvent,
            data
          );
        } catch (err) {
          console.error('❌ WS message error:', err);
          socket.send(
            JSON.stringify({
              event: 'error',
              data: { error: 'Invalid message format' },
            })
          );
        }
      });

      // ============================================
      // Disconnect Handler
      // ============================================
      socket.on('close', async () => {
        if (authenticatedUserId) {
          const connInfo =
            connectionManager.removeConnection(authenticatedUserId);

          // Update user online status
          await db.query('UPDATE users SET is_online = false WHERE id = $1', [
            authenticatedUserId,
          ]);

          // Notify accepted friends that this user went offline
          await notifyFriendsOffline(db, authenticatedUserId);

          // Handle room cleanup
          if (connInfo?.currentRoomId) {
            await handlePlayerDisconnect(
              db,
              authenticatedUserId,
              connInfo.currentRoomId
            );
          }

          console.log(
            `🔌 WS: User ${connInfo?.username || authenticatedUserId} disconnected`
          );
        }
      });

      socket.on('error', (err: Error) => {
        console.error('❌ WS socket error:', err);
      });
    }
  );

  console.log('✅ WebSocket server registered at /ws');
}

// ============================================
// Token Authentication
// ============================================

async function authenticateToken(
  db: Client,
  token: string
): Promise<{ id: string; username: string } | null> {
  try {
    // Encrypt the plain token to match DB storage (encrypted with scrypt)
    const encryptedToken = encryptWithSalt(token);

    const result = await db.query(
      `SELECT u.id, u.username
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.token = $1 AND s.valid_until > NOW()`,
      [encryptedToken]
    );

    if (result.rows.length === 0) {
      return null;
    }

    // Extend session (sliding expiration)
    await db.query(
      `UPDATE sessions SET valid_until = NOW() + INTERVAL '10 minutes'
       WHERE token = $1`,
      [encryptedToken]
    );

    return result.rows[0];
  } catch (err) {
    console.error('authenticateToken error:', err);
    return null;
  }
}

// ============================================
// Message Router
// ============================================

async function routeMessage(
  db: Client,
  userId: string,
  event: ClientEvent,
  data: unknown
): Promise<void> {
  switch (event) {
    // Room events
    case 'room:create':
      await handleRoomCreate(db, userId, data as RoomCreatePayload);
      break;
    case 'room:join':
      await handleRoomJoin(db, userId, data as RoomJoinPayload);
      break;
    case 'room:leave':
      await handleRoomLeave(db, userId, data as RoomLeavePayload);
      break;
    case 'room:ready':
      await handleRoomReady(db, userId, data as RoomReadyPayload);
      break;
    case 'room:kick':
      await handleRoomKick(db, userId, data as RoomKickPayload);
      break;
    case 'room:invite':
      await handleRoomInvite(db, userId, data as RoomInvitePayload);
      break;

    // Chat events
    case 'chat:send':
      await handleChatSend(db, userId, data as ChatSendPayload);
      break;
    case 'chat:history':
      await handleChatHistory(db, userId, data as ChatHistoryPayload);
      break;

    // Game events
    case 'game:input':
      await handleGameInput(db, userId, data as GameInputPayload);
      break;

    // Friend events (placeholder)
    case 'friend:request':
      await handleFriendRequest(db, userId, data as FriendRequestPayload);
      break;
    case 'friend:accept':
      await handleFriendAccept(db, userId, data as FriendResponsePayload);
      break;
    case 'friend:decline':
      await handleFriendDecline(db, userId, data as FriendResponsePayload);
      break;

    default:
      connectionManager.send(userId, 'error', {
        error: `Unknown event: ${event}`,
      });
  }
}
