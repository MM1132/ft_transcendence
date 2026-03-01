import type { Client } from 'pg';

declare module 'fastify' {
  interface FastifyInstance {
    baseUrl: string;
    baseDir: string;
    frontendOrigin: string;
    db: Client;
    port: number;
  }
  interface FastifyRequest {
    session: {
      userId: string;
    };
  }
  interface FastifyContextConfig {
    isPublic?: boolean;
  }
}
