import type { FastifyInstance, FastifyRequest } from 'fastify';
import { sessionController } from './session.controller.ts';

// Routes for logging the user in/out
export const sessionRoutes = (fastify: FastifyInstance) => {
  // Login
  fastify.post(
    '/login',
    {
      config: {
        isPublic: true,
        rateLimit: {
          max: 5,
          timeWindow: '1 minute',
          keyGenerator: (req: FastifyRequest) => {
            const body = req.body as { username?: string };

            return `${req.ip}:${body?.username ?? 'unknown'}`;
          },
        },
      },
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
  fastify.delete('/logout', sessionController.logout);

  // Register
  fastify.post(
    '/register',
    {
      config: {
        isPublic: true,
        rateLimit: {
          max: 5,
          timeWindow: '1 minute',
          keyGenerator: (req: FastifyRequest) => req.ip,
        },
      },
      schema: {
        body: {
          type: 'object',
          required: ['username', 'password', 'email'],
          additionalProperties: false,
          properties: {
            username: {
              type: 'string',
              minLength: 6,
              maxLength: 30,
              pattern: '^[A-Za-z\\d]+$',
            },
            password: { type: 'string', minLength: 12, maxLength: 128 },
            email: { type: 'string', format: 'email' },
          },
        },
      },
    },
    sessionController.createUser
  );
};
