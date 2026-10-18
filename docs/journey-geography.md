# Journey geography

The guided and planning screens share `JourneyMap` and the geography model in
`src/journeyGeography.js`. All 58 existing events map explicitly to a family and
an approximate `[longitude, latitude]` anchor in decimal degrees. The story text
is the authority for the named place. No story events or historical premises
were changed.

City anchors identify an approximate city area, never the location of a home,
office, shelter, camp block, detention facility, or departure beach. Provinces,
countries and broad regions use regional anchors. Unspecified continental
European transit, border facilities, and sea positions are deliberately labeled
as unknown or illustrative. Their coordinates must not be interpreted as an
assertion about an actual route. A return to a country uses a regional return
anchor; it does not assert a return to the original town or address.

The projection is equirectangular: x increases with longitude and y decreases
with latitude. Land, visited points, current point, and connections use exactly
the same projection and fixed family extent. A `600 × 500` SVG viewBox with
`preserveAspectRatio="xMidYMid meet"` keeps the layers aligned without stretching
or cover cropping. North is up. This is a story map, not a navigation map.

Only the selected family's recorded event history and current event are shown.
Progress percentages and the three abstract travel approaches never determine
geography. Events skipped by a branch are absent. An outcome stays at its
current story event until continuation; terminal returns update the destination
once the ending is reached. There is no persisted map state to migrate or leak
between family saves. The text itinerary uses the same data and includes each
event's narrative location, region, and uncertainty.

Dashed lines connect visited anchors in story order. They do not claim exact
roads, flight paths, intermediary hubs, border crossings, or sea tracks. Future
events and exact consequence information are not revealed by the map.

## Basemap source and regeneration

Land outlines derive from Natural Earth 4.1.0, redistributed in
[world-atlas 2.0.2](https://github.com/topojson/world-atlas). Natural Earth data is
[public domain](https://www.naturalearthdata.com/about/terms-of-use/). The atlas
redistribution is ISC licensed; see `docs/world-atlas-LICENSE`.

`src/mapLand.json` contains clipped country exterior rings from
`countries-50m.json`, simplified to roughly 0.6 SVG units (at least 0.04 degrees)
and rounded to 0.01 degrees.
Inland holes and political labels are omitted. This small-scale land context
retains the Canary Islands, which the coarser 110m data omits.

To regenerate, obtain the unchanged `world-atlas@2.0.2` npm package through the
configured package manager, extract it outside the checkout, then run:

```sh
node scripts/prepare-map-geography.mjs /absolute/path/to/package/countries-50m.json
```

The script performs no network requests and requires no additional dependency.
The bundled land data serves locally; visitors do not contact a map provider.

## Validation

`npm run test:maps` checks every event and branch, all family extents, coordinate
order, projection direction and scale, the Senegal opening, selected branch
history, persisted family switching, terminal returns and early stopping. It
also renders the actual React component for every event to check semantic text
itineraries, markers and shared SVG layers. These checks do not substitute for
desktop/mobile browser inspection.
