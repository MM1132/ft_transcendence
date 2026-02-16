import type { FastifyInstance } from 'fastify';
import { type UserIdParams, userController } from './user.controller.ts';

export const userRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/', userController.getAllUsers);

  fastify.get('/me', userController.getMyUser);

  fastify.get<{ Params: UserIdParams }>(
    '/:id',
    {
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

  // Get all currently online users
  fastify.get('/online', userController.getOnlineUsers);
};
