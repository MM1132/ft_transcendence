import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { Client } from 'pg';
import sharp from 'sharp';
import { encryptWithSalt } from '../../utils/controllerUtils.ts';
import {
  DuplicateDataError,
  type QueryError,
} from '../../utils/repositoryTypes.ts';
import { NoAvatarToDeleteError } from '../../utils/serviceTypes.ts';
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
    '/static',
    userRow.avatar_filename
      ? path.join('/avatars/uploaded', userRow.avatar_filename)
      : path.join('/avatars', 'default_avatar.png')
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
    baseDir: string,
    baseUrl: string
  ): Promise<string> => {
    const rootSaveDir = path.join(baseDir, '/static/avatars/uploaded');

    await fs.promises.mkdir(rootSaveDir, { recursive: true });

    const user = await userRespository.getUserById(db, userId);

    // Random filename, or the same one the user already has
    const filename = user?.avatar_filename || path.join(`${randomUUID()}.png`);

    const absoluteFilename = path.join(rootSaveDir, filename);
    await sharp(fileBuffer).resize(512, 512).png().toFile(absoluteFilename);

    await userRespository.setUserAvatarFilename(db, userId, filename);

    return path.join(baseUrl, '/static/avatars/uploaded', filename);
  },

  deleteAvatar: async (db: Client, userId: string, baseDir: string) => {
    const user = await userRespository.getUserById(db, userId);
    if (!user?.avatar_filename)
      throw new NoAvatarToDeleteError(
        "User doesn't have a set avatar to delete"
      );

    const fullAvatarPath = path.join(
      baseDir,
      '/static/avatars/uploaded',
      user.avatar_filename
    );

    await userRespository.setAvatarToNull(db, userId);

    await fs.promises.unlink(path.join(fullAvatarPath));
  },
};
