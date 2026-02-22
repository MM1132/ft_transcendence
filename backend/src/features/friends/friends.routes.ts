import type { FastifyInstance } from 'fastify';
import { friendsController } from './friends.controller.ts';
import type { FriendParams } from './requests/friend-requests.controller.ts';

export const friendsRoutes = (fastify: FastifyInstance) => {
  fastify.get('/', friendsController.getMyFriends);

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
    friendsController.removeFriend
  );
};
