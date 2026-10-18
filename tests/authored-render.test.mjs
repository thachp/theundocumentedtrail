import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { AUTHORED_STORIES } from '../src/authoredStories.js';
import { authoredSaveKey } from '../src/authoredJourneyStore.js';
import { authoredGame, chooseAuthored, continueAuthored, storyHero } from '../src/authoredJourney.js';

test('actual shared Guided and Planning render every new scene, outcome, ending and source dialog',async()=>{
 const data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v))};
 globalThis.localStorage=storage;globalThis.window={localStorage:storage,location:{search:'',href:'https://example.test/'}};
 const server=await createServer({optimizeDeps:{noDiscovery:true,include:[],entries:[]},server:{middlewareMode:true,hmr:false},appType:'custom'});
 try{
  const {App}=await server.ssrLoadModule('/src/App.jsx'),{BeginnerApp}=await server.ssrLoadModule('/src/BeginnerApp.jsx'),{JourneyHistoryDialog}=await server.ssrLoadModule('/src/JourneyHistory.jsx');
  for(const story of AUTHORED_STORIES){
   globalThis.window.location.search=`?story=${story.id}`;globalThis.window.location.href=`https://example.test/?story=${story.id}`;
   const save=game=>storage.setItem(authoredSaveKey(story.id),JSON.stringify({...game.storyState,version:1,storyId:story.id}));
   let game=authoredGame(story);
   for(const scene of story.scenes){
    save(game);
    for(const View of [App,BeginnerApp]){
     const html=renderToStaticMarkup(React.createElement(View));
     assert.ok(html.includes(`data-family="${story.id}"`));assert.ok(html.includes(`data-event="${scene.id}"`));assert.ok(html.includes(storyHero(story,scene.id)));assert.match(html,/Text itinerary/);assert.match(html,/Household planning resources/);
     assert.doesNotMatch(html,/undefined|NaN|% health|Group resources|Use medicine|Journey score|Meet Dara/);
     for(const choice of scene.choices)assert.ok(html.includes(choice.title.replaceAll('&','&amp;')),choice.title);
    }
    game=chooseAuthored(game,scene.choices[0].id);save(game);
    for(const View of [App,BeginnerApp])assert.match(renderToStaticMarkup(React.createElement(View)),/After your choice|After this choice/);
    game=continueAuthored(game);
   }
   save(game);for(const View of [App,BeginnerApp])assert.match(renderToStaticMarkup(React.createElement(View)),/Their lives continue beyond the frame/);
   const history=renderToStaticMarkup(React.createElement(JourneyHistoryDialog,{game,onClose:()=>{}}));assert.match(history,/Documented background/);assert.match(history,/Evidence and authored outcomes/);assert.doesNotMatch(history,/Holding centre and border camp/);
  }
 }finally{await server.close();delete globalThis.window;delete globalThis.localStorage;}
});
