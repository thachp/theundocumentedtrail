import mariel from './marielStory.js';
export const AUTHORED_STORIES = [mariel];
export const authoredStory = gameOrId => AUTHORED_STORIES.find(s => s.id === (typeof gameOrId === 'string' ? gameOrId : gameOrId?.familyId));
