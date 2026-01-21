import type { FastifyInstance } from 'fastify';
import { userController } from '../controllers/user.controller.ts';

export const userRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/', userController.getAllUsers);
  fastify.get('/:id', userController.getUserById);
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
};
