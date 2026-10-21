# Cambodian travel controls — rules 4

Base/main: `05b350a666b5b890ddda033c7a395dcdf91d6a57` (v20 / PR37). Branch: `feat/cambodia-travel-controls`. Main was freshly checked and remained at that SHA during implementation. Connected GitHub reads found only unrelated open draft PR20; it was not changed. No screenshot-layout work, merge or publication is included.

## Household, chronology and premises

Dara (24 in late 1979, clothing repair), Vann (23, shared tasks), Maly (49, household planning) and Sophea (22, contact notes) remain the four named relatives. Departure is late 1979, reception is in the Khao-I-Dang setting, the independent fictional U.S. case outcome remains in 1981, and the household continues in Long Beach. Original editions and the optional separate 1985 correspondence remain intact. All four survive as the existing premise; no gameplay score, earned admission, universal work entitlement or promised safe route was added.

## Implemented controls

Both existing views use the same `CambodiaTravelPlanner` and `CambodiaResupply` components. The main layout, map projection, artwork, chooser and other families are unchanged.

Explicit movement choices at E02, E04, T01 and M02 create a durable pending leg after the story decision. Local tasks, clinic queues, correspondence and long offscreen date transitions are not automatically treated as travel legs. An eligible family coordinator must be selected before pace can be selected. Role/pace selections are drafts until **Commit travel plan**; Keep thinking cancels the draft without cost and returns focus to the pace button. The story decision itself remains committed.

Brisk travel takes one fewer actual travel day (minimum one), with greater fatigue/strain. Steady travel uses the authored baseline. More rest takes an extra actual day, uses more food/water, and leaves more room for recovery. Shortages add fatigue/strain rather than preventing help. Dara protects carried food, Maly protects water, Vann’s shared-load role reduces fatigue and Sophea’s contact planning reduces strain. Cohesion affects the size of their contribution. Low health, and Vann’s injury-related need for lighter tasks, affect eligibility. These are authored game quantities, not medical measurements, historical probabilities or mine-safety instructions.

Only the committed travel plan charges its travel days and daily food/water; movement-choice preparation does not charge the same leg a second time. Receipts contain assignment, role, actual days, resource deltas and individual health deltas. Continue remains blocked until the pending leg is resolved. Completed plans remain visible in the outcome and activity history.

Optional bounded food/water preparation is available at departure, relief/exchange at selected camp scenes, and household provisions in California. Each item/allocation is collected at most once per stop; stock/capacity and affordability are enforced in the reducer. Paid provisions use exchange/budget units, not dollar prices. Camp relief is free and not contingent on work or payment. No phone charging, medicine inventory, purchased assessment or cross-border currency conversion was introduced. The food/water resupply capacity is 12 units; an authored scene may grant more, and a partial refill never reduces an already higher store.

## Save contract

Fresh expanded runs use `resourceRulesVersion: 4`; `householdEdition` remains 3 and the existing separate expanded save key remains unchanged. Rules 1–3 and original editions retain their original behavior and replay. Rules-3 regression fixtures explicitly keep their original rule number; the new tests exercise rules 4 independently.

A bounded canonical `actionLog` records choices, continuation, resupply and travel commitments. Replay reconstructs pending legs, resources, individual conditions, assignments, strategy receipts and purchases rather than trusting mutable adapter fields. The revision-aware save boundary also requires the action-log prefix to remain intact, protecting resupply and same-scene travel commitments from stale actions or direct-object refunds. Repeated purchases/plans cannot pay or charge again. Refresh/Back preserve the latest commitment; only explicit restart starts over. Rules-4 completed archives include the canonical state/receipts; older archive entries are retained.

## Non-graphic mine encounter and claim ledger

Rules 4 can branch from onward movement into M01/M02. Vann has been injured in a mine explosion; neither injury nor explosion is depicted. The player allocates household time to trained assistance, offscreen responder-coordinated evacuation, accompaniment and care. There is no device interaction, disarming sequence, foot-on-mine premise, rescue technique, tactical navigation, timer or safety-success score. The onward choices concern companions, lighter tasks, relief and a changed timetable. Vann’s condition persists and affects the onward coordinator options. No choice purchases or earns admission.

Specific family incidents, helpers, rescue, waits, quantities, exchange opportunities, injury course and onward arrangements are fiction. No named response service, response time, route clearance, diagnosis or treatment protocol is reconstructed. The event uses an approximate border-region anchor; the movement is offscreen and no route is certified safe.

Sources read on 21 October 2026:

- ICRC, **23 June 2015**, *Contemporary Challenges to Humanitarian Action*, section “ICRC in the region”: https://www.icrc.org/en/document/7th-princess-maha-chakri-sirindhorn-lecture-international-humanitarian-law-contemporary — retrospectively confirms emergency food/water assistance during the 1979 border crisis and the Khao-I-Dang hospital. It does not verify the fictional mine response or this household’s access/wait. Added as source E6 and cited in the encounter’s optional context.
- ICRC/Greenberg Research, **December 1999**, *People on War: Country report Cambodia*, printed pp.15–17 / PDF pp.26–28: https://www.icrc.org/sites/default/files/external/doc/en/assets/files/other/cambodia.pdf — later evidence about landmine harm and enduring disability. Its later figures and testimony are not projected into a specific late-1979 incident, nor reproduced as family biography or instructions.
- CDC, **1983**, *Surveillance of Health Status … December 1981–June 1983*: https://www.cdc.gov/mmwr/preview/mmwrhtml/00000123.htm — later health context, including mine/weapon injuries among referrals and an editorial account of surveillance beginning in 1979. It is not a diagnosis or evidence of this fictional late-1979 evacuation.

The UNHCR chapter previously cited by the journey returned HTTP429 again; no new detailed claim relies on a newly verified reading of it. Initial broad searches were not treated as evidence. The inaccessible guessed ICRC “40 years” page was replaced with the opened, dated institutional account above. Existing source/art ledgers remain in `docs/cambodia-expanded.md` and related documents. No new art was generated: the existing four-person pause illustration is explicitly symbolic; blast, injury and rescue are not shown.

## Validation and limits

Final build and full `npm test`: **198 passing tests**, including Sites worker tests. The build emits `dist/client/index.html`, `dist/server/index.js` and `dist/.openai/hosting.json`. New tests cover actual day/resource differences across all three strategies, coordinator requirements and role effects, bounded/free/paid/capped stock, duplicate actions, canonical round trips, stale revisions, direct-object refunds, rules 1–3 retention, completed archives and 80 full rules-4 routes including injury continuity and eligibility. Existing rules-3 path tests retain their original replay.

`artifacts/cambodia-controls/browser-report.json`: **60 records** — nine representative scenes × both modes × 1365/390/320px (54 scene checks), plus six functional flows. Those flows cover keyboard resupply and assignment, blocked pace before assignment, draft-plan cancellation/focus return, Planning story-confirmation cancellation, commitment, pending/committed refresh, Back navigation, disabled injured coordinator, rules-3 resume and original v1/v2 rosters. No recorded page errors or document overflow. A rendered-width/role-column assertion guards against the existing Planning outcome-card CSS squeezing new controls into its icon column. That issue was caught by pixel review and repaired with scoped control CSS.

`zoom-report.json`: genuine Chromium page zoom 200% in both modes at 390/320px layout widths, recording DPR2, visual scale1 and CSS zoom1. Keyboard commitment, cancellation and refresh passed without horizontal overflow. Reduced motion was emulated. Screenshots show the planner, resupply and non-graphic encounter at desktop/mobile widths.

Actual screen-reader testing, physical touch/trackpad testing, community/language review and independent historical review remain unrun. Existing image crops and the established layout were preserved. No live-site, release, or new artwork claim is made by these checks. Browser evidence was collected from the implementation tree before the review commit; final source build/tests were rerun after edits. No merge or deploy was attempted.

Final review additionally traversed 4,009,890 deduplicated early-journey state snapshots (including resources, people, flags and pending legs), reaching 291,483 pending-leg snapshots, of which 286,104 were M02 injury/recovery snapshots. Every checked pending leg retained at least three eligible coordinators; injured Vann was unavailable. This is a bounded early-journey availability check, not an assertion of exhaustive browser or all inventory-history testing. The five new control tests passed again after final review. Final desktop planner, mobile mine encounter and mobile resupply PNGs were inspected as pixels.
