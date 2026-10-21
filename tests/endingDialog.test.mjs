import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

test("ending modal uses native containment, focuses its heading and restores the trigger or stable fallback",async()=>{
 const server=await createServer({optimizeDeps:{noDiscovery:true,include:[],entries:[]},server:{middlewareMode:true,hmr:false},appType:"custom"});
 try{
  const {EndingDialog,openEndingDialog}=await server.ssrLoadModule("/src/EndingDialog.jsx");
  const html=renderToStaticMarkup(React.createElement(EndingDialog,{className:"ending-backdrop",labelledBy:"ending-title"},React.createElement("h2",{id:"ending-title",tabIndex:-1},"Journey record")));
  assert.match(html,/<dialog[^>]*aria-labelledby="ending-title"/);
  for(const connected of [true,false]){
   const calls=[];const dialog={showModal:()=>calls.push("modal"),close:()=>calls.push("close"),querySelector:()=>({focus:opts=>{assert.deepEqual(opts,{preventScroll:true});calls.push("heading");}})};
   const previous={isConnected:connected,focus:()=>calls.push("trigger")},fallback=()=>({focus:()=>calls.push("fallback")});
   const cleanup=openEndingDialog(dialog,previous,fallback);assert.deepEqual(calls,["modal","heading"]);cleanup();assert.deepEqual(calls,["modal","heading","close",connected?"trigger":"fallback"]);
  }
 }finally{await server.close();}
});

test("both views suspend ending modality for tools/choosers and provide visible focus return",async()=>{
 const planning=(await readFile(new URL("../src/App.jsx",import.meta.url),"utf8"))+(await readFile(new URL("../src/PlanningHeaderActions.jsx",import.meta.url),"utf8")),guided=await readFile(new URL("../src/BeginnerApp.jsx",import.meta.url),"utf8");
 for(const source of [planning,guided]){assert.match(source,/<EndingDialog /);assert.match(source,/data-ending-return/);assert.match(source,/id="(?:cinematic-)?ending-title" tabIndex="-1"/);}
 assert.match(planning,/game.phase === "ended" && !showHistory && !showRestart/);
 assert.match(guided,/game.phase === "ended" && !showFamilySelection && !historyMode && !restartFamilyId/);
 const css=await readFile(new URL("../src/styles.css",import.meta.url),"utf8");assert.match(css,/dialog\.native-ending-dialog:not\(\[open\]\).*display:none/);
});
