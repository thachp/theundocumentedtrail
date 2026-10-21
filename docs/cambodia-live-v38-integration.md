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

## Cloud exact-tree browser review (21 October 2026)

The browser-capable executor fetched GitHub integration commit `20766db9c1e6742794f432b5d7f2581310f323d1` and verified tree `b2fedcea7392f2c6b96d20916ef6f422e12d3e51` before testing. That tree matches the native reviewed source. The following evidence supersedes the native browser limitation above for this integration; PR38 artifacts remain historical.

Pixel review found the live Planning sidebar is narrower than the older PR38 layout. Viewport-only responsive rules left four coordinator columns and three pace columns cramped within it on desktop. A scoped container-width rule now uses two coordinator columns and stacked pace cards when the planner itself is at most 480px wide. It does not change shared maps, artwork, narrative, care mechanics or global layout. A browser assertion verifies narrow pace cards are at least 200px wide.

Current evidence is in `artifacts/cambodia-v38-integration/`, with runnable `scripts/qa-cambodia-v38-*.cjs` scripts. Browser storage is isolated; real saves and reports are not cleared or submitted. Tools checks inspect the GitHub feedback draft link without opening or submitting it.

After the scoped CSS repair, `node --test --test-force-exit tests/*.test.mjs` completed with **224 passed, 0 failed, 0 skipped**, and `npm run build` passed. `npm run test:sites` also passed (4 tests). The existing build chunk-size warning and parallel Vite websocket-port collision warnings remain; neither caused failing assertions. Force-exit handles retained test-server handles; no screen-reader pass is inferred.

Final browser reports include six care/interleaving cases (both modes at 1365, 390 and 320px), four genuine Chromium 200% zoom cases (both modes at 390/320px layout width), and two mobile tools cases. Care checks cover keyboard treatment, care/resupply ordering, pending-plan cancellation, care before and after commitment, immutable travel receipts, refresh, persistent injury eligibility and rules-3 care resume. Tools checks cover illustrated artwork, GitHub draft context without submission, Escape/focus restoration and switching views without changing the save. All recorded care/tool/zoom cases passed without page errors or document overflow. Pixel inspections included Guided mobile mine/planner, Planning desktop recovery and repaired planner, and Planning mobile recovery/resupply/planner. Planning's existing internal HUD/portrait scrolling is retained.

The final broader gameplay batch also passed: **60 records, zero page errors, zero overflow/HUD failures**. It covers nine representative scenes in both views at 1365/390/320px, plus six functional flows for resupply stock/refresh, Planning confirmation cancellation, pending-plan resume, coordinator requirement, draft cancellation/focus, commitment, Back/navigation persistence, disabled injured coordinator, rules-3 resume and original-edition rosters. This is 72 records across the gameplay/care/tools/zoom reports, with genuine zoom counted separately from viewport emulation. The final narrow-panel assertion passed. The first concurrent browser attempt timed out on page load; the final sequential run completed successfully. No product defect was inferred from that timeout.

Actual screen-reader testing, physical-device touch/trackpad checks and independent community/native-language/historical review remain unrun. No merge, deployment or live release verification was performed. The source/fiction qualifications from both feature branches remain intact; no new procedural or historical guarantee was introduced by this CSS/QA follow-up.
