# Repository implementation map

Baseline: main cc884455d036a7ec23c80a3b00530937e76b7914 (18 October 2026). Resolve symbols again when the engine changes.

| Concern | Existing source / usage |
|---|---|
| Chooser | src/journeyChoices.js:getJourneyChoices uses Object.values(FAMILY_PRESETS), optional Cambodia, AUTHORED_STORIES; src/JourneySelection.jsx renders normal carousel |
| Modes | src/BeginnerApp.jsx Guided; src/App.jsx Planning; src/main.jsx routing; ?mode=full preserves shared saves |
| Selection | src/selectJourney.js:selectJourneyGame dispatches authored, Cambodia, survival |
| Shared bounded households | src/authoredStories.js registry; src/authoredJourney.js transforms data into shared game/event/history shape; src/sharedHouseholdJourney.js and src/AuthoredJourneyUI.jsx |
| Modular examples | src/marielStory.js; src/vietnamBidongStory.js. Copy structure, never their facts or fictional premises |
| Survival system | src/game.js:FAMILY_PRESETS, EVENTS, getEvent, chooseOption, continueJourney; useJourneyGame.js; dated narrative migration in src/narrativeMigration.js |
| History | src/journeyHistory.js registries/getSceneHistory/getJourneyHistory; src/JourneyHistory.jsx optional dialog; preserve source action normalization in src/journeyChoiceActions.js |
| Geography | src/journeyGeography.js, src/JourneyMap.jsx, src/mapLand.json; authored scene coordinates/bounds/landKey dispatched through existing geography |
| Saves | src/saveStore.js for survival; src/authoredJourneyStore.js for authored; Cambodia retains its own store |
| Endings | src/EndingDialog.jsx, existing game/controller dispatch; descriptive outcomes, no aggregate score |
| Art | public/assets/<story-id>/cover.webp and <scene-id>.webp; provenance.json examples in mariel-1980 and vietnam-bidong-1978 |

## Authored data shape and constraints

Story fields consumed today: id, title, name, shortName, origin, period, route, notice, contentNote, premise, people, sources, historicalSummary, scenes, callbacks, glossary.

- people: tuples [id, name, age, pronouns, skills[], description]. The shared adapter accepts story.portraits keyed by person ID, each with {image,viewBox,width,height}; provide and visually verify all four. The original three hard-coded cover crops remain only as legacy compatibility fallback. Do not omit the fourth traveler or reuse someone else's portrait. Current revised households are edition 2; src/legacyHouseholds retains edition-1 narrative and matching archived assets for existing saves.
- sources: map of stable IDs to {title,date,url}; keep richer claim/section/verification ledger in the story documentation.
- scenes: {id,date,place,title,prose,summary,context,sourceIds,coordinates:[longitude,latitude],landKey,bounds:[west,south,east,north],stage,choices}.
- choices: {id,title,description,consequence,cost:[time,energy],flag:[key,value]}. Three visible options is the shared reference pattern. Each cost must fit current capacity 4; units reset per scene and are fictional. They are not cash, historical scarcity estimates or survival probabilities.
- callbacks: {scene,flag,texts:{[value]:text}}; scene is a zero-based activation index. Ensure every reachable flag value has the intended later text. Activation must be an integer in 0..scenes.length-1. There is no extra ending index: authoredGame builds the ending from the last scene plus currently active callbacks. Check indices and text coverage explicitly before implementation.
- glossary: [term, explanation] tuples. Define period-specific processes with individual applicability limits.

Current authored engine is sequential: index advances one scene at a time; choice flags alter callbacks, not the scene route. It fixes survival and ending premises per story. Do not promise branching geography, resource carryover, legal simulation or unique ending mechanics without an explicit tested engine change. Generic resources in its adapter are placeholders suppressed by shared household UI; do not display them as historical household measurements. Hard-coded portrait dimensions/crops, hero focal point and landKey choices also need inspection rather than cargo-cult copying.

## Save contract

Revised authored keys: undocumented-trail:household:<id>:v2 and :archive:v2; original :v1 and :archive:v1 remain separate and resumable. Cambodia similarly uses separate v2 save/archive and frozen v1 save. New runs use four-person edition 2; existing edition-1 progress is not reinterpreted or overwritten when switching editions. Store replays valid choice history, checks runId/saveRevision, and preserves unreadable/newer data with saveWritable false. Never rename IDs, reorder persisted scenes or replace storage versions casually. Survival stores per-family snapshots in the-undocumented-trail-family-saves-v1 plus selected family/archive and legacy keys; do not change these to add a story.

## Verification entry points

Inspect package.json and tests first. Current commands: npm test; npm run build; npm run test:sites. Focused tests include authoredJourney.test.mjs, authored-integration.test.mjs, authored-render.test.mjs, journeySelection.test.mjs, journeyGeography.test.mjs, journeyHistory.test.mjs, saveStore.test.mjs and staleJourneySave.test.mjs.

Existing authored tests contain assumptions specific to two stories (ID prefixes, portrait crops, dimensions, three-choice combinations). Extend assertions deliberately; never weaken them just to add data. Bound exhaustive combinatorial tests as scene count grows; use graph reachability and meaningful boundary coverage where enumeration becomes impractical.

Keep .openai/hosting.json, worker/index.js, scripts/prepare-sites-build.mjs and tests/sites-worker.test.mjs intact. Build must retain dist/client/index.html, dist/server/index.js and dist/.openai/hosting.json. A successful build is not publication.
