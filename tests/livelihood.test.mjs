import assert from "node:assert/strict";
import test from "node:test";
import { createInitialGame, chooseOption, continueJourney, getEvent, takeRoadsideJob, buySupply, respondToSocialFeed, useMedicine, isSavedGameValid, FAMILY_PRESETS, GAME_SAVE_KEY, planTravelLeg } from "../src/game.js";
import { FAMILY_SAVES_KEY, loadFamilySaves, saveFamilyGame } from "../src/saveStore.js";
import { REPAIR_ACTIVITY_ID, beginRepair, advanceRepair, settleRepair, repairRecord, repairUnavailable } from "../src/livelihoodActivity.js";
const atShop = (runId="case-a") => ({ ...createInitialGame("diop"), eventId:"diopDakar",runId });
const interactive = g => settleRepair(advanceRepair(beginRepair(g)));
const memory = () => { const data=new Map(); return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)}; };
test("one researched scene and an available adult skill bound the pilot; all other journeys and used slots are excluded", () => {
 for(const id of Object.keys(FAMILY_PRESETS)) assert.ok(repairUnavailable(createInitialGame(id)));
 assert.equal(repairUnavailable(atShop()),null);
 for(const change of [{cash:44},{supplies:0},{water:1}]) {const g=atShop();g.resources={...g.resources,...change};assert.equal(beginRepair(g),g);}
 for(const person of [{alive:false},{health:35}]) {const g=atShop();g.people.ibrahima={...g.people.ibrahima,...person};assert.equal(beginRepair(g),g);}
 const old=takeRoadsideJob(atShop(),"diopRepairBikes");assert.equal(beginRepair(old),old);
});
test("upfront costs and food allocation are paid once; both demand branches conserve stock and reconcile net cash", () => {
 const counts=new Set();
 for(let n=0;n<30;n++) {
  const g=atShop(`demand-${n}`), started=beginRepair(g), ended=settleRepair(advanceRepair(started)), a=repairRecord(ended), l=a.ledger;
  assert.equal(started.resources.cash,g.resources.cash-45);assert.equal(started.day,g.day);
  assert.equal(started.resources.supplies,g.resources.supplies-1);assert.equal(started.resources.water,g.resources.water-2);
  assert.equal(beginRepair(started),started);
  assert.equal(ended.resources.cash-g.resources.cash,l.revenue+l.refund-l.inventoryCost-l.operatingCost-l.feesAtSettlement-l.lossCost);
  assert.equal(ended.resources.cash-g.resources.cash,l.netCash);
  assert.equal(l.inventory.bought,l.inventory.sold+l.inventory.consumed+l.inventory.retained+l.inventory.returned+l.inventory.spoiled+l.inventory.lost);
  assert.equal(l.refund,l.inventory.returned*20);assert.equal(l.foodProduced,0);
  assert.equal(l.inventory.spoiled,0);assert.equal(l.inventory.lost,0);assert.equal(l.lossCost,0);assert.equal(l.feesAtSettlement,0);
  assert.equal(ended.resources.supplies,g.resources.supplies-1);assert.equal(ended.resources.water,g.resources.water-2);
  assert.equal(ended.day,g.day+1);assert.deepEqual(ended.people,g.people);
  assert.equal(ended.resources.stress,g.resources.stress);assert.equal(ended.resources.exposure,g.resources.exposure);
  counts.add(l.inventory.sold);
 }
 assert.deepEqual([...counts].sort(),[1,2]);
});
test("summary, interactive steps and interruption at every boundary produce identical settlement without rerolls or double payout", () => {
 const g=atShop(), expected=interactive(g);
 assert.deepEqual(settleRepair(beginRepair(g),{summary:true}),expected);
 let s=beginRepair(g);s=JSON.parse(JSON.stringify(s));assert.equal(advanceRepair(advanceRepair(s)).livelihoodActivities[REPAIR_ACTIVITY_ID].step,1);
 s=advanceRepair(s);s=JSON.parse(JSON.stringify(s));s=settleRepair(s);
 assert.deepEqual(s,expected);
 for(let i=0;i<20;i++){assert.equal(settleRepair(s),s);assert.equal(settleRepair(s,{summary:true}),s);assert.equal(beginRepair(s),s);assert.equal(advanceRepair(s),s);}
 assert.equal(s.activityLog.filter(e=>e.title==="One repair-counter day").length,1);
 assert.equal(s.completedRoadsideWork.diopDakar,REPAIR_ACTIVITY_ID);
});
test("committed inventory cannot be spent by another action or an old work handler while unfinished", () => {
 const s=beginRepair(atShop());
 for(const fn of [g=>chooseOption(g,"diopRepairShift"),g=>takeRoadsideJob(g,"diopUnloadIce"),g=>buySupply(g,"food"),g=>respondToSocialFeed(g,"verify"),g=>useMedicine(g,"ibrahima")]) assert.equal(fn(s),s);
 const complete=interactive(atShop());assert.equal(takeRoadsideJob(complete,"diopUnloadIce"),complete);
});
test("atomic family save resumes active and settled ledgers while preserving all other family slots", () => {
 const storage=memory();for(const id of Object.keys(FAMILY_PRESETS))saveFamilyGame(createInitialGame(id),storage);
 const before=loadFamilySaves(storage);let s=beginRepair(atShop());
 assert.ok(isSavedGameValid(s));saveFamilyGame(s,storage);
 assert.deepEqual(loadFamilySaves(storage).diop,s);
 assert.ok(storage.getItem(FAMILY_SAVES_KEY));assert.ok(storage.getItem(GAME_SAVE_KEY));
 s=settleRepair(loadFamilySaves(storage).diop,{summary:true});saveFamilyGame(s,storage);
 assert.deepEqual(loadFamilySaves(storage).diop,s);assert.deepEqual(settleRepair(loadFamilySaves(storage).diop),loadFamilySaves(storage).diop);
 for(const id of Object.keys(FAMILY_PRESETS).filter(id=>id!=="diop"))assert.deepEqual(loadFamilySaves(storage)[id],before[id]);
 const legacy=atShop();delete legacy.livelihoodActivities;assert.ok(isSavedGameValid(legacy));assert.equal(repairUnavailable(legacy),null);
});
test("time and accounting feed the next decision and later Saint-Louis narrative without a second reward", () => {
 const before=atShop(), s=interactive(before), committed=chooseOption(s,"diopRepairShift");
 assert.equal(committed.day,s.day);
 const next=continueJourney(planTravelLeg(committed,"steady","ibrahima"));
 assert.equal(next.day,s.day+6);assert.equal(next.eventId,"diopSaintLouis");
 assert.equal(committed.pendingNext,"diopSaintLouis");
 const atNext={...s,eventId:"diopSaintLouis"};
 const event=getEvent(atNext), original=getEvent({...before,eventId:"diopSaintLouis"});
 assert.equal(event.messages.length,original.messages.length+1);
 assert.match(event.messages.at(-1).body,/not another payment/);
 assert.equal(atNext.resources.cash,s.resources.cash);
 assert.equal(beginRepair(atNext),atNext);
 assert.equal(next.livelihoodActivities[REPAIR_ACTIVITY_ID].ledger.netCash,repairRecord(s).ledger.netCash);
});
