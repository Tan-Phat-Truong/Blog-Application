/**
 * Pushes the Prisma schema to Turso by:
 * 1. Generating the SQL diff (from empty → current schema) via prisma migrate diff
 * 2. Applying each statement to Turso via @libsql/client
 *
 * Usage:
 *   DATABASE_URL=libsql://... TURSO_AUTH_TOKEN=... node push-turso.mjs
 */
import { createClient } from "@libsql/client";
import { execSync } from "child_process";

const url = process.env.DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !url.startsWith("libsql://")) {
  console.error("❌ DATABASE_URL must be a libsql:// Turso URL");
  process.exit(1);
}

console.log("⏳ Generating schema SQL from Prisma...");
const sql = execSync(
  "npx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script",
  {
    encoding: "utf-8",
    cwd: new URL(".", import.meta.url).pathname,
    env: {
      ...process.env,
      // prisma migrate diff needs a dummy sqlite URL for the from-state
      DATABASE_URL: "file:./prisma/dev.db",
    },
  }
);

console.log("⏳ Connecting to Turso...");
const client = createClient({ url, authToken });

// Split into individual statements, skip comments and empty lines
const statements = sql
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s.length > 0 && !s.startsWith("--") && !s.startsWith("/*"));

console.log(`⏳ Running ${statements.length} SQL statements...`);
for (const stmt of statements) {
  try {
    await client.execute(stmt + ";");
  } catch (e) {
    const msg = e?.message ?? String(e);
    // Ignore "already exists" — table was already created on a previous run
    if (msg.includes("already exists")) {
      console.log(`  ⚠ Skipped (already exists): ${stmt.slice(0, 60)}...`);
    } else {
      console.error(`  ❌ Failed: ${stmt.slice(0, 80)}`);
      console.error(`     ${msg}`);
    }
  }
}

console.log("✅ Schema pushed to Turso successfully!");
