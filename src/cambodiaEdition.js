import * as expanded from './cambodiaExpanded/story.js';
import {backCambodiaJourney as backExpanded} from './cambodiaExpanded/journey.js';
import * as revised from './cambodiaStory.js';
import * as original from './legacyHouseholds/cambodiaStory.js';
import { backCambodiaJourney as backRevised } from './cambodiaJourney.js';
import { backCambodiaJourney as backOriginal } from './legacyHouseholds/cambodiaJourney.js';
export const cambodiaEdition=game=>game?.householdEdition===1?original:game?.householdEdition===3?expanded:revised;
export const backCambodiaEdition=game=>(game.householdEdition===1?backOriginal:game.householdEdition===3?backExpanded:backRevised)(game);
