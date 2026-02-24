import type { FastifyInstance } from 'fastify';

export const startListening = async (
  fastify: FastifyInstance
): Promise<void> => {
  try {
    await fastify.listen({ port: fastify.port, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
