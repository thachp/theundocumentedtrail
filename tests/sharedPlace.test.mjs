import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { createInitialGame, FAMILY_PRESETS, isSavedGameValid, GAME_SAVE_KEY } from "../src/game.js";
import { loadFamilySaves, saveFamilyGame, FAMILY_SAVES_KEY } from "../src/saveStore.js";
import { ROOM_PLANS, ROOM_SCENARIO, SHARED_PLACE, SHARED_PLACE_SOURCES, exploreRoomPlan, sharedPlaceAvailable } from "../src/sharedPlace.js";
test("the increment is limited to one UK event, with dated evidence separate from the fictional encounter",()=>{
 for(const family of Object.keys(FAMILY_PRESETS))assert.equal(sharedPlaceAvailable(createInitialGame(family)),false);
 assert.equal(sharedPlaceAvailable({...createInitialGame("nguyen"),eventId:"nguyenPolicy"}),true);
 assert.equal(sharedPlaceAvailable({...createInitialGame("haddad"),eventId:"nguyenPolicy"}),false);
 assert.match(SHARED_PLACE.setting,/United Kingdom/);assert.match(SHARED_PLACE.fiction,/2025/);assert.match(SHARED_PLACE.fiction,/not a new visited stop/);
 assert.ok(SHARED_PLACE_SOURCES.every(s=>s.published.includes("2025")&&s.url.startsWith("https://")));
});
test("newcomer, earlier-immigrant resident, other resident and staff voices each have agency, constraints and relationships",()=>{
 assert.equal(SHARED_PLACE.voices.length,5);
 for(const v of SHARED_PLACE.voices)for(const field of ["id","name","role","goal","constraint","relationship","words"])assert.ok(v[field],`${v.id}: ${field}`);
 assert.ok(SHARED_PLACE.voices.some(v=>v.role.includes("earlier immigrant")));
 assert.equal(SHARED_PLACE.voices.filter(v=>v.role.includes("Newcomer")).length,2);
 assert.match(SHARED_PLACE.voices.find(v=>v.id==="asha").relationship,/disagrees with Ruth/);
 assert.match(SHARED_PLACE.voices.find(v=>v.id==="mai").relationship,/disagree/);
 assert.match(SHARED_PLACE.evidenceBoundary,/unverified belief/);assert.match(SHARED_PLACE.evidenceBoundary,/no one’s ancestry/);
 assert.match(SHARED_PLACE.future,/No individual’s future fiscal surplus/);
});
test("capacity is bounded by staffing and room time, with today/later and conditional funding made explicit",()=>{
 assert.equal(exploreRoomPlan("unknown"),null);
 for(const p of ROOM_PLANS){const r=exploreRoomPlan(p.id);assert.equal(r.todayCapacity,Math.min(p.todayStaff,p.todayRoom));assert.equal(r.todayUnmet,Math.max(0,ROOM_SCENARIO.demand-r.todayCapacity));assert.equal(r.laterUnmet,Math.max(0,ROOM_SCENARIO.demand-r.laterCapacity));assert.match(r.limit,/not a forecast/);assert.ok(r.assumption&&r.tradeoff);}
 assert.equal(exploreRoomPlan("existing").todayUnmet,1);
 assert.equal(exploreRoomPlan("overtime").todayUnmet,0);assert.match(exploreRoomPlan("overtime").assumption,/staff agree and funding and room access/);
 const later=exploreRoomPlan("later");assert.equal(later.todayUnmet,1);assert.equal(later.laterUnmet,0);assert.match(later.assumption,/not an award/);
});
test("the only financial figure carries category, year, geography, government level, denominator, source and uncertainty",()=>{
 const figures=SHARED_PLACE_SOURCES.filter(s=>s.amount);assert.equal(figures.length,1);
 const s=figures[0];for(const k of ["population","period","geography","governmentLevel","denominator","url","published","scope","limit"])assert.ok(s[k],k);
 assert.match(s.amount,/£4.0 billion/);assert.match(s.period,/2024–25/);assert.match(s.governmentLevel,/Home Office/);assert.match(s.denominator,/no per-person denominator/);assert.match(s.limit,/family is not assumed/);
});
test("exploration preserves current and legacy saves for all journeys; no new game/version/score/store path",async()=>{
 const data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};
 for(const id of Object.keys(FAMILY_PRESETS))saveFamilyGame(createInitialGame(id),storage);
 const beforePrimary=data.get(FAMILY_SAVES_KEY),beforeLegacy=data.get(GAME_SAVE_KEY),before=loadFamilySaves(storage);
 for(const p of ROOM_PLANS)exploreRoomPlan(p.id);
 assert.equal(data.get(FAMILY_SAVES_KEY),beforePrimary);assert.equal(data.get(GAME_SAVE_KEY),beforeLegacy);
 assert.deepEqual(loadFamilySaves(storage),before);assert.ok(Object.values(before).every(isSavedGameValid));
 const module=await readFile(new URL("../src/SharedPlaceContext.jsx",import.meta.url),"utf8");
 assert.doesNotMatch(module,/localStorage|sessionStorage|setGame|saveFamilyGame|chooseOption/);
});
