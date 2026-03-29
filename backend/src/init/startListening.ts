import type { FastifyInstance } from 'fastify';
import { setupWebSocket } from '../websocket/index.ts';

export const startListening = async (
  fastify: FastifyInstance
): Promise<void> => {
  try {
    await setupWebSocket(fastify, fastify.db);
    console.log(`🚀 Starting server on port ${fastify.port}...`);
    await fastify.listen({ port: fastify.port, host: '0.0.0.0' });
    console.log(`✅ Server listening on port ${fastify.port}`);
  } catch (err) {
    console.error('❌ startListening error:', err);
    fastify.log.error(err);
    process.exit(1);
  }
};
