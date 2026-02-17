import path from 'node:path';
import type { DateTime } from 'luxon';
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

const buildUserDateTime = (dateTime: DateTime): string => {
  return dateTime.toJSON() as string;
};

const buildUserDateTimeNullable = (dateTime: DateTime): string | null => {
  return dateTime ? dateTime.toJSON() : null;
};

const buildUserDateNullable = (date: DateTime): string | null => {
  return date ? date.toFormat('yyyy-LL-dd') : null;
};

export const userRepositoryMappers = {
  toSummary: (
    userRow: RepositoryUserSummary,
    baseUrl: string
  ): UserSummary => ({
    id: parseInt(userRow.id, 10),
    username: userRow.username,
    avatarUrl: buildAvatarUrl(userRow.avatar_filename, baseUrl),
    lastActionAt: buildUserDateTimeNullable(userRow.last_action_at),
  }),
  toDetails: (
    userRow: RepositoryUserDetails,
    baseUrl: string
  ): UserDetails => ({
    id: parseInt(userRow.id, 10),
    username: userRow.username,
    email: userRow.email,
    avatarUrl: buildAvatarUrl(userRow.avatar_filename, baseUrl),
    lastActionAt: buildUserDateTimeNullable(userRow.last_action_at),
    balance: parseInt(userRow.balance, 10),
    createdAt: buildUserDateTime(userRow.created_at),
    birthday: buildUserDateNullable(userRow.birthday),
    fullName: userRow.full_name,
    bio: userRow.bio,
  }),
};
