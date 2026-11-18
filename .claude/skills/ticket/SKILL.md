---
name: ticket
description: Work a GitHub ticket end to end - own branch, implement, over-engineering review, PR.
disable-model-invocation: true
argument-hint: <issue-number>
---

Work the ticket in `$ARGUMENTS` on its own branch and hand the user an open PR. Let **N** be its issue number (drop a leading `#`). The user merges.

## 1. Preflight

Read issue N (`docs/agents/issue-tracker.md`). Done when the working tree is clean, the issue is open and labelled `ready-for-agent`, and every blocker is closed. Anything else: stop and ask the user.

## 2. Tidy

A worktree made by `gh issue develop N --worktree` already sits on N's branch: when the current branch starts with `N-`, skip to step 4.

Done when local `main` is current and no local branch has a merged PR: `git switch main && git pull`, then `git branch -D` each local branch that `gh pr list --state merged --head <branch>` returns. Squash merges leave `-d` refusing; the merged PR is the proof `-D` needs. Remote branches stay.

## 3. Branch

Done when the issue's branch is checked out: `gh issue develop N --checkout --base main`, or check out the existing one listed by `gh issue develop --list N`.

## 4. Implement

`mattpocock-skills:implement` is user-invoked only. Tell the user to run `/mattpocock-skills:implement #N`, then stop. Done when its commit is on this branch: the user says so, or `implement` finished in this conversation and `git log main..HEAD` lists the commit. Then go straight to step 5, without asking.

## 5. Review

Invoke `ponytail:ponytail-review` on the diff against `main`, right after step 4. Show the user every finding, each sorted into one of two groups:

- **Apply yourself:** a `delete:` or `yagni:` finding whose behaviour an existing test guards. Apply it, rerun the tests, commit, and say what you applied. A rerun that goes red: undo that change and move it to the group below.
- **Ask:** every other finding (`shrink:`, `stdlib:`, `native:`, and any `delete:` or `yagni:` no test guards). Give a recommendation for each; the user picks. Apply the picks, rerun the tests, commit.

Done when every finding is applied or declined and the tests pass. No findings: say so and move on.

## 6. README

Done when `README.md` matches the branch. If the diff against `main` changes an endpoint, route, command, env var, or setup step, or finishes something the README's Status table lists as not done, update the README and commit it on this branch. Otherwise leave it.

## 7. Ship

Done when the PR is open and the user has the PR URL plus one `gh pr checks` report. Push the branch, then `gh pr create` with a body written by `mattpocock-skills:pr`, ending in the checkbox line from `.github/pull_request_template.md` (ticked, or ticked with "no README change needed") and `Closes #N`. `gh pr create --body` skips the template, so add the line by hand. Merging stays with the user.
