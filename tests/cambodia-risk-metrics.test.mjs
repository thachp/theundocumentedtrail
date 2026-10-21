import test from 'node:test';
import assert from 'node:assert/strict';
import {newCambodiaGame,cambodiaGame} from '../src/cambodiaExpanded/journey.js';
import {chooseOption,continueJourney,useMedicine} from '../src/game.js';
import {exposurePercent,stressPercent} from '../src/cambodiaExpanded/riskMetrics.js';
import {sceneFor} from '../src/cambodiaExpanded/story.js';
import {validateState,createState} from '../src/cambodiaExpanded/state.js';
import {STORY} from '../src/cambodiaExpanded/story.js';

test('risk percentages are bounded, replayable and preserve original saved stress units',()=>{
 const game=newCambodiaGame(),before=JSON.stringify(game.cambodiaState);
 assert.equal(game.resources.stress,10);assert.equal(game.resources.exposure,12);
 assert.equal(game.cambodiaState.resources.stress,2);assert.equal(JSON.stringify(game.cambodiaState),before);
 const treated=useMedicine(game,'dara');assert.equal(treated.resources.stress,0);
 assert.equal(stressPercent({...game.cambodiaState,resources:{stress:20}}),100);
 assert.equal(stressPercent({...game.cambodiaState,resources:{stress:-1}}),0);
 assert.deepEqual(cambodiaGame(validateState(STORY,game.cambodiaState)).resources,game.resources);
});
test('trusted coordination and unverified offers have different persistent exposure',()=>{
 let game=continueJourney(chooseOption(cambodiaGame(createState(STORY,3)),'food'));
 game=continueJourney(chooseOption(game,'bundles'));
 const trusted=chooseOption(game,'help'),offer=chooseOption(game,'offer');
 assert.ok(offer.resources.exposure>trusted.resources.exposure);
 assert.equal(offer.resources.exposure,cambodiaGame(validateState(STORY,offer.cambodiaState)).resources.exposure);
 const state={...offer.cambodiaState,sceneId:'E10'};
 assert.ok(exposurePercent(state,sceneFor(state))<offer.resources.exposure);
});
