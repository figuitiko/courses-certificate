import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function normalizeConnectionString(connectionString: string): string {
  if (!connectionString) {
    return connectionString;
  }

  const hasLibpqCompat = /(?:\?|&)uselibpqcompat=true(?:&|$)/i.test(
    connectionString,
  );
  if (hasLibpqCompat) {
    return connectionString;
  }

  return connectionString.replace(
    /([?&])sslmode=(prefer|require|verify-ca)(?=(&|$))/i,
    "$1sslmode=verify-full",
  );
}

const adapter = new PrismaPg({
  connectionString: normalizeConnectionString(process.env.DATABASE_URL ?? ""),
});

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
