import path from 'node:path';
import cors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import fastifyRateLimit from '@fastify/rate-limit';
import { fastifySchedule } from '@fastify/schedule';
import fastifyStatic from '@fastify/static';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import { AsyncTask, SimpleIntervalJob } from 'toad-scheduler';
import { sessionRepository } from '../features/session/session.repository.ts';

export const registerPlugins = (fastify: FastifyInstance) => {
  fastify.register(fastifyMultipart);

  fastify.register(fastifyStatic, {
    root: path.join(fastify.baseDir, '/static'),
    prefix: '/api/v1/static',
  });

  fastify.register(cors, {
    origin: ['http://localhost:5173', 'http://localhost:8080'],
    allowedHeaders: ['x-session-token', 'x-dev', 'content-type'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });

  fastify.register(fastifyRateLimit, {
    global: true,
    max: 100,
    timeWindow: '1 minute',
    keyGenerator: (req: FastifyRequest) => {
      return req?.session?.userId ?? req.ip;
    },
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
