# Historical context and the Haddad correction

Prepared for issues #9 and #10, applying the editorial boundaries in #11.
Baseline: official Sites v11 source `5e5458c5048453fd9a8a2827fdb59f916a86366f`,
reconciled through `site-workflow.mjs`, then GitHub merge
`2265ef20aa9253c618736a277dfda754c8353df3` (same application tree).

## Scope and setting inventory

| Journey | Setting in this edition | Evidence scope |
| --- | --- | --- |
| Ramírez | Northern Honduras; contemporary composite, no fixed departure date | UNHCR reporting dated 8 September 2017 documents gang-driven displacement and loss of homes/land. It does not date this fictional family or decide its legal status. |
| Haddad | Aleppo, July 2015; simulated calendar starts 1 July | March 2011 uprising background; UN May 2015 Aleppo report; October 2014 Turkish temporary-protection framework; UNHCR 2015 broad route and dated border reporting. |
| Diop | Mbour, Senegal; contemporary composite, no fixed departure date | IOM's December 2025–January 2026 departure-area monitoring supplies a documented route/observation period, not a verified household motive or exact itinerary. |
| Bùi | Nghệ An, Vietnam; contemporary composite, no fixed departure date | February 2025 UK country information describes recruitment debt and exploitation, individual variation, and different experiences on return. |
| Punjab group | Near Jalandhar, India; contemporary composite, no fixed departure date | Undated Irish official guidance on contracts, permit documents and prohibited deductions; checked 18 October 2026. This is a source-check date, not a departure date. |
| Karim | Cox's Bazar, Bangladesh; contemporary composite, no fixed departure date | UNICEF's 1 June 2025 funding warning concerns education and effects on host-community teachers. It does not prove every family's reason for moving. |

No unrelated journey was backdated or rewritten. The seven expansion stories
are outside this PR. The shared records and UI can support them later; issue #9
should not be represented as implementing those stories.

## UI and saved state

The chooser remains first. On a fresh run, selecting a family opens a short
introduction, with immediate Continue and Skip actions before the copy. The
roughly 80–120 words distinguish documented conditions from household fiction.
Timeline/source details are optional. The introduction can be reopened through
Journey tools, the planning header, scene context, and the ending screen.

Dismissal is recorded separately from gameplay, keyed by run ID. Existing
in-progress saves resume without an introduction gate. Reopening or skipping
does not apply effects, advance a day, spend resources or restart the run.
Native modal dialogs provide focus containment, Escape dismissal and focus
restoration. Source links announce a new tab. Narrow-screen text, 44px controls,
viewport scrolling and reduced-motion styles are included; browser verification
is still required.

The game/save version stays 14. Existing event, choice, route, feed and ending
IDs remain stable. Legacy Haddad display copy in outcomes, endings, history and
social reactions is refreshed at load without replaying decisions. Resources,
people, flags, elapsed days, progress, pending destination and run ID are kept.
The context panel explains that a resumed run uses the corrected 2015 edition.
Other families' saves and the completed-run archive are preserved.

## Haddad editorial and route audit

The departure is fictional July 2015, four years after the uprising began. The
calendar uses elapsed story days, rather than assigning a border event's date
to every possible path. Automated enumeration checks every authored route and
terminal duration remains in 2015.

- Biographies, chooser, opening, all nine scenes, social feed, source links,
  weather, choices and endings use the wartime premise. No recruitment plot is
  asserted for sixteen-year-old Sami. Current Syrian return-policy material is
  removed.
- The Balkan scene is a fictional delayed connection and capacity constraint,
  not a permanent route closure. The separately dated 21 August 2015 UNHCR
  account is historical context, not the date or location of that fictional
  incident. No Hungary–Serbia crossing is invented.
- Informal paid work in Türkiye does not imply secure employment or permission
  to work. Registration does not promise onward passage, resettlement or a job.
  No 2016 EU–Turkey arrangements are applied to the story.
- The loss branch retains Mariam's memorial and a possible return to Türkiye,
  explicitly after individual checks in that fictional outcome. It does not
  promise universal readmission. The geographic return marker remains aligned
  with that ending.
- Germany registration begins an unresolved process. Asking about relatives
  does not grant a transfer or protection status. The alternate branch keeps
  the family's uncertainty without inventing an automatic sponsorship route.
- The existing hero/portrait artwork is retained as fictional illustration,
  not documentary photography of a dated incident. Geographic coordinates and
  projection are unchanged; only the Aleppo label and displayed calendar are
  updated. The v11 desktop map-fit fix remains in place.

The rewritten public conversation includes newcomer, resident and frontline
capacity concerns. A concern about beds, schools or staffing is distinguished
from an unsupported blanket accusation. No ethnicity-based behaviour, fiscal
score, new moral-route mechanic or expansion subplot is added. Choice effects,
requirements, durations, flags and destinations remain unchanged.

## Source inspection and limits

Source links and dates live in `src/journeyHistory.js` and relevant scenes.
The following full text was accessible during this pass:

- [UN S/2015/368 through Refworld](https://www.refworld.org/reference/countryrep/unsc/2015/105060),
  including the English PDF and paragraphs 7–8. The report describes government
  and non-State armed-group attacks, property damage and school interruption.
- [Türkiye's 2014 regulation through Refworld](https://www.refworld.org/legal/natleginstr/natlegbod/2014/151442).
  The currently served translation includes annotated 2018/2019/2025 amendments.
  Only the original framework and unamended basic registration/identification
  provisions inform this story. Later institutions, labour arrangements and
  health-fee amendments are not projected backward into 2015.
- [UNHCR, 21 August 2015](https://www.unhcr.org/africa/news/press-releases/unhcr-voices-concern-about-developments-border-fyr-macedonia-and-greece):
  force, stranded families, reception capacity and local pressures at a specific
  border, with assurances that it would not be permanently closed.
- [UK country information, February 2025 edition](https://www.gov.uk/government/publications/vietnam-country-policy-and-information-notes/country-policy-and-information-note-trafficking-vietnam-february-2025-accessible),
  especially 3.1.9–3.1.12, and the individual-assessment framing.
- [Irish employment-rights guidance](https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/economic-migration-policy/protection-of-migrant-workers.html)
  and [UNICEF's 1 June 2025 release](https://www.unicef.org/bangladesh/en/press-releases/education-almost-quarter-million-rohingya-refugee-children-risk-unicef-calls-urgent).

The UN March 2015 statement, UNHCR July 2015 sea-route report, 2017 Honduras
article and IOM Senegal report were resolved in indexed primary-source results,
but some direct originals returned a challenge, 403, 429 or timeout. Their
limited summaries follow the approved brief and retrieved excerpts; no claim
of a complete independent read is made. The UN Aleppo report was read through
the official Refworld copy after the Digital Library original failed.
Do not describe every external link as successfully opened or every current
legal procedure as audited. These are bounded historical/context changes,
not a fresh legal audit of the other five stories.

## Validation and handoff

`npm run build` and `npm test` cover the existing game, saves, onboarding,
layout, soundtrack, hosting, geography, context data, every scene's rendered
context, legacy copy refresh and calendar branches. A separate comparison with
merged `main` confirms unchanged non-Haddad story records and unchanged choice
IDs/effects/requirements/durations/flags/destinations.

Before merge/publication, visually check fresh selection/Skip/Continue and
reopening in both interfaces; source details; Escape, focus containment and
restoration; all six chooser labels; resumed old Haddad outcome/ending saves;
family switching; reduced motion; 1440/1024px desktop and 390/320px mobile.
Recheck the v11 Guatemala Planning-view marker with the new date caption.
Use the local branch for QA and preserve live saves. This cloud task has no
supported browser-control tool and does not claim browser QA.
