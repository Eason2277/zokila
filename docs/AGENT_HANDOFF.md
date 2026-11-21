# Agent Handoff — Zokila Travel UI Slice

- Updated: 2026-11-21
- Project root: this repository's root directory
- Branch: `main`
- Current phase: hand-written travel UI slice, in progress (kind, status, sources, confirmation, and assumptions shown)

## Objective

Build **走起啦 · Zokila**, a consumer travel and mobility assistant on Pi. The first product slice is an editable, source-aware short-trip itinerary driven by dates, budget, interests and practical constraints. Name and direction are user-confirmed; the first user segment and trip type are still hypotheses. See `docs/product/PRODUCT_BRIEF.md`, `docs/product/MVP_PRD.md`, and decisions 0004–0006.

This session started the first travel UI slice: define the data shapes, create one fixture, and render a read-only itinerary before Pi integration. It deliberately does **not** connect Pi, persistence, or real data sources yet.

## Working Agreement (important for the next agent)

The user asked to be taught step by step and is hand-writing the code. Follow the rule added to `AGENTS.md` under `## Conversational Style`:

- Give one small change per turn; wait for the user to type it and run `npm run typecheck --workspace=apps/zokila-desktop`.
- Do not write whole files or multi-step solutions unless the user explicitly says to write it completely in that turn. An earlier request to generate one file does not carry over.
- Explain the syntax the user is typing (JSX tags, props, `map`/`key`, `??`, `Record`, type imports). They are an experienced front-end engineer learning Agent/back-end work, but asked for syntax-level teaching here.
- Review their file after each step; point out what is missing or semantically wrong before moving on.

## Completed This Session

Data shapes and fixture:

- `apps/zokila-desktop/src/trip-request.ts` — `TravelPace`, `Budget`, `TripRequest`.
- `apps/zokila-desktop/src/itinerary.ts` — `SourceRef`, `EvidenceStatus`, `StopKind`, `ItineraryStop`, `ItineraryDay`, `ItineraryDraft`.
- `apps/zokila-desktop/src/demo-trip.ts` — `demoRequest` and `demoDraft`; explicitly labeled demo data; source links use `example.com` on purpose. Covers `sourced`, `unverified`, `inferred`, and `userConfirmed: true`.

UI wiring:

- `apps/zokila-desktop/src/App.tsx` — added `import { demoDraft } from "./demo-trip"` and `import { ItineraryView } from "./ItineraryView"`; replaced the `<Findings ... />` JSX with `<ItineraryView draft={demoDraft} />` (around line 1058). The old market-research components and data remain unused in the file.
- `apps/zokila-desktop/src/ItineraryView.tsx` — hand-written by the user through the assumptions list:
  - header: destination, day count, date range, party size;
  - outer `draft.days.map` with `key={day.date}`;
  - inner `day.stops.map` with `key={stop.id}`;
  - each stop renders time, title, Chinese kind label, evidence status, source names and retrieval dates, and an `已确认` marker when `userConfirmed` is true;
  - `draft.assumptions` renders below the daily stops. The other three draft note lists are still missing.

Docs and rules:

- `AGENTS.md` — added a rule about one-small-change teaching, with the 2026-11-21 incident as reason (a complete component was generated after the user asked to learn step by step).

## Key Decisions

- Split user input (`TripRequest`) from agent output (`ItineraryDraft`). They are separate modules and will be separate sides of the future IPC boundary.
- All shapes are plain serializable data: no `Date` objects, no `enum`, no classes. Dates are `YYYY-MM-DD` strings; timestamps are ISO 8601 strings. `erasableSyntaxOnly` and `verbatimModuleSyntax` apply.
- `ItineraryStop.userConfirmed` exists to satisfy MVP PRD item 4: confirmed choices must survive re-planning and must not be silently replaced.
- `EvidenceStatus` semantics: `sourced` = has source and retrieval time; `unverified` = missing source, stale, or conflicting; `inferred` = agent suggestion, not fact. `status` is authoritative; do not infer it from `sources.length` alone.
- `demoDraft` is a stand-in for the future Pi response. The shape should not change when Pi is connected; only the data source changes.
- `TripRequest.budgets?: Budget[]` is the user's current choice. It has two representations of "unknown" (omitted vs empty array). The earlier recommendation was a single `budget?: Budget`; this is still open. Do not change it silently.
- No styling work yet. The component renders semantic HTML; the existing `.finding-*`, `.source-chip`, `.finding-status` styles in `desktop.css` are available if the next agent chooses to reuse them. Button hover must never move, scale, or bounce.

## Verification

- `npm run typecheck --workspace=apps/zokila-desktop` → exit 0 (run 2026-11-21, current working tree).
- The user confirmed the Vite preview at `http://127.0.0.1:5173/` shows the itinerary component and stop list. No screenshot or automated check was recorded.
- Root `npm run check` ran and passed Biome, pinned-dependency, runtime-dependency, import, entry-graph, and install-lock checks. Its TypeScript phase failed with cascading model-catalog errors because the gitignored `packages/ai/src/providers/data/` directory is absent; the browser smoke phase did not run.
- Electron native launch was not attempted in this session; the Electron 45 runtime is still a known blocker from the previous handoff.

## Working Tree Notes

- The `apps/market-research-workbench/` → `apps/zokila-desktop/` rename and related docs are still staged and uncommitted from the previous session. Preserve them.
- `apps/zokila-desktop/src/Itinerary.tsx` is an **empty untracked** stray file. Exclude it from commits; do not delete it without asking the user.
- `apps/zokila-desktop/src/trip-request.ts`, `itinerary.ts`, and `ItineraryView.tsx` contain mixed staged/working-tree changes. Read the working tree before editing.
- `App.tsx` still contains obsolete market-research components and demo data (`initialProject`, `projects`, `findings`, `Hero`, `Findings`, `ResearchDialog`, research progress, source note). They are unreferenced or partially unreferenced after the `<Findings>` replacement. Do not remove them until the user approves the cleanup.
- Multiple sessions may edit this repo. Stage explicit paths only; never `git add -A`; do not commit unless the user asks.

## Exact Next Steps

1. Render `draft.openQuestions`, `warnings`, and `budgetNotes` as distinct lists, one small user-authored step at a time.
2. Add evidence-state styling and source freshness cues; keep the demo warning prominent because all current URLs are placeholders.
3. With the user's approval, replace the remaining market-research page contents in `App.tsx` with the travel slice; keep the demo notice visible.
4. Turn `ResearchDialog` into a travel request form producing `TripRequest` (MVP PRD item 1). Keep optional fields optional.
5. Later, integrate Pi SDK in the Electron main process behind a narrow preload API (`generateItinerary(request) → ItineraryDraft`). Read `packages/coding-agent/docs/sdk.md` and `packages/coding-agent/examples/sdk/README.md` first. Never expose Pi sessions or raw IPC to the renderer. Resolve the Electron runtime blocker separately.
6. After that, add local persistence and evaluate real data sources (MVP PRD §9 open questions).

## Useful Commands

```sh
npm run typecheck --workspace=apps/zokila-desktop
npm run dev --workspace=apps/zokila-desktop   # http://127.0.0.1:5173/
```

Root checks and the full test suite are not required for this UI slice; see `AGENTS.md` for the repository's check and test boundaries.
