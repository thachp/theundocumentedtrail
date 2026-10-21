import test from 'node:test';
import assert from 'node:assert/strict';
import {STORY} from '../src/cambodiaExpanded/story.js';
import {createState,startState,chooseState,continueState,validateState} from '../src/cambodiaExpanded/state.js';
import {narrativeFor,characterThreads,carriedObjects,personalReflection,choiceReaction} from '../src/cambodiaExpanded/narrative.js';
import {cambodiaGame,cambodiaEvent,familyFor} from '../src/cambodiaExpanded/journey.js';

test('player scenes, dates, choices and biographies omit editorial notes while optional provenance remains',()=>{
 for(const scene of STORY.scenes) {
  const state={...startState(createState(STORY)),sceneId:scene.id};
  const game=cambodiaGame(state),event=cambodiaEvent(game);
  const visible=[event.time,event.region,...event.messages.flatMap(m=>[m.role,m.body]),...event.choices.flatMap(c=>[c.title,c.hint,c.outcome]),...familyFor(game).people.map(p=>p.story)].join(' ');
  assert.doesNotMatch(visible,/fictional|authored|invented|offscreen|previous scene|between chapters|planning turns|the account leaves/i,scene.id);
  assert.match(scene.context,/invented|fictional/);
 }
});

function route(decisions={},stop=null,rules=3) {
 let state=startState(createState(STORY,rules));
 while(state.phase!=='complete'&&state.sceneId!==stop) {
  const scene=STORY.scenes.find(s=>s.id===state.sceneId);
  const id=decisions[scene.id]??scene.choices.find(c=>!c.requires||Object.entries(c.requires).every(([k,v])=>state.resources[k]>=v)).id;
  state=continueState(STORY,chooseState(STORY,state,id));
 }
 return state;
}

test('every expanded scene has named fictional voices, four continuing threads, and no state mutation',()=>{
 for(const scene of STORY.scenes) {
  const state={...startState(createState(STORY)),sceneId:scene.id};
  const before=JSON.stringify(state),n=narrativeFor(STORY,state);
  assert.equal(n.voices.length,2);
  for(const voice of n.voices) {assert.ok(state.people[voice.personId]);assert.equal(voice.role,'Family conversation');assert.ok(voice.body.length>20);}
  assert.equal(characterThreads(state).length,4);assert.equal(n.objects.length,3);
  assert.equal(JSON.stringify(state),before);
 }
});

test('callbacks and object states follow committed choices, not hypothetical branches',()=>{
 const shared=route({E01:'notes',E02:'bundles',E03:'guard'},'E04');
 const rest=route({E01:'food',E02:'pause',E03:'guard'},'E04');
 assert.match(narrativeFor(STORY,shared).memory,/heavier bundle/);
 assert.equal(narrativeFor(STORY,rest).memory,null);
 assert.match(carriedObjects(shared)[0].text,/Confirmed names/);
 assert.doesNotMatch(carriedObjects(rest)[0].text,/Confirmed names/);
 const waiting=route({E01:'notes'},'E08');
 assert.match(narrativeFor(STORY,waiting).memory,/notes she protected/);
 const learning=route({E07:'learning',E10:'classes'},'E11');
 assert.match(narrativeFor(STORY,learning).memory,/learning hour/);
 assert.match(characterThreads(learning).find(t=>t.id==='sophea').summary,/hour/);
});

test('chapter arrivals follow real locations and optional letters stay in California',()=>{
 for(const [id,number] of [['E01',1],['E04',2],['E05',3],['E10',4],['P01',5]]) {
  const state=route({E11:'letter'},id),n=narrativeFor(STORY,state);
  assert.equal(state.sceneId,id);assert.equal(n.chapter.number,number);assert.equal(n.arrival,true);
 }
 const p2=route({E11:'letter'},'P02'),n=narrativeFor(STORY,p2);
 assert.equal(n.arrival,false);assert.match(n.chapter.text,/remains in California/);
});

test('personal endings recall distinct choices and presentation preserves all replay versions',()=>{
 const design=route({E01:'notes',E07:'repair',J01:'extra',E10:'classes',E11:'design'});
 const rest=route({E01:'food',E07:'learning',E10:'community',E11:'tomorrow'});
 assert.match(personalReflection(design).join(' '),/extra task cost her rest/);
 assert.match(personalReflection(rest).join(' '),/reciprocal community help/);
 assert.notDeepEqual(personalReflection(design),personalReflection(rest));
 assert.equal(choiceReaction(design).personId,'dara');
 assert.equal(choiceReaction(rest).personId,'maly');
 for(const rules of [1,2,3]) {
  const state=route({},null,rules),before=JSON.stringify(state);
  narrativeFor(STORY,state);characterThreads(state);personalReflection(state);
  assert.equal(JSON.stringify(state),before);
  assert.deepEqual(validateState(STORY,state),state);
 }
});
