import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient as createLibSQL } from "@libsql/client/web";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const createClient = () => {
  if (global.prisma) {
    return global.prisma;
  }

  let prisma: PrismaClient;

  if (process.env.DATABASE_URL?.startsWith("libsql://")) {
    // Production: use Turso (libsql) adapter
    const libsql = createLibSQL({
      url: process.env.DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    const adapter = new PrismaLibSQL(libsql);
    prisma = new PrismaClient({ adapter });
  } else {
    // Local / CI: plain SQLite via DATABASE_URL
    prisma = new PrismaClient();
  }

  global.prisma = prisma;
  return prisma;
};

export const client = {
  get db() {
    return createClient();
  },
};
