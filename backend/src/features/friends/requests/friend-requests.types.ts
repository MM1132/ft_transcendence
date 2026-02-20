import type { DateTime } from 'luxon';
import type { UserSummary } from '../../user/user.types.ts';

export type FriendRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface RepositoryFriendRequest {
  id: string;
  user_from_id: string;
  user_to_id: string;
  created_at: DateTime;
  status: FriendRequestStatus;
}

// RESPONSES FROM THE API
export interface ResponseFriendRequest {
  id: string;
  user_from: UserSummary;
  created_at: DateTime;
  status: FriendRequestStatus;
}
