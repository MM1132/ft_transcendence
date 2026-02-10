import type { FastifyInstance } from 'fastify';
import { initDatabase } from './initDatabase.ts';

export const startListening = async (
  fastify: FastifyInstance
): Promise<void> => {
  try {
    const client = await initDatabase(fastify);
    fastify.decorate('db', client);
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error: ${error.message}`);
    }
    return;
  }

  try {
    await fastify.listen({ port: fastify.port });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
