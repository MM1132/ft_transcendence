import type { Client } from 'pg';

declare module 'fastify' {
  interface FastifyInstance {
    db: Client;
  }
}
