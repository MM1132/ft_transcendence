import fs, { readFileSync, writeFileSync } from 'node:fs';
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
    path.join(fastify.baseDir, '/src/database/init.sql'),
    {
      encoding: 'utf8',
      flag: 'r',
    }
  );
  await client.query(initSql);
  console.log(`✅ Database: Initialized`);

  // Migrations: get latest migration
  const latestMigrationFilename = path.join(
    fastify.baseDir,
    'src/database/latest_migration.txt'
  );

  let latestMigration = 0;
  if (fs.existsSync(latestMigrationFilename)) {
    const latestMigrationString = readFileSync(latestMigrationFilename, {
      encoding: 'utf8',
      flag: 'r',
    });
    if (latestMigrationString)
      latestMigration = parseInt(latestMigrationString, 10);
  }

  // Apply migrations
  const migrations = fs
    .readdirSync(path.join(fastify.baseDir, '/src/database/migrations'))
    .map((v) => parseInt(v, 10))
    .filter((v) => v)
    .sort();

  for (const migration of migrations) {
    if (latestMigration < migration) {
      const fileName = path.join(
        fastify.baseDir,
        'src/database/migrations',
        `${migration}.sql`
      );

      const migrationSql = readFileSync(fileName, {
        encoding: 'utf8',
        flag: 'r',
      });

      await client.query(migrationSql);
      console.log(`Database: applied migration ${migration}`);

      writeFileSync(latestMigrationFilename, migration.toString());
    }
  }

  console.log(`✅ Database: Migrations applied`);

  return client;
};
