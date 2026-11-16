# first-nest-demo

User registration and login: a NestJS API (`api/`) and a Next.js web app (`web/`). A learning and portfolio project that is meant to grow into an e-commerce app.

## Status

| Part | Done | Not yet |
|---|---|---|
| API | Registration, Login, Logout, Me, Swagger | Refresh tokens, rate limiting, request logging |
| Web | Login page, profile page | Registration and Logout pages ([#16](https://github.com/HuyPhat/first-nest-demo/issues/16)) |

The full backlog is in [GitHub Issues](https://github.com/HuyPhat/first-nest-demo/issues); the spec is [#11](https://github.com/HuyPhat/first-nest-demo/issues/11).

## Stack

- **API:** NestJS 12, Drizzle ORM on PostgreSQL 17, argon2 password hashing, JWT in an HttpOnly cookie, Swagger. Tests with Vitest and supertest.
- **Web:** Next.js 16 (App Router), React 19, Tailwind CSS 4. End-to-end tests with Playwright.
- **Tooling:** pnpm, oxlint (api), ESLint (web), GitHub Actions CI.

## Layout

```text
api/        NestJS API (port 3000)
web/        Next.js web app (port 3001)
docs/adr/   Architecture decisions
docs/agents Notes for AI agents (issue tracker, triage labels, domain docs)
GLOSSARY.md Domain language (User, Registration, Login, ...)
PRODUCT.md  Product and design context for the web UI
```

## Getting started

You need Node.js 24, pnpm and Docker.

```bash
docker compose up -d          # local PostgreSQL (database first_nest)

# API
cd api
pnpm install
cp .env.example .env          # DATABASE_URL and JWT_SECRET are required
pnpm db:migrate
pnpm start:dev                # http://localhost:3000

# Web, in a second terminal
cd web
pnpm install
pnpm dev                      # http://localhost:3001
```

There is no Registration page yet, so create a User first:

```bash
curl -X POST localhost:3001/api/auth/register -H 'content-type: application/json' \
  -d '{"email":"ann@example.com","password":"correct horse"}'
```

Then log in at <http://localhost:3001/login>.

## API

| Method | Path | What it does |
|---|---|---|
| POST | `/auth/register` | Registration: creates a User and logs them in. 409 if the email is taken |
| POST | `/auth/login` | Login with email and password. 401 on wrong credentials |
| POST | `/auth/logout` | Clears the login cookie (204) |
| GET | `/auth/me` | The logged-in User. 401 without a valid cookie |

Email is normalised; the password must be 8 to 128 characters. Login sets an `access_token` cookie (HttpOnly, `SameSite=Lax`, `Secure` in production) that expires after one hour.

**Swagger UI** is at <http://localhost:3000/docs> and the OpenAPI document at `/docs-json`. Both are off when `NODE_ENV=production` ([#24](https://github.com/HuyPhat/first-nest-demo/issues/24)). Swagger UI cannot set the HttpOnly cookie itself; call Login first and the browser keeps the cookie for Me.

Database changes: edit `api/src/db/schema.ts`, run `pnpm db:generate`, then `pnpm db:migrate`.

## Web

The browser only talks to the web origin. Next.js rewrites `/api/*` to the API (`API_URL`, default `http://localhost:3000`), so there is no CORS ([ADR 0001](docs/adr/0001-jwt-in-httponly-cookie-with-nextjs-rewrite.md)).

| Route | What it does |
|---|---|
| `/login` | Login form. Wrong credentials show one generic error |
| `/profile` | Server-rendered; calls Me with the login cookie and shows the email. Redirects to `/login` when logged out or expired |

## Tests

```bash
cd api && pnpm test           # Vitest against the first_nest_test database (created automatically)
cd web && pnpm test           # Playwright: starts the API (first_nest_test) and the web app itself
```

Run `pnpm lint` and `pnpm exec tsc --noEmit` in either folder to check the code the way CI does. For `web/`, run `pnpm exec next typegen` first on a fresh checkout.

CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs typecheck, lint and tests for `api` and `web` on every pull request and push to `main`.

## Docs

- [GLOSSARY.md](GLOSSARY.md): the words this project uses, and the ones it avoids
- [ADR 0001](docs/adr/0001-jwt-in-httponly-cookie-with-nextjs-rewrite.md): JWT in an HttpOnly cookie, proxied through a Next.js rewrite
- [ADR 0002](docs/adr/0002-drizzle-for-database-access.md): Drizzle for database access
- [docs/ponytail-review-15.md](docs/ponytail-review-15.md): deferred simplification findings for the web login work
