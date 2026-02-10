import type { FastifyInstance } from 'fastify';
import { profileRoutes } from '../features/profile/profile.routes.ts';
import { sessionRoutes } from '../features/session/session.routes.ts';
import { userRoutes } from '../features/user/user.routes.ts';

export const registerRoutes = (fastify: FastifyInstance) => {
  fastify.register(sessionRoutes, { prefix: '/api/v1/session' });
  fastify.register(userRoutes, { prefix: '/api/v1/user' });
  fastify.register(profileRoutes, { prefix: '/api/v1/profile' });
};
