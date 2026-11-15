# Market Research Workbench

This is the existing Electron desktop prototype for **走起啦 · Zokila**, with a React + TypeScript renderer. The current UI and directory name still reflect an earlier manufacturing market-research prototype. The active product direction is a consumer travel and mobility assistant; see `../../PRODUCT_CONTEXT.md` and `../../docs/decisions/0004-consumer-travel-direction.md`. Travel features have not yet been implemented.

The current visual direction is inspired by the macOS Apple Music playlist layout: a library sidebar, spacious project cover/header, evidence rows, and a floating assistant composer. The global accent is Manchester City sky blue. All artwork and styling in the app are authored for this product; the Apple Design Resources kit is not embedded.

## Develop and run

From the Pi repository root:

```sh
npm install --workspace=apps/market-research-workbench --ignore-scripts
node node_modules/electron/install.js
npm run dev --workspace=apps/market-research-workbench
```

The Vite server opens the React renderer at `http://127.0.0.1:5173/`. To launch the Electron desktop shell, build the renderer first, then start Electron:

```sh
npm run typecheck --workspace=apps/market-research-workbench
npm run build --workspace=apps/market-research-workbench
npm run start --workspace=apps/market-research-workbench
```

The Electron install step downloads and verifies the platform runtime after npm lifecycle scripts were skipped. The package-lock pins all direct dependencies.

The active renderer entry point is `index.html`, which mounts React from `src/main.tsx`. The previous static prototype files `workbench.html` and `app.js` remain as a rollback reference and are not loaded by the Electron app. The current UI uses local demonstration content; it does not call a model, browse the web, persist research tasks, or invoke the Pi SDK.

## Current UI slice

- React components for the desktop research workspace, brief, source list, and assistant composer.
- New research form for client, product, market, and research question.
- Local-only chat composer and navigation interactions that clearly state they are demos.
- macOS traffic-light and Windows minimize/maximize/close controls use a narrow preload API; Electron renderer has no Node integration, with context isolation and sandboxing enabled.
