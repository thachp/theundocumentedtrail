# Cambodia gameplay + live v38 integration

This local integration combines live Site source `02461665f542462075976a47965843caec8126ec` with approved GitHub PR38 merge `02b997919a6845523a678414d23a37de12a1906d` (common base `05b350a666b5b890ddda033c7a395dcdf91d6a57`). It does not replace the newer Site with the older PR build. No push, GitHub merge, or deployment was performed in this integration task.

## Preserved live behavior

The current illustrated maps, location-specific Cambodia artwork, shared compact header/tools/view switch, feedback drafts, six-resource Cambodia HUD, percentage stress/exposure, shared individual care cards, named family voices, callbacks and personal ending remain. No existing artwork or layout styles were replaced. M01/M02 use border-region art and now receive the same named voices and recovery continuity as the other scenes. Gameplay prose follows the latest natural-narrative direction; the fiction/source distinction and non-graphic rescue premise remain in optional context and accessible image descriptions.

Fresh expanded runs use rules 4 with the approved coordinator/pace, actual travel days, bounded food/water supply and non-graphic mine/recovery branch. Original editions and saved expanded rules 1–3 keep their existing replay and separate keys. The live medicine mechanic remains available in all expanded rules; no drug names or dosage claims were added.

## Replay and irreversibility

- Rules-4 care is a canonical action in the same ordered log as choices, continuation, resupply and travel. Replaying rebuilds both medicine receipts and resource/health state.
- Activity history follows action order, including treatment before, during and after a pending leg. A later treatment cannot rewrite a committed travel receipt.
- The save boundary reconstructs the entire adapter from validated state, protects both care and action prefixes, and rejects same-run resource-rule upgrades/downgrades. Mutable fields cannot refund supplies, skip a pending leg or replace a plan.
- Invalid actions preserve the in-memory baseline when storage is unavailable; they do not replace it with a fresh fallback journey.
- Archives retain care history and the complete rules-4 canonical state while preserving older rows. Injured Vann remains ineligible for coordination after medicine improves health.

## Validation

The complete `tests/*.test.mjs` suite was run with Node's `--test-force-exit` option. This runs the same assertions plus every repository test file; it does not skip tests. Plain `npm test` reached passing render assertions but retained Vite test-process handles in this executor, so no clean plain-runner completion is claimed. Parallel Vite render tests can emit existing websocket-port collision warnings. Final result: 224 tests passed, 0 failed, 0 skipped. This includes eight canonical integration regressions and two shared-component SSR regressions; SSR is not browser layout/interaction verification.

Production `npm run build` and `npm run test:sites` pass. Required outputs are `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`. The existing bundle-size warning remains.

### Browser limitation and remaining gate

No current-tree browser/screenshot pass is claimed. A supported cloud browser was available, but the native sandbox preview was unreachable: all-interface Vite startup failed on network-interface enumeration; loopback-only startup reported ready but HTTP and cloud browser requests were refused. A normal approval-requested loopback preview launch failed at sandbox setup with a read-only-filesystem error, before launch. No sandbox workaround or user-computer access was attempted. Owned preview and hanging test sessions were stopped.

The `artifacts/cambodia-controls/` screenshots and browser report are historical evidence from PR38, not evidence for this merged tree. The browser-capable coding task should verify this exact tree at desktop and 390/320px, including both views, care/resupply, coordinator/pace cancellation and commitment, refresh/Back, injury eligibility, old saves, illustrated maps, compact tools/feedback and no horizontal overflow. Inspect new screenshots before publication.
