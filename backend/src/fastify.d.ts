import type { Client } from 'pg';

declare module 'fastify' {
  interface FastifyInstance {
    db: Client;
    staticDir: string;
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
