import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import { EVENTS, FAMILY_PRESETS, GAME_VERSION, ROADSIDE_OPPORTUNITIES, chooseOption, createInitialGame } from "../src/game.js";
import { HISTORY_SOURCES, getSceneHistory } from "../src/journeyHistory.js";
import { refreshNarrative } from "../src/narrativeMigration.js";
import { FAMILY_SAVES_KEY, FAMILY_SELECTION_KEY, loadCurrentGame } from "../src/saveStore.js";

const choiceFor = (scene, id) => EVENTS[scene].choices.find(c => c.id === id);
const prose = scene => EVENTS[scene].messages.map(m => m.body).join(" ");

test("Punjab mechanics match the pre-correction contract: IDs, branches, effects, costs, flags and ending identity", async () => {
  const mechanical = ({title,hint,outcome,outcomeTitle,consequence,ending,...c}) => ({...c,...(ending?{ending:{type:ending.type,status:ending.status,title:ending.title}}:{})});
  const scenes = collection => Object.fromEntries(Object.entries(collection).filter(([id])=>id.startsWith("punjab")).map(([id,e])=>[id,e.choices.map(mechanical)]));
  const original = JSON.parse(await readFile(new URL("./fixtures/punjab-mechanics.json",import.meta.url),"utf8"));
  assert.deepEqual({version:GAME_VERSION,scenes:scenes(EVENTS),work:scenes(ROADSIDE_OPPORTUNITIES)},original);
});

test("all Delhi branches distinguish issued records and later visas before boarding, with entry decided separately", () => {
  const airport = prose("punjabAirport");
  assert.match(airport,/After a further wait in India/);
  assert.match(airport,/all four permits.*issued.*separate long-stay employment visas/);
  assert.match(airport,/premature airport trip with PDFs/);
  assert.match(airport,/do not model official processing times or visa fees/);
  assert.match(airport,/Neither a permit nor a visa guarantees admission/);
  for (const c of EVENTS.punjabDelhi.choices) {
    const game = {...createInitialGame("punjab"), eventId:"punjabDelhi"};
    const after = chooseOption(game,c.id);
    assert.equal(after.pendingNext,"punjabAirport");
    assert.match(c.outcome,/visa/);
  }
  assert.match(choiceFor("punjabDelhi","punjabTakePDF").outcome,/do not board at this point/);
  for(const id of ["punjabPresentDocuments","punjabTouristStory"]) {
    assert.match(choiceFor("punjabAirport",id).outcome,/Irish border/);
    assert.match(choiceFor("punjabAirport",id).outcome,/fictional/);
  }
  assert.match(choiceFor("punjabAirport","punjabTouristStory").outcome,/Misrepresentation can lead to refusal/);
});

test("closure does not infer expired permission; redundancy and reactivation requirements remain distinct and sourced", () => {
  const inspection = prose("punjabInspection"), final = prose("punjabFinal");
  assert.match(inspection,/does not itself establish.*expired/);
  assert.match(inspection,/Qualifying General or Critical Skills.*four weeks.*six months/);
  assert.match(inspection,/separate possibility/);
  assert.match(final,/temporary Stamp 1.*Reactivation Employment Permit.*letter.*before the permit application/);
  assert.match(final,/genuine job offer/);
  assert.match(final,/not a promise of service availability/);
  const ending = choiceFor("punjabFinal","punjabReactivationReview");
  assert.match(ending.ending.copy,/No temporary permission or permit approval is presumed/);
  assert.match(ending.outcome,/unmet requirements/);
  assert.doesNotMatch(ending.outcome,/files the correct permit application/);
  for (const scene of ["punjabDelhi","punjabAirport","punjabDublin","punjabInspection","punjabFinal"]) {
    const note = getSceneHistory({familyId:"punjab",eventId:scene});
    for(const id of note.sourceIds) assert.match(HISTORY_SOURCES[id].date,/checked 18 October 2026/);
  }
  assert.deepEqual(getSceneHistory({familyId:"punjab",eventId:"punjabInspection"}).sourceIds,["irelandRedundancy","irelandReactivation"]);
});

test("legacy outcomes, endings and eligibility threads refresh without replaying effects or changing save state", () => {
  for(const scene of ["punjabDelhi","punjabAirport","punjabInspection","punjabFinal"]) for(const c of EVENTS[scene].choices) {
    const base = {...createInitialGame("punjab"),eventId:scene};
    base.resources.cash=10000;
    const legacy=structuredClone(chooseOption(base,c.id));
    legacy.currentOutcome.copy="old procedural assertion";
    legacy.currentOutcome.threadUpdates?.forEach(t=>{t.title="old eligibility letter";t.summary="old";});
    if(legacy.pendingEnding)legacy.pendingEnding.copy="temporary permission already granted";
    const snapshot=structuredClone(legacy), refreshed=refreshNarrative(legacy);
    assert.equal(refreshed.currentOutcome.copy,c.outcome);
    for(const field of ["resources","people","flags","eventId","day","progress","pendingNext","runId","version","phase","status","activityLog","completedRoadsideWork","resolvedSocialFeeds","socialClimate","relationshipHistory"]) assert.deepEqual(refreshed[field],snapshot[field],`${c.id}: ${field}`);
    assert.deepEqual(refreshed.history.map(h=>[h.choiceId,h.day,h.eventId]),snapshot.history.map(h=>[h.choiceId,h.day,h.eventId]));
    assert.deepEqual(legacy,snapshot,"input not mutated");
    assert.equal(refreshNarrative(refreshed),refreshed,"idempotent");
    if(c.ending){const ended=refreshNarrative({...legacy,phase:"ended",ending:legacy.pendingEnding});assert.equal(ended.ending.copy,c.ending.copy);assert.equal(ended.ending.type,c.ending.type);}
  }
  const legacy=chooseOption({...createInitialGame("punjab"),eventId:"punjabInspection"},"punjabContactReactivation");
  legacy.storyThreads.reactivationAdvice.title="The reactivation eligibility letter";
  legacy.storyThreads.reactivationAdvice.summary="Already fell out of the system";
  const refreshed=refreshNarrative(legacy);
  assert.equal(refreshed.storyThreads.reactivationAdvice.title,"The individual options checklist");
  assert.equal(refreshed.currentOutcome.threadUpdates[0].title,"The individual options checklist");
  assert.deepEqual(refreshed.storyThreads.reactivationAdvice.status,legacy.storyThreads.reactivationAdvice.status);
});

test("resumed family slots preserve resources and storage bytes; only Punjab procedure display text changes", () => {
  const slots=Object.fromEntries(Object.keys(FAMILY_PRESETS).map(id=>[id,createInitialGame(id)]));
  slots.haddad.narrativeEdition="haddad-2015";
  const data=new Map([[FAMILY_SAVES_KEY,JSON.stringify(slots)]]), storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};
  const stored=data.get(FAMILY_SAVES_KEY);
  for(const id of Object.keys(slots)) {
    storage.setItem(FAMILY_SELECTION_KEY,id);
    const resumed=loadCurrentGame(storage);
    assert.deepEqual(resumed.resources,slots[id].resources);
    if(id!=="punjab")assert.deepEqual(resumed,slots[id]);
    assert.equal(data.get(FAMILY_SAVES_KEY),stored,"read does not rewrite saved bytes");
  }
});

test("actual shared scene context renders dated procedural links and fictional timing in both view integration", async () => {
  const server=await createServer({optimizeDeps:{noDiscovery:true,include:[],entries:[]},server:{middlewareMode:true,hmr:false},appType:"custom"});
  try {
    const {SceneHistory}=await server.ssrLoadModule("/src/JourneyHistory.jsx");
    for(const scene of ["punjabAirport","punjabInspection","punjabFinal"]) {
      const html=renderToStaticMarkup(React.createElement(SceneHistory,{game:{...createInitialGame("punjab"),eventId:scene}}));
      assert.match(html,/checked 18 October 2026/);
      assert.match(html,/fictional/i);
      assert.match(html,/https:\/\/(?:www\.irishimmigration|enterprise)\./);
    }
    for(const file of ["App.jsx","BeginnerApp.jsx"])assert.match(await readFile(new URL(`../src/${file}`,import.meta.url),"utf8"),/<SceneHistory /);
  } finally {await server.close();}
});
