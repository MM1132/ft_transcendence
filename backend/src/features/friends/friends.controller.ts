import type { FastifyReply, FastifyRequest } from 'fastify';
import { handleGeneralError } from '../../utils/controllerUtils.ts';
import { friendsService } from './friends.service.ts';
import type { FriendParams } from './requests/friend-requests.controller.ts';

export const friendsController = {
  getMyFriends: async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const { db, baseUrl } = req.server;
      const { userId } = req.session;

      const friendsResponse = await friendsService.getMyFriends(
        db,
        userId,
        baseUrl
      );

      return res.status(200).send(friendsResponse);
    } catch (error) {
      return handleGeneralError(req, res, error);
    }
  },

  removeFriend: async (
    req: FastifyRequest<{ Params: FriendParams }>,
    res: FastifyReply
  ) => {
    try {
      const { userId: targetUserId } = req.params;

      const { db } = req.server;
      const { userId } = req.session;

      const removeResult = await friendsService.removeFriend(
        db,
        userId,
        targetUserId
      );

      return res
        .status(removeResult.status === 'FRIEND_REMOVED_SUCCESS' ? 200 : 400)
        .send(removeResult);
    } catch (error) {
      return handleGeneralError(req, res, error);
    }
  },
};
