import type { FastifyReply, FastifyRequest } from 'fastify';
import { DuplicateDataError } from '../../utils/repositoryTypes.ts';
import { userService } from './user.service.ts';

interface UserIdParams {
  id: string;
}

interface CreateUserBody {
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
      const { db } = req.server;

      const allUsers = await userService.getAllUsers(db);

      res.status(200).send(allUsers);
    } catch (err) {
      req.log.error(err);
      res.status(500).send({ error: 'Internal server error' });
    }
  },

  getUserById: async (
    req: FastifyRequest<{ Params: UserIdParams }>,
    res: FastifyReply
  ) => {
    try {
      const { db } = req.server;

      const id = parseInt(req.params.id, 10);

      const user = await userService.getUserById(db, id);

      if (!user) {
        res.status(404).send({ error: `No user with id ${id}` });
      } else {
        res.status(200).send(user);
      }
    } catch (err) {
      req.log.error(err);
      res.status(500).send({ error: 'Internal server error' });
    }
  },

  createUser: async (
    req: FastifyRequest<{ Body: CreateUserBody }>,
    res: FastifyReply
  ) => {
    try {
      const { db } = req.server;

      const username = req.body.username;
      const password = req.body.password;

      const createdUser = await userService.createUser(db, username, password);

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
};
