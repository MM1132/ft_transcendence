import type { FastifyReply, FastifyRequest } from 'fastify';
import { sessionRepository } from '../session/session.repository.ts';

export const sessionAuth = async (req: FastifyRequest, res: FastifyReply) => {
  const sessionToken = req.raw.headers['x-session-token'] as string;

  if (!sessionToken) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  const { db } = req.server;

  const session = await sessionRepository.getSessionByToken(db, sessionToken);

  if (!session) {
    return res.status(401).send({ error: 'Unauthorized' });
  }
};
