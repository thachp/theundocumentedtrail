import test from 'node:test';
import assert from 'node:assert/strict';
import {STORY} from '../src/cambodiaExpanded/story.js';
import {createState,startState,chooseState,continueState,validateState} from '../src/cambodiaExpanded/state.js';
import {cambodiaGame,cambodiaEvent} from '../src/cambodiaExpanded/journey.js';
const start=()=>startState(createState(STORY,3));
const advance=(s,id)=>continueState(STORY,chooseState(STORY,s,id));
function reach(ids){return ids.reduce(advance,start());}
test('new road decisions use real active days, daily supplies and individual effort',()=>{
 const s=advance(start(),'food'),a=chooseState(STORY,s,'pause'),b=chooseState(STORY,s,'bundles');
 assert.equal(a.elapsed-s.elapsed,2);assert.equal(a.travelDays,2);assert.equal(b.travelDays,1);
 assert.equal(a.resources.water,s.resources.water-2);assert.equal(a.people.maly.health,s.people.maly.health+5);
 const fast=advance(s,'summary');assert.equal(fast.sceneId,'E04');assert.equal(cambodiaGame(fast).history.at(-1).day,fast.elapsed);
 assert.equal(b.people.vann.health,s.people.vann.health-5);assert.equal(b.people.dara.health,s.people.dara.health);
 assert.equal(cambodiaEvent(cambodiaGame(s)).choices[0].days,2);
});
test('delays, care and shortages lead to distinct playable obstacles and replay without refunds',()=>{
 const border=reach(['food','bundles','guard']);
 assert.equal(advance(border,'wait').sceneId,'T01');assert.equal(advance(border,'care').sceneId,'E05');
 const camp=advance(border,'care'),fever=advance(camp,'questions');
 assert.match(fever.people.maly.condition,/Feverish/);
 const follow=advance(fever,'help');assert.equal(follow.sceneId,'H01');
 assert.equal(advance(follow,'accompany').sceneId,'E08');
 assert.equal(advance(follow,'rotate').sceneId,'E07');
 const neighbor=advance(follow,'neighbor');assert.equal(neighbor.sceneId,'E07');assert.ok(neighbor.resources.water>follow.resources.water);
 const low={...advance(fever,'clinic'),resources:{...fever.resources,supplies:0,water:0}};
 assert.equal(advance(low,'learning').sceneId,'F01');
 for(const s of [border,fever,follow,neighbor])assert.deepEqual(validateState(STORY,s),s);
 const committed=chooseState(STORY,follow,'rotate');assert.equal(chooseState(STORY,committed,'accompany'),committed);
});
test('many full new routes terminate, preserve legal premise, and produce different household endings',()=>{
 const ends=new Set(),visits=new Set();
 for(let n=0;n<160;n++){
  let s=start(),i=0;
  while(s.phase!=='complete'){
   visits.add(s.sceneId);const choices=STORY.scenes.find(x=>x.id===s.sceneId).choices.filter(c=>Object.entries(c.requires??{}).every(([k,v])=>s.resources[k]>=v));
   const c=choices[(n+i*7+Math.floor(n/3**(i%4)))%choices.length];
   s=advance(s,c.id);assert.deepEqual(validateState(STORY,s),s);assert.ok(++i<=STORY.scenes.length);
  }
  ends.add(cambodiaGame(s).ending.title);assert.ok(Object.values(s.people).every(p=>p.alive));
 }
 assert.ok(ends.size>=2);for(const id of ['T01','H01','F01'])assert.ok(visits.has(id),id);
});
