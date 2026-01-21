import type { FastifyReply, FastifyRequest } from 'fastify';

export const routeNotImplementedYet = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  res.send('Route not implemented yet');
};
