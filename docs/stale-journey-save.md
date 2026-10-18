# Shared journey stale-save repair

Base: current main `194325a91d1fee7504732a1ee699080d710f5520`. Independent Mac QA of PR 23 reproduced Planning completion at Day 96 → browser Back to frozen Guided Day 54 → action/reload persisting the earlier state. This is an inherited shared-save defect, separate from the Punjab procedural copy.

This change extracts the generic save boundary from held PR 20 head `4e860a3cdb35010ed9a0f4cca0abcdcfd1c894a8`: revision-aware writes, synchronous actions and shared restoration hook. It contains no repair activity code, feature state machine, UI, assets or enablement. PR 20 remains held for its own explicit accessibility checks; this extraction neither satisfies nor bypasses those gates.

## Contract

- Each family/run has an optional `saveRevision`; legacy saves start at revision zero. Successful changed writes increment it. Equal-content writes are no-ops.
- Before a function action runs, the durable family slot is compared with the page's run/revision. Stale intent is discarded and current saved state returned. The storage writer independently rejects older bases and prior runs.
- Both Guided and Planning use one synchronous action boundary, saving before rendering and updating a ref so a second action cannot use the previous render's state. Post-render autosaves are removed.
- `pageshow` (including Back/Forward restoration), storage changes and returning to visible refresh the page from its current family's durable slot. Observer cleanup removes listeners.
- Only explicit restart can replace a run. Save keys/version, legacy payload, resources, phases, story IDs and archive records retain their existing format; no data reset or numerical gameplay change. The optional revision is compatible with unknown-field-tolerant existing saves.

## Evidence and limits

Automated regression reproduces the exact Punjab Day 54 decision → Day 96 ended route with the real choice/continue functions; stale direct writes and stale actions cannot change durable family, legacy or archive bytes. It also covers the prior Diop Day 3/$2015 → Day 4/$2095 transaction as a generic state fixture, not as an activity-feature test. Same-day/duplicate actions, legacy revision adoption, explicit restart, all-family isolation, archive exactly-once behavior and Back/Forward/storage/visibility observer cleanup are covered. Actual view source wiring is checked for the shared boundary and absence of autosaves/activity imports.

Unit dispatch of restoration events is not a browser-cache test. Independent exact-head Mac retest remains required in both directions/views: original Punjab sequence, act immediately after Back, Forward, reload, repeated/double clicks, same-day steps, old saves, restart and family switching. PR 23's source-date correction is a separate branch; integrated retest must include it before that PR is approved. No merge/deploy is authorized until retest. No actual screen-reader/reduced-motion or external review is claimed.

LocalStorage is not a transactional multi-client database; this addresses stale restored pages and revision conflicts, not arbitrary simultaneous cross-tab writes or clients still running old code that lacks this guard. Reload old clients before retesting. The runtime/browser retest, rather than synthetic unit events, decides whether the reported P1 is resolved.

Verification receipt: full suite **114 tests passed** (main's 108 plus six new save/navigation regressions); production/Sites build passed. Existing large-chunk warning remains. No cloud browser tool is exposed, so no native browser retest is claimed.
