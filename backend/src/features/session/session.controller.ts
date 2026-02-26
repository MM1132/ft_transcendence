import type { FastifyReply, FastifyRequest } from 'fastify';
import { DuplicateDataError } from '../../utils/repositoryTypes.ts';
import { userRespository } from '../user/user.repository.ts';
import { userService } from '../user/user.service.ts';
import { sessionService } from './session.service.ts';

export interface LoginRequestBody {
  username: string;
  password: string;
}

export interface CreateUserBody {
  username: string;
  password: string;
  email: string;
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
        return res.status(401).send({ error: 'Wrong username or password' });
      }

      await userRespository.updateUserLastAction(db, loginResult.userId);

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

  createUser: async (
    req: FastifyRequest<{ Body: CreateUserBody }>,
    res: FastifyReply
  ) => {
    try {
      const { db, baseUrl } = req.server;

      const username = req.body.username;
      const password = req.body.password;
      const email = req.body.email;

      const createdUser = await userService.createUser(
        db,
        username,
        password,
        email,
        baseUrl
      );

      res.status(200).send(createdUser);
    } catch (err) {
      if (err instanceof DuplicateDataError) {
        return res.status(409).send({ error: err.message });
      }

      req.log.error(err);
      res.status(500).send({ error: 'Internal server error' });
    }
  },
};
