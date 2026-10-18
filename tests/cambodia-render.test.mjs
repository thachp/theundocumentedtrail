import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { CAMBODIA_SCENES, CAMBODIA } from "../src/cambodiaStory.js";
import { createCambodiaState, startCambodia, chooseCambodia, continueCambodia } from "../src/cambodiaState.js";
import { getCambodiaGeography } from "../src/cambodiaGeography.js";
test("real components render consent, every scene and branch, optional testimony, context and geography", async () => {
  const server = await createServer({ optimizeDeps:{ noDiscovery:true,include:[],entries:[] }, server:{ middlewareMode:true }, appType:"custom" });
  try {
    const { CambodiaConsent, CambodiaScene } = await server.ssrLoadModule("/src/CambodiaApp.jsx");
    const { JourneyMap } = await server.ssrLoadModule("/src/JourneyMap.jsx");
    const { JourneyHistoryDialog } = await server.ssrLoadModule("/src/JourneyHistory.jsx");
    const consent = renderToStaticMarkup(React.createElement(CambodiaConsent));
    assert.match(consent, />Start story</); assert.match(consent, />Read a short summary</); assert.match(consent, />Choose another story</);
    assert.match(consent, /genocide/); assert.match(consent, /younger adult brother/); assert.match(consent, /Cham Muslim/);
    for (let side = 0; side < 2; side++) {
      let state = startCambodia(createCambodiaState());
      for (const scene of CAMBODIA_SCENES) {
        const html = renderToStaticMarkup(React.createElement(CambodiaScene, { state }));
        const summary = renderToStaticMarkup(React.createElement(CambodiaScene, { state, summary:true }));
        assert.match(html, /id="pilot-scene-title" tabindex="-1"/);
        assert.equal((html.match(/class="pilot-choice-action"/g) ?? []).length, 2);
        assert.ok(summary.includes(scene.summary.replaceAll("’", "’")));
        assert.doesNotMatch(html, /<audio|<img|undefined|NaN/);
        if (scene.id === "C06") { assert.match(html, /1985, recalled in 1992/); assert.match(html, /Neither narrator is a character/); }
        const map = renderToStaticMarkup(React.createElement(JourneyMap, { game:state, geography:getCambodiaGeography(state) }));
        assert.match(map, /preserveAspectRatio="xMidYMid meet"/); assert.match(map, /Text itinerary/); assert.doesNotMatch(map, /undefined|NaN|Infinity/);
        state = chooseCambodia(state, scene.choices[side].id);
        const consequence = renderToStaticMarkup(React.createElement(CambodiaScene, { state }));
        assert.match(consequence, /After your choice/);
        assert.equal((consequence.match(/class="pilot-choice-action"/g) ?? []).length, 0);
        state = continueCambodia(state);
      }
      assert.match(renderToStaticMarkup(React.createElement(CambodiaScene, { state })), /not a reader evaluation/);
    }
    const context = renderToStaticMarkup(React.createElement(JourneyHistoryDialog, { game:createCambodiaState(), story:CAMBODIA }));
    assert.match(context, /A Place for Tomorrow/); assert.match(context, /Refugee Act/); assert.match(context, /retrieval pending/);
    assert.doesNotMatch(context, /Ramírez|Haddad|undefined/);
  } finally { await server.close(); }
});
