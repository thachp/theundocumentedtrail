# Shared journey contract

## Invariants and historical variation

| Surface | Invariant in Guided and Planning | Historically variable |
|---|---|---|
| Chooser / cover | Normal shared carousel; correct name, departure pressure, period, route, accessible controls and family-specific cover; resumable status | Family composition, starting context, dates and cover |
| Intro / context | Fiction label; skippable/reopenable tutorial/context; content note; source/history dialog without changing a decision | Historical conditions, documented timeline, glossary, premise |
| Scene | Explicit place/date, attributed voices, readable summary, visible select-one instruction; correct changing scene hero, informative alt/crop | Language, conflict, ordinary life, clothing, objects and actual pace |
| Map / progress | Same geographic projection for land/routes/marker; text itinerary; honest uncertainty; progress describes scenes/distance rather than worth | Era-specific route, bounds, stops, returns and transit permissions |
| Choice / feedback | Authored constraints before commitment; exact numeric deltas/outcome labels after; one commit; descriptive consequence and continue | Tradeoffs, family disagreement, skills, costs and callbacks |
| Resources | Clear units, model limitations and actual consequences; no score/rank; no reward for loss | Relevant supplies/cash/health or explicitly fictional planning units; avoid phones in eras without them |
| Long-leg planning | Where enabled, the same traveler eligibility, role assignment, pace rules, consequences and log in both modes; use living traveler skills/trust/health | Whether a leg needs this mechanic; plausible transport and roles |
| Navigation | Guided direct choice; Planning preview then explicit confirmation; context/tools/back cannot secretly choose; responsive controls | Story-supported reversible decisions and branch history |
| Save / resume | Same run across modes; independent families; refresh, Back/Forward and stale tabs preserve decisions; restart scoped to one family; archived completion retained | Stable story ID/schema and deliberately tested migrations |
| Ending | Acknowledge people, losses and continuing life; replay/choose another without wiping other runs | Arrival/reception/status/work/residence are distinct; premises and multiple outcomes reflect evidence, not moral reward |

Do not force identical beat counts, risks, trauma, mechanics or endings. Do not standardize broad regional anchors into invented precise addresses. Existing visual or editorial defects are not precedents.

## Verification matrix

Fill each cell with PASS + evidence, FAIL + reproduction, UNRUN + reason, or explicit owner-deferred scope. Do not use source inspection as a rendered pass.

| Check | Guided desktop / mobile | Planning desktop / mobile | Engine / evidence |
|---|---|---|---|
| Chooser order, cover, identity, start/continue/result | Required | Required | Registry + isolated saves |
| Tutorial and history open/close/reopen; source links and fiction labels | Required | Required | Claim ledger resolves cited IDs |
| Opening, intermediate and final scenes; changing artwork and safe crops | Required | Required | Every asset exists, distinct intended scene, rights/hash/alt manifest |
| Representative choice, consequence, continue; no precommit numeric leak | Required | Required | All reachable choices valid; callbacks/branches covered |
| Geography / itinerary / progress / branch return | Required | Required | Finite [lon,lat], bounds and matching event IDs |
| Refresh in decision/outcome/ending; mode switch same run | Required | Required | Other-family sentinels unchanged |
| Restart/archive, stale tab, legacy/unknown/blocked storage | Representative browser checks | Representative browser checks | Store tests with injected storage |
| Ending distinctions, replay and another family | Required | Required | No score/rank, no invented legal entitlement |
| Keyboard focus, Escape, dialog return, readable contrast, 44px targets | Required | Required | Record actual method and failures |
| 320/390px width, desktop, genuine 200% browser zoom | Required | Required | No clipping/overflow; log native viewport/zoom |
| Reduced motion / optional sound / no timed decisions | Required | Required | Label emulated preferences honestly |
| Screen-reader labels, reading order, live updates and dialog operation | Record actual AT/browser or UNRUN | Record actual AT/browser or UNRUN | Never infer pass from DOM or keyboard; no particular OS required |
| Regression tests / build / Sites artifacts | Shared | Shared | Exact commands/head/counts, errors and scope |

Required acceptance checks are the checks to execute and report, not permission to conceal unavailable testing or invent a pass. If an explicit ticket requires a check for acceptance and it cannot run, report the remaining blocker for owner decision. External community, native-language, historical and legal reviews are recommendations unless explicitly required by the brief; record what actually happened and never imply endorsement. A skill does not authorize paid commissioning, merge or deployment.
