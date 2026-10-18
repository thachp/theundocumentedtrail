import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { focusSharedResult } from "../src/focusSharedResult.js";

test("320px focused result clears the real fixed choices bar instead of remaining at the viewport bottom",async()=>{
 const css=await readFile(new URL("../src/beginner.css",import.meta.url),"utf8");
 const mobile=[...css.matchAll(/\.cinematic-choice-jump\s*\{([^}]+)\}/g)].find(m=>m[1].includes("position: fixed"))[1];
 const barHeight=Number(mobile.match(/min-height:\s*(\d+)px/)[1]),barBottom=Number(mobile.match(/bottom:\s*(\d+)px/)[1]);
 const viewportHeight=568,barTop=viewportHeight-barBottom-barHeight;
 for(const height of [40,72,110]) {
  // Native nearest-focus scrolling considers this heading visible even though
  // the overlay covers it. Model that exact geometry, not only method calls.
  let top=viewportHeight-height-2,focused=false;const calls=[];
  assert.ok(top+height>barTop,"baseline target is behind the fixed cue");
  const target={focus(options){focused=true;calls.push(["focus",options]);},scrollIntoView(options){calls.push(["scroll",options]);if(options.block==="center")top=(viewportHeight-height)/2;}};
  focusSharedResult(target);
  assert.ok(focused);assert.ok(top>=0&&top+height<barTop-8,"entire focused heading must clear the mobile bar");
  assert.deepEqual(calls,[["focus",{preventScroll:true}],["scroll",{block:"center",inline:"nearest",behavior:"instant"}]]);
 }
});
test("focus helper handles absent targets and centers within the planning scroll pane without smooth motion",()=>{
 assert.doesNotThrow(()=>focusSharedResult(null));
 let top=490;const pane={top:100,height:420},headingHeight=80;
 focusSharedResult({focus(options){assert.equal(options.preventScroll,true);},scrollIntoView(options){assert.equal(options.behavior,"instant");top=pane.top+(pane.height-headingHeight)/2;}});
 assert.ok(top>pane.top&&top+headingHeight<pane.top+pane.height);
});
test("the rendered schedule effect uses the visibility helper for every newly explored plan",async()=>{
 const source=await readFile(new URL("../src/SharedPlaceContext.jsx",import.meta.url),"utf8");
 assert.match(source,/if\(planId\)focusSharedResult\(heading.current\)/);
 assert.match(source,/\},\[planId\]\)/);
});
