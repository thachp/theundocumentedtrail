import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { STORY } from '../src/cambodiaExpanded/story.js';
import { createState, startState, chooseState, continueState, planState, resupplyState } from '../src/cambodiaExpanded/state.js';
import { cambodiaGame, requiresCambodiaPlan } from '../src/cambodiaExpanded/journey.js';
import { treatTraveler } from '../src/cambodiaExpanded/medicine.js';

const choose = (state, id) => chooseState(STORY, startState(state), id);
const advance = state => continueState(STORY, state);
const plan = state => planState(STORY, state, 'careful', 'sophea');
const render = (Component, props) => renderToStaticMarkup(React.createElement(Component, props));
const buttons = html => [...html.matchAll(/<button\b[^>]*>[\s\S]*?<\/button>/g)].map(match => match[0]);
const disabled = button => /<button\b[^>]*\bdisabled=""/.test(button);
const noInvalidDisplay = html => assert.doesNotMatch(html, /undefined|NaN|Infinity/);

// This deliberately renders the real shared components, not source-code patterns.
// SSR verifies markup and initial disabled states; it does not claim browser layout,
// focus, clicks, or post-selection React state behavior.
test('rules-4 border scenes retain live HUD, care, narrative and illustrated maps around the real travel planner', async () => {
  const server = await createServer({configFile:false, esbuild:{jsx:'automatic'}, server:{middlewareMode:true,hmr:false}, appType:'custom', optimizeDeps:{noDiscovery:true,include:[],entries:[]}});
  try {
    const { CambodiaTravelPlanner, CambodiaResupply } = await server.ssrLoadModule('/src/CambodiaTravelControls.jsx');
    const { CambodiaResources, CambodiaJourneyContext } = await server.ssrLoadModule('/src/CambodiaJourneyUI.jsx');
    const { IllustratedJourneyMap } = await server.ssrLoadModule('/src/IllustratedJourneyMap.jsx');
    const { DetailDrawer } = await server.ssrLoadModule('/src/DetailDrawer.jsx');
    const { getPeople } = await server.ssrLoadModule('/src/game.js');

    let state = advance(choose(createState(STORY), 'food'));
    const firstPending = choose(state, 'summary');
    assert.equal(firstPending.sceneId, 'E02');
    state = advance(plan(firstPending));
    state = advance(plan(choose(state, 'group')));
    assert.equal(state.sceneId, 'M01');
    const mineDecision = state;
    const mineConsequence = choose(state, 'assistance');
    const onwardDecision = advance(mineConsequence);
    assert.equal(onwardDecision.sceneId, 'M02');
    const onwardPending = choose(onwardDecision, 'care');
    const onwardCommitted = plan(onwardPending);
    assert.equal(onwardCommitted.pendingLeg.complete, true);

    for (const pending of [firstPending, onwardPending]) {
      const game = cambodiaGame(pending);
      assert.equal(requiresCambodiaPlan(game), true);
      const html = render(CambodiaTravelPlanner, {game, onChoose:()=>{}});
      const renderedButtons = buttons(html);
      const leadButtons = renderedButtons.filter(button => game.controlModel.leads.some(lead => button.includes(`<strong>${lead.name}</strong>`)));
      assert.equal(leadButtons.length, 4, 'every named traveler remains in the coordinator controls');
      for (const lead of game.controlModel.leads) {
        const button = leadButtons.find(button => button.includes(`<strong>${lead.name}</strong>`));
        assert.equal(disabled(button), Boolean(lead.unavailable), lead.name);
      }
      const paceButtons = renderedButtons.filter(button => game.controlModel.paces.some(pace => button.includes(`<strong>${pace.title}</strong>`)));
      assert.equal(paceButtons.length, 3);
      assert.ok(paceButtons.every(disabled), 'pace is locked until a coordinator is selected');
      assert.ok(!html.includes('Commit travel plan'), 'the initial render cannot commit an unreviewed plan');
      noInvalidDisplay(html);
    }

    for (const current of [mineDecision, mineConsequence, onwardDecision, onwardPending, onwardCommitted]) {
      const game = cambodiaGame(current);
      const map = render(IllustratedJourneyMap, {game});
      assert.ok(map.includes('data-map-location="border"'), `${current.sceneId} uses border art`);
      assert.ok(map.includes('src="/assets/cambodia/border-journey-map.png"'));
      assert.ok(map.includes('Geographic map &amp; visited itinerary'));
      assert.ok(map.includes(`data-event="${current.sceneId}"`));
      noInvalidDisplay(map);

      for (const variant of ['guided', 'planning']) {
        const hud = render(CambodiaResources, {game, variant});
        const labels = [...hud.matchAll(/aria-label="(Exchange|Food|Water|Medicine|Stress|Exposure):/g)].map(match=>match[1]);
        assert.deepEqual(labels, ['Exchange','Food','Water','Medicine','Stress','Exposure']);
        assert.ok(hud.includes(`Stress: ${game.resources.stress}%`));
        assert.ok(hud.includes(`Exposure: ${game.resources.exposure}%`));
        assert.ok(!hud.includes('aria-label="Health:'));
        assert.ok(!hud.includes('aria-label="Cohesion:'));
        noInvalidDisplay(hud);
      }
      const narrative = render(CambodiaJourneyContext, {game});
      assert.ok(narrative.includes('What they carry'));
      noInvalidDisplay(narrative);
      assert.equal(render(CambodiaResupply, {game, onBuy:()=>{}}), '', 'border scenes do not invent a supply stop');
    }

    const treated = cambodiaGame(treatTraveler(onwardPending, 'vann'));
    assert.equal(treated.resources.medicine, 1);
    const vann = getPeople(treated).find(person=>person.id==='vann');
    const care = render(DetailDrawer, {person:vann, personState:treated.people.vann, medicine:treated.resources.medicine, stress:treated.resources.stress, familyId:treated, onUseMedicine:()=>{}, onClose:()=>{}});
    assert.ok(care.includes('Portrait of Vann'));
    assert.ok(care.includes('Leg injury'));
    assert.ok(care.includes(`Use medicine · ${treated.resources.medicine} available`));
    assert.ok(care.includes(vann.skills[0]));
    noInvalidDisplay(care);
    const committed = cambodiaGame(onwardCommitted);
    assert.equal(requiresCambodiaPlan(committed), false);
    assert.equal(committed.currentOutcome.travelPlan.personId, 'sophea');
    assert.ok(committed.currentOutcome.copy.includes('Sophea coordinates'));
  } finally {
    await server.close();
  }
});

test('the real resupply disclosure retains bounded purchase receipts alongside the live resource HUD', async () => {
  const server = await createServer({configFile:false, esbuild:{jsx:'automatic'}, server:{middlewareMode:true,hmr:false}, appType:'custom', optimizeDeps:{noDiscovery:true,include:[],entries:[]}});
  try {
    const { CambodiaResupply } = await server.ssrLoadModule('/src/CambodiaTravelControls.jsx');
    const { CambodiaResources } = await server.ssrLoadModule('/src/CambodiaJourneyUI.jsx');
    const fresh = startState(createState(STORY));
    const purchased = resupplyState(STORY, fresh, 'food');
    for (const state of [fresh, purchased]) {
      const game = cambodiaGame(state);
      const html = render(CambodiaResupply, {game, onBuy:()=>{}});
      assert.ok(html.includes('<details'));
      assert.ok(html.includes('Optional before choosing'));
      assert.ok(html.includes('exchange units'));
      assert.ok(html.includes('capacity is 12 units each'));
      assert.equal(buttons(html).length, 2);
      const foodButton = buttons(html).find(button=>button.includes('Prepare carried food'));
      assert.equal(disabled(foodButton), state===purchased);
      if (state===purchased) {
        assert.ok(html.includes('Allocation already collected here'));
        assert.ok(html.includes('role="status"'));
        assert.ok(html.includes('1 exchange units used'));
      }
      noInvalidDisplay(html + render(CambodiaResources, {game, variant:'planning'}));
    }
  } finally {
    await server.close();
  }
});
