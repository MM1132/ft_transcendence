import type { Client } from 'pg';
import { encryptPassword } from '../../utils/controllerUtils.ts';
import { userRespository } from '../user/user.repository.ts';

export const sessionService = {
  login: async (
    db: Client,
    username: string,
    password: string
  ): Promise<boolean> => {
    const encryptedPassword = encryptPassword(password);

    const user = await userRespository.getUserByUsernameAndPassword(
      db,
      username,
      encryptedPassword
    );

    if (!user) {
      return false;
    }

    // 1. Create a session for the user

    // 2. Return the session
    return true;
  },
};
