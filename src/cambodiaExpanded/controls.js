// Rules 4: period-specific control descriptions. No modern inventory or prices.
export const hasControls = state => state?.resourceRulesVersion === 4;
export const legFor = (state,choice) => {
 if(!hasControls(state))return null;
 const key=`${state.sceneId}:${choice.id}`;
 const legs={
  'E02:bundles':[2,'Moving with redistributed bundles'], 'E02:summary':[2,'Leaving the rest stop behind'],
  'E04:care':[3,'Continuing with care support'], 'E04:group':[3,'Moving with known companions'],
  'T01:share':[3,'Resuming after the delay'], 'T01:exchange':[3,'Resuming after the delay'], 'T01:rest':[3,'Resuming after the delay'],
  'M02:companions':[4,'A longer onward journey with companions'], 'M02:care':[3,'An onward journey with lighter tasks'], 'M02:relief':[4,'Continuing after a relief pause'],
 };
 const leg=legs[key];return leg?{baseDays:leg[0],title:leg[1]}:null;
};
const names={dara:'Dara',vann:'Vann',maly:'Maly',sophea:'Sophea'};
const roles={dara:['Protect the bundles','Clothing repair keeps carried food protected.'],vann:['Share the load','Shared tasks reduce the strain of travel.'],maly:['Plan water use','Household planning protects clean water.'],sophea:['Keep the group informed','Contact notes help the household keep plans clear.']};
export function leadOptions(state){return Object.entries(state.people).filter(([,p])=>p.alive).map(([id,p])=>({personId:id,name:names[id],roleTitle:roles[id][0],hint:roles[id][1],unavailable:p.health<35?'Needs care before coordinating':p.condition?.startsWith('Leg injury')?'Needs lighter tasks while the injury heals':null}));}
export function paceOptions(state){const base=state.pendingLeg?.baseDays??0;return [
 {id:'brisk',title:'Travel briskly',days:Math.max(1,base-1),hint:'Fewer travel days and fewer meals on the road, with more fatigue and strain.'},
 {id:'steady',title:'Keep a steady pace',days:base,hint:'Keep the planned timetable, using carried food and water each day.'},
 {id:'careful',title:'Allow more rest',days:base+1,hint:'An extra day uses more food and water, while leaving more room for recovery.'},
 ];}
const campStops=new Set(['E05','W01','E06','E07','F01']);
export function supplyStop(state){
 if(!hasControls(state)||!['intro','scene'].includes(state.phase))return null;
 if(state.sceneId==='E01')return {title:'Prepare the traveling provisions',detail:'Use remaining portable exchange means for a bounded preparation. Quantities are game units, not historical prices.'};
 if(campStops.has(state.sceneId))return {title:'Relief and household supplies',detail:'Ask about food and clean water assistance, or arrange a modest exchange. Neither care nor relief is earned through payment.'};
 if(state.sceneId==='E10')return {title:'Household food and water',detail:'Use household budget room for provisions. These are budget units, not dollar prices.'};
 return null;
}
export function supplyOptions(state){if(!supplyStop(state))return [];const relief=campStops.has(state.sceneId);return [
 ...(relief?[{id:'relief',title:'Request a food and water allocation',cost:0,effects:{supplies:2,water:2}}]:[]),
 {id:'food',title:relief?'Exchange for carried food':'Prepare carried food',cost:1,effects:{supplies:3}},
 {id:'water',title:relief?'Exchange for clean water':'Prepare clean water',cost:1,effects:{water:3}},
 ].map(item=>({...item,unavailable:state.resupplyUsed?.[`${state.sceneId}:${item.id}`]?'Allocation already collected here':state.resources.cash<item.cost?'Not enough exchange or budget units':Object.entries(item.effects).every(([k])=>state.resources[k]>=12)?'Stores are full':null}));}
export const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
