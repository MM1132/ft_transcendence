import type { DateTime } from 'luxon';
import type { Client, QueryResultRow } from 'pg';

export interface RepositoryUserSettings extends QueryResultRow {
  birthday: DateTime | null;
  full_name: string | null;
}

export interface NewRepositoryUserSettings {
  birthday: string | null;
  fullName: string | null;
}

export const userSettingsRepository = {
  setUserSettings: async (
    db: Client,
    userId: string,
    settings: NewRepositoryUserSettings
  ) => {
    const { rows } = await db.query<RepositoryUserSettings>(
      `
			UPDATE users
			SET birthday = $2, full_name = $3
			WHERE id = $1
			RETURNING birthday, full_name
		`,
      [userId, settings.birthday, settings.fullName]
    );
    return rows[0] || null;
  },

  getUserSettings: async (
    db: Client,
    userId: string
  ): Promise<RepositoryUserSettings | null> => {
    const { rows } = await db.query<RepositoryUserSettings>(
      `SELECT birthday, full_name FROM users WHERE id = $1;`,
      [userId]
    );
    // Here we know for sure that the row in the repository will exist
    return rows[0] || null;
  },
};
