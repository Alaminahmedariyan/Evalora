import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import config from "../app/config";

// config.ts already loads and validates DATABASE_URL via dotenv/config + zod,
// so we read it from there instead of process.env directly — this keeps a
// single source of truth and fails fast (via config.ts) on a missing/invalid URL.
const adapter = new PrismaPg({ connectionString: config.database.url });

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (config.app.env !== "production") {
    globalForPrisma.prisma = prisma;
}