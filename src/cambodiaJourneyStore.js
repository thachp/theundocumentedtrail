import { CAMBODIA_SAVE_KEY, loadCambodia, validateCambodiaSave } from "./cambodiaState.js";
import { cambodiaGame, newCambodiaGame } from "./cambodiaJourney.js";
const unavailableStorage={getItem(){throw new Error("Storage unavailable");},setItem(){throw new Error("Storage unavailable");}};
const storageFor=storage=>{try{return storage??window.localStorage;}catch{return unavailableStorage;}};
export function loadCambodiaJourney(storage) {
 const target=storageFor(storage),loaded=loadCambodia(target);
 let meta={};try{meta=JSON.parse(target.getItem(CAMBODIA_SAVE_KEY))??{};}catch{}
 return cambodiaGame(loaded.state,{runId:typeof meta.runId==="string"?meta.runId:undefined,saveRevision:Number.isInteger(meta.saveRevision)&&meta.saveRevision>=0?meta.saveRevision:0,warning:loaded.warning,writable:loaded.writable});
}
export function applyCambodiaJourneyAction(snapshot,action,storage) {
 const target=storageFor(storage),stored=loadCambodiaJourney(target);
 if(!stored.saveWritable) {
  const next=typeof action==="function"?action(snapshot):action;
  return validateCambodiaSave(next?.cambodiaState)?{...next,saveWritable:false,saveWarning:stored.saveWarning}:snapshot;
 }
 if(typeof action==="function"&&(snapshot.runId!==stored.runId||snapshot.saveRevision!==stored.saveRevision))return stored;
 const next=typeof action==="function"?action(snapshot):action;
 if(!stored.saveWritable||!validateCambodiaSave(next?.cambodiaState)||next.runId!==stored.runId||next.saveRevision!==stored.saveRevision)return stored;
 if(JSON.stringify(next.cambodiaState)===JSON.stringify(stored.cambodiaState))return stored;
 const committed={...next.cambodiaState,runId:next.runId,saveRevision:stored.saveRevision+1};
 try{target.setItem(CAMBODIA_SAVE_KEY,JSON.stringify(committed));return cambodiaGame(next.cambodiaState,{...next,saveRevision:committed.saveRevision});}catch{return {...next,saveWarning:"Saving is unavailable. Keep this tab open to continue this visit."};}
}
export function restartCambodiaJourney(storage) {
 const target=storageFor(storage),game=newCambodiaGame();
 try{target.setItem(CAMBODIA_SAVE_KEY,JSON.stringify({...game.cambodiaState,runId:game.runId,saveRevision:1}));return {...game,saveRevision:1};}catch{return {...game,saveWarning:"Saving is unavailable. Keep this tab open to continue this visit."};}
}
