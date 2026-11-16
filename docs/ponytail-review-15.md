# Ponytail review of #15 (web: log in and view the profile)

Deferred over-engineering findings from the review of `main..15-web-log-in-and-view-the-profile`. None are correctness bugs. Nothing here is applied yet; pick up when wanted. Net: about -66 lines.

| # | Where | Finding | Net | Caveat |
|---|---|---|---|---|
| 1 | `web/app/login/login-form.tsx` L35-37 | shrink: the `catch` repeats the fallback message. Use `const res = await fetch(...).catch(() => null); if (res?.ok) return router.push("/profile"); setError(res?.status === 401 ? "Invalid email or password." : "Something went wrong. Try again.");` | -4 | |
| 2 | `web/app/login/login-form.tsx` L12, L18, L38, L64, L67 | yagni: `pending` state, disabled button and "Logging in…" label; #15 does not ask for them | -5 | Loses the double-submit guard |
| 3 | `web/app/layout.tsx` L22-26 | yagni: site header holding only the product name (no nav, no link); add it when a second page needs navigation | -5 | |
| 4 | `web/app/globals.css` L18-31 | yagni: dark palette in a `prefers-color-scheme` block, plus `color-scheme: light dark`; #15 asks for Tailwind styling, not theming | -15 | |
| 5 | `web/next.config.ts` L12 | delete: `partialPrefetching` is an experimental flag nothing here uses; remove and rerun tests. Keep the `turbopack` Tailwind rule (the scaffold's Tailwind loader) | -1 | |
| 6 | `web/e2e/global-setup.ts` L1-11 | shrink: an 11-line `chdir` hack that reuses the API's test setup. Point e2e at the dev DB `first_nest` (README already creates it), run `pnpm db:migrate` in the CI job, delete the file and the `globalSetup` line | -12 | e2e leaves test Users in the dev DB |
| 7 | `web/e2e/login.spec.ts` L49-61 | delete: the "expired" and "logged out" tests hit the same path (Me answers 401 either way). Keep one, or fold into a `test.each` | -13 | The ticket's criterion lists both cases: a judgement call |
| 8 | `.github/workflows/ci.yml` L40-78 | shrink: the `web` job repeats the API job's Postgres service and setup. Run the web steps inside the `api` job with `working-directory: web` | -12 | CI runs serially |

Other review notes, not applied:

- The profile page's server-side fetch calls `API_URL` directly, not the `/api` rewrite, because a server fetch needs an absolute URL. `API_URL ?? "http://localhost:3000"` is written in both `next.config.ts` and `app/profile/page.tsx`.
- The "expired" e2e test sends an invalid token, not a genuinely expired JWT.
- The profile heading can flash before the redirect, because the redirect happens inside `<Suspense>` under `cacheComponents`.
- No `DESIGN.md` yet; `/impeccable document` can record the shipped design later.
