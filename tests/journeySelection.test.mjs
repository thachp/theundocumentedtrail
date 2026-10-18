import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { readFile } from "node:fs/promises";
import { FAMILY_PRESETS, GAME_SAVE_KEY, createInitialGame } from "../src/game.js";
import { getJourneyChoices, journeyKeyIndex, scrollJourneyCard } from "../src/journeyChoices.js";
import { FAMILY_SAVES_KEY, loadFamilySaves, saveFamilyGame } from "../src/saveStore.js";
import { CAMBODIA_SAVE_KEY, createCambodiaState, loadCambodia } from "../src/cambodiaState.js";

test("the normal chooser includes Cambodia without adding a survival preset or changing its direct route",()=>{
  const choices=getJourneyChoices({PROD:true});
  assert.equal(choices.length,7);
  assert.deepEqual(choices.slice(0,6).map(c=>c.id),Object.keys(FAMILY_PRESETS));
  assert.equal(Object.keys(FAMILY_PRESETS).length,6);
  const story=choices.at(-1);
  assert.equal(story.kind,"historical");assert.equal(story.name,"A Place for Tomorrow");assert.match(story.origin,/Cambodia/);assert.equal(story.period,"1979–1982");assert.equal(story.href,"/?story=cambodia-1979");
  assert.equal(getJourneyChoices({VITE_ENABLE_CAMBODIA_STORY:"false"}).length,6);
});

test("keyboard End/Home/arrows scroll and focus all seven choices at mobile and desktop widths",()=>{
  for(const width of [320,390,1180]){
    const mobile=width<480,cardWidth=mobile?width-26:(width-24)/3,gap=12;
    let focused=null,behavior=null;
    const rail={clientWidth:width,scrollLeft:0,children:[],scrollTo({left,behavior:b}){this.scrollLeft=Math.min(left,7*cardWidth+6*gap-width);behavior=b;}};
    rail.children=Array.from({length:7},(_,i)=>({offsetLeft:i*(cardWidth+gap),clientWidth:cardWidth,querySelector:()=>({focus:options=>{assert.deepEqual(options,{preventScroll:true});focused=i;}})}));
    let index=0;
    for(let i=0;i<6;i++){index=journeyKeyIndex("ArrowRight",index,7);assert.equal(scrollJourneyCard(rail,index,{focus:true,reducedMotion:true}),index);assert.equal(focused,index);}
    assert.equal(index,6);assert.equal(behavior,"auto");
    const story=rail.children[6];assert.ok(story.offsetLeft>=rail.scrollLeft-1);assert.ok(story.offsetLeft+story.clientWidth<=rail.scrollLeft+width+1,"last card/action visible");
    assert.equal(journeyKeyIndex("ArrowRight",6,7),6);
    index=journeyKeyIndex("Home",index,7);scrollJourneyCard(rail,index,{focus:true});assert.equal(focused,0);assert.equal(rail.scrollLeft,0);
    assert.equal(journeyKeyIndex("End",0,7),6);assert.equal(journeyKeyIndex("ArrowLeft",0,7),0);assert.equal(journeyKeyIndex("Tab",0,7),null);
  }
});

test("actual shared chooser renders seven slides, native dialog and direct story anchor without writing any save",async()=>{
  const data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v))};
  for(const id of Object.keys(FAMILY_PRESETS))saveFamilyGame(createInitialGame(id),storage);
  storage.setItem(CAMBODIA_SAVE_KEY,JSON.stringify(createCambodiaState()));
  const before=[...data],saved=loadFamilySaves(storage),story=loadCambodia(storage);
  const server=await createServer({optimizeDeps:{noDiscovery:true,include:[],entries:[]},server:{middlewareMode:true,hmr:false},appType:"custom"});
  try {
    const {FamilySelection}=await server.ssrLoadModule("/src/JourneySelection.jsx");
    for(const view of ["Guided","Planning"]){
      const html=renderToStaticMarkup(React.createElement(FamilySelection,{currentFamilyId:"ramirez",required:false,saves:saved,archive:[],onSelect:()=>assert.fail("render does not select a family"),onRestart:view==="Guided"?()=>{}:undefined,onClose:()=>{}}));
      assert.equal((html.match(/aria-roledescription="slide"/g)??[]).length,7);
      assert.match(html,/<dialog[^>]*aria-labelledby="family-selection-title"/);
      assert.match(html,/7 of 7: Cambodia/);assert.match(html,/href="\/\?story=cambodia-1979"/);assert.match(html,/1979–1982/);assert.match(html,/A Place for Tomorrow/);
      assert.match(html,/Separate saved progress/);assert.doesNotMatch(html,/Historical stories<\/h3>/);
    }
    assert.deepEqual([...data],before);
    assert.deepEqual(loadCambodia(storage),story);
    assert.ok(data.has(FAMILY_SAVES_KEY)&&data.has(GAME_SAVE_KEY)&&data.has(CAMBODIA_SAVE_KEY));
    for(const file of ["App.jsx","BeginnerApp.jsx"]){const source=await readFile(new URL(`../src/${file}`,import.meta.url),"utf8");assert.match(source,/import \{ FamilySelection \} from "\.\/JourneySelection.jsx"/);assert.match(source,/<FamilySelection/);}
    const planning=await readFile(new URL("../src/App.jsx",import.meta.url),"utf8");assert.match(planning,/\[showFamilySelection, setShowFamilySelection\] = useState\(true\)/);assert.match(planning,/aria-label="Choose a journey"/);
    const css=await readFile(new URL("../src/beginner.css",import.meta.url),"utf8");assert.match(css,/\.cinematic-family-actions a[^}]*min-height:\s*44px/s);assert.match(css,/grid-auto-columns:\s*calc\(100% - 26px\)/);
  }finally{await server.close();}
});
