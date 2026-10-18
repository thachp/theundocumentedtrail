import {webpDimensions} from './webpDimensions.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {AUTHORED_STORIES,LEGACY_AUTHORED_STORIES} from '../src/authoredStories.js';
import {CAMBODIA_FAMILY} from '../src/cambodiaJourney.js';
import {CAMBODIA_SCENES,CAMBODIA_SOURCES} from '../src/cambodiaStory.js';
import * as oldCambodia from '../src/legacyHouseholds/cambodiaStory.js';
import {storyFamily} from '../src/authoredJourney.js';

test('four starting travelers have explicit identity/portrait geometry and new member participates beyond roster',()=>{
 for(const story of AUTHORED_STORIES){
  const family=storyFamily(story),added=story.people[3][1];assert.equal(family.people.length,4);assert.equal(new Set(family.people.map(p=>p.id)).size,4);
  for(const p of family.people){assert.ok(p.name&&p.skills.length&&p.story);assert.ok(story.portraits[p.id]);const [x,y,w,h]=p.portraitViewBox.split(' ').map(Number);assert.ok([x,y,w,h].every(Number.isFinite));assert.ok(w>0&&h>0&&x>=0&&y>=0&&x+w<=p.portraitSheet.width&&y+h<=p.portraitSheet.height);}
  for(const scene of story.scenes){assert.ok(scene.prose.includes(added),`${scene.id}: fourth traveler has authored participation`);assert.ok(scene.choices.some(c=>c.consequence.includes(added)),`${scene.id}: fourth traveler affects aftermath`);}
 }
 assert.equal(CAMBODIA_FAMILY.people.length,4);assert.equal(new Set(CAMBODIA_FAMILY.people.map(p=>p.id)).size,4);
 for(const scene of CAMBODIA_SCENES.filter(s=>s.id!=='C02')){assert.match(scene.prose,/Sophea/);assert.ok(scene.choices.some(c=>c.consequence.includes('Sophea')));}
});

test('adding fictional people preserves historical sources, geography, stable choice identities and mechanics',()=>{
 for(const story of AUTHORED_STORIES){
  const old=LEGACY_AUTHORED_STORIES.find(s=>s.id===story.id);assert.deepEqual(story.sources,old.sources);assert.deepEqual(story.glossary,old.glossary);assert.equal(story.premise,old.premise);
  assert.equal(story.scenes.length,old.scenes.length);
  story.scenes.forEach((scene,i)=>{for(const key of ['id','date','place','context','sourceIds','coordinates','bounds','stage','landKey'])assert.deepEqual(scene[key],old.scenes[i][key],`${scene.id}.${key}`);assert.deepEqual(scene.choices.map(c=>[c.id,c.cost,c.flag]),old.scenes[i].choices.map(c=>[c.id,c.cost,c.flag]));});
 }
 assert.deepEqual(CAMBODIA_SOURCES,oldCambodia.CAMBODIA_SOURCES);
 CAMBODIA_SCENES.forEach((scene,i)=>{for(const key of ['id','date','place','sourceIds','status'])assert.deepEqual(scene[key],oldCambodia.CAMBODIA_SCENES[i][key]);assert.deepEqual(scene.choices.map(c=>[c.id,c.flag]),oldCambodia.CAMBODIA_SCENES[i].choices.map(c=>[c.id,c.flag]));});
});

test('retained original art inventory verifies every original asset without changing its bytes',async()=>{
 const inventory=JSON.parse(await readFile('public/assets/legacy-households/inventory.json','utf8'));assert.equal(inventory.baselineCommit,'9afb9cd6321df88dccd31a26468a72ae2c6c7bf6');assert.equal(inventory.files.length,33);
 for(const row of inventory.files){const bytes=await readFile('public'+row.path);assert.equal(bytes.length,row.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),row.sha256);}
});


test('Cambodia revised cover and every scene have distinct verified illustrative assets',async()=>{
 const manifest=JSON.parse(await readFile('public/assets/cambodia/provenance.json','utf8'));assert.equal(manifest.householdEdition,2);assert.deepEqual(manifest.people,CAMBODIA_FAMILY.people.map(p=>p.id));assert.equal(manifest.files.length,10);const hashes=new Set();
 for(const row of manifest.files){const bytes=await readFile('public/assets/cambodia/'+row.file);assert.equal(bytes.length,row.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),row.sha256);assert.ok(!hashes.has(row.sha256));hashes.add(row.sha256);assert.deepEqual(webpDimensions(bytes),row.dimensions);assert.ok(row.prompt&&row.generator);}
});


test('revised portrait geometry uses the actual image canvas for each of four people',async()=>{
 for(const story of AUTHORED_STORIES)for(const p of storyFamily(story).people){const dimensions=webpDimensions(await readFile('public'+p.portraitImage));assert.deepEqual(dimensions,[p.portraitSheet.width,p.portraitSheet.height]);}
 const dimensions=webpDimensions(await readFile('public'+CAMBODIA_FAMILY.heroImage));assert.deepEqual(dimensions,[CAMBODIA_FAMILY.portraitSheet.width,CAMBODIA_FAMILY.portraitSheet.height]);
});
