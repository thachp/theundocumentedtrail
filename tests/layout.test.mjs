import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const beginnerCss = await readFile(new URL("../src/beginner.css", import.meta.url), "utf8");
const planningCss = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");

function ruleFor(selector, css = beginnerCss) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? "";
}

test("the guided travel planner stays inside the story column", () => {
  const rule = ruleFor(".cinematic-travel-planner");

  assert.ok(rule, "the travel planner needs a desktop layout rule");
  assert.doesNotMatch(rule, /margin(?:-left)?\s*:[^;]*-\d/, "a negative horizontal margin pulls the planner over the map");
});

test("the desktop planning view scrolls only its messages panel", () => {
  const shellRule = ruleFor(".game-shell", planningCss);
  const gridRule = ruleFor(".game-grid", planningCss);
  const panelRule = ruleFor(".messages-panel", planningCss);
  const mobileRules = planningCss.match(/@media \(max-width: 980px\) \{([\s\S]*?)\n\}/)?.[1] ?? "";

  assert.match(shellRule, /height:\s*100dvh/, "the desktop shell should match the visible viewport");
  assert.match(shellRule, /overflow:\s*hidden/, "the desktop shell should not scroll the document");
  assert.match(gridRule, /min-height:\s*0/, "the main grid must be allowed to shrink inside the shell");
  assert.match(gridRule, /overflow:\s*hidden/, "grid content should stay inside the planning viewport");
  assert.match(panelRule, /overflow-y:\s*auto/, "long messages should scroll inside the right panel");
  assert.match(mobileRules, /\.game-shell\s*\{[^}]*height:\s*auto[^}]*overflow:\s*visible/s, "small screens should keep normal document scrolling");
});

test("the journey chooser is a horizontally scrollable carousel with usable controls", () => {
  const railRule = ruleFor(".cinematic-family-options");
  const buttonRule = ruleFor(".cinematic-family-carousel-controls button");
  const mobileRules = beginnerCss.match(/@media \(max-width: 720px\) \{([\s\S]*)\n\}/)?.[1] ?? "";

  assert.match(railRule, /grid-auto-flow:\s*column/, "journeys should flow horizontally");
  assert.match(railRule, /overflow-x:\s*auto/, "the carousel should support trackpad and touch scrolling");
  assert.match(railRule, /scroll-snap-type:\s*inline mandatory/, "cards should settle into a readable position");
  assert.match(buttonRule, /width:\s*46px/, "carousel controls should meet the minimum touch target");
  assert.match(buttonRule, /height:\s*46px/, "carousel controls should meet the minimum touch target");
  assert.match(mobileRules, /\.cinematic-family-options\s*\{[^}]*grid-auto-columns:\s*calc\(100% - 26px\)/s, "mobile should reveal part of the next card");
});
