import path from 'node:path';
import type { DateTime } from 'luxon';
import {
  buildDateTime,
  buildDateTimeNullable,
} from '../../utils/mapperUtils.ts';
import type {
  RepositoryUserDetails,
  RepositoryUserSummary,
  UserDetails,
  UserSummary,
} from './user.types.ts';

const buildAvatarUrl = (
  avatarFilename: string | null,
  baseUrl: string
): string => {
  return path.join(
    baseUrl,
    '/static',
    avatarFilename
      ? path.join('/avatars/uploaded', avatarFilename)
      : path.join('/avatars', 'default_avatar.png')
  );
};

const buildUserDateNullable = (date: DateTime): string | null => {
  return date ? date.toFormat('yyyy-LL-dd') : null;
};

export const userRepositoryMappers = {
  toSummary: (
    userRow: RepositoryUserSummary,
    baseUrl: string
  ): UserSummary => ({
    id: userRow.id,
    username: userRow.username,
    avatarUrl: buildAvatarUrl(userRow.avatar_filename, baseUrl),
    lastActionAt: buildDateTimeNullable(userRow.last_action_at),
    online: userRow.online,
  }),
  toDetails: (
    userRow: RepositoryUserDetails,
    baseUrl: string
  ): UserDetails => ({
    id: userRow.id,
    username: userRow.username,
    email: userRow.email,
    avatarUrl: buildAvatarUrl(userRow.avatar_filename, baseUrl),
    lastActionAt: buildDateTimeNullable(userRow.last_action_at),
    balance: parseInt(userRow.balance, 10),
    createdAt: buildDateTime(userRow.created_at),
    birthday: buildUserDateNullable(userRow.birthday),
    fullName: userRow.full_name,
    bio: userRow.bio,
    online: userRow.online,
  }),
};
