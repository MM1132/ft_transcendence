import dotenv from 'dotenv';
import Fastify, { type FastifyInstance } from 'fastify';
import { Client } from 'pg';
import { initDatabase } from './initDatabase.ts';

// Environment variables shit
dotenv.config({ path: '../.env' });

// PostgreSQL shit
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
const server: FastifyInstance = Fastify({});

server.get('/ping', async (_request, _reply) => {
  return { pongg: `it worked!!` };
});

const start = async (): Promise<void> => {
  await client.connect();
  console.log('Database: Connected!');

  await initDatabase(client);

  try {
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    await server.listen({ port });
    console.log(`http://localhost:3000/ping`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
