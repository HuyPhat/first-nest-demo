# Use Drizzle to access PostgreSQL

We use Drizzle rather than Prisma or TypeORM. This is a learning project that will grow into an e-commerce app, and Drizzle keeps the code close to real SQL (so the SQL is learned, not hidden), infers TypeScript types directly from the table definitions, and needs no code-generation step. The trade-off is fewer tutorials than Prisma or TypeORM; NestJS ships an official `@nestjs/drizzle` module, which we use to provide the database.

## Considered Options

- **Prisma**: smoothest developer experience and an official NestJS guide, but a separate schema language and a generate step, and it hides SQL.
- **TypeORM**: the most NestJS-native (`@nestjs/typeorm`, decorators), but its type safety and migrations are weaker.
