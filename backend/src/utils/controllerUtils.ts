import { scryptSync } from 'node:crypto';
import type { FastifyReply, FastifyRequest } from 'fastify';

export const routeNotImplementedYet = async (
  _req: FastifyRequest,
  res: FastifyReply
) => {
  res.send({ error: 'Route not implemented yet' });
};

// Returns the hex of the encrypted password
export const encryptPassword = (password: string) => {
  return scryptSync(
    password,
    'the best salt in the entire world and guess what it is secret',
    64
  ).toString('hex');
};
