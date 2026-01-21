import type { FastifyReply, FastifyRequest } from 'fastify';
import { userRespository } from '../repositories/user.repository.ts';
import { routeNotImplementedYet } from './controllerUtils.ts';

interface CreateUserBody {
  username: string;
  password: string;
}

export const userController = {
  getAllUsers: routeNotImplementedYet,
  getUserById: routeNotImplementedYet,

  createUser: async (
    req: FastifyRequest<{ Body: CreateUserBody }>,
    res: FastifyReply
  ) => {
    const { db } = req.server;

    await userRespository.insertNewUserToDatabase(db, {
      username: req.body.username,
      password: req.body.password,
    });
  },
};
