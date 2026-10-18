import assert from "node:assert/strict";
import test from "node:test";
import {
  EVENTS,
  FAMILY_PRESETS,
  JOURNEY_STAGES,
  ROADSIDE_OPPORTUNITIES,
  SOCIAL_FEEDS,
  SUPPLY_STOPS,
  TRAVEL_INCIDENTS,
  buySupply,
  chooseOption,
  continueJourney,
  createInitialGame,
  getChoiceBonuses,
  getRoadsideOpportunity,
  getRequirementFailure,
  getSocialFeed,
  getSocialResponseOptions,
  getSupplyOptions,
  getSupplyStop,
  getTravelIncidentOptions,
  getTravelLeadOptions,
  getTravelPlanOptions,
  getJourneyScore,
  getJourneyStage,
  getPeople,
  getPortraitImage,
  getPortraitMood,
  hasCompletedRoadsideWork,
  hasRespondedToSocialFeed,
  planTravelLeg,
  requiresTravelPlan,
  respondToSocialFeed,
  resolveTravelIncident,
  takeRoadsideJob,
  useMedicine,
} from "../src/game.js";
import { getPortraitCropGeometry } from "../src/portrait.js";

const chooseAndContinue = (game, choiceId, strategyId = "steady") => {
  let next = chooseOption(game, choiceId);
  if (requiresTravelPlan(next)) next = planTravelLeg(next, strategyId);
  return continueJourney(next);
};

const WINNING_ROUTES = {
  ramirez: ["safeHouse", "churchBus", "callForHelp", "stayShelter", "rentWhileWaiting", "waitForClinic", "busNorth", "waitForShelterVan", "callLegalAid", "verifiedWaitlist", "officialAppointment", "requestLawyer"],
  haddad: ["haddadNeighborConvoy", "haddadRegisterTurkey", "haddadRepairWork", "haddadLaterBoat", "haddadGreekRegistration", "haddadAidTransfer", "haddadVerifyRules", "haddadRegisterGermany"],
  diop: ["diopVerifyOffice", "diopRepairShift", "diopLicensedCoach", "diopForecastWait", "diopSmallerPirogue", "diopRecordLamine", "diopRegisterArrival", "diopVerifySpainRules", "diopLegalReview"],
  nguyen: ["nguyenVerifyOffer", "nguyenDemandContract", "nguyenCallHotline", "nguyenReportThreats", "nguyenShelterFrance", "nguyenSmallBoat", "nguyenTellTruth", "nguyenLegalAdvice", "nguyenSafeguardingReview"],
  punjab: ["punjabVerifyPermits", "punjabWaitPortal", "punjabPresentDocuments", "punjabRegisterDublin", "punjabDocumentWork", "punjabContactReactivation", "punjabLegalAdvice", "punjabReactivationReview"],
  rohingya: ["rohingyaVerifySister", "rohingyaCopyPapers", "rohingyaCheckForecast", "rohingyaMeasuredWater", "rohingyaShelterIsland", "rohingyaCallRescue", "rohingyaRegisterLanding", "rohingyaTemporaryReview"],
};

test("starts the Ramirez family at home with journey resources", () => {
  const game = createInitialGame();

  assert.equal(game.eventId, "home");
  assert.equal(game.day, 1);
  assert.equal(game.phase, "decision");
  assert.equal(game.resources.cash, 1800);
  assert.equal(game.resources.water, 18);
  assert.deepEqual(game.completedRoadsideWork, {});
  assert.deepEqual(game.resolvedSocialFeeds, {});
  assert.equal(game.socialClimate, 50);
  assert.deepEqual(game.activityLog, []);
  assert.deepEqual(game.relationshipNotes, {});
  assert.deepEqual(game.relationshipHistory, []);
  assert.deepEqual(game.storyThreads, {});
  assert.deepEqual(game.flags, {});
  assert.deepEqual(Object.keys(game.people), ["marisol", "edwin", "daniela", "aurelia"]);
});

test("starts the Haddad family in Syria with a distinct journey preset", () => {
  const game = createInitialGame("haddad");

  assert.equal(game.familyId, "haddad");
  assert.equal(game.eventId, "haddadHome");
  assert.equal(game.resources.cash, 2400);
  assert.deepEqual(Object.keys(game.people), ["kareem", "nadia", "sami", "mariam"]);
  assert.equal(getPeople(game)[0].name, "Kareem");
  assert.equal(FAMILY_PRESETS.haddad.origin, "Syria · Conflict displacement");
  assert.match(FAMILY_PRESETS.haddad.context, /return/i);
  assert.equal(FAMILY_PRESETS.haddad.destination, "Asylum registration");
  assert.equal(FAMILY_PRESETS.haddad.heroImage, "/assets/haddad-journey-hero.webp");
  assert.equal(
    Object.values(EVENTS)
      .filter((event) => event.id.startsWith("haddad"))
      .some((event) => event.region.includes("2015")),
    false,
  );
});

test("starts the Diop brothers and cousins in Senegal as a four-person group", () => {
  const game = createInitialGame("diop");

  assert.equal(game.familyId, "diop");
  assert.equal(game.eventId, "diopHome");
  assert.deepEqual(Object.keys(game.people), ["ibrahima", "mamadou", "cheikh", "lamine"]);
  assert.equal(getPeople(game)[3].name, "Lamine");
  assert.equal(getPeople(game)[3].age, 12);
  assert.equal(FAMILY_PRESETS.diop.destination, "Canary Islands reception");
  assert.equal(FAMILY_PRESETS.diop.heroImage, "/assets/diop-journey-hero.webp");
});

test("starts the Bùi family in Vietnam with a distinct United Kingdom journey", () => {
  const game = createInitialGame("nguyen");

  assert.equal(game.familyId, "nguyen");
  assert.equal(game.eventId, "nguyenHome");
  assert.deepEqual(Object.keys(game.people), ["minh", "lan", "mai", "bao"]);
  assert.equal(getPeople(game)[2].name, "Mai");
  assert.equal(getPeople(game)[3].age, 15);
  assert.equal(FAMILY_PRESETS.nguyen.name, "The Bùi family");
  assert.equal(FAMILY_PRESETS.nguyen.shortName, "Bùi");
  assert.equal(FAMILY_PRESETS.nguyen.destination, "United Kingdom review");
  assert.equal(FAMILY_PRESETS.nguyen.heroImage, "/assets/nguyen-journey-hero.webp");
});

test("starts the Punjab work group in India with a distinct Ireland journey", () => {
  const game = createInitialGame("punjab");

  assert.equal(game.familyId, "punjab");
  assert.equal(game.eventId, "punjabHome");
  assert.deepEqual(Object.keys(game.people), ["gurpreet", "simran", "arjun", "neha"]);
  assert.equal(getPeople(game)[0].name, "Gurpreet");
  assert.equal(getPeople(game)[3].age, 22);
  assert.equal(FAMILY_PRESETS.punjab.destination, "Irish employment review");
  assert.equal(FAMILY_PRESETS.punjab.heroImage, "/assets/punjab-journey-hero.webp");
});

test("starts the Karim family in Cox's Bazar with a distinct statelessness journey", () => {
  const game = createInitialGame("rohingya");

  assert.equal(game.familyId, "rohingya");
  assert.equal(game.eventId, "rohingyaCamp");
  assert.deepEqual(Object.keys(game.people), ["yasmin", "hamida", "rafiq", "sadia"]);
  assert.equal(getPeople(game)[3].name, "Sadia");
  assert.equal(getPeople(game)[3].age, 11);
  assert.equal(FAMILY_PRESETS.rohingya.destination, "Temporary reception in Aceh");
  assert.equal(FAMILY_PRESETS.rohingya.heroImage, "/assets/rohingya-journey-hero.webp");
  assert.match(FAMILY_PRESETS.rohingya.context, /education|aid/i);
});

test("journey choices describe the pressure behind each departure", () => {
  assert.deepEqual(
    Object.fromEntries(Object.entries(FAMILY_PRESETS).map(([id, family]) => [id, family.origin])),
    {
      ramirez: "Honduras · Gang threats",
      haddad: "Syria · Conflict displacement",
      diop: "Senegal · Debt and lost livelihoods",
      nguyen: "Vietnam · Recruitment debt",
      punjab: "India · Job-recruitment fraud",
      rohingya: "Bangladesh · Statelessness and shrinking aid",
    },
  );
});

test("every family begins at a resupply stop and later reaches another one", () => {
  const laterStops = {
    ramirez: "waitingTown",
    haddad: "haddadTurkey",
    diop: "diopDakar",
    nguyen: "nguyenTransit",
    punjab: "punjabDelhi",
    rohingya: "rohingyaCoast",
  };

  for (const [familyId, laterEventId] of Object.entries(laterStops)) {
    const game = createInitialGame(familyId);
    assert.ok(getSupplyStop(game), `${familyId}: the departure chapter should allow preparation`);
    assert.ok(SUPPLY_STOPS[laterEventId], `${familyId}: the careful route should include another supply stop`);
  }
  for (const eventId of Object.keys(SUPPLY_STOPS)) assert.ok(EVENTS[eventId], `${eventId} should be a playable event`);
});

test("resupply purchases spend cash without replacing the story decision", () => {
  const start = createInitialGame("ramirez");
  const medicine = getSupplyOptions(start).find((item) => item.id === "medicine");
  const next = buySupply(start, "medicine");

  assert.equal(medicine.unavailable, null);
  assert.equal(next.resources.cash, start.resources.cash - medicine.cost);
  assert.equal(next.resources.medicine, start.resources.medicine + 1);
  assert.equal(next.phase, "decision");
  assert.equal(next.eventId, start.eventId);
  assert.equal(next.day, start.day);
  assert.deepEqual(next.history, start.history);
  assert.equal(next.supplyPurchases.at(-1).itemId, "medicine");
  assert.equal(next.activityLog.at(-1).kind, "supplies");
});

test("resupply respects cash and carrying limits", () => {
  const start = createInitialGame("ramirez");
  const noCash = { ...start, resources: { ...start.resources, cash: 0 } };
  assert.match(getSupplyOptions(noCash).find((item) => item.id === "medicine").unavailable, /requires/i);
  assert.equal(buySupply(noCash, "medicine"), noCash);

  const fullMedicine = { ...start, resources: { ...start.resources, medicine: 4 } };
  assert.equal(getSupplyOptions(fullMedicine).find((item) => item.id === "medicine").unavailable, "Already fully stocked");
  assert.equal(buySupply(fullMedicine, "medicine"), fullMedicine);

  const almostFullWater = { ...start, resources: { ...start.resources, water: 39 } };
  const water = getSupplyOptions(almostFullWater).find((item) => item.id === "water");
  assert.equal(water.amount, 1);
  assert.equal(water.cost, 10);
  assert.equal(buySupply(almostFullWater, "water").resources.water, 40);
});

test("journey stages distinguish physical arrival from later legal review", () => {
  assert.deepEqual(JOURNEY_STAGES.map((stage) => stage.id), ["home", "transit", "arrival", "review"]);

  const cases = [
    ["ramirez", "home", 0, "home"],
    ["ramirez", "northernWait", 62, "transit"],
    ["ramirez", "borderCity", 66, "arrival"],
    ["ramirez", "detention", 84, "review"],
    ["haddad", "haddadEuropeNews", 75, "arrival"],
    ["haddad", "haddadGermany", 85, "review"],
    ["diop", "diopCanaryLanding", 67, "arrival"],
    ["diop", "diopIslandWait", 76, "review"],
    ["nguyen", "nguyenUKArrival", 71, "arrival"],
    ["nguyen", "nguyenFinal", 88, "review"],
    ["punjab", "punjabDublin", 29, "arrival"],
    ["punjab", "punjabPolicy", 69, "review"],
    ["rohingya", "rohingyaLanding", 72, "arrival"],
    ["rohingya", "rohingyaAceh", 86, "review"],
  ];

  for (const [familyId, eventId, progress, expectedStage] of cases) {
    const game = { ...createInitialGame(familyId), eventId, progress };
    assert.equal(getJourneyStage(game).id, expectedStage, `${familyId}: ${eventId}`);
  }
});

test("every family has a winning route with a survivable resource margin", () => {
  for (const [familyId, choices] of Object.entries(WINNING_ROUTES)) {
    let game = createInitialGame(familyId);

    for (const choiceId of choices) {
      if (getSocialFeed(game) && !hasRespondedToSocialFeed(game)) {
        const support = getSocialResponseOptions(game).find((option) => option.id === "support");
        assert.equal(support.unavailable, null, `${familyId}: trusted support should be available at ${game.eventId}`);
        game = respondToSocialFeed(game, "support");
      }

      const choice = EVENTS[game.eventId]?.choices.find((option) => option.id === choiceId);
      assert.ok(choice, `${familyId}: ${choiceId} should exist at ${game.eventId}`);
      assert.equal(getRequirementFailure(game, choice), null, `${familyId}: ${choiceId} should be affordable`);

      game = chooseOption(game, choiceId);
      if (requiresTravelPlan(game)) game = planTravelLeg(game, "steady");
      game = continueJourney(game);

      const living = Object.values(game.people).filter((person) => person.alive !== false);
      assert.notEqual(game.status, "stopped", `${familyId}: ${choiceId} should not stop a careful run`);
      assert.ok(living.length > 0, `${familyId}: at least one traveler should remain alive`);
      assert.ok(Math.min(...living.map((person) => person.health)) >= 25, `${familyId}: living travelers need a health margin`);
      assert.ok(game.resources.water >= 2, `${familyId}: the careful route should retain emergency water`);
      assert.ok(game.resources.supplies >= 1, `${familyId}: the careful route should retain emergency supplies`);
      assert.ok(game.resources.stress <= 90, `${familyId}: the careful route should stay below critical stress`);
      assert.ok(game.resources.exposure <= 90, `${familyId}: the careful route should stay below critical exposure`);
    }

    assert.equal(game.status, "won", `${familyId}: the careful route should win`);
    assert.equal(game.progress, 100, `${familyId}: the winning route should reach its destination`);
    assert.equal(Object.keys(game.resolvedSocialFeeds).length, 1, `${familyId}: the route should include a responsible feed response`);
  }
});

test("unexpected illness and injury incidents can occur on every family route", () => {
  for (const [familyIndex, [familyId, choices]] of Object.entries(WINNING_ROUTES).entries()) {
    let game = createInitialGame(familyId);
    const firstChoice = choices[0];
    game = chooseOption(game, firstChoice);
    if (requiresTravelPlan(game)) game = planTravelLeg(game, "steady");
    game = continueJourney(game, { incidents: true, incidentRolls: [0, familyIndex / TRAVEL_INCIDENTS.length, 0] });

    assert.ok(game.pendingIncident, `${familyId}: an incident should be waiting for a response`);
    assert.equal(game.phase, "decision", `${familyId}: the main story should remain ready after the incident`);
    const travelerId = game.pendingIncident.personId;
    const traveler = game.people[travelerId];
    const healthBeforeTreatment = traveler.health;
    const medicineBeforeTreatment = game.resources.medicine;
    const options = getTravelIncidentOptions(game);
    assert.equal(options.length, 3);
    assert.equal(options.find((option) => option.id === "medicine").unavailable, null);

    game = resolveTravelIncident(game, "medicine");
    assert.equal(game.pendingIncident, null);
    assert.equal(game.resources.medicine, medicineBeforeTreatment - 1);
    assert.ok(game.people[travelerId].health > healthBeforeTreatment);
    assert.equal(game.incidentHistory.length, 1);
  }
});

test("a leg injury can be treated without medicine by stopping to make a splint", () => {
  let game = createInitialGame("ramirez");
  game = { ...game, resources: { ...game.resources, medicine: 0 } };
  game = chooseOption(game, "safeHouse");
  if (requiresTravelPlan(game)) game = planTravelLeg(game, "steady");
  game = continueJourney(game, { incidents: true, incidentRolls: [0, 0.99, 0] });

  assert.equal(game.pendingIncident.type, "leg-injury");
  assert.match(getTravelIncidentOptions(game).find((option) => option.id === "medicine").unavailable, /requires 1 medicine/i);
  assert.equal(resolveTravelIncident(game, "medicine"), game);

  const dayBeforeRest = game.day;
  game = resolveTravelIncident(game, "rest");
  assert.equal(game.pendingIncident, null);
  assert.equal(game.day, dayBeforeRest + 2);
  assert.equal(game.incidentHistory.at(-1).responseId, "rest");
});

test("every family remains winnable when unexpected incidents are enabled", () => {
  for (const [familyId, choices] of Object.entries(WINNING_ROUTES)) {
    let game = createInitialGame(familyId);

    for (const [choiceIndex, choiceId] of choices.entries()) {
      if (getSocialFeed(game) && !hasRespondedToSocialFeed(game)) game = respondToSocialFeed(game, "support");
      game = chooseOption(game, choiceId);
      if (requiresTravelPlan(game)) game = planTravelLeg(game, "steady");
      game = continueJourney(game, { incidents: true, incidentRolls: [0, (choiceIndex % TRAVEL_INCIDENTS.length) / TRAVEL_INCIDENTS.length, 0] });

      if (game.pendingIncident) {
        const options = getTravelIncidentOptions(game);
        const response = options.find((option) => option.id === "medicine" && !option.unavailable)
          ?? options.find((option) => option.id === "rest");
        game = resolveTravelIncident(game, response.id);
      }
      assert.notEqual(game.status, "stopped", `${familyId}: incidents should not block a careful route at ${choiceId}`);
    }

    assert.equal(game.status, "won", `${familyId}: the route should remain winnable with incidents`);
  }
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

test("social feeds distinguish posts and allow one consequential response", () => {
  let game = { ...createInitialGame("nguyen"), eventId: "nguyenPolicy" };
  const feed = getSocialFeed(game);
  const options = getSocialResponseOptions(game);

  assert.equal(feed.id, "drug-ring-rumor");
  assert.equal(feed.posts.length, 3);
  assert.equal(options.length, 4);
  assert.equal(hasRespondedToSocialFeed(game), false);

  game = respondToSocialFeed(game, "verify");

  assert.equal(hasRespondedToSocialFeed(game), true);
  assert.equal(game.resolvedSocialFeeds.nguyenPolicy, "verify");
  assert.equal(game.resources.battery, 76);
  assert.equal(game.resources.stress, 40);
  assert.equal(game.resources.exposure, 4);
  assert.equal(game.socialClimate, 56);
  assert.equal(game.lastSocialOutcome.responseId, "verify");
  assert.equal(game.activityLog.at(-1).kind, "social");
  assert.match(game.relationshipNotes.mai.text, /official statement/i);

  const repeated = respondToSocialFeed(game, "respond");
  assert.deepEqual(repeated, game);
});

test("a public reply can improve the climate while increasing personal exposure", () => {
  const game = { ...createInitialGame("punjab"), eventId: "punjabPolicy" };
  const next = respondToSocialFeed(game, "respond");

  assert.equal(next.socialClimate, 52);
  assert.equal(next.resources.exposure, 19);
  assert.equal(next.resources.stress, 41);
  assert.equal(next.resources.battery, 76);
});

test("every social feed provides source context, evidence, and all response paths", () => {
  const responseIds = ["verify", "support", "ignore", "respond"];

  for (const [eventId, feed] of Object.entries(SOCIAL_FEEDS)) {
    assert.equal(EVENTS[eventId].id, eventId);
    assert.ok(feed.posts.length >= 3, `${eventId} needs a varied feed`);
    assert.ok(feed.evidence.length >= 3, `${eventId} needs verification findings`);
    assert.deepEqual(Object.keys(feed.outcomes).sort(), [...responseIds].sort());
    assert.ok(feed.posts.some((post) => post.tone === "verified"));
    assert.ok(feed.posts.some((post) => post.tone === "hostile"));
    assert.ok(feed.posts.some((post) => post.tone === "support"));
  }
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

test("a trusted traveler can coordinate a long leg with a skill-based benefit", () => {
  let game = createInitialGame();
  game = chooseAndContinue(game, "safeHouse");
  game = chooseAndContinue(game, "churchBus");
  game = chooseAndContinue(game, "callForHelp");
  game = chooseOption(game, "stayShelter");

  const leads = getTravelLeadOptions(game);
  assert.deepEqual(leads.map((lead) => lead.personId), ["marisol", "edwin", "daniela", "aurelia"]);
  assert.equal(leads.find((lead) => lead.personId === "marisol").roleId, "planning");
  assert.equal(leads.find((lead) => lead.personId === "edwin").roleId, "route");

  const waterBefore = game.resources.water;
  const ledPlan = getTravelPlanOptions(game, "marisol").find((option) => option.id === "steady");
  assert.match(ledPlan.consequence, /Marisol saves 1 L water/);

  game = planTravelLeg(game, "steady", "marisol");
  assert.equal(game.resources.water, waterBefore);
  assert.equal(game.currentOutcome.travelPlan.lead.personId, "marisol");
  assert.equal(game.currentOutcome.travelPlan.lead.skill, "Former teacher");
  assert.match(game.activityLog.at(-1).detail, /Marisol coordinates with Former teacher/);
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
  const game = createInitialGame();
  const person = getPeople(game)[0];
  assert.match(getPortraitImage(person, { health: 90, alive: true }, 60, game), /strained\.webp$/);
});

test("portrait sheets isolate one equal-width person instead of exposing adjacent faces", () => {
  for (const familyId of Object.keys(FAMILY_PRESETS)) {
    const family = FAMILY_PRESETS[familyId];
    const portraitWidth = family.portraitSheet.width / 4;
    assert.deepEqual(
      getPeople(familyId).map((person) => person.focus.split(" ")[0]),
      ["0%", "33.333%", "66.667%", "100%"],
      `${familyId}: all four people should map to separate portrait quarters`,
    );
    for (const index of [0, 1, 2, 3]) {
      assert.deepEqual(
        getPortraitCropGeometry(index, family.portraitSheet.width, family.portraitSheet.height),
        {
          viewBox: `${portraitWidth * index} 0 ${portraitWidth} ${family.portraitSheet.height}`,
          imageWidth: family.portraitSheet.width,
          imageHeight: family.portraitSheet.height,
        },
      );
    }
  }
});

test("the Haddad family can reach asylum registration through the documented route", () => {
  let game = createInitialGame("haddad");
  game = chooseAndContinue(game, "haddadNeighborConvoy");
  game = chooseAndContinue(game, "haddadRegisterTurkey");
  game = chooseAndContinue(game, "haddadRepairWork");
  game = chooseAndContinue(game, "haddadLaterBoat");
  game = chooseAndContinue(game, "haddadGreekRegistration");
  game = chooseAndContinue(game, "haddadAidTransfer");
  game = chooseAndContinue(game, "haddadVerifyRules");
  game = chooseOption(game, "haddadRegisterGermany");
  game = continueJourney(game);

  assert.equal(game.status, "won");
  assert.equal(game.progress, 100);
  assert.equal(game.ending.type, "asylum_pending");
});

test("the Haddad boat-loss branch records Mariam and continues to a memorial", () => {
  let game = createInitialGame("haddad");
  game = chooseAndContinue(game, "haddadNeighborConvoy");
  game = chooseAndContinue(game, "haddadRegisterTurkey");
  game = chooseAndContinue(game, "haddadRepairWork");
  game = chooseOption(game, "haddadOverloadedBoat");

  assert.equal(game.people.mariam.alive, false);
  assert.ok(game.losses.includes("mariam"));
  assert.match(game.activityLog.at(-1).title, /Mariam is remembered/);

  game = continueJourney(game);
  assert.equal(game.eventId, "haddadMemorial");
  assert.equal(game.status, "playing");
});

test("the Diop Atlantic route records Lamine's death and can reach legal review", () => {
  let game = createInitialGame("diop");
  game = chooseAndContinue(game, "diopVerifyOffice");
  game = chooseAndContinue(game, "diopRepairShift");
  game = chooseAndContinue(game, "diopLicensedCoach");
  game = chooseAndContinue(game, "diopForecastWait");
  game = chooseAndContinue(game, "diopSmallerPirogue");

  assert.equal(game.eventId, "diopMemorial");
  assert.equal(game.people.lamine.alive, false);
  assert.ok(game.losses.includes("lamine"));
  assert.match(game.activityLog.find((entry) => entry.kind === "remembrance").title, /Lamine is remembered/);

  game = chooseAndContinue(game, "diopRecordLamine");
  game = chooseAndContinue(game, "diopRegisterArrival");
  game = chooseAndContinue(game, "diopVerifySpainRules");
  game = chooseOption(game, "diopLegalReview");
  game = continueJourney(game);

  assert.equal(game.status, "won");
  assert.equal(game.progress, 100);
  assert.equal(game.ending.type, "legal_review_pending");
  assert.equal(game.people.lamine.alive, false);
});

test("the Diop survivors can reach the memorial when the fatal crossing reaches the stress limit", () => {
  let game = createInitialGame("diop");
  game = chooseAndContinue(game, "diopVerifyOffice");
  game = chooseAndContinue(game, "diopRepairShift", "conserve");
  game = chooseAndContinue(game, "diopLicensedCoach", "conserve");
  game = chooseAndContinue(game, "diopRepairDeposit", "conserve");
  game = chooseOption(game, "diopSmallerPirogue");

  assert.equal(game.people.lamine.alive, false);
  assert.equal(game.resources.stress, 100);
  assert.equal(game.pendingEnding, null);
  game = { ...game, currentOutcome: { ...game.currentOutcome, deferThresholdEnding: undefined } };
  assert.equal(requiresTravelPlan(game), false);

  game = continueJourney(game);
  assert.equal(game.eventId, "diopMemorial");
  assert.equal(game.phase, "decision");
  assert.equal(game.status, "playing");
});

test("the Diop group can turn back before the Atlantic crossing with all four alive", () => {
  let game = createInitialGame("diop");
  game = chooseAndContinue(game, "diopVerifyOffice");
  game = chooseAndContinue(game, "diopRepairShift");
  game = chooseAndContinue(game, "diopLicensedCoach");
  game = chooseAndContinue(game, "diopForecastWait");
  game = chooseOption(game, "diopTurnBack");
  game = continueJourney(game);

  assert.equal(game.status, "won");
  assert.equal(game.ending.type, "safe_return");
  assert.equal(game.losses.length, 0);
  assert.equal(Object.values(game.people).every((person) => person.alive), true);
});

test("the Bùi family can reach a UK safeguarding review through truthful screening", () => {
  let game = createInitialGame("nguyen");
  game = chooseAndContinue(game, "nguyenVerifyOffer");
  game = chooseAndContinue(game, "nguyenDemandContract");
  game = chooseAndContinue(game, "nguyenCallHotline");
  game = chooseAndContinue(game, "nguyenReportThreats");
  game = chooseAndContinue(game, "nguyenShelterFrance");
  game = chooseAndContinue(game, "nguyenSmallBoat");

  assert.equal(game.eventId, "nguyenUKArrival");
  assert.equal(game.flags.channelRescue, true);
  assert.equal(Object.values(game.people).every((person) => person.alive), true);

  game = chooseAndContinue(game, "nguyenTellTruth");
  game = chooseAndContinue(game, "nguyenLegalAdvice");
  game = chooseOption(game, "nguyenSafeguardingReview");
  game = continueJourney(game);

  assert.equal(game.status, "won");
  assert.equal(game.progress, 100);
  assert.equal(game.ending.type, "uk_safeguarding_review");
  assert.equal(game.storyThreads.ukLegalAdvice.status, "resolved");
});

test("the Bùi family can stop in France without attempting the Channel", () => {
  let game = createInitialGame("nguyen");
  game = chooseAndContinue(game, "nguyenVerifyOffer");
  game = chooseAndContinue(game, "nguyenDemandContract");
  game = chooseAndContinue(game, "nguyenKeepPassports");
  game = chooseAndContinue(game, "nguyenLeaveWarehouse");
  game = chooseAndContinue(game, "nguyenShelterFrance");
  game = chooseOption(game, "nguyenFranceProcess");
  game = continueJourney(game);

  assert.equal(game.status, "won");
  assert.equal(game.ending.type, "new_destination_france");
  assert.equal(game.losses.length, 0);
});

test("the Punjab group can reach an Irish reactivation review after workplace exploitation", () => {
  let game = createInitialGame("punjab");
  game = chooseAndContinue(game, "punjabVerifyPermits");
  game = chooseAndContinue(game, "punjabWaitPortal");
  game = chooseAndContinue(game, "punjabPresentDocuments");
  game = chooseAndContinue(game, "punjabRegisterDublin");
  game = chooseAndContinue(game, "punjabDocumentWork");
  game = chooseAndContinue(game, "punjabContactReactivation");
  game = chooseAndContinue(game, "punjabLegalAdvice");
  game = chooseOption(game, "punjabReactivationReview");
  game = continueJourney(game);

  assert.equal(game.status, "won");
  assert.equal(game.progress, 100);
  assert.equal(game.ending.type, "ireland_reactivation_pending");
  assert.equal(game.storyThreads.irelandLegalAdvice.status, "resolved");
  assert.equal(Object.values(game.people).every((person) => person.alive), true);
});

test("the Punjab group can report the recruiter and stop before leaving India", () => {
  let game = createInitialGame("punjab");
  game = chooseAndContinue(game, "punjabVerifyPermits");
  game = chooseAndContinue(game, "punjabWaitPortal");
  game = chooseOption(game, "punjabReportAgent");
  game = continueJourney(game);

  assert.equal(game.status, "won");
  assert.equal(game.ending.type, "recruitment_fraud_reported");
  assert.equal(game.losses.length, 0);
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

test("repeated commitment cannot apply the same decision twice", () => {
  const initial = createInitialGame();
  const choice = EVENTS[initial.eventId].choices[0];
  const committed = chooseOption(initial, choice.id);
  assert.equal(committed.phase, "outcome");
  assert.equal(committed.currentOutcome.consequence, choice.consequence);
  assert.equal(committed.history.length, 1);
  assert.strictEqual(chooseOption(committed, choice.id), committed);
});
