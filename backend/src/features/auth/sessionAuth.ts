import type { FastifyReply, FastifyRequest } from 'fastify';
import { DateTime } from 'luxon';
import { encryptWithSalt } from '../../utils/controllerUtils.ts';
import { sessionRepository } from '../session/session.repository.ts';

export const sessionAuth = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const sessionToken = req.raw.headers['x-session-token'] as string;

    if (!sessionToken) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const { db } = req.server;

    const encryptedSessionToken = encryptWithSalt(sessionToken);

    const session = await sessionRepository.getSessionByToken(
      db,
      encryptedSessionToken
    );

    if (!session) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    if (session.valid_until < DateTime.utc()) {
      await sessionRepository.deleteSessionsByUserId(db, session.user_id);

      return res.status(401).send({ error: 'Unauthorized' });
    }

    // Here, the session is valid
    await sessionRepository.updateSessionValidUntil(
      db,
      session.user_id,
      DateTime.utc().plus({ minutes: 10 }).toSQL()
    );

    req.session = {
      userId: session.user_id,
    };
  } catch (error) {
    req.log.error(error);
    res.code(500).send({ error: 'Internal server error' });
  }
};
