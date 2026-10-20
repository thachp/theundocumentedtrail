import {preservesCommittedChoices} from './committedChoices.js';
import { authoredEdition } from './authoredStories.js';
import { authoredGame, chooseAuthored, continueAuthored } from './authoredJourney.js';
export const authoredArchiveKey=(id,edition=2)=>`undocumented-trail:household:${id}:archive:v${edition}`;
export const authoredSaveKey=(id,edition=2)=>`undocumented-trail:household:${id}:v${edition}`;
const unavailable={getItem(){throw Error('Storage unavailable');},setItem(){throw Error('Storage unavailable');}};
const targetFor=storage=>{try{return storage??window.localStorage;}catch{return unavailable;}};
export function loadAuthoredArchive(id,storage) {
 return [1,2].flatMap(edition=>{try{const raw=JSON.parse(targetFor(storage).getItem(authoredArchiveKey(id,edition))??'[]');return Array.isArray(raw)?raw.filter(r=>r?.familyId===id&&typeof r.runId==='string'&&typeof r.endingTitle==='string').map(r=>({...r,householdEdition:edition})):[];}catch{return [];}});
}
export function validateAuthored(story,raw) {
 if(!raw||raw.version!==(story.edition??2)||raw.storyId!==story.id||!Array.isArray(raw.history)||raw.history.length>story.scenes.length)return null;
 let game=authoredGame(story);
 for(const [i,h]of raw.history.entries()){
  if(h.sceneId!==story.scenes[i].id||!story.scenes[i].choices.some(c=>c.id===h.choiceId))return null;
  game=chooseAuthored(game,h.choiceId);if(i<raw.history.length-1)game=continueAuthored(game);
 }
 if(raw.phase==='decision'&&raw.history.length||raw.phase==='ended')game=continueAuthored(game);
 return game.phase===raw.phase&&game.storyState.index===raw.index?game.storyState:null;
}
export function loadAuthoredJourney(id,storage,requestedEdition) {
 const target=targetFor(storage);let edition=requestedEdition,story;
 try{
  if(!edition)edition=target.getItem(authoredSaveKey(id,2))!==null?2:target.getItem(authoredSaveKey(id,1))!==null?1:2;
  story=authoredEdition(id,edition);const text=target.getItem(authoredSaveKey(id,edition));
  if(text===null)return edition===1?loadAuthoredJourney(id,target,2):authoredGame(story);
  const raw=JSON.parse(text),state=validateAuthored(story,raw);
  if(state)return authoredGame(story,state,{runId:typeof raw.runId==='string'?raw.runId:undefined,saveRevision:Number.isSafeInteger(raw.saveRevision)&&raw.saveRevision>=0?raw.saveRevision:0});
 }catch{return authoredGame(story??authoredEdition(id,edition??2),undefined,{saveWritable:false,saveWarning:'Saving is unavailable or this save cannot be read. Existing data is preserved; continue in this tab or explicitly start the revised household.'});}
 return authoredGame(story,undefined,{saveWritable:false,saveWarning:'An unreadable or newer save is preserved. Start the revised household only when you choose to.'});
}
export function applyAuthoredAction(snapshot,action,storage) {
 const edition=snapshot.householdEdition??2,target=targetFor(storage),stored=loadAuthoredJourney(snapshot.familyId,target,edition);
 if(stored.saveWritable&&typeof action==='function'&&(snapshot.runId!==stored.runId||snapshot.saveRevision!==stored.saveRevision))return stored;
 const next=typeof action==='function'?action(snapshot):action;
 if(next?.familyId!==snapshot.familyId||next.householdEdition!==edition||!validateAuthored(authoredEdition(next.familyId,edition),{...next.storyState,version:edition,storyId:next.familyId}))return snapshot;
 if(stored.saveWritable&&(next.runId!==stored.runId||next.saveRevision!==stored.saveRevision))return stored;
 if(!preservesCommittedChoices(stored.saveWritable?stored.storyState:snapshot.storyState,next.storyState))return stored.saveWritable?stored:snapshot;
 if(!stored.saveWritable)return {...next,saveWritable:false,saveWarning:stored.saveWarning};
 if(JSON.stringify(next.storyState)===JSON.stringify(stored.storyState))return stored;
 const revision=stored.saveRevision+1;
 try{
  if(next.phase==='ended'){
   const archive=JSON.parse(target.getItem(authoredArchiveKey(next.familyId,edition))??'[]');
   if(!Array.isArray(archive))throw Error('Unknown archive preserved');
   if(!archive.some(r=>r.runId===next.runId))target.setItem(authoredArchiveKey(next.familyId,edition),JSON.stringify([...archive,{familyId:next.familyId,runId:next.runId,endingTitle:next.ending.title,decisions:next.history.length,history:next.storyState.history}]));
  }
  target.setItem(authoredSaveKey(next.familyId,edition),JSON.stringify({...next.storyState,version:edition,storyId:next.familyId,runId:next.runId,saveRevision:revision}));return {...next,saveRevision:revision};
 }catch{return {...next,saveWritable:false,saveWarning:'Saving is unavailable. Keep this tab open to continue.'};}
}
export function restartAuthoredJourney(id,storage) {
 const game=authoredGame(authoredEdition(id,2),undefined,{runId:`${id}-${Date.now()}-${Math.random().toString(16).slice(2)}`,saveRevision:1});
 try{targetFor(storage).setItem(authoredSaveKey(id,2),JSON.stringify({...game.storyState,version:2,storyId:id,runId:game.runId,saveRevision:1}));return game;}catch{return {...game,saveWritable:false,saveWarning:'Saving is unavailable. Keep this tab open to continue.'};}
}
