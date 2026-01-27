import type { DateTime } from 'luxon';
import type { Client, QueryResultRow } from 'pg';

export interface RepositorySession extends QueryResultRow {
  token: string;
  user_id: string;
  valid_until: DateTime;
}

export const sessionRepository = {
  createSession: async (db: Client, token: string, userId: string) => {},

  getSessionByToken: async (
    db: Client,
    token: string
  ): Promise<RepositorySession | null> => {
    const queryResult = await db.query<RepositorySession>(
      `
      SELECT token, user_id, valid_until FROM sessions WHERE token = $1;`,
      [token]
    );

    return queryResult.rows[0] || null;
  },

  deleteSessionsByUserId: async (
    db: Client,
    userId: string
  ): Promise<number | null> => {
    const queryResult = await db.query(
      `DELETE FROM sessions WHERE user_id = $1`,
      [userId]
    );

    return queryResult.rowCount;
  },

  createNewSession: async (
    db: Client,
    sessionId: string,
    userId: string,
    valid_until: string
  ) => {
    return db.query(
      `
      INSERT INTO sessions
      (token, user_id, valid_until)
      VALUES ($1, $2, $3)
      `,
      [sessionId, userId, valid_until]
    );
  },

  updateSessionValidUntil: async (
    db: Client,
    userId: string,
    valid_until: string
  ) => {
    return db.query(
      `
      UPDATE sessions
      SET valid_until = $1
      WHERE user_id = $2
      `,
      [valid_until, userId]
    );
  },
};
