# first-nest-demo

User registration and login: a NestJS API (`api/`), and a Next.js web app (`web/`).

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

## Web

Runs on port 3001 next to the API on 3000. The browser only talks to the web app; Next.js rewrites `/api/*` to the API (`API_URL`, default `http://localhost:3000`), so there is no CORS ([ADR 0001](docs/adr/0001-jwt-in-httponly-cookie-with-nextjs-rewrite.md)).

```bash
cd web
pnpm install
pnpm dev                      # with the API running; open http://localhost:3001
pnpm test                     # Playwright: starts the API (against first_nest_test) and the web app itself
```

There is no Registration page yet; create a User first, for example:

```bash
curl -X POST localhost:3001/api/auth/register -H 'content-type: application/json' \
  -d '{"email":"ann@example.com","password":"correct horse"}'
```
