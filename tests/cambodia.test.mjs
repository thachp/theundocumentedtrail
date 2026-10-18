import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { CAMBODIA_SCENES, CAMBODIA_SOURCES, callbacks, sceneFor } from "../src/cambodiaStory.js";
import { createCambodiaState, startCambodia, chooseCambodia, continueCambodia, backCambodia, validateCambodiaSave, loadCambodia, saveCambodia, CAMBODIA_SAVE_KEY, cambodiaStoryEnabled } from "../src/cambodiaState.js";
import { getCambodiaGeography, PILOT_MAP_BOUNDS } from "../src/cambodiaGeography.js";
import { MAP_BOUNDS } from "../src/journeyGeography.js";
import { FAMILY_SAVES_KEY, JOURNEY_ARCHIVE_KEY, FAMILY_SELECTION_KEY, loadFamilySaves, saveFamilyGame } from "../src/saveStore.js";
import { FAMILY_PRESETS, GAME_SAVE_KEY, createInitialGame } from "../src/game.js";
const started = () => startCambodia(createCambodiaState());
const step = (s, i = 0) => continueCambodia(chooseCambodia(s, sceneFor(s).choices[i].id));
test("all 512 choice sequences preserve fixed chronology, admission, survival premises and bounded state", () => {
  const endings = new Set();
  for (let mask = 0; mask < 512; mask++) {
    let state = started(), last = 0;
    for (let i = 0; i < 9; i++) {
      const scene = sceneFor(state);
      assert.equal(scene.id, `C0${i + 1}`);
      assert.ok(scene.order >= last); last = scene.order;
      assert.equal(scene.choices.length, 2);
      if (i === 4) assert.match(scene.date, /December 1979/);
      if (i === 5) assert.match(scene.prose, /January 1980/);
      if (i === 6) assert.match(scene.status, /Approved for U.S. refugee admission/);
      const committed = chooseCambodia(state, scene.choices[(mask >> i) & 1].id);
      assert.equal(chooseCambodia(committed, scene.choices[0].id), committed, "cannot apply consequence twice");
      assert.deepEqual(validateCambodiaSave(committed), committed);
      state = continueCambodia(committed);
      assert.deepEqual(validateCambodiaSave(state), state);
      assert.deepEqual(Object.keys(state).sort(), ["version", "storyId", "sceneId", "phase", "flags", "history"].sort());
      assert.ok(state.history.length <= 9);
      assert.ok(Object.values(state.flags).every(f => typeof f === "string"));
    }
    assert.equal(state.phase, "complete");
    assert.ok(callbacks(state).length >= 4);
    assert.equal(sceneFor(state).status, "Continuing life after refugee admission · future open");
    endings.add(state.flags.ending);
  }
  assert.deepEqual([...endings].sort(), ["design", "memory"]);
});
test("C02 reading alternatives have identical persistent state; earlier flags are recalled in later prose", () => {
  const state = step(started());
  assert.deepEqual(chooseCambodia(state, "summary"), chooseCambodia(state, "history"));
  let a = started(), b = started();
  for (let i = 0; i < 8; i++) { a = step(a, 0); b = step(b, 1); }
  assert.match(callbacks(a).join(" "), /extra day|contact plan/);
  assert.match(callbacks(a).join(" "), /stopped to rest/);
  assert.match(callbacks(b).join(" "), /unresolved/);
  assert.match(callbacks(b).join(" "), /sharing bundles/);
  assert.notEqual(callbacks(a).join(" "), callbacks(b).join(" "));
});
test("back, revise and refresh rebuild flags without duplicating consequences", () => {
  let state = step(step(step(started())));
  assert.equal(state.flags.contact, "asked");
  state = backCambodia(state);
  assert.equal(state.sceneId, "C03"); assert.equal(state.phase, "scene");
  assert.equal(state.flags.contact, undefined);
  state = chooseCambodia(state, "prepare");
  assert.equal(state.flags.contact, "unresolved");
  assert.deepEqual(validateCambodiaSave(JSON.parse(JSON.stringify(state))), state);
  state = backCambodia(state);
  assert.equal(state.sceneId, "C03"); assert.equal(state.flags.contact, undefined);
  assert.deepEqual(backCambodia(started()), createCambodiaState());
});
test("pilot save leaves all existing family saves and archives byte-for-byte intact", () => {
  const data = new Map([[FAMILY_SAVES_KEY, JSON.stringify(Object.fromEntries(Object.keys(FAMILY_PRESETS).map(id => [id, createInitialGame(id)])))], [JOURNEY_ARCHIVE_KEY, "[]"], [GAME_SAVE_KEY, JSON.stringify(createInitialGame("haddad"))], [FAMILY_SELECTION_KEY, "diop"]]);
  const storage = { getItem: k => data.get(k) ?? null, setItem: (k, v) => data.set(k, v) };
  const before = [...data];
  const state = step(started());
  assert.equal(saveCambodia(storage, state), true);
  assert.deepEqual(loadCambodia(storage).state, state);
  assert.deepEqual([...data].filter(([k]) => k !== CAMBODIA_SAVE_KEY), before);
  data.set(CAMBODIA_SAVE_KEY, '{"version":99}');
  const invalid = loadCambodia(storage);
  assert.equal(invalid.writable, false); assert.match(invalid.warning, /preserved/);
  assert.equal(data.get(CAMBODIA_SAVE_KEY), '{"version":99}');
  const beforeFamilySave = data.get(CAMBODIA_SAVE_KEY);
  saveFamilyGame(createInitialGame("ramirez"), storage);
  assert.equal(data.get(CAMBODIA_SAVE_KEY), beforeFamilySave);
  assert.equal(Object.keys(loadFamilySaves(storage)).length, 6);
  assert.equal(saveCambodia({ setItem() { throw Error("blocked"); } }, state), false);
  assert.equal(validateCambodiaSave({ ...state, history: Array(10).fill({}) }), null);
  assert.equal(validateCambodiaSave({ ...state, sceneId: "C09" }), null);
});
test("geography uses bounded projected regional anchors and complete text chronology without invented flight path", async () => {
  const land = JSON.parse(await readFile(new URL("../src/mapLand.json", import.meta.url)));
  let state = started();
  for (let i = 0; i < 9; i++) {
    const model = getCambodiaGeography(state);
    assert.equal(model.itinerary.length, i + 1);
    assert.ok(model.points.every(p => p.every(Number.isFinite)));
    assert.ok(model.points.every(([x,y]) => x >= 0 && x <= 600 && y >= 0 && y <= 500));
    if (i >= 7) { assert.equal(model.landKey, "minnesotaRegion"); assert.equal(model.points.length, i - 6); }
    assert.match(model.note, /not traveled routes/);
    state = step(state);
  }
  for (const [key, [w,s,e,n]] of Object.entries({ ...MAP_BOUNDS, ...PILOT_MAP_BOUNDS })) {
    assert.ok(land[key]?.length, key);
    for (const country of land[key]) for (const ring of country.rings) for (const [x,y] of ring) assert.ok(x >= w && x <= e && y >= s && y <= n);
  }
});
test("authorized public entry defaults on with an explicit off switch; source limitations stay visible", () => {
  assert.equal(cambodiaStoryEnabled({}), true);
  assert.equal(cambodiaStoryEnabled({ PROD:true }), true);
  assert.equal(cambodiaStoryEnabled({ DEV:true }), true);
  assert.equal(cambodiaStoryEnabled({ VITE_ENABLE_CAMBODIA_STORY:"true" }), true);
  assert.equal(cambodiaStoryEnabled({ VITE_ENABLE_CAMBODIA_STORY:"false" }), false);
  assert.match(CAMBODIA_SOURCES.C7.date, /Individual retrospective testimony/);
  assert.match(CAMBODIA_SOURCES.C6.date, /Statute/);
  assert.match(CAMBODIA_SOURCES.C4.date, /retrieval pending/);
});
