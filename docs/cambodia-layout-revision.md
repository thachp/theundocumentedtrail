# Cambodian layout revision — 20 October 2026

This revision follows Patrick’s explicit map-left / hero-right Planning request and shorter Guided hero request. It is based on `8acd15db33c412ba71720725cfbb29425a62e340` on `fix/cambodia-event-journey` and preserves that commit’s gameplay, saves, archives and irreversible-choice rules.

## Reference inspection and implementation

Inspected the existing desktop/mobile screenshots, captured the current expanded views, and loaded the actual original three-person v1 save in an isolated browser context. `before-actual-v1-planning.png` records Dara, Vann and Maly; the current shared legacy controller still puts its hero above the grid. The original shared integration source was also inspected. No original-edition narrative, roster, save or resource mechanics were changed.

Expanded Planning now puts the existing scene image at the top of the right-hand decisions panel, aligned with the parchment map on the left. The desktop columns remain in the established game grid; the right panel is wide enough for the scene and readable decisions. The hero is bounded and its crop favors the people’s faces. The map/person column and decisions can grow naturally. Phone/tablet layouts retain the shared vertical stacking; the scene appears above its decisions rather than above the entire page. No forced viewport-height clipping or horizontal scrolling was introduced.

Guided removes the Cambodia-only 820px stage minimum and uses the shared 610px minimum, allowing authored content to determine actual height. The image is constrained to the right-hand pane instead of overflowing beneath the map. The existing map-key/text-itinerary disclosure holds supplementary notes, retaining geography/source information while reducing the opening distance to choices. Phone hero height is 160px and map canvas height 180px. Decisions and resources remain in their existing components. Long text and 200% zoom are allowed to scroll naturally; this is not a claim that every choice/resource fits in a single phone viewport.

## Verification

After final source edits, production build and full `npm test` passed: 193 tests, including gameplay, original/current saves and archive isolation, committed-choice protection, maps, rendering and Sites worker checks. Existing gameplay source files and state schema are unchanged by this visual revision. `dist/client/index.html`, `dist/server/index.js` and `dist/.openai/hosting.json` remain present.

Evidence in `artifacts/cambodia-layout/`:

- `browser-report.json`: 19 scenes × both modes × 1365/390/320px (114 scene checks), six commit/reload/continue/Back/reload flows, three Planning confirmation-control inventories and three cancellation flows. Checks include image readiness, resource HUD, document overflow, desktop map/hero top and column alignment, and Guided image containment.
- `final-layout-report.json`: six additional opening-scene cases after the final crop/alignment edits, both modes at 1365/390/320px, with recorded bounds, actual choice position, direct or confirmed commitment, cancellation in Planning, refresh stability and page errors.
- `zoom-report.json`: genuine Chromium 200% page zoom at outer widths 1440/780/640 (layout widths 720/390/320), both modes. Includes 24 scene checks, six interaction flows, keyboard focus containment/return, repeated source/person dismissal, Planning cancellation through Escape/Keep thinking/close, and decision/outcome refresh. Reduced motion was emulated, not tested on physical hardware.
- `final-guided-1365.png`, `final-guided-390.png`, `final-full-1365.png`, `final-full-390.png`: final review screenshots. Before screenshots retain the inspected reference state.

An initial zoom harness read image state before a large Long Beach asset had finished loading. The corrected run explicitly waits for every image to finish successfully; the earlier harness result is not counted as a product pass. The scene matrix also initially sampled one hero during its entry animation; its final bounds checks await finite hero animations before measuring. Reports identify the prior committed head/dirty implementation tree because evidence precedes the review commit. Actual screen-reader testing, physical touch/trackpad testing and external community/language review remain unrun.

## Release handoff

The user explicitly requested merge/publication and later requested notification after deployment. The parent has confirmed its connected GitHub integration can access the repository. This executor does not retry its denied GitHub CLI/API operations or bypass merge protections. The tested branch is committed/pushed for the parent to inspect exact-head PR checks, merge normally and publish to the existing public Sites project `appgprj_6acbcb835c108191841d657d5c5a1337` / `https://theundocumentedtrail.org/`. No merge, Sites version save or deployment is performed by this visual-work executor. Earlier release approval is recorded; no extra preview-approval gate is imposed.
