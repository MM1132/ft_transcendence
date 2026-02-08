import type { FastifyReply, FastifyRequest } from 'fastify';
import { DuplicateDataError } from '../../utils/repositoryTypes.ts';
import { NoAvatarToDeleteError } from '../../utils/serviceTypes.ts';
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
        res.status(404).send({ error: `No user with id ${id}` });
      } else {
        res.status(200).send(user);
      }
    } catch (err) {
      req.log.error(err);
      res.status(500).send({ error: 'Internal server error' });
    }
  },

  changeUserAvatar: async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const { db, baseDir, baseUrl } = req.server;

      if (!req.isMultipart())
        return res.status(400).send({ error: 'Request must be multipart' });

      const data = await req.file({ limits: { fileSize: 2000000 } });
      if (!data?.mimetype.includes('image'))
        return res
          .status(400)
          .send({ error: 'You can only upload an image as avatar' });

      if (!data) return res.status(400).send({ error: 'No file provided' });

      const fileDataBuffer = await data.toBuffer();

      const fullFilePath = await userService.uploadAvatar(
        db,
        req.session.userId,
        fileDataBuffer,
        baseDir,
        baseUrl
      );

      res.status(200).send({ avatarUrl: `${fullFilePath}` });
    } catch (error) {
      if (
        error instanceof req.server.multipartErrors.RequestFileTooLargeError
      ) {
        return res.status(413).send({ error: 'Avatar image 2 mb maximum' });
      }

      req.log.error(error);
      console.log(error);
      res.status(500).send({ error: 'Internal server error' });
    }
  },

  deleteAvatar: async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const { db, baseDir } = req.server;

      await userService.deleteAvatar(db, req.session.userId, baseDir);

      res.status(200).send({ status: 'Successfully deleted user avatar!' });
    } catch (error) {
      if (error instanceof NoAvatarToDeleteError)
        return res.status(400).send({ error: error.message });

      console.log(error);
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
};
