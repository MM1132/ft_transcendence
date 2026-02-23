import type { RepositoryDeleteFriendOutcome } from './friends.repository.ts';

export interface RemoveFriendResult {
  status: RepositoryDeleteFriendOutcome;
  message: string;
}

const mapFriendDeleteOutcomeToMessage = (
  outcome: RepositoryDeleteFriendOutcome
): string => {
  switch (outcome) {
    case 'NOT_YOUR_FRIEND':
      return "Cannot remove a friend you don't have!";
    case 'FRIEND_REMOVED_SUCCESS':
      return 'You successfully removed a friend! Bye bye, friend!';
  }
};

export const mapDeleteFriendResult = (
  outcome: RepositoryDeleteFriendOutcome
): RemoveFriendResult => ({
  status: outcome,
  message: mapFriendDeleteOutcomeToMessage(outcome),
});
