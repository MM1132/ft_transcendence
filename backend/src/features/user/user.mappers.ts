import path from 'node:path';
import type { RepositoryUser } from './user.repository.ts';

export interface UserResultGeneric {
  id: number;
  username: string;
  avatarUrl: string;
}

export interface UserResultDetailed extends UserResultGeneric {
  createdAt: string;
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
) => ({
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
