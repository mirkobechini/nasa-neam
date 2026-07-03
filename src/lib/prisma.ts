import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const DB_URL = process.env.DATABASE_URL || "file:./dev.db";

const adapter = new PrismaLibSql({ url: DB_URL });

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? (new PrismaClient({ adapter }) as PrismaClient);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
