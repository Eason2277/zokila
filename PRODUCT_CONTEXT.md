# Product Context for AI Contributors

This document gives AI assistants the product context needed to work in this repository. `AGENTS.md` remains the source of upstream engineering and contribution rules. Follow both documents for product work.

## Product Direction

The user-confirmed product name is **走起啦 · Zokila** (Chinese: 走起啦; English: Zokila). Use this pair consistently for the current product. It is a name choice, not a claim that trademarks, domains, or app-store names are available; see decision 0005.

The product direction is a **consumer travel and mobility assistant**: help an individual plan and adjust trips around their dates, budget, interests, pace, companions, and practical constraints. The product serves ordinary travelers while aiming for enterprise-quality engineering: reliable state, clear data boundaries, traceable time-sensitive information, and safe tool permissions.

The first product slice is a **personal travel planning workbench**. The provisional first user is an individual planning a short trip. The initial workflow is to capture trip constraints, build an editable itinerary from sourced information, identify conflicts and unknowns, and let the user confirm consequential choices.

This direction is newly selected but its target segment, highest-value trip type, and willingness to reuse remain hypotheses. Avoid expanding into food delivery, fashion, beauty, and general lifestyle features until the travel workflow is validated.

## First Workflow

1. The traveler describes destination, dates, budget, interests, pace, party, and constraints.
2. The Agent asks only for missing details that materially affect the plan, while allowing assumptions to be recorded.
3. The Agent proposes an itinerary with sourced place and travel details, timing, and unresolved questions.
4. The traveler edits the itinerary and asks for targeted alternatives or revisions.
5. The traveler confirms any booking or external action; the Agent does not commit or purchase autonomously.

## Product Invariants

- Keep user-stated preferences, retrieved travel facts, recommendations, and unknowns distinct.
- Do not invent prices, schedules, opening hours, availability, transport times, or safety claims. Show source and freshness for time-sensitive details where available.
- Make uncertainty and conflicting information visible; let the traveler revise assumptions and constraints.
- Treat location, travel dates, companions, and preference data as sensitive personal context. Minimize collection and explain external data flows before enabling them.
- Do not book, purchase, message a provider, or perform another consequential external action without explicit user confirmation.
- Present safety and accessibility information cautiously and with sources; do not imply a guarantee.

## Current Implementation

The existing Electron + React/TypeScript prototype lives at `apps/market-research-workbench/`. Its name, UI and demo data still represent the previous market-research direction. No travel workflow or Pi SDK integration is implemented. For entry points, verification history and blockers, read the dated `docs/AGENT_HANDOFF.md` and check the current code.

## Visual Direction

The prior desktop prototype used an Apple Music-inspired dark layout. If the desktop form factor is retained, use these preferences when adapting it:

- Mac-style traffic-light window controls and a dark sidebar with grouped trips.
- A large editorial trip cover beside the itinerary title and primary actions.
- A compact, full-width list of itinerary stops with source and verification state where relevant.
- A floating bottom assistant composer, similar in position and visual weight to a media control bar.
- Charcoal surfaces, high-contrast light text, and Manchester City sky blue as the global accent; keep source and uncertainty labels readable. Preserve red/yellow/green only for macOS window-control semantics and retain distinct colors for evidence states when they carry meaning.

Keep the product's own identity, itinerary information hierarchy, and original artwork. Do not use Apple Music logos, album art, or copied product assets. Reassess the desktop form factor before treating this visual direction as a permanent requirement for the consumer product.

Do not describe the prototype as a working travel Agent. Keep demo labels visible until real data and Agent behavior are connected.

## Pi Integration Direction

Pi is the Agent foundation, not the complete product. The product UI and workflow belong in `apps/market-research-workbench/`; modify Pi core only when the required capability cannot be implemented through the supported SDK or app boundary.

For the current desktop prototype, the intended integration is to host Pi in the Electron main process through the Pi TypeScript SDK. This does not decide the final consumer deployment: if Zokila becomes a Web or mobile app, Pi sessions and model credentials need a controlled backend. See `docs/ARCHITECTURE.md`. Before implementing the desktop connection, read:

- `packages/coding-agent/docs/sdk.md`
- `packages/coding-agent/examples/sdk/README.md`
- `apps/market-research-workbench/AGENTS.md` if one is added later

Keep privileged Node.js and Pi session access out of the renderer. If renderer-to-main communication is added, expose only narrow, validated operations through a preload bridge; never expose raw `ipcRenderer` or general filesystem/shell access. Keep context isolation, renderer sandboxing, the restrictive Content Security Policy, and navigation restrictions enabled. Booking and purchase tools must require an explicit confirmation step.

## Work Style for Product Changes

- Prefer one small, end-to-end slice that improves the travel-planning workflow.
- Keep user-visible controls honest: a button that is only a mock must say so or be disabled, and demo interactions must not imply an Agent ran.
- Button hover states must not move, scale, or bounce; use color, surface, border, or shadow changes only. This is a standing product preference.
- Avoid adding framework, database, search provider, multi-Agent orchestration, or broad permissions before the first real workflow requires them.
- For technical choices that change the product boundary or data flow, record the choice and its open assumptions in `docs/decisions/` when that directory exists in this repository.
- When new user requirements arrive, update this document and the affected product behavior; do not treat the current MVP hypothesis as permanent.

## Verification Boundary

Follow `AGENTS.md` for required checks and `docs/AGENT_HANDOFF.md` for dated results. Verify the current code before claiming a feature or launch works; a renderer preview alone does not establish Electron startup, Pi connectivity, or travel-data quality.
