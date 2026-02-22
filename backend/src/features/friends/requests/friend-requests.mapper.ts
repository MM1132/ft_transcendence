import { buildDateTime } from '../../../utils/mapperUtils.ts';
import { userRepositoryMappers } from '../../user/user.mappers.ts';
import type { UserSummary } from '../../user/user.types.ts';
import type { RepositoryDeleteFriendRequestOutcome } from './friend-requests.repository.ts';
import type { MakeFriendRequestOutcome } from './friend-requests.service.ts';
import type {
  RepositoryIncomingFriendRequest,
  RepositoryOutgoingFriendRequest,
} from './friend-requests.types.ts';

export interface ResponseOutgoingFriendRequest {
  id: string;
  userTo: UserSummary;
  createdAt: string;
}

export interface ResponseIncomingFriendRequest {
  id: string;
  userFrom: UserSummary;
  createdAt: string;
}

export const mapMakeFriendRequestStatus = (
  outcome: MakeFriendRequestOutcome
): string => {
  switch (outcome) {
    case 'ALREADY_FRIENDS':
      return 'You and the other user are already friends';
    case 'ALREADY_SENT':
      return 'You have already sent a friend request to that user';
    case 'CANNOT_SEND_TO_YOURSELF':
      return 'You cannot send a friend request to yourself';
    case 'CREATED':
      return 'Friend request successfully sent!';
    case 'TARGET_USERID_DOES_NOT_EXIST':
      return 'The user whom you are trying to send friend request to does not exist';
    case 'INSTANT_FRIENDS':
      return 'That user already had a friend request towards you, so you just became instant friends';
    default:
      return 'Internal server error';
  }
};

export const mapDeleteFriendRequestStatus = (
  outcome: RepositoryDeleteFriendRequestOutcome
): string => {
  switch (outcome) {
    case 'DELETE_SUCCESS':
      return 'Friend request successfully deleted!';
    case 'NO_REQUEST_TO_DELETE':
      return 'There is no such request to delete! Make sure the request is made by you to someone, or by someone to you.';
  }
};

export const mapOutgoingFriendRequest = (
  row: RepositoryOutgoingFriendRequest,
  baseUrl: string
): ResponseOutgoingFriendRequest => ({
  id: row.id,
  createdAt: buildDateTime(row.created_at),
  userTo: {
    ...userRepositoryMappers.toSummary(
      {
        id: row.user_to_id,
        avatar_filename: row.avatar_filename,
        last_action_at: row.last_action_at,
        online: row.online,
        username: row.username,
      },
      baseUrl
    ),
  },
});

export const mapIncomingFriendRequest = (
  row: RepositoryIncomingFriendRequest,
  baseUrl: string
): ResponseIncomingFriendRequest => ({
  id: row.id,
  createdAt: buildDateTime(row.created_at),
  userFrom: {
    ...userRepositoryMappers.toSummary(
      {
        id: row.user_from_id,
        avatar_filename: row.avatar_filename,
        last_action_at: row.last_action_at,
        online: row.online,
        username: row.username,
      },
      baseUrl
    ),
  },
});
