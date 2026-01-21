import type { Client } from 'pg';

export interface InsertUserToDatabaseValues {
  username: string;
  password: string;
}

export const userRespository = {
  insertNewUserToDatabase: async (
    db: Client,
    values: InsertUserToDatabaseValues
  ) => {
    await db.query(
      `
		INSERT INTO users
		(username, password)
		VALUES ($1, $2)`,
      [values.username, values.password]
    );
  },
};
