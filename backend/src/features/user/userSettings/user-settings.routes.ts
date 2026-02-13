import type { FastifyInstance } from 'fastify';
import { sessionAuth } from '../../auth/sessionAuth.ts';
import { userSettingsController } from './user-settings.controller.ts';

export const userSettingsRoutes = (fastify: FastifyInstance) => {
  fastify.put(
    '/',
    {
      preValidation: sessionAuth,
      schema: {
        body: {
          type: 'object',
          additionalProperties: false,
          properties: {
            birthday: { type: ['string', 'null'], format: 'date' },
            fullName: {
              type: ['string', 'null'],
              maxLength: 100,
              minLength: 1,
            },
          },
        },
      },
    },
    userSettingsController.updateUserSettings
  );

  fastify.get(
    '/',
    { preValidation: sessionAuth },
    userSettingsController.getUserSettings
  ),
    fastify.put(
      '/avatar',
      { preValidation: sessionAuth },
      userSettingsController.changeUserAvatar
    );

  fastify.delete(
    '/avatar',
    { preValidation: sessionAuth },
    userSettingsController.deleteAvatar
  );
};
