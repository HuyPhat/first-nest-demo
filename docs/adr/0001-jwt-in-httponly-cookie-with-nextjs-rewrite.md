# Authenticate Users with a JWT in an HttpOnly cookie, proxied through a Next.js rewrite

The Next.js frontend and NestJS API are separate servers, but a User must stay logged in across both browser requests and Next.js server-side rendering. NestJS issues a single short-lived (~1h) JWT access token and sets it in an `HttpOnly` cookie; Next.js rewrites `/api/*` to NestJS so the browser sees one origin, which avoids CORS and cross-site cookie (`SameSite`) problems and lets server components read the cookie.

## Considered Options

- **Server-side sessions in the database**: easy revocation, but needs a session store and still needs the same cookie and CORS handling.
- **JWT in `localStorage`**: simplest, but readable by any script on the page (XSS), and invisible to Next.js server rendering.
- **JWT in a cookie with CORS enabled and no rewrite**: works, but needs `credentials`, `SameSite=None` and CORS configured correctly together.

## Consequences

- Logout only clears the cookie; a stolen token stays valid until it expires. Refresh tokens and revocation are deferred (see the follow-up issue on refresh tokens).
- The Next.js `rewrites` config is part of the auth design: removing it brings CORS and cookie problems back.
