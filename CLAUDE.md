## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues (`HuyPhat/first-nest-demo`) via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

### Tickets

Start a ticket with `/ticket <N>`: own branch, PR into `main`, the user merges. All work lands on `main` through a PR.

### Tests and code

TDD sets the tests (one per behaviour, at the agreed seam); ponytail sets the production code (the least that passes each test). Ponytail simplifications keep every behaviour test green.

### Design skills

impeccable is the only design skill, and `DESIGN.md` is the source of truth for the look. Read `docs/agents/design-skills.md` before installing or running another design skill (ui-ux-pro-max, taste-skill), and when shop or marketing screens begin.
