import type { Client } from 'pg';
import type { RepositoryUserSummary } from '../user/user.types.ts';

export type RepositoryDeleteFriendOutcome =
  | 'FRIEND_REMOVED_SUCCESS'
  | 'NOT_YOUR_FRIEND';

export const friendsRepository = {
  getFriendsOfUserId: async (
    db: Client,
    userId: string
  ): Promise<RepositoryUserSummary[]> => {
    const { rows } = await db.query<RepositoryUserSummary>(
      `
      SELECT
        u.*,
        EXISTS (
          SELECT 1 FROM sessions
          WHERE user_id = u.id AND valid_until > NOW()
        ) AS online
      FROM friends
      JOIN users AS u
      ON u.id = user2_id
      WHERE user1_id = $1
      ORDER BY u.last_action_at DESC
    `,
      [userId]
    );

    return rows;
  },

  removeFriend: async (
    db: Client,
    userId: string,
    targetUserId: string
  ): Promise<RepositoryDeleteFriendOutcome> => {
    const { rows } = await db.query<{ outcome: RepositoryDeleteFriendOutcome }>(
      `
      WITH
        deleted_friend AS (
          DELETE FROM friends
          WHERE (user1_id = $1 AND user2_id = $2) OR
                (user1_id = $2 AND user2_id = $1)
          RETURNING 1
        )
      SELECT
        CASE
          WHEN EXISTS (SELECT 1 FROM deleted_friend) THEN 'FRIEND_REMOVED_SUCCESS'
          ELSE 'NOT_YOUR_FRIEND'
        END
      AS outcome;
    `,
      [userId, targetUserId]
    );

    return rows[0]?.outcome || 'NOT_YOUR_FRIEND';
  },
};
