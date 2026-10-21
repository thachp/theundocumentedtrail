import test from 'node:test';
import assert from 'node:assert/strict';
import { restartCambodiaJourney,loadCambodiaJourney,applyCambodiaJourneyAction } from '../src/cambodiaJourneyStore.js';
import { useMedicine,chooseOption,continueJourney } from '../src/game.js';
import { validateState,createState } from '../src/cambodiaExpanded/state.js';
import { CAMBODIA_SAVE_KEY } from '../src/cambodiaExpanded/journey.js';
import { STORY } from '../src/cambodiaExpanded/story.js';
const memory=()=>{const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v))};};

test('medicine is spent once, persists across refresh, caps health, and stale actions cannot refund it',()=>{
 const storage=memory();let game=restartCambodiaJourney(storage);const initial=game;
 assert.equal(game.resources.medicine,2);
 game=applyCambodiaJourneyAction(game,g=>useMedicine(g,'dara'),storage);
 assert.equal(game.people.dara.health,95);assert.equal(game.resources.medicine,1);assert.equal(game.resources.stress,0);
 assert.deepEqual(loadCambodiaJourney(storage).cambodiaState,game.cambodiaState);
 assert.equal(game.activityLog[0].title,'Medicine for Dara');
 assert.deepEqual(applyCambodiaJourneyAction(initial,g=>useMedicine(g,'vann'),storage),game);
 const forged={...game,cambodiaState:{...initial.cambodiaState,phase:'scene'}};
 assert.deepEqual(applyCambodiaJourneyAction(game,forged,storage),game);
 game=applyCambodiaJourneyAction(game,g=>useMedicine(g,'dara'),storage);
 assert.equal(game.people.dara.health,100);assert.equal(game.resources.medicine,0);
 assert.equal(useMedicine(game,'dara'),game);assert.equal(useMedicine(game,'vann'),game);
 assert.deepEqual(validateState(STORY,game.cambodiaState),game.cambodiaState);
});

test('rules-3 treatment between decisions and consequences replays; fever still happens and clinics replenish supplies',()=>{
 const storage=memory();
 storage.setItem(CAMBODIA_SAVE_KEY,JSON.stringify({...createState(STORY,3),runId:'existing-rules-3-medicine',saveRevision:1}));
 let game=loadCambodiaJourney(storage,3);
 const act=fn=>game=applyCambodiaJourneyAction(game,fn,storage);
 act(g=>chooseOption(g,'food'));
 act(g=>useMedicine(g,'vann'));
 act(continueJourney);
 for(const id of ['summary','care','water','relief']) {act(g=>chooseOption(g,id));act(continueJourney);}
 assert.equal(game.eventId,'E06');assert.match(game.people.maly.condition,/Feverish/);
 assert.equal(game.resources.medicine,2);
 act(g=>useMedicine(g,'maly'));
 assert.equal(game.resources.medicine,1);assert.match(game.people.maly.condition,/needs assessment/);
 act(g=>chooseOption(g,'clinic'));assert.equal(game.resources.medicine,2);
 act(continueJourney);
 assert.deepEqual(loadCambodiaJourney(storage).cambodiaState,game.cambodiaState);
 assert.deepEqual(validateState(STORY,game.cambodiaState),game.cambodiaState);
});

test('older expanded saves gain medicine without changing their prior health or resource-rule version',()=>{
 const old=createState(STORY,1);delete old.careHistory;
 const state=validateState(STORY,old);
 assert.deepEqual(state.people,old.people);assert.deepEqual(state.resources,old.resources);
 assert.equal(state.resourceRulesVersion,1);assert.deepEqual(state.careHistory,[]);
 assert.equal(validateState(STORY,{...state,careHistory:[{after:99,personId:'dara'}]}),null);
});
