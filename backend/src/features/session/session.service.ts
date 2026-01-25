import { randomUUID } from 'node:crypto';
import { DateTime } from 'luxon';
import type { Client } from 'pg';
import { encryptWithSalt } from '../../utils/controllerUtils.ts';
import { userRespository } from '../user/user.repository.ts';
import { sessionRepository } from './session.repository.ts';

export interface LoginResult {
  sessionToken: string;
}

export const sessionService = {
  login: async (
    db: Client,
    username: string,
    password: string
  ): Promise<LoginResult | null> => {
    const encryptedPassword = encryptWithSalt(password);

    const user = await userRespository.getUserByUsernameAndPassword(
      db,
      username,
      encryptedPassword
    );

    if (!user) {
      return null;
    }

    // Find all active sessions and delete them
    await sessionRepository.deleteSessionsByUserId(db, user.id);

    // Create a new session
    const newSessionToken = randomUUID();
    const encryptedNewSessionToken = encryptWithSalt(newSessionToken);
    await sessionRepository.createNewSession(
      db,
      encryptedNewSessionToken,
      user.id,
      DateTime.utc().plus({ minutes: 10 }).toSQL()
    );

    return {
      sessionToken: newSessionToken,
    };
  },

  logout: async (db: Client, userId: string) => {
    await sessionRepository.deleteSessionsByUserId(db, userId);
  },
};
