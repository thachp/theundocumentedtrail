import test from "node:test";
import assert from "node:assert/strict";
import { SOUNDTRACK_TRACK, selectSoundtrackTheme } from "../src/soundtrack.js";

test("uses the selected Pixabay track", () => {
  assert.equal(SOUNDTRACK_TRACK.src, "/assets/andriig-sad-sad-music-566795.mp3");
  assert.equal(SOUNDTRACK_TRACK.artist, "AndriiG");
});

test("uses a reflective theme for an uncertain opening", () => {
  const theme = selectSoundtrackTheme({ stress: 66, exposure: 48, progress: 0, averageHealth: 67 });
  assert.equal(theme.id, "sorrowful");
});

test("moves to a hopeful theme after trusted progress", () => {
  const theme = selectSoundtrackTheme({ stress: 58, exposure: 38, progress: 33, averageHealth: 71, outcomeTone: "trusted" });
  assert.equal(theme.id, "hopeful");
});

test("uses the difficulty theme when danger becomes acute", () => {
  const theme = selectSoundtrackTheme({ stress: 82, exposure: 74, progress: 40, averageHealth: 60 });
  assert.equal(theme.id, "difficulty");
});

test("the completed journey resolves to hope", () => {
  const theme = selectSoundtrackTheme({ stress: 80, exposure: 90, averageHealth: 50, status: "won" });
  assert.equal(theme.id, "hopeful");
});
