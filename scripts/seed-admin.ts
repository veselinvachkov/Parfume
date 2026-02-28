// Run once: pnpm tsx scripts/seed-admin.ts
import bcrypt from "bcryptjs";
import { createClient } from "@libsql/client";

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "veselin.gvv@gmail.com";
  const password = process.env.ADMIN_PASSWORD ?? "vesoeqk123";
  const hash = await bcrypt.hash(password, 12);

  const client = createClient({
    url: process.env.TURSO_DATABASE_URL ?? "file:local.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  await client.execute({
    sql: "INSERT OR IGNORE INTO admin_users (email, password_hash) VALUES (?, ?)",
    args: [email, hash],
  });

  console.log(`Admin seeded: ${email} / ${password}`);
}

main();
