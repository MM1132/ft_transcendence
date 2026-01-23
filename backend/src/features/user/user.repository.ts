import type { Client } from 'pg';

export interface RepositoryUser {
  id: string;
  username: string;
  password: string;
  created_at: string;
}

export const userRespository = {
  getAllUsers: async (db: Client): Promise<RepositoryUser[]> => {
    const allUsers = await db.query(`SELECT * FROM users`);
    return allUsers.rows;
  },

  getUserById: async (
    db: Client,
    id: number
  ): Promise<RepositoryUser | null> => {
    const { rows } = await db.query(`SELECT * FROM users WHERE id = $1;`, [id]);
    return rows[0] || null;
  },

  insertNewUserToDatabase: async (
    db: Client,
    username: string,
    encryptedPassword: string
  ) => {
    const queryResult = db.query(
      `
      INSERT INTO users
      (username, password)
      VALUES ($1, $2);`,
      [username, encryptedPassword]
    );

    return queryResult;
  },

  getUserByUsername: async (
    db: Client,
    username: string
  ): Promise<RepositoryUser | null> => {
    const { rows } = await db.query(
      `SELECT * FROM users WHERE username = $1;`,
      [username]
    );
    return rows[0] || null;
  },

  getUserByUsernameAndPassword: async (
    db: Client,
    username: string,
    passwordHash: string
  ): Promise<RepositoryUser | null> => {
    const { rows } = await db.query(
      `
      SELECT * FROM users
      WHERE username = $1 AND password = $2;`,
      [username, passwordHash]
    );
    return rows[0] || null;
  },
};
