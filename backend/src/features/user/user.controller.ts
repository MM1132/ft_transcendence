import type { FastifyReply, FastifyRequest } from 'fastify';
import { DuplicateDataError } from '../../utils/repositoryTypes.ts';
import { userService } from './user.service.ts';

export interface UserIdParams {
  id: string;
}

export interface CreateUserBody {
  username: string;
  password: string;
}

/*
Controller must:
- Extract data from request
- Call service
- Format response for HTTP
- Handle HTTP-specific concerns
*/
export const userController = {
  getAllUsers: async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const { db, baseUrl } = req.server;

      const allUsers = await userService.getAllUsers(db, baseUrl);

      res.status(200).send(allUsers);
    } catch (err) {
      req.log.error(err);
      res.status(500).send({ error: 'Internal server error' });
    }
  },

  getMyUser: async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const { db, baseUrl } = req.server;

      const user = await userService.getUserById(
        db,
        req.session.userId,
        baseUrl
      );

      if (!user) {
        res
          .status(404)
          .send({ error: `No user with id ${req.session.userId}` });
      } else {
        res.status(200).send(user);
      }
    } catch (error) {
      req.log.error(error);
      console.log(error);
      res.status(500).send({ error: 'Internal server error' });
    }
  },

  getUserById: async (
    req: FastifyRequest<{ Params: UserIdParams }>,
    res: FastifyReply
  ) => {
    try {
      const { db, baseUrl } = req.server;

      const id = req.params.id;

      const user = await userService.getUserById(db, id, baseUrl);

      if (!user) {
        res.status(404).send({ error: `User with id ${id} was not found` });
      } else {
        res.status(200).send(user);
      }
    } catch (err) {
      console.log(err);
      req.log.error(err);
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

      const createdUser = await userService.createUser(
        db,
        username,
        password,
        baseUrl
      );

      res.status(200).send(createdUser);
    } catch (err) {
      if (err instanceof DuplicateDataError)
        return res
          .status(409)
          .send({ error: `User with this name already exists` });

      req.log.error(err);
      res.status(500).send({ error: 'Internal server error' });
    }
  },

  getOnlineUsers: async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const { db, baseUrl } = req.server;

      const onlineUsers = await userService.getOnlineUsers(db, baseUrl);

      return res.status(200).send(onlineUsers);
    } catch (error) {
      req.log.error(error);
      res.status(500).send({ error: 'Internal server error' });
    }
  },
};
