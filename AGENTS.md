# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Product direction

- The selected visual direction is “The Undocumented Trail / Everything They Carry,” using the cinematic guided layout in `public/qa/guided-reference.png`.
- The cinematic guided experience is the canonical game at the default route. It follows the user's attached reference (`public/qa/guided-reference.png`): changing journey scenes, a parchment route map, three direct story choices, and an anchored group/status band. Preserve the denser map-led planning screen at `?mode=full`; both views share one save.
- The tone is humane, contemporary, and morally complex. Characters are people with agency, relationships, and skills—not nationality-based statistics or caricatures.
- The core loop is route planning under uncertainty: weigh trusted contacts, unverified offers, weather, health, money, medicine, phone charge, stress, and exposure. Long legs include a simple three-option travel plan; work, care, and travel decisions appear in the journey log. Earlier choices and traveler skills can affect later outcomes.
- On a first visit, show the family-journey chooser before the tutorial. The content-detail modal must not open automatically; default to non-graphic event descriptions and keep that setting available from the warning/settings button.
- The playable presets are the contemporary Honduran Ramírez journey, the historical 2015 Syrian Haddad journey, and the present-day Senegalese Diop brothers-and-cousins journey. Keep their people, starting resources, maps, story events, and endings distinct while sharing the same health, trust, work, loss, and save systems.
- The selected family must drive every prominent identity-bearing visual, including the hero scene, route map, and portrait strip. Never show one family's people during another family's journey.
- Use the locally bundled AndriiG “Sad Music” Pixabay track as the looping journey soundtrack. Keep the synthesized button-click feedback separate from the music control.
- Keep button-click feedback clearly audible over the soundtrack; interface sounds should feel crisp and noticeably louder than the original subtle mix.
- Keep the main hero art dark and somber, grounded in the aftermath of loss rather than active violence. Character portraits should visibly shift between healthy, strained, and exhausted expressions based on individual health and group stress.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
