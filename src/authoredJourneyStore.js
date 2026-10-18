import { authoredStory } from './authoredStories.js';
import { authoredGame, chooseAuthored, continueAuthored } from './authoredJourney.js';
export const authoredArchiveKey=id=>`undocumented-trail:household:${id}:archive:v1`;
export function loadAuthoredArchive(id,storage) {
 try{const raw=JSON.parse(targetFor(storage).getItem(authoredArchiveKey(id))??'[]');return Array.isArray(raw)?raw.filter(r=>r?.familyId===id&&typeof r.runId==='string'&&typeof r.endingTitle==='string'):[];}catch{return [];}
}
export const authoredSaveKey=id=>`undocumented-trail:household:${id}:v1`;
const unavailable={getItem(){throw Error('Storage unavailable');},setItem(){throw Error('Storage unavailable');}};
const targetFor=storage=>{try{return storage??window.localStorage;}catch{return unavailable;}};
export function validateAuthored(story,raw) {
 if(!raw||raw.version!==1||raw.storyId!==story.id||!Array.isArray(raw.history)||raw.history.length>story.scenes.length)return null;
 let game=authoredGame(story);
 for(const [i,h]of raw.history.entries()){
  if(h.sceneId!==story.scenes[i].id||!story.scenes[i].choices.some(c=>c.id===h.choiceId))return null;
  game=chooseAuthored(game,h.choiceId);if(i<raw.history.length-1)game=continueAuthored(game);
 }
 if(raw.phase==='decision'&&raw.history.length||raw.phase==='ended')game=continueAuthored(game);
 return game.phase===raw.phase&&game.storyState.index===raw.index?game.storyState:null;
}
export function loadAuthoredJourney(id,storage) {
 const story=authoredStory(id),target=targetFor(storage);let raw;
 try{const text=target.getItem(authoredSaveKey(id));if(!text)return authoredGame(story);raw=JSON.parse(text);
  const state=validateAuthored(story,raw);if(state)return authoredGame(story,state,{runId:typeof raw.runId==='string'?raw.runId:undefined,saveRevision:Number.isSafeInteger(raw.saveRevision)&&raw.saveRevision>=0?raw.saveRevision:0});
 }catch{return authoredGame(story,undefined,{saveWritable:false,saveWarning:'Saving is unavailable or this save cannot be read. Existing data is preserved; continue in this tab or explicitly restart this household.'});}
 return authoredGame(story,undefined,{saveWritable:false,saveWarning:'An unreadable or newer save is preserved. Restart only this household to replace it.'});
}
export function applyAuthoredAction(snapshot,action,storage) {
 const target=targetFor(storage),stored=loadAuthoredJourney(snapshot.familyId,target);
 if(stored.saveWritable&&typeof action==='function'&&(snapshot.runId!==stored.runId||snapshot.saveRevision!==stored.saveRevision))return stored;
 const next=typeof action==='function'?action(snapshot):action;
 if(next?.familyId!==snapshot.familyId||!validateAuthored(authoredStory(next),{...next.storyState,version:1,storyId:next.familyId}))return snapshot;
 if(!stored.saveWritable)return {...next,saveWritable:false,saveWarning:stored.saveWarning};
 if(JSON.stringify(next.storyState)===JSON.stringify(stored.storyState))return stored;
 const revision=stored.saveRevision+1;
 try{
  if(next.phase==='ended'){
   const archive=JSON.parse(target.getItem(authoredArchiveKey(next.familyId))??'[]');
   if(!Array.isArray(archive))throw Error('Unknown archive preserved');
   if(!archive.some(r=>r.runId===next.runId))target.setItem(authoredArchiveKey(next.familyId),JSON.stringify([...archive,{familyId:next.familyId,runId:next.runId,endingTitle:next.ending.title,decisions:next.history.length,history:next.storyState.history}]));
  }
  target.setItem(authoredSaveKey(next.familyId),JSON.stringify({...next.storyState,version:1,storyId:next.familyId,runId:next.runId,saveRevision:revision}));return {...next,saveRevision:revision};}catch{return {...next,saveWritable:false,saveWarning:'Saving is unavailable. Keep this tab open to continue.'};}
}
export function restartAuthoredJourney(id,storage) {
 const game=authoredGame(authoredStory(id),undefined,{runId:`${id}-${Date.now()}-${Math.random().toString(16).slice(2)}`,saveRevision:1});
 try{targetFor(storage).setItem(authoredSaveKey(id),JSON.stringify({...game.storyState,version:1,storyId:id,runId:game.runId,saveRevision:1}));return game;}catch{return {...game,saveWritable:false,saveWarning:'Saving is unavailable. Keep this tab open to continue.'};}
}
