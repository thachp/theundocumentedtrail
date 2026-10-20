import test from 'node:test';
import assert from 'node:assert/strict';
import {STORY} from '../src/cambodiaExpanded/story.js';
import {createState,startState,chooseState,continueState,backState,validateState} from '../src/cambodiaExpanded/state.js';
import {cambodiaGame} from '../src/cambodiaExpanded/journey.js';
const opening=()=>startState(createState(STORY,2));
test('water and food use carry between road occasions; shortages have consequences; notes help without a battery',()=>{
 let state=continueState(STORY,chooseState(STORY,opening(),'notes'));
 const before=state.resources.water;
 state=chooseState(STORY,state,'pause');
 assert.equal(state.resources.water,before-1);
 assert.match(cambodiaGame(state).inventory.join(' '),/Paper contact notes/);
 assert.equal('battery' in cambodiaGame(state).resources,false);
 const empty={...continueState(STORY,state),resources:{cash:3,supplies:0,water:0,stress:2}};
 const result=chooseState(STORY,empty,'guard');
 assert.ok(result.people.dara.health<empty.people.dara.health);
 assert.match(result.lastNote,/water/);
 assert.equal(chooseState(STORY,result,'guard'),result);
});
test('legacy v3 saves replay their original resources, and Back preserves their rules',()=>{
 const raw={version:3,storyId:STORY.id,sceneId:'E02',phase:'consequence',history:[{sceneId:'E01',choiceId:'notes'},{sceneId:'E02',choiceId:'pause'}]};
 const old=validateState(STORY,raw);
 assert.equal(old.resourceRulesVersion,1);
 assert.deepEqual(old.resources,{cash:3,supplies:3,water:4,stress:1});
 assert.equal(backState(STORY,old).resourceRulesVersion,1);
 assert.deepEqual(validateState(STORY,old),old);
 assert.equal(validateState(STORY,{...old,resourceRulesVersion:99}),null);
});
test('saved occasion rules replay without undo without changing saved choice consequences',()=>{
 let state=opening();for(const id of ['food','pause','help','food','wait','water','relief','help','meal','relative','contact','classes','tomorrow']){
 const chosen=chooseState(STORY,state,id);assert.notEqual(chosen,state,`${state.sceneId}:${id}`);
 assert.deepEqual(validateState(STORY,chosen),chosen);assert.equal(backState(STORY,chosen),chosen);
 state=continueState(STORY,chosen);assert.deepEqual(validateState(STORY,state),state);
 }
 assert.equal(state.phase,'complete');assert.ok(state.people.dara.alive);
});

import {resourceContext,householdInventory} from '../src/cambodiaExpanded/resources.js';
test('paper records ease a later planning task; budgets change interpretation without inventing an exchange rate',()=>{
 const state={...opening(),sceneId:'E08',flags:{contact:'notes'}};
 const notes=chooseState(STORY,state,'records');
 const other=chooseState(STORY,{...state,flags:{}},'records');
 assert.equal(notes.resources.stress,other.resources.stress-1);
 assert.match(notes.lastNote,/not identity papers/);
 const poor=chooseState(STORY,{...state,resources:{...state.resources,cash:0}},'relative');
 assert.match(poor.lastNote,/shares writing materials/);
 assert.match(householdInventory(poor).join(' '),/Letter/);
 assert.equal(resourceContext({...state,sceneId:'E10'}).label,'Household budget units');
 assert.match(resourceContext({...state,sceneId:'E10'}).description,/no currency conversion/);
});

test('representative complete routes stay recoverable; relief restores water independently of wealth',()=>{
 for(let side=0;side<3;side++) {
  let state=opening();let steps=0;
  while(state.phase!=='complete') {
   const scene=STORY.scenes.find(s=>s.id===state.sceneId);
   const choices=scene.choices.filter(c=>!Object.entries(c.requires??{}).some(([k,v])=>state.resources[k]<v));
   const result=chooseState(STORY,state,choices[side%choices.length].id);
   assert.equal(chooseState(STORY,result,choices[side%choices.length].id),result);
   assert.deepEqual(validateState(STORY,result),result);
   state=continueState(STORY,result);assert.ok(++steps<20);
  }
  assert.ok(Object.values(state.people).every(p=>p.alive&&p.health>=40));
 }
 for(const choice of STORY.scenes.find(s=>s.id==='E05').choices) {
  const result=chooseState(STORY,{...opening(),sceneId:'E05',resources:{cash:0,supplies:0,water:0,stress:2}},choice.id);
  assert.ok(result.resources.water>0);assert.ok(result.resources.supplies>0);
 }
});

test('both actual views render period resources at departure, reception and California without modern inventory',async()=>{
 const {createServer}=await import('vite'),{default:React}=await import('react'),{renderToStaticMarkup}=await import('react-dom/server');
 const {CAMBODIA_SAVE_KEY}=await import('../src/cambodiaExpanded/journey.js');
 const server=await createServer({configFile:false,esbuild:{jsx:'automatic'},server:{middlewareMode:true,hmr:false},appType:'custom',optimizeDeps:{noDiscovery:true,include:[],entries:[]}});
 const data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v))};
 globalThis.window={localStorage:storage,location:{search:'?story=cambodia-1979&edition=3',href:'http://example.test/?story=cambodia-1979&edition=3'}};globalThis.localStorage=storage;
 try {
  const {App}=await server.ssrLoadModule('/src/App.jsx'),{BeginnerApp}=await server.ssrLoadModule('/src/BeginnerApp.jsx');
  let state=opening();
  while(state.phase!=='complete') {
   if(['E01','E05','E10'].includes(state.sceneId)) {
    storage.setItem(CAMBODIA_SAVE_KEY,JSON.stringify(state));
    for(const View of [App,BeginnerApp]) {
     const html=renderToStaticMarkup(React.createElement(View));
     assert.match(html,/Household resources/);assert.equal((html.match(/class="cinematic-status-item/g)??[]).length,8);assert.match(html,/Stress:/);assert.doesNotMatch(html,/Household notes|Carried information/);assert.doesNotMatch(html,/Back to the previous choice/);assert.match(html,/Why this setting matters/);
     assert.match(html,state.sceneId==='E10'?/Budget:/:/Exchange:/);
     assert.doesNotMatch(html,/Phone charge|% phone|Use medicine|Available cash|undefined|NaN/);
    }
   }
   state=continueState(STORY,chooseState(STORY,state,STORY.scenes.find(s=>s.id===state.sceneId).choices[0].id));
  }
 } finally {await server.close();delete globalThis.window;delete globalThis.localStorage;}
});

test('camp meals replenish essentials while repair earns exchange; arrival support does not erase earlier fatigue',()=>{
 const state={...opening(),sceneId:'E07',resources:{cash:1,supplies:2,water:1,stress:2}};
 const meal=chooseState(STORY,state,'meal'),repair=chooseState(STORY,state,'repair');
 assert.ok(meal.resources.supplies>state.resources.supplies);assert.ok(meal.resources.water>state.resources.water);
 assert.equal(meal.resources.cash,1);assert.equal(repair.resources.cash,2);
 assert.ok(repair.people.dara.health<meal.people.dara.health);
 const scene=STORY.scenes.find(s=>s.id==='E10');
 const settled=chooseState(STORY,{...state,sceneId:'E10',people:structuredClone(repair.people),resources:{...repair.resources,supplies:0,water:0}},scene.choices[0].id);
 assert.equal(settled.resources.supplies,2);assert.equal(settled.resources.water,2);assert.ok(settled.people.dara.health<100);
});
