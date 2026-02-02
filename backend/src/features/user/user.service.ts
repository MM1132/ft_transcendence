import fs from 'node:fs';
import path from 'node:path';
import type { Client } from 'pg';
import sharp from 'sharp';
import { encryptWithSalt } from '../../utils/controllerUtils.ts';
import {
  DuplicateDataError,
  type QueryError,
} from '../../utils/repositoryTypes.ts';
import { type RepositoryUser, userRespository } from './user.repository.ts';

interface UserResult {
  id: number;
  username: string;
  createdAt: string;
  avatarUrl: string;
}

const userRowToResult = (
  userRow: RepositoryUser,
  baseUrl: string
): UserResult => ({
  id: parseInt(userRow.id, 10),
  username: userRow.username,
  createdAt: userRow.created_at.toJSON() as string,
  avatarUrl: path.join(
    baseUrl,
    userRow.avatar_filename || '/static/default_avatar.png'
  ),
});

export const userService = {
  getAllUsers: async (db: Client, baseUrl: string): Promise<UserResult[]> => {
    const rows = await userRespository.getAllUsers(db);
    return rows.map((row) => {
      return userRowToResult(row, baseUrl);
    });
  },

  getUserById: async (
    db: Client,
    id: string,
    baseUrl: string
  ): Promise<UserResult | null> => {
    const userRow = await userRespository.getUserById(db, id);
    if (!userRow) return null;
    return userRowToResult(userRow, baseUrl);
  },

  createUser: async (
    db: Client,
    username: string,
    password: string,
    baseUrl: string
  ): Promise<UserResult> => {
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

    return userRowToResult(createdUser, baseUrl);
  },

  uploadAvatar: async (
    db: Client,
    userId: string,
    fileBuffer: Buffer<ArrayBufferLike>,
    baseDir: string
  ): Promise<string> => {
    // Make sure that the path exists
    const saveDir = path.join(baseDir, '/static/uploads/avatars');

    await fs.promises.mkdir(saveDir, { recursive: true });

    const filename = path.join('/static/uploads/avatars', `${userId}.png`);

    await sharp(fileBuffer)
      .resize(512, 512)
      .png()
      .toFile(path.join(baseDir, filename));

    await userRespository.setUserAvatarFilename(db, userId, filename);

    return filename;
  },

  deleteAvatar: async (db: Client, userId: string) => {
    await userRespository.setAvatarToNull(db, userId);
  },
};
