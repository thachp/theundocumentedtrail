import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { stat } from 'node:fs/promises';
import { CAMBODIA_SCENES } from '../src/cambodiaStory.js';
import { CAMBODIA_SAVE_KEY, createCambodiaState, chooseCambodia, startCambodia } from '../src/cambodiaState.js';
import { cambodiaGame, cambodiaHero } from '../src/cambodiaJourney.js';
import { loadCambodiaJourney, applyCambodiaJourneyAction } from '../src/cambodiaJourneyStore.js';
import { chooseOption, continueJourney, getEvent, FAMILY_PRESETS } from '../src/game.js';
import { getJourneyGeography } from '../src/journeyGeography.js';
const memory=()=>{const data=new Map();return {data,getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v))};};
test('shared controller replays both original branches through all scenes and preserves premises',()=>{
 for(let side=0;side<2;side++){
  let game=cambodiaGame(createCambodiaState());
  for(const scene of CAMBODIA_SCENES){
   assert.equal(getEvent(game).id,scene.id);assert.equal(getEvent(game).choices.length,2);
   const expected=chooseCambodia(game.cambodiaState.phase==='intro'?startCambodia(game.cambodiaState):game.cambodiaState,scene.choices[side].id);
   game=chooseOption(game,scene.choices[side].id);assert.deepEqual(game.cambodiaState,expected);assert.equal(game.phase,'outcome');
   assert.equal(game.currentOutcome.copy,scene.choices.find(c=>c.id===expected.history.at(-1).choiceId).consequence);
   assert.equal(getJourneyGeography(game).current.eventId,scene.id);
   game=continueJourney(game);
  }
  assert.equal(game.phase,'ended');assert.equal(game.losses.length,0);assert.equal(game.cambodiaState.history.length,9);
 }
 assert.equal(Object.keys(FAMILY_PRESETS).length,6);
});
test('legacy Cambodia save migrates on action only, protects other keys and rejects stale tabs',()=>{
 const storage=memory();storage.setItem('six-family-sentinel','unchanged');
 const legacy=chooseCambodia(startCambodia(createCambodiaState()),'drawing');storage.setItem(CAMBODIA_SAVE_KEY,JSON.stringify(legacy));
 const a=loadCambodiaJourney(storage),before=storage.getItem(CAMBODIA_SAVE_KEY);assert.deepEqual(a.cambodiaState,legacy);assert.equal(storage.getItem(CAMBODIA_SAVE_KEY),before);
 const b=applyCambodiaJourneyAction(a,continueJourney,storage);assert.equal(b.eventId,'C02');assert.equal(b.saveRevision,1);
 assert.deepEqual(applyCambodiaJourneyAction(a,continueJourney,storage),b);
 assert.equal(storage.getItem('six-family-sentinel'),'unchanged');assert.equal(storage.data.size,2);
 const unknown='{"version":99}';storage.setItem(CAMBODIA_SAVE_KEY,unknown);
 const blocked=loadCambodiaJourney(storage);assert.equal(blocked.saveWritable,false);
 const reading=applyCambodiaJourneyAction(blocked,g=>chooseOption(g,'drawing'),storage);assert.equal(reading.phase,'outcome');assert.equal(reading.saveWritable,false);assert.equal(storage.getItem(CAMBODIA_SAVE_KEY),unknown);
});
test('both actual shared views render every scene with original choices, geographic map and fictional assets',async()=>{
 const storage=memory();globalThis.localStorage=storage;globalThis.window={localStorage:storage,location:{search:'?story=cambodia-1979',href:'https://example.test/?story=cambodia-1979'}};
 const server=await createServer({optimizeDeps:{noDiscovery:true,include:[],entries:[]},server:{middlewareMode:true,hmr:false},appType:'custom'});
 try{
  const {App}=await server.ssrLoadModule('/src/App.jsx');const {BeginnerApp}=await server.ssrLoadModule('/src/BeginnerApp.jsx');
  let game=cambodiaGame(createCambodiaState());
  for(const scene of CAMBODIA_SCENES){
   storage.setItem(CAMBODIA_SAVE_KEY,JSON.stringify(game.cambodiaState));
   for(const View of [App,BeginnerApp]){
    const html=renderToStaticMarkup(React.createElement(View));
    assert.match(html,/data-family="cambodia-1979"/);assert.match(html,new RegExp(`data-event="${scene.id}"`));assert.match(html,/Text itinerary/);assert.match(html,/Household planning resources/);
    assert.ok(html.includes(cambodiaHero(scene.id)));assert.match(html,/fictional household/);assert.doesNotMatch(html,/undefined|NaN|% health|Use medicine|Group resources/);
    for(const choice of scene.choices)assert.ok(html.includes(choice.title.replaceAll('&','&amp;')),choice.title);
   }
   game=chooseOption(game,scene.choices[0].id);
   storage.setItem(CAMBODIA_SAVE_KEY,JSON.stringify(game.cambodiaState));
   for(const View of [App,BeginnerApp])assert.match(renderToStaticMarkup(React.createElement(View)),/After your choice|After this choice/);
   game=continueJourney(game);
  }
  storage.setItem(CAMBODIA_SAVE_KEY,JSON.stringify(game.cambodiaState));
  for(const View of [App,BeginnerApp]){const html=renderToStaticMarkup(React.createElement(View));assert.match(html,/Their lives continue beyond the frame/);assert.doesNotMatch(html,/% health|NaN|undefined/);}
  let total=0;for(const id of ['cover','C01','C02','C04','C05','C06','C07','C08','C09']){const size=(await stat(`public/assets/cambodia/${id}.webp`)).size;assert.ok(size<200000);total+=size;}assert.ok(total<1500000);
 }finally{await server.close();delete globalThis.window;delete globalThis.localStorage;}
});
