import {hasControls,legFor,leadOptions,paceOptions,supplyOptions,clamp} from './controls.js';
import {eventRules,eventChoice,eventCosts,nextEvent} from './events.js';
import {resourceEffects,usesResourceRules} from './resources.js';
// Deterministic authored choices, replayed from history. No random disease,
// mortality, legal-approval roll or overall score. Values are game abstractions.
export const initialResources = { cash: 3, supplies: 5, water: 4, stress: 2 };
export function createState(story, resourceRulesVersion=4) {
 return {version:3,resourceRulesVersion,storyId:story.id,sceneId:story.start,phase:'intro',flags:{},resources:{...initialResources},people:Object.fromEntries(['dara','vann','maly','sophea'].map(id=>[id,{health:80,trust:3,alive:true}])),elapsed:0,lastNote:'',history:[],...(resourceRulesVersion===4?{actionLog:[],pendingLeg:null,travelPlans:[],purchases:[],resupplyUsed:{}}:{})};
}
export const startState=s=>s.phase==='intro'?{...s,phase:'scene'}:s;
export function chooseState(story,state,id) {
 if(state.phase!=='scene')return state;
 const rawChoice=story.scenes.find(s=>s.id===state.sceneId)?.choices.find(c=>c.id===id);
 let choice=rawChoice&&eventChoice(state,rawChoice);
 if(!choice||Object.entries(choice.requires??{}).some(([key,value])=>(state.resources[key]??0)<value))return state;
 const leg=choice&&legFor(state,choice);
 if(leg){choice={...choice,time:0,travelDays:0,effects:{...choice.effects}};for(const k of ['supplies','water'])if(choice.effects[k]<0)delete choice.effects[k];}
 const resources={...state.resources},people=structuredClone(state.people);
 const condition=choice.when,applies=condition&&(state.resources[condition.resource]??0)<condition.below;
 const model=leg?{effects:{},notes:[],consumes:false}:resourceEffects(state,choice),travel=leg?{effects:{},notes:[]}:eventCosts(state,choice),effects={...choice.effects};
 for(const [key,value] of Object.entries(travel.effects))effects[key]=(effects[key]??0)+value;
 for(const [key,value] of Object.entries(model.effects))effects[key]=(effects[key]??0)+value;if(applies)for(const [key,value] of Object.entries(choice.conditionalEffects??{}))effects[key]=(effects[key]??0)+value;
 for(const [key,value] of Object.entries(effects)) {
  if(key==='health')for(const person of Object.values(people))person.health=Math.max(1,Math.min(100,person.health+value));
  else if(key==='cohesion')for(const person of Object.values(people))person.trust=Math.max(0,Math.min(5,person.trust+value));
  else if(Object.hasOwn(resources,key))resources[key]=Math.max(0,Math.min(20,resources[key]+value));
 }
 for(const [id,delta] of Object.entries(choice.peopleEffects??{})){const p=people[id];if(delta.health)p.health=Math.max(1,Math.min(100,p.health+delta.health));if(delta.condition)p.condition=delta.condition;}
 const notes=[...travel.notes,applies?choice.conditionalNote:'',...model.notes].filter(Boolean);
 if(usesResourceRules(state)&&model.consumes){
  for(const key of ['supplies','water'])if(resources[key]===0){
   for(const person of Object.values(people))person.health=Math.max(1,person.health-3);
   resources.stress=Math.min(20,resources.stress+1);
   notes.push(`The ${key==='supplies'?'food':'clean water'} store is empty: extra fatigue and stress carry forward. Care and relief remain available.`);
  }
 }
 const flags={...state.flags,...choice.flags};
 return {...state,phase:'consequence',resources,people,flags,lastNote:notes.join(' '),elapsed:state.elapsed+(choice.time??1),...(eventRules(state)?{travelDays:(state.travelDays??0)+(choice.travelDays??0)}:{}),history:[...state.history,{sceneId:state.sceneId,choiceId:id}],...(hasControls(state)?{pendingLeg:leg?{...leg,id:`${state.sceneId}:${state.history.length+1}`,complete:false}:null,actionLog:[...state.actionLog,{type:'choice',sceneId:state.sceneId,choiceId:id}]}:{})};
}
export function continueState(story,state) {
 if(state.phase!=='consequence'||hasControls(state)&&state.pendingLeg&&!state.pendingLeg.complete)return state;
 const scene=story.scenes.find(s=>s.id===state.sceneId),choice=scene.choices.find(c=>c.id===state.history.at(-1)?.choiceId);
 const next=nextEvent(story,state,choice);
 if(hasControls(state))state={...state,pendingLeg:null,actionLog:[...state.actionLog,{type:'continue',sceneId:state.sceneId}]};
 if(next==='M01'&&hasControls(state))return {...state,sceneId:next,phase:'scene',people:{...state.people,vann:{...state.people.vann,health:Math.max(1,state.people.vann.health-18),condition:'Leg injury · needs lighter tasks'}},resources:{...state.resources,stress:Math.min(20,state.resources.stress+3)}};
 if(next==='E06'&&eventRules(state))return {...state,sceneId:next,phase:'scene',people:{...state.people,maly:{...state.people.maly,health:Math.max(1,state.people.maly.health-12),condition:'Feverish · needs assessment'}}};
 return next?{...state,sceneId:next,phase:'scene'}:{...state,phase:'complete'};
}
// Replay helper for consequence reporting only; never a gameplay action.
export function stateBeforeLastChoice(story,state) {
 if(hasControls(state)){const i=state.actionLog.findLastIndex(a=>a.type==='choice');return i<0?state:replayControls(story,state.actionLog.slice(0,i));}
 if(state.phase==='intro')return state;
 if(!state.history.length)return createState(story,state.resourceRulesVersion??1);
 let restored=startState(createState(story,state.resourceRulesVersion??1));
 for(const h of state.history.slice(0,-1))restored=continueState(story,chooseState(story,restored,h.choiceId));
 return restored;
}
export function validateState(story,raw) {
 if(raw?.resourceRulesVersion===4)return validateControls(story,raw);
 if(!raw||raw.version!==3||raw.storyId!==story.id||!Array.isArray(raw.history)||raw.history.length>story.scenes.length)return null;
 const rules=raw.resourceRulesVersion??1;if(![1,2,3].includes(rules))return null;
 let state=startState(createState(story,rules));
 for(let i=0;i<raw.history.length;i++) {
  const h=raw.history[i];if(!h||state.sceneId!==h.sceneId)return null;
  const chosen=chooseState(story,state,h.choiceId);if(chosen===state)return null;state=chosen;
  if(i<raw.history.length-1)state=continueState(story,state);
 }
 if(raw.phase==='intro'&&!raw.history.length)state=createState(story,rules);
 else if(raw.phase==='scene'&&raw.history.length||raw.phase==='complete')state=continueState(story,state);
 return state.phase===raw.phase&&state.sceneId===raw.sceneId?state:null;
}

// Compatibility for old handlers: navigation never rewinds a committed choice.
export function backState(story,state) { return state; }


export function planState(story,state,strategyId,personId){
 if(!hasControls(state)||state.phase!=='consequence'||!state.pendingLeg||state.pendingLeg.complete)return state;
 const lead=leadOptions(state).find(x=>x.personId===personId&&!x.unavailable),pace=paceOptions(state).find(x=>x.id===strategyId);
 if(!lead||!pace)return state;
 const resources={...state.resources},people=structuredClone(state.people),strength=people[personId].trust>=4?2:1;
 const foodCost=Math.max(0,pace.days-(personId==='dara'?strength:0)),waterCost=Math.max(0,pace.days-(personId==='maly'?strength:0));
 resources.supplies=Math.max(0,resources.supplies-foodCost);resources.water=Math.max(0,resources.water-waterCost);
 resources.stress=clamp(resources.stress+(strategyId==='brisk'?2:strategyId==='careful'?-1:1)-(personId==='sophea'?strength:0),0,20);
 const shortage=(resources.supplies===0?1:0)+(resources.water===0?1:0);
 for(const p of Object.values(people))p.health=clamp(p.health+(strategyId==='brisk'?-4:strategyId==='careful'?2:-1)+(personId==='vann'?strength:0)-shortage*3,1,100);
 if(shortage)resources.stress=clamp(resources.stress+shortage,0,20);
 const detail=`${pace.days} travel days; food used ${Math.min(state.resources.supplies,foodCost)}, water used ${Math.min(state.resources.water,waterCost)}. ${lead.name} coordinates: ${lead.roleTitle}. ${shortage?'Empty stores add fatigue and strain.':''}`;
 const plan={id:strategyId,title:pace.title,days:pace.days,day:state.elapsed+pace.days,personId,personName:lead.name,roleTitle:lead.roleTitle,consequence:detail,legId:state.pendingLeg.id,effects:Object.fromEntries(Object.keys(resources).map(k=>[k,resources[k]-state.resources[k]])),peopleEffects:Object.fromEntries(Object.keys(people).map(id=>[id,{health:people[id].health-state.people[id].health}]))};
 return {...state,resources,people,elapsed:state.elapsed+pace.days,travelDays:(state.travelDays??0)+pace.days,pendingLeg:{...state.pendingLeg,complete:true,plan},travelPlans:[...state.travelPlans,plan],actionLog:[...state.actionLog,{type:'travel',sceneId:state.sceneId,legId:state.pendingLeg.id,strategyId,personId}],lastNote:`${state.lastNote} ${detail}`.trim()};
}
export function resupplyState(story,state,itemId){
 if(!hasControls(state))return state;
 const item=supplyOptions(state).find(x=>x.id===itemId&&!x.unavailable);if(!item)return state;
 const resources={...state.resources,cash:state.resources.cash-item.cost};
 for(const [key,value] of Object.entries(item.effects))resources[key]=Math.max(resources[key],Math.min(12,resources[key]+value));
 const receipt={sceneId:state.sceneId,itemId,title:item.title,cost:item.cost,amounts:Object.fromEntries(Object.keys(item.effects).map(k=>[k,resources[k]-state.resources[k]])),day:state.elapsed};
 return {...startState(state),resources,resupplyUsed:{...state.resupplyUsed,[`${state.sceneId}:${itemId}`]:true},purchases:[...state.purchases,receipt],actionLog:[...state.actionLog,{type:'resupply',sceneId:state.sceneId,itemId}]};
}
function replayControls(story,actions){
 let s=startState(createState(story,4));
 for(const a of actions){
  if(!a||a.sceneId!==s.sceneId)return null;
  const next=a.type==='choice'?chooseState(story,s,a.choiceId):a.type==='continue'?continueState(story,s):a.type==='travel'?planState(story,s,a.strategyId,a.personId):a.type==='resupply'?resupplyState(story,s,a.itemId):s;
  if(next===s||JSON.stringify(next.actionLog.at(-1))!==JSON.stringify(a))return null;s=next;
 }
 return s;
}
function validateControls(story,raw){
 if(raw.version!==3||raw.storyId!==story.id||!Array.isArray(raw.actionLog)||raw.actionLog.length>256||!Array.isArray(raw.history))return null;
 const s=raw.phase==='intro'&&raw.actionLog.length===0?createState(story,4):replayControls(story,raw.actionLog);
 return s&&s.sceneId===raw.sceneId&&s.phase===raw.phase&&JSON.stringify(s.history)===JSON.stringify(raw.history)?s:null;
}
