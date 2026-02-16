import type { FastifyInstance } from 'fastify';
import { userSettingsController } from './user-settings.controller.ts';

export const userSettingsRoutes = (fastify: FastifyInstance) => {
  fastify.put(
    '/',
    {
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

  fastify.get('/', userSettingsController.getUserSettings);

  fastify.put('/avatar', userSettingsController.changeUserAvatar);

  fastify.delete('/avatar', userSettingsController.deleteAvatar);
};
