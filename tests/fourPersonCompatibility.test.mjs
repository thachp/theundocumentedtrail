import test from 'node:test';
import assert from 'node:assert/strict';
import { LEGACY_AUTHORED_STORIES, authoredEdition, authoredStory } from '../src/authoredStories.js';
import { authoredGame, chooseAuthored, continueAuthored, authoredEvent, storyFamily } from '../src/authoredJourney.js';
import { authoredSaveKey, authoredArchiveKey, loadAuthoredArchive, loadAuthoredJourney, applyAuthoredAction, restartAuthoredJourney } from '../src/authoredJourneyStore.js';
import * as oldCambodia from '../src/legacyHouseholds/cambodiaJourney.js';
import * as oldState from '../src/legacyHouseholds/cambodiaState.js';
import { loadCambodiaJourney, applyCambodiaJourneyAction, restartCambodiaJourney, CAMBODIA_ARCHIVE_KEY, loadCambodiaArchive } from '../src/cambodiaJourneyStore.js';
import { chooseCambodiaJourney, continueCambodiaJourney } from '../src/cambodiaJourney.js';
const memory=()=>{const data=new Map([['unrelated-family','untouched'],['the-long-road-save-v14','legacy sentinel'],['the-undocumented-trail-family-saves-v1','original families sentinel'],['undocumented-trail:household:other-story:v2','other authored sentinel']]);return {data,getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v))};};
const authoredRecord=g=>JSON.stringify({...g.storyState,version:1,storyId:g.familyId,runId:'original-run',saveRevision:7});
const comparable=g=>({history:g.history,phase:g.phase,people:g.people,currentOutcome:g.currentOutcome,ending:g.ending,planning:g.planning,threads:g.storyThreads});
const finishAuthored=(g)=>{while(g.phase!=='ended')g=g.phase==='outcome'?continueAuthored(g):chooseAuthored(g,authoredStory(g).scenes[g.storyState.index].choices[0].id);return g;};
for(const story of LEGACY_AUTHORED_STORIES){
 test(`${story.id}: original decision/outcome/ending replay keeps three-person narrative and legacy art`,()=>{
  const initial=authoredGame(story);const outcome=chooseAuthored(initial,story.scenes[0].choices[1].id);const fixtures=[initial,outcome,continueAuthored(outcome),finishAuthored(initial)];
  for(const original of fixtures){
   const storage=memory(),raw=authoredRecord(original);storage.setItem(authoredSaveKey(story.id,1),raw);
   const resumed=loadAuthoredJourney(story.id,storage);
   assert.equal(resumed.householdEdition,1);assert.deepEqual(comparable(resumed),comparable(original));
   assert.equal(storyFamily(authoredStory(resumed)).people.length,3);
   assert.match(authoredEvent(resumed).heroImage,/\/legacy-households\//);
   assert.equal(authoredEvent(resumed).messages[0].body,story.scenes[original.storyState.index].prose);
   assert.equal(storage.getItem(authoredSaveKey(story.id,1)),raw);assert.equal(storage.getItem(authoredSaveKey(story.id,2)),null);
  }
 });
 test(`${story.id}: explicit revised restart preserves original run/archive; stale legacy tabs stay isolated`,()=>{
  const storage=memory();storage.setItem(authoredSaveKey(story.id,1),authoredRecord(authoredGame(story)));
  const oldArchive=JSON.stringify([{familyId:story.id,runId:'earlier',endingTitle:'Earlier ending',history:[]}]);storage.setItem(authoredArchiveKey(story.id,1),oldArchive);
  const old=loadAuthoredJourney(story.id,storage);const revised=restartAuthoredJourney(story.id,storage),v2raw=storage.getItem(authoredSaveKey(story.id,2));
  assert.equal(revised.householdEdition,2);assert.equal(Object.keys(revised.people).length,4);assert.equal(loadAuthoredJourney(story.id,storage).householdEdition,2);
  const advanced=applyAuthoredAction(old,g=>chooseAuthored(g,story.scenes[0].choices[0].id),storage);
  assert.equal(advanced.householdEdition,1);assert.equal(Object.keys(advanced.people).length,3);assert.equal(storage.getItem(authoredSaveKey(story.id,2)),v2raw);
  assert.deepEqual(applyAuthoredAction(old,g=>chooseAuthored(g,story.scenes[0].choices[1].id),storage),advanced);
  let g=revised;while(g.phase!=='ended')g=applyAuthoredAction(g,g.phase==='outcome'?continueAuthored:x=>chooseAuthored(x,authoredStory(x).scenes[x.storyState.index].choices[0].id),storage);
  assert.equal(storage.getItem(authoredArchiveKey(story.id,1)),oldArchive);assert.equal(loadAuthoredArchive(story.id,storage).filter(r=>r.householdEdition===2).length,1);
  assert.equal(storage.getItem('unrelated-family'),'untouched');assert.equal(storage.getItem('the-long-road-save-v14'),'legacy sentinel');
 });
 test(`${story.id}: malformed/future saves remain byte-for-byte intact and read-only in either edition`,()=>{
  for(const edition of [1,2])for(const raw of ['not JSON','{"version":99,"history":[]}']){
   const storage=memory();storage.setItem(authoredSaveKey(story.id,edition),raw);let game=loadAuthoredJourney(story.id,storage,edition);
   assert.equal(game.saveWritable,false);game=applyAuthoredAction(game,g=>chooseAuthored(g,authoredEdition(story.id,edition).scenes[0].choices[0].id),storage);
   assert.equal(game.phase,'outcome');assert.equal(storage.getItem(authoredSaveKey(story.id,edition)),raw);assert.equal(storage.getItem(authoredArchiveKey(story.id,edition)),null);
  }
 });
}
const oldCambodiaRecord=g=>JSON.stringify({...g.cambodiaState,runId:'original-cambodia',saveRevision:7});
test('Cambodia: original intro, decision, outcome and complete fixtures keep original text, progress and art',()=>{
 let state=oldState.createCambodiaState();const states=[state];state=oldState.startCambodia(state);states.push(state);
 // Generate original records solely from frozen scene choices/state reducers.
 for(let i=0;i<9;i++){const {CAMBODIA_SCENES}=oldStory;state=oldState.chooseCambodia(state,CAMBODIA_SCENES[i].choices[0].id);states.push(state);state=oldState.continueCambodia(state);states.push(state);}
 for(const state of states){const original=oldCambodia.cambodiaGame(state),storage=memory(),raw=oldCambodiaRecord(original);storage.setItem(oldState.CAMBODIA_SAVE_KEY,raw);const resumed=loadCambodiaJourney(storage);
  assert.equal(resumed.householdEdition,1);assert.deepEqual(comparable(resumed),comparable(original));assert.equal(Object.keys(resumed.people).length,3);assert.match(oldCambodia.cambodiaEvent(resumed).heroImage,/legacy-households/);assert.equal(storage.getItem(oldState.CAMBODIA_SAVE_KEY),raw);
 }
});
import * as oldStory from '../src/legacyHouseholds/cambodiaStory.js';
test('Cambodia: restart creates four-person v2 while legacy-tab advancement and stale-tab recovery remain v1',()=>{
 const storage=memory();storage.setItem(oldState.CAMBODIA_SAVE_KEY,oldCambodiaRecord(oldCambodia.cambodiaGame(oldState.startCambodia(oldState.createCambodiaState()))));
 const old=loadCambodiaJourney(storage),v1raw=storage.getItem(oldState.CAMBODIA_SAVE_KEY);const revised=restartCambodiaJourney(storage);
 assert.equal(revised.householdEdition,2);assert.equal(Object.keys(revised.people).length,4);assert.equal(storage.getItem(oldState.CAMBODIA_SAVE_KEY),v1raw);assert.equal(loadCambodiaJourney(storage).householdEdition,2);
 const revisedRaw=storage.getItem('undocumented-trail:review:cambodia-1979:v2');const advanced=applyCambodiaJourneyAction(old,g=>oldCambodia.chooseCambodiaJourney(g,'drawing'),storage);
 assert.equal(advanced.householdEdition,1);assert.equal(advanced.phase,'outcome');assert.equal(storage.getItem('undocumented-trail:review:cambodia-1979:v2'),revisedRaw);
 assert.deepEqual(applyCambodiaJourneyAction(old,g=>oldCambodia.chooseCambodiaJourney(g,'conversation'),storage),advanced);assert.equal(storage.getItem('unrelated-family'),'untouched');
});
test('Cambodia: invalid and future v1/v2 raw saves survive read-only choices',()=>{
 for(const edition of [1,2])for(const raw of ['invalid JSON','{"version":99}']){const storage=memory(),key=`undocumented-trail:review:cambodia-1979:v${edition}`;storage.setItem(key,raw);let g=loadCambodiaJourney(storage,edition);assert.equal(g.saveWritable,false);g=applyCambodiaJourneyAction(g,x=>edition===1?oldCambodia.chooseCambodiaJourney(x,'drawing'):chooseCambodiaJourney(x,'drawing'),storage);assert.equal(storage.getItem(key),raw);assert.equal(g.saveWritable,false);}
});

test('A corrupt revised slot never silently falls back to an older household run',()=>{
 for(const story of LEGACY_AUTHORED_STORIES){const storage=memory();storage.setItem(authoredSaveKey(story.id,1),authoredRecord(authoredGame(story)));storage.setItem(authoredSaveKey(story.id,2),'future revision');const g=loadAuthoredJourney(story.id,storage);assert.equal(g.householdEdition,2);assert.equal(g.saveWritable,false);assert.equal(storage.getItem(authoredSaveKey(story.id,2)),'future revision');assert.equal(loadAuthoredJourney(story.id,storage,1).householdEdition,1);}
 const storage=memory();storage.setItem(oldState.CAMBODIA_SAVE_KEY,oldCambodiaRecord(oldCambodia.cambodiaGame(oldState.createCambodiaState())));storage.setItem('undocumented-trail:review:cambodia-1979:v2','future revision');assert.equal(loadCambodiaJourney(storage).householdEdition,2);assert.equal(loadCambodiaJourney(storage).saveWritable,false);assert.equal(loadCambodiaJourney(storage,1).householdEdition,1);
});
test('An unreadable archive edition cannot hide a valid archive in the other edition',()=>{
 for(const story of LEGACY_AUTHORED_STORIES)for(const brokenEdition of [1,2]){
  const storage=memory(),goodEdition=3-brokenEdition;storage.setItem(authoredArchiveKey(story.id,brokenEdition),'invalid JSON');
  const good={familyId:story.id,runId:`good-${goodEdition}`,endingTitle:'Preserved valid ending'};storage.setItem(authoredArchiveKey(story.id,goodEdition),JSON.stringify([good]));
  assert.deepEqual(loadAuthoredArchive(story.id,storage),[{...good,householdEdition:goodEdition}]);
  assert.equal(storage.getItem(authoredArchiveKey(story.id,brokenEdition)),'invalid JSON');
 }
});

test('Cambodia: completed revised run archives once across resume/restart, retaining original completed save and other families',()=>{
 const storage=memory();let old=oldState.startCambodia(oldState.createCambodiaState());for(const scene of oldStory.CAMBODIA_SCENES)old=oldState.continueCambodia(oldState.chooseCambodia(old,scene.choices[0].id));
 const oldRaw=oldCambodiaRecord(oldCambodia.cambodiaGame(old));storage.setItem(oldState.CAMBODIA_SAVE_KEY,oldRaw);
 // Real neighboring journey namespace sentinels, including both archive editions.
 for(const id of ['mariel-1980','vietnam-bidong-1978'])for(const edition of [1,2]){storage.setItem(authoredSaveKey(id,edition),`${id} v${edition} save sentinel`);storage.setItem(authoredArchiveKey(id,edition),`${id} v${edition} archive sentinel`);}
 const untouched=new Map(storage.data);let game=restartCambodiaJourney(storage);
 while(game.phase!=='ended'){const scene=oldStory.CAMBODIA_SCENES[game.day-1];game=applyCambodiaJourneyAction(game,game.phase==='outcome'?continueCambodiaJourney:g=>chooseCambodiaJourney(g,scene.choices[0].id),storage);}
 assert.equal(loadCambodiaArchive(storage).length,1);assert.equal(loadCambodiaArchive(storage)[0].runId,game.runId);assert.deepEqual(loadCambodiaArchive(storage)[0].history,game.cambodiaState.history);
 const archiveRaw=storage.getItem(CAMBODIA_ARCHIVE_KEY);assert.equal(loadCambodiaJourney(storage).phase,'ended');restartCambodiaJourney(storage);restartCambodiaJourney(storage);assert.equal(storage.getItem(CAMBODIA_ARCHIVE_KEY),archiveRaw);
 for(const [key,value]of untouched)assert.equal(storage.getItem(key),value,key);assert.equal(storage.getItem(oldState.CAMBODIA_SAVE_KEY),oldRaw);
});

test('empty but existing save slots are unreadable data rather than a license to reset',()=>{
 for(const edition of [1,2]){
  for(const id of ['mariel-1980','vietnam-bidong-1978']){const storage=memory(),key=authoredSaveKey(id,edition);storage.setItem(key,'');const game=loadAuthoredJourney(id,storage,edition);assert.equal(game.saveWritable,false);applyAuthoredAction(game,g=>chooseAuthored(g,authoredStory(g).scenes[0].choices[0].id),storage);assert.equal(storage.getItem(key),'');}
  const storage=memory(),key=`undocumented-trail:review:cambodia-1979:v${edition}`;storage.setItem(key,'');const game=loadCambodiaJourney(storage,edition);assert.equal(game.saveWritable,false);applyCambodiaJourneyAction(game,g=>(edition===1?oldCambodia.chooseCambodiaJourney:chooseCambodiaJourney)(g,'drawing'),storage);assert.equal(storage.getItem(key),'');
 }
});


test('an original-edition URL without an original save cannot start a new three-person run',()=>{
 const storage=memory();for(const id of ['mariel-1980','vietnam-bidong-1978']){const game=loadAuthoredJourney(id,storage,1);assert.equal(game.householdEdition,2);assert.equal(Object.keys(game.people).length,4);assert.equal(storage.getItem(authoredSaveKey(id,1)),null);}
 const game=loadCambodiaJourney(storage,1);assert.equal(game.householdEdition,2);assert.equal(Object.keys(game.people).length,4);assert.equal(storage.getItem(oldState.CAMBODIA_SAVE_KEY),null);
});
