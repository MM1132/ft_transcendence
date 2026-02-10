import type { FastifyInstance } from 'fastify';

export const startListening = async (
  fastify: FastifyInstance
): Promise<void> => {
  try {
    await fastify.listen({ port: fastify.port });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
