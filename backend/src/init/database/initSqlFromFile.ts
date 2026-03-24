import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { Client } from 'pg';

export const runSqlFromFile = async (
  client: Client,
  baseDir: string,
  filename: string
) => {
  const rawSql = readFileSync(path.join(baseDir, filename), {
    encoding: 'utf8',
    flag: 'r',
  });
  await client.query(rawSql);
};
