import { EVENTS, SOCIAL_FEEDS, STORY_THREAD_UPDATES } from "./game.js";

const PUNJAB_PROCEDURE_EDITION = "punjab-procedures-2026-10";
function refreshPunjabProcedures(game) {
  if (game.punjabProcedureEdition === PUNJAB_PROCEDURE_EDITION) return game;
  const choiceFor = (eventId, choiceId) => EVENTS[eventId]?.choices.find(choice => choice.id === choiceId);
  const currentChoice = choiceFor(game.eventId, game.currentOutcome?.id);
  const endingChoice = [...(game.history ?? [])].reverse().map(entry => choiceFor(entry.eventId, entry.choiceId)).find(choice => choice?.ending?.type === game.ending?.type);
  const refreshEnding = (ending, choice) => ending && choice?.ending?.type === ending.type
    ? { ...ending, copy: choice.ending.copy } : ending;
  const refreshThread = thread => {
    const copy = Object.values(STORY_THREAD_UPDATES).flat().find(update => update.id === thread.id && update.status === thread.status);
    return copy ? { ...thread, title: copy.title, summary: copy.summary } : thread;
  };
  return {
    ...game,
    punjabProcedureEdition: PUNJAB_PROCEDURE_EDITION,
    currentOutcome: currentChoice ? { ...game.currentOutcome, title: currentChoice.outcomeTitle, copy: currentChoice.outcome, consequence: currentChoice.consequence, threadUpdates: game.currentOutcome.threadUpdates?.map(refreshThread) } : game.currentOutcome,
    pendingEnding: refreshEnding(game.pendingEnding, currentChoice),
    ending: refreshEnding(game.ending, endingChoice),
    history: (game.history ?? []).map(entry => {
      const choice = choiceFor(entry.eventId, entry.choiceId);
      return choice ? { ...entry, choiceTitle: choice.title, outcomeTitle: choice.outcomeTitle } : entry;
    }),
    storyThreads: Object.fromEntries(Object.entries(game.storyThreads ?? {}).map(([id, thread]) => [id, refreshThread(thread)])),
    storyThreadHistory: game.storyThreadHistory?.map(refreshThread) ?? [],
  };
}

// Refresh persisted display copy without replaying a decision, applying effects,
// changing event/choice IDs, resetting a run, or invalidating another family's save.
export function refreshNarrative(game) {
  if (game.familyId === "punjab") return refreshPunjabProcedures(game);
  if (game.familyId !== "haddad" || game.narrativeEdition === "haddad-2015") return game;
  const choiceFor = (eventId, choiceId) => EVENTS[eventId]?.choices.find((choice) => choice.id === choiceId);
  const currentChoice = choiceFor(game.eventId, game.currentOutcome?.id);
  const endingChoice = [...(game.history ?? [])].reverse().map((entry) => choiceFor(entry.eventId, entry.choiceId)).find((choice) => choice?.ending?.type === game.ending?.type);
  const refreshEnding = (ending, choice) => ending && choice?.ending?.type === ending.type
    ? { ...ending, title: choice.ending.title, copy: choice.ending.copy } : ending;
  const feed = SOCIAL_FEEDS.haddadEuropeNews;
  const refreshReaction = (entry) => {
    if (!entry?.choiceId?.startsWith(`${feed.id}-`)) return entry;
    const response = entry.choiceId.slice(feed.id.length + 1);
    return feed.voice[response] ? { ...entry, text: feed.voice[response] } : entry;
  };
  const social = game.lastSocialOutcome;
  return {
    ...game,
    narrativeEdition: "haddad-2015",
    narrativeUpdated: true,
    currentOutcome: currentChoice ? { ...game.currentOutcome, title: currentChoice.outcomeTitle, copy: currentChoice.outcome } : game.currentOutcome,
    pendingEnding: refreshEnding(game.pendingEnding, currentChoice),
    ending: refreshEnding(game.ending, endingChoice),
    history: game.history.map((entry) => {
      const choice = choiceFor(entry.eventId, entry.choiceId);
      return choice ? { ...entry, location: EVENTS[entry.eventId].location, choiceTitle: choice.title, outcomeTitle: choice.outcomeTitle } : entry;
    }),
    lastSocialOutcome: social?.eventId === "haddadEuropeNews"
      ? { ...social, copy: feed.outcomes[social.responseId] ?? social.copy, reactions: social.reactions?.map(refreshReaction) }
      : social,
    relationshipNotes: Object.fromEntries(Object.entries(game.relationshipNotes ?? {}).map(([id, entry]) => [id, refreshReaction(entry)])),
    relationshipHistory: game.relationshipHistory?.map(refreshReaction) ?? [],
  };
}
