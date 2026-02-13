import type { FastifyReply, FastifyRequest } from 'fastify';
import { DateTime } from 'luxon';
import { NoAvatarToDeleteError } from '../../../utils/serviceTypes.ts';
import { userSettingsService } from './user-settings.service.ts';
import type { UpdateUserSettingsRequestBody } from './user-settings.types.ts';

export const userSettingsController = {
  updateUserSettings: async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const { db } = req.server;
      const { userId } = req.session;

      const newUserSettings = req.body as UpdateUserSettingsRequestBody;

      if (newUserSettings.birthday) {
        const birthdayDate = DateTime.fromISO(newUserSettings.birthday, {
          zone: 'utc',
        });
        if (birthdayDate < DateTime.fromISO('1900-01-01'))
          return res
            .status(400)
            .send({ error: 'Birthday cannot be before 1900-01-01' });
        const utcDateTime = DateTime.utc();
        if (birthdayDate > utcDateTime)
          return res.status(400).send({
            error: `Birthday cannot be after ${utcDateTime.toFormat('yyyy-LL-dd')}`,
          });
      }

      const updatedUserSettings = await userSettingsService.updateUserSettings(
        db,
        userId,
        newUserSettings
      );

      return res.status(200).send(updatedUserSettings);
    } catch (error) {
      console.log(error);
      req.log.error(error);
      return res.status(500).send({ error: 'Internal server error' });
    }
  },

  getUserSettings: async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const { db } = req.server;
      const { userId } = req.session;

      const userSettings = await userSettingsService.getUserSettings(
        db,
        userId
      );

      return res.status(200).send(userSettings);
    } catch (error) {
      console.log(error);
      req.log.error(error);
      return res.status(500).send({ error: 'Internal server error' });
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

      const fullFilePath = await userSettingsService.uploadAvatar(
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
      if (error instanceof Error) {
        if (
          error.message.includes('Input buffer') ||
          error.message.includes('Input Buffer')
        ) {
          return res
            .status(415)
            .send({ error: 'The uploaded file is not a valid image' });
        }
      }

      req.log.error(error);
      console.log(error);
      res.status(500).send({ error: 'Internal server error' });
    }
  },

  deleteAvatar: async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const { db, baseDir } = req.server;

      await userSettingsService.deleteAvatar(db, req.session.userId, baseDir);

      res.status(200).send({ status: 'Successfully deleted user avatar!' });
    } catch (error) {
      if (error instanceof NoAvatarToDeleteError)
        return res.status(400).send({ error: error.message });

      console.log(error);
      res.status(500).send({ error: 'Internal server error' });
    }
  },
};
