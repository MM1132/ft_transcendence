import path from 'node:path';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import dotenv from 'dotenv';
import Fastify, { type FastifyInstance } from 'fastify';
import { DateTime } from 'luxon';
import { Client, types } from 'pg';
import { sessionRoutes } from './features/session/session.routes.ts';
import { userRoutes } from './features/user/user.routes.ts';
import { initDatabase } from './initDatabase.ts';

// Environment variables shit
dotenv.config({ path: ['../.env'] });

// PostgreSQL shit
types.setTypeParser(types.builtins.TIMESTAMPTZ, (value) => {
  return DateTime.fromSQL(value, { zone: 'utc' });
});

const client = new Client({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: 'localhost',
  ...(process.env.POSTGRES_PORT && {
    port: parseInt(process.env.POSTGRES_PORT, 10),
  }),
  database: process.env.POSTGRES_DB,
});

// Fastify shit
const fastify: FastifyInstance = Fastify({
  ajv: {
    customOptions: {
      coerceTypes: false,
      removeAdditional: false,
    },
  },
});

fastify.decorate('db', client);

fastify.register(multipart);

fastify.register(fastifyStatic, {
  root: path.join(import.meta.dirname, '../static'),
  prefix: '/static',
});

// Register all the routes
fastify.register(sessionRoutes, { prefix: '/api/v1/session' });
fastify.register(userRoutes, { prefix: '/api/v1/user' });

const start = async (): Promise<void> => {
  try {
    await client.connect();
    console.log('Database: Connected!');
  } catch (_error) {
    console.log(
      'Database not running, run the database and start the server again'
    );
    return;
  }

  await initDatabase(client);

  try {
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    await fastify.listen({ port });

    // fastify.log.info(`Backend running: ${fastify.server.address()?.toString}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
