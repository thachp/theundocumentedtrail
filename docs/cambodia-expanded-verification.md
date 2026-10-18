# Expanded Cambodia verification receipt

Implementation reference: `cf4660cfef94c9ecfb7ccbd541a44e3684406d6e`, based on published-v16 main `72b59173606f0c4d74db0c001145d392a0002b36`. The final draft PR body records the exact final tested head after this receipt and QA tooling are committed. No merge or publication.

| Check | Evidence / status |
|---|---|
| Branch graph and consequences | PASS: six expanded tests cover all16 reachable scenes and48 choices, ordered dates, valid sources/targets, resource/health/cohesion bounds, shortage carryover, one-time work settlement, replay/Back and admission independent of resources. |
| Legacy saves and other stories | PASS: original512-choice Cambodia test retained; v1/v2 compatibility suites retained, with v2 restart explicitly selected in its tests. New tests preserve byte-identical neighboring saves/archives, stale-tab recovery, unknown v3 data and one-time archive creation. |
| Guided/Planning rendering | PASS: Chromium154.0.8037.57, fresh isolated contexts, 1365×1000 /390×1000 /320×1000, all16 scenes =96 fixture renders. No page errors, broken image loads or horizontal overflow. |
| Actual representative decisions | PASS: six mode/width combinations commit an opening choice (Planning uses confirmation), refresh to byte-identical saved consequence, and Back to decision =12 additional interaction records. This is not a claim that all48 edges were clicked in a browser. |
| Normal chooser, sources, person modal, ending | PASS: supplemental Guided/Planning at1365 and390. Open Cambodia from normal carousel, open historical context and nine source links, Escape, person dialog with resource-model explanation, switch mode with edition3 retained, load a replayed completed save and inspect ending. Source-link existence is not external-page verification. |
| Geography | PASS: finite/bounded projections and actual visited branches. Long Beach uses Southern California land geometry. Parallel1985 letters retain Long Beach as current position, not a fabricated multi-camp route. |
| Art | PASS: three new generated illustrations inspected against the existing four-person reference; hashes/dimensions checked. Retained legacy assets untouched. Representative desktop/mobile screenshots inspected. Relevant art is reused for some scenes; no claim of16 unique images. |
| Keyboard / reduced motion | PARTIAL: Enter opens history; Escape closes native history/person dialogs; Tab moves to an interactive element. Reduced-motion preference emulated in all six matrix contexts. This is not complete keyboard traversal, assistive-technology use or OS-level motion testing. |
| 200% native browser zoom | UNRUN. Responsive viewport checks and screenshots do not establish genuine browser zoom. |
| Actual screen reader | UNRUN: no actual screen-reader session performed. DOM, labels and Playwright are not substitutes. |
| External review | UNRUN: no community, language, historian or legal reviewer endorsement claimed. |
| Build / tests / Sites artifacts | Production/Sites build and full regression suite run; final PR records final-head results. Expected existing large-bundle warning remains. Build leaves dist/client/index.html, dist/server/index.js and dist/.openai/hosting.json. |

Rendered fixes: expanded Guided footer now grows to fit health/cohesion details; expanded Planning resources span the header rather than leaving a tall narrow column. Planning header targets have44px minimum dimensions. These are scoped to expanded Cambodia. This does not certify every target, contrast ratio or every legacy journey’s layout.

Reproduction in the prepared environment: start Vite with `npm run dev -- --host 0.0.0.0`; run `node scripts/qa-cambodia-expanded.cjs` and `node scripts/qa-cambodia-expanded-supplement.cjs`. Both use the existing environment’s Playwright and `/usr/bin/chromium` (override with `CHROMIUM_PATH`). They use fresh contexts and never clear real saves. `CAMBODIA_QA_REPORT` can redirect the JSON receipt to avoid modifying tracked evidence. Full local PNG captures are ignored; representative images may be retained explicitly. Initial pre-commit JSON is labeled as such; exact-head reruns are recorded in the PR.

Earlier harness attempts used an incorrect Planning confirmation selector and an incorrect character-card selector; corrected runs supersede those harness timeouts. A missing default npm cache path was resolved with `/tmp/cambodia-npm-cache`; no dependency or lockfile changes were needed. No hidden product failures or waived passes are inferred from those corrections.
