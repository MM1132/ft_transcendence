import type { Client } from 'pg';
import { encryptPassword } from '../../utils/controllerUtils.ts';
import {
  DuplicateDataError,
  type QueryError,
} from '../../utils/repositoryTypes.ts';
import { type RepositoryUser, userRespository } from './user.repository.ts';

interface UserResult {
  id: number;
  username: string;
  createdAt: string;
}

const userRowToResult = (userRow: RepositoryUser): UserResult => ({
  id: parseInt(userRow.id, 10),
  username: userRow.username,
  createdAt: userRow.created_at.toFormat('DDDD'),
});

export const userService = {
  getAllUsers: async (db: Client): Promise<UserResult[]> => {
    const rows = await userRespository.getAllUsers(db);
    return rows.map(userRowToResult);
  },

  getUserById: async (db: Client, id: number): Promise<UserResult | null> => {
    const userRow = await userRespository.getUserById(db, id);
    if (!userRow) return null;
    return userRowToResult(userRow);
  },

  createUser: async (
    db: Client,
    username: string,
    password: string
  ): Promise<UserResult> => {
    const encryptedPassword = encryptPassword(password);

    try {
      await userRespository.insertNewUserToDatabase(
        db,
        username,
        encryptedPassword
      );
    } catch (error) {
      const queryError = error as QueryError;

      if (queryError.code === '23505')
        throw new DuplicateDataError(`Username ${username} already exists`);
    }

    const createdUser = await userRespository.getUserByUsername(db, username);

    if (!createdUser)
      throw new Error(`Created user ${username} was not found in the database`);

    return userRowToResult(createdUser);
  },
};
