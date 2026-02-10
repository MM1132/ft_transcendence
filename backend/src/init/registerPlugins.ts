import path from 'node:path';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import type { FastifyInstance } from 'fastify';

export const registerPlugins = (fastify: FastifyInstance) => {
  fastify.register(fastifyMultipart);

  fastify.register(fastifyStatic, {
    root: path.join(fastify.baseDir, '/static'),
    prefix: '/static',
  });
};
