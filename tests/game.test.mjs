import assert from "node:assert/strict";
import test from "node:test";
import {
  EVENTS,
  ROADSIDE_OPPORTUNITIES,
  chooseOption,
  continueJourney,
  createInitialGame,
  getChoiceBonuses,
  getRoadsideOpportunity,
  getRequirementFailure,
  getTravelPlanOptions,
  getJourneyScore,
  getPortraitImage,
  getPortraitMood,
  hasCompletedRoadsideWork,
  planTravelLeg,
  requiresTravelPlan,
  takeRoadsideJob,
  useMedicine,
} from "../src/game.js";

const chooseAndContinue = (game, choiceId, strategyId = "steady") => {
  let next = chooseOption(game, choiceId);
  if (requiresTravelPlan(next)) next = planTravelLeg(next, strategyId);
  return continueJourney(next);
};

test("starts the Ramirez family at home with journey resources", () => {
  const game = createInitialGame();

  assert.equal(game.eventId, "home");
  assert.equal(game.day, 1);
  assert.equal(game.phase, "decision");
  assert.equal(game.resources.cash, 1800);
  assert.equal(game.resources.water, 18);
  assert.deepEqual(game.completedRoadsideWork, {});
  assert.deepEqual(game.activityLog, []);
  assert.deepEqual(game.relationshipNotes, {});
  assert.deepEqual(game.relationshipHistory, []);
  assert.deepEqual(game.storyThreads, {});
  assert.deepEqual(game.flags, {});
  assert.deepEqual(Object.keys(game.people), ["marisol", "edwin", "daniela", "aurelia"]);
});

test("short-term work can be completed once without replacing the main decision", () => {
  let game = chooseAndContinue(createInitialGame(), "leaveDawn");
  const opportunity = getRoadsideOpportunity(game);

  assert.equal(opportunity.id, "terminalCafe");
  assert.equal(hasCompletedRoadsideWork(game), false);

  const beforeDay = game.day;
  game = takeRoadsideJob(game, "washDishes");

  assert.equal(game.phase, "decision");
  assert.equal(game.eventId, "guideOffer");
  assert.equal(game.day, beforeDay + 1);
  assert.equal(game.resources.cash, 1855);
  assert.equal(game.resources.supplies, 6);
  assert.equal(hasCompletedRoadsideWork(game), true);
  assert.equal(game.lastRoadsideOutcome.id, "washDishes");

  assert.equal(takeRoadsideJob(game, "packBread"), game);
});

test("the opening decision changes resources and advances to the guide offer", () => {
  const start = createInitialGame();
  const outcome = chooseOption(start, "safeHouse");

  assert.equal(outcome.phase, "outcome");
  assert.equal(outcome.resources.cash, 1720);
  assert.equal(outcome.resources.stress, 34);
  assert.equal(outcome.progress, 4);
  assert.equal(outcome.history.length, 1);

  const next = continueJourney(outcome);
  assert.equal(next.phase, "decision");
  assert.equal(next.eventId, "guideOffer");
  assert.equal(next.day, 3);
});

test("a long leg requires one simple travel plan before continuing", () => {
  let game = createInitialGame();
  game = chooseAndContinue(game, "safeHouse");
  game = chooseAndContinue(game, "churchBus");
  game = chooseAndContinue(game, "callForHelp");
  game = chooseOption(game, "stayShelter");

  assert.equal(requiresTravelPlan(game), true);
  assert.equal(continueJourney(game), game);
  assert.deepEqual(getTravelPlanOptions(game).map((option) => option.id), ["conserve", "steady", "recover"]);

  game = planTravelLeg(game, "steady");
  assert.equal(requiresTravelPlan(game), false);
  assert.equal(game.currentOutcome.travelPlan.id, "steady");
  assert.equal(game.activityLog.at(-1).kind, "travel");
  assert.equal(continueJourney(game).eventId, "waitingTown");
});

test("medicine is visible game state and can restore a traveler's health", () => {
  const start = createInitialGame();
  const game = useMedicine(start, "aurelia");

  assert.equal(game.resources.medicine, 0);
  assert.equal(game.people.aurelia.health, 80);
  assert.equal(game.resources.stress, 40);
  assert.equal(game.activityLog.at(-1).kind, "care");
  assert.equal(useMedicine(game, "aurelia"), game);
});

test("portrait expressions respond to personal health and group stress", () => {
  assert.equal(getPortraitMood({ health: 90, alive: true }, 20), "healthy");
  assert.equal(getPortraitMood({ health: 65, alive: true }, 20), "strained");
  assert.equal(getPortraitMood({ health: 90, alive: true }, 60), "strained");
  assert.equal(getPortraitMood({ health: 90, alive: true }, 85), "critical");
  assert.equal(getPortraitMood({ health: 40, alive: true }, 10), "critical");
  assert.equal(getPortraitMood({ health: 0, alive: false }, 0), "critical");
  assert.match(getPortraitImage({ health: 90, alive: true }, 60), /strained\.webp$/);
});

test("skills and earlier preparation change later outcomes", () => {
  const start = createInitialGame();
  const collectPapers = EVENTS.home.choices.find((choice) => choice.id === "collectPapers");
  assert.match(getChoiceBonuses(start, collectPapers)[0].label, /back path/i);

  const afterPapers = chooseOption(start, "collectPapers");
  assert.equal(afterPapers.flags.landPapers, true);
  assert.equal(afterPapers.resources.exposure, 26);

  const lawyer = EVENTS.detention.choices.find((choice) => choice.id === "requestLawyer");
  assert.match(getChoiceBonuses({ ...afterPapers, eventId: "detention" }, lawyer)[0].label, /land deed/i);
});

test("choices change individual trust and preserve each person's latest reaction", () => {
  const game = chooseOption(createInitialGame(), "collectPapers");

  assert.equal(game.people.aurelia.trust, 3);
  assert.equal(game.currentOutcome.reactions[0].personName, "Aurelia");
  assert.equal(game.currentOutcome.reactions[0].trustDelta, -1);
  assert.match(game.relationshipNotes.aurelia.text, /wish you had not gone back/i);
  assert.equal(game.relationshipHistory.length, 1);
});

test("an earlier shelter choice returns as a later payoff and resolves its story thread", () => {
  let game = createInitialGame();
  game = chooseAndContinue(game, "safeHouse");

  assert.equal(game.storyThreads.shelterNetwork.status, "active");
  assert.equal(game.flags.shelterContacts, true);

  game = chooseAndContinue(game, "churchBus");
  game = chooseAndContinue(game, "callForHelp");
  game = chooseOption(game, "stayShelter");

  assert.equal(game.storyThreads.shelterNetwork.status, "resolved");
  assert.match(game.currentOutcome.returningConsequences[0].label, /verified list/i);
  assert.equal(game.storyThreadHistory.filter((entry) => entry.id === "shelterNetwork").length, 2);
});

test("choices with unmet requirements remain unavailable", () => {
  let game = chooseAndContinue(createInitialGame(), "leaveDawn");
  game = { ...game, resources: { ...game.resources, cash: 800 } };
  const coyote = { requires: { cash: 900 } };

  assert.equal(getRequirementFailure(game, coyote), "Requires $900");
  assert.equal(chooseOption(game, "hireCoyote"), game);
});

test("a support-network route can end in release while the case continues", () => {
  let game = createInitialGame();
  game = chooseAndContinue(game, "safeHouse");
  game = chooseAndContinue(game, "churchBus");
  game = chooseAndContinue(game, "callForHelp");
  game = chooseAndContinue(game, "stayShelter");
  game = chooseAndContinue(game, "rentWhileWaiting");
  game = chooseAndContinue(game, "waitForClinic");
  game = chooseAndContinue(game, "busNorth");
  game = chooseAndContinue(game, "waitForShelterVan");
  game = chooseAndContinue(game, "callLegalAid");
  game = chooseAndContinue(game, "verifiedWaitlist");
  game = chooseAndContinue(game, "officialAppointment");
  game = chooseOption(game, "requestLawyer");

  assert.equal(game.pendingEnding.type, "released");

  game = continueJourney(game);
  assert.equal(game.phase, "ended");
  assert.equal(game.status, "won");
  assert.equal(game.progress, 100);
  assert.equal(game.history.length, 12);
  assert.equal(game.day, 82);
  assert.ok(getJourneyScore(game) >= 40);
});

test("the overloaded boat branch records Daniela's death and continues to a memorial", () => {
  let game = createInitialGame();
  game = chooseAndContinue(game, "leaveDawn");
  game = chooseAndContinue(game, "churchBus");
  game = chooseAndContinue(game, "callForHelp");
  game = chooseAndContinue(game, "stayShelter");
  game = chooseAndContinue(game, "shelterRotation");
  game = chooseAndContinue(game, "waitForClinic");
  game = chooseAndContinue(game, "busNorth");
  game = chooseAndContinue(game, "waitForShelterVan");
  game = chooseAndContinue(game, "callLegalAid");
  game = chooseAndContinue(game, "rentNorthernRoom");
  game = chooseAndContinue(game, "boatOffer");
  game = chooseOption(game, "boardOverloaded");

  assert.equal(game.people.daniela.alive, false);
  assert.equal(game.people.daniela.health, 0);
  assert.deepEqual(game.losses, ["daniela"]);
  assert.equal(game.activityLog.at(-1).kind, "remembrance");
  assert.equal(game.pendingNext, "memorial");
  assert.equal(game.pendingEnding, null);

  game = continueJourney(game);
  assert.equal(game.eventId, "memorial");
});

test("health reaching zero records a death while surviving relatives continue", () => {
  let game = createInitialGame();
  game = {
    ...game,
    people: { ...game.people, aurelia: { ...game.people.aurelia, health: 3 } },
  };

  game = chooseOption(game, "collectPapers");

  assert.equal(game.people.aurelia.alive, false);
  assert.equal(game.people.aurelia.health, 0);
  assert.deepEqual(game.losses, ["aurelia"]);
  assert.equal(game.activityLog.at(-1).kind, "remembrance");
  assert.equal(game.pendingEnding, null);
  assert.equal(continueJourney(game).eventId, "guideOffer");
});

test("the journey ends when no family member remains alive", () => {
  let game = createInitialGame();
  game = {
    ...game,
    losses: ["marisol", "edwin", "daniela"],
    people: {
      marisol: { ...game.people.marisol, health: 0, alive: false },
      edwin: { ...game.people.edwin, health: 0, alive: false },
      daniela: { ...game.people.daniela, health: 0, alive: false },
      aurelia: { ...game.people.aurelia, health: 3 },
    },
  };

  game = chooseOption(game, "collectPapers");

  assert.equal(game.pendingEnding.type, "all_lost");
  assert.deepEqual(game.losses, ["marisol", "edwin", "daniela", "aurelia"]);
  game = continueJourney(game);
  assert.equal(game.status, "stopped");
  assert.match(game.ending.title, /no one can continue/i);
});

test("extreme stress concludes the journey without a death achievement", () => {
  let game = createInitialGame();
  game.resources.stress = 94;
  game = chooseOption(game, "leaveDawn");

  assert.equal(game.pendingEnding.type, "stress");
  game = continueJourney(game);
  assert.equal(game.status, "stopped");
  assert.match(game.ending.title, /cannot keep moving/i);
});

test("authored content links to valid events and keeps the three-choice rhythm", () => {
  const choiceIds = new Set();
  for (const event of Object.values(EVENTS)) {
    assert.equal(event.choices.length, 3, `${event.id} should have three main choices`);
    assert.ok(event.source?.url.startsWith("https://"), `${event.id} should cite its research basis`);
    for (const choice of event.choices) {
      assert.equal(choiceIds.has(choice.id), false, `duplicate choice id: ${choice.id}`);
      choiceIds.add(choice.id);
      if (choice.next) assert.ok(EVENTS[choice.next], `${choice.id} links to missing event ${choice.next}`);
      for (const value of Object.values(choice.effects ?? {})) {
        if (typeof value === "number") assert.equal(Number.isFinite(value), true, `${choice.id} has an invalid effect`);
      }
    }
  }

  for (const [eventId, opportunity] of Object.entries(ROADSIDE_OPPORTUNITIES)) {
    assert.ok(EVENTS[eventId], `${opportunity.id} belongs to a missing event`);
    assert.equal(opportunity.choices.length, 2, `${opportunity.id} should offer two work choices`);
  }
});
