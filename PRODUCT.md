# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Primary: someone reviewing this portfolio project (a recruiter, hiring engineer or peer) who tries the app end to end: registers, logs in, views their profile. The same people later become shoppers once the e-commerce side exists. Confirmed in the init interview.

## Product Purpose
A learning and portfolio project that starts as User sign-up and sign-in and is intended to grow into an e-commerce app. Success today: a User can log in and see their profile; a reviewer sees a working, well-built auth flow.

## Positioning
A small, honest NestJS + Next.js app whose auth design is documented and deliberate (ADR 0001: JWT in an HttpOnly cookie, proxied through a Next.js `/api` rewrite) rather than a template.

## Operating Context
- Web app (`web/`, Next.js App Router, pnpm, Tailwind CSS) runs next to the NestJS API (`api/`); the browser only talks to the web origin, `/api/*` is rewritten to the API, CORS is not enabled.
- Issues are worked as tickets on GitHub; the domain language lives in `GLOSSARY.md` and `docs/adr/`.

## Capabilities and Constraints
- Today: Login, and a profile page showing the User's email (server-rendered, calls Me with the login cookie). Registration page and Logout in the web app are not built yet.
- Use the glossary's terms in UI copy: **User**, **Registration**, **Login**. Avoid Account, Member, Customer, Sign-up, Sign-in.
- Wrong credentials show one generic message that never says whether the email or the password was wrong.
- Logged-out or expired logins land on the login page.
- E-commerce scope (catalogue, cart, orders) is undecided and not yet defined; "Customer" is reserved for the ordering context.

## Evidence on Hand
No logo, brand assets, customers, testimonials or metrics exist; do not invent any.

## Product Principles
- Plain and trustworthy: auth screens say what happened and what to do, in the glossary's words.
- Never leak which emails are registered.
- Grows into a shop: structure and tone should not paint the app into an auth-demo corner.
- Documented decisions over cleverness; the UI should be as legible as the ADRs.

## Accessibility & Inclusion
No product-specific standard was set; follow WCAG AA as a baseline (labelled fields, visible focus, errors announced).
