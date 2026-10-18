import { chooseOption } from "./game.js";
import { isCambodiaJourney } from "./cambodiaJourney.js";

// Both views commit through the revision-aware save boundary. C02's reading
// preference has the same canonical record as the summary, plus opens sources.
export function commitJourneyChoice(game, choice, setGame, openHistory) {
  setGame(current => chooseOption(current, choice.id));
  if (isCambodiaJourney(game) && game.phase === "decision" && game.eventId === "C02" && choice.id === "history") openHistory();
}
