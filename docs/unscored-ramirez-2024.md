# Unscored journeys and Ramírez historical setting

This implements the requested design scope: remove the overall journey score and give Ramírez a coherent, documented historical period. It is based on main `194325a91d1fee7504732a1ee699080d710f5520`; it does not change PR 23 or PR 24. No publication approval is implied.

## Overall score removal

The health/trust/cash/risk/climate aggregate and its survivor-only denominator are removed, rather than tuned. Neither view computes or displays it in endings, family cards or archives. New archive entries retain factual journey records without a score. Existing archive/save fields are accepted and left intact, including old numeric scores, but no UI reads those fields. There is no save reset/version bump, rank replacement or hidden numeric reward for a death.

Resource panels, names and losses, days, decisions, route history, survivors and average health remain. These descriptive records are not an overall assessment of a person's worth. Existing outcome identities and completion states are unchanged. Archive and ending grids now accommodate the remaining fields, with day/decision information retained on narrow screens.

## Historical period and source review

The fictional departure is **15 January 2024**. All authored branches, optional work and a conservative maximum incident allowance stay before **5 June 2024**. A regression checks that bound. The early-2024 setting is visible in the chooser, history, scene context and calendar. A legacy save beyond the supported calendar window retains its exact day and uses an explicit “calendar not reconstructed” label instead of applying the old rule to a later date.

Primary records read 18 October 2026:

- [DHS/DOJ, Circumvention of Lawful Pathways](https://www.govinfo.gov/content/pkg/FR-2023-05-16/html/2023-10146.htm), published 16 May 2023, effective 11 May 2023: rule text §§208.33/1208.33, CBP One geographic-access discussion and access-obstacle exceptions. This supplies the historical rule context; not a blanket statement that everyone without an appointment is ineligible.
- [21 March 2024 House hearing, CBP prepared statement](https://www.govinfo.gov/content/pkg/CHRG-118hhrg57673/html/CHRG-118hhrg57673.htm), printed pp. 23–25, especially “CBP One's Role in Processing Noncitizens”: describes the inspection-scheduling function and distinguishes it from asylum and parole. CBP's testimony is attributed to the agency; political allegations by other participants are not adopted as facts or endorsements.

Direct CBP press-release pages returned 403; no access denial was bypassed. The active evidence links are independently available original GovInfo records, not proxies for the denied pages. The February 2024 CBP bulletin was also readable but its short excerpt does not independently supply the full appointment mechanics, so it is not used as their authority. Full legal-document certification or external review is not claimed.

## Narrative/mechanical contract

All 45 Ramírez choice IDs, next-scene links, durations, requirements, flags, resource effects and ending identities remain. January 2025 enforcement/Trump framing is removed from the relevant source and dialogue. The May 2023 historical rule is separated from the fictional political video.

The former shelter “verified list” becomes assistance with the actual historical CBP One request mechanism. The shelter does not allocate government slots. The three waiting branches reach an expressly fictional later booking; the 21/30/5 story-day values are not official waits. At the next scene the appointment's time/place is confirmed within the authored continuation; inspection, admission, asylum, release and removal remain separate. The river turn-back branch also explicitly identifies its later fictional booking instead of obtaining an immediate appointment by turning back. Individual advice and exceptions remain relevant; the app is not presented as the only possible legal circumstance or universally usable route.

The necessary change is to the policy premise and the explanation of transitions, not a new availability/probability mechanic. Existing resource and duration arithmetic is retained and cannot be used as a real appointment forecast. The sponsor-release outcome is explicitly fictional and is not guaranteed by asking for counsel.

## Saves and QA

Legacy Ramírez display copy refreshes through the existing narrative boundary: current outcome, pending/completed ending, log titles, feed result and relationship text. It preserves resources, people, flags, elapsed days, progress, losses, run ID, phase and branch. A dedicated update notice distinguishes this from the Haddad calendar correction. It does not rewrite storage merely by loading.

Tests cover score API/consumers and archive behavior, legacy data preservation, the complete calendar bound, historical mechanism/limitations and display refresh/idempotence. Existing gameplay route tests retain their resource/history assertions. Full build/tests are required. Native desktop/mobile checks remain pending: three-field endings, archive rows with legacy scores, chooser and history dates, each waiting branch, river turn-back, legacy outcome/ending/feed resume, and family switching. No browser, screen-reader or reduced-motion pass is inferred from source/SSR checks.

Integration with PR 23's narrative refresh and PR 24's save boundary needs a separate combined retest after their own review. This branch does not absorb or modify either pending head and contains no PR 20 activity. The broader audit choices (fixed deaths, public-climate mechanics and generic custody threshold) remain outside this approved scope.

Verification receipt: production/Sites build and all **113 tests passed** (main's 108 plus five new regressions). Direct comparison against the base confirms non-display mechanics and ending identities for all 174 choices. The conservative calendar bound ends 29 May 2024. Existing large-chunk warning remains; native visual/accessibility QA is pending.

## Integration and ending-focus follow-up

Integrated merged main `e018af8fb9930bedcc7c9ed3250f7673283c3091`, preserving both Punjab's procedural display refresh and Ramírez's historical refresh. Both regression suites and the revision-aware save boundary remain. The archive test now uses explicit restart before creating a new run, matching the stale-write contract rather than attempting an unauthorized run replacement.

Mac QA found an inherited ending-modal keyboard escape. Both endings now use a native modal dialog, focus the heading, prevent unsupported dismissal and return focus to a connected trigger or a visible stable header link. The ending closes while history, restart or family selection is open, avoiding competing modal layers. No ending mechanics or score is added. Two regression checks cover native dialog markup, focus/return lifecycle and overlay suspension; they do not constitute a browser Tab/Shift+Tab pass.

Integrated verification: **127 tests and production/Sites build pass**. Native-browser retest of ending focus, nested tools and combined save/calendar behavior remains required. Cambodia's larger journey migration is separate and publication remains gated on final combined QA.
