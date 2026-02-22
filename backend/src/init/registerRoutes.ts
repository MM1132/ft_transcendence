import type { FastifyInstance } from 'fastify';
import { sessionAuth } from '../features/auth/sessionAuth.ts';
import { friendsRoutes } from '../features/friends/friends.routes.ts';
import { friendRequestsRoutes } from '../features/friends/requests/friend-requests.routes.ts';
import { skillsRoutes } from '../features/levels/levels.routes.ts';
import { sessionRoutes } from '../features/session/session.routes.ts';
import { userRoutes } from '../features/user/user.routes.ts';
import { userSettingsRoutes } from '../features/user/userSettings/user-settings.routes.ts';

export const registerRoutes = (fastify: FastifyInstance) => {
  fastify.addHook('preValidation', sessionAuth);

  fastify.register(sessionRoutes, { prefix: '/api/v1/' });
  fastify.register(userRoutes, { prefix: '/api/v1/user' });
  fastify.register(userSettingsRoutes, { prefix: '/api/v1/user/me/settings' });
  fastify.register(skillsRoutes, { prefix: '/api/v1/skills' });

  fastify.register(friendRequestsRoutes, { prefix: '/api/v1/friend-requests' });
  fastify.register(friendsRoutes, { prefix: '/api/v1/friends' });
};
