import type { FastifyReply, FastifyRequest } from 'fastify';
import { sessionService } from './session.service.ts';

interface LoginRequestBody {
  username: string;
  password: string;
}

export const sessionController = {
  login: async (
    req: FastifyRequest<{ Body: LoginRequestBody }>,
    res: FastifyReply
  ) => {
    try {
      const { db } = req.server;

      const username = req.body.username;
      const password = req.body.password;

      const loginResult = await sessionService.login(db, username, password);

      if (!loginResult) {
        res.status(401).send({ error: 'Unauthorized' });
      }

      res.status(200).send(loginResult);
    } catch (_error) {
      res.status(500).send({ error: 'Internal server error' });
    }
  },

  logout: async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const { db } = req.server;

      await sessionService.logout(db, req.session.userId);

      res.status(200).send({ success: 'You logged out!' });
    } catch (_error) {
      res.status(500).send({ error: 'Internal server error' });
    }
  },
};
