# Diop repair-counter pilot — issue #16

Draft pilot, one episode only. Based on published v12/main; does not depend on PR #19, activate Cambodia, change historical facts, add artwork, or publish a Site version. Issue #16 was open, unassigned, with no comments/other implementation PR when claimed. Review and exact-head browser QA remain required before merge/publication.

## Context and evidence boundary — 18 October 2026

The existing Diop story already gives Ibrahima, age 29, motorcycle-repair experience and a stall near Mbour, and places the group at a fictional workers’ cooperative in Pikine. It already offers one optional one-day repair/loading shift there and a separate six-day main-story repair choice. The pilot uses that authored adult trade and replaces the guided optional-shift interface at this one scene, sharing its existing once-per-scene allowance. The six-day story choice is unchanged. Lamine, age 12, is not assigned work.

Read primary institutional context:

- ILO, 30 June 2026, [Mbour motorbike cooperative](https://www.ilo.org/resource/article/how-motorbike-taxi-drivers-are-joining-forces-cooperative-secure-decent): motorcycle livelihoods and cooperative organization coexist with informality and limited finance/social protection. This concerns Mbour motorbike transport, **not** the fictional Pikine repair shop; no affiliation, actual job, stock level, wage or commercial arrangement is inferred.
- [Senegal Constitutional Council](https://conseilconstitutionnel.sn/la-constitution/) and [ILO NATLEX English constitutional extract, Article 25](https://natlex.ilo.org/dyn/natlex2/natlex2/files/download/59426/SEN59426.pdf): general right-to-work context. The English source is an excerpt, not a complete current business-licensing or work-permit assessment. It does not establish a particular enterprise’s permission. The pilot inherits the existing authored domestic-work premise; it grants no foreign work permission and asserts no real shop licence.
- Senegal Ministry of Vocational Training, [2024 official admissions notice](https://formation.gouv.sn/wp-content/uploads/2024/06/AVIS-CONCOURS-SESSION-2024-PHASE-2-1.pdf): motor-vehicle/engine maintenance is a recognized training field. This supports broad vocational context only; it does not certify the fictional character or prove a motorcycle-parts market price.

The shop, two packaged repair kits, shared tools, customer collections, return policy, fee and time slot are expressly invented scenario terms, not new historical facts. There is no counterfeit/illegal-trade default, no hazardous repair instruction, and no real-world recruitment or border advice. Exact occupational/business permissions are not modeled; do not present this educational scenario as a real job offer or permit guarantee. Any later geographic/era expansion requires its own research and owner review.

## Resource contract and balance

All amounts are **fictional game units**, using the app’s existing $ display; they are not Senegalese prices, wages, CFA-franc values or exchange-rate claims. Issue #16’s illustrative amounts are not reused as historical evidence.

| Metric | Change and rationale | Timing/condition |
| --- | --- | --- |
| Cash | Two repair kits cost 20 each; shared bench fee 5; total 45 paid upfront. | Exactly once on explicit commitment; requires enough cash. |
| Inventory | Two non-food kits bought; one or two supplied with collected repairs. Unused unopened kits returned at cost. Retained/household-consumed/spoiled/lost stock are all zero under this contract. | At settlement: bought = sold + returned; no invented spoilage model. |
| Cash settlement | Each collected repair brings 60 revenue including supplied parts; returned kits refund 20 each. No further fee or loss. Net = revenue + refund − 40 inventory − 5 fee. Outcomes: 35 or 75 net. | Hidden until settlement; one/two collections fixed by durable instance ID, not reader speed or skill. |
| Food / water | One existing food day and 2 L for the group’s workday. No food produced and no repair stock counted as food. | Deducted with upfront allocation once; not deducted again at settlement. Requires sufficient initial supplies. |
| Time | One elapsed journey day. | Advances once at settlement; subsequent existing choices use updated day/resources. No legal/transport deadline is fabricated. |
| Health / trust / stress / exposure | No change. | No boost-all reward or arbitrary illness/fatigue penalty. Ibrahima must be alive and above the existing strained-health threshold to take this skilled shift. |
| Opportunity | Uses the cooperative’s single optional work slot, shared with legacy one-day repair/loading actions. | No repeat at this scene/run; restarting the whole journey is an explicit fresh run, not a way to carry earnings over. |

Before commitment, the UI discloses the resource target, exact known upfront costs, food/water/time commitment and uncertainty. Exact customer collections/revenue/refund/net result appear only afterward. Sources and fictional-balance labels are available in the dialog. There is no new score, skill bonus, currency, health model or activity catalogue.

The existing six-day main-story repair choice remains separate and consumes its original six days; the pilot adds one day rather than subtracting work from that authored choice. Taking it delays whichever story choice follows and uses food/water that could otherwise support the journey. A later Saint-Louis message recalls the net cash, one day and consumed supplies without granting anything again. It does not claim a bus or appointment was missed.

## Durability, interruption and compatibility

State lives inside the existing saved family game as one optional `livelihoodActivities[diop-repair-counter-v1]` record; game version stays unchanged. Legacy saves without that field still load. Instance ID is the saved run ID plus stable episode ID. Steps are bounded to 0/1/2 and settlement phase to active/settled; repeated actions are no-ops after their boundary. The one/two-customer outcome derives from the same ID on every resolution and is never rerolled by refresh, summary or navigation.

The whole-family JSON save writes costs, inventory/step and resource totals together. Both interfaces now use one synchronous revision-aware action boundary: before applying an action, read the durable family state; if the page has an older revision or run, discard that stale intent and recover the saved state. The storage writer independently rejects stale revisions and prior-run writes. Accepted changes increment an optional `saveRevision`; legacy records without it begin at revision zero without resetting any progress or resources. Explicit family restart is the only run-replacement path. There is no unconditional post-render autosave to replay a restored snapshot. `pageshow`, storage and visibility listeners also refresh a restored page from its family slot. There is no separate cost/payout journal to reconcile. A crash before a whole-state save rolls back that entire unsaved transition; after it succeeds, reload resumes that exact saved boundary. Both the primary family slot and legacy game record contain the same ledger. Ordinary journey progress in another family remains separate. This is local prototype persistence with optimistic stale-write rejection, not a server transaction or lock across truly simultaneous tab writes; deliberate save-file editing is not an integrity boundary.

Before commitment, close/skip changes nothing. After commitment, pause closes the dialog while preserving the record. Story choices, other work, shopping, social responses and medicine updates are blocked until the day is finished or resolved in summary, preventing competing resource changes. Family switching may preserve the unfinished episode; returning offers Resume. Mode changes/refresh read the same save. A new-run/restart action is explicit and resets that run according to the existing game behavior. Completed episodes may be reopened for accounts but never paid again.

Interactive resolution has two semantic, untimed bookkeeping steps; summary resolution reaches exactly the same game object, including ledger, cash, food/water, time and later callback. There is no correct-answer bonus, failure penalty, reflex test, animation, audio requirement or simulated medical certainty. The skip-before-commit option incurs no cost/time.

## Acceptance and QA evidence

Automated checks cover both collection outcomes, gross/net cash arithmetic, upfront versus settlement costs/refunds, all stock categories, no food double counting, exactly-once time, repeated callbacks, refresh at every phase, active-action exclusion, shared work-slot limits, other-family preservation, legacy saves, summary equivalence and actual-component SSR. Existing six-journey tests remain required. Build retains Sites packaging files.

Manual QA outstanding: guided and planning interfaces; intro disclosure/cancel; both interactive steps and immediate summary; pause/reopen; refresh on every boundary; family/mode switching; rapid clicks and Back navigation; completed accounts; old optional-work save; insufficient cash/food/water and unavailable worker; travel through the next decision to the Saint-Louis callback; 1440/1024/390/320px; keyboard focus, native dialog Tab/Escape/return; standalone screen-reader announcement; 200% zoom/reduced motion. Cloud Browser skill’s required tool is unavailable, so no visual or screen-reader pass is claimed. Do not develop on the Mac; use it only for authorized QA.

Draft review should assess the fictional game-unit balance and whether the modest net cash versus lost food/water/day is useful without becoming mandatory. Existing baseline journeys remain completable without any pilot activity. Further livelihood episodes, real-market calibration or a broader economy require separate design/research; they are outside this pilot. No merge/publication or issue completion in this task.

Verification receipt: `npm run build` and `npm test` pass (93 tests, including seven new activity/accounting/render checks). Development HTTP smoke returned 200 for guided `/`, planning `/?mode=full`, and the activity component/module/styles. The owned local server was stopped. Existing build chunk-size warning remains. No browser, screen-reader, zoom or mobile-interaction pass is inferred from HTTP or SSR checks.


## Browser Back rollback regression

Mac QA found a blocking stale-page overwrite: Guided committed a repair day, Planning settled it, then browser Back restored the unfinished Guided snapshot. Acting there and reloading overwrote the newer save. The fix checks saved revisions at both the UI action boundary and storage boundary, and removes both interfaces’ post-render autosaves. No save keys are removed and the game version remains unchanged.

The exact automated regression starts at Day 3 with $2060, commits to Day 3/$2015 in Guided, settles to Day 4/$2095 in Planning, restores the frozen unfinished snapshot, attempts an old step/save and settlement, then reloads. Both family and legacy serialized records remain unchanged at the settled revision; the stale action is not executed, and another family’s save remains intact. Additional coverage protects same-day step changes and old unstamped saves/explicit restart against restored prior-run writes. These tests use the same action/save functions called by the shared React hook. Independent exact-head Mac retesting of real browser Back remains required; unit coverage is not a browser pass.
