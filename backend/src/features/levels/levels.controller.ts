import type { FastifyReply, FastifyRequest } from 'fastify';
import { levelsService } from './levels.service.ts';

export const skillsController = {
  work: async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const { userId } = req.session;
      const { db } = req.server;

      const response = await levelsService.work(db, userId);

      res.status(200).send(response);
    } catch (error) {
      res.log.error(error);
      console.log(error);
      return res.status(500).send({ error: 'Internal server error' });
    }
  },
};
