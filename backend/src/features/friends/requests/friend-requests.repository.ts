import type { Client } from 'pg';
import type {
  RepositoryIncomingFriendRequest,
  RepositoryOutgoingFriendRequest,
} from './friend-requests.types.ts';

export type RepositoryCreateFriendRequestOutcome =
  | 'CREATED'
  | 'ALREADY_FRIENDS'
  | 'ALREADY_SENT'
  | 'TARGET_USERID_DOES_NOT_EXIST'
  | 'INSTANT_FRIENDS'
  | 'OTHER';

export type RepositoryDeleteFriendRequestOutcome =
  | 'DELETE_SUCCESS'
  | 'NO_REQUEST_TO_DELETE';

export const friendRequestsRepository = {
  createFriendRequest: async (
    db: Client,
    userFromId: string,
    userToId: string
  ): Promise<RepositoryCreateFriendRequestOutcome> => {
    const { rows } = await db.query<{
      outcome: RepositoryCreateFriendRequestOutcome;
    }>(
      `
      WITH
        existing_users AS (
          SELECT 1
          FROM users
          WHERE id = $2
        ),
        already_friends AS (
          SELECT 1
          FROM friends
          WHERE user1_id = $1 AND user2_id = $2
        ),
        already_sent AS (
          SELECT 1
          FROM friend_requests
          WHERE user_from_id = $1
            AND user_to_id = $2
        ),
        already_received AS (
          SELECT 1
          FROM friend_requests
          WHERE user_from_id = $2
            AND user_to_id = $1
        ),
        created_request AS (
          INSERT INTO friend_requests
          (user_from_id, user_to_id)
          SELECT $1, $2
          WHERE EXISTS (SELECT 1 FROM existing_users)
            AND NOT EXISTS (SELECT 1 FROM already_friends)
            AND NOT EXISTS (SELECT 1 FROM already_received)
            AND NOT EXISTS (SELECT 1 from already_sent)
          RETURNING id
        ),
        instant_friends AS (
          INSERT INTO friends
          (user1_id, user2_id)
          SELECT v.user1_id, v.user2_id
            FROM (
              VALUES 
                ($1, $2),
                ($2, $1)
            ) AS v(user1_id, user2_id)
          WHERE EXISTS (SELECT 1 FROM already_received)
          ON CONFLICT DO NOTHING
          RETURNING 1
        ),
        cleanup_friend_requests AS (
          DELETE FROM friend_requests
          WHERE
          (
            (user_from_id = $1 AND user_to_id = $2) OR
            (user_from_id = $2 AND user_to_id = $1)
          )
              AND
          (
            EXISTS (SELECT 1 FROM already_friends) OR
            EXISTS (SELECT 1 FROM instant_friends)
          )
          RETURNING 1
        )
      SELECT
        CASE
          WHEN EXISTS (SELECT 1 FROM instant_friends) THEN 'INSTANT_FRIENDS'
          WHEN EXISTS (SELECT 1 FROM created_request) THEN 'CREATED'
          WHEN EXISTS (SELECT 1 FROM already_friends) THEN 'ALREADY_FRIENDS'
          WHEN EXISTS (SELECT 1 FROM already_sent) THEN 'ALREADY_SENT'
          WHEN NOT EXISTS (SELECT 1 FROM existing_users) THEN 'TARGET_USERID_DOES_NOT_EXIST'
          ELSE 'OTHER'
        END
      AS outcome;
			`,
      [userFromId, userToId]
    );

    return rows[0]?.outcome ?? 'OTHER';
  },

  getOutgoingFriendRequests: async (
    db: Client,
    userFromId: string
  ): Promise<RepositoryOutgoingFriendRequest[]> => {
    const { rows } = await db.query<RepositoryOutgoingFriendRequest>(
      `
      SELECT
        fr.id AS id,
        fr.created_at AS created_at,
        u.id AS user_to_id,
        u.username AS username,
        u.avatar_filename AS avatar_filename,
        u.last_action_at AS last_action_at,
        EXISTS (
          SELECT 1 FROM sessions AS s
          WHERE s.user_id = u.id AND s.valid_until > NOW()
        ) AS online
      FROM friend_requests AS fr
      JOIN users AS u
      ON u.id = fr.user_to_id
      WHERE fr.user_from_id = $1
      ORDER BY fr.created_at DESC
      `,
      [userFromId]
    );

    return rows;
  },

  getIncomingFriendRequests: async (
    db: Client,
    userToId: string
  ): Promise<RepositoryIncomingFriendRequest[]> => {
    const { rows } = await db.query<RepositoryIncomingFriendRequest>(
      `
      SELECT
        fr.id AS id,
        fr.created_at AS created_at,
        u.id AS user_from_id,
        u.username AS username,
        u.avatar_filename AS avatar_filename,
        u.last_action_at AS last_action_at,
        EXISTS (
          SELECT 1 FROM sessions AS s
          WHERE s.user_id = u.id AND s.valid_until > NOW()
        ) AS online
      FROM friend_requests AS fr
      JOIN users AS u
      ON u.id = fr.user_from_id
      WHERE fr.user_to_id = $1
      ORDER BY fr.created_at DESC
      `,
      [userToId]
    );

    return rows;
  },

  deleteFriendRequest: async (
    db: Client,
    userId: string,
    userToId: string
  ): Promise<RepositoryDeleteFriendRequestOutcome> => {
    const { rows } = await db.query<{
      outcome: RepositoryDeleteFriendRequestOutcome;
    }>(
      `
      WITH
        delete_friend_request AS (
          DELETE FROM friend_requests
          WHERE (user_from_id = $1 AND user_to_id = $2) OR
                (user_from_id = $2 AND user_to_id = $1)
          RETURNING 1
        )
      SELECT
        CASE
          WHEN EXISTS (SELECT 1 FROM delete_friend_request) THEN 'DELETE_SUCCESS'
          ELSE 'NO_REQUEST_TO_DELETE'
        END
      AS outcome;
    `,
      [userId, userToId]
    );

    return rows[0]?.outcome ?? 'NO_REQUEST_TO_DELETE';
  },
};
