# Design skills

Which design skills this repo uses, why two others were left out, and when to look again. Decided 2026-11-18 after reading both repos (README, `SKILL.md`, `install.sh`, `package.json`) and this machine's setup. Neither skill was run.

## Decision

impeccable is the only design skill. `DESIGN.md` is the source of truth for the look; `PRODUCT.md` holds the product context. ui-ux-pro-max and taste-skill are not installed.

## Why

- **ui-ux-pro-max** (a searchable catalogue of styles, palettes, fonts and UX rules, queried through a Python `search.py`). Its core job, `--design-system`, picks a style, palette and fonts from the product type. impeccable already does that and `DESIGN.md` has settled it. `--persist` writes a rival `design-system/<slug>/MASTER.md`. The plugin bundles seven skills (design, design-system, brand, banner-design, slides, ui-styling, ui-ux-pro-max).
- **taste-skill** (`design-taste-frontend`: a build workflow for company and shop websites, with a browser-based checker). It targets marketing pages; login and profile are task screens. Its house rules add hover lifts, hero entrances and per-trade palettes and fonts, which contradict `DESIGN.md` (colour-only transitions, one accent, Geist).
- **Third-party code on the machine.** ui-ux-pro-max runs Python scripts; taste-skill runs Node scripts and declares a Stop hook (`gate.mjs`, 600 s timeout). impeccable already has PostToolUse and Stop hooks, so a second Stop hook doubles the checks and can disagree with it. Every installed skill also adds its description to the context.

## Look again when

- Shop screens start (catalogue, cart, checkout): try ui-ux-pro-max as a lookup for e-commerce patterns. Run it on a task impeccable has already critiqued and keep it only if it finds something the critique missed.
- A marketing page (landing or storefront home) is planned: try taste-skill for that page.

## If one is installed later

- Keep `DESIGN.md` as the source of truth; other skills advise.
- ui-ux-pro-max: query with `--domain` and `--stack`; skip `--design-system --persist`. Install the `ui-ux-pro-max` skill alone, on the user's machine, outside the repo.
- taste-skill: call it by hand, on its own branch, for the marketing page. Compare its Stop hook with impeccable's before enabling it.
- Installing is the user's step: give them the exact command, then read the result from disk.

Not verified: what `uipro init --ai claude` installs, and whether taste-skill's Stop hook runs only while the skill is active.
