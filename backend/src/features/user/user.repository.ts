import type { Client } from 'pg';
import type {
  RepositoryUserDetails,
  RepositoryUserSummary,
} from './user.types.ts';

export interface RepositoryNewUserDetails {
  username: string;
  encryptedPassword: string;
  email: string;
}

export const userRespository = {
  getAllUsers: async (db: Client): Promise<RepositoryUserSummary[]> => {
    const allUsers = await db.query<RepositoryUserSummary>(
      `SELECT
        u.id,
        u.username, 
        u.last_action_at, 
        u.avatar_filename,

        EXISTS (
          SELECT 1 FROM sessions s
          WHERE s.user_id = u.id
          AND s.valid_until > NOW()
        ) AS online
      FROM users u`
    );
    return allUsers.rows;
  },

  getUserById: async (
    db: Client,
    id: string
  ): Promise<RepositoryUserDetails | null> => {
    const { rows } = await db.query<RepositoryUserDetails>(
      `SELECT
        u.*,

        EXISTS (
          SELECT 1 FROM sessions s
          WHERE s.user_id = u.id
          AND s.valid_until > NOW()
        ) AS online
      FROM users u
      WHERE id = $1;`,
      [id]
    );
    return rows[0] || null;
  },

  insertNewUserToDatabase: async (
    db: Client,
    details: RepositoryNewUserDetails
  ): Promise<RepositoryUserDetails | null> => {
    const { rows } = await db.query<RepositoryUserDetails>(
      `
      INSERT INTO users
      (username, password, email)
      VALUES ($1, $2, $3)
      RETURNING *;`,
      [details.username, details.encryptedPassword, details.email]
    );
    return rows[0] || null;
  },

  getUserByUsernameAndPassword: async (
    db: Client,
    username: string,
    passwordHash: string
  ): Promise<RepositoryUserDetails | null> => {
    const { rows } = await db.query<RepositoryUserDetails>(
      `
      SELECT
        u.*,

        EXISTS (
          SELECT 1 FROM sessions s
          WHERE s.user_id = u.id
          AND s.valid_until > NOW()
        ) AS online
      FROM users u
      WHERE username = $1 AND password = $2;`,
      [username, passwordHash]
    );
    return rows[0] || null;
  },

  setUserAvatarFilename: async (
    db: Client,
    userId: string,
    avatarFilename: string | null
  ) => {
    await db.query(
      `
      UPDATE users
      SET avatar_filename = $1
      WHERE id = $2`,
      [avatarFilename, userId]
    );
  },

  getOnlineUsers: async (db: Client): Promise<RepositoryUserSummary[]> => {
    const { rows } = await db.query<RepositoryUserSummary>(`
      SELECT
        u.id,
        u.username,
        u.last_action_at,
        u.avatar_filename,
        true AS online

      FROM sessions as s
      
      JOIN users as u
      ON s.user_id = u.id
      
      WHERE s.valid_until > now()
    `);

    return rows;
  },

  updateUserLastAction: async (db: Client, userId: string) => {
    await db.query(
      `
      UPDATE users
      SET last_action_at = now()
      WHERE id = $1
    `,
      [userId]
    );
  },
};
