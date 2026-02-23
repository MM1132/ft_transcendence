import type { Client } from 'pg';
import {
  mapIncomingFriendRequest,
  mapOutgoingFriendRequest,
  type ResponseOutgoingFriendRequest,
} from './friend-requests.mapper.ts';
import {
  friendRequestsRepository,
  type RepositoryCreateFriendRequestOutcome,
} from './friend-requests.repository.ts';

export type MakeFriendRequestOutcome =
  | RepositoryCreateFriendRequestOutcome
  | 'CANNOT_SEND_TO_YOURSELF';

export const friendRequestsService = {
  makeFriendRequest: async (
    db: Client,
    userFromId: string,
    userToId: string
  ): Promise<MakeFriendRequestOutcome> => {
    if (userFromId === userToId) {
      return 'CANNOT_SEND_TO_YOURSELF';
    }

    return await friendRequestsRepository.createFriendRequest(
      db,
      userFromId,
      userToId
    );
  },

  getOutgoingFriendRequests: async (
    db: Client,
    userId: string,
    baseUrl: string
  ): Promise<ResponseOutgoingFriendRequest[]> => {
    const rows = await friendRequestsRepository.getOutgoingFriendRequests(
      db,
      userId
    );

    return rows.map((row) => mapOutgoingFriendRequest(row, baseUrl));
  },

  getIncomingFriendRequests: async (
    db: Client,
    userId: string,
    baseUrl: string
  ) => {
    const rows = await friendRequestsRepository.getIncomingFriendRequests(
      db,
      userId
    );

    return rows.map((row) => mapIncomingFriendRequest(row, baseUrl));
  },

  deleteFriendRequest: async (db: Client, userId: string, userToId: string) => {
    return friendRequestsRepository.deleteFriendRequest(db, userId, userToId);
  },
};
