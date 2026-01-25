import type { FastifyInstance } from 'fastify';
import { sessionAuth } from '../auth/sessionAuth.ts';
import { sessionController } from './session.controller.ts';

// Routes for logging the user in/out
export const sessionRoutes = (fastify: FastifyInstance) => {
  // Login
  fastify.post(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          required: ['username', 'password'],
          additionalProperties: false,
          properties: {
            username: { type: 'string', minLength: 6, maxLength: 30 },
            password: { type: 'string', minLength: 12, maxLength: 128 },
          },
        },
      },
    },
    sessionController.login
  );

  // Logout
  fastify.delete(
    '/',
    {
      preHandler: sessionAuth,
    },
    sessionController.logout
  );
};
