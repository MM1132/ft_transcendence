import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { FastifyInstance } from 'fastify';
import { DateTime } from 'luxon';
import { Client, types } from 'pg';

export const initDatabase = async (
  fastify: FastifyInstance
): Promise<Client> => {
  // Make TIMESTAMPZ value automatically be read from the DB as utc DateTime
  types.setTypeParser(types.builtins.TIMESTAMPTZ, (value) => {
    return DateTime.fromSQL(value, { zone: 'utc' });
  });
  types.setTypeParser(types.builtins.DATE, (value) => {
    if (value === null) return null;
    return DateTime.fromISO(value, { zone: 'utc' });
  });

  const client = new Client({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST ?? 'localhost',
    ...(process.env.POSTGRES_PORT && {
      port: parseInt(process.env.POSTGRES_PORT, 10),
    }),
    database: process.env.POSTGRES_DB,
  });

  try {
    await client.connect();
    console.log('✅ Database: Connected');
  } catch (_error) {
    console.log(_error);
    throw new Error('❌ Database: Connecting failed');
  }

  // Execute the initialization SQL
  const initSql = readFileSync(
    path.join(fastify.baseDir, '/src/init/queries/init.sql'),
    {
      encoding: 'utf8',
      flag: 'r',
    }
  );

  await client.query(initSql);
  console.log(`✅ Database: Initialized`);

  return client;
};
