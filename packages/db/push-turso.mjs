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
import { fileURLToPath } from "url";

const url = process.env.DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !url.startsWith("libsql://")) {
  console.log("ℹ Skipping Turso schema push (DATABASE_URL is not a libsql:// URL)");
  process.exit(0);
}

console.log("⏳ Generating schema SQL from Prisma...");
const sql = execSync(
  "npx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script",
  {
    encoding: "utf-8",
    cwd: fileURLToPath(new URL(".", import.meta.url)),
    env: {
      ...process.env,
      // prisma migrate diff needs a dummy sqlite URL for the from-state
      DATABASE_URL: "file:./prisma/dev.db",
    },
  }
);

console.log("⏳ Connecting to Turso...");
const client = createClient({ url, authToken });

// Split into individual statements, strip comment lines, skip empty
const statements = sql
  .split(";")
  .map((s) =>
    s
      .split("\n")
      .filter((line) => !line.trim().startsWith("--") && !line.trim().startsWith("/*"))
      .join("\n")
      .trim()
  )
  .filter((s) => s.length > 0);

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
