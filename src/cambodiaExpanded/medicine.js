// Abstract game supplies and treatment, never a drug, dose or medical claim.
export function medicineRemaining(state) {
 let supplied=2;
 for(const h of state.history) {
  if(h.sceneId==='E05'||h.sceneId==='E10')supplied++;
  if(h.sceneId==='E06'&&['clinic','turns'].includes(h.choiceId))supplied++;
  if(h.sceneId==='H01')supplied++;
 }
 return Math.max(0,supplied-(state.careHistory?.length??0));
}

export function treatTraveler(state, personId) {
 if(!['intro','scene','consequence'].includes(state.phase))return state;
 const person=state.people[personId];
 if(!person||person.alive===false||person.health>=100||medicineRemaining(state)<1)return state;
 const phase=state.phase==='intro'?'scene':state.phase;
 const receipt={after:state.history.length,phase,sceneId:state.sceneId,personId,day:state.elapsed};
 return {...state,phase,resources:{...state.resources,stress:Math.max(0,state.resources.stress-2)},people:{...state.people,[personId]:{...person,health:Math.min(100,person.health+15)}},careHistory:[...(state.careHistory??[]),receipt],...(state.resourceRulesVersion===4?{actionLog:[...state.actionLog,{type:'care',sceneId:state.sceneId,personId}]}:{})};
}

export function preservesMedicineUse(before, after) {
 const previous=before.careHistory??[],next=after.careHistory??[];
 return next.length>=previous.length&&previous.every((receipt,index)=>JSON.stringify(receipt)===JSON.stringify(next[index]));
}
