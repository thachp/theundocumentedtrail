import mariel from './marielStory.js';
import vietnam from './vietnamBidongStory.js';
export const AUTHORED_STORIES = [mariel, vietnam];
export const authoredStory = gameOrId => AUTHORED_STORIES.find(s => s.id === (typeof gameOrId === 'string' ? gameOrId : gameOrId?.familyId));
