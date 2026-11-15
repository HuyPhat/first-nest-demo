---
name: ticket
description: Work a GitHub ticket end to end - own branch, implement, open a PR.
disable-model-invocation: true
argument-hint: <issue-number>
---

Work ticket **#$ARGUMENTS** on its own branch and hand the user an open PR. The user merges.

## 1. Preflight

Read the issue (`docs/agents/issue-tracker.md`). Done when the working tree is clean, the issue is open and labelled `ready-for-agent`, and every blocker is closed. Anything else: stop and ask the user.

## 2. Tidy

Done when local `main` is current and no local branch has a merged PR: `git switch main && git pull`, then `git branch -D` each local branch that `gh pr list --state merged --head <branch>` returns. Squash merges leave `-d` refusing; the merged PR is the proof `-D` needs. Remote branches stay.

## 3. Branch

Done when the issue's branch is checked out: `gh issue develop $ARGUMENTS --checkout --base main`, or check out the existing one listed by `gh issue develop --list $ARGUMENTS`.

## 4. Implement

Invoke `mattpocock-skills:implement` with the issue reference. Done when it has committed on this branch and its code review is addressed.

## 5. Ship

Done when the PR is open and the user has the PR URL plus one `gh pr checks` report. Push the branch, then `gh pr create` with a body written by `mattpocock-skills:pr`, ending in `Closes #$ARGUMENTS`. Merging stays with the user.
