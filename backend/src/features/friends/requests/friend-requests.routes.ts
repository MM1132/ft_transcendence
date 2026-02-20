import type { FastifyInstance } from 'fastify';
import { friendRequestsController } from './friend-requests.controller.ts';

export const friendRequestsRoutes = async (fastify: FastifyInstance) => {
  fastify.get(
    '/',
    {
      schema: {
        querystring: {
          required: ['direction'],
          type: 'object',
          properties: {
            direction: {
              type: 'string',
              enum: ['in', 'out'],
            },
          },
        },
      },
    },
    friendRequestsController.getFriendRequests
  );

  fastify.post('/', friendRequestsController.makeFriendRequest);
};
