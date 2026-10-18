import { isCambodiaJourney } from './cambodiaJourney.js';
import { isAuthoredJourney } from './authoredJourney.js';
export const isSharedHouseholdJourney=game=>isCambodiaJourney(game)||isAuthoredJourney(game);
