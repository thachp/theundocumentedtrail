# Four-person historical households

Base: main 9afb9cd6321df88dccd31a26468a72ae2c6c7bf6. Scope: Cambodia, Cuban Valdés/Mariel and Vietnamese Nguyễn/Bidong plus shared code required for four-person presentation and safe saves. No changes to PR20, survival-family mechanics, dates/routes/legal facts or publication.

## Revised fictional households

| Journey | Starting travelers | Added person and meaningful role |
|---|---|---|
| Cambodia 1979–1982 | Dara, Vann, Maly, Sophea | Sophea,22, cousin/niece: learning, uncertain family-contact notes and boundaries around shared tasks; ordinary scenes, choices, callbacks and Minnesota plans |
| Cuba May1980–1981 | Elena, Rafael, Lucía, Teresa | Teresa,62, Rafael's mother: correspondence, bookkeeping, her own reading time and housing/task negotiations; decisions and ending callbacks |
| Vietnam late1978–1979 | Linh, Minh, Mai, Thảo | Thảo,24, Linh's sister: bookshop work, reading/study aims and a voice beyond family note-taking or childcare; sea/camp/settlement decisions and callbacks |

All are invented people, not additions to a real survivor biography. New persons do not earn admission or alter the fixed survival/authorization premises. Sources, dates, geographic anchors, stable choice IDs, flags and costs remain unchanged. See per-story four-person documents for participation, source limits and art continuity. No new historical claim was externally certified or community endorsement obtained.

## Versioned compatibility rather than rewritten history

| Data | Original edition1 | Revised edition2 |
|---|---|---|
| Authored save | undocumented-trail:household:<id>:v1 | undocumented-trail:household:<id>:v2 |
| Authored archives | undocumented-trail:household:<id>:archive:v1 | undocumented-trail:household:<id>:archive:v2 |
| Cambodia save | undocumented-trail:review:cambodia-1979:v1 | undocumented-trail:review:cambodia-1979:v2 |
| Cambodia archive | Original complete save remains preserved; no original archive engine | undocumented-trail:review:cambodia-1979:archive:v2 |
| Story/art | Frozen src/legacyHouseholds and public/assets/legacy-households | Current story modules and original asset namespaces |

New visitors start edition2. Where only an original save exists, Continue resumes its original three-person text, choices, callbacks and illustrations, with an explicit edition notice. Starting the revised edition creates a separate run; it does not replay old decisions under new prose or overwrite original saves/archives. The notice allows returning to the original save, then resuming an existing revised save without restarting it. Refresh and mode links retain edition1 via edition=1; both modes share the selected run. A newer/corrupt slot is preserved read-only instead of silently falling back, and blocked storage remains playable in the tab without claiming durable saving.

Original authored archives are listed with their edition; a malformed archive in one edition cannot hide valid entries in the other. Cambodia now archives revised completions once per run before restart. Restart affects the explicitly selected revised household, not neighboring families or original slots. Original v1 runs may continue and write only their original namespace; their revision guards still reject stale-tab overwrites.

The original story/state files were checked byte-for-byte against base main; the legacy Cambodia adapter changes only art location and edition tagging. All33 original asset files match base bytes, recorded in legacy-households/inventory.json. Original manifests retain original paths; the inventory maps their retained locations and hashes without changing rights claims.

## Shared presentation

Authored portraits are keyed by stable person ID using {image,viewBox,width,height}, rather than cycling through three hard-coded cover crops. Both views carry the full game edition into Portrait. Per-person dimensions handle real cover sizes. New covers and all distinct scene heroes depict the four-person fictional parties with continuity; they are original generated illustrations, not archival evidence. Historical households still do not expose generic health/mortality simulation or an overall score.

## Verification and limits

Final automated validation: npm test passes166tests, including79,244 enumerated choice sequences (Cambodia512, Mariel59,049, Bidong19,683). npm run build passes and emits the required Sites files. The existing large-bundle warning remains; the final client JS is about1.24MB/minified,363KB/gzip, including frozen original narrative needed for compatible resume. There is no deployment.

Independent Chromium QA passes65 scenario-checks:18complete first-choice paths across three journeys × both modes ×1365/390/320px;6original-edition compatibility/valid-archive preservation;6revised mode-switch/resume;8malformed/empty Cambodia saves;9tutorial keyboard/focus;18native200%zoom checks. Native window widths1440/780/640 produced720/390/320CSS widths with unchanged outer width,DPR2 and CSSzoom1. Expanded history bottom controls and44px portrait targets were reachable; reduced motion was browser preference emulation. Browser paths cover one choice per scene, while unit tests enumerate other combinations. Every new illustration was inspected by its story owner; representative opening/intermediate/final art and all four portraits were checked in rendered flows. All31new images total7,394,306bytes; actual file hashes and dimensions match provenance.

QA found and fixed original-edition Planning portrait context, read-only Cambodia restore resets, cross-edition malformed archive isolation, and Guided tutorial keyboard containment/focus restoration. Superseded selector/image-loading harness errors are documented, not counted as product failures. After the final mobile focus-return priority change, the complete test suite and build were rerun, plus targeted keyboard/read-only/compatibility browser checks. Full path and zoom checks used the prior build with identical story/art/layout; both runtime hashes are recorded.

See docs/four-person-households-qa.json for durable matrices, runtime fingerprints, exact browser methods and limitations. Session harnesses/screenshots/logs remain in /tmp/four-household-browser; originals are in /workspace/generated_images. These session paths are not public deliverable URLs.

Actual screen-reader testing is UNRUN; prior release-specific deferral is not treated as a future pass. Community/native-language/historical/legal review has not been commissioned or claimed. Existing inaccessible/indexed historical-source limits remain labeled, including Cambodia PDF verification. Keyboard, browser zoom and reduced-motion evidence must be reported separately from actual assistive-technology use. This remains a draft change requiring root QA and approval; no merge or deployment is authorized by the skill.
