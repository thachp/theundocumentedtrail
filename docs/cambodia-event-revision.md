# Cambodia event revision — 20 October 2026

Base: `main` / live v19 `125fbab2b6d35ae5a7ef7f0aa5f85c1a1b345b4f`.
Branch: `fix/cambodia-event-journey`. Implementation authorized in the delegated conversation; no merge or release authorized.

## Result

New expanded Cambodian runs use resource rules 3. The four travelers, 1979 departure, Khao-I-Dang reception, independent fictional 1981 admission and Long Beach destination remain intact. Choices now include a faster movement that bypasses the crowded rest stop at an individual health cost, a border delay obstacle, a follow-up care obstacle, and a shortage that interrupts household plans. Care can postpone the repair opportunity. Paying the unverified recovery offer also leads into recovery planning. Relief remains available without payment.

Active days accumulate across events. Road legs use food and water each travel day; travel days are separately tracked. Offscreen months and years remain dated narrative transitions, not simulated ration periods. Individual effort changes Dara, Vann, Maly or Sophea separately; Maly enters the fever event with an explicit condition, and assessment changes it to recovering. Extra work can leave Dara exhausted. Final household descriptions reflect recovery needs, remaining means and plans, never a rank or earned legal admission.

Rules 1 and 2 replay unchanged, including saves without an explicit resource-rules version. Original v1/v2 editions and archives retain separate storage. Existing resource tests now explicitly exercise their original rules 2, alongside the new rules-3 tests. Committed decisions cannot be refunded through Back, refresh or repeated action; cancellation remains possible before confirmation. Restart is explicit and scoped to the selected family.

Completed-run listings are removed from the chooser. No archive deletion code or storage-key changes were introduced. The overall source/fiction note replaces repeated gameplay-header labels; detailed historical limitations remain available in sources. Cuba/Valdés and boat-Vietnam/Nguyễn remain hidden on main's existing registry, and Bùi remains available.

## Actual reference and card repair

The current Library skill materialized `libfile_23ee509be6948191898577234fbb6baf` into `/workspace/library-files/card-reference.png`, with identity metadata applied. The PNG was opened and inspected; no parent filesystem path was assumed. It depicts Aurelia's Planning group-member detail card, with portrait, condition, strengths and medicine button.

Reproduction at 390 × 700: opening Aurelia after the page scrolled to her person button placed the old map-anchored card at y=-851, above the viewport. The card now anchors to the viewport, bounds scrolling height and portrait dimensions, and uses a narrower layout on phones. The close control is 44px; keyboard focus enters it, Escape closes the card, and focus returns to the person button. Verified at 1365, 390 and 320px. See `artifacts/cambodia-events/reference-card-report.json` and matching PNGs.

## Evidence and source/fiction ledger

No new historical route, mine-handling, clinical diagnosis, admission procedure or camp work entitlement is asserted. Added incidents, waits, resource quantities, individual effects and outcomes are authored game events, not estimated historical probabilities or medical measurements. Existing source IDs and original art are reused with their existing provenance and geographic anchors. No new art was generated.

- CDC, *Surveillance of Health Status … Khao I-Dang … December 1981–June 1983*: https://www.cdc.gov/mmwr/preview/mmwrhtml/00000123.htm — opened in this run. Supports the broad later camp health/relief setting; not a diagnosis, 1980 queue duration, or a gameplay effect. Its retrospective editorial note discusses surveillance from 1979. Later statistics are not imported as early-1980 facts.
- UNHCR, *The State of the World's Refugees 2000*, chapter 4: https://www.unhcr.org/sites/default/files/legacy-pdf/3ebf9bad0.pdf — refetch returned HTTP 429. Existing reviewed source ledger and distinctions remain; no new claim depends on a newly verified reading.
- Existing claim, art and chronology ledgers: `docs/cambodia-expanded.md`, `docs/cambodia-resource-correction.md`, `docs/cambodia-four-person.md`.

## Validation

`npm run build` and full `npm test`: PASS, 193 tests across 11 suites/commands, including Sites worker tests. The build retains `dist/client/index.html`, `dist/server/index.js` and `dist/.openai/hosting.json`. New engine tests exercise 160 full rules-3 paths, branching, active/travel days, daily supplies, individual conditions, ending variation, deterministic replay and duplicate-commit protection. Older edition/save/archive/stale-tab checks remain in the full suite.

Browser evidence is in `artifacts/cambodia-events/`:

- `browser-report.json`: 126 passing checks: 19 reachable scenes × Guided/Planning × 1365/390/320px, plus repeated commitment/navigation and Planning confirmation flows. No page errors, broken images, missing HUD or horizontal overflow. Commit/reload/continue/Back/reload and Planning cancellation preserved the saved state.
- `supplement-report.json`: both modes at 1365/390px; actual chooser entry, source links, keyboard history dismissal and focus return, person dialogs, mode switch and ending.
- `zoom-report.json`: genuine Chromium page zoom 200%, outer widths 1440/780/640 (layout widths 720/390/320), both modes; 24 scene checks and six interaction flows. Keyboard focus containment/return, repeated source/person dismissal, three Planning confirmation cancellation paths, outcome and decision reload. Reduced motion was emulated and computed animation durations checked. No screen-reader testing was performed.
- `restart-report.json`: both modes; cancel preserves the run, explicit restart creates a fresh run and the original-edition archive sentinel remains unchanged.
- `reference-card-report.json`: visible card bounds, no horizontal overflow, close focus, Escape and focus restoration at three widths.

Reports record the base head and/or dirty working tree where applicable: they were produced before the review commit from the implementation tree. PNGs are review evidence, not claims of production deployment. Touch/trackpad hardware, external community/language review and screen-reader testing remain unrun. Existing content-source limitations remain documented rather than treated as newly certified.

## Review delivery and blockers

GitHub open-PR lookup through GraphQL returned `Forbidden`; REST `GET /repos/thachp/theundocumentedtrail/pulls` also returned `Forbidden`. Therefore dependent PR state could not be inspected and automatic draft-PR preparation is blocked by API access, not pending user approval. Local draft PR text is in `docs/cambodia-events-pr.md`. No merge or deploy has been attempted.
