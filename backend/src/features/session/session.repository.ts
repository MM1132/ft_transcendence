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
};
