import type { Client } from 'pg';

export const sessionRepository = {
  createSession: async (db: Client, token: string, userId: string) => {},
};
