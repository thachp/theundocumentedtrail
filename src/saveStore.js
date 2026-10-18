import {
  FAMILY_PRESETS,
  GAME_SAVE_KEY,
  createInitialGame,
  getPeople,
  isSavedGameValid,
} from "./game.js";
import { refreshNarrative } from "./narrativeMigration.js";

export const FAMILY_SELECTION_KEY = "the-undocumented-trail-family-v1";
export const FAMILY_SAVES_KEY = "the-undocumented-trail-family-saves-v1";
export const JOURNEY_ARCHIVE_KEY = "the-undocumented-trail-archive-v1";

const MAX_ARCHIVE_ENTRIES = 30;

function activeStorage(storage) {
  return storage ?? window.localStorage;
}

function readJson(storage, key, fallback) {
  try {
    const value = JSON.parse(storage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export function getSelectedFamilyId(storage) {
  const selected = activeStorage(storage).getItem(FAMILY_SELECTION_KEY);
  return FAMILY_PRESETS[selected] ? selected : null;
}

export function hasSelectedFamily(storage) {
  return Boolean(getSelectedFamilyId(storage));
}

export function loadFamilySaves(storage) {
  const target = activeStorage(storage);
  const stored = readJson(target, FAMILY_SAVES_KEY, {});
  const saves = {};

  if (stored && typeof stored === "object" && !Array.isArray(stored)) {
    for (const [familyId, game] of Object.entries(stored)) {
      if (FAMILY_PRESETS[familyId] && game?.familyId === familyId && isSavedGameValid(game)) saves[familyId] = refreshNarrative(game);
    }
  }

  const legacy = readJson(target, GAME_SAVE_KEY, null);
  if (isSavedGameValid(legacy) && !saves[legacy.familyId]) saves[legacy.familyId] = refreshNarrative(legacy);
  return saves;
}

export function loadJourneyArchive(storage) {
  const archive = readJson(activeStorage(storage), JOURNEY_ARCHIVE_KEY, []);
  if (!Array.isArray(archive)) return [];
  return archive.filter((entry) => (
    entry
    && typeof entry.runId === "string"
    && FAMILY_PRESETS[entry.familyId]
    && typeof entry.endingTitle === "string"
    && Number.isFinite(entry.completedAt)
  ));
}

function archiveCompletedGame(game, storage, completedAt) {
  if (game.phase !== "ended" || !game.ending || !game.runId) return loadJourneyArchive(storage);
  const archive = loadJourneyArchive(storage);
  if (archive.some((entry) => entry.runId === game.runId)) return archive;

  const people = getPeople(game);
  const survivors = people.filter((person) => game.people[person.id]?.alive !== false).length;
  const entry = {
    runId: game.runId,
    familyId: game.familyId,
    status: game.status,
    endingType: game.ending.type ?? game.status,
    endingTitle: game.ending.title,
    day: game.day,
    decisions: game.history.length,
    survivors,
    travelers: people.length,
    losses: [...(game.losses ?? [])],
    progress: game.progress,
    completedAt,
  };
  const nextArchive = [entry, ...archive].slice(0, MAX_ARCHIVE_ENTRIES);
  storage.setItem(JOURNEY_ARCHIVE_KEY, JSON.stringify(nextArchive));
  return nextArchive;
}

export function saveFamilyGame(game, storage, options = {}) {
  const target = activeStorage(storage);
  if (!isSavedGameValid(game)) return loadFamilySaves(target);

  const saves = loadFamilySaves(target);
  const nextSaves = { ...saves, [game.familyId]: game };
  target.setItem(FAMILY_SAVES_KEY, JSON.stringify(nextSaves));
  target.setItem(GAME_SAVE_KEY, JSON.stringify(game));
  archiveCompletedGame(game, target, options.completedAt ?? Date.now());
  return nextSaves;
}

export function loadCurrentGame(storage) {
  const target = activeStorage(storage);
  const saves = loadFamilySaves(target);
  const selectedFamilyId = getSelectedFamilyId(target);
  if (selectedFamilyId && saves[selectedFamilyId]) return saves[selectedFamilyId];

  const legacy = readJson(target, GAME_SAVE_KEY, null);
  if (isSavedGameValid(legacy)) return refreshNarrative(legacy);
  if (selectedFamilyId) return createInitialGame(selectedFamilyId);
  return Object.values(saves)[0] ?? createInitialGame();
}

export function selectFamilyGame(familyId, options = {}) {
  const target = activeStorage(options.storage);
  const validFamilyId = FAMILY_PRESETS[familyId] ? familyId : "ramirez";
  const saved = loadFamilySaves(target)[validFamilyId];
  const game = options.restart || !saved ? createInitialGame(validFamilyId) : saved;
  target.setItem(FAMILY_SELECTION_KEY, validFamilyId);
  saveFamilyGame(game, target);
  return game;
}
