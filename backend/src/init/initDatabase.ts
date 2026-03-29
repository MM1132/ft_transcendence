import fs, { readFileSync } from 'node:fs';
import path from 'node:path';
import type { FastifyInstance } from 'fastify';
import { DateTime } from 'luxon';
import { Client, types } from 'pg';
import { applyMigrations } from './database/applyMigrations.ts';
import { runSqlFromFile } from './database/initSqlFromFile.ts';

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
  await runSqlFromFile(client, fastify.baseDir, '/src/database/init.sql');
  console.log(`✅ Database: Executed init.sql`);

  await runSqlFromFile(
    client,
    fastify.baseDir,
    '/src/database/init_migrations.sql'
  );
  console.log(`✅ Database: Executed init_migrations.sql`);

  await applyMigrations(client, fastify.baseDir);
  console.log(`✅ Database: Migrations applied`);
  return client;
};
