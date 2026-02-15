import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { Client } from 'pg';
import sharp from 'sharp';
import { NoAvatarToDeleteError } from '../../../utils/serviceTypes.ts';
import { userRespository } from '../user.repository.ts';
import { userSettingsRowToResult } from './user-settings.mappers.ts';
import {
  type NewRepositoryUserSettings,
  userSettingsRepository,
} from './user-settings.repository.ts';
import type {
  UpdateUserSettingsRequestBody,
  UserSettingsResponse,
} from './user-settings.types.ts';

export const userSettingsService = {
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

    await userRespository.setUserAvatarFilename(db, userId, null);

    await fs.promises.unlink(path.join(fullAvatarPath));
  },

  updateUserSettings: async (
    db: Client,
    userId: string,
    settings: UpdateUserSettingsRequestBody
  ): Promise<UserSettingsResponse> => {
    // Get old settings
    const oldSettings = await userSettingsRepository.getUserSettings(
      db,
      userId
    );

    if (!oldSettings)
      throw new Error(`No settings for the user with id ${userId} found`);

    // Replace only with valid new settings
    const newRepositoryUserSettings: NewRepositoryUserSettings = {
      birthday:
        settings.birthday !== undefined
          ? settings.birthday
          : oldSettings.birthday
            ? oldSettings.birthday.toFormat('yyyy-LL-dd')
            : null,
      fullName:
        settings.fullName !== undefined
          ? settings.fullName
          : oldSettings.full_name,
    };

    // Overwrite in database
    const updatedUserSettings = await userSettingsRepository.setUserSettings(
      db,
      userId,
      newRepositoryUserSettings
    );

    if (!updatedUserSettings)
      throw new Error('Something went wrong with changing user settings');

    // Return new updated settings
    return userSettingsRowToResult(updatedUserSettings);
  },

  getUserSettings: async (
    db: Client,
    userId: string
  ): Promise<UserSettingsResponse> => {
    const repositoryUserSettingsRow =
      await userSettingsRepository.getUserSettings(db, userId);

    if (!repositoryUserSettingsRow)
      throw new Error(`No settings for the user with id ${userId} found`);

    return userSettingsRowToResult(repositoryUserSettingsRow);
  },
};
