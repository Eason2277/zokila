# Development Rules

## Project and Product Context

This repository is the sole project root for the user's product and the Pi Agent base. Preserve Pi upstream behavior; keep product features under `apps/market-research-workbench/` until an app-directory rename is explicitly planned. The directory name and current UI still reflect the previous market-research prototype.

For product work, start with [`PRODUCT_CONTEXT.md`](PRODUCT_CONTEXT.md). Read the relevant product brief, MVP PRD, decisions, or handoff only as needed; [`docs/README.md`](docs/README.md) maps their roles. Do not load the whole document set for every task.

Confirmed direction and name: build **走起啦 · Zokila**, a consumer travel and mobility assistant on Pi. The first user segment and trip-planning workflow remain hypotheses, not validated requirements. Update the product docs when user requirements change.

The existing desktop prototype uses Electron plus a React/TypeScript renderer. Keep Pi SDK access in the Electron main process behind a narrow preload API. Do not expose raw IPC, filesystem access, or general shell access to the renderer. Treat travel dates, location and preferences as personal data; show sources and freshness for time-sensitive travel information, and require explicit confirmation before bookings or purchases.

Visual preference: Apple Music-inspired dark desktop layout, Manchester City sky-blue accent, centered button icons, and **no button movement, scaling, or bounce on hover**. Keep artwork original and macOS/Windows window controls platform-appropriate.

For substantial changes, state goal/scope/acceptance criteria and separate confirmed facts from assumptions. Prefer a small end-to-end slice; preserve unrelated staged and unstaged changes. Never perform bulk or recursive deletion. Ask before deleting any file; if cleanup would delete multiple files, ask the user to handle it manually. Record product or architecture decisions in `docs/decisions/` with rationale, risks, and reevaluation conditions.

## Product and Systems Judgment

- Start from the actor, their task, workflow, constraints, expected outcome, and failure cost. Do not add architecture just because the product may grow.
- The user has limited time for broad discovery. Make useful, reversible progress with explicit assumptions; ask a focused question only when an unknown could change product boundaries, expose personal data, create external commitments, or cause substantial rework.
- Travel outputs must separate source-supported facts, recommendations, assumptions, and unresolved questions. Never invent prices, schedules, opening hours, availability, or citations.
- Minimize personal data. Before sending location, dates, or preferences to model/search services, make the data path, permissions, and retention explicit.

## AI Task Workflow and Handoff

- Before a substantial task, identify its goal, scope, acceptance criteria, evidence, assumptions, and unknowns. Load only relevant files and focused sections.
- For substantial or multi-step work, follow the `context-engineering` skill to keep the working context focused and maintain a usable handoff.
- Keep small, self-contained changes lightweight and prefer repository-defined commands and portable paths.
- When diagnosing timeouts or failures, measure request size, latency, retries, and the failing layer before attributing the problem to context length.
- At meaningful boundaries, record decisions and verification results. If a task becomes long or context is at risk, create or update `docs/AGENT_HANDOFF.md` with the exact next steps and tell the user.
- A handoff should include the objective, acceptance criteria, completed work, changed files, key decisions, verification, unresolved issues, risks, and exact next steps. Never claim an exact remaining token count.
- Preserve unrelated staged and unstaged changes. Do not claim that an unrun build, check, launch, or test succeeded.
- Assume macOS for local computer, terminal, and IDE instructions unless the user specifies another platform. Treat `~/.codex/USER_PROFILE.md` as optional context; read only relevant sections when they materially help the task.
- The user is an experienced front-end engineer expanding into back-end and AI engineering. Explain system boundaries and why choices work without re-teaching familiar UI basics.
- For English-only user messages, use natural American English and give concise language feedback when relevant.

## Rule Maintenance

Add project rules only when they prevent a concrete, repeatable mistake that cannot be automated elsewhere. Record a brief reason with the rule, and remove it when it becomes redundant, obsolete, or unenforceable.

## Conversational Style

- Keep answers short and concise
- No emojis in commits, issues, PR comments, or code
- No fluff or cheerful filler text (e.g., "Thanks @user" not "Thanks so much @user!")
- Technical prose only, be direct
- Use concise, clear, simple language. Define unavoidable jargon before using it.
- Explain non-trivial designs and problems as: problem, concrete example or short trace, then solution. State why the solution is necessary and distinguish it from optional complexity.
- Prefer concrete behavior and small illustrations over abstract summaries, dense terminology, or unexplained lists of changes.
- When the user asks a question, answer it first before making edits or running implementation commands.
- When responding to user feedback or an analysis, explicitly say whether you agree or disagree before saying what you changed.
- By default, teach implementation work step by step while keeping the overall roadmap visible: state how the current step fits, give the user one concrete change to make, then review it before moving on. Let the user implement; generate the complete result only when explicitly requested. Reason: the user wants to learn Agent and back-end development by doing the work, not only receive finished code.

## Code Quality

- Read files in full before wide-ranging changes, before editing files you have not fully inspected, and when asked to investigate or audit. Do not rely on search snippets for broad changes.
- Add plain-language comments at useful points so a learner can follow a component or function: its purpose, where its input comes from, what it changes or returns, and what happens next across layers. Include enough detail for unfamiliar Agent, Electron, and business flows; do not comment every line or merely restate syntax. Reason: this project is also a learning project, and the user asked for comments detailed enough to follow the implementation independently.
- No `any` unless absolutely necessary.
- Inline single-line helpers that have only one call site.
- Check node_modules for external API types; don't guess.
- **No inline imports** (`await import()`, `import("pkg").Type`, dynamic type imports). Top-level imports only.
- In `packages/coding-agent`, resolve package assets through helpers in `src/config.ts`. Do not use `__dirname` directly; the helpers account for source checkouts, npm installations, and standalone binaries.
- Never remove or downgrade code to fix type errors from outdated deps; upgrade the dep instead.
- Use only erasable TypeScript syntax (Node strip-only mode) in code checked by the root config (`packages/*/src`, `packages/*/test`, `packages/coding-agent/examples`): no parameter properties, `enum`, `namespace`/`module`, `import =`, `export =`, or other constructs needing JS emit. Use explicit fields with constructor assignments.
- Always ask before removing functionality or code that appears intentional.
- Do not preserve backward compatibility unless the user asks for it.
- Never hardcode key checks (e.g. `matchesKey(keyData, "ctrl+x")`). Add defaults to `DEFAULT_EDITOR_KEYBINDINGS` or `DEFAULT_APP_KEYBINDINGS` so they stay configurable.
- Never modify `packages/ai/src/models.generated.ts` directly; update `packages/ai/scripts/generate-models.ts` instead, then regenerate. Including the resulting `models.generated.ts` diff is always OK, even if regeneration includes unrelated upstream model metadata changes. The generated model data in `packages/ai/src/providers/data/` is gitignored: never stage it, and don't look for it in git history.

## Commands

- After code changes (not docs): `npm run check` (full output, no tail). Fix all errors, warnings, and infos before committing. Does not run tests.
- Never run `npm run build` or `npm test` unless requested by the user.
- Never run the full vitest suite directly: it includes e2e tests that activate when endpoint/auth env vars are present. For all non-e2e tests, run `./test.sh` from the repo root. Otherwise run specific tests from the package root:
  - Vitest: `node "$(git rev-parse --show-toplevel)/node_modules/vitest/dist/cli.js" --run test/specific.test.ts`
  - `packages/tui` (`node:test`): `node --test test/specific.test.ts`
- If you create or modify a test file, run it and iterate on test or implementation until it passes.
- For `packages/coding-agent/test/suite/`, use `test/suite/harness.ts` + the faux provider. No real provider APIs, keys, or paid tokens.
- When regressions tests for fixing a github issue, add a comment with the github issue number next to the test.
- For ad-hoc scripts, `write` them to a temp file (e.g. `/tmp`), run, edit if needed, remove when done. Don't embed multi-line scripts in `bash` commands.
- Never commit unless the user asks.

## Dependency and Install Security

- Treat npm dep and lockfile changes as reviewed code. Direct registry deps, including internal workspace deps, stay pinned to exact versions.
- When updating `undici`, you MUST read its changelog/release notes for the target version and evaluate whether any changes may affect functionality before applying the update.
- Hydrate/update locally with `npm install --ignore-scripts`; clean/CI-style with `npm ci --ignore-scripts`. Don't run lifecycle scripts unless the user asks.
- If dep metadata changes, refresh `package-lock.json` with `npm install --package-lock-only --ignore-scripts`.
- If `packages/coding-agent/install-lock/` needs regen, run `node scripts/generate-coding-agent-install-lock.mjs` (verify with `--check` or `npm run check`). New deps with lifecycle scripts require review and an explicit allowlist entry in that script; never add one silently.
- Pre-commit blocks lockfile commits unless `PI_ALLOW_LOCKFILE_CHANGE=1`. Don't bypass unless the user wants the lockfile change committed.

## Git

Multiple pi sessions may be running in this cwd at the same time, each modifying different files. Git operations that touch unstaged, staged, or untracked files outside your own changes will stomp on other sessions' work. Follow these rules:

Committing:

- Only commit files YOU changed in THIS session.
- Stage explicit paths (`git add <path1> <path2>`); never `git add -A` / `git add .`.
- Before committing, run `git status` and verify you are only staging your files.
- `packages/ai/src/models.generated.ts` may always be included alongside your files.
- Message format: `{feat,fix,docs}[(ai,tui,agent,coding-agent)]: <commit message> (optionally multiple lines)`. Message is informative and concise.

Never run (destroys other agents' work or bypasses checks):

- `git reset --hard`, `git checkout .`, `git clean -fd`, `git stash`, `git add -A`, `git add .`, `git commit --no-verify`.

If rebase conflicts occur:

- Resolve conflicts only in files you modified.
- If a conflict is in a file you did not modify, abort and ask the user.
- Never force push.

## Issues and PRs

See `CONTRIBUTING.md` for the contributor gate (auto-close workflows, `lgtm`/`lgtmi`, quality bar).

When reviewing PRs:

- Do not run `gh pr checkout`, `git switch`, or otherwise move the worktree to the PR branch unless the user explicitly asks.
- Use `gh pr view`, `gh pr diff`, `gh api`, and local `git show`/`git diff` against fetched refs to inspect PR metadata, commits, and patches without changing branches.
- If you need PR file contents, fetch/read them into temporary files or use `git show <ref>:<path>` without switching branches.

When creating issues:

- Add `pkg:*` labels for affected packages (`pkg:agent`, `pkg:ai`, `pkg:coding-agent`, `pkg:tui`); use all that apply.

When posting issue/PR comments:

- Write the comment to a temp file and post with `gh issue/pr comment --body-file` (never multi-line markdown via `--body`).
- Keep comments concise, technical, in the user's tone.
- End every AI-posted comment with the AI-generated disclaimer line specified by the originating prompt (e.g. `This comment is AI-generated by `/wr``).

When closing issues via commit:

- Include `fixes #<number>` or `closes #<number>` in the message so merging auto-closes the issue. For multiple issues, repeat the keyword per issue (`closes #1, closes #2`); a shared keyword (`closes #1, #2`) only closes the first.

## Testing pi Interactive Mode with tmux

For testing pi's interactive mode, load and follow [.pi/skills/interactive-testing.md](.pi/skills/interactive-testing.md).

## Changelog

Location: `packages/*/CHANGELOG.md` (one per package).

Sections under `## [Unreleased]`: `### Breaking Changes` (API changes requiring migration), `### Added`, `### Changed`, `### Fixed`, `### Removed`.

Rules:

- All new entries go under `## [Unreleased]`. Read the full section first and append to existing subsections; never duplicate them.
- Released version sections (e.g. `## [0.12.2]`) are immutable; never modify them.
- Do not create changelog entries when the work targets a branch other than `main`

Attribution:

- Internal (from issues): `Fixed foo bar ([#123](https://github.com/earendil-works/pi/issues/123))`
- External contributions: `Added feature X ([#456](https://github.com/earendil-works/pi/pull/456) by [@username](https://github.com/username))`

## Releasing

For release preparation, publishing, verification, or recovery, load and follow [.pi/skills/release.md](.pi/skills/release.md).

## User Override

Follow the user's current explicit instructions over project-level defaults when intent is clear and no higher-priority safety or destructive-operation rule prevents it. Ask only when a material ambiguity remains; do not request confirmation again for actions already authorized.
