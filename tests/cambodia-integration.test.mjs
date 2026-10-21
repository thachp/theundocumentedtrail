import test from 'node:test';
import assert from 'node:assert/strict';
import { STORY } from '../src/cambodiaExpanded/story.js';
import { createState,startState,chooseState,continueState,planState,resupplyState,validateState } from '../src/cambodiaExpanded/state.js';
import { treatTraveler,medicineRemaining } from '../src/cambodiaExpanded/medicine.js';
import { leadOptions } from '../src/cambodiaExpanded/controls.js';
import { CAMBODIA_SAVE_KEY,cambodiaGame,requiresCambodiaPlan,planCambodiaLeg,resupplyCambodia } from '../src/cambodiaExpanded/journey.js';
import { restartCambodiaJourney,loadCambodiaJourney,applyCambodiaJourneyAction,CAMBODIA_EXPANDED_ARCHIVE_KEY } from '../src/cambodiaJourneyStore.js';
import { useMedicine,chooseOption,continueJourney } from '../src/game.js';

const memory=()=>{const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v))};};
const choose=(state,id)=>chooseState(STORY,startState(state),id);
const advance=state=>continueState(STORY,state);
const plan=(state,pace='steady',person='sophea')=>planState(STORY,state,pace,person);
const roundTrip=state=>assert.deepEqual(validateState(STORY,JSON.parse(JSON.stringify(state))),state);
const pending=()=>choose(advance(choose(createState(STORY),'food')),'bundles');

test('v4 care and resupply before a decision remain canonical and keep chronological activity',()=>{
 let state=treatTraveler(createState(STORY),'dara');
 state=resupplyState(STORY,state,'food');
 state=treatTraveler(state,'vann');
 assert.deepEqual(state.actionLog.map(a=>a.type),['care','resupply','care']);
 assert.equal(medicineRemaining(state),0);
 assert.equal(treatTraveler(state,'maly'),state);
 assert.equal(state.resources.cash,2);
 assert.equal(state.people.dara.health,95);
 assert.equal(state.people.vann.health,95);
 assert.deepEqual(cambodiaGame(state).activityLog.map(a=>a.kind),['care','supplies','care']);
 roundTrip(state);
 state=plan(choose(advance(choose(state,'food')),'bundles'));
 assert.deepEqual(cambodiaGame(state).activityLog.map(a=>a.kind),['care','supplies','care','travel']);
 assert.equal(new Set(cambodiaGame(state).activityLog.map(a=>a.id)).size,4);
 roundTrip(state);
});

test('v4 care before and after a pending travel commitment replays in order without changing its receipt',()=>{
 let state=pending();
 const pendingDay=state.elapsed;
 state=treatTraveler(state,'maly');
 assert.equal(state.careHistory.at(-1).phase,'consequence');
 assert.equal(state.careHistory.at(-1).day,pendingDay);
 assert.equal(state.pendingLeg.complete,false);
 assert.equal(advance(state),state);
 roundTrip(state);
 state=plan(state,'careful','maly');
 const committedPlan=structuredClone(state.travelPlans[0]);
 const committedDay=state.elapsed;
 state=treatTraveler(state,'vann');
 assert.equal(state.careHistory.at(-1).day,committedDay);
 assert.deepEqual(state.travelPlans[0],committedPlan);
 assert.equal(state.pendingLeg.complete,true);
 assert.equal(medicineRemaining(state),0);
 assert.equal(plan(state,'brisk','dara'),state);
 assert.deepEqual(cambodiaGame(state).activityLog.map(a=>a.kind),['care','travel','care']);
 roundTrip(state);
 roundTrip(advance(state));

 const careFirst=plan(treatTraveler(pending(),'dara'),'brisk','dara');
 const travelFirst=treatTraveler(plan(pending(),'brisk','dara'),'dara');
 roundTrip(careFirst);roundTrip(travelFirst);
 assert.equal(careFirst.careHistory[0].day,pendingDay);
 assert.equal(travelFirst.careHistory[0].day,travelFirst.elapsed);
 assert.deepEqual(cambodiaGame(careFirst).activityLog.map(a=>a.kind),['care','travel']);
 assert.deepEqual(cambodiaGame(travelFirst).activityLog.map(a=>a.kind),['travel','care']);
});

test('v4 store rejects stale care, purchases and plans and canonicalizes forged adapter and state fields',()=>{
 const storage=memory();let game=restartCambodiaJourney(storage);
 const act=fn=>game=applyCambodiaJourneyAction(game,fn,storage);
 const initial=game;
 act(g=>resupplyCambodia(g,'food'));
 const paid=game;
 act(g=>useMedicine(g,'dara'));
 const treated=game;
 assert.deepEqual(applyCambodiaJourneyAction(initial,g=>useMedicine(g,'vann'),storage),treated);
 assert.deepEqual(applyCambodiaJourneyAction(paid,g=>resupplyCambodia(g,'water'),storage),treated);
 const bytes=storage.getItem(CAMBODIA_SAVE_KEY);
 assert.deepEqual(applyCambodiaJourneyAction(game,{...initial,saveRevision:game.saveRevision},storage),game);
 assert.equal(storage.getItem(CAMBODIA_SAVE_KEY),bytes);
 const forged=structuredClone(game);
 forged.resources={cash:999,supplies:999,water:999,medicine:999,stress:0,exposure:0};
 forged.people.dara.health=100;
 forged.cambodiaState.resources={cash:999,supplies:999,water:999,stress:0};
 forged.cambodiaState.people.vann.health=100;
 forged.cambodiaState.purchases=[];
 forged.cambodiaState.resupplyUsed={};
 assert.deepEqual(applyCambodiaJourneyAction(game,forged,storage),game);
 assert.equal(storage.getItem(CAMBODIA_SAVE_KEY),bytes);
 act(g=>chooseOption(g,'food'));act(continueJourney);act(g=>chooseOption(g,'bundles'));
 const awaiting=game;
 const bypass=structuredClone(game);bypass.cambodiaState.pendingLeg.complete=true;
 assert.deepEqual(applyCambodiaJourneyAction(game,bypass,storage),game);
 act(g=>planCambodiaLeg(g,'steady','sophea'));
 const committed=game;
 assert.deepEqual(applyCambodiaJourneyAction(awaiting,g=>planCambodiaLeg(g,'brisk','dara'),storage),committed);
 assert.deepEqual(applyCambodiaJourneyAction(game,{...awaiting,saveRevision:game.saveRevision},storage),committed);
 act(g=>planCambodiaLeg(g,'careful','maly'));
 assert.deepEqual(game,committed);
 assert.deepEqual(loadCambodiaJourney(storage,3).cambodiaState,committed.cambodiaState);
});

test('same-run rule upgrades and downgrades cannot discard committed care or supply costs',()=>{
 for(const rules of [1,2,3,4]){
  const storage=memory();
  storage.setItem(CAMBODIA_SAVE_KEY,JSON.stringify({...createState(STORY,rules),runId:`rules-${rules}`,saveRevision:1}));
  let game=loadCambodiaJourney(storage,3);
  if(rules===4)game=applyCambodiaJourneyAction(game,g=>resupplyCambodia(g,'food'),storage);
  game=applyCambodiaJourneyAction(game,g=>useMedicine(g,'dara'),storage);
  const before=storage.getItem(CAMBODIA_SAVE_KEY);
  for(const replacement of [1,2,3,4].filter(version=>version!==rules)){
   const replacementState=treatTraveler(startState(createState(STORY,replacement)),'dara');
   const forged=cambodiaGame(replacementState,game);
   assert.deepEqual(applyCambodiaJourneyAction(game,forged,storage),game,`${rules} to ${replacement}`);
   assert.equal(storage.getItem(CAMBODIA_SAVE_KEY),before);
  }
 }
});

test('v4 care receipts must agree with canonical actions and cannot be removed, moved or duplicated',()=>{
 let state=treatTraveler(pending(),'maly');
 state=plan(state);
 roundTrip(state);
 const removed=structuredClone(state);removed.careHistory=[];
 assert.equal(validateState(STORY,removed),null);
 const moved=structuredClone(state);moved.careHistory[0].day++;
 assert.equal(validateState(STORY,moved),null);
 const noAction=structuredClone(state);noAction.actionLog=noAction.actionLog.filter(a=>a.type!=='care');
 assert.equal(validateState(STORY,noAction),null);
 const extraAction=structuredClone(state);extraAction.actionLog.push({type:'care',sceneId:state.sceneId,personId:'maly'});
 assert.equal(validateState(STORY,extraAction),null);
});

test('unavailable storage preserves in-memory care and purchase receipts when rejecting malformed actions',()=>{
 const storage={getItem(){throw Error('Storage unavailable');},setItem(){throw Error('Storage unavailable');}};
 let game=loadCambodiaJourney(storage,3);
 game=applyCambodiaJourneyAction(game,g=>resupplyCambodia(g,'food'),storage);
 game=applyCambodiaJourneyAction(game,g=>useMedicine(g,'dara'),storage);
 assert.equal(game.saveWritable,false);
 assert.equal(game.resources.cash,2);assert.equal(game.resources.medicine,1);
 const removedCare=structuredClone(game);removedCare.cambodiaState.careHistory=[];
 assert.deepEqual(applyCambodiaJourneyAction(game,removedCare,storage),game);
 assert.deepEqual(applyCambodiaJourneyAction(game,{...game,householdEdition:2},storage),game);
 const removedActions=cambodiaGame(startState(createState(STORY)),game);
 assert.deepEqual(applyCambodiaJourneyAction(game,removedActions,storage),game);
 roundTrip(game.cambodiaState);
});

test('treated mine injury stays ineligible for coordination and eligible relatives can complete the onward leg',()=>{
 let state=advance(choose(createState(STORY),'food'));
 state=advance(plan(choose(state,'summary'),'careful','sophea'));
 state=advance(plan(choose(state,'group'),'careful','maly'));
 assert.equal(state.sceneId,'M01');
 const injuredHealth=state.people.vann.health;
 state=treatTraveler(state,'vann');
 assert.ok(state.people.vann.health>injuredHealth);
 assert.match(state.people.vann.condition,/Leg injury/);
 assert.match(leadOptions(state).find(p=>p.personId==='vann').unavailable,/lighter tasks/);
 roundTrip(state);
 state=advance(choose(state,STORY.scenes.find(s=>s.id==='M01').choices[0].id));
 assert.equal(state.sceneId,'M02');
 state=choose(state,'care');
 assert.equal(plan(state,'steady','vann'),state);
 const eligible=leadOptions(state).find(p=>!p.unavailable);
 assert.ok(eligible);
 state=plan(state,'careful',eligible.personId);
 assert.equal(state.pendingLeg.complete,true);
 assert.match(state.people.vann.condition,/Leg injury/);
 roundTrip(state);
});

test('v4 completed archive preserves chronological care, purchases and plans without changing older archives',()=>{
 const storage=memory();
 const legacy={runId:'older-archived-run',history:[{sceneId:'legacy',choiceId:'retained'}],careHistory:[]};
 storage.setItem(CAMBODIA_EXPANDED_ARCHIVE_KEY,JSON.stringify([legacy]));
 let game=restartCambodiaJourney(storage);
 const act=fn=>game=applyCambodiaJourneyAction(game,fn,storage);
 act(g=>resupplyCambodia(g,'food'));
 act(g=>useMedicine(g,'dara'));
 let steps=0;
 while(game.phase!=='ended'){
  const before=game.cambodiaState;
  if(game.phase==='outcome'){
   if(requiresCambodiaPlan(game))act(g=>planCambodiaLeg(g,'steady',g.controlModel.leads.find(p=>!p.unavailable).personId));
   else act(continueJourney);
  }else{
   if(game.resources.medicine>0){const person=Object.entries(game.people).find(([,p])=>p.health<90)?.[0];if(person)act(g=>useMedicine(g,person));}
   const option=STORY.scenes.find(s=>s.id===game.eventId).choices.find(c=>Object.entries(c.requires??{}).every(([key,value])=>game.cambodiaState.resources[key]>=value));
   act(g=>chooseOption(g,option.id));
  }
  assert.notDeepEqual(game.cambodiaState,before);
  roundTrip(game.cambodiaState);
  assert.ok(++steps<100);
 }
 const rows=JSON.parse(storage.getItem(CAMBODIA_EXPANDED_ARCHIVE_KEY));
 assert.deepEqual(rows[0],legacy);assert.equal(rows.length,2);
 const archived=rows[1];
 assert.deepEqual(archived.state,game.cambodiaState);
 assert.deepEqual(archived.careHistory,game.cambodiaState.careHistory);
 assert.ok(archived.careHistory.length>1);
 assert.ok(archived.state.purchases.length>0);
 assert.ok(archived.state.travelPlans.length>0);
 assert.deepEqual(validateState(STORY,archived.state),game.cambodiaState);
 assert.deepEqual(loadCambodiaJourney(storage,3).activityLog,game.activityLog);
 restartCambodiaJourney(storage);
 assert.deepEqual(JSON.parse(storage.getItem(CAMBODIA_EXPANDED_ARCHIVE_KEY)),rows);
});
