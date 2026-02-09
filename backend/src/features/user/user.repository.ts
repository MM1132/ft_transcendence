import type { DateTime } from 'luxon';
import type { Client, QueryResultRow } from 'pg';

export interface RepositoryUser extends QueryResultRow {
  id: string;
  username: string;
  password: string;
  created_at: DateTime;
  avatar_filename: string;
}

export const userRespository = {
  getAllUsers: async (db: Client): Promise<RepositoryUser[]> => {
    const allUsers = await db.query<RepositoryUser>(
      `SELECT id, username, password, created_at, avatar_filename FROM users`
    );
    return allUsers.rows;
  },

  getUserById: async (
    db: Client,
    id: string
  ): Promise<RepositoryUser | null> => {
    const { rows } = await db.query<RepositoryUser>(
      `SELECT id, username, password, created_at, avatar_filename FROM users WHERE id = $1;`,
      [id]
    );
    return rows[0] || null;
  },

  insertNewUserToDatabase: async (
    db: Client,
    username: string,
    encryptedPassword: string
  ) => {
    return db.query(
      `
      INSERT INTO users
      (username, password)
      VALUES ($1, $2);`,
      [username, encryptedPassword]
    );
  },

  getUserByUsername: async (
    db: Client,
    username: string
  ): Promise<RepositoryUser | null> => {
    const { rows } = await db.query<RepositoryUser>(
      `SELECT id, username, password, created_at, avatar_filename FROM users WHERE username = $1;`,
      [username]
    );
    return rows[0] || null;
  },

  getUserByUsernameAndPassword: async (
    db: Client,
    username: string,
    passwordHash: string
  ): Promise<RepositoryUser | null> => {
    const { rows } = await db.query<RepositoryUser>(
      `
      SELECT id, username, password, created_at, avatar_filename FROM users
      WHERE username = $1 AND password = $2;`,
      [username, passwordHash]
    );
    return rows[0] || null;
  },

  setUserAvatarFilename: async (
    db: Client,
    userId: string,
    avatarFilename: string
  ) => {
    await db.query(
      `
      UPDATE users
      SET avatar_filename = $1
      WHERE id = $2`,
      [avatarFilename, userId]
    );
  },

  setAvatarToNull: async (db: Client, userId: string) => {
    await db.query(
      `
      UPDATE users
      SET avatar_filename = NULL
      WHERE id = $1
    `,
      [userId]
    );
  },
};
