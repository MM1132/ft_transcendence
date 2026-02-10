import type { Client } from 'pg';
import { encryptWithSalt } from '../../utils/controllerUtils.ts';
import {
  DuplicateDataError,
  type QueryError,
} from '../../utils/repositoryTypes.ts';
import {
  type UserResultGeneric,
  userRowToOnlineUser,
  userRowToResultDetailed,
  userRowToResultGeneric,
} from './user.mappers.ts';
import { userRespository } from './user.repository.ts';

export const userService = {
  getAllUsers: async (
    db: Client,
    baseUrl: string
  ): Promise<UserResultGeneric[]> => {
    const rows = await userRespository.getAllUsers(db);
    return rows.map((row) => {
      return userRowToResultGeneric(row, baseUrl);
    });
  },

  getUserById: async (
    db: Client,
    id: string,
    baseUrl: string
  ): Promise<UserResultGeneric | null> => {
    const userRow = await userRespository.getUserById(db, id);
    if (!userRow) return null;
    return userRowToResultDetailed(userRow, baseUrl);
  },

  createUser: async (
    db: Client,
    username: string,
    password: string,
    baseUrl: string
  ): Promise<UserResultGeneric> => {
    const encryptedPassword = encryptWithSalt(password);

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

    return userRowToResultDetailed(createdUser, baseUrl);
  },

  getOnlineUsers: async (db: Client, baseUrl: string) => {
    const onlineUserRows = await userRespository.getOnlineUsers(db);

    return onlineUserRows.map((row) => {
      return userRowToOnlineUser(row, baseUrl);
    });
  },
};
