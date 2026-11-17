# Ponytail review of #15 (web: log in and view the profile)

Deferred over-engineering findings from the review of `main..15-web-log-in-and-view-the-profile`. None are correctness bugs. Finding 1 is applied and removed from the table. Finding 5 was tried and rejected (see below). The rest are not applied yet; pick up when wanted. Numbering is unchanged. Net of the rows left: about -62 lines.

| # | Where | Finding | Net | Caveat |
|---|---|---|---|---|
| 2 | `web/app/login/login-form.tsx` L12, L18, L35, L61, L64 | yagni: `pending` state, disabled button and "Logging in…" label; #15 does not ask for them | -5 | Loses the double-submit guard |
| 3 | `web/app/(app)/layout.tsx` (header; was in the root layout) | yagni: site header holding only the product name (no nav, no link); add it when a second page needs navigation | -5 | |
| 4 | `web/app/globals.css` L18-31 | yagni: dark palette in a `prefers-color-scheme` block, plus `color-scheme: light dark`; #15 asks for Tailwind styling, not theming | -15 | |
| 6 | `web/e2e/global-setup.ts` L1-11 | shrink: an 11-line `chdir` hack that reuses the API's test setup. Point e2e at the dev DB `first_nest` (README already creates it), run `pnpm db:migrate` in the CI job, delete the file and the `globalSetup` line | -12 | e2e leaves test Users in the dev DB |
| 7 | `web/e2e/login.spec.ts` L49-61 | delete: the "expired" and "logged out" tests hit the same path (Me answers 401 either way). Keep one, or fold into a `test.each` | -13 | The ticket's criterion lists both cases: a judgement call |
| 8 | `.github/workflows/ci.yml` L40-78 | shrink: the `web` job repeats the API job's Postgres service and setup. Run the web steps inside the `api` job with `working-directory: web` | -12 | CI runs serially |

Rejected:

- Finding 5 (delete `partialPrefetching`): with `cacheComponents` on, leaving it unset makes every `next dev` and `next build` print a warning asking to set it to `true` or `false`. The Next docs say to set it explicitly. It changes no behaviour here (no `<Link>` in the app), so it stays as `true`.

Other review notes, not applied:

- The profile page's server-side fetch calls `API_URL` directly, not the `/api` rewrite, because a server fetch needs an absolute URL. (The `API_URL` default is now in one place, `web/lib/api-url.ts`.)
- The "expired" e2e test sends an invalid token, not a genuinely expired JWT.
- The profile heading can flash before the redirect, because the redirect happens inside `<Suspense>` under `cacheComponents`.
- No `DESIGN.md` yet; `/impeccable document` can record the shipped design later.
