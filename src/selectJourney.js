import { selectFamilyGame } from "./saveStore.js";
import { loadCambodiaJourney, restartCambodiaJourney } from "./cambodiaJourneyStore.js";
export function selectJourneyGame(id,options={}) {
  if(id==="cambodia-1979")return options.restart?restartCambodiaJourney(options.storage):loadCambodiaJourney(options.storage);
  return selectFamilyGame(id,options);
}
