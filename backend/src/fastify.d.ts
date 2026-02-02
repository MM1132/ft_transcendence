import type { Client } from 'pg';

declare module 'fastify' {
  interface FastifyInstance {
    baseUrl: string;
    baseDir: string;
    db: Client;
    config: {
      PORT: string;
    };
  }
  interface FastifyRequest {
    session: {
      userId: string;
    };
  }
}
