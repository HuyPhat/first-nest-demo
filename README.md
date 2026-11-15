# first-nest-demo

User registration and login: a NestJS API (`api/`), with a Next.js web app to follow.

## API

```bash
docker compose up -d          # local PostgreSQL
cd api
pnpm install
cp .env.example .env          # DATABASE_URL and JWT_SECRET are required
pnpm db:migrate
pnpm start:dev
pnpm test                     # runs against the first_nest_test database in the same PostgreSQL
```
