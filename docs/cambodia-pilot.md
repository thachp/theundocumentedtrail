# A Place for Tomorrow — Cambodia review pilot

Related to issue #2; applies issue #11’s situated editorial principles. This is a **review prototype, not an approved public story**. Published v12 and the six survival-game journeys remain the production default. No merge or publication is requested by this draft.

## Review entry and scope

Development builds expose `/?story=cambodia-1979` and a separate review-story link below the existing chooser. Production disables this entry by default. A deliberate `VITE_ENABLE_REVIEW_STORIES=true` build can enable a private review artifact; do not enable it on the public Site before the release gates below. This is not an authorization or privacy mechanism: do not include private material in the bundle.

The nine scenes follow the approved researched issue brief: C01 recollection in 1974; C02 a non-playable account of 1975–1979; C03 western Cambodia in November 1979; C04 broad movement toward Thailand in late November; C05 Khao-I-Dang in December; C06 January 1980 closure context; C07 fixed 1981 refugee admission after a wait; C08 Minnesota in 1981; C09 two ungraded reflections in 1982. An optional 1985 testimony window stays separate from the main chronology.

Dara, 24 in late 1979, younger adult brother Vann and aunt Maly are fictional Khmer Cambodian people. Religion, exact birthplace and additional ages are intentionally unspecified. Their names, kinship, ordinary conversations, design interest and everyday logistics remain subject to Khmer cultural review. No claim represents Cham Muslim, ethnic Vietnamese, ethnic Chinese, Indigenous or all Cambodian experiences. Real narrators are neither characters nor endorsers. No quotations, audio, new images, translations or distinctive biographical incidents have been adapted.

## State, agency and compatibility

Only the pilot reader mounts on the pilot route; the survival game does not mount beside it. The bounded local record is `{version, storyId, sceneId, phase, flags, history}`: nine scenes, at most nine choice records, descriptive string flags, no RNG or generic branching engine. All survival, dates and admission are authored premises. There is no health, legal/illegal, morality, assimilation, money, survival or worthiness score. Options concern attention, privacy, time, rest, contact and schedules. Immediate consequences follow commitment; earlier contact, rest, memory and schedule choices return in later prose. Neither ending is won/lost.

The pilot uses its own one-record localStorage namespace `undocumented-trail:review:cambodia-1979:v1`; it never writes existing family slots, legacy save or archive keys. Existing gameplay is untouched. Validation replays bounded scene/choice history to derive flags and reject invalid chronology. Refresh resumes the same decision, consequence or reflection. Back removes the previous committed choice and derives flags again. C02’s reading controls produce identical persistent state. Whole-story and per-scene summaries, sources and pause are UI state, never narrative transitions. Invalid/newer pilot saves are preserved until an explicit new-review action; blocked storage leaves the story readable during the visit. Completed pilot reflection remains resumable in its one local slot; a new run replaces that slot only.

## Geography and visual assets

Shared `JourneyMap` and PR #18 context/dialog components accept optional pilot data while preserving their existing six-family defaults. The map generator adds two regional land windows; a baseline comparison verifies all six existing land datasets are unchanged. One uniform equirectangular projection is used for land and markers.

The Cambodia/Thailand map uses broad western-Cambodia and Thai–Cambodian border-region anchors, **not a surveyed camp location, crossing route or navigable path**. Unknown locations during forced displacement are labeled unknown. The Minnesota map uses a state-level anchor with no invented city. The panel switches at C08, retaining all earlier stages in the text itinerary without drawing a trans-Pacific line or inventing airports or processing centres. No tactical crossing details or flight itinerary are supplied.

No new imagery was generated or downloaded. Neutral typography and the existing Natural Earth geographic fallback avoid using another family’s portrait or hero art. Cambodia-specific licensed visual assets and human-reviewed translation remain separate open requirements.

## Evidence and access audit — 18 October 2026

The issue’s approved researched brief supplies the proposed chronology. This implementation distinguishes kinds of evidence, embeds source scopes in the UI, and makes the following retrieval limitations explicit rather than treating a link as verification.

| ID | Kind and use | This cloud review |
| --- | --- | --- |
| C1 | ECCC Case 002/01 court summary: Phnom Penh takeover/forced movement, limited trial scope | Read the official summary. |
| C2 | ECCC Case 002/02 judgment, paragraph 277: wider crimes context | PDF retrieval not verified; retains brief citation with pending label. |
| C3 | USHMM later historical summary: continued war and disrupted food production after January 1979 | Read official page. |
| C4 | UNHCR operational history, *State of the World’s Refugees 2000*, chapter 4, printed pp. 92–95: holding-centre/border-camp distinction and January 1980 closure | Official PDF returned an access/rate error. Historical anchor follows approved brief, pending direct-source verification. |
| C5 | UN Secretary-General contemporaneous visit record, 28 January 1985: 21 November 1979 camp opening | PDF content not retrievable here. Opening anchor follows approved brief, pending direct-source verification. |
| C6 | Public Law 96-212, 17 March 1980: systematic U.S. refugee-admission framework | Read official GovInfo statute PDF. Does not verify a fictional individual case or supply current legal advice. |
| C7 | Monoram Hang, 30 July 1992: personal retrospective account of different camp access in 1985 and later permission/admission | Read both labeled transcript chapters. Only short, non-operational paraphrase; no hiding methods, route, guards or biographical adaptation. |
| C8 | Thaly Chhour, 14 August 1992: personal account of prolonged border-camp uncertainty and later movement | Read labeled transcript chapters. No universal policy inference, no reproduced violent incidents or crossing details. |
| C9 | MNHS Khmer oral-history collection context | Collection reference supplied by brief; full collection/catalog/licensing review outstanding. |

Exact URLs and source types are in `src/cambodiaStory.js`. C7/C8 teaching-page backgrounds incorrectly put the Khmer Rouge takeover in 1974 and 150,000 U.S. admissions in 1979 alone. Those backgrounds/glossaries are not used as evidence. Historical testimony’s descriptions and prejudices are situated memories, not narrator-voice policy or assertions about a whole ethnicity. Court findings, institutional accounts and personal memories answer different questions. No source grants permission to adapt a person’s life or implies endorsement.

## Validation and QA handoff

Automated coverage enumerates all 512 two-option sequences (including equivalent C02 reading variants), fixed chronology/status, all nine transitions and both endings, bounded descriptive state, replay/refresh, back/revise, C02 equivalence, flag callbacks, cross-save isolation and unchanged family state, regional projection/bounds/itinerary and production gating. SSR exercises actual consent/scene/context/map components and both choices at each scene; no images or audio are rendered. These checks are not browser or assistive-technology certification.

Cloud browser automation is unavailable: the environment’s Browser skill requires the Node REPL browser tool, which is not exposed. No unsupported browser or network bypass is used. Exact-head desktop/mobile, 200% zoom, reduced-motion, contrast, keyboard focus/announcement and refresh checks remain for the authorized browser QA handoff. Keep the draft open while those are checked. The review UI uses semantic controls, a short polite scene announcement, native modal focus containment, 44px targets, flexible text columns and text itineraries; manual verification is still necessary.

Suggested manual paths: all-first and all-second choices; C02 both reading paths; C03/C04 alternate choices recalled in C07/C09; every phase refreshed; back from consequence/next scene/completion then revise; pause/summary toggle without state mutation; invalid and blocked storage; all six legacy saves before and after pilot; choose-another from intro/summary/scene/pause; source modal Tab/Shift-Tab/Escape/focus return; 1440/1024/390/320 widths and 200% zoom. Do not edit or develop on the Mac; use it only for authorized QA.

## Release gates — outstanding

- Recorded Khmer community/cultural review and historical/refugee-pathway accuracy review before any public release. Names, relationships, vocabulary, livelihood detail and geography require that review. This task does not commission paid review or contact third parties.
- Direct verification/archive and paragraph/page checks for C2/C4/C5, collection/catalog checks for C9 and a full source/link/rights audit. Do not claim those checks complete.
- Exact-head browser and accessibility QA, including both narrative endings and all summary/skip controls, and any required repairs.
- Licensed/cleared Cambodia-specific imagery/audio/translation if later requested. The geographic fallback may remain only with explicit editorial acceptance; asset requirements stay open.
- Owner review of the draft PR and explicit merge/publication authorization. No GitHub main merge, Sites save/deploy or issue completion in this pilot task. Issue #2 remains open for the unmet release gates.

Correction/review record: https://github.com/thachp/theundocumentedtrail/issues/2. No expert or community endorsement, experiential-equivalence claim, current legal advice or probability estimate is made.
