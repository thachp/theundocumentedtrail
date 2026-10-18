// Deterministic authored choices, replayed from history. No random disease,
// mortality, legal-approval roll or overall score. Values are game abstractions.
export const initialResources = { cash: 3, supplies: 5, water: 4, stress: 2 };
export function createState(story) {
 return {version:3,storyId:story.id,sceneId:story.start,phase:'intro',flags:{},resources:{...initialResources},people:Object.fromEntries(['dara','vann','maly','sophea'].map(id=>[id,{health:80,trust:3,alive:true}])),elapsed:0,lastNote:'',history:[]};
}
export const startState=s=>s.phase==='intro'?{...s,phase:'scene'}:s;
export function chooseState(story,state,id) {
 if(state.phase!=='scene')return state;
 const choice=story.scenes.find(s=>s.id===state.sceneId)?.choices.find(c=>c.id===id);
 if(!choice||Object.entries(choice.requires??{}).some(([key,value])=>(state.resources[key]??0)<value))return state;
 const resources={...state.resources},people=structuredClone(state.people);
 const condition=choice.when,applies=condition&&(state.resources[condition.resource]??0)<condition.below;
 const effects={...choice.effects};if(applies)for(const [key,value] of Object.entries(choice.conditionalEffects??{}))effects[key]=(effects[key]??0)+value;
 for(const [key,value] of Object.entries(effects)) {
  if(key==='health')for(const person of Object.values(people))person.health=Math.max(1,Math.min(100,person.health+value));
  else if(key==='cohesion')for(const person of Object.values(people))person.trust=Math.max(0,Math.min(5,person.trust+value));
  else if(Object.hasOwn(resources,key))resources[key]=Math.max(0,Math.min(20,resources[key]+value));
 }
 const flags={...state.flags,...choice.flags};
 return {...state,phase:'consequence',resources,people,flags,lastNote:applies?choice.conditionalNote:'',elapsed:state.elapsed+(choice.time??1),history:[...state.history,{sceneId:state.sceneId,choiceId:id}]};
}
export function continueState(story,state) {
 if(state.phase!=='consequence')return state;
 const scene=story.scenes.find(s=>s.id===state.sceneId),choice=scene.choices.find(c=>c.id===state.history.at(-1)?.choiceId);
 const next=choice.next===undefined?scene.next:choice.next;
 return next?{...state,sceneId:next,phase:'scene'}:{...state,phase:'complete'};
}
export function backState(story,state) {
 if(state.phase==='intro')return state;
 if(!state.history.length)return createState(story);
 let restored=startState(createState(story));
 for(const h of state.history.slice(0,-1))restored=continueState(story,chooseState(story,restored,h.choiceId));
 return restored;
}
export function validateState(story,raw) {
 if(!raw||raw.version!==3||raw.storyId!==story.id||!Array.isArray(raw.history)||raw.history.length>story.scenes.length)return null;
 let state=startState(createState(story));
 for(let i=0;i<raw.history.length;i++) {
  const h=raw.history[i];if(!h||state.sceneId!==h.sceneId)return null;
  const chosen=chooseState(story,state,h.choiceId);if(chosen===state)return null;state=chosen;
  if(i<raw.history.length-1)state=continueState(story,state);
 }
 if(raw.phase==='intro'&&!raw.history.length)state=createState(story);
 else if(raw.phase==='scene'&&raw.history.length||raw.phase==='complete')state=continueState(story,state);
 return state.phase===raw.phase&&state.sceneId===raw.sceneId?state:null;
}
