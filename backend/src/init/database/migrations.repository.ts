import type { DateTime } from 'luxon';
import type { Client, QueryResultRow } from 'pg';

export interface RepositoryMigration extends QueryResultRow {
  id: string;
  filename: string;
  applied_at: DateTime;
}

export const migrationsRepository = {
  getLatestMigration: async (
    client: Client
  ): Promise<RepositoryMigration | null> => {
    const { rows } = await client.query(`
      SELECT * FROM migrations ORDER BY applied_at DESC, filename DESC LIMIT 1;
    `);
    return rows[0] || null;
  },

  createNewMigration: async (
    client: Client,
    filename: string
  ): Promise<RepositoryMigration | null> => {
    const { rows } = await client.query(
      `
      INSERT INTO migrations
      (filename)
      VALUES ($1)
      RETURNING *;
    `,
      [filename]
    );
    return rows[0] || null;
  },
};
