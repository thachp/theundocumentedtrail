# Punjab procedural and continuity correction

Related to issue 11. Based on main `194325a91d1fee7504732a1ee699080d710f5520`. This fixes the two Punjab audit findings without introducing a new legal simulation, scoring model, branch or ending identity. Existing event/choice/thread IDs, next-event links, days, resource effects, requirements, flags, bonuses, ending type/status/title and save version are retained. The final ending's procedural copy now seeks an individual review instead of presuming temporary permission. Other audit design decisions and PR 20 are outside this change.

## Claims and official sources

All three primary HTML pages were read on **18 October 2026**. They are undated guidance; that is a verification date, not a claimed publication date, fixed fictional departure date or current legal advice. Their titles, scope and check date appear in scene history/source links.

- [ISD, Employment visa](https://www.irishimmigration.ie/coming-to-work-in-ireland/what-are-my-work-visa-options/applying-for-a-long-stay-employment-visa/employment-visa/), “What is a long stay employment visa?”, “How do I apply?” and “At border control”: supports separating issued permits, visa decisions and border admission. The fictional airport continuation identifies a further wait in India and separately granted employment visas before boarding, including after the premature trip with PDFs. Admission in both continuing branches is expressly fictional; false explanations and documents do not guarantee entry. Dublin registration is separate. No real processing time or fee is inferred from unchanged story-day/resource values.
- [DETE, Employment permit holders who are made redundant](https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/redundancy/employment-permit-holders-who-are-made-redundant.html), “Holders of Critical Skills or General Employment Permits”: supports the qualified notification/job-search route. The inspection scene asks which permit/permission applies rather than assuming closure has already ended lawful residence. An individual needs dates, notification history and permit type checked before choosing a procedure.
- [DETE, Reactivation Employment Permit](https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/permit-types/reactivation-employment-permit/), “Conditions” and “Employee criteria”: supports a separate eligibility assessment, initial ISD application, temporary Stamp 1/letter prerequisites and genuine offer requirement. Asking for review does not establish that those requirements are met. Neither an eligibility letter nor a submitted application is automatically created by the narrative choice.

The adviser, airline encounter, further wait, admissions, appointments and help remain authored fiction. They are not a real service directory or a promise of access. Earlier recruitment and workplace-rights material remains as previously scoped; this is not a full Irish-law or all-journey evidence certification.

## Save and regression contract

`tests/fixtures/punjab-mechanics.json` captures pre-change non-display choice data from the base above, including all Punjab decisions and optional work. Tests compare the corrected version against it. The fixture intentionally excludes narrative labels and ending prose while retaining ending identity, numeric effects, flags and conditional bonuses.

The existing narrative-refresh boundary now handles Punjab display text on load. It refreshes current outcome/ending prose, choice-log labels and story-thread labels/summaries, without replaying any action. A separate optional edition marker prevents repeated refresh. It does not set the Haddad-specific narrative-update flag. Save keys/version, resources, people, day, progress, flags, branch/phase, run ID, thread statuses and historical dates are preserved; loads do not rewrite storage. Saved decision, outcome and ended phases remain resumable. Other families retain their existing behavior.

Regression coverage includes all affected decision branches, both continuing airport outcomes, no inferred permission/eligibility after closure, dated linked sources, legacy outcomes/ending/thread refresh, idempotence, six-family slot isolation and actual shared SceneHistory rendering used in both interfaces.

## QA handoff and uncertainty

Exact-head browser QA is required before merge: both views at desktop/390/320px; longer transition/adviser text and source disclosure; PDF branch through boarding and Dublin; both airport continuations plus cancel; inspection/final distinctions and links; resume old outcome/ending/thread saves, Back/reload and family switching without resource changes. No cloud browser tool is exposed; SSR is not visual, screen-reader or reduced-motion behavioral verification.

Unresolved individual facts are deliberately not invented: precise permit class, permission expiry/notification dates, visa processing duration, the availability of a genuine replacement offer and reactivation eligibility. The fictional group receives advice about those questions, not a universal answer or guaranteed support. Undated guidance can change and needs rechecking before future policy-specific expansion. No external review or endorsement is claimed. No merge/publication is authorized by this draft.

Verification receipt: full suite **114 tests passed**, including six new procedural/compatibility/render checks; production and Sites build passed. Existing large-chunk warning remains. Guided/planning routes and narrative module return HTTP 200 locally. Exact-head browser QA remains pending; these are not visual/accessibility passes.
