import test from 'node:test';
import assert from 'node:assert/strict';
import { AUTHORED_STORIES } from '../src/authoredStories.js';
import { authoredGame, chooseAuthored, continueAuthored } from '../src/authoredJourney.js';
import { loadAuthoredJourney, applyAuthoredAction, restartAuthoredJourney, authoredSaveKey, loadAuthoredArchive } from '../src/authoredJourneyStore.js';
import { getJourneyChoices } from '../src/journeyChoices.js';

test('both registered households share adapters while retaining independent saves, restart and archives',()=>{
 assert.deepEqual(AUTHORED_STORIES.map(s=>s.id),['mariel-1980','vietnam-bidong-1978']);
 assert.equal(getJourneyChoices().length,7);
 const data=new Map([['legacy-family','preserved'],['undocumented-trail:review:cambodia-1979:v1','preserved-cambodia']]);
 const storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v))};
 for(const story of AUTHORED_STORIES){
  let game=loadAuthoredJourney(story.id,storage);
  game=applyAuthoredAction(game,g=>chooseAuthored(g,story.scenes[0].choices[1].id),storage);
  game=applyAuthoredAction(game,continueAuthored,storage);
  assert.equal(game.storyState.index,1);
 }
 const [a,b]=AUTHORED_STORIES, savedB=data.get(authoredSaveKey(b.id));
 let game=loadAuthoredJourney(a.id,storage);
 while(game.phase!=='ended')game=applyAuthoredAction(game,game.phase==='outcome'?continueAuthored:g=>chooseAuthored(g,a.scenes[g.storyState.index].choices[0].id),storage);
 assert.equal(loadAuthoredArchive(a.id,storage).length,1);
 restartAuthoredJourney(a.id,storage);
 assert.equal(loadAuthoredArchive(a.id,storage).length,1);
 assert.equal(data.get(authoredSaveKey(b.id)),savedB);
 assert.equal(loadAuthoredJourney(b.id,storage).storyState.index,1);
 assert.equal(data.get('legacy-family'),'preserved');assert.equal(data.get('undocumented-trail:review:cambodia-1979:v1'),'preserved-cambodia');
});
