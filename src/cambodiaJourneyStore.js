import * as revisedState from './cambodiaState.js';
import * as originalState from './legacyHouseholds/cambodiaState.js';
import * as revisedJourney from './cambodiaJourney.js';
import * as originalJourney from './legacyHouseholds/cambodiaJourney.js';
const unavailableStorage={getItem(){throw new Error('Storage unavailable');},setItem(){throw new Error('Storage unavailable');}};
const storageFor=storage=>{try{return storage??window.localStorage;}catch{return unavailableStorage;}};
const stateFor=edition=>edition===1?originalState:revisedState;
const journeyFor=edition=>edition===1?originalJourney:revisedJourney;
export const CAMBODIA_ARCHIVE_KEY='undocumented-trail:review:cambodia-1979:archive:v2';
export function loadCambodiaArchive(storage){try{const rows=JSON.parse(storageFor(storage).getItem(CAMBODIA_ARCHIVE_KEY)??'[]');return Array.isArray(rows)?rows:[];}catch{return [];}}
function archiveCambodia(game,target){if(game.householdEdition!==2||game.phase!=='ended')return;const rows=JSON.parse(target.getItem(CAMBODIA_ARCHIVE_KEY)??'[]');if(!Array.isArray(rows))throw Error('Unknown archive preserved');if(!rows.some(r=>r.runId===game.runId))target.setItem(CAMBODIA_ARCHIVE_KEY,JSON.stringify([...rows,{familyId:game.familyId,runId:game.runId,endingTitle:game.ending.title,history:game.cambodiaState.history}]));}
export function loadCambodiaJourney(storage,requestedEdition) {
 const target=storageFor(storage);let edition=requestedEdition;
 try{if(!edition)edition=target.getItem(revisedState.CAMBODIA_SAVE_KEY)!==null?2:target.getItem(originalState.CAMBODIA_SAVE_KEY)!==null?1:2;}catch{edition??=2;}
 try{if(edition===1&&target.getItem(originalState.CAMBODIA_SAVE_KEY)===null)edition=2;}catch{}
 const api=stateFor(edition);let loaded=api.loadCambodia(target);try{if(target.getItem(api.CAMBODIA_SAVE_KEY)==='')loaded={...loaded,writable:false,warning:'This story save could not be read. It has been preserved.'};}catch{}let meta={};
 try{meta=JSON.parse(target.getItem(api.CAMBODIA_SAVE_KEY))??{};}catch{}
 return journeyFor(edition).cambodiaGame(loaded.state,{runId:typeof meta.runId==='string'?meta.runId:undefined,saveRevision:Number.isInteger(meta.saveRevision)&&meta.saveRevision>=0?meta.saveRevision:0,warning:loaded.warning,writable:loaded.writable});
}
export function applyCambodiaJourneyAction(snapshot,action,storage) {
 const edition=snapshot.householdEdition??2,target=storageFor(storage),api=stateFor(edition),stored=loadCambodiaJourney(target,edition);
 if(typeof action==='function'&&stored.saveWritable&&(snapshot.runId!==stored.runId||snapshot.saveRevision!==stored.saveRevision))return stored;
 const next=typeof action==='function'?action(snapshot):action;
 if(next?.householdEdition!==edition||!api.validateCambodiaSave(next?.cambodiaState))return stored;
 if(!stored.saveWritable)return {...next,saveWritable:false,saveWarning:stored.saveWarning};
 if(next.runId!==stored.runId||next.saveRevision!==stored.saveRevision)return stored;
 if(JSON.stringify(next.cambodiaState)===JSON.stringify(stored.cambodiaState))return stored;
 try{archiveCambodia(next,target);target.setItem(api.CAMBODIA_SAVE_KEY,JSON.stringify({...next.cambodiaState,runId:next.runId,saveRevision:stored.saveRevision+1}));return journeyFor(edition).cambodiaGame(next.cambodiaState,{...next,saveRevision:stored.saveRevision+1});}catch{return {...next,saveWritable:false,saveWarning:'Saving is unavailable. Keep this tab open to continue this visit.'};}
}
export function restartCambodiaJourney(storage) {
 const target=storageFor(storage),game=revisedJourney.newCambodiaGame();
 try{archiveCambodia(loadCambodiaJourney(target,2),target);target.setItem(revisedState.CAMBODIA_SAVE_KEY,JSON.stringify({...game.cambodiaState,runId:game.runId,saveRevision:1}));return {...game,saveRevision:1};}catch{return {...game,saveWritable:false,saveWarning:'Saving is unavailable. Keep this tab open to continue this visit.'};}
}
