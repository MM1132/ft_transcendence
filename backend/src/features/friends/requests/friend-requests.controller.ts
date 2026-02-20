import type { FastifyReply, FastifyRequest } from 'fastify';
import { handleGeneralError } from '../../../utils/controllerUtils.ts';

export const friendRequestsController = {
  getFriendRequests: async (
    req: FastifyRequest<{ Querystring: { direction: 'in' | 'out' } }>,
    res: FastifyReply
  ) => {
    try {
      const direction = req.query.direction as string;

      if (direction === 'in') {
        return res.status(200).send({
          notImplemented: 'You are getting your incoming friend requests',
        });
      }
      if (direction === 'out') {
        return res.status(200).send({
          notImplemented: 'You are getting your outgoing friend requests',
        });
      }
    } catch (error) {
      handleGeneralError(req, res, error);
    }
  },

  makeFriendRequest: async (req: FastifyRequest, res: FastifyReply) => {
    try {
      return res.status(200).send({
        notImplemented: 'You are sending a friend request',
      });
    } catch (error) {
      handleGeneralError(req, res, error);
    }
  },
};
