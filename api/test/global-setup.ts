import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';
import { TEST_DATABASE_URL } from './test-db.js';

// Creates the test database if missing, then applies the Drizzle migrations.
export default async function setup() {
  const url = new URL(TEST_DATABASE_URL);
  const name = url.pathname.slice(1);
  url.pathname = '/postgres';
  const admin = new pg.Client({ connectionString: url.toString() });
  await admin.connect();
  const { rowCount } = await admin.query(
    'select 1 from pg_database where datname = $1',
    [name],
  );
  if (!rowCount) await admin.query(`create database ${name}`);
  await admin.end();

  const db = drizzle(TEST_DATABASE_URL);
  await migrate(db, { migrationsFolder: './drizzle' });
  await db.$client.end();
}
