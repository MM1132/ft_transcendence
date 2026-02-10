import path from 'node:path';
import dotenv from 'dotenv';
import type { FastifyInstance } from 'fastify';
import { initDatabase } from './initDatabase.ts';

dotenv.config();

export const addDecorators = async (fastify: FastifyInstance) => {
  const port = process.env.BACKEND_PORT
    ? parseInt(process.env.BACKEND_PORT, 10)
    : 3000;
  fastify.decorate('port', port);

  const baseDir = process.env.BACKEND_ROOT_PATH
    ? process.env.BACKEND_ROOT_PATH
    : path.join(import.meta.dirname, '../..');
  fastify.decorate('baseDir', baseDir);

  const baseUrl = process.env.BACKEND_URL
    ? `http://${process.env.BACKEND_URL}:${port}`
    : `no_url_provided`;
  fastify.decorate('baseUrl', baseUrl);

  try {
    const client = await initDatabase(fastify);
    fastify.decorate('db', client);
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error: ${error.message}`);
    }
    return;
  }
};
