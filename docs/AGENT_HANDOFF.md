# Agent Handoff — Zokila and Legacy Workbench

- Updated: 2026-11-15 (architecture and repository publication review)
- Project root: this Pi monorepo directory (`/Users/zhengxin/code/Do agent/pi`)

## Objective

Build **走起啦 · Zokila**, a consumer travel and mobility assistant on Pi. The name and direction are user-confirmed; the first workflow hypothesis is an editable, source-aware short-trip itinerary driven by dates, budget, interests and practical constraints. The first user segment and trip type are not validated. Decision 0004 supersedes the earlier market-research product direction; decision 0005 records the name.

The private GitHub repository `Eason2277/zokila` has been created. Local `origin` points to it, and `upstream` points to the official Pi repository. Local prototype commit `4ed3cba83` is prepared; the push is pending a repository Actions decision and has not been verified. This is an early prototype snapshot, not a claim of end-user readiness. See `docs/ARCHITECTURE.md` and `docs/UPSTREAM_SYNC.md`.

## Current Architecture

- Pi upstream monorepo is the Agent foundation.
- Desktop shell: Electron 45, `apps/market-research-workbench/main.cjs`.
- Renderer: React 19.3 + TypeScript, bootstrapped by Vite 8.3.4 from `apps/market-research-workbench/index.html` → `src/main.tsx` → `src/App.tsx`.
- Electron main process serves the production `dist/` bundle through the `marketdesk://` protocol. The Vite preview runs at `http://127.0.0.1:5173/`.
- Renderer receives only a narrow window-control API through `preload.cjs`. It has no direct Node, filesystem, shell, or Pi SDK access.
- Pi SDK, real search, trip persistence, source storage, and export are not integrated. All current market-research content is obsolete demo data; the UI has not been adapted to travel.

## Product and UI Decisions

- The name 走起啦 · Zokila and consumer travel direction are confirmed by the user. The first traveler segment and short-trip workflow are hypotheses. See `docs/product/PRODUCT_BRIEF.md`, `docs/product/MVP_PRD.md`, and decisions 0004–0005.
- Keep the Apple Music-inspired desktop layout, original artwork, and Manchester City sky-blue accent. Use `#6CABDD` as the current digital reference; preserve OS semantic colors for macOS traffic lights and evidence states.
- Button icons use fixed-size, centered SVGs. Buttons must never translate, scale, or bounce on hover; this standing preference is also recorded in `PRODUCT_CONTEXT.md`.
- macOS traffic lights and Windows window controls have platform-specific placement and behavior. Keep the Windows controls' translucent glass treatment.
- Apple UI assets are not embedded. The active interface is authored in project HTML/CSS/React.
- Travel facts need traceable sources and freshness; distinguish sourced facts, recommendations, assumptions and unknowns. Do not send personal travel details to external services before the data path and retention rules are explicit. Bookings and purchases require explicit user confirmation.
- Decision `0003-react-renderer-on-electron.md` supersedes decision `0002-desktop-workbench-electron.md` for renderer technology. Both are historical technical rationale. The desktop form factor should be reassessed for a personal travel product before major UI expansion.

## Work Completed

- Reviewed the repository for publication: the active app is still a market-research demo, with no Pi SDK or travel workflow. Added a Zokila introduction above the preserved Pi README, an architecture/status document, and an upstream sync guide; extended `.gitignore` for local environment variants.
- Consolidated product documents under `docs/`, added `docs/README.md`, and merged product rules with upstream development rules in `AGENTS.md`.
- Added the React/Vite renderer while preserving Electron and the existing narrow preload/window API.
- Kept the earlier static files `workbench.html`, `app.js`, and `styles.css` as an unreferenced rollback prototype; the current Electron/Vite entry is `index.html` and `src/main.tsx`.
- Added exact-version React/Vite dependencies and updated `package-lock.json`.
- Local browser preview is available at `http://127.0.0.1:5173/`. The in-app browser tab was open on this preview at handoff time.
- The outer workspace `AGENTS.md` was deleted at the user's request after its rules were merged into this repository's `AGENTS.md`. Copies of the earlier outer `docs/` files remain outside the repository; canonical copies are under `pi/docs/`.

## Verification

- Current review: source inspection confirmed the Electron main/preload boundary and the lack of real Agent and travel behavior. No new app runtime or packaged launch was verified in this review.
- Current review: `npm run typecheck --workspace=apps/market-research-workbench` passed; `git diff --check` and staged diff whitespace checks passed. `npm run check` reached root TypeScript checking and failed with many Pi model-catalog type errors because the gitignored `packages/ai/src/providers/data/` directory is absent. Earlier formatting and dependency/entry checks passed; no fixes were applied. The full root check is not green, and the later browser smoke stage did not run.
- Passed: `npm run typecheck --workspace=apps/market-research-workbench`.
- Passed: React renderer loaded in the Vite preview; new-research form submission and research-list filtering worked.
- Passed: `node --check` for the Electron main and preload scripts during the prior window-control change, plus Git diff whitespace checks.
- Not verified: Electron desktop startup. The Electron 45 runtime is absent; attempts to download it failed or stalled, so `npm start` cannot yet open a native window.
- Pi root `npm run check` reaches TypeScript checking but fails with numerous model-related errors under `packages/ai`, `packages/agent`, and `packages/coding-agent` (including `unknown` model manifests and model IDs inferred as `never`). Do not attribute these failures to the workbench without fresh evidence.
- No production Vite build or test suite was run.

## Working Tree Notes

The working tree contains staged and unstaged changes from prior sessions in the workbench and docs, plus a changed lockfile. Recheck `git status --short` before any work and preserve unrelated changes. This handoff is a dated snapshot, not proof of current Git or runtime state.

## Next Steps

1. Once the user answers the pending GitHub Actions setting request, apply that setting or keep it enabled as requested, then push local `main` to the verified private `origin`. Git push dry-run succeeded through the existing Git credential; GitHub CLI still reports an invalid login token. Verify the remote branch after push. Local commit `4ed3cba83` contains the prototype; this handoff update needs its own commit before push.
2. Inspect the current React workbench and Git diff before changing it. Its market-research content is legacy demo UI.
3. Validate a narrow travel-planning scenario and usable data sources; assess whether desktop remains the right first product form factor.
4. Adapt one end-to-end UI slice to a travel itinerary, keeping demo labels until real behavior exists.
5. Before Pi integration, read `packages/coding-agent/docs/sdk.md` and `packages/coding-agent/examples/sdk/README.md`. Define narrow travel-information tools and explicit action confirmation; never expose Pi sessions or privileged APIs directly to React.
6. Resolve Electron runtime download/installation if the desktop path is retained. Do not weaken Electron security settings to make startup easier.

## Resume Commands

From the Pi repository root:

```sh
npm run typecheck --workspace=apps/market-research-workbench
npm run dev --workspace=apps/market-research-workbench
```

For a desktop release path, first install the Electron runtime using the documented install process, then build and launch the Electron app. The native runtime download is the current blocker.
