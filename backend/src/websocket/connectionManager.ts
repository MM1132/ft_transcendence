import type { WebSocket } from '@fastify/websocket';
import type { AuthenticatedSocket, ServerEvent, WSMessage } from './types.ts';

// ============================================
// Connection Manager
// ============================================
// Tracks active WebSocket connections and room memberships
// This is the ONLY in-memory state (besides active game states)

class ConnectionManager {
  // userId -> socket info
  private connections: Map<string, AuthenticatedSocket> = new Map();

  // roomName -> Set of userIds (for broadcasts)
  // Naming: "room_1", "room_2", "global_chat"
  private rooms: Map<string, Set<string>> = new Map();

  // ============================================
  // Connection Management
  // ============================================

  addConnection(
    userId: string,
    username: string,
    socket: WebSocket
  ): { currentRoomId: number | null } | null {
    // Clean up existing connection for this user (e.g. duplicate tab)
    const existing = this.connections.get(userId);
    let oldRoomId: number | null = null;
    if (existing) {
      oldRoomId = existing.currentRoomId;
      // Close the old socket if still open
      if (existing.socket.readyState === 1) {
        existing.socket.close();
      }
      // Remove from all rooms
      for (const [_roomName, members] of this.rooms) {
        members.delete(userId);
      }
      console.log(
        `🔌 WS: User ${username} (${userId}) replaced existing connection`
      );
    }

    this.connections.set(userId, {
      socket,
      userId,
      username,
      currentRoomId: null,
    });

    // Auto-join global chat
    this.joinRoom(userId, 'global_chat');

    console.log(
      `🔌 WS: User ${username} (${userId}) connected. Total: ${this.connections.size}`
    );

    return oldRoomId ? { currentRoomId: oldRoomId } : null;
  }

  removeConnection(
    userId: string
  ): { username: string; currentRoomId: number | null } | null {
    const conn = this.connections.get(userId);
    if (!conn) return null;

    // Leave all rooms
    for (const [roomName, members] of this.rooms) {
      if (members.has(userId)) {
        members.delete(userId);
        console.log(`🚪 WS: User ${conn.username} left ${roomName}`);
      }
    }

    this.connections.delete(userId);
    console.log(
      `🔌 WS: User ${conn.username} (${userId}) disconnected. Total: ${this.connections.size}`
    );

    return { username: conn.username, currentRoomId: conn.currentRoomId };
  }

  getConnection(userId: string): AuthenticatedSocket | undefined {
    return this.connections.get(userId);
  }

  isOnline(userId: string): boolean {
    return this.connections.has(userId);
  }

  getOnlineUserIds(): string[] {
    return Array.from(this.connections.keys());
  }

  // ============================================
  // Room Management (In-Memory for WS Routing)
  // ============================================

  joinRoom(userId: string, roomName: string): void {
    if (!this.rooms.has(roomName)) {
      this.rooms.set(roomName, new Set());
    }
    this.rooms.get(roomName)?.add(userId);

    // Track current game room (not global_chat)
    if (roomName.startsWith('room_')) {
      const conn = this.connections.get(userId);
      if (conn) {
        conn.currentRoomId = parseInt(roomName.replace('room_', ''), 10);
      }
    }

    const conn = this.connections.get(userId);
    console.log(`🚪 WS: User ${conn?.username || userId} joined ${roomName}`);
  }

  leaveRoom(userId: string, roomName: string): void {
    this.rooms.get(roomName)?.delete(userId);

    // Clear current room if leaving game room
    if (roomName.startsWith('room_')) {
      const conn = this.connections.get(userId);
      if (conn) {
        conn.currentRoomId = null;
      }
    }

    const conn = this.connections.get(userId);
    console.log(`🚪 WS: User ${conn?.username || userId} left ${roomName}`);
  }

  getRoomMembers(roomName: string): string[] {
    return Array.from(this.rooms.get(roomName) || []);
  }

  isInRoom(userId: string, roomName: string): boolean {
    return this.rooms.get(roomName)?.has(userId) || false;
  }

  // ============================================
  // Message Sending
  // ============================================

  send<T>(userId: string, event: ServerEvent, data: T): void {
    const conn = this.connections.get(userId);
    if (conn && conn.socket.readyState === 1) {
      const message: WSMessage<T> = { event, data };
      conn.socket.send(JSON.stringify(message));
    }
  }

  broadcast<T>(
    roomName: string,
    event: ServerEvent,
    data: T,
    excludeUserId?: string
  ): void {
    const members = this.rooms.get(roomName);
    if (!members) return;

    const message = JSON.stringify({ event, data });

    for (const userId of members) {
      if (userId !== excludeUserId) {
        const conn = this.connections.get(userId);
        if (conn && conn.socket.readyState === 1) {
          conn.socket.send(message);
        }
      }
    }
  }

  broadcastAll<T>(event: ServerEvent, data: T, excludeUserId?: string): void {
    const message = JSON.stringify({ event, data });

    for (const [userId, conn] of this.connections) {
      if (userId !== excludeUserId && conn.socket.readyState === 1) {
        conn.socket.send(message);
      }
    }
  }
}

// Singleton instance
export const connectionManager: ConnectionManager = new ConnectionManager();
