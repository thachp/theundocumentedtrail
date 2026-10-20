import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import * as gameApi from "../src/game.js";
import { EVENTS, ROADSIDE_OPPORTUNITIES, createInitialGame, chooseOption, GAME_SAVE_KEY } from "../src/game.js";
import { FAMILY_SAVES_KEY, JOURNEY_ARCHIVE_KEY, loadCurrentGame, loadJourneyArchive, saveFamilyGame, selectFamilyGame } from "../src/saveStore.js";
import { HISTORY_SOURCES, JOURNEY_HISTORY, getJourneyDate, getSceneHistory } from "../src/journeyHistory.js";
import { refreshNarrative } from "../src/narrativeMigration.js";
const memory=()=>{const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,String(v))};};
const ramirezEvents=Object.values(EVENTS).filter(e=>! /^(haddad|diop|nguyen|punjab|rohingya)/.test(e.id));

test("overall score computation and every UI/archive consumer are removed, including the death denominator", async()=>{
  assert.equal(gameApi.getJourneyScore,undefined);
  for(const file of ["App.jsx","BeginnerApp.jsx","saveStore.js","JourneySelection.jsx"]){
    const text=await readFile(new URL(`../src/${file}`,import.meta.url),"utf8");
    assert.doesNotMatch(text,/getJourneyScore|Journey score|entry\.score|\bscore:/);
  }
  const guided=await readFile(new URL("../src/BeginnerApp.jsx",import.meta.url),"utf8");
  assert.match(guided,/Days traveled/);assert.match(guided,/Decisions/);const chooser=await readFile(new URL("../src/JourneySelection.jsx",import.meta.url),"utf8");assert.doesNotMatch(chooser,/Completed journeys|Completed journey archive|entry\.score/);
  const planning=await readFile(new URL("../src/App.jsx",import.meta.url),"utf8");
  assert.match(planning,/Average health/);assert.match(planning,/Choices made/);
});

test("new archives record history without scores; existing scored archives and saves remain intact",()=>{
  const storage=memory(), old=[{runId:"old-record",familyId:"ramirez",endingTitle:"Old ending",score:92,day:80,completedAt:1,survivors:3,travelers:4}];
  storage.setItem(JOURNEY_ARCHIVE_KEY,JSON.stringify(old));
  const legacy={...createInitialGame("ramirez"),narrativeEdition:undefined,day:51,score:82};
  storage.setItem(GAME_SAVE_KEY,JSON.stringify(legacy));
  const before=storage.getItem(GAME_SAVE_KEY), loaded=loadCurrentGame(storage);
  assert.equal(loaded.day,51);assert.equal(loaded.score,82);assert.equal(storage.getItem(GAME_SAVE_KEY),before);
  assert.deepEqual(loadJourneyArchive(storage),old,"old fields retained rather than destructively migrated");
  const fresh=selectFamilyGame("ramirez",{storage,restart:true});
  saveFamilyGame({...fresh,day:51,phase:"ended",status:"won",ending:{type:"released",title:"Case pending",copy:"Uncertain"}},storage);
  const entries=loadJourneyArchive(storage);
  assert.equal(Object.hasOwn(entries[0],"score"),false);
  assert.equal(entries[1].score,92);
  assert.equal(entries[0].day,51);assert.equal(entries[0].survivors,4);
});

test("Ramírez calendar and all authored paths stay before June 2024, including conservative incident/work allowance",()=>{
  const game=createInitialGame("ramirez");
  assert.equal(getJourneyDate(game),"15 January 2024");
  assert.equal(JOURNEY_HISTORY.ramirez.departureDate,"2024-01-15");
  // Dynamic programming over every branch; allow one maximum two-day incident
  // at every scene, which overestimates the actual cooldown-limited behavior.
  function latest(id){if(!id)return 0;const e=EVENTS[id];return 2+(ROADSIDE_OPPORTUNITIES[id]?1:0)+Math.max(...e.choices.map(c=>c.days+latest(c.next)));}
  const days=latest(game.eventId);
  const end=new Date("2024-01-15T12:00:00Z");end.setUTCDate(end.getUTCDate()+days);
  assert.ok(end < new Date("2024-06-05T00:00:00Z"),end.toISOString());
  assert.equal(ramirezEvents.length,15);assert.equal(ramirezEvents.reduce((n,e)=>n+e.choices.length,0),45);
  assert.match(getJourneyDate({...game,day:400}),/calendar not reconstructed/);
});

test("historical process states appointment mechanism, barriers and separate decisions without 2025 enforcement",()=>{
  const text=JSON.stringify(ramirezEvents);
  assert.doesNotMatch(text,/January 2025|President Donald Trump|whitehouse\.gov|enforcement order/);
  assert.match(EVENTS.northernWait.messages[0].body,/central or northern Mexico/);
  assert.match(EVENTS.northernWait.messages[0].body,/cannot allocate appointments or promise a date/);
  assert.match(EVENTS.borderCity.messages[0].body,/not automatic admission, parole or asylum/);
  for(const c of EVENTS.northernWait.choices)assert.match(c.outcome,/fictional/);
  assert.match(EVENTS.riverCrossing.choices.find(c=>c.id==="turnBackRiver").outcome,/did not create priority/);
  for(const id of ["policyNews","northernWait","borderCity","detention"])assert.deepEqual(getSceneHistory({familyId:"ramirez",eventId:id}).sourceIds,["usBorder2023","cbpOne2024"]);
  assert.match(HISTORY_SOURCES.usBorder2023.date,/16 May 2023/);
  assert.match(HISTORY_SOURCES.cbpOne2024.date,/21 March 2024/);
});

test("old Ramírez outcome/ending/feed copy refreshes without replay or altering resources, branches or losses",()=>{
  let legacy=chooseOption({...createInitialGame("ramirez"),eventId:"detention",day:80},"requestLawyer");
  delete legacy.narrativeEdition;
  legacy.currentOutcome.copy="old enforcement-era text";
  legacy.pendingEnding.copy="old ending";
  legacy.lastSocialOutcome={eventId:"policyNews",responseId:"verify",copy:"old policy",reactions:[]};
  const before=structuredClone(legacy), refreshed=refreshNarrative(legacy);
  assert.match(refreshed.currentOutcome.copy,/fictional outcome/);
  assert.equal(refreshed.narrativeEdition,"ramirez-2024");
  assert.equal(refreshed.ramirezNarrativeUpdated,true);
  assert.doesNotMatch(refreshed.lastSocialOutcome.copy,/old policy/);
  for(const key of ["resources","people","flags","eventId","phase","day","progress","pendingNext","runId","version","losses","activityLog"])assert.deepEqual(refreshed[key],before[key],key);
  assert.deepEqual(legacy,before);assert.equal(refreshNarrative(refreshed),refreshed);
  const storage=memory();storage.setItem(FAMILY_SAVES_KEY,JSON.stringify({ramirez:before,diop:createInitialGame("diop")}));
  const bytes=storage.getItem(FAMILY_SAVES_KEY);loadCurrentGame(storage);assert.equal(storage.getItem(FAMILY_SAVES_KEY),bytes);
});
