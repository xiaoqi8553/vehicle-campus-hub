# SQLite migration archive

These migrations describe the pre-PostgreSQL history and are retained for audit only.

- Do not run this directory with `prisma migrate deploy`.
- Active PostgreSQL migrations live in `prisma/migrations/`.
- Use `scripts/migrate-sqlite-to-postgres.ts` to copy the final SQLite snapshot into an empty PostgreSQL database.
- The original `prisma/dev.db` remains local and is ignored by Git.
