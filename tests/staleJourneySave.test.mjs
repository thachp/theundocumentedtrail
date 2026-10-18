import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { createInitialGame, chooseOption, continueJourney, FAMILY_PRESETS, GAME_SAVE_KEY } from "../src/game.js";
import { applySavedJourneyAction, FAMILY_SAVES_KEY, JOURNEY_ARCHIVE_KEY, loadCurrentGame, loadFamilySaves, loadJourneyArchive, saveFamilyGame, selectFamilyGame } from "../src/saveStore.js";
import { observeJourneyRestore } from "../src/useJourneyGame.js";

const clone = value => structuredClone(value);
function memory() { const data = new Map(); return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v))}; }
const bytes = storage => [FAMILY_SAVES_KEY,GAME_SAVE_KEY,JOURNEY_ARCHIVE_KEY].map(k=>storage.getItem(k));

test("Punjab Planning Day 96 completion survives Back to Guided Day 54, stale action and reload", () => {
  const storage=memory();
  let base=selectFamilyGame("punjab",{storage});
  base=applySavedJourneyAction(base,g=>({...g,eventId:"punjabFinal",day:54,resources:{...g.resources,cash:3000,stress:20,exposure:10}}),storage);
  const guided=clone(base);
  const planning=loadCurrentGame(storage);
  const chosen=applySavedJourneyAction(planning,g=>chooseOption(g,"punjabReactivationReview"),storage);
  const complete=applySavedJourneyAction(chosen,continueJourney,storage);
  assert.equal(complete.day,96); assert.equal(complete.phase,"ended");
  assert.equal(complete.ending.type,"ireland_reactivation_pending");
  const durable=bytes(storage);
  // A restored effect/direct writer is rejected independently of UI hydration.
  saveFamilyGame(chooseOption(guided,"punjabVoluntaryReturn"),storage);
  assert.deepEqual(bytes(storage),durable);
  let invoked=false;
  const recovered=applySavedJourneyAction(guided,g=>{invoked=true;return chooseOption(g,"punjabHiddenWork");},storage);
  assert.equal(invoked,false,"stale intent must not run against a later scene");
  assert.deepEqual(recovered,complete);
  assert.deepEqual(loadCurrentGame(storage),complete);
  assert.deepEqual(bytes(storage),durable);
  assert.equal(loadJourneyArchive(storage).length,1);
});

test("prior Diop Day 3/$2015 → Day 4/$2095 durable transaction cannot be undone by an old page", () => {
  const storage=memory();
  const other=selectFamilyGame("haddad",{storage});
  let diop=selectFamilyGame("diop",{storage});
  diop=applySavedJourneyAction(diop,g=>({...g,eventId:"diopDakar",day:3,resources:{...g.resources,cash:2015}}),storage);
  const frozen=clone(diop);
  // Generic transaction fixture from the prior activity bug; no activity code,
  // feature state machine, components or enablement is imported in this PR.
  const settled=applySavedJourneyAction(diop,g=>({...g,day:4,resources:{...g.resources,cash:2095}}),storage);
  const durable=bytes(storage);
  assert.deepEqual(applySavedJourneyAction(frozen,g=>({...g,resources:{...g.resources,battery:0}}),storage),settled);
  saveFamilyGame(frozen,storage);
  assert.deepEqual(bytes(storage),durable);
  assert.equal(loadCurrentGame(storage).day,4);
  assert.equal(loadCurrentGame(storage).resources.cash,2095);
  assert.deepEqual(loadFamilySaves(storage).haddad,other);
});

test("same-day outcomes and duplicate actions use revisions rather than day or cash ordering", () => {
  const storage=memory();
  const base=selectFamilyGame("diop",{storage}), frozen=clone(base);
  const chosen=applySavedJourneyAction(base,g=>chooseOption(g,"diopVerifyOffice"),storage);
  assert.equal(chosen.day,base.day);
  assert.ok(chosen.saveRevision>base.saveRevision);
  const durable=bytes(storage);
  assert.deepEqual(applySavedJourneyAction(frozen,g=>chooseOption(g,"diopPayRecruiter"),storage),chosen);
  assert.deepEqual(applySavedJourneyAction(base,g=>chooseOption(g,"diopVerifyOffice"),storage),chosen);
  assert.deepEqual(bytes(storage),durable);
});

test("legacy revisions, explicit restart and all family slots preserve independent progress", () => {
  const storage=memory(), legacy={...createInitialGame("diop"),day:23,progress:48};
  storage.setItem(GAME_SAVE_KEY,JSON.stringify(legacy));
  const loaded=loadCurrentGame(storage);
  const updated=applySavedJourneyAction(loaded,g=>({...g,resources:{...g.resources,battery:g.resources.battery-1}}),storage);
  assert.equal(updated.saveRevision,1);assert.equal(updated.day,23);assert.equal(updated.progress,48);assert.equal(updated.runId,legacy.runId);
  for(const id of Object.keys(FAMILY_PRESETS).filter(id=>id!=="diop"))selectFamilyGame(id,{storage});
  const before=clone(loadFamilySaves(storage));
  const fresh=selectFamilyGame("diop",{storage,restart:true});
  assert.notEqual(fresh.runId,updated.runId);
  assert.deepEqual(applySavedJourneyAction(updated,g=>({...g,day:24}),storage),fresh);
  saveFamilyGame(updated,storage);
  for(const id of Object.keys(before).filter(id=>id!=="diop"))assert.deepEqual(loadFamilySaves(storage)[id],before[id]);
  const same=selectFamilyGame("diop",{storage});
  assert.deepEqual(same,fresh);
});

test("restoration observer refreshes on Back/Forward pageshow, storage and visible return, then removes listeners", () => {
  const windowTarget=new EventTarget(),documentTarget=new EventTarget();
  documentTarget.visibilityState="visible";
  let restores=0;
  const cleanup=observeJourneyRestore(()=>restores++,windowTarget,documentTarget);
  assert.equal(restores,1);
  windowTarget.dispatchEvent(new Event("pageshow")); // Back
  windowTarget.dispatchEvent(new Event("pageshow")); // Forward
  windowTarget.dispatchEvent(new Event("storage"));
  documentTarget.visibilityState="hidden"; documentTarget.dispatchEvent(new Event("visibilitychange"));
  assert.equal(restores,4);
  documentTarget.visibilityState="visible"; documentTarget.dispatchEvent(new Event("visibilitychange"));
  assert.equal(restores,5);
  cleanup();
  windowTarget.dispatchEvent(new Event("pageshow"));windowTarget.dispatchEvent(new Event("storage"));documentTarget.dispatchEvent(new Event("visibilitychange"));
  assert.equal(restores,5);
});

test("both actual views use the synchronous boundary and contain no post-render save writer", async () => {
  for(const file of ["App.jsx","BeginnerApp.jsx"]) {
    const source=await readFile(new URL(`../src/${file}`,import.meta.url),"utf8");
    assert.match(source,/\[game, setGame\] = useJourneyGame\(\)/);
    assert.doesNotMatch(source,/saveFamilyGame/);
  }
  const hook=await readFile(new URL("../src/useJourneyGame.js",import.meta.url),"utf8");
  assert.match(hook,/applySavedJourneyAction\(current\.current, action\)/);
  assert.match(hook,/current\.current = next;\s+renderGame\(next\)/);
});
