import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

test('the shared Planning drawer renders each Cambodian traveler with their own portrait, condition and strengths', async () => {
 const server=await createServer({configFile:false,esbuild:{jsx:'automatic'},server:{middlewareMode:true,hmr:false},appType:'custom',optimizeDeps:{noDiscovery:true,include:[],entries:[]}});
 try {
  const {PlanningHeaderActions}=await server.ssrLoadModule('/src/PlanningHeaderActions.jsx');
  const controls=renderToStaticMarkup(React.createElement(PlanningHeaderActions,{guidedHref:'/?story=cambodia-1979&edition=3',soundtrackOn:false,soundtrackTheme:{label:'Journey'},onChooseJourney:()=>{},onRestart:()=>{}}));
  assert.match(controls,/aria-label="Choose a journey"/);assert.match(controls,/aria-label="Reset journey"/);
  assert.match(controls,/<details class="planning-tools"/);assert.match(controls,/<summary[^>]+aria-label="Journey tools"/);
  for(const label of ['Guided view','Explore the history','Journey log','Play soundtrack','Open-source project'])assert.ok(controls.includes(label));
  const {DetailDrawer}=await server.ssrLoadModule('/src/DetailDrawer.jsx');
  const {getPeople}=await server.ssrLoadModule('/src/game.js');
  const {newCambodiaGame}=await server.ssrLoadModule('/src/cambodiaExpanded/journey.js');
  const game=newCambodiaGame();
  for(const person of getPeople(game)) {
   const html=renderToStaticMarkup(React.createElement(DetailDrawer,{person,personState:game.people[person.id],familyId:game,stress:game.resources.stress,onClose:()=>{}}));
   assert.match(html,/class="detail-drawer"/);
   assert.ok(html.includes(`Portrait of ${person.name}`));
   assert.ok(html.includes(person.name));
   assert.ok(html.includes(person.skills[0]));
   assert.match(html,/80%/);assert.match(html,/3\/5/);
   assert.doesNotMatch(html,/drawer-medicine|cambodia-person-dialog|undefined|NaN/);
  }
 } finally {await server.close();}
});
