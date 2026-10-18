# PR29 → PR30: combined story review

PR29 is the Cuban/shared-adapter increment on stable main `b62c59e08d9a7bfba7feb088a4d6d09bbfd98727` (tree `926b070c270fa106156e2135310840b321152ea5`). PR30 is stacked on PR29 and adds only the Vietnamese module/art, the second registration, and combined validation/documentation. Shared adapters remain present once. Review and merge order, if later approved: PR29, then PR30. Neither is merged or deployed by this task.

The add/add registration conflict was resolved with `[mariel, vietnam]`, leaving all other shared files identical to PR29. Existing map sizing, hero framing, source action, ending focus and save migration fixes from stable main are retained. Story IDs, choices, save namespaces and image hashes are unchanged from the individually reviewed drafts.

## Required before release

- **Owner-directed gate:** independent root/Mac QA of the exact final combined head/tree and explicit approval before story merge/deployment/publication. This is an instruction from the delegation, not an inferred editorial or skill rule.
- **Issue26/27 acceptance:** both entries must work in the normal chooser and shared Guided/Planning views; preserve existing and story-local saves across refresh, Back, replay and switching; verify choices/callbacks/resources/maps, dated source targets, fictional outcomes, period artwork/alt/provenance, no aggregate score and no earned legal approval. Combined automated and Chromium evidence is recorded separately. Failures found during root QA must be repaired and retested.
- **Issue27 accessibility acceptance:** keyboard, screen reader, reduced motion, mobile and text resizing must be checked with honest limits. Keyboard/mobile and reduced-motion emulation have automated browser evidence. Actual screen-reader and text-resizing checks are still outstanding for independent Mac QA; semantic HTML is not a substitute. Do not claim they passed until recorded.
- **Evidence/rights acceptance:** resolve factual, pathway, naming and art-rights questions affecting shipped claims before release. Exact late1979 legal category is deliberately unspecified, as allowed by issue27; household authorizations, dates, work and housing are fiction. Failed retrievals are disclosed and those sources are not used to certify exact claims. No archival imagery, survivor testimony, likenesses or translations are reproduced. Root review must accept the bounded wording and documented generated-art limits or request corrections; a disclaimer does not excuse a known factual error.

## Recommended, not newly imposed paid gates

Community/native-language naming review and additional external historical/refugee-law review would improve confidence. Issue26 calls community/historical review “Suggested”; issue27 asks for factual/pathway/naming/rights resolution but does not commission a paid reviewer. No new paid review, contact, procurement or payment is authorized or promised here. None has occurred, and no endorsement is claimed. Cambodia’s waiver applies only to Cambodia; this task neither extends it nor invents a separate waiver or paid requirement for these new tickets. If root identifies a specific existing applicable review requirement, record its actual source before treating it as mandatory.

Actual touch-device testing, broader browser coverage and platform-specific bfcache stress testing are recommended beyond the recorded Chromium smoke. Existing automated restore/stale-write tests remain required regression coverage. No blanket full-accessibility or legal/historical certification is claimed.

## Supporting deliverables

- `docs/mariel-1980.md`, `docs/vietnam-bidong-1978.md`: dated sources, fiction boundary, art brief/rights and save contract.
- `docs/*-qa.json`: individual prior checks; combined checks are in `docs/story-integration-qa.json`.
- `public/assets/{mariel-1980,vietnam-bidong-1978}/provenance.json`: all21 original images and hashes.
- `tests/authored-integration.test.mjs`: both live saves and completed archives in one storage instance, with legacy/Cambodia sentinels preserved.
