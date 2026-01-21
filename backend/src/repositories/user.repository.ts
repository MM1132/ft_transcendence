import type { Client } from 'pg';

export interface InsertUserToDatabaseValues {
  username: string;
  password: string;
}

export const userRespository = {
  getAllUsers: async (db: Client) => {
    return db.query(`SELECT * FROM users`);
  },
  insertNewUserToDatabase: async (
    db: Client,
    values: InsertUserToDatabaseValues
  ) => {
    await db.query(
      `
      INSERT INTO users
      (username, password)
      VALUES ($1, $2);`,
      [values.username, values.password]
    );
  },
  getUserByUsername: async (db: Client, username: string) => {
    return db.query(
      `
      SELECT * FROM users
      WHERE username = $1;`,
      [username]
    );
  },
  getUserById: async (db: Client, id: number) => {
    return db.query(
      `
      SELECT * FROM users
      WHERE id = $1;`,
      [id]
    );
  },
};
