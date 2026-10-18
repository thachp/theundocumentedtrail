import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { createInitialGame, FAMILY_PRESETS, chooseOption, continueJourney } from "../src/game.js";
import { EVENT_LOCATIONS, getJourneyGeography } from "../src/journeyGeography.js";

test("the actual map renders current-event markers, semantic itineraries and shared geographic layers for all events", async () => {
  const server = await createServer({ optimizeDeps: { noDiscovery: true, include: [], entries: [] }, server: { middlewareMode: true }, appType: "custom" });
  try {
    const { JourneyMap } = await server.ssrLoadModule("/src/JourneyMap.jsx");
    for (const [eventId, location] of Object.entries(EVENT_LOCATIONS)) {
      const game = { ...createInitialGame(location.familyId), eventId };
      const html = renderToStaticMarkup(React.createElement(JourneyMap, { game }));
      assert.ok(html.includes(`data-family="${location.familyId}"`));
      assert.ok(html.includes(`data-event="${eventId}"`));
      assert.ok(html.includes(`data-longitude="${location.coordinates[0]}"`));
      assert.ok(html.includes(`data-latitude="${location.coordinates[1]}"`));
      assert.match(html, /viewBox="0 0 600 500" preserveAspectRatio="xMidYMid meet"/);
      assert.match(html, /<svg[^>]+role="img"[^>]+aria-labelledby=/);
      assert.match(html, /<summary>Text itinerary/);
      assert.match(html, /aria-current="location"/);
      assert.ok(html.includes(location.uncertainty.replaceAll("&", "&amp;").replaceAll("'", "&#x27;")));
      assert.doesNotMatch(html, /NaN|undefined|Infinity/);
    }
    for (const family of Object.values(FAMILY_PRESETS)) {
      const html = renderToStaticMarkup(React.createElement(JourneyMap, { game: createInitialGame(family.id) }));
      assert.match(html, /Text itinerary · 1 stop/);
      assert.doesNotMatch(html, /<img|background-image/);
    }
    // Reported 1440x900 regression: Honduras -> Leave before sunrise ->
    // Continue -> Planning view. The current Guatemala marker must use the
    // height-fitted canvas, retaining the same projection as its land layer.
    const guatemala = continueJourney(chooseOption(createInitialGame("ramirez"), "leaveDawn"));
    assert.equal(guatemala.eventId, "guideOffer");
    const fitted = renderToStaticMarkup(React.createElement(JourneyMap, { game: guatemala, fitViewport: true }));
    assert.match(fitted, /class="journey-map\s+journey-map-fit"/);
    assert.match(fitted, /data-event="guideOffer"/);
    assert.match(fitted, /data-longitude="-90" data-latitude="15"/);
    const point = getJourneyGeography(guatemala).points.at(-1);
    assert.ok(fitted.includes(`transform="translate(${point.join(",")})"`));
    assert.match(fitted, /viewBox="0 0 600 500" preserveAspectRatio="xMidYMid meet"/);
    assert.match(fitted, /Text itinerary and map key · 2 stops/);
  } finally {
    await server.close();
  }
});
