import type { FastifyInstance } from 'fastify';
import { sessionAuth } from '../auth/sessionAuth.ts';
import { type UserIdParams, userController } from './user.controller.ts';

export const userRoutes = async (fastify: FastifyInstance) => {
  fastify.get(
    '/',
    {
      preHandler: sessionAuth,
    },
    userController.getAllUsers
  );

  fastify.get('/me', { preHandler: sessionAuth }, userController.getMyUser);

  fastify.get<{ Params: UserIdParams }>(
    '/:id',
    {
      preHandler: sessionAuth,
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', pattern: '^[1-9][0-9]*$' },
          },
        },
      },
    },
    userController.getUserById
  );

  // Register a new user
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
    userController.createUser
  );

  // Get all currently online users
  fastify.get(
    '/online',
    { preHandler: sessionAuth },
    userController.getOnlineUsers
  );
};
