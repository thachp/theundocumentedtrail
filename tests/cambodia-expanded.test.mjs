import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,startState,chooseState,continueState,backState,validateState} from '../src/cambodiaExpanded/state.js';
const story={id:'test',start:'leave',scenes:[{id:'leave',choices:[{id:'rest',next:'care',effects:{water:-1,health:4},flags:{care:'rest'},time:2},{id:'share',next:'contact',effects:{cohesion:1}}]},{id:'care',next:'contact',choices:[{id:'help',effects:{supplies:-2}}]},{id:'contact',choices:[{id:'wait',effects:{cash:1}}]}]};
test('expanded branch replay preserves resources and actual itinerary; Back cannot undo',()=>{
 let state=startState(createState(story,2));state=chooseState(story,state,'rest');
 assert.equal(state.resources.water,3);assert.equal(state.people.maly.health,84);assert.equal(state.elapsed,2);
 assert.equal(chooseState(story,state,'rest'),state);
 assert.deepEqual(validateState(story,{...state,resources:{water:99}}),state);
 state=continueState(story,state);assert.equal(state.sceneId,'care');
 assert.equal(backState(story,state),state);assert.equal(state.resources.water,3);
 state=continueState(story,chooseState(story,startState(createState(story,2)),'share'));assert.equal(state.sceneId,'contact');
 assert.equal(state.history.some(h=>h.sceneId==='care'),false);
 state=continueState(story,chooseState(story,state,'wait'));assert.equal(state.phase,'complete');assert.deepEqual(validateState(story,state),state);
 assert.equal(validateState(story,{...state,history:[{sceneId:'care',choiceId:'help'}]}),null);
 assert.equal(validateState(story,{...state,version:4}),null);
});

import {STORY,sceneFor,CAMBODIA_SOURCES} from '../src/cambodiaExpanded/story.js';
import * as expanded from '../src/cambodiaExpanded/journey.js';
import {getEvent,chooseOption,continueJourney,getRequirementFailure,requiresTravelPlan,planTravelLeg} from '../src/game.js';
import {getJourneyGeography} from '../src/journeyGeography.js';
import {loadCambodiaJourney,restartCambodiaJourney,applyCambodiaJourneyAction,CAMBODIA_EXPANDED_ARCHIVE_KEY} from '../src/cambodiaJourneyStore.js';
const memory=()=>{const data=new Map();return {data,getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v))};};
function prefixes(){const states=new Map(),queue=[startState(createState(STORY,2))];while(queue.length){const state=queue.shift();if(states.has(state.sceneId))continue;states.set(state.sceneId,state);for(const choice of sceneFor(state).choices){const next=continueState(STORY,chooseState(STORY,state,choice.id));if(next.phase!=='complete')queue.push(next);}}return states;}
test('all 48 authored edges are reachable, dated, sourced, replayable and irreversible with bounded consequences',()=>{
 const states=prefixes();assert.equal(states.size,16);let edges=0;
 for(const [id,state]of states){const scene=sceneFor(state);assert.equal(scene.choices.length,3);for(const source of scene.sourceIds)assert.ok(CAMBODIA_SOURCES[source]?.url,`${id} ${source}`);
  const geography=getJourneyGeography(expanded.cambodiaGame(state));assert.equal(geography.current.eventId,id);assert.ok(geography.points.flat().every(Number.isFinite));
  for(const choice of scene.choices){edges++;const committed=chooseState(STORY,state,choice.id);assert.equal(committed.phase,'consequence');assert.deepEqual(validateState(STORY,committed),committed);assert.equal(chooseState(STORY,committed,choice.id),committed);assert.equal(backState(STORY,committed),committed);
   const next=continueState(STORY,committed);assert.deepEqual(validateState(STORY,next),next);if(next.phase!=='complete')assert.ok(sceneFor(next).order>=scene.order,`${id} -> ${next.sceneId}`);
   for(const value of Object.values(next.resources))assert.ok(value>=0&&value<=20);for(const person of Object.values(next.people))assert.ok(person.alive&&person.health>0&&person.health<=100&&person.trust>=0&&person.trust<=5);
  }
 }
 assert.equal(edges,48);
});
test('shortages carry forward to care/work; camp exchange settles once and cannot be undone; admission has no resource gate',()=>{
 const state=prefixes().get('E07');const low={...state,resources:{...state.resources,supplies:0}},high={...state,resources:{...state.resources,supplies:8}};
 const a=chooseState(STORY,low,'repair'),b=chooseState(STORY,high,'repair');assert.equal(a.people.dara.health,b.people.dara.health-5);assert.match(a.lastNote,/earlier decisions/);assert.equal(a.resources.cash,low.resources.cash+1);
 assert.equal(chooseState(STORY,a,'repair'),a);assert.equal(backState(STORY,a).resources.cash,a.resources.cash);
 const poor={...prefixes().get('E03'),resources:{cash:0,supplies:0,water:0,stress:2}};assert.equal(chooseState(STORY,poor,'offer'),poor);assert.match(getRequirementFailure(expanded.cambodiaGame(poor),getEvent(expanded.cambodiaGame(poor)).choices[2]),/no longer/);
 const application=prefixes().get('E08');for(const choice of sceneFor(application).choices){const result=continueState(STORY,chooseState(STORY,{...application,resources:{cash:0,supplies:0,water:0,stress:20}},choice.id));assert.equal(result.sceneId,'E09');}
});
test('edition 3 writes only its own save/archive; original editions and neighbors remain byte-identical; stale and unreadable protected',()=>{
 const storage=memory();for(const key of ['undocumented-trail:review:cambodia-1979:v1','undocumented-trail:review:cambodia-1979:v2','undocumented-trail:review:cambodia-1979:archive:v1','undocumented-trail:review:cambodia-1979:archive:v2','the-undocumented-trail-family-saves-v1','the-undocumented-trail-journey-archive-v1'])storage.setItem(key,'preserved sentinel');
 const before=[...storage.data];let game=restartCambodiaJourney(storage);assert.equal(game.householdEdition,3);let old;
 while(game.phase!=='ended'){old=game;const event=getEvent(game);game=applyCambodiaJourneyAction(game,game.phase==='outcome'?(requiresTravelPlan(game)?g=>planTravelLeg(g,'steady',g.controlModel.leads.find(p=>!p.unavailable).personId):continueJourney):g=>chooseOption(g,event.choices[0].id),storage);assert.deepEqual(loadCambodiaJourney(storage).cambodiaState,game.cambodiaState);}
 assert.deepEqual(applyCambodiaJourneyAction(old,continueJourney,storage),game);assert.equal(JSON.parse(storage.getItem(CAMBODIA_EXPANDED_ARCHIVE_KEY)).length,1);
 const archive=storage.getItem(CAMBODIA_EXPANDED_ARCHIVE_KEY);restartCambodiaJourney(storage);assert.equal(storage.getItem(CAMBODIA_EXPANDED_ARCHIVE_KEY),archive);for(const [k,v]of before)assert.equal(storage.getItem(k),v);
 storage.setItem(expanded.CAMBODIA_SAVE_KEY,'{"version":99}');game=loadCambodiaJourney(storage);assert.equal(game.saveWritable,false);assert.equal(storage.getItem(expanded.CAMBODIA_SAVE_KEY),'{"version":99}');
});
test('parallel 1985 chapter never moves the four travelers to Site One or Site Two, and earlier branch decisions change actual itinerary',()=>{
 const states=prefixes();assert.ok(states.get('R01'));const main=states.get('E04');assert.equal(main.history.some(h=>h.sceneId==='R01'),false);
 for(const id of ['P01','P02']){const state=states.get(id);assert.match(sceneFor(state).date,/1985/);const geo=getJourneyGeography(expanded.cambodiaGame(state));assert.deepEqual(geo.current.coordinates,[-118.19,33.77]);assert.equal(geo.landKey,'longBeachRegion');assert.ok(geo.points.every(([x,y])=>x>=0&&x<=600&&y>=0&&y<=500));assert.match(geo.note,/not stops/);}
});

test('expanded art exists with verified hashes; every scene has an informative activity alternative and age continuity',async()=>{
 const {readFile,stat}=await import('node:fs/promises'),{createHash}=await import('node:crypto');const manifest=JSON.parse(await readFile('public/assets/cambodia/expanded-provenance.json','utf8'));assert.equal(manifest.householdEdition,3);assert.equal(manifest.people.length,4);
 for(const file of manifest.files){const bytes=await readFile(`public/assets/cambodia/${file.file}`);assert.equal(createHash('sha256').update(bytes).digest('hex'),file.sha256);assert.equal(bytes.length,file.bytes);assert.equal(file.dimensions.length,2);}
 for(const state of prefixes().values()){const game=expanded.cambodiaGame(state),event=getEvent(game);assert.ok((await stat(`public${event.heroImage}`)).size>1000);assert.doesNotMatch(event.heroAlt,/undefined/);assert.match(event.heroAlt,/fictional illustration/);}
 assert.deepEqual(expanded.familyFor(expanded.cambodiaGame(prefixes().get('P01'))).people.map(p=>p.age),[30,29,55,28]);
 const last=prefixes().get('E11'),game=chooseOption(expanded.cambodiaGame(last),'letter');assert.equal(game.pendingEnding,null);assert.equal(continueJourney(game).eventId,'P01');
});

test('Site Two distinguishes March displacement from June facilities and credits the source accurately',()=>{
 const scene=STORY.scenes.find(scene=>scene.id==='P02');
 assert.match(scene.date,/March 1985/);assert.match(scene.prose,/March account concerns displacement and initial relief/);
 assert.match(scene.context,/June 1985/);assert.match(scene.context,/not presented as already available/);
 assert.match(CAMBODIA_SOURCES.E4.title,/Soriya J\.-M\. Birsens s\.j\./);
 assert.match(CAMBODIA_SOURCES.E4.title,/Vluchteling in Samlor Chngangn/);
});
