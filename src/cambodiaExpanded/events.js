// Rules 3 apply only to new runs. Rules 1/2 keep their frozen choice replay.
export const eventRules = state => [3,4].includes(state.resourceRulesVersion);
const road = new Set(['E02','E03','R01','E04']);
export function eventChoice(state, choice) {
 if (!eventRules(state)) return choice;
 const c={...choice,effects:{...choice.effects},peopleEffects:{}};
 const key=`${state.sceneId}:${choice.id}`;
 // Individual effort replaces the old blanket health adjustment.
 const affected={E01:'sophea',E02:'vann',E03:'vann',E04:'maly',E05:'maly',E06:'maly',E07:'dara',R01:'vann',T01:'vann',W01:'vann',J01:'dara',E10:'dara',E11:'maly',M01:'vann',M02:'vann'}[state.sceneId]??'sophea';
 if(c.effects.health){c.peopleEffects[affected]={health:c.effects.health};delete c.effects.health;}
 if(state.sceneId==='E02'&&choice.id!=='bundles')c.peopleEffects={maly:{health:5},dara:{health:4}};
 if(key==='E02:summary'){c.title='Move on before the crowded rest stop';c.description='Keep moving with fewer pauses; Maly will need more rest afterward.';c.consequence='They pass the crowded stopping place without stopping. Maly is worn out; the group must plan a lighter task for her.';c.effects={stress:1};c.peopleEffects={maly:{health:-6,condition:'Worn out'},vann:{health:-2}};c.time=1;c.next='E04';}
 if(key==='E02:bundles')c.peopleEffects={vann:{health:-5},maly:{health:2}};
 if(state.sceneId==='E06'){
  c.peopleEffects={maly:{health:choice.id==='clinic'?10:choice.id==='turns'?6:2,condition:choice.id==='help'?'Awaiting assessment':'Recovering'}};
  if(choice.id==='turns'){c.peopleEffects.dara={health:-3};c.peopleEffects.vann={health:-3};}
  if(choice.id==='help')c.next='H01';
 }
 if(state.sceneId==='E04')c.next=choice.id==='wait'?'T01':state.resourceRulesVersion===4&&choice.id==='group'?'M01':'E05';
 if(state.resourceRulesVersion===4&&state.sceneId==='T01')c.next='M01';
 if(state.sceneId==='E03'&&choice.id==='offer')c.next='R01';
 if(state.sceneId==='E07'&&choice.id==='learning'&&(state.resources.supplies<2||state.resources.water<2))c.next='F01';
 if(key==='J01:extra')c.peopleEffects.dara={health:-7,condition:'Exhausted'};
 if(state.sceneId==='H01')c.peopleEffects={maly:{health:choice.id==='accompany'?8:4,condition:'Recovering'},...(choice.id==='rotate'?{sophea:{health:-3}}:{})};
 c.travelDays=state.resourceRulesVersion===4?0:road.has(state.sceneId)?c.time:0;
 return c;
}
export function nextEvent(story,state,choice){const c=eventChoice(state,choice);return c.next===undefined?story.scenes.find(s=>s.id===state.sceneId).next:c.next;}
export function eventCosts(state,choice){
 if(!eventRules(state)||state.resourceRulesVersion===4)return {effects:{},notes:[]};
 const days=road.has(state.sceneId)?choice.time:0;
 return {effects:days?{supplies:-Math.max(0,days-(choice.effects.supplies<0?-choice.effects.supplies:0)),water:-Math.max(0,days-(choice.effects.water<0?-choice.effects.water:0))}:{},notes:days?[`${days} travel day${days===1?'':'s'} pass. Carried food and water are used each day.`]:[]};
}
export function endingFor(state){
 const strained=Object.values(state.people).filter(p=>p.health<55).length;
 return {title:strained?'A home, with care still needed':state.resources.cash<2?'A home, a tight first budget':state.flags.ending==='rest'?'Room for an ordinary tomorrow':'Plans they can carry forward',copy:`${strained?`${strained} relatives still need time and support to recover.`:'The household has protected room for recovery.'} ${state.resources.cash<2?'Their budget leaves little room for unexpected costs.':'Some household means remain for the next practical task.'} Their admission was an independent case decision; their choices shaped daily life and the work of rebuilding.`};
}
