import mariel from './marielStory.js';
import vietnam from './vietnamBidongStory.js';
import legacyMariel from './legacyHouseholds/marielStory.js';
import legacyVietnam from './legacyHouseholds/vietnamBidongStory.js';
export const AUTHORED_STORIES = [mariel, vietnam].map(s=>({...s,edition:2}));
export const LEGACY_AUTHORED_STORIES = [legacyMariel,legacyVietnam].map(s=>({...s,edition:1,assetRoot:`/assets/legacy-households/${s.id}`}));
export const authoredStory = gameOrId => {
 const id=typeof gameOrId==='string'?gameOrId:gameOrId?.familyId;
 return (typeof gameOrId==='object'&&gameOrId?.householdEdition===1?LEGACY_AUTHORED_STORIES:AUTHORED_STORIES).find(s=>s.id===id);
};
export const authoredEdition=(id,edition=2)=>(edition===1?LEGACY_AUTHORED_STORIES:AUTHORED_STORIES).find(s=>s.id===id);
