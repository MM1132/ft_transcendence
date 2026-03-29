import type { Client } from 'pg';
import { connectionManager } from '../connectionManager.ts';
import type {
  PlayerJoinedPayload,
  PlayerLeftPayload,
  PlayerReadyPayload,
  RoomCreatePayload,
  RoomInvitePayload,
  RoomJoinedPayload,
  RoomJoinPayload,
  RoomKickPayload,
  RoomLeavePayload,
  RoomReadyPayload,
} from '../types.ts';
import { startGameLoop } from './game.handler.ts';

// ============================================
// Room Handlers
// ============================================

// ============================================
// Room Create
// ============================================

export async function handleRoomCreate(
  db: Client,
  userId: string,
  data: RoomCreatePayload
): Promise<void> {
  const {
    name,
    max_players,
    buy_in_amount = 0,
    time_limit_seconds,
    win_condition = 'SCORE',
  } = data;

  try {
    // 1. Validate inputs
    if (!name || name.trim().length === 0) {
      connectionManager.send(userId, 'room:error', {
        error: 'Room name is required',
      });
      return;
    }

    if (name.trim().length > 50) {
      connectionManager.send(userId, 'room:error', {
        error: 'Room name too long (max 50 chars)',
      });
      return;
    }

    if (max_players < 2 || max_players > 4) {
      connectionManager.send(userId, 'room:error', {
        error: 'Max players must be 2-4',
      });
      return;
    }

    // 2. Check if user is already in a room (both in-memory and DB)
    const conn = connectionManager.getConnection(userId);
    if (conn?.currentRoomId) {
      connectionManager.send(userId, 'room:error', {
        error: 'Already in a room. Leave first.',
      });
      return;
    }
    const existingRoomPlayer = await db.query(
      'SELECT room_id FROM room_players WHERE user_id = $1',
      [userId]
    );
    if (existingRoomPlayer.rows.length > 0) {
      connectionManager.send(userId, 'room:error', {
        error: 'Already in a room. Leave first.',
      });
      return;
    }

    // 3. Get creator info + check balance (before any DB writes)
    const userResult = await db.query(
      'SELECT id, username, avatar_filename AS avatar_url, balance FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      connectionManager.send(userId, 'room:error', { error: 'User not found' });
      return;
    }

    if (buy_in_amount > 0 && userResult.rows[0].balance < buy_in_amount) {
      connectionManager.send(userId, 'room:error', {
        error: 'Not enough coins for buy-in',
      });
      return;
    }

    // 5. Create room in DB
    const roomResult = await db.query(
      `INSERT INTO rooms (name, creator_id, max_players, buy_in_amount, time_limit_seconds, win_condition, status, is_permanent)
       VALUES ($1, $2, $3, $4, $5, $6, 'WAITING', false)
       RETURNING id, name, creator_id, max_players, status, is_permanent`,
      [
        name.trim(),
        userId,
        max_players,
        buy_in_amount,
        time_limit_seconds || null,
        win_condition,
      ]
    );

    const room = roomResult.rows[0];

    // 6. Deduct buy-in from creator balance
    if (buy_in_amount > 0) {
      await db.query('UPDATE users SET balance = balance - $1 WHERE id = $2', [
        buy_in_amount,
        userId,
      ]);
      await db.query(
        `INSERT INTO transactions (user_id, amount, reason) VALUES ($1, $2, $3)`,
        [userId, -buy_in_amount, `Buy-in for room "${name.trim()}"`]
      );
    }

    // 7. Auto-join the creator to slot 1
    await db.query(
      `INSERT INTO room_players (room_id, user_id, player_slot, is_ready, joined_at)
       VALUES ($1, $2, 1, false, NOW())`,
      [room.id, userId]
    );

    // 7. Join WS room
    const roomName = `room_${room.id}`;
    connectionManager.joinRoom(userId, roomName);

    // 8. Send confirmation
    connectionManager.send(userId, 'room:created', {
      room: {
        id: room.id,
        name: room.name,
        creator_id: String(room.creator_id),
        max_players: room.max_players,
        status: room.status,
        is_permanent: room.is_permanent,
        current_players: 1,
        buy_in_amount: room.buy_in_amount,
      },
      players: [
        {
          id: userResult.rows[0].id,
          username: userResult.rows[0].username,
          avatar_url: userResult.rows[0].avatar_url,
          slot: 1,
          is_ready: false,
        },
      ],
      your_slot: 1,
    });

    console.log(`🎮 Room ${room.id} "${room.name}" created by user ${userId}`);
    await broadcastRoomList(db);
  } catch (err) {
    console.error('❌ handleRoomCreate error:', err);
    connectionManager.send(userId, 'room:error', {
      error: 'Failed to create room',
    });
  }
}

// ============================================
// Room Join
// ============================================

export async function handleRoomJoin(
  db: Client,
  userId: string,
  data: RoomJoinPayload
): Promise<void> {
  const { room_id } = data;
  const roomName = `room_${room_id}`;

  try {
    // 1. Check if user is already in another room (both in-memory and DB)
    const conn = connectionManager.getConnection(userId);
    if (conn?.currentRoomId && conn.currentRoomId !== room_id) {
      connectionManager.send(userId, 'room:error', {
        error: 'Already in another room. Leave first.',
      });
      return;
    }
    const existingOtherRoom = await db.query(
      'SELECT room_id FROM room_players WHERE user_id = $1 AND room_id != $2',
      [userId, room_id]
    );
    if (existingOtherRoom.rows.length > 0) {
      connectionManager.send(userId, 'room:error', {
        error: 'Already in another room. Leave first.',
      });
      return;
    }

    // 2. Get room from DB
    const roomResult = await db.query('SELECT * FROM rooms WHERE id = $1', [
      room_id,
    ]);

    if (roomResult.rows.length === 0) {
      connectionManager.send(userId, 'room:error', { error: 'Room not found' });
      return;
    }

    const room = roomResult.rows[0];

    // 3. Check room status
    if (room.status === 'IN_GAME') {
      connectionManager.send(userId, 'room:error', {
        error: 'Room is currently in a game',
      });
      return;
    }

    // 4. Check player count
    const countResult = await db.query(
      'SELECT COUNT(*) as count FROM room_players WHERE room_id = $1',
      [room_id]
    );
    const playerCount = parseInt(countResult.rows[0].count, 10);

    if (playerCount >= room.max_players) {
      connectionManager.send(userId, 'room:error', { error: 'Room is full' });
      return;
    }

    // 5. Check if already in this room
    const existingResult = await db.query(
      'SELECT id FROM room_players WHERE room_id = $1 AND user_id = $2',
      [room_id, userId]
    );

    if (existingResult.rows.length > 0) {
      connectionManager.send(userId, 'room:error', {
        error: 'Already in this room',
      });
      return;
    }

    // 5b. Check buy-in balance
    if (room.buy_in_amount > 0) {
      const balanceResult = await db.query(
        'SELECT balance FROM users WHERE id = $1',
        [userId]
      );
      if (balanceResult.rows[0].balance < room.buy_in_amount) {
        connectionManager.send(userId, 'room:error', {
          error: 'Not enough coins for buy-in',
        });
        return;
      }
    }

    // 6. Find next available slot
    const slotResult = await db.query(
      `SELECT generate_series(1, $1) as slot
       EXCEPT
       SELECT player_slot FROM room_players WHERE room_id = $2
       ORDER BY slot LIMIT 1`,
      [room.max_players, room_id]
    );
    const nextSlot = slotResult.rows[0]?.slot || 1;

    // 7. Deduct buy-in from joiner balance
    if (room.buy_in_amount > 0) {
      await db.query('UPDATE users SET balance = balance - $1 WHERE id = $2', [
        room.buy_in_amount,
        userId,
      ]);
      await db.query(
        `INSERT INTO transactions (user_id, amount, reason) VALUES ($1, $2, $3)`,
        [userId, -room.buy_in_amount, `Buy-in for room "${room.name}"`]
      );
    }

    // 8. Insert into room_players
    await db.query(
      `INSERT INTO room_players (room_id, user_id, player_slot, is_ready, joined_at)
       VALUES ($1, $2, $3, false, NOW())`,
      [room_id, userId, nextSlot]
    );

    // 9. Get all players in room
    const playersResult = await db.query(
      `SELECT u.id, u.username, u.avatar_filename AS avatar_url, rp.player_slot as slot, rp.is_ready
       FROM room_players rp
       JOIN users u ON rp.user_id = u.id
       WHERE rp.room_id = $1
       ORDER BY rp.player_slot`,
      [room_id]
    );

    // 10. Join WS room
    connectionManager.joinRoom(userId, roomName);

    // 11. Send confirmation to user
    const joinedPayload: RoomJoinedPayload = {
      room: {
        id: room.id,
        name: room.name,
        creator_id: room.creator_id ? String(room.creator_id) : null,
        max_players: room.max_players,
        status: room.status,
        is_permanent: room.is_permanent,
        current_players: playerCount,
        // buy_in_amount: room.buy_in_amount
      },
      players: playersResult.rows,
      your_slot: nextSlot,
    };
    connectionManager.send(userId, 'room:joined', joinedPayload);

    // 12. Broadcast to others in room
    const userResult = await db.query(
      'SELECT id, username, avatar_filename AS avatar_url FROM users WHERE id = $1',
      [userId]
    );

    const playerJoinedPayload: PlayerJoinedPayload = {
      user: userResult.rows[0],
      slot: nextSlot,
    };
    connectionManager.broadcast(
      roomName,
      'room:player_joined',
      playerJoinedPayload,
      userId
    );

    console.log(`🎮 Room ${room_id}: User ${userId} joined slot ${nextSlot}`);
    await broadcastRoomList(db);
  } catch (err) {
    console.error('❌ handleRoomJoin error:', err);
    connectionManager.send(userId, 'room:error', {
      error: 'Failed to join room',
    });
  }
}

export async function handleRoomLeave(
  db: Client,
  userId: string,
  data: RoomLeavePayload
): Promise<void> {
  const { room_id } = data;
  const roomName = `room_${room_id}`;

  try {
    // 1. Get player info before removing
    const playerResult = await db.query(
      'SELECT player_slot FROM room_players WHERE room_id = $1 AND user_id = $2',
      [room_id, userId]
    );

    if (playerResult.rows.length === 0) {
      connectionManager.send(userId, 'room:error', {
        error: 'Not in this room',
      });
      return;
    }

    const slot = playerResult.rows[0].player_slot;

    // 2. Remove from DB
    await db.query(
      'DELETE FROM room_players WHERE room_id = $1 AND user_id = $2',
      [room_id, userId]
    );

    // 3. Leave WS room
    connectionManager.leaveRoom(userId, roomName);

    // 4. Send confirmation
    connectionManager.send(userId, 'room:left', { room_id });

    // 5. Broadcast to others
    const leftPayload: PlayerLeftPayload = {
      user_id: userId,
      slot,
    };
    connectionManager.broadcast(roomName, 'room:player_left', leftPayload);
    await broadcastRoomList(db);

    console.log(`🎮 Room ${room_id}: User ${userId} left slot ${slot}`);
  } catch (err) {
    console.error('❌ handleRoomLeave error:', err);
    connectionManager.send(userId, 'room:error', {
      error: 'Failed to leave room',
    });
  }
}

export async function handleRoomReady(
  db: Client,
  userId: string,
  data: RoomReadyPayload
): Promise<void> {
  const { room_id } = data;
  const roomName = `room_${room_id}`;

  try {
    // 1. Toggle ready status
    await db.query(
      `UPDATE room_players SET is_ready = NOT is_ready
       WHERE room_id = $1 AND user_id = $2`,
      [room_id, userId]
    );

    // 2. Get new status
    const statusResult = await db.query(
      'SELECT is_ready FROM room_players WHERE room_id = $1 AND user_id = $2',
      [room_id, userId]
    );

    if (statusResult.rows.length === 0) {
      connectionManager.send(userId, 'room:error', {
        error: 'Not in this room',
      });
      return;
    }

    const isReady = statusResult.rows[0].is_ready;

    // 3. Broadcast ready status to all in room (including sender)
    const readyPayload: PlayerReadyPayload = {
      user_id: userId,
      is_ready: isReady,
    };
    connectionManager.broadcast(roomName, 'room:player_ready', readyPayload);

    console.log(`🎮 Room ${room_id}: User ${userId} is_ready=${isReady}`);

    // 4. Check if all players ready -> start game
    const readyCheck = await db.query(
      `SELECT
         COUNT(*) as total,
         COUNT(*) FILTER (WHERE is_ready = true) as ready_count
       FROM room_players
       WHERE room_id = $1`,
      [room_id]
    );

    const { total, ready_count } = readyCheck.rows[0];

    const roomResult = await db.query(
      'SELECT max_players FROM rooms WHERE id = $1',
      [room_id]
    );
    const maxPlayers = roomResult.rows[0].max_players;

    // All slots filled AND all ready -> START GAME
    if (
      parseInt(total, 10) === maxPlayers &&
      parseInt(ready_count, 10) === maxPlayers
    ) {
      await startGame(db, room_id, roomName);
    }
  } catch (err) {
    console.error('❌ handleRoomReady error:', err);
    connectionManager.send(userId, 'room:error', {
      error: 'Failed to update ready status',
    });
  }
}

// ============================================
// Game Start Helper
// ============================================

async function startGame(
  db: Client,
  roomId: number,
  _roomName: string
): Promise<void> {
  try {
    // 1. Update room status
    await db.query(`UPDATE rooms SET status = 'IN_GAME' WHERE id = $1`, [
      roomId,
    ]);

    // 2. Create game session
    const gameResult = await db.query(
      `INSERT INTO games (room_id, status, started_at)
       VALUES ($1, 'ACTIVE', NOW())
       RETURNING id`,
      [roomId]
    );
    const gameId = gameResult.rows[0].id;

    // 3. Get players
    const playersResult = await db.query(
      `SELECT user_id, player_slot FROM room_players WHERE room_id = $1`,
      [roomId]
    );

    // 4. Start the Snake game loop
    const players = playersResult.rows.map(
      (row: { user_id: string; player_slot: number }) => ({
        oderId: row.user_id,
        slot: row.player_slot,
      })
    );

    startGameLoop(db, Number(roomId), Number(gameId), players);
  } catch (err) {
    console.error('❌ startGame error:', err);
  }
}

// ============================================
// Cleanup on Disconnect
// ============================================

export async function handlePlayerDisconnect(
  db: Client,
  userId: string,
  currentRoomId: number | null
): Promise<void> {
  if (!currentRoomId) return;

  try {
    // Get player slot before removing
    const playerResult = await db.query(
      'SELECT player_slot FROM room_players WHERE room_id = $1 AND user_id = $2',
      [currentRoomId, userId]
    );

    if (playerResult.rows.length === 0) return;

    const slot = playerResult.rows[0].player_slot;

    // Remove from room_players
    await db.query(
      'DELETE FROM room_players WHERE room_id = $1 AND user_id = $2',
      [currentRoomId, userId]
    );

    // Broadcast to room
    const roomName = `room_${currentRoomId}`;
    const leftPayload: PlayerLeftPayload = {
      user_id: userId,
      slot,
    };
    connectionManager.broadcast(roomName, 'room:player_left', leftPayload);
    await broadcastRoomList(db);

    console.log(
      `🎮 Room ${currentRoomId}: User ${userId} disconnected from slot ${slot}`
    );

    // TODO: Handle if game was in progress
  } catch (err) {
    console.error('❌ handlePlayerDisconnect error:', err);
  }
}

// ============================================
// Room Kick (creator only)
// ============================================

export async function handleRoomKick(
  db: Client,
  userId: string,
  data: RoomKickPayload
): Promise<void> {
  const { room_id, target_user_id } = data;
  const roomName = `room_${room_id}`;

  try {
    // Verify caller is the room creator
    const roomResult = await db.query(
      'SELECT creator_id FROM rooms WHERE id = $1',
      [room_id]
    );
    if (roomResult.rows.length === 0) {
      connectionManager.send(userId, 'room:error', { error: 'Room not found' });
      return;
    }
    if (String(roomResult.rows[0].creator_id) !== userId) {
      connectionManager.send(userId, 'room:error', {
        error: 'Only the room creator can kick players',
      });
      return;
    }
    if (target_user_id === userId) {
      connectionManager.send(userId, 'room:error', {
        error: 'Cannot kick yourself',
      });
      return;
    }

    // Get target slot
    const playerResult = await db.query(
      'SELECT player_slot FROM room_players WHERE room_id = $1 AND user_id = $2',
      [room_id, target_user_id]
    );
    if (playerResult.rows.length === 0) {
      connectionManager.send(userId, 'room:error', {
        error: 'Player not in room',
      });
      return;
    }
    const slot = playerResult.rows[0].player_slot;

    // Remove from DB
    await db.query(
      'DELETE FROM room_players WHERE room_id = $1 AND user_id = $2',
      [room_id, target_user_id]
    );

    // Remove from WS room
    connectionManager.leaveRoom(target_user_id, roomName);

    // Notify kicked user
    connectionManager.send(target_user_id, 'room:kicked', {
      room_id,
      reason: 'Kicked by room creator',
    });

    // Broadcast player_left to room
    connectionManager.broadcast(roomName, 'room:player_left', {
      user_id: target_user_id,
      slot,
    });

    console.log(
      `🎮 Room ${room_id}: User ${target_user_id} kicked by creator ${userId}`
    );
  } catch (err) {
    console.error('❌ handleRoomKick error:', err);
    connectionManager.send(userId, 'room:error', {
      error: 'Failed to kick player',
    });
  }
}

// ============================================
// Room Invite (send invite to online friend)
// ============================================

export async function handleRoomInvite(
  db: Client,
  userId: string,
  data: RoomInvitePayload
): Promise<void> {
  const { room_id, target_user_id } = data;

  try {
    // Verify caller is in the room
    const memberCheck = await db.query(
      'SELECT 1 FROM room_players WHERE room_id = $1 AND user_id = $2',
      [room_id, userId]
    );
    if (memberCheck.rows.length === 0) {
      connectionManager.send(userId, 'room:error', {
        error: 'You are not in this room',
      });
      return;
    }

    // Get room info
    const roomResult = await db.query(
      'SELECT id, name, max_players, status FROM rooms WHERE id = $1',
      [room_id]
    );
    if (roomResult.rows.length === 0) {
      connectionManager.send(userId, 'room:error', { error: 'Room not found' });
      return;
    }
    const room = roomResult.rows[0];

    if (room.status !== 'WAITING') {
      connectionManager.send(userId, 'room:error', {
        error: 'Room is already in a game',
      });
      return;
    }

    // Get inviter info
    const inviterResult = await db.query(
      'SELECT id, username, avatar_filename AS avatar_url FROM users WHERE id = $1',
      [userId]
    );

    // Send invite to target if online
    if (connectionManager.isOnline(target_user_id)) {
      connectionManager.send(target_user_id, 'room:invite_received', {
        room_id,
        room_name: room.name,
        from: inviterResult.rows[0],
      });
    }

    console.log(`📨 Room ${room_id}: User ${userId} invited ${target_user_id}`);
  } catch (err) {
    console.error('❌ handleRoomInvite error:', err);
    connectionManager.send(userId, 'room:error', {
      error: 'Failed to send invite',
    });
  }
}

// ------------- frontend add it -------------------
async function broadcastRoomList(db: Client) {
  const roomsResult = await db.query(
    `SELECT r.id, r.name, r.creator_id, r.max_players, r.status, r.is_permanent, r.buy_in_amount,
            COUNT(rp.user_id)::int AS current_players
     FROM rooms r
     LEFT JOIN room_players rp ON r.id = rp.room_id
     GROUP BY r.id, r.name, r.creator_id, r.max_players, r.status, r.is_permanent, r.buy_in_amount`
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

  connectionManager.broadcastAll('room:list', rooms);
}
