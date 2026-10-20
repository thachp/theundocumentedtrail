# Design QA — The Undocumented Trail POC

## Evidence

- Visual direction: `/Users/thachp/repos/illegals/public/qa/guided-reference.png`
- Opening capture: `/Users/thachp/repos/illegals/public/qa/long-road-opening.png`
- Political-risk chapter: `/Users/thachp/repos/illegals/public/qa/long-road-policy.png`
- Family-loss outcome: `/Users/thachp/repos/illegals/public/qa/long-road-loss.png`
- Tested window: 1053 × 993 CSS px, DPR 2
- State coverage: opening, mid-journey political-risk decision, non-graphic child-loss outcome, memorial, detention, and ending

## Findings

No actionable P0, P1, or P2 visual or interaction issues remain.

- Typography: the editorial serif title and narrative hierarchy remain readable across long, sensitive event copy.
- Layout: the parchment map, cinematic family image, three-card decisions, resources, and family portraits remain visible at the tested browser size.
- Color: parchment, slate, sea-glass teal, amber, and rust continue to distinguish information, support, uncertainty, and danger without using gore.
- Imagery: the new home-departure scene, non-navigational map, and Ramírez family portraits are sharp and culturally grounded without logos, flags, or tactical route detail.
- Content: each intense chapter has a visible content note and direct research-basis link. Real policy material is separated from fictional commentary.
- Loss state: Daniela's portrait becomes subdued and changes to “Remembered”; the outcome and memorial avoid scoring, spectacle, or graphic imagery.
- Accessibility: primary decisions, soundtrack, continuation, reset, source links, map, resource strip, and ending remain semantically labeled.

## Primary Interactions Tested

- Started the adaptive soundtrack.
- Completed the support-network path through robbery, shelter, and transport.
- Opened the bus-station work opportunity, completed the dishwashing shift, and verified that one day, $55, and one food day were applied without replacing the main route decision.
- Reopened the completed shift card and confirmed that a second job cannot be taken at the same stop.
- Replayed the expanded support-network route through the waiting town, clinic queue, interior checkpoint, three-week northern wait, border process, and detention outcome.
- Completed the waiting-town childcare side quest; the browser journey reached release on Day 83, while the same route without optional work reaches Day 82 in the automated scenario.
- Reached and reviewed the Donald Trump policy / fictional MAGA-style influencer chapter.
- Chose the overloaded-boat branch and verified Daniela's death state.
- Continued through the memorial and legal-aid ending.
- Reset to Day 1.
- Checked browser logs: no warnings or errors.

## Verification

- [x] All game, soundtrack, and hosting tests pass.
- [x] Optional short-term work remains visually separate from the three major story choices and is usable once per eligible stop.
- [x] Four added chapters lengthen the journey through meaningful decisions rather than passive day-count inflation.
- [x] Production build succeeds.
- [x] Old saves are invalidated by the new game version.
- [x] The deliverable is reset to the opening decision.

## Follow-up Requirement

- Before public release, all sexual-violence, child-loss, detention, and country-specific writing still requires paid lived-experience consultation and trauma-informed sensitivity review as specified in the GDD.

final result: passed

---

# Cambodia gameplay reference comparison — 20 October 2026 (latest review)

Source visual truth: `/Users/thachp/Documents/Codex/2026-10-20/task/reference/image(20261020-173552).png`, materialized through Library prepare_materialize's authorized transfer, confirmed locally readable and inspected at 2048×1365 pixels. Library ID `libfile_292905a3fd2c8191beb773c2b480b9a7`. Patrick confirmed that this is a gameplay-layout reference, not a separate help article or a request to copy Honduras content.

Implementation: `artifacts/cambodia-resources/after-guided-desktop.jpg`, 1536×1100 full-page capture at CSS viewport 1536×1024, emulated device density 1. The source was proportionally reduced to 1536×1024 pixels for structural comparison; its original CSS size, browser zoom and device density are unknown. No pixel-perfect or original-density claim is made. Both show an opening decision with collapsed contextual disclosures. Different narrative, geography, people and resource semantics are intentional.

Actual before source: unchanged main `9eaa679` served separately at `http://127.0.0.1:5179`, opening E01, same 1536×1024 viewport; full page 1536×1306. `artifacts/cambodia-resources/before-guided-desktop.jpg`. Revised version uses `http://127.0.0.1:5178/?story=cambodia-1979&edition=3`.

Full-view comparison: `artifacts/cambodia-resources/reference-comparison.png` contains normalized reference left and revised implementation right. Both originals were opened before composing and the combined pixels were inspected. Focused resource/portrait comparison: `artifacts/cambodia-resources/hud-comparison.png`, bottom 200 pixels from each image, source left, implementation right. Both were inspected; this makes the icon, typography and period-resource substitutions readable rather than judging only a thumbnail.

## Findings and iteration history

- **[P1, fixed] Verbose Cambodian footer and context overwhelmed the playable composition.** Before: plain numeric columns, long resource-model text, health/cohesion list and repeated context filled the persistent region. Fix: retain the shared eight-item icon HUD with water, food, exchange/budget, contacts, health, cohesion, stress and turns; move explanations, inventory and individual states into a reopenable household-notes disclosure. Keep map/scene/three direct choices and portrait strip.
- **[P2, fixed] Wide/tall screens could leave a large empty image area above bottom-aligned narrative.** Fix: for expanded Cambodia on desktop, distribute the story and decision regions with the narrative at the top, and keep at least 820px for the map/context/progress to fit. Re-capture shows the opening headline at the top, all three cards and full chapter panel, plus the bottom HUD. Full document is 1100px tall at the tested 1024px viewport; normal vertical scroll is intentional and no persistent control is clipped.
- **[P2, fixed] Expanded footer shrank below the shared cinematic status band's height.** Fix: remove its old content-sized grid-row override, restoring the shared desktop footer sizing. Final capture supersedes the earlier smaller-HUD capture in Library version 1.
- **[P2, fixed] Browser console showed duplicate sibling key `cambodia-1979-E01`.** It preexisted in SceneHistory's historical details and SharedPlaceContext. Prefix the shared-place key. A fresh browser tab's opening → choice → Back returned zero captured warning/error records after the fix. No story behavior was changed.

## Required fidelity surfaces

- **Fonts/typography:** shared Georgia display/choice type and IBM Plex Sans body/status text retained; hierarchy, case and weight match the existing product. The source's original device/zoom scale is unknown, so relative hierarchy is compared, not an invented exact CSS scale.
- **Spacing/layout:** parchment map left; scene, voice, setting context and decision prompt right; three cards; persistent icon HUD and four portraits. Revised width 1536 has no horizontal overflow; map content and full chapter gauge fit. Mobile 390/320 Guided and 320 Planning retain readable stacked flows without horizontal overflow. Source text is shorter and includes a generic resupply disclosure; Cambodia instead uses authored relief/work choices and household information. Those content-dependent heights are intentional.
- **Colors/tokens:** existing cream/parchment, dark teal/black panels, teal water icon, amber decision bar, subtle borders and native focus styles retained. No unrelated palette introduced.
- **Image quality/assets:** existing provenance-checked Cambodian scenes/portraits retained, with correct four-person roster and geographic map. No Honduran family art, invented archival image or generated replacement was used. Narration is honestly labeled Household account; it is not reassigned to a traveler merely to copy a face-avatar layout. Actual family portraits remain in the status band and person dialogs.
- **Copy/content:** November 1979, western Cambodia, paper contacts, fictional occasion units and exchange means are explicit; later California changes the monetary label to Budget. No phone battery, paper percentage, medication purchase or modern social feed is introduced. The expanded tutorial now explains persistent resources rather than the frozen original edition's time/energy model.

## Interaction evidence and remaining gaps

Passed: actual choice updates food and Contacts from Uncertain to Notes kept; household disclosure reveals protected paper names; Back restores the initial food/contact state; Planning confirmation and mode switching preserve the run; refresh/restart and a main-route ending exercised. Other-family regression retried successfully: Ramírez phone 82% → 79%, risk 12% → 17%, outcome retained after refresh/Continue. Automated aggregate tests and build passed; see validation.json for final counts.

Source screenshot was not used to infer accessibility certification. Screen-reader/AT testing remains UNRUN (issue #31 deferred). A full new 200% zoom, reduced-motion, contrast and keyboard audit is UNRUN. Optional 1985 browser chapter unrun; engine paths tested. Minor [P3] existing long role labels can truncate in the portrait strip; full identities/roles remain available through person controls.

Checklist: source materialized and inspected; existing layout reused; substantive findings fixed; final full/focused comparison inspected; mobile widths and primary controls exercised; console checked; screenshots saved; no merge or deployment.

final result: passed

---

# Latest follow-up: remove Household notes & resources

Patrick's subsequent explicit instruction supersedes the earlier disclosure design: remove the section and all of its contents, with no replacement explanatory panel. The existing Oregon Trail-style gameplay remains the target.

Implementation evidence: refreshed `artifacts/cambodia-resources/after-guided-desktop.jpg` (1536×1100 full page), `after-guided-390.jpg`, `after-planning-320.jpg`, and `removal-verification.json`. Source reference and normalization are unchanged. The desktop screenshot was opened and inspected: the standalone Back button remains between narrative and historical setting context, and no household-notes wrapper, summary or hidden contents remain. Updated full and HUD comparison images retain the same composition and asset treatment; there are no changes to typography, palette, art, game choices or HUD styling beyond removing the disclosure and styling Back.

PASS: Guided and Planning at 1536/390/320 widths; all eight HUD cells, history/source disclosure and Back remain; no settled horizontal overflow. Planning Escape/confirm/keyboard Back passed, with resource changes reversed correctly. Console warning/error list empty. Aggregate 180 tests and build passed. Original editions, save behavior and resource rules were not changed. Screen reader remains unrun.

Updated after Library attachment: `libfile_16adad53878481919fb0ba75481c1b1d`, version 2. Initial browser failures recovered using normal navigation in the existing Chrome preview. No P0/P1/P2 finding remains; no replacement panel or unrequested global redesign was introduced.

final result: passed
