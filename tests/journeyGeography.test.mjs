import assert from "node:assert/strict";
import test from "node:test";
import { EVENTS, FAMILY_PRESETS, createInitialGame, chooseOption, continueJourney } from "../src/game.js";
import { EVENT_LOCATIONS, MAP_BOUNDS, MAP_SIZE, getJourneyGeography, projectCoordinate } from "../src/journeyGeography.js";
import { saveFamilyGame, selectFamilyGame } from "../src/saveStore.js";
import { readFile } from "node:fs/promises";

test("every event reachable by every branch has explicit geography belonging to that family", () => {
  const covered = new Set();
  for (const family of Object.values(FAMILY_PRESETS)) {
    const queue = [family.startEventId], visited = new Set();
    while (queue.length) {
      const id = queue.shift();
      if (visited.has(id)) continue;
      visited.add(id); covered.add(id);
      const location = EVENT_LOCATIONS[id];
      assert.equal(location?.familyId, family.id, id);
      assert.ok(location.label && location.uncertainty, id);
      const [west, south, east, north] = MAP_BOUNDS[family.id];
      const [longitude, latitude] = location.coordinates;
      assert.ok(longitude >= west && longitude <= east && latitude >= south && latitude <= north, id);
      const [x, y] = projectCoordinate(location.coordinates, MAP_BOUNDS[family.id]);
      assert.ok(x >= MAP_SIZE.padding - .001 && x <= MAP_SIZE.width - MAP_SIZE.padding + .001, id);
      assert.ok(y >= MAP_SIZE.padding - .001 && y <= MAP_SIZE.height - MAP_SIZE.padding + .001, id);
      queue.push(...EVENTS[id].choices.map((choice) => choice.next).filter(Boolean));
    }
  }
  assert.deepEqual([...covered].sort(), Object.keys(EVENTS).sort());
  assert.deepEqual(Object.keys(EVENT_LOCATIONS).sort(), Object.keys(EVENTS).sort());
});

test("Senegal opening is Mbour, west of Greenwich and north of the equator", () => {
  const map = getJourneyGeography(createInitialGame("diop"));
  assert.deepEqual(map.current.coordinates, [-16.97, 14.42]);
  assert.match(map.current.label, /Mbour, Senegal/);
  assert.equal(map.itinerary.length, 1);
  assert.equal(map.current.eventId, "diopHome");
});

test("projection uses longitude first, north up, and a single uniform scale", () => {
  const bounds = [-20, 10, 20, 50];
  const center = projectCoordinate([0, 30], bounds);
  assert.deepEqual(center, [300, 250]);
  const east = projectCoordinate([1, 30], bounds), north = projectCoordinate([0, 31], bounds);
  assert.ok(east[0] > center[0]); assert.ok(north[1] < center[1]);
  assert.ok(Math.abs(east[0] - center[0] - (center[1] - north[1])) < 1e-10);
  assert.throws(() => projectCoordinate([14, 150], bounds), RangeError);
  assert.throws(() => projectCoordinate([NaN, 14], bounds), RangeError);
  // SVG viewBox and preserveAspectRatio apply the same transform to map and
  // markers at every viewport; verify wide, narrow and tall fit calculations.
  for (const [width, height] of [[1440, 900], [390, 320], [320, 600]]) {
    const scale = Math.min(width / 600, height / 500);
    const offset = [(width - 600 * scale) / 2, (height - 500 * scale) / 2];
    const pixel = center.map((v, i) => v * scale + offset[i]);
    assert.deepEqual(pixel, [width / 2, height / 2]);
  }
});

test("route comes from visited events, never progress, route category or future destination", () => {
  const game = createInitialGame("haddad");
  const first = getJourneyGeography(game);
  assert.deepEqual(getJourneyGeography({ ...game, route: "ridge", progress: 99 }).points, first.points);
  const crossing = { ...game, eventId: "haddadAegean", history: [{ eventId: "haddadHome" }, { eventId: "haddadBorder" }, { eventId: "haddadTurkey" }] };
  const before = getJourneyGeography(crossing);
  const outcome = { ...crossing, phase: "outcome", pendingNext: "haddadMemorial" };
  assert.deepEqual(getJourneyGeography(outcome).points, before.points);
  const direct = getJourneyGeography({ ...crossing, eventId: "haddadGreece", history: [...crossing.history, { eventId: "haddadAegean" }] });
  const loss = getJourneyGeography({ ...crossing, eventId: "haddadMemorial", history: [...crossing.history, { eventId: "haddadAegean" }] });
  assert.equal(direct.current.eventId, "haddadGreece");
  assert.equal(loss.current.eventId, "haddadMemorial");
  assert.ok(!direct.itinerary.some((entry) => entry.eventId === "haddadMemorial"));
  assert.ok(!before.itinerary.some((entry) => entry.eventId === "haddadGermany"));
});

test("family switching and a round trip through saved JSON retain only that journey", () => {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  for (const family of Object.values(FAMILY_PRESETS)) {
    const game = createInitialGame(family.id);
    saveFamilyGame(game, storage);
  }
  for (const family of Object.values(FAMILY_PRESETS)) {
    const game = selectFamilyGame(family.id, { storage });
    const resumed = getJourneyGeography(JSON.parse(JSON.stringify(game)));
    assert.equal(resumed.current.eventId, family.startEventId);
    assert.ok(resumed.itinerary.every((entry) => entry.familyId === family.id));
    const mixed = getJourneyGeography({ ...game, history: Object.keys(EVENTS).map((eventId) => ({ eventId })) });
    assert.ok(mixed.itinerary.every((entry) => entry.familyId === family.id));
  }
});

test("committed terminal return branches use their authored destinations after continuation", () => {
  const cases = [
    ["ramirez", "memorial", "returnAfterLoss", "Honduras"],
    ["ramirez", "detention", "acceptRemoval", "Honduras"],
    ["haddad", "haddadMemorial", "haddadReturnAfterLoss", "Türkiye"],
    ["diop", "diopAtlantic", "diopTurnBack", "Senegal"],
    ["diop", "diopFinal", "diopAssistedReturn", "Senegal"],
    ["nguyen", "nguyenFinal", "nguyenVoluntaryReturn", "Vietnam"],
    ["punjab", "punjabFinal", "punjabVoluntaryReturn", "India"],
    ["rohingya", "rohingyaCoast", "rohingyaReturnCamp", "Cox’s Bazar"],
  ];
  for (const [familyId, eventId, choiceId, destination] of cases) {
    const game = { ...createInitialGame(familyId), eventId, resources: { cash: 10000, supplies: 20, water: 100, medicine: 5, battery: 100, stress: 0, exposure: 0 } };
    const committed = chooseOption(game, choiceId);
    assert.notEqual(committed, game, choiceId);
    assert.notEqual(getJourneyGeography(committed).current.eventId, "ending", "do not move before continuation");
    const ended = continueJourney(committed);
    assert.equal(ended.phase, "ended", choiceId);
    assert.match(getJourneyGeography(ended).current.label, new RegExp(destination), choiceId);
  }
});

test("early stopping keeps the actual country instead of the originally promised destination", () => {
  for (const [familyId, eventId, choiceId, label] of [
    ["haddad", "haddadAegean", "haddadTurkeyProtection", "Türkiye"],
    ["nguyen", "nguyenChannel", "nguyenFranceProcess", "France"],
    ["punjab", "punjabAirport", "punjabReportAgent", "India"],
    ["rohingya", "rohingyaCamp", "rohingyaStayForSchool", "Bangladesh"],
  ]) {
    const game = { ...createInitialGame(familyId), eventId, resources: { cash: 10000, supplies: 20, water: 100, medicine: 5, battery: 100, stress: 0, exposure: 0 } };
    const ended = continueJourney(chooseOption(game, choiceId));
    assert.equal(ended.phase, "ended");
    assert.match(getJourneyGeography(ended).current.label, new RegExp(label));
  }
});

test("land geometry remains bounded and includes the Canary Islands", async () => {
  const land = JSON.parse(await readFile(new URL("../src/mapLand.json", import.meta.url)));
  for (const [familyId, countries] of Object.entries(land)) {
    const [west, south, east, north] = MAP_BOUNDS[familyId];
    for (const country of countries) for (const ring of country.rings) for (const [lon, lat] of ring) {
      assert.ok(lon >= west && lon <= east && lat >= south && lat <= north, `${familyId}: ${country.name}`);
    }
  }
  const spain = land.diop.find((country) => country.name === "Spain");
  assert.ok(spain?.rings.some((ring) => ring.some(([lon, lat]) => lon > -19 && lon < -13 && lat > 27 && lat < 30)));
});
