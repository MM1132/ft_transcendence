import type { FastifyInstance } from 'fastify';
import { sessionAuth } from '../auth/sessionAuth.ts';
import { profileController } from './profile.controller.ts';

export const profileRoutes = (fastify: FastifyInstance) => {
  fastify.put(
    '/avatar',
    { preHandler: sessionAuth },
    profileController.changeUserAvatar
  );

  fastify.delete(
    '/avatar',
    { preHandler: sessionAuth },
    profileController.deleteAvatar
  );
};
