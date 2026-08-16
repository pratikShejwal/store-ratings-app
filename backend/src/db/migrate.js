import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';

const { Pool } = pg;

async function runMigrations() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: './src/db/migrations' });
  console.log('Migrations complete.');

  // Add a CHECK constraint for rating value range (1-5).
  // Drizzle-kit doesn't generate CHECK constraints from schema, so we add it here idempotently.
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'ratings_value_check'
      ) THEN
        ALTER TABLE ratings ADD CONSTRAINT ratings_value_check CHECK (value >= 1 AND value <= 5);
      END IF;
    END $$;
  `);
  console.log('Ensured ratings value CHECK constraint.');

  await pool.end();
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
