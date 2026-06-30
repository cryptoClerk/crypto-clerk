import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Validate required environment variables at startup
if (!process.env.DATABASE_URL) {
  console.warn("WARNING: DATABASE_URL not set.");
}

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

function getPrismaClient() {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter, log: ["error"] });

  globalForPrisma.prisma = prisma;

  return prisma;
}

export const prisma = getPrismaClient();
