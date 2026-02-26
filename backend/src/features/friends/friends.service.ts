import type { Client } from 'pg';
import { userRepositoryMappers } from '../user/user.mappers.ts';
import type { UserSummary } from '../user/user.types.ts';
import {
  mapDeleteFriendResult,
  type RemoveFriendResult,
} from './friends.mappers.ts';
import { friendsRepository } from './friends.repository.ts';

export const friendsService = {
  getMyFriends: async (
    db: Client,
    userId: string,
    baseUrl: string
  ): Promise<UserSummary[]> => {
    const friendRows = await friendsRepository.getFriendsOfUserId(db, userId);

    return friendRows.map((row) =>
      userRepositoryMappers.toSummary(row, baseUrl)
    );
  },

  removeFriend: async (
    db: Client,
    userId: string,
    targetUserId: string
  ): Promise<RemoveFriendResult> => {
    const outcome = await friendsRepository.removeFriend(
      db,
      userId,
      targetUserId
    );

    return mapDeleteFriendResult(outcome);
  },
};
