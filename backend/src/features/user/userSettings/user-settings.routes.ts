import type { FastifyInstance } from 'fastify';
import { sessionAuth } from '../../auth/sessionAuth.ts';
import { userSettingsController } from './user-settings.controller.ts';

export const userSettingsRoutes = (fastify: FastifyInstance) => {
  fastify.put(
    '/avatar',
    { preHandler: sessionAuth },
    userSettingsController.changeUserAvatar
  );

  fastify.delete(
    '/avatar',
    { preHandler: sessionAuth },
    userSettingsController.deleteAvatar
  );
};
