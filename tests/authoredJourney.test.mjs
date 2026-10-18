import { webpDimensions } from './webpDimensions.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { AUTHORED_STORIES, authoredStory } from '../src/authoredStories.js';
import { authoredGame, chooseAuthored, continueAuthored, backAuthored, storyCallbacks, storyHero } from '../src/authoredJourney.js';
import { authoredSaveKey, authoredArchiveKey, loadAuthoredArchive, loadAuthoredJourney, applyAuthoredAction, restartAuthoredJourney, validateAuthored } from '../src/authoredJourneyStore.js';
import { getEvent, chooseOption, continueJourney, getFamilyPreset } from '../src/game.js';
import { getJourneyGeography } from '../src/journeyGeography.js';
import { getJourneyHistory, getSceneHistory } from '../src/journeyHistory.js';
import { stat } from 'node:fs/promises';
const memory=()=>{const data=new Map();return {data,getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v))};};
for(const story of AUTHORED_STORIES){
 test(`${story.id}: each choice, callback variant, Back and map/source target works through both shared controller modes`,()=>{
  for(let side=0;side<3;side++){
   let game=authoredGame(story);const ids=new Set();
   for(const scene of story.scenes){
    assert.equal(game.eventId,scene.id);assert.equal(getFamilyPreset(game).id,story.id);assert.equal(getFamilyPreset(game).people.length,4);for(const p of getFamilyPreset(game).people){assert.equal(p.portraitViewBox,story.portraits[p.id].viewBox);const [x,y,w,h]=p.portraitViewBox.split(' ').map(Number);assert.ok(w>0&&h>0&&x>=0&&y>=0&&x+w<=p.portraitSheet.width&&y+h<=p.portraitSheet.height);}assert.equal(getEvent(game).choices.length,3);
    const map=getJourneyGeography(game);assert.deepEqual(map.current.coordinates,scene.coordinates);assert.equal(map.itinerary.length,game.day);
    for(const [x,y]of map.points){assert.ok(Number.isFinite(x)&&Number.isFinite(y));assert.ok(x>=0&&x<=600&&y>=0&&y<=500);}
    for(const id of getSceneHistory(game).sourceIds)assert.ok(story.sources[id]?.url.startsWith('https://'));
    const choice=scene.choices[side];assert.ok(!ids.has(choice.id));ids.add(choice.id);
    const old=game;game=chooseOption(game,choice.id);assert.equal(game.currentOutcome.copy,choice.consequence);assert.ok(game.planning.time>=0&&game.planning.energy>=0);assert.equal(game.status,'playing');
    assert.deepEqual(backAuthored(game).storyState,old.storyState);
    game=continueJourney(game);
   }
   assert.equal(game.phase,'ended');assert.equal(game.history.length,story.scenes.length);assert.ok(storyCallbacks(game).length>=2);assert.equal(game.losses.length,0);
   assert.ok(!('score'in game));assert.ok(!('score'in game.ending));assert.match(game.ending.copy,new RegExp(storyCallbacks(game)[0].replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
   assert.equal(getJourneyHistory(game).era,story.period);
  }
 });
 test(`${story.id}: durable resume, all phases, stale tabs, restart and archive preserve other households`,()=>{
  const storage=memory();storage.setItem('original-family-saves','sentinel');storage.setItem('undocumented-trail:review:cambodia-1979:v1','Cambodia sentinel');
  let game=loadAuthoredJourney(story.id,storage);assert.equal(storage.data.size,2);
  const stale=game;game=applyAuthoredAction(game,g=>chooseAuthored(g,story.scenes[0].choices[0].id),storage);
  assert.equal(game.saveRevision,1);assert.deepEqual(loadAuthoredJourney(story.id,storage),game);
  assert.deepEqual(applyAuthoredAction(stale,g=>chooseAuthored(g,story.scenes[0].choices[1].id),storage),game);
  while(game.phase!=='ended'){
   game=applyAuthoredAction(game,game.phase==='outcome'?continueAuthored:g=>chooseAuthored(g,story.scenes[g.storyState.index].choices[0].id),storage);
   assert.deepEqual(loadAuthoredJourney(story.id,storage),game);
  }
  assert.equal(loadAuthoredArchive(story.id,storage).length,1);const oldRun=game.runId;
  game=restartAuthoredJourney(story.id,storage);assert.notEqual(game.runId,oldRun);assert.equal(game.history.length,0);assert.equal(loadAuthoredArchive(story.id,storage).length,1);
  assert.equal(storage.getItem('original-family-saves'),'sentinel');assert.equal(storage.getItem('undocumented-trail:review:cambodia-1979:v1'),'Cambodia sentinel');
  const unknown='{"version":99}';storage.setItem(authoredSaveKey(story.id),unknown);let blocked=loadAuthoredJourney(story.id,storage);assert.equal(blocked.saveWritable,false);
  blocked=applyAuthoredAction(blocked,g=>chooseAuthored(g,story.scenes[0].choices[0].id),storage);assert.equal(blocked.phase,'outcome');assert.equal(storage.getItem(authoredSaveKey(story.id)),unknown);
  const forged={...game.storyState,flags:{forged:'approval'},version:2,storyId:story.id};assert.deepEqual(validateAuthored(story,forged).flags,{});
  assert.equal(validateAuthored(story,{...forged,history:[{sceneId:'other',choiceId:'other'}]}),null);
 });
 test(`${story.id}: original cover and every distinct scene hero are bundled within a bounded budget`,async()=>{
  let total=0;for(const id of ['cover',...story.scenes.map(s=>s.id)]){const size=(await stat('public'+storyHero(story,id))).size;assert.ok(size<350000);total+=size;}assert.ok(total<4000000);
 });
}

test('every authored combination preserves the same non-earned legal ending and namespace',()=>{
 for(const story of AUTHORED_STORIES){
  let leaves=0;
  function walk(game){
   if(game.phase==='ended'){leaves++;assert.equal(game.ending.type,`${story.id}-continuing-life`);assert.equal(game.losses.length,0);assert.ok(storyCallbacks(game).length>=2);return;}
   for(const c of story.scenes[game.storyState.index].choices){assert.ok(c.id.startsWith(story.id==='mariel-1980'?'mariel-':'bidong-'));walk(continueAuthored(chooseAuthored(game,c.id)));}
  }
  walk(authoredGame(story));assert.equal(leaves,3**story.scenes.length);
 }
});

test('blocked storage remains playable after a previously persisted run',()=>{
 for(const story of AUTHORED_STORIES){
  const storage=memory();let game=restartAuthoredJourney(story.id,storage);
  storage.getItem=()=>{throw Error('blocked');};storage.setItem=()=>{throw Error('blocked');};
  game=applyAuthoredAction(game,g=>chooseAuthored(g,story.scenes[0].choices[0].id),storage);assert.equal(game.phase,'outcome');
  game=applyAuthoredAction(game,continueAuthored,storage);assert.equal(game.storyState.index,1);assert.equal(game.saveWritable,false);
 }
});

test('asset provenance is complete and each authored location uses its own distinct illustration',async()=>{
 const {readFile}=await import('node:fs/promises');const {createHash}=await import('node:crypto');
 for(const story of AUTHORED_STORIES){
  const manifest=JSON.parse(await readFile(`public/assets/${story.id}/provenance.json`,'utf8'));assert.equal(manifest.assets.length,story.scenes.length+1);
  const digests=new Set();
  for(const asset of manifest.assets){assert.match(asset.dimensions,/^\d+x\d+$/);assert.match(asset.alt,/fictional/i);assert.equal(asset.focalPoint,'50% 45%');const bytes=await readFile('public'+asset.path);assert.equal(webpDimensions(bytes).join('x'),asset.dimensions);assert.equal(bytes.length,asset.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),asset.webpSHA256);assert.ok(!digests.has(asset.webpSHA256));digests.add(asset.webpSHA256);}
 }
});
