import type { FastifyInstance } from 'fastify';
import {
  type FriendParams,
  friendRequestsController,
  type MakeFriendRequestBody,
} from './friend-requests.controller.ts';

export const friendRequestsRoutes = async (fastify: FastifyInstance) => {
  fastify.get(
    '/',
    {
      schema: {
        querystring: {
          type: 'object',
          additionalProperties: false,
          properties: {
            direction: {
              type: 'string',
              enum: ['in', 'out'],
            },
          },
          required: ['direction'],
        },
      },
    },
    friendRequestsController.getFriendRequests
  );

  fastify.post<{ Body: MakeFriendRequestBody }>(
    '/',
    {
      schema: {
        body: {
          additionalProperties: false,
          type: 'object',
          properties: {
            userId: { type: 'string', format: 'uuid' },
          },
          required: ['userId'],
        },
      },
    },
    friendRequestsController.makeFriendRequest
  );

  fastify.delete<{ Params: FriendParams }>(
    '/:userId',
    {
      schema: {
        params: {
          type: 'object',
          additionalProperties: false,
          properties: {
            userId: { type: 'string', format: 'uuid' },
          },
          required: ['userId'],
        },
      },
    },
    friendRequestsController.deleteFriendRequest
  );
};
