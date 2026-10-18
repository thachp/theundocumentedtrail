import assert from "node:assert/strict";
import test from "node:test";
import { createInitialGame, GAME_SAVE_KEY } from "../src/game.js";
import { applySavedJourneyAction, FAMILY_SAVES_KEY, loadCurrentGame, loadFamilySaves, saveFamilyGame, selectFamilyGame } from "../src/saveStore.js";
import { advanceRepair, beginRepair, repairRecord, settleRepair } from "../src/livelihoodActivity.js";
const clone = v => JSON.parse(JSON.stringify(v));
function memory() { const values=new Map();return {getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,String(v))}; }
function seed(storage) {
 // Pick a stable one-collection instance: settlement credits 60 sales + 20 refund.
 let base;
 for(let n=0;n<10;n++) {
  base={...createInitialGame("diop"),runId:`back-regression-${n}`,eventId:"diopDakar",day:3};
  base.resources={...base.resources,cash:2060};
  if(repairRecord(settleRepair(beginRepair(base),{summary:true})).ledger.inventory.sold===1)break;
 }
 return saveFamilyGame(base,storage).diop;
}
test("Guided commit → Planning settle → browser Back → stale activity action → reload cannot roll Day 4/$2095 back to Day 3/$2015", () => {
 const storage=memory();
 saveFamilyGame({...createInitialGame("haddad"),day:12},storage);
 const otherFamily=clone(loadFamilySaves(storage).haddad);
 const guided=applySavedJourneyAction(seed(storage),beginRepair,storage);
 assert.equal(guided.day,3);assert.equal(guided.resources.cash,2015);
 const frozenGuidedPage=clone(guided);
 const planning=loadCurrentGame(storage);
 const settled=applySavedJourneyAction(planning,g=>settleRepair(g,{summary:true}),storage);
 assert.equal(settled.day,4);assert.equal(settled.resources.cash,2095);
 assert.equal(repairRecord(settled).phase,"settled");
 const familyBytes=storage.getItem(FAMILY_SAVES_KEY),legacyBytes=storage.getItem(GAME_SAVE_KEY);
 // Defence at the storage boundary also rejects an old page's autosave.
 const staleActionResult=advanceRepair(frozenGuidedPage);
 saveFamilyGame(staleActionResult,storage);
 assert.equal(storage.getItem(FAMILY_SAVES_KEY),familyBytes);
 assert.equal(storage.getItem(GAME_SAVE_KEY),legacyBytes);
 // The event boundary used by both actual interfaces discards stale intent.
 let acted=false;
 const recovered=applySavedJourneyAction(frozenGuidedPage,g=>{acted=true;return settleRepair(advanceRepair(g));},storage);
 assert.equal(acted,false);
 assert.deepEqual(recovered,settled);
 assert.deepEqual(loadCurrentGame(storage),settled);
 assert.deepEqual(loadFamilySaves(storage).haddad,otherFamily);
 assert.equal(loadCurrentGame(storage).activityLog.filter(e=>e.title==="One repair-counter day").length,1);
});
test("a same-day later step is protected by revision, not a day/cash heuristic", () => {
 const storage=memory(), active=applySavedJourneyAction(seed(storage),beginRepair,storage);
 const frozen=clone(active), checked=applySavedJourneyAction(active,advanceRepair,storage);
 assert.equal(checked.day,frozen.day);assert.equal(checked.resources.cash,frozen.resources.cash);
 assert.equal(repairRecord(checked).step,1);
 assert.deepEqual(applySavedJourneyAction(frozen,g=>settleRepair(g,{summary:true}),storage),checked);
 assert.equal(repairRecord(loadCurrentGame(storage)).phase,"active");
 const settled=applySavedJourneyAction(checked,settleRepair,storage);
 assert.equal(settled.day,4);assert.equal(settled.resources.cash,2095);
});
test("unstamped existing saves acquire a revision without resetting progress; a restored prior run cannot undo an explicit restart", () => {
 const storage=memory();const legacy={...createInitialGame("diop"),day:23,progress:48};
 delete legacy.saveRevision;
 storage.setItem(GAME_SAVE_KEY,JSON.stringify(legacy));
 const loaded=loadCurrentGame(storage);assert.equal(loaded.day,23);
 const updated=applySavedJourneyAction(loaded,g=>({...g,resources:{...g.resources,battery:g.resources.battery-1}}),storage);
 assert.equal(updated.day,23);assert.equal(updated.progress,48);assert.equal(updated.runId,legacy.runId);assert.equal(updated.saveRevision,1);
 const fresh=selectFamilyGame("diop",{storage,restart:true});
 assert.notEqual(fresh.runId,updated.runId);
 const bytes=storage.getItem(FAMILY_SAVES_KEY);
 assert.deepEqual(applySavedJourneyAction(updated,g=>({...g,day:24}),storage),fresh);
 saveFamilyGame(updated,storage);
 assert.equal(storage.getItem(FAMILY_SAVES_KEY),bytes);
});
