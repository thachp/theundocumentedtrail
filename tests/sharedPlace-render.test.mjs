import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { readFile } from "node:fs/promises";
import { createInitialGame } from "../src/game.js";
import { ROOM_PLANS, exploreRoomPlan } from "../src/sharedPlace.js";
test("actual optional conversation renders scoped figures, all voices and accessible non-scoring controls without changing the game",async()=>{
 const server=await createServer({optimizeDeps:{noDiscovery:true,include:[],entries:[]},server:{middlewareMode:true},appType:"custom"});
 try{
  const {SharedPlaceContext,RoomPlanResult}=await server.ssrLoadModule("/src/SharedPlaceContext.jsx");
  const game={...createInitialGame("nguyen"),eventId:"nguyenPolicy"},snapshot=JSON.stringify(game);
  const html=renderToStaticMarkup(React.createElement(SharedPlaceContext,{game}));
  assert.match(html,/Optional/);assert.match(html,/Fictional composite/);assert.match(html,/earlier immigrant/);assert.match(html,/unverified belief/);
  assert.match(html,/£4.0 billion/);assert.match(html,/2024–25/);assert.match(html,/Population\/category/);assert.match(html,/Government level/);assert.match(html,/Unit \/ denominator/);
  assert.equal((html.match(/aria-pressed="false"/g)??[]).length,3);
  assert.match(html,/role="status" aria-live="polite"/);assert.doesNotMatch(html,/<img|<audio|<iframe|undefined|NaN/);
  assert.match(html,/no preferred answer, score, resource reward/);
  assert.equal(JSON.stringify(game),snapshot);
  for(const p of ROOM_PLANS){const result=renderToStaticMarkup(React.createElement(RoomPlanResult,{result:exploreRoomPlan(p.id)}));assert.match(result,/Conditional assumptions/);assert.match(result,/Today/);assert.match(result,/Later/);assert.match(result,/tabindex="-1"/);}
  assert.equal(renderToStaticMarkup(React.createElement(SharedPlaceContext,{game:createInitialGame("haddad")})),"");
  for(const file of ["App.jsx","BeginnerApp.jsx"]){const s=await readFile(new URL(`../src/${file}`,import.meta.url),"utf8");assert.match(s,/<SceneHistory /);}
  const {SceneHistory}=await server.ssrLoadModule("/src/JourneyHistory.jsx");
  assert.match(renderToStaticMarkup(React.createElement(SceneHistory,{game})),/Other lives in a shared place/);
  assert.doesNotMatch(renderToStaticMarkup(React.createElement(SceneHistory,{game:createInitialGame("haddad")})),/Other lives in a shared place/);
  const css=await readFile(new URL("../src/sharedPlace.css",import.meta.url),"utf8");assert.match(css,/prefers-reduced-motion/);assert.match(css,/min-height:44px/);assert.match(css,/max-width:480px/);
 }finally{await server.close();}
});
