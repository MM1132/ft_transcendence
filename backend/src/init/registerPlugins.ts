import path from 'node:path';
import cors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import { fastifySchedule } from '@fastify/schedule';
import fastifyStatic from '@fastify/static';
import type { FastifyInstance } from 'fastify';
import { AsyncTask, SimpleIntervalJob } from 'toad-scheduler';
import { sessionRepository } from '../features/session/session.repository.ts';

export const registerPlugins = (fastify: FastifyInstance) => {
  fastify.register(fastifyMultipart);

  fastify.register(fastifyStatic, {
    root: path.join(fastify.baseDir, '/static'),
    prefix: '/static',
  });

  fastify.register(cors, {
    origin: 'http://localhost:5173',
    credentials: true,
    exposedHeaders: ['Authorization', 'Content-type'],
  });

  // This is for cleaning up all inactive session from the DB every 10 minutes
  const task = new AsyncTask('Clear inactive sessions', () => {
    return sessionRepository.deleteInactiveSessions(fastify.db);
  });
  const job = new SimpleIntervalJob({ minutes: 10 }, task);

  fastify.register(fastifySchedule);

  fastify.ready().then(() => {
    fastify.scheduler.addSimpleIntervalJob(job);
  });
};
