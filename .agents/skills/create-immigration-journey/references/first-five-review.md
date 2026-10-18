# First five: evidence and patterns

Baseline: main cc884455d036a7ec23c80a3b00530937e76b7914, reviewed 18 October 2026. This reviews repository content and representative local rendered behavior, not a fresh historical certification of every linked source or a production-site audit.

## Actual chooser order

src/journeyChoices.js:getJourneyChoices spreads Object.values(FAMILY_PRESETS), then Cambodia and authored stories. The first five are:

| Order / stable ID | Display household | People | Setting / route |
|---|---|---|---|
| 1 ramirez | The Ramírez family | Marisol, Edwin, Daniela, Aurelia | Fictional 15 January 2024 departure; Honduras–Guatemala–Mexico toward U.S. port inspection before June changes |
| 2 haddad | The Haddad family | Kareem, Nadia, Sami, Mariam | July 2015 Aleppo–Türkiye–Greece–Balkans–Germany asylum registration |
| 3 diop | The Diop brothers & cousins | Ibrahima, Mamadou, Cheikh, Lamine | Contemporary unspecified calendar; Senegal–Mauritania–Canary Islands, with stop/return alternatives |
| 4 nguyen | The Bùi family | Minh, Lan, Mai, Bảo | Contemporary unspecified calendar; Nghệ An–continental Europe–France–UK safeguarding process |
| 5 punjab | The Punjab work group | Gurpreet, Simran, Arjun, Neha | Contemporary unspecified calendar; Punjab–Delhi–Ireland employment and immigration review |

The Bùi internal ID nguyen is legacy naming, not the separate Nguyễn late-1978 boat-refugee story. The sixth is Karim; Cambodia, Valdés and Nguyễn follow and are outside this first-five sample.

## Reuse

- Shared chooser and controllers keep identity, resource band, map, options, history and save behavior familiar. Sources: JourneySelection.jsx, BeginnerApp.jsx, App.jsx, saveStore.js.
- Differing household skills, care and aims give choices personal stakes rather than nationality-based numeric attributes (game.js people and events).
- journeyHistory.js separates documented background, authored family details and dated timelines; Ramírez distinguishes port appointment from legal outcome; Haddad pins July 2015 rather than importing later policy. Punjab distinguishes wage complaint, redundancy, permission and permit procedures.
- journeyGeography.js uses explicit [longitude,latitude], regional uncertainty and a common projection; keep the text itinerary and branch-dependent returns.
- Post-choice consequences and continued story threads make tradeoffs legible. Preserve guided direct commitment versus planning confirmation without requiring identical layouts.

## Do not copy blindly

| Finding / evidence | Implication for future authors |
|---|---|
| BeginnerApp.jsx sceneByEvent covers Ramírez and some Karim scenes; Haddad/Diop/Bùi/Punjab fall back to their one family hero | Correct family art is a strength, but static art is a consistency gap. Require actual evolving scene heroes, not only a cover. Ramírez itself reuses three broad scene images, not unique art per scene. |
| game.js portrait strips for Haddad/Diop/Bùi/Punjab map healthy/strained/critical to identical files | State-dependent expressions are not implemented merely by providing three keys. Verify actual asset differences and crops. |
| App.jsx supplies prominent scene hero only for shared household dispatch | First-five Planning does not provide equivalent evolving hero presentation; treat contract as target, not a claim existing journeys already meet it. |
| journeyHistory.js labels Diop/Bùi/Punjab contemporary with unspecified calendar; evidence includes 2025–26 observation/publication and undated guidance checked October 2026 | Pin a researched interval for new stories. Observation dates do not date fictional departures, and check dates do not establish historical applicability. |
| game.js scene source labels often lack dates/claim-level scope while journeyHistory.js has richer metadata | A URL is not proof for every narrative incident. Use a claim ledger and preserve fictional event distinctions. External links were not all reread in this review. |
| App.jsx travel-plan selector permits pace selection without the traveler coordinator that BeginnerApp.jsx requires; Punjab mobile intermediate check reproduced this | Preserve mode parity for rules and consequences: require the supported living-traveler role, eligibility, skill/trust/health effect and log entry in both modes when long-leg planning applies. |
| Survival families share battery, medicine, health, trust and numerical consequence systems | These are authored mechanics, not measured nationality traits or portable historical facts. Use era-relevant mechanics and never copy modern phones or survival risk into unrelated history. |
| Social-feed inflammatory quotes are situated character content, including unsupported hostile assertions | Never promote a hostile post, an assumptions-to-question list, or a fictional recruiter claim into narrator fact. Avoid crime/ethnic generalizations and distinguish depiction from endorsement. |

No existing journey is modified by this package. Uncovered scene paths, historical claims and assistive-technology behavior remain unverified until explicitly tested. Recommended external review is not an endorsement and is not automatically a paid gate.

## Representative rendered evidence

Local production build, Chromium, fresh context per case: five families × Guided/Planning × 1365×1000 and 390×1000 = 20 scenarios. Each selected the correct chooser entry, opened historical context and its source disclosure, committed the first enabled choice (with Planning confirmation), displayed its outcome, refreshed and resumed through the chooser. All 20 comparisons retained byte-identical browser save data. No captured page/HTTP errors or document overflow at these widths. Source-link presence was checked; external destinations and historical correctness were not tested. Guided uses an introduction; Planning did not show the same introduction modal.

Ramírez, Haddad, Diop and Bùi advanced to the next event. Punjab's initial choice entered required travel planning, so the main matrix retained that pending-plan state rather than skipping the role/pace interaction. Source and rendered background URLs agree that Haddad/Diop/Bùi keep a single hero across the first two scenes. Ramírez's first two scenes also share art; later changes were established in source, not fully traversed here.

This sample does not prove full endings/branches, 320px layout, native zoom, audio, keyboard/touch completeness, cross-family isolation or screen-reader acceptance. See docs/journey-authoring-skill-validation.md for reproducible commands and dry-run scope. Initial Planning harness timeouts used an incorrect introduction selector and were superseded by the corrected ten passing Planning cases; they are not application failures.

Supplemental Punjab mobile checks traversed the required travel-plan interaction to Delhi in both modes: marker moved from [75.58,31.33] to [77.1,28.6], itinerary grew from one stop to two, and intermediate refresh preserved save bytes. Guided required a coordinator; Planning allowed pace selection immediately, confirming the parity gap.

## Starting-party audit: four-person authoring standard

User requirement added after the initial review: exactly four named **starting** travelers, family or coherent group, with distinct identities, relationships and meaningful roles. It does not prescribe a nuclear family or require four people to remain together/alive forever; justified later separation, births, reunification and loss retain their own continuity. Counts below come from starting roster data, not artwork estimates or end-state survivors. Audit baseline remains cc884455d036a7ec23c80a3b00530937e76b7914.

| Chooser order / ID | Named starting party | Count | Standard |
|---|---|---|---|
| 1 ramirez | Marisol, Edwin, Daniela, Aurelia | 4 | Matches count |
| 2 haddad | Kareem, Nadia, Sami, Mariam | 4 | Matches count |
| 3 diop | Ibrahima, Mamadou, Cheikh, Lamine | 4 | Matches count |
| 4 nguyen (Bùi) | Minh, Lan, Mai, Bảo | 4 | Matches count |
| 5 punjab | Gurpreet, Simran, Arjun, Neha | 4 | Matches count |
| 6 rohingya (Karim) | Yasmin, Hamida, Rafiq, Sadia | 4 | Matches count |
| 7 cambodia-1979 | Dara, Vann, Maly | 3 | Mismatch: needs separately authorized story/art/adapter work |
| 8 mariel-1980 (Valdés) | Elena, Rafael, Lucía | 3 | Mismatch: needs separately authorized story/art/adapter work |
| 9 vietnam-bidong-1978 (Nguyễn) | Linh, Minh, Mai | 3 | Mismatch: needs separately authorized story/art/adapter work |

Sources: game.js:FAMILY_PRESETS[*].people; cambodiaJourney.js:CAMBODIA_FAMILY.people; authoredStories.js registry and marielStory.js/vietnamBidongStory.js people tuples. All first five meet the numeric starting-party requirement; that alone does not certify all narrative-role or visual standards. Existing three-person journeys are flagged, not edited. Current authored portrait adapter has only three crop slots; future four-person authored work must resolve it explicitly. The retained Haitian dry-run also starts with three and now fails this new standard; it remains historical evaluation evidence, not an approved template or a new registered journey.

Subsequent four-person implementation: revised edition-2 Cambodia, Valdés and Nguyễn rosters now each have four; frozen edition-1 saves intentionally retain their original three people and art. The audit table above records the reviewed cc88445 baseline, not a claim those revised editions still mismatch. See docs/four-person-households.md for versioned compatibility and new characters.
