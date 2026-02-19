import type { FastifyInstance } from 'fastify';
import { sessionAuth } from '../features/auth/sessionAuth.ts';
import { sessionRoutes } from '../features/session/session.routes.ts';
import { userRoutes } from '../features/user/user.routes.ts';
import { userSettingsRoutes } from '../features/user/userSettings/user-settings.routes.ts';

export const registerRoutes = (fastify: FastifyInstance) => {
  // Encapsulation to make sure routes like
  // `/static` can be accessed without session token
  fastify.register(async (authRoutes: FastifyInstance) => {
    authRoutes.addHook('preValidation', sessionAuth);

    authRoutes.register(sessionRoutes, { prefix: '/api/v1/' });
    authRoutes.register(userRoutes, { prefix: '/api/v1/user' });
    authRoutes.register(userSettingsRoutes, {
      prefix: '/api/v1/user/me/settings',
    });
  });
};
