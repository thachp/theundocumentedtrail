import assert from "node:assert/strict";
import test from "node:test";
import { EVENTS, FAMILY_PRESETS, SOCIAL_FEEDS, createInitialGame, getPeople, chooseOption } from "../src/game.js";
import { HISTORY_SOURCES, JOURNEY_HISTORY, SCENE_HISTORY, getJourneyDate, getSceneHistory, rememberJourneyIntro, shouldShowJourneyIntro } from "../src/journeyHistory.js";
import { refreshNarrative } from "../src/narrativeMigration.js";
import { FAMILY_SAVES_KEY, FAMILY_SELECTION_KEY, loadCurrentGame } from "../src/saveStore.js";

function memoryStorage() {
  const values = new Map();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}

test("all six introductions separate documented background, family fiction and dated sources", () => {
  assert.deepEqual(Object.keys(JOURNEY_HISTORY).sort(), Object.keys(FAMILY_PRESETS).sort());
  for (const [familyId, context] of Object.entries(JOURNEY_HISTORY)) {
    const words = `${context.historicalSummary} ${context.familyStakes}`.split(/\s+/).length;
    assert.ok(words >= 80 && words <= 120, `${familyId}: ${words} words`);
    assert.ok(context.place && context.era && context.contentNote);
    for (const person of getPeople(familyId)) assert.ok(context.familyStakes.includes(person.name), `${familyId}: preserve ${person.name}’s authored name`);
    assert.ok(context.timeline.length >= 3 && context.timeline.length <= 5);
    assert.ok(context.sourceIds.length);
    for (const sourceId of context.sourceIds) {
      const source = HISTORY_SOURCES[sourceId];
      assert.ok(source.title && source.date);
      assert.equal(new URL(source.url).protocol, "https:");
    }
    for (const entry of context.timeline) {
      assert.ok(entry.date && entry.kind && entry.text);
      if (entry.sourceId) assert.ok(context.sourceIds.includes(entry.sourceId));
    }
  }
  assert.match(JOURNEY_HISTORY.haddad.historicalSummary, /March 2011/);
  assert.match(JOURNEY_HISTORY.haddad.familyStakes, /July 2015/);
  for (const familyId of Object.keys(FAMILY_PRESETS).filter((id) => id !== "haddad")) {
    assert.equal(JOURNEY_HISTORY[familyId].departureDate, undefined, "do not backdate unrelated journeys");
    assert.match(JOURNEY_HISTORY[familyId].era, /Contemporary/);
  }
});

test("every existing event has matching scene context and valid scoped sources", () => {
  assert.deepEqual(Object.keys(SCENE_HISTORY).sort(), Object.keys(EVENTS).sort());
  for (const [eventId, note] of Object.entries(SCENE_HISTORY)) {
    const game = { ...createInitialGame(note.familyId), eventId };
    assert.equal(getSceneHistory(game), note);
    assert.ok(note.text);
    for (const sourceId of note.sourceIds) assert.ok(HISTORY_SOURCES[sourceId]);
  }
  assert.equal(getSceneHistory({ familyId: "diop", eventId: "haddadHome" }), null);
});

test("the skippable introduction is run-scoped UI state and never advances a save", () => {
  const storage = memoryStorage(), game = createInitialGame("haddad");
  const before = structuredClone(game);
  assert.equal(shouldShowJourneyIntro(game, storage), true);
  rememberJourneyIntro(game, storage);
  assert.equal(shouldShowJourneyIntro(game, storage), false);
  assert.deepEqual(game, before);
  assert.equal(shouldShowJourneyIntro({ ...game, runId: "another-run" }, storage), true);
  assert.equal(shouldShowJourneyIntro({ ...game, history: [{ eventId: "haddadHome" }] }, memoryStorage()), false);
  assert.equal(shouldShowJourneyIntro({ ...game, day: 10 }, memoryStorage()), false);
  const broken = { getItem() { throw Error("unavailable"); }, setItem() { throw Error("unavailable"); } };
  assert.doesNotThrow(() => rememberJourneyIntro(game, broken));
});

test("the fictional July calendar follows elapsed days in UTC and every authored Haddad route stays in 2015", () => {
  const initial = createInitialGame("haddad");
  assert.equal(getJourneyDate(initial), "1 July 2015");
  assert.equal(getJourneyDate({ ...initial, day: 32 }), "1 August 2015");
  assert.match(getJourneyDate(createInitialGame("diop")), /^Contemporary/);
  let endings = 0;
  function visit(eventId, day) {
    const event = EVENTS[eventId];
    assert.match(event.region, /2015/);
    assert.match(getJourneyDate({ ...initial, day }), /2015$/);
    for (const choice of event.choices) {
      const nextDay = day + choice.days;
      assert.match(getJourneyDate({ ...initial, day: nextDay }), /2015$/);
      if (choice.next) visit(choice.next, nextDay); else endings++;
    }
  }
  visit(initial.eventId, 1);
  assert.ok(endings > 100, "exercise every path through the branching event graph");
});

test("Haddad-facing content removes the failed-return era and unsupported recruitment premise", () => {
  const content = JSON.stringify({ family: FAMILY_PRESETS.haddad, people: getPeople("haddad"), events: Object.values(EVENTS).filter((e) => e.id.startsWith("haddad")), feed: SOCIAL_FEEDS.haddadEuropeNews });
  assert.doesNotMatch(content, /Present day|failed return|attempted return|after returning to Syria|fall of the former government|change of government|recruitment pressure|men asking for Sami|post-government/i);
  assert.doesNotMatch(content, /2026-04\/unhcr-syria|country-guidance-syria|august-2025/);
  assert.equal(getPeople("haddad").find((person) => person.id === "sami").age, 16);
  assert.equal(getPeople("haddad").find((person) => person.id === "mariam").age, 9);
  assert.match(EVENTS.haddadBalkans.weather, /Summer/);
  assert.doesNotMatch(JSON.stringify(EVENTS.haddadBalkans), /fence|barrier|freezing|closure and worsening/i);
  assert.match(SOCIAL_FEEDS.haddadEuropeNews.posts[2].body, /school|staffing/);
  assert.match(SOCIAL_FEEDS.haddadEuropeNews.posts[2].label, /resident perspective/i);
});

test("legacy outcome and ending text refresh without reapplying choices or losing resources", () => {
  let legacy = chooseOption({ ...createInitialGame("haddad"), eventId: "haddadGermany" }, "haddadRegisterGermany");
  delete legacy.narrativeEdition;
  legacy.currentOutcome.copy = "evidence from an attempted return";
  legacy.pendingEnding.copy = "evidence from a failed return";
  legacy.history[0].location = "Old present-day location";
  const original = structuredClone(legacy);
  const refreshed = refreshNarrative(legacy);
  assert.equal(refreshed.currentOutcome.copy, EVENTS.haddadGermany.choices[0].outcome);
  assert.equal(refreshed.pendingEnding.copy, EVENTS.haddadGermany.choices[0].ending.copy);
  for (const key of ["resources", "people", "flags", "eventId", "day", "progress", "pendingNext", "runId", "version", "phase"]) assert.deepEqual(refreshed[key], original[key], key);
  assert.equal(refreshed.history.length, original.history.length);
  assert.equal(refreshed.history[0].choiceId, original.history[0].choiceId);
  assert.deepEqual(legacy, original, "migration must not mutate its input");
  assert.equal(refreshNarrative(refreshed), refreshed, "migration is idempotent");
  const ended = refreshNarrative({ ...legacy, phase: "ended", ending: legacy.pendingEnding });
  assert.equal(ended.ending.copy, EVENTS.haddadGermany.choices[0].ending.copy);
});

test("legacy social feed text refreshes and saved family slots remain independent", () => {
  const storage = memoryStorage();
  const legacy = { ...createInitialGame("haddad"), day: 40, eventId: "haddadEuropeNews", narrativeEdition: undefined,
    lastSocialOutcome: { eventId: "haddadEuropeNews", responseId: "support", copy: "old return policy", reactions: [] },
    relationshipNotes: { sami: { personId: "sami", choiceId: "syria-safe-debate-support", text: "the men who came for me", trustDelta: 1 } } };
  const diop = { ...createInitialGame("diop"), day: 20 };
  storage.setItem(FAMILY_SAVES_KEY, JSON.stringify({ haddad: legacy, diop }));
  storage.setItem(FAMILY_SELECTION_KEY, "haddad");
  const resumed = loadCurrentGame(storage);
  assert.equal(resumed.day, 40);
  assert.equal(resumed.lastSocialOutcome.copy, SOCIAL_FEEDS.haddadEuropeNews.outcomes.support);
  assert.equal(resumed.relationshipNotes.sami.text, SOCIAL_FEEDS.haddadEuropeNews.voice.support);
  storage.setItem(FAMILY_SELECTION_KEY, "diop");
  assert.deepEqual(loadCurrentGame(storage), diop);
  assert.strictEqual(refreshNarrative(diop), diop);
});
