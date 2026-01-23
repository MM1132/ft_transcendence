import type { FastifyReply, FastifyRequest } from 'fastify';
import { encryptPassword } from '../../utils/controllerUtils.ts';
import { userRespository } from '../user/user.repository.ts';

interface LoginRequestBody {
  username: string;
  password: string;
}

export const sessionController = {
  login: async (
    req: FastifyRequest<{ Body: LoginRequestBody }>,
    res: FastifyReply
  ) => {
    const { db } = req.server;

    const passwordHash = encryptPassword(req.body.password);

    const userRow = await userRespository.getUserByPasswordAndUsername(
      db,
      req.body.username,
      passwordHash
    );

    console.log(userRow);

    if (userRow) {
      console.log('You successfully logged in!');
      res.status(200).send();
    } else {
      res.status(400).send();
    }
  },
};
