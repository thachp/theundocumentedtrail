import { preservesMedicineUse } from './cambodiaExpanded/medicine.js';
import {preservesCommittedChoices} from './committedChoices.js';
import * as expanded from './cambodiaExpanded/journey.js';
import * as revisedState from './cambodiaState.js';
import * as originalState from './legacyHouseholds/cambodiaState.js';
import * as revisedJourney from './cambodiaJourney.js';
import * as originalJourney from './legacyHouseholds/cambodiaJourney.js';
const unavailableStorage={getItem(){throw new Error('Storage unavailable');},setItem(){throw new Error('Storage unavailable');}};
const storageFor=storage=>{try{return storage??window.localStorage;}catch{return unavailableStorage;}};
const stateFor=edition=>edition===1?originalState:edition===3?expanded:revisedState;
const journeyFor=edition=>edition===1?originalJourney:edition===3?expanded:revisedJourney;
export const CAMBODIA_ARCHIVE_KEY='undocumented-trail:review:cambodia-1979:archive:v2';
export function loadCambodiaArchive(storage){return [CAMBODIA_ARCHIVE_KEY,CAMBODIA_EXPANDED_ARCHIVE_KEY].flatMap(key=>{try{const rows=JSON.parse(storageFor(storage).getItem(key)??'[]');return Array.isArray(rows)?rows:[];}catch{return [];}});}
export const CAMBODIA_EXPANDED_ARCHIVE_KEY='undocumented-trail:review:cambodia-1979:archive:v3';
function archiveCambodia(game,target){if(![2,3].includes(game.householdEdition)||game.phase!=='ended')return;const key=game.householdEdition===3?CAMBODIA_EXPANDED_ARCHIVE_KEY:CAMBODIA_ARCHIVE_KEY;const rows=JSON.parse(target.getItem(key)??'[]');if(!Array.isArray(rows))throw Error('Unknown archive preserved');if(!rows.some(r=>r.runId===game.runId))target.setItem(key,JSON.stringify([...rows,{familyId:game.familyId,runId:game.runId,endingTitle:game.ending.title,history:game.cambodiaState.history,...(game.householdEdition===3?{careHistory:game.cambodiaState.careHistory??[],...(game.cambodiaState.resourceRulesVersion===4?{state:game.cambodiaState}:{})}:{} )}]));}
export function loadCambodiaJourney(storage,requestedEdition) {
 const target=storageFor(storage);let edition=requestedEdition;
 try{if(!edition)edition=target.getItem(expanded.CAMBODIA_SAVE_KEY)!==null?3:target.getItem(revisedState.CAMBODIA_SAVE_KEY)!==null?2:target.getItem(originalState.CAMBODIA_SAVE_KEY)!==null?1:3;}catch{edition??=3;}
 try{if(edition===1&&target.getItem(originalState.CAMBODIA_SAVE_KEY)===null)edition=2;}catch{}
 const api=stateFor(edition);let loaded=api.loadCambodia(target);try{if(target.getItem(api.CAMBODIA_SAVE_KEY)==='')loaded={...loaded,writable:false,warning:'This story save could not be read. It has been preserved.'};}catch{}let meta={};
 try{meta=JSON.parse(target.getItem(api.CAMBODIA_SAVE_KEY))??{};}catch{}
 return journeyFor(edition).cambodiaGame(loaded.state,{runId:typeof meta.runId==='string'?meta.runId:undefined,saveRevision:Number.isInteger(meta.saveRevision)&&meta.saveRevision>=0?meta.saveRevision:0,warning:loaded.warning,writable:loaded.writable});
}
export function applyCambodiaJourneyAction(snapshot,action,storage) {
 const edition=snapshot.householdEdition??2,target=storageFor(storage),api=stateFor(edition),stored=loadCambodiaJourney(target,edition);
 if(typeof action==='function'&&stored.saveWritable&&(snapshot.runId!==stored.runId||snapshot.saveRevision!==stored.saveRevision))return stored;
 const baseline=stored.saveWritable?stored:snapshot;
 let next=typeof action==='function'?action(snapshot):action;
 if(next?.householdEdition!==edition)return baseline;
 const validated=api.validateCambodiaSave(next?.cambodiaState);if(!validated)return baseline;
 if(edition===3){
  if((baseline.cambodiaState.resourceRulesVersion??1)!==validated.resourceRulesVersion)return baseline;
  if(!preservesMedicineUse(baseline.cambodiaState,validated))return baseline;
  if(validated.resourceRulesVersion===4){
   const previous=baseline.cambodiaState.actionLog??[];
   if(previous.some((a,i)=>JSON.stringify(a)!==JSON.stringify(validated.actionLog[i])))return baseline;
  }
 }
 next=journeyFor(edition).cambodiaGame(validated,next);
 if(!preservesCommittedChoices(stored.saveWritable?stored.cambodiaState:snapshot.cambodiaState,next.cambodiaState))return stored.saveWritable?stored:snapshot;
 if(!stored.saveWritable)return {...next,saveWritable:false,saveWarning:stored.saveWarning};
 if(next.runId!==stored.runId||next.saveRevision!==stored.saveRevision)return stored;
 if(JSON.stringify(next.cambodiaState)===JSON.stringify(stored.cambodiaState))return stored;
 try{archiveCambodia(next,target);target.setItem(api.CAMBODIA_SAVE_KEY,JSON.stringify({...next.cambodiaState,runId:next.runId,saveRevision:stored.saveRevision+1}));return journeyFor(edition).cambodiaGame(next.cambodiaState,{...next,saveRevision:stored.saveRevision+1});}catch{return {...next,saveWritable:false,saveWarning:'Saving is unavailable. Keep this tab open to continue this visit.'};}
}
export function restartCambodiaJourney(storage,edition=3) {
 const target=storageFor(storage),game=journeyFor(edition).newCambodiaGame();
 try{archiveCambodia(loadCambodiaJourney(target,edition),target);target.setItem(stateFor(edition).CAMBODIA_SAVE_KEY,JSON.stringify({...game.cambodiaState,runId:game.runId,saveRevision:1}));return {...game,saveRevision:1};}catch{return {...game,saveWritable:false,saveWarning:'Saving is unavailable. Keep this tab open to continue this visit.'};}
}
