import { selectFamilyGame } from "./saveStore.js";
import { loadCambodiaJourney, restartCambodiaJourney } from "./cambodiaJourneyStore.js";
import { authoredStory } from "./authoredStories.js";
import { loadAuthoredJourney, restartAuthoredJourney } from "./authoredJourneyStore.js";
export function selectJourneyGame(id,options={}) {
  if(authoredStory(id))return options.restart?restartAuthoredJourney(id,options.storage):loadAuthoredJourney(id,options.storage);
  if(id==="cambodia-1979")return options.restart?restartCambodiaJourney(options.storage):loadCambodiaJourney(options.storage);
  return selectFamilyGame(id,options);
}
