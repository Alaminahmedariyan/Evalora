import { prisma } from "../../src/lib/prisma";

type TableRow = { tablename: string };

/**
 * Truncate every table in the `public` schema (except `_prisma_migrations`).
 *
 * The table list is discovered dynamically from `pg_tables` rather than being
 * hardcoded, so it stays correct as new models/migrations are added without
 * requiring this helper to be updated by hand.
 */
export async function resetDb(): Promise<void> {
  const tables = await prisma.$queryRaw<TableRow[]>`
		SELECT tablename
		FROM pg_tables
		WHERE schemaname = 'public'
		  AND tablename != '_prisma_migrations'
	`;

  if (tables.length === 0) {
    return;
  }

  const names = tables.map((t) => `"${t.tablename}"`).join(", ");

  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${names} RESTART IDENTITY CASCADE`);
}
