import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { createInitialGame, FAMILY_PRESETS } from "../src/game.js";
import { saveFamilyGame, loadFamilySaves } from "../src/saveStore.js";
import { US_FISCAL_CASES } from "../src/usFiscalEvidence.js";

test("CBO comparisons retain incompatible scopes and the material exclusions next to their figures", () => {
  const [local, federal] = US_FISCAL_CASES;
  for (const s of US_FISCAL_CASES) {
    for (const key of ["published", "period", "population", "geography", "governmentLevel", "figures", "denominator", "method", "limit", "url", "locator"]) assert.ok(s[key], `${s.id}: ${key}`);
    assert.match(s.population, /with and without permission/);
    assert.match(s.denominator, /[Nn]o(?:t annual or)? per-person/);
    assert.match(s.url, /^https:\/\/www\.cbo\.gov\/publication\//);
  }
  assert.match(local.figures, /\$9.2bn direct net cost/);
  assert.match(local.denominator, /excluding federal grants/);
  assert.match(local.method, /not a directly observed bill/);
  assert.match(local.limit, /crowding/);
  assert.match(federal.period, /projection made in 2024/);
  assert.match(federal.method, /Discretionary spending is excluded.*\$0.2tn/);
  assert.match(federal.limit, /Excludes state\/local budgets/);
});

test("actual scene integration scopes the disclosure and preserves all-family saves across rereads and switches", async () => {
  const server = await createServer({ optimizeDeps: { noDiscovery: true, include: [], entries: [] }, server: { middlewareMode: true, hmr: false }, appType: "custom" });
  try {
    const { SceneHistory } = await server.ssrLoadModule("/src/JourneyHistory.jsx");
    const { UsFiscalEvidence } = await server.ssrLoadModule("/src/UsFiscalEvidence.jsx");
    const data = new Map(), storage = { getItem: k => data.get(k) ?? null, setItem: (k,v) => data.set(k,v) };
    for (const id of Object.keys(FAMILY_PRESETS)) saveFamilyGame(createInitialGame(id), storage);
    const snapshot = [...data], games = loadFamilySaves(storage), game = { ...games.ramirez, eventId: "detention" };
    Object.freeze(game);
    const html = renderToStaticMarkup(React.createElement(SceneHistory, { game }));
    assert.match(html, /Whose budget, which year/);
    assert.match(html, /historical case studies sit outside/);
    assert.match(html, /prevent subtracting these headlines/);
    assert.match(html, /does not fund a particular city/);
    assert.equal((html.match(/Government level/g) ?? []).length, 2);
    assert.equal((html.match(/Uncertainty \/ limits/g) ?? []).length, 2);
    assert.doesNotMatch(html, /<details[^>]*\bopen|<img|<iframe|undefined|NaN/);
    for (let repeat = 0; repeat < 2; repeat++) {
      renderToStaticMarkup(React.createElement(UsFiscalEvidence, { game }));
      for (const id of Object.keys(FAMILY_PRESETS)) {
        assert.equal(renderToStaticMarkup(React.createElement(UsFiscalEvidence, { game: { ...games[id], eventId: id === "ramirez" ? "borderCity" : "detention" } })), "");
      }
    }
    assert.deepEqual([...data], snapshot);
    assert.deepEqual(loadFamilySaves(storage), games);
  } finally { await server.close(); }
});
