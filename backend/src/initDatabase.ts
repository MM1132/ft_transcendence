import { readFileSync } from 'node:fs';
import type { Client } from 'pg';

export const initDatabase = async (client: Client) => {
  const initSql = readFileSync('./src/queries/init.sql', {
    encoding: 'utf8',
    flag: 'r',
  });

  await client
    .query(initSql)
    .then((_) => {
      console.log(`Database: Init Success`);
    })
    .catch((err) => {
      console.error(err);
    });
};
