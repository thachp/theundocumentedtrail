import * as revised from './cambodiaStory.js';
import * as original from './legacyHouseholds/cambodiaStory.js';
import { backCambodiaJourney as backRevised } from './cambodiaJourney.js';
import { backCambodiaJourney as backOriginal } from './legacyHouseholds/cambodiaJourney.js';
export const cambodiaEdition=game=>game?.householdEdition===1?original:revised;
export const backCambodiaEdition=game=>(game.householdEdition===1?backOriginal:backRevised)(game);
