import test from 'node:test';import assert from 'node:assert/strict';
import {STORY} from '../src/cambodiaExpanded/story.js';
import {createState,startState,chooseState,continueState,planState,resupplyState,validateState} from '../src/cambodiaExpanded/state.js';
import {leadOptions,paceOptions,supplyOptions} from '../src/cambodiaExpanded/controls.js';
import {cambodiaGame,requiresCambodiaPlan,planCambodiaLeg,resupplyCambodia} from '../src/cambodiaExpanded/journey.js';
import {restartCambodiaJourney,applyCambodiaJourneyAction,loadCambodiaJourney,CAMBODIA_EXPANDED_ARCHIVE_KEY} from '../src/cambodiaJourneyStore.js';
const start=()=>startState(createState(STORY));const choose=(s,id)=>chooseState(STORY,s,id);const next=s=>continueState(STORY,s);const plan=(s,id='steady',lead='sophea')=>planState(STORY,s,id,lead);
const check=s=>assert.deepEqual(validateState(STORY,JSON.parse(JSON.stringify(s))),s);
const leg=()=>choose(next(choose(start(),'food')),'bundles');
test('fresh rules require eligible coordinator and actual pace; pending legs survive refresh without charging',()=>{
 const s=leg();assert.equal(s.resourceRulesVersion,4);assert.equal(s.elapsed,1);assert.equal(s.travelDays,0);check(s);
 assert.equal(next(s),s);assert.equal(plan(s,'steady',null),s);assert.equal(plan(s,'bogus'),s);assert.ok(requiresCambodiaPlan(cambodiaGame(s)));
 const plans=paceOptions(s).map(p=>plan(s,p.id));assert.deepEqual(plans.map(p=>p.elapsed-s.elapsed),[1,2,3]);assert.deepEqual(plans.map(p=>p.travelDays),[1,2,3]);
 for(const p of plans){check(p);assert.equal(plan(p),p);assert.equal(p.travelPlans.length,1);assert.equal(p.travelPlans[0].day,p.elapsed);assert.equal(p.travelPlans[0].effects.water,p.resources.water-s.resources.water);assert.equal(p.travelPlans[0].peopleEffects.dara.health,p.people.dara.health-s.people.dara.health);assert.ok(!requiresCambodiaPlan(cambodiaGame(p)));assert.equal(cambodiaGame(p).history.at(-1).day,p.elapsed);}
 assert.ok(plans[0].resources.water>plans[2].resources.water);assert.ok(plans[0].people.dara.health<plans[2].people.dara.health);
 const dara=plan(s,'steady','dara'),maly=plan(s,'steady','maly');assert.ok(dara.resources.supplies>maly.resources.supplies);assert.ok(maly.resources.water>dara.resources.water);
});
test('resupply is bounded, affordable, capped, replayed, and cannot replace a story choice',()=>{
 let s=start();const base=s.resources.supplies;s=resupplyState(STORY,s,'food');assert.equal(s.resources.cash,2);assert.equal(s.resources.supplies,base+3);assert.equal(s.history.length,0);check(s);
 assert.equal(resupplyState(STORY,s,'food'),s);assert.equal(resupplyState(STORY,s,'battery'),s);
 const o=choose(s,'food');assert.equal(resupplyState(STORY,o,'water'),o);check(o);
 const full={...start(),sceneId:'E05',resources:{cash:0,supplies:15,water:0,stress:2}};const assisted=resupplyState(STORY,full,'relief');assert.equal(assisted.resources.supplies,15);assert.equal(assisted.resources.water,2);
 const log=[...s.actionLog,s.actionLog[0]];assert.equal(validateState(STORY,{...s,actionLog:log}),null);
 assert.equal(validateState(STORY,{...s,actionLog:[{type:'resupply',sceneId:'E01',itemId:'relief'}]}),null);
});
test('canonical store prevents duplicate charges, stale actions and action-log refunds; neighbor saves remain unchanged',()=>{
 const data=new Map([['other-family','untouched']]);const storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v))};
 let g=restartCambodiaJourney(storage),old=g;g=applyCambodiaJourneyAction(g,x=>resupplyCambodia(x,'food'),storage);const paid=g;
 assert.deepEqual(applyCambodiaJourneyAction(old,x=>resupplyCambodia(x,'food'),storage),paid);assert.deepEqual(applyCambodiaJourneyAction(g,x=>resupplyCambodia(x,'food'),storage),paid);assert.deepEqual(loadCambodiaJourney(storage).cambodiaState,paid.cambodiaState);assert.deepEqual(applyCambodiaJourneyAction(paid,{...old,saveRevision:paid.saveRevision},storage),paid);
 for(const id of ['food','bundles']){g=applyCambodiaJourneyAction(g,x=>cambodiaGame(chooseState(STORY,startState(x.cambodiaState),id),x),storage);if(id==='food')g=applyCambodiaJourneyAction(g,x=>cambodiaGame(next(x.cambodiaState),x),storage);}
 old=g;g=applyCambodiaJourneyAction(g,x=>planCambodiaLeg(x,'steady','sophea'),storage);const committed=g;assert.deepEqual(applyCambodiaJourneyAction(old,x=>planCambodiaLeg(x,'careful','maly'),storage),committed);assert.deepEqual(loadCambodiaJourney(storage).cambodiaState,committed.cambodiaState);assert.equal(data.get('other-family'),'untouched');
 let steps=0;while(g.phase!=='ended'){const state=g.cambodiaState;const action=g.phase==='outcome'?(requiresCambodiaPlan(g)?x=>planCambodiaLeg(x,'steady',x.controlModel.leads.find(p=>!p.unavailable).personId):x=>cambodiaGame(next(x.cambodiaState),x)):x=>{const c=STORY.scenes.find(s=>s.id===x.eventId).choices.find(c=>Object.entries(c.requires??{}).every(([k,v])=>x.resources[k]>=v));return cambodiaGame(chooseState(STORY,startState(x.cambodiaState),c.id),x);};g=applyCambodiaJourneyAction(g,action,storage);assert.ok(++steps<100);}
 const archived=JSON.parse(storage.getItem(CAMBODIA_EXPANDED_ARCHIVE_KEY))[0];assert.deepEqual(validateState(STORY,archived.state),g.cambodiaState);assert.ok(archived.state.purchases.length);assert.ok(archived.state.travelPlans.length);
});
test('rules 1–3 remain frozen and do not acquire controls or new mine events',()=>{
 for(const rules of [1,2,3]){let s=startState(createState(STORY,rules));for(const id of ['food','bundles','guard','group'])s=next(choose(s,id));assert.equal(s.sceneId,'E05');assert.equal('actionLog' in s,false);assert.equal(cambodiaGame(s).controlModel,null);check(s);}
});
test('many full rules-4 routes terminate with replayable plans, bounded resupply and persistent mine injury',()=>{
 const seen=new Set();for(let n=0;n<80;n++){let s=start(),count=0;
 while(s.phase!=='complete'){
  seen.add(s.sceneId);if(n%2===0){const item=supplyOptions(s).find(i=>!i.unavailable);if(item){s=resupplyState(STORY,s,item.id);check(s);}}
  const choices=STORY.scenes.find(x=>x.id===s.sceneId).choices.filter(c=>Object.entries(c.requires??{}).every(([k,v])=>s.resources[k]>=v));s=choose(s,choices[(n+count)%choices.length].id);check(s);
  if(s.pendingLeg&&!s.pendingLeg.complete){const lead=leadOptions(s).find(p=>!p.unavailable);assert.ok(lead,`eligible coordinator ${s.sceneId}`);s=plan(s,['brisk','steady','careful'][n%3],lead.personId);check(s);}
  s=next(s);check(s);assert.ok(++count<=STORY.scenes.length);
 }
 if(s.history.some(h=>h.sceneId==='M01')){assert.match(s.people.vann.condition,/Leg injury/);assert.ok(leadOptions(s).find(p=>p.personId==='vann').unavailable);}
 assert.ok(Object.values(s.people).every(p=>p.alive&&p.health>=1));}
 for(const id of ['M01','M02','T01'])assert.ok(seen.has(id),id);
});
