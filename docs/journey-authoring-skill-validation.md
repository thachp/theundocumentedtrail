# Journey authoring skill validation

Base: main cc884455d036a7ec23c80a3b00530937e76b7914. Task scope: review and reusable skill only; no story implementation, merge or publication. Package: .agents/skills/create-immigration-journey; invoke $create-immigration-journey. No prior repo-tracked skill package existed in this checkout, so the requested .agents/skills convention is established here with SKILL.md, agents/openai.yaml, one-level references and an authoring template.

## Structural and regression checks

- Ran the available skill-creator init_skill.py with explicit repo location and interface fields; read its openai_yaml.md guidance. Followed the supplied creator guidance; helpers were materialized in /tmp for execution and are not part of the skill package.
- Ran quick_validate.py: Skill is valid. Independently checked all relative Markdown targets, matching invocation in UI prompt, short-description length and absence of TODO placeholders. Main skill is 20 lines with detailed guidance progressively disclosed through references.
- git diff --check passes. Application source, public assets, tests, package configuration and AGENTS.md are unchanged.
- npm run build passes; existing large-bundle warning remains. Required dist/client/index.html, dist/server/index.js and dist/.openai/hosting.json produced.
- npm run test:history: 22 passed; npm run test:onboarding: 7 passed; npm run test:sites: 4 passed. These are focused regressions, not a claim the entire suite was rerun.

## First-five browser review

Independent reviewer used Chromium through Playwright against the local production build, fresh isolated contexts, 1365×1000 and 390×1000, Guided and Planning for each family (20 scenarios). First-five order verified in actual chooser and source: Ramírez, Haddad, Diop, Bùi (legacy ID nguyen), Punjab. Each scenario opened history/source disclosure, made the first enabled choice (Planning confirmation), checked outcome, refreshed and resumed from chooser; save bytes matched in all 20. No captured page errors, HTTP errors or horizontal overflow at these tested widths. Four families continued to the second event; Punjab's initial matrix stopped at its required pending travel-plan state.

Supplemental Punjab mobile checks in both modes completed travel planning to Delhi, verified coordinate/itinerary changes and intermediate refresh. This exposed a mode-parity defect: Guided requires a coordinating traveler while Planning allows immediate pace selection. No fix is included.

Raw local evidence: /tmp/journey-first-five-review/verified-matrix.json, planning-evidence.json, review.md and outcome screenshots; raw files are session artifacts, not durable public links. Source-backed findings and limits are retained in the skill's references/first-five-review.md. An initial Planning harness wrongly expected Guided's introduction button; corrected results supersede those harness timeouts. Source URL presence is not historical claim verification.

No full ending/branch, native zoom, screen-reader, audio or exhaustive keyboard audit was performed for this documentation-only change. The new contract lists those future checks without representing them as passed here. Existing journey fixes are outside this task.

## Isolated brief dry-run

A fresh agent received only the skill path, repo location and a brief-only Haitian earthquake/later-migration request, without the intended solution or evaluation conclusions. Its raw output is retained in docs/journey-authoring-skill-dry-run.md: a proposed five-scene Haiti–Brazil household, 2010 background and 2014 migration. It read limited tertiary/journalistic evidence and explicitly held inaccessible primary legal/transit claims. All implementation/art/browser/AT checks are UNRUN, no new story was registered, and dependency lookup failure remains visible. This demonstrates a usable bounded proposal, not historical clearance or implementation readiness.

The dry run identified practical gaps; the skill/template now explicitly handle brief-only branch/ticket exceptions, planned asset fields, scene-year aging, translated paraphrase and unknown transit. Independent inspection also caught a callback-index error in the raw proposal: five scenes have last index 4, so “ending index 5” would never activate. The repository reference now requires activation indices within 0..scenes.length-1 and explains that existing endings use the last scene plus active callbacks. This raw brief intentionally remains an evaluation artifact with that noted error, not approved story data. Its numeric planning costs all fit capacity 4, but callbacks are intentions rather than complete text maps. No Haitian historical claims from the dry run are used as reusable authority in the skill.

Recommended next step for that proposal, only if separately requested: resolve dated primary permission/air-transit evidence, complete callback text and schema fields, then implement and run the matrix. No paid or OS-specific review gate was added.
