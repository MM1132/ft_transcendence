import type { FastifyReply, FastifyRequest } from 'fastify';
import { userRespository } from '../../repositories/user.repository.ts';

interface UserIdParams {
  id: string;
}

interface CreateUserBody {
  username: string;
  password: string;
}

interface UserResult {
  id: number;
  username: string;
  createdAt: string;
}

const userRowToResult = (userRow: any): UserResult => ({
  id: parseInt(userRow.id, 10),
  username: userRow.username,
  createdAt: userRow.created_at,
});

export const userController = {
  getUserById: async (
    req: FastifyRequest<{ Params: UserIdParams }>,
    res: FastifyReply
  ) => {
    const { db } = req.server;

    const id = parseInt(req.params.id, 10);

    const userRow = (await userRespository.getUserById(db, id)).rows[0];
    if (!userRow) return res.status(404).send(`No user with id ${id}`);

    const userResult = userRowToResult(userRow);

    return res.status(200).send(userResult);
  },
  getAllUsers: async (req: FastifyRequest, res: FastifyReply) => {
    const { db } = req.server;

    const repositoryUsers = await userRespository.getAllUsers(db);

    const allUsersResult = repositoryUsers.rows.map((userRow) =>
      userRowToResult(userRow)
    );

    res.send(allUsersResult);
  },
  createUser: async (
    req: FastifyRequest<{ Body: CreateUserBody }>,
    res: FastifyReply
  ) => {
    const { db } = req.server;

    await userRespository.insertNewUserToDatabase(db, {
      username: req.body.username,
      password: req.body.password,
    });

    const createdUserRow = (
      await userRespository.getUserByUsername(db, req.body.username)
    ).rows[0];

    const userResult = userRowToResult(createdUserRow);

    res
      .code(200)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(userResult);
  },
};
