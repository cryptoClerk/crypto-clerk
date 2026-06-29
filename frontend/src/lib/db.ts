import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

function getPrismaClient() {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";
  const dbPath = databaseUrl.replace("file:", "");
  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  const prisma = new PrismaClient({ adapter, log: ["error"] });

  globalForPrisma.prisma = prisma;

  return prisma;
}

export const prisma = getPrismaClient();
