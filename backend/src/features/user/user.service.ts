import type { Client } from 'pg';
import { encryptWithSalt } from '../../utils/controllerUtils.ts';
import {
  DuplicateDataError,
  type QueryError,
} from '../../utils/repositoryTypes.ts';
import { userRepositoryMappers } from './user.mappers.ts';
import { userRespository } from './user.repository.ts';
import type { UserDetails, UserSummary } from './user.types.ts';

export const userService = {
  getAllUsers: async (db: Client, baseUrl: string): Promise<UserSummary[]> => {
    const rows = await userRespository.getAllUsers(db);
    return rows.map((row) => {
      return userRepositoryMappers.toSummary(row, baseUrl);
    });
  },

  getUserById: async (
    db: Client,
    id: string,
    baseUrl: string
  ): Promise<UserDetails | null> => {
    const userRow = await userRespository.getUserById(db, id);
    if (!userRow) return null;

    return userRepositoryMappers.toDetails(userRow, baseUrl);
  },

  createUser: async (
    db: Client,
    username: string,
    password: string,
    email: string,
    baseUrl: string
  ): Promise<UserDetails | null> => {
    const encryptedPassword = encryptWithSalt(password);

    try {
      const newUser = await userRespository.insertNewUserToDatabase(db, {
        username,
        encryptedPassword,
        email,
      });
      if (!newUser) return null;

      return userRepositoryMappers.toDetails(newUser, baseUrl);
    } catch (error) {
      const queryError = error as QueryError;

      if (queryError.code === '23505') {
        if (queryError.detail.includes('(username)')) {
          queryError.message = 'User with this username already exists';
          throw new DuplicateDataError(queryError);
        }
        if (queryError.detail.includes('(email)')) {
          queryError.message = 'User with this email already exists';
          throw new DuplicateDataError(queryError);
        }
      }
    }

    return null;
  },

  getOnlineUsers: async (
    db: Client,
    baseUrl: string
  ): Promise<UserSummary[]> => {
    const onlineUserRows = await userRespository.getOnlineUsers(db);

    return onlineUserRows.map((row) => {
      return userRepositoryMappers.toSummary(row, baseUrl);
    });
  },
};
