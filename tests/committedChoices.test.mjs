import test from 'node:test';
import assert from 'node:assert/strict';
import {preservesCommittedChoices} from '../src/committedChoices.js';
import {getEvent,chooseOption,continueJourney,FAMILY_PRESETS} from '../src/game.js';
import * as expanded from '../src/cambodiaExpanded/journey.js';
import * as revised from '../src/cambodiaJourney.js';
import * as legacy from '../src/legacyHouseholds/cambodiaJourney.js';
import {loadCambodiaJourney,restartCambodiaJourney,applyCambodiaJourneyAction} from '../src/cambodiaJourneyStore.js';
import {AUTHORED_STORIES} from '../src/authoredStories.js';
import {authoredGame,backAuthored} from '../src/authoredJourney.js';
import {loadAuthoredJourney,restartAuthoredJourney,applyAuthoredAction} from '../src/authoredJourneyStore.js';
import {selectFamilyGame,applySavedJourneyAction,loadCurrentGame} from '../src/saveStore.js';
import {observeJourneyRestore} from '../src/useJourneyGame.js';
const memory=()=>{const data=new Map();return {data,getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v))};};

test('committed receipt prefix and progress may advance but cannot shrink, change choice or rewind phase',()=>{
 const before={phase:'consequence',history:[{sceneId:'E01',choiceId:'notes'}]};
 assert.equal(preservesCommittedChoices(before,{phase:'scene',history:[]}),false);
 assert.equal(preservesCommittedChoices(before,{...before,history:[{sceneId:'E01',choiceId:'food'}]}),false);
 assert.equal(preservesCommittedChoices(before,{...before,phase:'scene'}),true);
 assert.equal(preservesCommittedChoices({...before,phase:'scene'},before),false);
 assert.equal(preservesCommittedChoices({...before,phase:'complete'},before),false);
});
for(const [edition,api] of [[1,legacy],[2,revised],[3,expanded]])test(`Cambodia edition ${edition}: old undo handlers, stale pages and current-revision rewinds cannot refund a choice`,()=>{
 const storage=memory();let initial;
 if(edition===1){initial=api.newCambodiaGame();storage.setItem('undocumented-trail:review:cambodia-1979:v1',JSON.stringify({...initial.cambodiaState,runId:initial.runId,saveRevision:0}));initial=loadCambodiaJourney(storage,1);}else initial=restartCambodiaJourney(storage,edition);
 const choice=getEvent(initial).choices[0];
 const committed=applyCambodiaJourneyAction(initial,g=>chooseOption(g,choice.id),storage);
 const before=[...storage.data];
 assert.equal(api.backCambodiaJourney(committed),committed);
 assert.deepEqual(applyCambodiaJourneyAction(committed,api.backCambodiaJourney,storage).cambodiaState,committed.cambodiaState);
 assert.deepEqual(applyCambodiaJourneyAction(initial,g=>chooseOption(g,choice.id),storage).cambodiaState,committed.cambodiaState);
 assert.deepEqual(applyCambodiaJourneyAction(committed,g=>api.cambodiaGame(initial.cambodiaState,g),storage).cambodiaState,committed.cambodiaState);
 assert.deepEqual(loadCambodiaJourney(storage,edition).resources,committed.resources);
 assert.deepEqual([...storage.data],before);
 const advanced=applyCambodiaJourneyAction(committed,continueJourney,storage);
 assert.deepEqual(applyCambodiaJourneyAction(advanced,g=>api.cambodiaGame(committed.cambodiaState,g),storage).cambodiaState,advanced.cambodiaState);
 const fresh=restartCambodiaJourney(storage,edition);assert.notEqual(fresh.runId,committed.runId);assert.equal(fresh.history.length,0);
});
for(const story of AUTHORED_STORIES)test(`${story.id}: committed decisions survive replay, repeat clicks and forged earlier snapshots; explicit restart still works`,()=>{
 const storage=memory(),initial=restartAuthoredJourney(story.id,storage);
 const committed=applyAuthoredAction(initial,g=>chooseOption(g,getEvent(g).choices[0].id),storage);
 const bytes=[...storage.data];assert.equal(backAuthored(committed),committed);
 assert.deepEqual(applyAuthoredAction(committed,g=>authoredGame(story,initial.storyState,g),storage).storyState,committed.storyState);
 assert.deepEqual(applyAuthoredAction(initial,g=>chooseOption(g,getEvent(g).choices[1].id),storage).storyState,committed.storyState);
 assert.deepEqual(loadAuthoredJourney(story.id,storage).storyState,committed.storyState);assert.deepEqual([...storage.data],bytes);
 const fresh=restartAuthoredJourney(story.id,storage);assert.notEqual(fresh.runId,committed.runId);assert.equal(fresh.history.length,0);
});
const gameplay = g => ({runId:g.runId,phase:g.phase,resources:g.resources,history:g.history,saveRevision:g.saveRevision});
test('all six survival families retain committed choices and reject current-revision rewind snapshots',()=>{
 for(const id of Object.keys(FAMILY_PRESETS)){
  const storage=memory(),initial=selectFamilyGame(id,{storage});
  const committed=applySavedJourneyAction(initial,g=>chooseOption(g,getEvent(g).choices[0].id),storage);
  const bytes=[...storage.data];
  assert.deepEqual(gameplay(applySavedJourneyAction(committed,g=>({...initial,runId:g.runId,saveRevision:g.saveRevision}),storage)),gameplay(committed));
  assert.deepEqual(gameplay(applySavedJourneyAction(initial,g=>chooseOption(g,getEvent(g).choices[0].id),storage)),gameplay(committed));
  assert.deepEqual(gameplay(loadCurrentGame(storage)),gameplay(committed));assert.deepEqual([...storage.data],bytes);
 }
});
test('Back/Forward pageshow and popstate restore latest Cambodian state without writing or refunding it',()=>{
 const storage=memory(),initial=restartCambodiaJourney(storage);
 let screen=initial;const w=new EventTarget(),d=new EventTarget();d.visibilityState='visible';
 const dispose=observeJourneyRestore(()=>{screen=loadCambodiaJourney(storage);},w,d);
 const committed=applyCambodiaJourneyAction(initial,g=>chooseOption(g,'notes'),storage),bytes=[...storage.data];
 for(const type of ['pageshow','popstate','pageshow','popstate']){screen=initial;w.dispatchEvent(new Event(type));assert.deepEqual(screen.cambodiaState,committed.cambodiaState);assert.deepEqual(screen.resources,committed.resources);}
 assert.deepEqual([...storage.data],bytes);dispose();screen=initial;w.dispatchEvent(new Event('popstate'));assert.equal(screen,initial);
});

test('legacy reader direct saves reject history rewind and replacement; only explicit restart may reset',async()=>{
 for(const api of [await import('../src/cambodiaState.js'),await import('../src/legacyHouseholds/cambodiaState.js')]){
  const storage=memory(),initial=api.startCambodia(api.createCambodiaState());
  const choice=initial.sceneId==='C01'?'drawing':null;assert.ok(choice);
  const committed=api.chooseCambodia(initial,choice);assert.equal(api.saveCambodia(storage,committed),true);
  const bytes=[...storage.data];assert.equal(api.saveCambodia(storage,initial),false);assert.deepEqual([...storage.data],bytes);
  assert.equal(api.backCambodia(committed),committed);
  assert.equal(api.saveCambodia(storage,api.createCambodiaState(),{restart:true}),true);assert.equal(api.loadCambodia(storage).state.history.length,0);
  storage.setItem(api.CAMBODIA_SAVE_KEY,"unreadable");assert.equal(api.saveCambodia(storage,api.createCambodiaState(),{restart:true}),true);
 }
});
