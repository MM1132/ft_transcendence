import type { FastifyReply, FastifyRequest } from 'fastify';
import { handleGeneralError } from '../../../utils/controllerUtils.ts';
import {
  mapDeleteFriendRequestStatus,
  mapMakeFriendRequestStatus,
} from './friend-requests.mapper.ts';
import { friendRequestsService } from './friend-requests.service.ts';

export interface MakeFriendRequestBody {
  userId: string;
}

export interface FriendRequestIdParams {
  userId: string;
}

export const friendRequestsController = {
  getFriendRequests: async (
    req: FastifyRequest<{ Querystring: { direction: 'in' | 'out' } }>,
    res: FastifyReply
  ) => {
    try {
      const { db, baseUrl } = req.server;
      const { userId } = req.session;
      const direction = req.query.direction as string;

      switch (direction) {
        case 'in': {
          const incomingFriendRequests =
            await friendRequestsService.getIncomingFriendRequests(
              db,
              userId,
              baseUrl
            );
          return res.status(200).send(incomingFriendRequests);
        }
        case 'out': {
          const outgoingFriendRequests =
            await friendRequestsService.getOutgoingFriendRequests(
              db,
              userId,
              baseUrl
            );
          return res.status(200).send(outgoingFriendRequests);
        }
      }
    } catch (error) {
      handleGeneralError(req, res, error);
    }
  },

  makeFriendRequest: async (
    req: FastifyRequest<{ Body: MakeFriendRequestBody }>,
    res: FastifyReply
  ) => {
    try {
      const { db } = req.server;
      const { userId: userFromId } = req.session;
      const { userId: userToId } = req.body;

      const outcome = await friendRequestsService.makeFriendRequest(
        db,
        userFromId,
        userToId
      );

      if (outcome === 'OTHER') throw new Error('Internal server error');

      return res.status(outcome === 'CREATED' ? 200 : 400).send({
        status: outcome,
        message: mapMakeFriendRequestStatus(outcome),
      });
    } catch (error) {
      handleGeneralError(req, res, error);
    }
  },

  deleteFriendRequest: async (
    req: FastifyRequest<{ Params: FriendRequestIdParams }>,
    res: FastifyReply
  ) => {
    try {
      const { db } = req.server;
      const { userId } = req.session;
      const { userId: userToId } = req.params;

      const outcome = await friendRequestsService.deleteFriendRequest(
        db,
        userId,
        userToId
      );

      return res.status(outcome === 'DELETE_SUCCESS' ? 200 : 400).send({
        status: outcome,
        message: mapDeleteFriendRequestStatus(outcome),
      });
    } catch (error) {
      handleGeneralError(req, res, error);
    }
  },
};
