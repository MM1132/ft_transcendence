import { scryptSync } from 'node:crypto';
import type { FastifyReply, FastifyRequest } from 'fastify';

export const routeNotImplementedYet = async (
  req: FastifyRequest,
  res: FastifyReply
) => {
  res.send('Route not implemented yet');
};

// Returns the hex of the encrypted password
export const encryptPassword = (password: string) => {
  return scryptSync(
    password,
    'the best salt in the entire world and guess what it is secret',
    64
  ).toString('hex');
};
