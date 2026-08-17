import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { db, pool } from '../config/db.js';
import { users } from '../models/schema.js';
import { eq } from 'drizzle-orm';

async function seed() {
  const adminEmail = 'admin@gmail.com';

  const existing = await db.query.users.findFirst({
    where: eq(users.email, adminEmail),
  });

  if (existing) {
    console.log('Admin user already exists, skipping seed.');
  } else {
    const hashedPassword = await bcrypt.hash('Admin@1234', 10);
    await db.insert(users).values({
      name: 'System Administrator Account',
      email: adminEmail,
      password: hashedPassword,
      address: 'Head Office, Platform HQ',
      role: 'admin',
    });
    console.log('Seeded default admin user:');
    console.log(`  email: ${adminEmail}`);
    console.log('  password: Admin@1234');
  }

  await pool.end();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
