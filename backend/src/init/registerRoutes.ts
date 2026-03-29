import type { FastifyInstance } from 'fastify';
import { sessionAuth } from '../features/auth/sessionAuth.ts';
import { friendsRoutes } from '../features/friends/friends.routes.ts';
import { friendRequestsRoutes } from '../features/friends/requests/friend-requests.routes.ts';
import { skillsRoutes } from '../features/levels/levels.routes.ts';
import { sessionRoutes } from '../features/session/session.routes.ts';
import { userRoutes } from '../features/user/user.routes.ts';
import { userSettingsRoutes } from '../features/user/userSettings/user-settings.routes.ts';

export const registerRoutes = (fastify: FastifyInstance) => {
  // Public: room list for the lobby
  fastify.get('/api/rooms', async () => {
    const result = await fastify.db.query(`
      SELECT
        r.*,
        COUNT(rp.id) as player_count,
        COALESCE(
          json_agg(
            json_build_object(
              'id', u.id,
              'username', u.username,
              'slot', rp.player_slot,
              'is_ready', rp.is_ready
            )
          ) FILTER (WHERE u.id IS NOT NULL),
          '[]'
        ) as players
      FROM rooms r
      LEFT JOIN room_players rp ON r.id = rp.room_id
      LEFT JOIN users u ON rp.user_id = u.id
      GROUP BY r.id
      ORDER BY r.id
    `);
    return result.rows;
  });

  // Public: leaderboard
  fastify.get('/api/v1/leaderboard', async () => {
    const result = await fastify.db.query(`
      SELECT
        u.id,
        u.username,
        u.avatar_filename AS avatar_url,
        u.balance,
        COUNT(gr.id) AS games_played,
        COUNT(gr.id) FILTER (WHERE gr.placement = 1) AS wins,
        COALESCE(SUM(gr.score), 0) AS total_score,
        COALESCE(SUM(gr.coins_won), 0) AS total_coins_won
      FROM users u
      LEFT JOIN game_results gr ON gr.user_id = u.id
      GROUP BY u.id, u.username, u.avatar_filename, u.balance
      ORDER BY wins DESC, total_score DESC
      LIMIT 50
    `);
    return result.rows;
  });

  // Encapsulation to make sure routes like
  // `/static` can be accessed without session token
  fastify.register(async (authRoutes: FastifyInstance) => {
    authRoutes.addHook('preValidation', sessionAuth);

    authRoutes.register(sessionRoutes, { prefix: '/api/v1/' });
    authRoutes.register(userRoutes, { prefix: '/api/v1/user' });
    authRoutes.register(userSettingsRoutes, {
      prefix: '/api/v1/user/me/settings',
    });

    fastify.register(skillsRoutes, { prefix: '/api/v1/skills' });
    fastify.register(friendRequestsRoutes, {
      prefix: '/api/v1/friend-requests',
    });
    fastify.register(friendsRoutes, { prefix: '/api/v1/friends' });
  });
};
