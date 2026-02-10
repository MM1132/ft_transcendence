import path from 'node:path';
import type {
  RepositoryOnlineUser,
  RepositoryUser,
} from './user.repository.ts';

export interface UserResultGeneric {
  id: number;
  username: string;
  avatarUrl: string;
}

export interface UserResultDetailed {
  id: number;
  username: string;
  avatarUrl: string;
  createdAt: string;
  lastActionAt: string | null;
}

export interface OnlineUserResult {
  id: number;
  username: string;
  avatarUrl: string;
  lastActionAt: string | null;
}

export const userRowToResultGeneric = (
  userRow: RepositoryUser,
  baseUrl: string
): UserResultGeneric => ({
  id: parseInt(userRow.id, 10),
  username: userRow.username,
  avatarUrl: path.join(
    baseUrl,
    '/static',
    userRow.avatar_filename
      ? path.join('/avatars/uploaded', userRow.avatar_filename)
      : path.join('/avatars', 'default_avatar.png')
  ),
});

export const userRowToResultDetailed = (
  userRow: RepositoryUser,
  baseUrl: string
): UserResultDetailed => ({
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
  lastActionAt: userRow.last_action_at
    ? (userRow.last_action_at.toJSON() as string)
    : null,
});

export const userRowToOnlineUser = (
  userRow: RepositoryOnlineUser,
  baseUrl: string
): OnlineUserResult => ({
  id: parseInt(userRow.id, 10),
  username: userRow.username,
  avatarUrl: path.join(
    baseUrl,
    '/static',
    userRow.avatar_filename
      ? path.join('/avatars/uploaded', userRow.avatar_filename)
      : path.join('/avatars', 'default_avatar.png')
  ),
  lastActionAt: userRow.last_action_at
    ? (userRow.last_action_at.toJSON() as string)
    : null,
});
