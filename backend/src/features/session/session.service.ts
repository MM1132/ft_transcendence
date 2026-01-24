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

    // If the user is logged in, we will never even get to this place in code
    // The preprocessor should already take care of this for us and protect the routes

    // We get to this place in the code only if the password was correct

    // 1. Check if the user already has an active session
    //    If so, throw an error, telling them that they are already logged in

    // 2. Create a new session for the user

    // 3. Return the session
    return true;
  },
};
