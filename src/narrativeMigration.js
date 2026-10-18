import { EVENTS, SOCIAL_FEEDS, CHOICE_REACTIONS } from "./game.js";

// Refresh persisted display copy without replaying a decision, applying effects,
// changing event/choice IDs, resetting a run, or invalidating another family's save.
export function refreshNarrative(game) {
  const ramirez = game.familyId === "ramirez";
  const edition = ramirez ? "ramirez-2024" : "haddad-2015";
  if ((!ramirez && game.familyId !== "haddad") || game.narrativeEdition === edition) return game;
  const choiceFor = (eventId, choiceId) => EVENTS[eventId]?.choices.find((choice) => choice.id === choiceId);
  const currentChoice = choiceFor(game.eventId, game.currentOutcome?.id);
  const endingChoice = [...(game.history ?? [])].reverse().map((entry) => choiceFor(entry.eventId, entry.choiceId)).find((choice) => choice?.ending?.type === game.ending?.type);
  const refreshEnding = (ending, choice) => ending && choice?.ending?.type === ending.type
    ? { ...ending, title: choice.ending.title, copy: choice.ending.copy } : ending;
  const feed = ramirez ? SOCIAL_FEEDS.policyNews : SOCIAL_FEEDS.haddadEuropeNews;
  const refreshReaction = (entry) => {
    if (ramirez) {
      const reaction = CHOICE_REACTIONS[entry?.choiceId]?.find(item => item.personId === entry.personId);
      if (reaction) return { ...entry, text: reaction.text };
    }
    if (!entry?.choiceId?.startsWith(`${feed.id}-`)) return entry;
    const response = entry.choiceId.slice(feed.id.length + 1);
    return feed.voice[response] ? { ...entry, text: feed.voice[response] } : entry;
  };
  const social = game.lastSocialOutcome;
  return {
    ...game,
    narrativeEdition: edition,
    ...(ramirez ? { ramirezNarrativeUpdated: true } : { narrativeUpdated: true }),
    currentOutcome: currentChoice ? { ...game.currentOutcome, title: currentChoice.outcomeTitle, copy: currentChoice.outcome, ...(ramirez ? { reactions: game.currentOutcome.reactions?.map(refreshReaction) } : {}) } : game.currentOutcome,
    pendingEnding: refreshEnding(game.pendingEnding, currentChoice),
    ending: refreshEnding(game.ending, endingChoice),
    history: game.history.map((entry) => {
      const choice = choiceFor(entry.eventId, entry.choiceId);
      return choice ? { ...entry, location: EVENTS[entry.eventId].location, choiceTitle: choice.title, outcomeTitle: choice.outcomeTitle } : entry;
    }),
    lastSocialOutcome: social?.eventId === (ramirez ? "policyNews" : "haddadEuropeNews")
      ? { ...social, copy: feed.outcomes[social.responseId] ?? social.copy, reactions: social.reactions?.map(refreshReaction) }
      : social,
    relationshipNotes: Object.fromEntries(Object.entries(game.relationshipNotes ?? {}).map(([id, entry]) => [id, refreshReaction(entry)])),
    relationshipHistory: game.relationshipHistory?.map(refreshReaction) ?? [],
  };
}
