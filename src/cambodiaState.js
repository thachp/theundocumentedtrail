import {preservesCommittedChoices} from './committedChoices.js';
import { CAMBODIA_SCENES, STORY_ID, sceneFor } from "./cambodiaStory.js";
// One bounded, linear, story-local record. The active route never mounts the
// survival game alongside this reader. No RNG, statistics, inventory or scoring.
export const CAMBODIA_SAVE_KEY = "undocumented-trail:review:cambodia-1979:v2";
export function cambodiaStoryEnabled(env = {}) { return env.VITE_ENABLE_CAMBODIA_STORY !== "false"; }
export function createCambodiaState() { return { version: 2, storyId: STORY_ID, sceneId: "C01", phase: "intro", flags: {}, history: [] }; }
export function startCambodia(state) { return state.phase === "intro" ? { ...state, phase: "scene" } : state; }
export function chooseCambodia(state, id) {
  if (state.phase !== "scene") return state;
  const scene = sceneFor(state), selected = scene.choices.find(c => c.id === id);
  if (!selected) return state;
  // C02 reading preferences are UI only: both produce exactly the same record.
  const choice = scene.id === "C02" ? scene.choices[0] : selected;
  const flags = choice.flag ? { ...state.flags, [choice.flag[0]]: choice.flag[1] } : state.flags;
  return { ...state, phase: "consequence", flags, history: [...state.history, { sceneId: scene.id, choiceId: choice.id }] };
}
export function continueCambodia(state) {
  if (state.phase !== "consequence") return state;
  const i = CAMBODIA_SCENES.findIndex(s => s.id === state.sceneId);
  return i === CAMBODIA_SCENES.length - 1 ? { ...state, phase: "complete" } : { ...state, sceneId: CAMBODIA_SCENES[i + 1].id, phase: "scene" };
}
// Retained compatibility API: committed decisions cannot be undone.
export function backCambodia(state) { return state; }
// Replay validates a bounded save and derives flags, rather than trusting stored
// values. Invalid/newer saves are retained in storage; never touch family keys.
export function validateCambodiaSave(raw) {
  if (!raw || raw.version !== 2 || raw.storyId !== STORY_ID || !Array.isArray(raw.history) || raw.history.length > 9) return null;
  let state = startCambodia(createCambodiaState());
  for (const [i, entry] of raw.history.entries()) {
    if (entry.sceneId !== CAMBODIA_SCENES[i].id || !sceneFor(state).choices.some(c => c.id === entry.choiceId)) return null;
    state = chooseCambodia(state, entry.choiceId);
    if (i < raw.history.length - 1) state = continueCambodia(state);
  }
  if (raw.phase === "intro" && !raw.history.length && raw.sceneId === "C01") return createCambodiaState();
  if (raw.phase === "scene" && raw.history.length) state = continueCambodia(state);
  else if (raw.phase === "complete" && raw.history.length === 9) state = continueCambodia(state);
  else if (raw.phase !== state.phase) return null;
  return state.phase === raw.phase && state.sceneId === raw.sceneId ? state : null;
}
export function loadCambodia(storage) {
  try {
    const saved = storage.getItem(CAMBODIA_SAVE_KEY);
    if (saved === null) return { state: createCambodiaState(), warning: "", writable: true };
    const state = validateCambodiaSave(JSON.parse(saved));
    return state ? { state, warning: "", writable: true } : { state: createCambodiaState(), warning: "This story save could not be read. It has been preserved. Choose Start a new story to replace only this story save.", writable: false };
  } catch { return { state: createCambodiaState(), warning: "Saving is unavailable. You can read this story during this visit.", writable: false }; }
}
export function saveCambodia(storage, state, {restart=false}={}) {
  if (!validateCambodiaSave(state)) return false;
  try {
    if(restart){storage.setItem(CAMBODIA_SAVE_KEY, JSON.stringify(state));return true;}
    const text=storage.getItem(CAMBODIA_SAVE_KEY),stored=text===null?null:validateCambodiaSave(JSON.parse(text));
    if(!restart && text!==null && (!stored||!preservesCommittedChoices(stored,state)))return false;
    storage.setItem(CAMBODIA_SAVE_KEY, JSON.stringify(state)); return true;
  } catch { return false; }
}
