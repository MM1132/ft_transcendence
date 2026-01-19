import { readFileSync } from 'node:fs';
import dotenv from 'dotenv';
import Fastify, { type FastifyInstance } from 'fastify';
import { Client } from 'pg';

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
client.connect();

const initSql = readFileSync('./src/queries/init.sql', {
  encoding: 'utf8',
  flag: 'r',
});
// console.log(initSql);
client.query(initSql);

process.exit(0);

// Fastify shit
const server: FastifyInstance = Fastify({});

server.get('/ping', async (_request, _reply) => {
  return { pongg: `it worked!!` };
});

const start = async (): Promise<void> => {
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
