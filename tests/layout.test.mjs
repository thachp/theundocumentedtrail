import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const beginnerCss = await readFile(new URL("../src/beginner.css", import.meta.url), "utf8");
const planningCss = await readFile(new URL("../src/styles.css", import.meta.url), "utf8");
const mapCss = await readFile(new URL("../src/journeyMap.css", import.meta.url), "utf8");

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

test("travel roles stay selectable across desktop and mobile layouts", () => {
  const leadsRule = ruleFor(".cinematic-travel-leads");
  const leadButtonRule = ruleFor(".cinematic-travel-leads > button");
  const mobileRules = beginnerCss.match(/@media \(max-width: 720px\) \{([\s\S]*)\n\}/)?.[1] ?? "";

  assert.match(leadsRule, /grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\)/, "desktop should compare every traveler in one row");
  assert.match(leadButtonRule, /min-height:\s*74px/, "travel roles should have generous selection targets");
  assert.match(mobileRules, /\.cinematic-travel-leads\s*\{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/s, "mobile should arrange travel roles in a readable two-column grid");
});

test("planning geography fits its fixed desktop pane and uses document flow on mobile", async () => {
  const desktop = mapCss.match(/@media \(min-width: 981px\) \{([\s\S]*?)\n\}/)?.[1] ?? "";
  const mobile = mapCss.match(/@media \(max-width: 980px\) \{([\s\S]*?)\n\}/)?.[1] ?? "";
  assert.match(ruleFor(".map-stage.geographic-map-stage", desktop), /grid-template-rows:\s*minmax\(0, 1fr\) auto/, "reserve a bounded map row inside the desktop grid");
  const figure = ruleFor(".geographic-map-stage > .journey-map-fit", desktop);
  assert.match(figure, /grid-template-rows:\s*auto minmax\(0, 1fr\) auto/, "the canvas must shrink between caption and itinerary");
  assert.match(figure, /min-height:\s*0/, "intrinsic SVG height must not force the figure beyond its pane");
  const canvas = ruleFor(".journey-map-fit > .journey-map-canvas", desktop);
  assert.match(canvas, /height:\s*calc\(100% - 20px\)/, "fit height to the available row, accounting for margins");
  assert.match(canvas, /min-height:\s*0/, "permit letterboxing even in a short viewport");
  assert.match(ruleFor(".journey-map-fit > .journey-map-information", desktop), /max-height:\s*150px/, "expanded metadata must not consume unbounded map height");
  assert.match(mobile, /height:\s*min\(70vw, 360px\)/, "mobile geography should stay bounded without the fixed desktop grid");
  const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  assert.match(app, /<JourneyMap game=\{game\} fitViewport\s*\/>/, "planning view must opt into bounded geography");
});

test("the planning date and location have their own width and can grow the header without clipping the map", async () => {
  const header = ruleFor(".game-header", planningCss);
  const summary = ruleFor(".day-summary", planningCss);
  const caption = ruleFor(".day-summary strong", planningCss);
  assert.match(header, /height:\s*auto/, "the original fixed 86px height clipped wrapped Guatemala captions at 1440px");
  assert.match(header, /min-height:\s*86px/, "retain the established minimum header size");
  assert.match(summary, /display:\s*grid/, "controls must not squeeze date/location into the same horizontal row");
  assert.match(summary, /grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(caption, /display:\s*grid/, "date and region should retain separate readable lines");
  assert.match(caption, /overflow-wrap:\s*anywhere/, "long regional names must fit narrow screens");
  assert.doesNotMatch(caption, /line-clamp|text-overflow|overflow:\s*hidden/, "keep the meaningful date and region visible");
  assert.match(ruleFor(".header-actions", planningCss), /flex-wrap:\s*wrap/, "small widths should wrap tools rather than force overflow");
  const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
  assert.match(app, /className="planning-date">\{getJourneyDate\(game\)\}/);
  assert.match(app, /className="planning-region">\{event.region\}/);
  // The remaining main grid still shrinks, and the SVG stays fitted to its
  // pane, so an intrinsically taller header does not restore map clipping.
  assert.match(ruleFor(".game-grid", planningCss), /min-height:\s*0/);
  assert.match(ruleFor(".journey-map-fit > .journey-map-canvas", mapCss), /height:\s*calc\(100% - 20px\)/);
});
