import { exec } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { DateTime } from 'luxon';
import type { Client } from 'pg';
import { runSqlFromFile } from './initSqlFromFile.ts';
import { migrationsRepository } from './migrations.repository.ts';

interface MigrationFile {
  filename: string;
  dateTime: DateTime<true>;
}

export const applyMigrations = async (client: Client, baseDir: string) => {
  // Get all migration files into list
  let migrationFiles: MigrationFile[] = fs
    .readdirSync(path.join(baseDir, '/src/database/migrations'))
    .map((filename) => {
      const epochTime = filename.split('_')[0];
      if (!epochTime) return null;

      const seconds = parseInt(epochTime, 10);

      const dateTime = DateTime.fromSeconds(seconds, { zone: 'utc' });
      if (!dateTime.isValid) return null;

      return {
        filename,
        dateTime: dateTime as DateTime<true>,
      };
    })
    .filter((v) => !!v)
    .sort((a, b) => a.dateTime.toMillis() - b.dateTime.toMillis());

  // Filter leave only the ones that come after latest migration
  const latestMigration = await migrationsRepository.getLatestMigration(client);
  if (latestMigration?.applied_at.isValid) {
    const latestMigrationEpoch = latestMigration.filename.split('_')[0];
    if (latestMigrationEpoch) {
      const latestMigrationSeconds = parseInt(latestMigrationEpoch, 10);
      const latestMigrationDateTime = DateTime.fromSeconds(
        latestMigrationSeconds,
        { zone: 'utc' }
      );

      if (latestMigrationDateTime.isValid) {
        migrationFiles = migrationFiles.filter(
          (v) => v.dateTime > latestMigrationDateTime
        );
      }
    }
  }

  // Apply them with filenames
  console.log(`Database: Applying ${migrationFiles.length} new Migrations`);
  for (const migration of migrationFiles) {
    await runSqlFromFile(
      client,
      baseDir,
      `/src/database/migrations/${migration.filename}`
    );
    await migrationsRepository.createNewMigration(client, migration.filename);
  }
};
