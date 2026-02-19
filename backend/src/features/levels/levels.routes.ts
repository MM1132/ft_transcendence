import type { FastifyInstance } from 'fastify';
import { skillsController } from './levels.controller.ts';

export const skillsRoutes = async (fastify: FastifyInstance) => {
  fastify.post(
    '/work',
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: '1 minute',
        },
      },
    },
    skillsController.work
  );
};
