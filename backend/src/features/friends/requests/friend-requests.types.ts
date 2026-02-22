import type { DateTime } from 'luxon';
import type { UserSummary } from '../../user/user.types.ts';

// export interface RepositoryFriendRequest {
//   id: string;
//   user_from_id: string;
//   user_to_id: string;
//   created_at: DateTime;
// }

// RESPONSES FROM THE API
export interface ResponseOutgoingFriendRequest {
  id: string;
  userTo: UserSummary;
  createdAt: string;
}

export interface RepositoryOutgoingFriendRequest {
  id: string;
  created_at: DateTime;
  user_to_id: string;
  username: string;
  avatar_filename: string;
  last_action_at: DateTime;
  online: boolean;
}

export interface ResponseIncomingFriendRequest {
  id: string;
  userFrom: UserSummary;
  createdAt: string;
}

export interface RepositoryIncomingFriendRequest {
  id: string;
  created_at: DateTime;
  user_from_id: string;
  username: string;
  avatar_filename: string;
  last_action_at: DateTime;
  online: boolean;
}
