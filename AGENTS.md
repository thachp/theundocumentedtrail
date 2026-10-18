# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Product direction

- The selected visual direction is “The Undocumented Trail / Everything They Carry,” using the cinematic guided layout in `public/qa/guided-reference.png`.
- The cinematic guided experience is the canonical game at the default route. It follows the user's attached reference (`public/qa/guided-reference.png`): changing journey scenes, a parchment route map, three direct story choices, and an anchored group/status band. Preserve the denser map-led planning screen at `?mode=full`; both views share one save.
- The tone is humane, contemporary, and morally complex. Characters are people with agency, relationships, and skills—not nationality-based statistics or caricatures.
- The core loop is route planning under uncertainty: weigh trusted contacts, unverified offers, weather, health, money, medicine, phone charge, stress, and exposure. Long legs include a simple three-option travel plan; work, care, and travel decisions appear in the journey log. Earlier choices and traveler skills can affect later outcomes.
- Deepen long-leg planning by requiring the player to assign a living traveler to coordinate the leg before selecting its pace. That travel role must use the traveler’s authored skills, current trust, and health to protect a concrete resource or reduce risk; preserve the role and its consequence in the journey log.
- Open the family-journey chooser first on every visit. Teach through brief first-decision guidance and keep the tutorial available on demand. The content-detail modal must not open automatically; default to non-graphic event descriptions and keep that setting available from the warning/settings button.
- The playable presets are the contemporary Honduran Ramírez journey, the present-day Syrian Haddad journey after an attempted return near Aleppo, the present-day Senegalese Diop brothers-and-cousins journey, the Vietnamese Bùi family journey to the United Kingdom, the Punjab work-group journey to Ireland, and the Rohingya Karim family journey from Cox's Bazar toward temporary reception in Aceh. Keep their people, starting resources, maps, story events, and endings distinct while sharing the same health, trust, work, loss, and save systems.
- Center the Rohingya journey on statelessness, shrinking education and aid, family tracing, document protection, trafficking risk, water and weather decisions at sea, uncertain rescue and disembarkation, and the distinction between survival, temporary reception, legal status, work rights, and belonging. Preserve agency, family disagreement, education, and hope; do not turn prolonged suffering into spectacle.
- In the journey chooser, pair each country with the pressure behind departure rather than the generic phrase “Present day”: gang threats, conflict displacement, debt and lost livelihoods, recruitment debt, job-recruitment fraud, or statelessness and shrinking aid.
- Present the journey chooser as a horizontal carousel with visible previous/next controls, touch and trackpad scrolling, keyboard arrow navigation, and a partial next-card cue on mobile.
- Keep one resumable save per family and preserve completed runs in the journey archive. Starting or restarting one family must not erase another family's progress.
- Journey maps use explicit event coordinates and a shared geographic projection for land, visited routes and current markers. Label unknown and regional positions honestly, provide a text itinerary, and preserve branch-dependent returns. Do not place geographic markers on the distorted illustrated map artwork.
- The selected family must drive every prominent identity-bearing visual, including the hero scene, route map, and portrait strip. Never show one family's people during another family's journey.
- Use the locally bundled AndriiG “Sad Music” Pixabay track as the looping journey soundtrack. Keep the synthesized button-click feedback separate from the music control.
- Keep button-click feedback clearly audible over the soundtrack; interface sounds should feel crisp and noticeably louder than the original subtle mix.
- Keep the main hero art dark and somber, grounded in the aftermath of loss rather than active violence. Character portraits should visibly shift between healthy, strained, and exhausted expressions based on individual health and group stress.
- In the guided view, make every decision point explicitly instruct the player to select one option, and give each choice a visible action affordance rather than relying on card styling alone.
- Attribute guided story copy to its actual speaker. Use family portraits for traveler voices and clear role/trust cues for outside contacts; never present a generic “coyote” character when the line belongs to a family member, narrator, or verified helper.
- On mobile, collapse secondary header controls into a labeled “Journey tools” menu with 44px-or-larger targets, and show a direct “View choices” cue while the decision cards are below the viewport.
- Preserve authored choice descriptions and known constraints before commitment, but reveal exact numerical consequences, bonuses, and outcome labels only afterward. Do not leak them through color, hover, or confirmation previews. Keep back navigation available.
- Keep work, resupply, and social-feed actions available but visually secondary inside an “Optional before choosing” disclosure.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
