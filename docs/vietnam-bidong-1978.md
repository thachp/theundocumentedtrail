# Across the Water · issue 27

Draft implementation only. No merge, deployment or publication until root exact-head QA and owner approval. Based on stable main `b62c59e08d9a7bfba7feb088a4d6d09bbfd98727` after the owner reported PR25/28 merged and published. Reconciliation preserves the latest map sizing, hero framing, source action, focus and save fixes; original story data, images and namespaces are unchanged. Earlier preparation used the supplied PR28 head `612db7a9e29e12faf272e322257b20288c779a80`. Neither shared branch was altered by this task. Only tickets26/27 were claimed in this task.

## Story and evidence

Nine dated scenes and twenty-seven namespaced choices follow the invented Nguyễn household: Linh32, Minh35 and Mai10. Work, relationships, names, routines, belongings, waits, authorized U.S. resettlement and Michigan placement are fiction. These are not Tina Hinh's family or a composite reproducing her distinctive incidents. No quotation, likeness or personal incident from her interview was used. Survival and later1979 authorization are fixed authorial premises, independent of every choice/resource. U.S. arrival is not moral success or an assimilation/citizenship victory.

Directly read 18 October2026:

- [UNHCR A/34/12](https://www.refworld.org/reference/annualreport/unhcr/1979/en/42267), 11 October1979, paragraphs21–24 and215–216: temporary asylum versus resettlement, Bidong accommodation and assistance context for1978. A contemporaneous operational account, not a complete history or an individual case record. No statistic is used as an admission probability or aid entitlement.
- [State Department briefing, FRUS138](https://history.state.gov/historicaldocuments/frus1977-80v22/d138), 25 July1979, opening paragraphs on the20–21 July Geneva meeting. A government perspective and historical commitment, not a guarantee of an individual decision. No Orderly Departure Programme pathway is assigned to this sea-departure household.
- [National Archives Refugee Act overview](https://prologue.blogs.archives.gov/2015/11/20/on-display-the-refugee-act-of-1980/),20 November2015: predates/after distinction; statute approved17 March1980. The story's late1979 arrival is not given a retroactive1980 framework. Use “authorized U.S. resettlement”; exact period legal category remains deliberately unspecified.

Attempted direct reads of the [UNHCR Tina Hinh retrospective interview](https://www.unhcr.org/news/stories/q-unhcr-resettlement-staffer-embraces-opportunity-help-fellow-refugees),5 March2010, and the [USCIS history training PDF](https://www.uscis.gov/sites/default/files/document/lesson-plans/History_of_the_Affirmative_Asylum_Program.pdf),9 May2013, failed. No denial bypass or full-document verification is claimed. These are not shipped as affirmative evidence for precise family facts or legal category. Previously indexed research does not become a direct read here. No reproduction rights are inferred from links.

The map and narrative explicitly separate southern Vietnam → Southeast Asian sea passage → Bidong/Malaysia from subsequent authorized resettlement travel → Michigan. No boat track to America, invented exact port/airport/processing center,1975 evacuation, later Comprehensive Plan of Action or tactical crossing instructions. City, flights and intermediate processing remain unspecified. Humanitarian assistance is not earned by good behavior.

Names and Vietnamese editorial details have internal consistency checks only, not a native-language/community approval. No external historical, legal, naming or community review is commissioned or claimed. Cambodia’s waiver is not extended. No translated text or real survivor narrative is reproduced. Required release gates and recommended reviews are distinguished in `story-integration-release.md`; no paid review is committed. Root QA and owner approval remain required.

## Art brief, provenance and rights

Before batch generation: Minh35, short straight black hair/angular face/blue-grey shirt, left; Linh32, low dark bun/oval face/plum blouse, center; Mai10, bob hair/olive blouse, right. The original cover was inspected and used as sole reference. Scene inventory: southern home discussion, packing, sea company, Bidong reception, daily tasks, letter/waiting, later1979 authorization questions, Michigan scheduling, continuing interests. Period objects and restrained painterly treatment; no real-survivor likeness, logos, active violence or stereotyped interchangeable props requested.

OpenAI image tool,18 October2026. Model version, seed and legal warranty were not exposed; none is invented. Originals retained in `/workspace/generated_images`; shipped WebPs are format encoding without content retouching. Manifest records each original identifier, SHA-256, dimensions, scene/alt, focal point and bytes. No archival images or third-party image references used, and no exclusive-copyright or external rights opinion claimed. Generated illustrations are labeled visibly and in alt text.

Actual scene selection drives each hero in both shared modes. Current scene loads on demand; distant scenes are not prefetched. Center-safe50%45% crops; same-family cover fallback on failure, neutral background if it also fails. No unrelated image substitution.

## Shared architecture and save contract

Actual shared Guided/Planning/chooser/choice/map/portrait/log/history/ending components, with story-local data through `authoredJourney.js`; no separate historical reader or score. Time/energy are per-scene authored attention/effort units, never historical prices, nutritional need, aid allocation or eligibility. Two earlier-choice callbacks have a variant for every earlier selection and appear in the ending.

Save `undocumented-trail:household:vietnam-bidong-1978:v1`; completed-run archive `undocumented-trail:household:vietnam-bidong-1978:archive:v1`. Existing families and Cambodia keep their own keys and versions. Replay validation derives flags, revision/run identity rejects stale writes, unknown data is preserved, blocked storage remains playable in-session, Back replays retained decisions, restart replaces only this live slot while keeping completed records.

The Cuban sibling PR uses identical shared files plus separate data/assets/registry. Integration must keep common files once and combine `authoredStories.js` imports and registrations. PR25/28 are already in the stable baseline; neither sibling authorizes publishing or deploying these new stories. Retest the exact combined head.

## Verification limits

Final head, tests/build, coverage and browser evidence are recorded in PR/QA after all art ships. Automated checks cover every choice and all19,683 authored combinations, maps/sources, callbacks, save phases, stale tabs, Back, archives/restart, unknown/blocked saves and actual shared rendering. Chromium smoke covers full journeys at1365/390/320px, refresh and cross-mode resume. Screen-reader behavior, actual touch, all zoom combinations, platform-specific bfcache and expert review are not inferred from semantic markup. Root exact-head QA and owner approval remain mandatory. Existing large-bundle warning remains.

## Stable-main reconciliation verification

Rebased only this feature branch onto stable main `b62c59e08d9a7bfba7feb088a4d6d09bbfd98727` at the owner’s request. Both shared views retain `commitJourneyChoice`; latest map/hero CSS, ending focus, existing save store and narrative migration match main unchanged. **143 tests and production/Sites build pass** after reconciliation. Browser smoke and asset checks are repeated against the reconciled build; exact final feature heads are recorded in their draft PRs. No story merge or deployment.

## Combined review stack

PR30 is now stacked on PR29, with both registrations combined and shared adapters retained once. See `story-integration-release.md` for review order and the distinction between required release gates and recommended external reviews. Individual QA above is superseded for combined-release purposes by `story-integration-qa.json`.
