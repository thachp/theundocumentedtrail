import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { createInitialGame, FAMILY_PRESETS } from "../src/game.js";
import { SCENE_HISTORY } from "../src/journeyHistory.js";

test("the actual historical UI offers immediate exits, labeled sources and context for all 58 scenes", async () => {
  const server = await createServer({ optimizeDeps: { noDiscovery: true, include: [], entries: [] }, server: { middlewareMode: true }, appType: "custom" });
  try {
    const { JourneyHistoryDialog, SceneHistory } = await server.ssrLoadModule("/src/JourneyHistory.jsx");
    for (const family of Object.values(FAMILY_PRESETS)) {
      const game = createInitialGame(family.id), before = JSON.stringify(game);
      const html = renderToStaticMarkup(React.createElement(JourneyHistoryDialog, { game, introduction: true, onClose() {} }));
      assert.match(html, /<dialog[^>]+aria-labelledby=/);
      assert.match(html, /Before the journey/);
      assert.match(html, /Skip introduction/);
      assert.match(html, /Continue to the first decision/);
      assert.ok(html.indexOf("Continue to the first decision") < html.indexOf("Documented background"), "continue must be available without scrolling through the introduction");
      assert.match(html, /fictional composites/);
      assert.match(html, /No community review is claimed/);
      assert.match(html, /<details[^>]*><summary>Explore the history/);
      assert.match(html, /<a href="https:/);
      assert.match(html, /opens in a new tab/);
      assert.match(html, /Content note:/);
      assert.doesNotMatch(html, /<audio|NaN|undefined/);
      const reopened = renderToStaticMarkup(React.createElement(JourneyHistoryDialog, { game: { ...game, day: 20 }, onClose() {} }));
      assert.match(reopened, /Return to the journey/);
      assert.equal(JSON.stringify(game), before);
    }
    for (const [eventId, context] of Object.entries(SCENE_HISTORY)) {
      const html = renderToStaticMarkup(React.createElement(SceneHistory, { game: { ...createInitialGame(context.familyId), eventId }, onExplore() {} }));
      assert.match(html, /^<details/);
      assert.match(html, /Why this setting matters/);
      assert.match(html, /Explore the history/);
      assert.match(html, /<a href="https:/);
    }
  } finally { await server.close(); }
});

test("both interfaces expose reopenable context and the dialog uses native modal focus containment", async () => {
  const [guided, full, dialog, css] = await Promise.all([
    readFile(new URL("../src/BeginnerApp.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/JourneyHistory.jsx", import.meta.url), "utf8"),
    readFile(new URL("../src/journeyHistory.css", import.meta.url), "utf8"),
  ]);
  for (const ui of [guided, full]) {
    assert.match(ui, /aria-label="Explore the history"/);
    assert.match(ui, /<SceneHistory game=\{game\}/);
    assert.match(ui, /<JourneyHistoryDialog game=\{game\}/);
  }
  assert.match(dialog, /\.showModal\(\)/, "native modal dialog confines focus and makes the background inert");
  assert.match(dialog, /onCancel=\{onClose\}/, "Escape must dismiss without a gameplay mutation");
  assert.match(dialog, /previous\.focus\(\)/, "restore the opener when it still exists");
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /max-height:\s*calc\(100dvh - 32px\)/);
  assert.match(css, /min-height:\s*44px/);
});
