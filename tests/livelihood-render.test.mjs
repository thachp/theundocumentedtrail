import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { readFile } from "node:fs/promises";
import { createInitialGame, takeRoadsideJob } from "../src/game.js";
import { beginRepair, advanceRepair, settleRepair } from "../src/livelihoodActivity.js";
test("actual activity controls disclose commitment, hide uncertain outcomes, and render both accessible resolutions", async () => {
 const server=await createServer({optimizeDeps:{noDiscovery:true,include:[],entries:[]},server:{middlewareMode:true},appType:"custom"});
 try {
  const {LivelihoodContent,LivelihoodDialog,LivelihoodTrigger}=await server.ssrLoadModule("/src/LivelihoodActivity.jsx");
  const g={...createInitialGame("diop"),eventId:"diopDakar",runId:"render"};
  const html=renderToStaticMarkup(React.createElement(LivelihoodContent,{game:g}));
  assert.match(html,/\$45 upfront/);assert.match(html,/one food day and 2 L/);assert.match(html,/Skip activity · no cost or time/);assert.match(html,/Commit and use summary resolution/);
  assert.match(html,/not Senegalese prices/);assert.doesNotMatch(html,/Net change in cash|\$60|\$120|\+\$35|\+\$75/);
  for(const state of [beginRepair(g),advanceRepair(beginRepair(g)),settleRepair(beginRepair(g),{summary:true})]) {
   const result=renderToStaticMarkup(React.createElement(LivelihoodContent,{game:state}));assert.doesNotMatch(result,/undefined|NaN/);
   assert.match(result,/summary|Net change in cash/);
  }
  const legacy=renderToStaticMarkup(React.createElement(LivelihoodContent,{game:takeRoadsideJob(g,"diopRepairBikes")}));
  assert.match(legacy,/Optional cooperative shift already completed/);assert.match(legacy,/original outcome and resources are preserved/);assert.doesNotMatch(legacy,/Commit the day/);
  const dialog=renderToStaticMarkup(React.createElement(LivelihoodDialog,{game:g}));assert.match(dialog,/<dialog[^>]+aria-labelledby=/);
  assert.match(renderToStaticMarkup(React.createElement(LivelihoodTrigger,{game:beginRepair(g)})),/Resume committed/);
  assert.equal(renderToStaticMarkup(React.createElement(LivelihoodTrigger,{game:createInitialGame("haddad")})),"");
  const css=await readFile(new URL("../src/livelihoodActivity.css",import.meta.url),"utf8");assert.match(css,/prefers-reduced-motion/);assert.match(css,/min-height:44px/);
 }finally{await server.close();}
});
