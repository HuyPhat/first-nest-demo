## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues (`HuyPhat/first-nest-demo`) via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

### Tickets

Start a ticket with `/ticket <N>`: own branch, PR into `main`, the user merges. All work lands on `main` through a PR.
