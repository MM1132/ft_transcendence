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

      const loginSuccess = await sessionService.login(db, username, password);

      if (loginSuccess) {
        res
          .status(200)
          .send(
            'Correct credentials, but sessions have not been implemented yet'
          );
      } else {
        res.status(401).send('Have you forgotten your password or something?');
      }
    } catch (error) {}
  },
};
