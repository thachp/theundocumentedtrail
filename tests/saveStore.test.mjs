import assert from "node:assert/strict";
import test from "node:test";
import { GAME_SAVE_KEY, createInitialGame } from "../src/game.js";
import {
  FAMILY_SAVES_KEY,
  JOURNEY_ARCHIVE_KEY,
  loadCurrentGame,
  loadFamilySaves,
  loadJourneyArchive,
  saveFamilyGame,
  selectFamilyGame,
} from "../src/saveStore.js";

function createMemoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
  };
}

test("migrates the legacy save into its family slot", () => {
  const legacy = { ...createInitialGame("haddad"), day: 12, progress: 43 };
  const storage = createMemoryStorage({ [GAME_SAVE_KEY]: JSON.stringify(legacy) });

  assert.equal(loadCurrentGame(storage).familyId, "haddad");
  assert.equal(loadFamilySaves(storage).haddad.day, 12);
});

test("keeps independent progress for every family", () => {
  const storage = createMemoryStorage();
  const ramirez = { ...createInitialGame("ramirez"), day: 9, progress: 32 };
  const nguyen = { ...createInitialGame("nguyen"), day: 18, progress: 57 };

  saveFamilyGame(ramirez, storage);
  saveFamilyGame(nguyen, storage);

  const saves = loadFamilySaves(storage);
  assert.equal(saves.ramirez.day, 9);
  assert.equal(saves.nguyen.day, 18);
  assert.equal(JSON.parse(storage.getItem(FAMILY_SAVES_KEY)).ramirez.progress, 32);
});

test("continues an existing family unless a fresh run is explicitly requested", () => {
  const storage = createMemoryStorage();
  const diop = { ...createInitialGame("diop"), day: 27, progress: 71 };
  const punjab = { ...createInitialGame("punjab"), day: 6, progress: 18 };
  saveFamilyGame(diop, storage);
  saveFamilyGame(punjab, storage);

  assert.equal(selectFamilyGame("diop", { storage }).day, 27);

  const restarted = selectFamilyGame("diop", { storage, restart: true });
  assert.equal(restarted.day, 1);
  assert.equal(loadFamilySaves(storage).punjab.day, 6);
});

test("archives a completed run once before that family starts again", () => {
  const storage = createMemoryStorage();
  const completed = {
    ...createInitialGame("haddad"),
    phase: "ended",
    status: "won",
    day: 41,
    progress: 100,
    ending: { type: "asylum_pending", title: "The case enters review", copy: "Review continues." },
  };

  saveFamilyGame(completed, storage, { completedAt: 123456 });
  saveFamilyGame(completed, storage, { completedAt: 999999 });

  const archive = loadJourneyArchive(storage);
  assert.equal(archive.length, 1);
  assert.equal(archive[0].familyId, "haddad");
  assert.equal(archive[0].endingType, "asylum_pending");
  assert.equal(archive[0].completedAt, 123456);
  assert.equal(archive[0].survivors, 4);
  assert.equal(JSON.parse(storage.getItem(JOURNEY_ARCHIVE_KEY)).length, 1);
});
