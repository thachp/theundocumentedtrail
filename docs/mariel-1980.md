# Valdés household · issue 26

Draft implementation only. Do not merge, deploy or publish until root exact-head QA and owner approval. Based on stable main `b62c59e08d9a7bfba7feb088a4d6d09bbfd98727` after the owner reported PR25/28 merged and published. Reconciliation preserves the latest map sizing, hero framing, source action, focus and save fixes; original story data, images and namespaces are unchanged. Earlier preparation used the supplied PR28 head `612db7a9e29e12faf272e322257b20288c779a80`. Neither shared branch was altered by this task. Only tickets 26 and 27 were claimed for this task; no other implementation was taken over.

## Story and evidence boundary

Ten dated scenes, thirty namespaced choices. Elena (36), Rafael (39), Lucía (12), and Isabel in Miami are invented. Dates within May 1980, Eglin stay, family housing, conversations, work prospects, school questions and 1981 milestones are fiction. Survival and reaching Miami are fixed premises. Choices allocate a scene's fictional attention/effort and preserve memories; they cannot buy humanitarian assistance or legal status. There is no aggregate score, admission probability, morality or assimilation meter.

Sources directly read on 18 October 2026:

- National Archives, Lynn Nashorn, 3 August 2021, [overview](https://text-message.blogs.archives.gov/2021/08/03/the-causes-and-effects-of-the-mariel-boatlift/): supports 1980 boatlift chronology. Its broad retrospective legal statements are not used to assign a status or predict universal permanent residence.
- National Archives, Beth Fortson, 8 September 2015, [Eglin archival overview](https://unwritten-record.blogs.archives.gov/2015/09/08/from-mariel-harbor-to-eglin-air-force-base-cuban-refugees-and-the-mariel-boatlift/), paragraphs on the first arrivals, local record 342-CR-5: first arrivals 3 May 1980; temporary reception. This does not document this household or a universal transfer route.
- [Original Public Law 96-422](https://www.govinfo.gov/content/pkg/STATUTE-94/pdf/STATUTE-94-Pg1799.pdf), 10 October 1980, section 101 at printed p1799 and section 501 at pp1809–1810: separate categories and assistance authorities. The UI makes no exact individual parole/refugee/asylum determination or promise of immediate services. Residence and citizenship remain separate.
- University of Miami [El efecto Mariel](https://www.library.miami.edu/chc/efecto-mariel.html): page inspected for collection context. No collection item, interview, quotation, photo or likeness reproduced; not used to certify every invented perspective.
- Library of Congress item [2021669954](https://www.loc.gov/item/2021669954/) returned 403. Not bypassed or used. No archival photo license is inferred.

The story separates 1980 from Freedom Flights, Pedro Pan, 1994 balseros and later wet-foot/dry-foot rules. Isabel has work, sleep, privacy and expense constraints of her own. Newcomer and coworker perspectives are attributed fictional voices, not group claims. No causal claim blames Mariel arrivals for pre-existing racial inequities or the McDuffie unrest. No external legal, historical, community, paid or naming review has occurred or been commissioned. Cambodia's review waiver is not extended here. Required release gates and recommended reviews are distinguished in `story-integration-release.md`; no paid review is committed. Root QA and owner approval remain required.

## Art preparation and rights

Before batch generation, the continuity brief defined Elena's dark shoulder curls/ochre blouse, Rafael's short dark hair/moustache/teal shirt, and Lucía's braids/rust dress. The original cover was inspected and used as the sole reference for all ten distinct scene illustrations. Sequence: Havana discussion; Havana packing; Mariel waiting; sea company; Key West reception; Eglin tents; Isabel's apartment; repair-work conversation; household school schedule; 1981 repaired table. Somber painterly style; no active violence, modern devices, tactical details, text or real-survivor likenesses requested.

Generated with the available OpenAI image tool on 18 October 2026. The generator did not expose a model version, seed or legal warranty; none is invented. Original PNGs remain in `/workspace/generated_images`; shipped assets are format-encoded WebP, without retouching or content changes. The per-asset manifest records original file identifier, SHA-256, dimensions, scene, alt text, focal point and byte size. Generated illustration status is visible in both views and source context. No archival or third-party reference images used. Availability through the tool is not a claim of exclusive copyright or an external rights opinion.

Current scene assets load only when selected; distant scenes are not preloaded. Explicit scene mapping drives both shared views. Informative alt text identifies fiction; center-safe crops use 50% 45%. A failed scene image falls back only to the selected family cover, with a neutral background if that also fails. No unrelated family art is substituted.

## Architecture, saves and integration

`authoredJourney.js` adapts modular data to the actual shared controllers, Guided and Planning components, portraits, geographic map, log, source dialog and ending. `authoredStories.js` registers this ticket's module. No second historical reader or alternate scoring system is mounted. Existing Cambodia controller and v1 save are retained.

New save: `undocumented-trail:household:mariel-1980:v1`. Completed runs: `undocumented-trail:household:mariel-1980:archive:v1`. No existing family, Cambodia or legacy save key changes or version bump. Replay validation derives flags; unknown/newer/unreadable data is preserved; stale writes lose to durable revision/run identity. Restart explicitly replaces only this story's live slot; completed records survive. Browser restoration reads rather than eagerly overwrites state.

The sibling Vietnamese PR uses identical shared engine/adaptor changes and its own registry/data/assets. Integration should keep the shared files once and combine the two `authoredStories.js` registrations. Do not merge either story into production without root QA and approval. PR25/28 are already in the stable baseline. An integration-only local checkout may be tested, but publishing requires root review.

## Verification

Automated checks and exact final heads are recorded in the PR and QA record after the final asset pass. Tests cover each displayed choice, all authored combinations, every source and map target, callbacks, actual Guided/Planning scene/outcome/ending rendering, save phases, stale tabs, Back, restart/archive preservation, unknown saves and blocked storage. Chromium smoke covers 1365/390/320px, refresh, mode switching and a full run. This is not a VoiceOver or other screen-reader pass. Independent root exact-head QA remains required; issue27 screen-reader/text-resize checks are outstanding. Broader touch/bfcache and expert reviews are recommended as distinguished in `story-integration-release.md`. Existing bundle-size warning remains.

## Stable-main reconciliation verification

Rebased only this feature branch onto stable main `b62c59e08d9a7bfba7feb088a4d6d09bbfd98727` at the owner’s request. Both shared views retain `commitJourneyChoice`; latest map/hero CSS, ending focus, existing save store and narrative migration match main unchanged. **143 tests and production/Sites build pass** after reconciliation. Browser smoke and asset checks are repeated against the reconciled build; exact final feature heads are recorded in their draft PRs. No story merge or deployment.

## Combined review stack

PR30 is now stacked on PR29, with both registrations combined and shared adapters retained once. See `story-integration-release.md` for review order and the distinction between required release gates and recommended external reviews. Individual QA above is superseded for combined-release purposes by `story-integration-qa.json`.
