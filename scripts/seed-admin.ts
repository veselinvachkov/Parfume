// Run once: pnpm tsx scripts/seed-admin.ts
import bcrypt from "bcryptjs";
import Database from "better-sqlite3";

const email = process.env.ADMIN_EMAIL ?? "veselin.gvv@gmail.com";
const password = process.env.ADMIN_PASSWORD ?? "vesoeqk123";
const hash = bcrypt.hashSync(password, 12);

const sqlite = new Database("./local.db");
sqlite.pragma("foreign_keys = ON");

sqlite
  .prepare(
    "INSERT OR IGNORE INTO admin_users (email, password_hash) VALUES (?, ?)"
  )
  .run(email, hash);

console.log(`Admin seeded: ${email} / ${password}`);
sqlite.close();
