# Cambodian resource correction — 20 October 2026

Local review only. Base verified using `git ls-remote origin HEAD refs/heads/main`: `9eaa679fd734ed810a8ad08c895740ee72b49b68`, the merged PR #34. Branch: `fix/cambodia-period-resources`. No push, PR, merge or publication. Site v17 was supplied as release history, not independently reverified. The existing `/Users/thachp/repos/illegals` checkout was older (`ea779c3`) and had unrelated untracked `.codex-audit/` and `public/qa/game-screenshot.png`; neither was changed. Work is in an isolated clone under this task directory. Dependencies were copied locally after a symlink caused Vite cache writes outside the writable workspace.

## Findings and scope

The expanded edition already has persistent food, water, exchange and stress values, health/cohesion, paper contact notes and letters. Both shared views deliberately hide generic phone/medicine controls. Thus there was no visible battery meter to rename. However, the adapter inherited unused battery/medicine/exposure fields, water depletion had no health consequence, stress was not shown, and the initial contact-note choice had only a narrative callback. The same exchange label also followed the family into California without explaining what it meant.

The six contemporary presets use common health/resource machinery including water, food, cash, medicine, battery, stress and exposure. Cambodia has a separate deterministic authored state machine and isolated saves. The focused correction keeps that engine and its fixed survival/admission premises, but adds actual resource consumption, shortage effects, replenishment and practical contact continuity. It does not import modern phone/social-feed/shop mechanics or random mortality. Original Cambodian editions 1/2 retain their frozen planning model.

## Period, route and historical evidence

The current source follows Dara, Vann, Maly and Sophea from western Cambodia in November 1979 to the Thai border region in late November, Khao-I-Dang in December, camp life in 1980, an invented 1981 U.S. admission, and Long Beach life in 1981–82. Crossing and flight connections are deliberately unspecified. Optional January/March 1985 letters discuss friends in Site One/Site Two while the four remain in California; these are not successive stops or an entitlement to resettlement.

| Claim / decision | Evidence and limit |
| --- | --- |
| Khmer Rouge currency abolition makes a dollar/riel wallet inappropriate for the departure setting | [USHMM, Forced Labor and Collectivization](https://www.ushmm.org/genocide-prevention/countries/cambodia/forced-labor-and-collectivization), main text read 20 October 2026: banks closed, national currency/free markets abolished. Added as source E5. This retrospective documents regime policy, not this family's remaining belongings or prices. |
| War and displacement continued after the regime's overthrow | [USHMM, Renewed War](https://www.ushmm.org/genocide-prevention/countries/cambodia/renewed-war), read 20 October 2026. Supports the setting, not a particular crossing. |
| Khao-I-Dang's late-1979 opening and possible third-country resettlement belong to its context | Existing source E2/C5/C10 and [UNHCR chapter 4](https://www.unhcr.org/sites/default/files/legacy-pdf/3ebf9bad0.pdf). Indexed results support 21 November 1979, but full PDF access returned 429 through web and 403 through curl in this session. Prior verification limitations are retained; no new camp-policy or admission claim was added. |
| Riel reintroduction is a different historical stage | National Bank of Cambodia indexed material identifies March 1980, but [bank history](https://www.nbc.gov.kh/english/about_the_bank/history_of_nbc.php) and the research PDF returned 403. The precise date/rates are not added as freshly verified product claims. More importantly, by early 1980 the household is in Thailand, not shopping in Cambodia. |
| Exchange and California budget units | Explicit game-design abstraction: tradable belongings in late 1979; modest informal means in Thai refuge; cash/practical purchasing room in California. No specified denomination, price, exchange rate, historical ration quantity, camp-wide wage or conversion is asserted. |
| Paper notes, known companions and correspondence | Existing authored objects now have visible inventory continuity. Notes reduce stress when organizing later household questions, not when obtaining legal approval. No phone, rechargeable substitute or invented personal radio is added. Letters are slow, uncertain relationships; access to stationery can be shared. |

All people, dialogue, balances, waits, consumption, relief quantities, incidents and specific outcomes are fiction. Resource choices never earn admission, work permission or a better survival score. Clinic assessment/relief remain available without cash or work; all four survive as an authored premise. No actionable mine instructions were added. Art is unchanged; existing provenance/hash checks passed.

## Resource design

New edition-3 runs carry `resourceRulesVersion: 2`. Existing v3 saves without that field replay with rule version 1, including their exact original resources/health and Back behavior. Unknown rule versions are unreadable and preserved. The v3 save key and archives stay separate from original editions and other households. The household-notes disclosure explains how to restart for revised rules; it does not silently rewrite old decisions.

At eight authored occasions (E02, E03, R01, E04, W01, E06, E07, J01), a choice uses one food and one clean-water unit. An existing negative authored effect already counts as that occasion's consumption rather than being charged twice. Each empty store after that occasion adds 3 fatigue/health units and 1 stress unit per household; health stays at least 1. The preexisting low-food care/work consequence remains, so empty food can cause additional fatigue. Exact changes appear only after commitment.

Reception E05 replenishes food/water for every choice; coordinating E06 relief helps replenish essentials. E07 offers a concrete tradeoff: repairs earn exchange means and cost rest; the shared meal replenishes food/water and cohesion; learning/rest forgoes extra means. An invented E10 arrival meal/water contribution prevents a low-store camp snapshot from implying that the family never eats after moving to California. Earlier fatigue and spending remain. These are snapshots at selected occasions, not continuous consumption multiplied across intervening months.

The initial note choice costs food preparation; keeping those notes makes organizing E08 records less stressful. Inventory tracks protected names, companions, letters, written questions and shared addresses. It is categorical information, with no battery-like meter, recharge or magical route/legal benefit. At zero exchange units, writing to the relative remains possible with shared materials. Cash/budget pressure still affects later learning as originally authored.

## Verification

`artifacts/cambodia-resources/validation.json` records commands and limitations. Final commands: `npm test` (180 passed, 0 failed, 0 skipped), `npm run build` (passed; existing >500 kB bundle warning), `git diff --check` (passed). The Sites build produced `dist/client/index.html`, `dist/server/index.js`, `dist/.openai/hosting.json`; hosting files were not edited. Nothing was handed off or published.

New tests reproduced missing water consumption before the fix, then verified water/food effects, shortage fatigue, notes, new/legacy replay, Back, repeated commits, unsupported rule versions, affordable/no-cash assistance, representative complete routes, camp tradeoffs and arrival support. Actual shared Guided/Planning components render departure, camp and California resources without modern inventory. Existing tests cover all 48 Cambodia edges, original editions, save isolation, archives, stale/unreadable saves, maps, source IDs/art hashes, and other families' mechanics.

Browser: Chrome on the connected Mac at a new disposable origin `http://127.0.0.1:5178`. No production saves were cleared. Passed: Guided choice → consequence → Continue; Back restores food/water/health; refresh preserves a decision; Planning confirmation and resource costs; mode switch both ways retains the run; restart returns only this Cambodian run to its initial resources; main route through 14 scenes to the fixed ending; paper inventory; California budget label and arrival assistance. Guided widths 390/320 and Planning 390 had `scrollWidth === innerWidth`. Final California support was rechecked after the balance adjustment. Five JPEG captures are provided in the artifact directory. The route screenshots show fictional game values, not historical evidence.

An initial live Ramírez attempt timed out and navigated unexpectedly. A fresh supported-browser retry succeeded: the first choice changed phone 82% → 79% and risk 12% → 17%; refresh and Continue retained its outcome. Automated cross-family and save-isolation regressions also passed. A Guided→Planning click also timed out during development; inspecting actual state and later repeating the switch verified both directions successfully. These transient interactions were not used to assert an application defect.

UNRUN: assistive-technology/screen-reader verification (issue #31 remains deferred), a fresh full keyboard/contrast/200% zoom/reduced-motion audit, the optional 1985 chapter in the browser (engine coverage passed). DOM/accessibility snapshots are not screen-reader testing. Full NBC and UNHCR document retrieval remains blocked by host HTTP responses; no denied mutation or pending external write exists.

## Review decision

Review the occasion-unit balance and exchange/budget abstraction locally. No deployment decision has been taken. A cash-denominated, continuously simulated historical economy would need separate evidence and scope; the correction avoids inventing its prices or exchange rates. Historical/community review remains a useful recommendation, not a claimed endorsement or an invented approval gate.


## Confirmed gameplay reference and final presentation

Patrick subsequently supplied `image(20261020-173552).png` (Library `libfile_292905a3fd2c8191beb773c2b480b9a7`) and confirmed the shared gameplay interpretation. The original 2048×1365 image was materialized and inspected on this Mac before image-dependent implementation. The current Library skill package was unavailable in this executor; the callable Library tools supplied the supported prepare_materialize/authorized-transfer instructions and the local download succeeded without a fallback URL or environment switch.

The expanded Cambodian screen now reuses the parchment sidebar, cinematic scene/voice/setting, three direct choice cards, compact eight-item bottom HUD and four portraits. Its resource cells are Water, Food, Exchange (Budget in California), Contacts, Health, Cohesion, Stress and Turns. Contacts is a categorical status backed by protected notes and a later concrete planning effect, not a fake rechargeable meter. Household explanations, source/fiction notices, inventory and individual values remain in a reopenable disclosure. Original editions and other families' layouts retain their behavior. Expanded tutorial copy now explains its actual persistent resource model. Console testing found and fixed an existing duplicate sibling key in SceneHistory using a unique shared-place prefix; a fresh choice/Back sequence produced no console warning/error records.

See latest appended review in `design-qa.md`: full and focused source comparisons, normalization limits, iterations, responsive evidence and `final result: passed`. Final Guided widths 390/320 and Planning 320 have no horizontal overflow; the source-like desktop composition is captured at a 1536×1024 viewport. Before screenshot is actual untouched main, same opening and viewport (full page 1536×1306); after is 1536×1100.

Library attachments confirmed by successful create/replace results:

- Before: `libfile_ddf60f278d6481919a9e0f2988b6a9e4`, version 0, `before-guided-desktop.jpg`.
- After: `libfile_16adad53878481919fb0ba75481c1b1d`, version 1, `after-guided-desktop.jpg`.

The local corrected preview remains running at `http://127.0.0.1:5178/?story=cambodia-1979&edition=3`; detailed view is `http://127.0.0.1:5178/?mode=full&story=cambodia-1979&edition=3`. No install or server-start action is required while this process is running. Both ports are local previews only.
