export const GAME_VERSION = 10;
export const GAME_SAVE_KEY = "the-long-road-save-v10";

const RAMIREZ_PORTRAIT_STRIP = "/assets/ramirez-family-portraits.webp";
const RAMIREZ_PORTRAIT_STRIPS = {
  healthy: RAMIREZ_PORTRAIT_STRIP,
  strained: "/assets/ramirez-family-portraits-strained.webp",
  critical: "/assets/ramirez-family-portraits-critical.webp",
};
const HADDAD_PORTRAIT_STRIP = "/assets/haddad-family-portraits.png";
const HADDAD_PORTRAIT_STRIPS = {
  healthy: HADDAD_PORTRAIT_STRIP,
  strained: HADDAD_PORTRAIT_STRIP,
  critical: HADDAD_PORTRAIT_STRIP,
};

const RAMIREZ_PEOPLE = [
  {
    id: "marisol",
    name: "Marisol",
    pronouns: "she/her",
    age: 34,
    image: RAMIREZ_PORTRAIT_STRIP,
    focus: "0% 40%",
    skills: ["Former teacher", "Planning"],
    story: "A former primary-school teacher. She sold the family's home and small plot for far less than they were worth after a gang threatened Edwin.",
  },
  {
    id: "edwin",
    name: "Edwin",
    pronouns: "he/him",
    age: 15,
    image: RAMIREZ_PORTRAIT_STRIP,
    focus: "33% 40%",
    skills: ["Observation", "Some English"],
    story: "He wants to study electrical repair. Recruitment pressure from a neighborhood gang is the reason the family cannot safely stay.",
  },
  {
    id: "daniela",
    name: "Daniela",
    pronouns: "she/her",
    age: 7,
    image: RAMIREZ_PORTRAIT_STRIP,
    focus: "67% 40%",
    skills: ["Curious", "Asthma"],
    story: "She carries a stuffed rabbit named Nube and counts every bus she sees. Her inhaler has twelve doses left.",
  },
  {
    id: "aurelia",
    name: "Aurelia",
    pronouns: "she/her",
    age: 61,
    image: RAMIREZ_PORTRAIT_STRIP,
    focus: "100% 40%",
    skills: ["Devout", "Cooking"],
    story: "Marisol's mother. Her knee slows the group, but she remembers names, favors, and which promises people kept.",
  },
];

const HADDAD_PEOPLE = [
  {
    id: "kareem",
    name: "Kareem",
    pronouns: "he/him",
    age: 44,
    image: HADDAD_PORTRAIT_STRIP,
    focus: "0% 42%",
    skills: ["Machine repair", "Negotiation"],
    story: "He repaired bakery equipment outside Aleppo. After shelling destroyed the workshop and an armed group demanded that he report for service, he sold what tools remained.",
  },
  {
    id: "nadia",
    name: "Nadia",
    pronouns: "she/her",
    age: 41,
    image: HADDAD_PORTRAIT_STRIP,
    focus: "33% 42%",
    skills: ["Former teacher", "Documents"],
    story: "A former Arabic teacher. She keeps school records, identity papers, and the deed to a damaged apartment wrapped inside a plastic folder.",
  },
  {
    id: "sami",
    name: "Sami",
    pronouns: "he/him",
    age: 16,
    image: HADDAD_PORTRAIT_STRIP,
    focus: "67% 42%",
    skills: ["Electronics", "Some English"],
    story: "He fixes phones from discarded parts and follows every border rumor online. He is old enough to understand why checkpoints frighten his parents.",
  },
  {
    id: "mariam",
    name: "Mariam",
    pronouns: "she/her",
    age: 9,
    image: HADDAD_PORTRAIT_STRIP,
    focus: "100% 42%",
    skills: ["Drawing", "Asthma"],
    story: "She carries the brass key to the family's damaged apartment and draws every temporary room as if the walls might help her remember it.",
  },
];

export const PEOPLE = RAMIREZ_PEOPLE;

export const FAMILY_PRESETS = Object.freeze({
  ramirez: {
    id: "ramirez",
    name: "The Ramírez family",
    shortName: "Ramírez",
    origin: "Honduras · Present day",
    context: "Gang threats force a teacher, her children, and their grandmother to leave after the family home is sold under pressure.",
    journey: "Honduras to a United States border process",
    startEventId: "home",
    startRoute: "elmstead",
    destination: "Border process",
    heroImage: "/assets/long-road-theft-night.webp",
    mapImage: "/assets/long-road-route-map.webp",
    mapAlt: "Schematic illustrated map from a fictional Honduran home toward a United States border process",
    portraitStrips: RAMIREZ_PORTRAIT_STRIPS,
    people: RAMIREZ_PEOPLE,
    resources: { cash: 1800, supplies: 5, water: 18, medicine: 1, battery: 82, stress: 42, exposure: 12 },
    peopleState: {
      marisol: { health: 84, trust: 4, alive: true },
      edwin: { health: 86, trust: 4, alive: true },
      daniela: { health: 78, trust: 5, alive: true },
      aurelia: { health: 65, trust: 4, alive: true },
    },
  },
  haddad: {
    id: "haddad",
    name: "The Haddad family",
    shortName: "Haddad",
    origin: "Syria · 2015",
    context: "War destroys the family's livelihood near Aleppo. They leave for Türkiye and face the dangerous, uncertain route toward protection in Europe.",
    journey: "Northern Syria to an asylum process in Germany",
    startEventId: "haddadHome",
    startRoute: "elmstead",
    destination: "Asylum registration",
    heroImage: "/assets/haddad-journey-hero.png",
    mapImage: "/assets/haddad-route-map.png",
    mapAlt: "Non-navigational illustrated story map from Syria through Türkiye, Greece, and the Balkans toward Germany",
    portraitStrips: HADDAD_PORTRAIT_STRIPS,
    people: HADDAD_PEOPLE,
    resources: { cash: 2400, supplies: 6, water: 16, medicine: 1, battery: 68, stress: 54, exposure: 18 },
    peopleState: {
      kareem: { health: 81, trust: 4, alive: true },
      nadia: { health: 84, trust: 4, alive: true },
      sami: { health: 88, trust: 4, alive: true },
      mariam: { health: 74, trust: 5, alive: true },
    },
  },
});

export function getFamilyPreset(gameOrId = "ramirez") {
  const familyId = typeof gameOrId === "string" ? gameOrId : gameOrId?.familyId;
  return FAMILY_PRESETS[familyId] ?? FAMILY_PRESETS.ramirez;
}

export function getPeople(gameOrId = "ramirez") {
  return getFamilyPreset(gameOrId).people;
}

export const ROUTES = {
  elmstead: {
    title: "Shelter Network",
    kicker: "Verified support",
    duration: "Slower",
    confidence: "Higher confidence",
    tone: "trusted",
    detail: "Church shelters, legal clinics, and family contacts",
  },
  quarry: {
    title: "Road North",
    kicker: "Mixed information",
    duration: "Uncertain",
    confidence: "Medium confidence",
    tone: "uncertain",
    detail: "Buses, large groups, waiting towns, and changing rumors",
  },
  ridge: {
    title: "Paid Guide",
    kicker: "High-risk promises",
    duration: "Faster if true",
    confidence: "Low confidence",
    tone: "danger",
    detail: "Fictional prices and an abstract route; promises may be false",
  },
};

export const TRAVEL_STRATEGIES = [
  {
    id: "conserve",
    title: "Stretch what remains",
    hint: "Spend almost nothing, but accept hunger and fatigue",
    tone: "danger",
  },
  {
    id: "steady",
    title: "Keep a steady pace",
    hint: "Pay for water and simple meals along the way",
    tone: "uncertain",
  },
  {
    id: "recover",
    title: "Pause to recover",
    hint: "Spend more for rest, meals, and safer shelter",
    tone: "trusted",
  },
];

const CHOICE_REACTIONS = {
  leaveDawn: [{ personId: "edwin", trustDelta: 1, text: "If we leave now, they cannot make me join them tonight." }],
  safeHouse: [{ personId: "aurelia", trustDelta: 1, text: "A verified door is worth losing two days." }],
  collectPapers: [{ personId: "aurelia", trustDelta: -1, text: "The papers matter, but I wish you had not gone back alone." }],
  churchBus: [{ personId: "daniela", trustDelta: 1, text: "The driver knows our names. I think that is good." }],
  hireCoyote: [{ personId: "edwin", trustDelta: -1, text: "He keeps changing the promise whenever we ask a question." }],
  largeGroup: [{ personId: "aurelia", trustDelta: 1, text: "Strangers are watching out for the children too." }],
  handCash: [{ personId: "aurelia", trustDelta: 1, text: "Money can be replaced. Four people cannot." }],
  offerPhone: [{ personId: "edwin", trustDelta: -1, text: "Every address and photograph was on that phone." }],
  callForHelp: [{ personId: "edwin", trustDelta: 1, text: "I was scared, but the lights made them run." }],
  callShelter: [{ personId: "aurelia", trustDelta: 1, text: "The number in my prayer book brought a real van." }],
  walkTown: [{ personId: "aurelia", trustDelta: -1, text: "I can keep walking. I need you to hear when I say it hurts." }],
  replacementDriver: [{ personId: "edwin", trustDelta: 1, text: "You opened the door before he could separate us." }],
  stayShelter: [{ personId: "daniela", trustDelta: 1, text: "Tonight the door locks from our side." }],
  helpKitchen: [{ personId: "edwin", trustDelta: 1, text: "Fixing the fans made me useful again." }],
  leaveMorning: [{ personId: "aurelia", trustDelta: -1, text: "One night was not enough for my knee or her cough." }],
  rentWhileWaiting: [{ personId: "edwin", trustDelta: 1, text: "I can study if I know where we sleep tomorrow." }],
  shelterRotation: [{ personId: "daniela", trustDelta: -1, text: "Which bed is ours tonight?" }],
  resellerTicket: [{ personId: "edwin", trustDelta: -1, text: "The station warned us that the ticket could not be checked." }],
  waitForClinic: [{ personId: "daniela", trustDelta: 1, text: "The nurse wrote the medicine name where we cannot lose it." }],
  buyPharmacyRefill: [{ personId: "daniela", trustDelta: 1, text: "I can breathe better before the bus comes." }],
  continueWithoutCare: [{ personId: "daniela", trustDelta: -1, text: "I said I could walk. I did not say I could breathe." }],
  busNorth: [{ personId: "edwin", trustDelta: 1, text: "A ticket with a company name feels like something we can prove." }],
  freightTrain: [{ personId: "aurelia", trustDelta: -1, text: "My hands cannot hold this metal forever." }],
  secondGuide: [{ personId: "edwin", trustDelta: -1, text: "We are paying another stranger to explain nothing." }],
  remainWithBus: [{ personId: "edwin", trustDelta: 1, text: "The announcement was confusing, but at least it was public." }],
  waitForShelterVan: [{ personId: "aurelia", trustDelta: 1, text: "Waiting is easier when someone gives their real name." }],
  payCheckpointGuide: [{ personId: "edwin", trustDelta: -1, text: "He held our documents like they belonged to him." }],
  callLegalAid: [{ personId: "edwin", trustDelta: 1, text: "Now we know which part was policy and which part was rumor." }],
  comfortChildren: [{ personId: "daniela", trustDelta: 1, text: "Tell me what you know. Do not leave the video talking." }],
  argueOnline: [{ personId: "aurelia", trustDelta: -1, text: "Those strangers wanted a fight, not the truth about Mateo." }],
  verifiedWaitlist: [{ personId: "aurelia", trustDelta: 1, text: "A slow list is still better than a purchased lie." }],
  rentNorthernRoom: [{ personId: "edwin", trustDelta: 1, text: "For one month, I can leave a book on a table." }],
  payAppointmentBroker: [{ personId: "edwin", trustDelta: -1, text: "The clinic told us appointments were not for sale." }],
  officialAppointment: [{ personId: "edwin", trustDelta: 1, text: "At least the lawyer explained what the wristbands might mean." }],
  boatOffer: [{ personId: "aurelia", trustDelta: -1, text: "There are more children than life jackets." }],
  stayMexico: [{ personId: "aurelia", trustDelta: 1, text: "A different safe place can still become home." }],
  lightCandle: [{ personId: "edwin", trustDelta: 1, text: "I want them to remember more than how Daniela died." }],
  recordName: [{ personId: "marisol", trustDelta: 1, text: "Her name is in a record that cannot pretend she was never here." }],
  requestLawyer: [{ personId: "edwin", trustDelta: 1, text: "All the papers we carried finally tell the same story." }],
  haddadNeighborConvoy: [{ personId: "sami", trustDelta: 1, text: "I know the people in the car ahead. That matters right now." }],
  haddadWaitForUncle: [{ personId: "mariam", trustDelta: -1, text: "Every time the phone rings, I think we are leaving." }],
  haddadFirstBroker: [{ personId: "nadia", trustDelta: -1, text: "He learned how much we fear staying, then raised the price." }],
  haddadRegisterTurkey: [{ personId: "mariam", trustDelta: 1, text: "The nurse wrote my name next to the medicine." }],
  haddadCousinRoom: [{ personId: "sami", trustDelta: 1, text: "Cousin Fadi opened the door before asking what we could pay." }],
  haddadBorderDriver: [{ personId: "nadia", trustDelta: -1, text: "We traded names on paper for another stranger's word." }],
  haddadRepairWork: [{ personId: "sami", trustDelta: 1, text: "Baba let me test the motor before they paid us." }],
  haddadGarmentRoom: [{ personId: "nadia", trustDelta: -1, text: "A document in someone else's drawer is not protection." }],
  haddadBorrowForBoat: [{ personId: "kareem", trustDelta: -1, text: "Our relatives borrowed against their own rent for this." }],
  haddadTurkeyProtection: [{ personId: "nadia", trustDelta: 1, text: "Changing the destination does not mean we abandoned the children." }],
  haddadLaterBoat: [{ personId: "sami", trustDelta: 1, text: "Waiting felt unbearable. The life jackets were still worth it." }],
  haddadOverloadedBoat: [{ personId: "nadia", trustDelta: -1, text: "He called the boat safe because he knew we wanted to believe him." }],
  haddadRecordMariam: [{ personId: "sami", trustDelta: 1, text: "Write that she drew windows in every room." }],
  haddadGreekRegistration: [{ personId: "sami", trustDelta: 1, text: "For once, all our names are on the same page." }],
  haddadPrivateVan: [{ personId: "kareem", trustDelta: -1, text: "The price bought a ride, not the truth." }],
  haddadAidTransfer: [{ personId: "nadia", trustDelta: 1, text: "Slow is easier to bear when someone signs their name." }],
  haddadFalsePapers: [{ personId: "sami", trustDelta: -1, text: "The seller knew the scanner would reject them." }],
  haddadVerifyRules: [{ personId: "sami", trustDelta: 1, text: "The loudest post was not the official notice." }],
  haddadArgueOnline: [{ personId: "nadia", trustDelta: -1, text: "They wanted our faces for their argument, not our story." }],
  haddadRegisterGermany: [{ personId: "kareem", trustDelta: 1, text: "A case number is not a home, but it is a place to begin." }],
};

const STORY_THREAD_UPDATES = {
  leaveDawn: [{ id: "homeLight", title: "The porch light", status: "active", summary: "The family left without saying when they would return." }],
  safeHouse: [{ id: "shelterNetwork", title: "The verified shelter list", status: "active", summary: "A volunteer recorded every name and shared verified contacts." }],
  collectPapers: [{ id: "landEvidence", title: "Proof of home", status: "active", summary: "The land deed and school records survived the departure." }],
  hireCoyote: [{ id: "coyotePromise", title: "The coyote's promise", status: "active", summary: "Most of the land money was exchanged for an unverified promise." }],
  callShelter: [{ id: "coyotePromise", title: "The coyote's promise", status: "setback", requiresThread: "coyotePromise", summary: "The paid guide vanished; a verified shelter helped the family leave together." }],
  walkTown: [{ id: "coyotePromise", title: "The coyote's promise", status: "setback", requiresThread: "coyotePromise", summary: "The family abandoned the paid route and walked toward town." }],
  replacementDriver: [{ id: "coyotePromise", title: "The coyote's promise", status: "setback", requiresThread: "coyotePromise", summary: "A second driver demanded separation and kept more of the family's money." }],
  handCash: [{ id: "emergencyMoney", title: "Aurelia's emergency bills", status: "active", summary: "Aurelia kept a small amount of cash hidden inside her skirt." }],
  offerPhone: [{ id: "lostContacts", title: "The lost phone", status: "setback", summary: "Contact numbers, document photographs, and the offline shelter map were stolen." }],
  stayShelter: [
    { id: "shelterNetwork", title: "The verified shelter list", status: "resolved", requiresThread: "shelterNetwork", summary: "The list led to a locked room, medical care, and a legal clinic." },
    { id: "lostContacts", title: "The lost phone", status: "resolved", requiresThread: "lostContacts", summary: "Shelter volunteers helped rebuild the contact list and restore phone access." },
    { id: "legalPacket", title: "The dry legal folder", status: "active", summary: "A lawyer organized the deed, school records, and threat evidence." },
  ],
  communityChildcare: [{ id: "communityFavor", title: "The community-center favor", status: "active", summary: "Marisol helped with childcare while other parents attended appointments." }],
  rentWhileWaiting: [{ id: "emergencyMoney", title: "Aurelia's emergency bills", status: "resolved", requiresThread: "emergencyMoney", summary: "The hidden bills helped keep one locked room during the long delay." }],
  waitForShelterVan: [{ id: "communityFavor", title: "The community-center favor", status: "resolved", requiresThread: "communityFavor", summary: "A known contact confirmed the shelter pickup before the family boarded." }],
  callLegalAid: [{ id: "legalAdvice", title: "Verified legal advice", status: "active", summary: "A lawyer separated policy, rumor, and the possible border outcomes." }],
  officialAppointment: [{ id: "legalAdvice", title: "Verified legal advice", status: "active", requiresThread: "legalAdvice", summary: "The earlier call helped the family prepare for processing and detention risk." }],
  boardOverloaded: [{ id: "danielaMemory", title: "Daniela's name", status: "active", summary: "Daniela died during the river crossing. Her name remains with the family." }],
  lightCandle: [{ id: "danielaMemory", title: "Daniela's name", status: "active", requiresThread: "danielaMemory", summary: "The family made space for memories of Daniela beyond the crossing." }],
  recordName: [{ id: "danielaMemory", title: "Daniela's name", status: "active", requiresThread: "danielaMemory", summary: "Family tracing recorded Daniela's name and issued a case number." }],
  requestLawyer: [
    { id: "landEvidence", title: "Proof of home", status: "resolved", requiresThread: "landEvidence", summary: "The deed and school records supported the family's timeline." },
    { id: "legalPacket", title: "The dry legal folder", status: "resolved", requiresThread: "legalPacket", summary: "The organized evidence helped the lawyer begin the case." },
    { id: "legalAdvice", title: "Verified legal advice", status: "resolved", requiresThread: "legalAdvice", summary: "The family recognized the process and asked for counsel." },
  ],
  haddadNeighborConvoy: [{ id: "apartmentKey", title: "The apartment key", status: "active", summary: "Mariam carries the key to a damaged home the family cannot safely remain in." }],
  haddadWaitForUncle: [{ id: "receptionContact", title: "The reception-center message", status: "active", summary: "Nadia's brother shared the name of a humanitarian reception center." }],
  haddadFirstBroker: [{ id: "brokerDebt", title: "The broker's changing price", status: "setback", summary: "The first payment bought a new demand instead of a clear route." }],
  haddadRegisterTurkey: [{ id: "temporaryPapers", title: "Temporary protection papers", status: "active", summary: "The family's names and medical needs are recorded in Türkiye." }],
  haddadRepairWork: [{ id: "verifiedWages", title: "The posted wage", status: "active", summary: "A written rate and Kareem's skill produced money the family can account for." }],
  haddadBorrowForBoat: [{ id: "familyDebt", title: "Money borrowed from three homes", status: "active", summary: "Relatives sacrificed rent and savings to finance the next leg." }],
  haddadOverloadedBoat: [{ id: "mariamMemory", title: "Mariam's key", status: "active", summary: "Mariam died during the crossing. Her brass apartment key remains in the document folder." }],
  haddadRecordMariam: [{ id: "mariamMemory", title: "Mariam's key", status: "active", requiresThread: "mariamMemory", summary: "Family tracing records Mariam's name, asthma, drawings, and brass key." }],
  haddadGreekRegistration: [{ id: "greekRegistration", title: "The island registration paper", status: "active", summary: "The family's arrival and names are recorded together." }],
  haddadVerifyRules: [{ id: "germanLegalAdvice", title: "The written registration address", status: "active", summary: "A legal volunteer separated a viral slogan from the official process." }],
  haddadRegisterGermany: [
    { id: "apartmentKey", title: "The apartment key", status: "active", requiresThread: "apartmentKey", summary: "The key reaches Germany even though it no longer opens a safe home." },
    { id: "temporaryPapers", title: "Temporary protection papers", status: "resolved", requiresThread: "temporaryPapers", summary: "The earlier record helps establish names, dates, and medical needs." },
    { id: "greekRegistration", title: "The island registration paper", status: "resolved", requiresThread: "greekRegistration", summary: "The transit record helps the legal clinic reconstruct the route." },
    { id: "germanLegalAdvice", title: "The written registration address", status: "resolved", requiresThread: "germanLegalAdvice", summary: "The family reaches the correct office before the intake window closes." },
  ],
};

const sources = {
  honduras: {
    label: "UNHCR: forced displacement and land loss in Honduras",
    url: "https://www.unhcr.org/us/news/stories/gangs-drive-hondurans-their-homes-and-land",
  },
  routes: {
    label: "IOM: risks on Central America-Mexico migration routes",
    url: "https://publications.iom.int/books/risks-and-protection-through-most-dangerous-zones-along-transit-migration-routes-central",
  },
  smugglers: {
    label: "IOM/WFP: adverse drivers and use of smugglers in Northern Central America",
    url: "https://publications.iom.int/system/files/pdf/WFP-IOM-El-Salvador-Guatemala-Honduras.pdf",
  },
  gbv: {
    label: "UNHCR/HIAS: gender-based violence during forced displacement",
    url: "https://www.unhcr.org/asia/news/joint-press-release-forcibly-displaced-women-high-risk-gender-based-violence-latin-america",
  },
  policy: {
    label: "White House: January 2025 immigration enforcement order",
    url: "https://www.whitehouse.gov/presidential-actions/2025/01/protecting-the-american-people-against-invasion/",
  },
  missing: {
    label: "IOM Missing Migrants: deaths and disappearances in the Americas",
    url: "https://missingmigrants.iom.int/",
  },
  syria: {
    label: "UNHCR: the Syria emergency and prolonged displacement crisis",
    url: "https://www.unhcr.org/emergencies/syria-emergency",
  },
  mediterranean: {
    label: "UNHCR: sea crossings carry risks of exploitation, pushbacks, and shipwreck",
    url: "https://www.unhcr.org/europe/publications/sea-arrivals-overview-europe-region-august-2025",
  },
  europeBorders: {
    label: "UNHCR: border restrictions can drive refugees toward more dangerous routes",
    url: "https://www.unhcr.org/us/news/news-releases/refugees-and-migrants-face-heightened-risks-while-trying-reach-europe-unhcr",
  },
  europeAsylum: {
    label: "EUAA: asylum decisions and conditions for Syrians can change with the political situation",
    url: "https://www.euaa.europa.eu/latest-asylum-trends-annual-analysis/applications",
  },
};

export const ROADSIDE_OPPORTUNITIES = {
  guideOffer: {
    id: "terminalCafe",
    eyebrow: "Work between departures",
    title: "A bus-station café needs help",
    copy: "The owner offers Marisol a short shift and lets the family wait together near the kitchen. The next bus may leave before the work is finished.",
    choices: [
      {
        id: "washDishes",
        title: "Wash dishes until noon",
        hint: "Earn $55 and share the staff meal",
        tone: "trusted",
        days: 1,
        effects: { cash: 55, supplies: 1, stress: 3, people: { marisol: -2 } },
        consequence: "Cash +$55 · Food +1 day · One day passes",
        outcomeTitle: "The last pot is stacked before closing",
        outcome: "The owner pays the amount promised and wraps rice and beans for the road. Marisol's hands ache from the hot water.",
      },
      {
        id: "packBread",
        title: "Pack bread for the morning buses",
        hint: "Take less cash and more food",
        tone: "uncertain",
        days: 1,
        effects: { cash: 30, supplies: 2, stress: 1, people: { marisol: -1 } },
        consequence: "Cash +$30 · Food +2 days · One day passes",
        outcomeTitle: "The family leaves with a paper sack",
        outcome: "The pay is small, but the owner adds yesterday's bread and fruit that would otherwise be discarded.",
      },
    ],
  },
  blueDoorShelter: {
    id: "shelterExchange",
    eyebrow: "Shelter work exchange",
    title: "The blue-door shelter needs another pair of hands",
    copy: "Nobody is required to work for a bed. The coordinator offers extra supplies in exchange for an optional shift while the family rests.",
    choices: [
      {
        id: "cookDinner",
        title: "Cook the evening meal",
        hint: "Aurelia helps feed forty people",
        tone: "trusted",
        days: 1,
        effects: { supplies: 2, water: 3, stress: -5, trustAll: 1, people: { aurelia: -1 } },
        consequence: "Food +2 days · Water +3 L · Cohesion rises",
        outcomeTitle: "Aurelia stretches one pot into forty bowls",
        outcome: "Other families wash the dishes. The coordinator packs dry food for the Ramírez family and refuses to call the exchange a debt.",
        skillBonus: {
          personId: "aurelia",
          skill: "Cooking",
          label: "Aurelia's cooking stretches the donated food",
          effects: { supplies: 1, stress: -2 },
        },
      },
      {
        id: "mendClothes",
        title: "Mend donated clothing",
        hint: "Earn a small stipend in a quiet room",
        tone: "trusted",
        days: 1,
        effects: { cash: 40, stress: -3, battery: 18, people: { marisol: -1 } },
        consequence: "Cash +$40 · Phone +18% · Stress -3",
        outcomeTitle: "Torn sleeves become usable again",
        outcome: "Marisol works beside two other mothers while the phone charges from a wall outlet. The shelter pays a small, posted stipend.",
      },
    ],
  },
  transport: {
    id: "dayLaborCorner",
    eyebrow: "One-day labor",
    title: "Two crews are hiring near the station",
    copy: "A worker center posts a modest wage for cleanup. An unknown driver promises almost twice as much cash but will not name the employer.",
    choices: [
      {
        id: "workerCenterShift",
        title: "Take the posted cleanup shift",
        hint: "Lower pay through a verified worker center",
        tone: "trusted",
        days: 1,
        effects: { cash: 75, water: -2, stress: 2, exposure: -2, people: { marisol: -3 } },
        consequence: "Cash +$75 · Water -2 L · Marisol health -3",
        outcomeTitle: "The wage envelope matches the notice",
        outcome: "The work is tiring and the pay is modest. A coordinator records the hours and makes sure everyone is paid before the van leaves.",
      },
      {
        id: "unknownCrew",
        title: "Take the unknown driver's offer",
        hint: "Higher promised wage, no written terms",
        tone: "danger",
        days: 1,
        effects: { cash: 65, water: -3, stress: 10, exposure: 10, people: { marisol: -5 } },
        consequence: "Only half the promised wage · Stress +10 · Risk +10",
        outcomeTitle: "The driver returns with half the promised pay",
        outcome: "After ten hours of cleaning a warehouse, the crew is told the rest was taken for transport. Nobody was given an employer's name or receipt.",
      },
    ],
  },
  policyNews: {
    id: "clinicPaperwork",
    eyebrow: "Waiting-room notice",
    title: "The legal clinic has a paid paperwork shift",
    copy: "Marisol's teaching experience is useful. The clinic needs someone to copy appointment lists clearly and help organize translated information sheets.",
    choices: [
      {
        id: "copyForms",
        title: "Copy and organize forms",
        hint: "Earn a stipend and hear verified information",
        tone: "trusted",
        days: 1,
        effects: { cash: 45, battery: 12, stress: -4, exposure: -4, people: { marisol: -1 } },
        consequence: "Cash +$45 · Phone +12% · Risk -4",
        outcomeTitle: "Every name is copied twice",
        outcome: "The stipend is small, but Marisol leaves with a charged phone and a clearer explanation of which notices are official.",
        skillBonus: {
          personId: "marisol",
          skill: "Former teacher",
          label: "Marisol's classroom experience makes the work faster",
          effects: { cash: 15, exposure: -2 },
        },
      },
      {
        id: "nightFoodStall",
        title: "Wash dishes at a night stall",
        hint: "Earn more cash, lose sleep",
        tone: "uncertain",
        days: 1,
        effects: { cash: 80, supplies: 1, stress: 6, people: { marisol: -4 } },
        consequence: "Cash +$80 · Food +1 day · Stress +6",
        outcomeTitle: "The stall closes long after midnight",
        outcome: "The owner pays in cash and includes a meal. Marisol sleeps for two hours before the waiting room opens again.",
      },
    ],
  },
  waitingTown: {
    id: "waitingTownWork",
    eyebrow: "Work while the buses are stalled",
    title: "The market cooperative has two short shifts",
    copy: "Travel north has slowed, but rent and food have not. A cooperative offers posted terms while a community center needs help with younger children.",
    choices: [
      {
        id: "labelProduce",
        title: "Label produce crates",
        hint: "Earn cash and take home unsold fruit",
        tone: "trusted",
        days: 1,
        effects: { cash: 60, supplies: 1, stress: 2, people: { marisol: -2 } },
        consequence: "Cash +$60 · Food +1 day · Marisol health -2",
        outcomeTitle: "The cooperative pays before the gates close",
        outcome: "Marisol writes prices and destinations on boxes. The supervisor pays the posted wage and adds bruised fruit that cannot be shipped.",
      },
      {
        id: "communityChildcare",
        title: "Help at the community playroom",
        hint: "A smaller stipend and a calmer day",
        tone: "trusted",
        days: 1,
        effects: { cash: 35, stress: -4, trustAll: 1, people: { marisol: -1 } },
        consequence: "Cash +$35 · Stress -4 · Cohesion rises",
        outcomeTitle: "For one afternoon, the children only play",
        outcome: "Marisol reads aloud while parents attend legal appointments. Daniela draws their old house with the porch light still on.",
        setFlags: { communityFavor: true },
      },
    ],
  },
  northernWait: {
    id: "northernWaitWork",
    eyebrow: "Work during the long wait",
    title: "The shelter board lists temporary work",
    copy: "The appointment queue may take weeks. The family can use one day for paid laundry work or sort donations in exchange for supplies.",
    choices: [
      {
        id: "cooperativeLaundry",
        title: "Join the laundry cooperative",
        hint: "Earn cash through a group with posted wages",
        tone: "trusted",
        days: 1,
        effects: { cash: 95, water: -2, stress: 3, people: { marisol: -3, aurelia: -2 } },
        consequence: "Cash +$95 · Water -2 L · Health falls slightly",
        outcomeTitle: "Every worker signs the payment sheet",
        outcome: "The shift is hot and repetitive, but the cooperative pays everyone the same rate before they leave.",
      },
      {
        id: "sortDonations",
        title: "Sort shelter donations",
        hint: "Receive supplies and charge the phone",
        tone: "trusted",
        days: 1,
        effects: { supplies: 2, battery: 22, stress: -3, people: { aurelia: -1 } },
        consequence: "Food +2 days · Phone +22% · Stress -3",
        outcomeTitle: "A shelf becomes a small storehouse",
        outcome: "Aurelia sorts sizes and dates while the phone charges. The coordinator offers supplies without deducting them from anyone else's share.",
      },
    ],
  },
  borderCity: {
    id: "borderShelterWork",
    eyebrow: "Last money before the decision",
    title: "The shelter posts two short shifts",
    copy: "The family can delay one day to rebuild supplies. Neither job changes their legal options or guarantees what happens next.",
    choices: [
      {
        id: "pantryInventory",
        title: "Count and sort pantry boxes",
        hint: "Receive food and medicine instead of cash",
        tone: "trusted",
        days: 1,
        effects: { supplies: 2, medicine: 1, stress: -3, people: { aurelia: -1 } },
        consequence: "Food +2 days · Medicine +1 · Stress -3",
        outcomeTitle: "The coordinator sets aside an inhaler refill",
        outcome: "Aurelia checks dates and sorts boxes. The shelter offers food for the family and replaces one of Daniela's medicine doses.",
      },
      {
        id: "motelLaundry",
        title: "Fold laundry at a nearby motel",
        hint: "Earn cash before the next decision",
        tone: "uncertain",
        days: 1,
        effects: { cash: 85, stress: 4, exposure: 3, people: { marisol: -3, aurelia: -2 } },
        consequence: "Cash +$85 · Stress +4 · Risk +3",
        outcomeTitle: "The manager pays at the end of the shift",
        outcome: "Marisol and Aurelia return after dark with sore backs and enough cash for several meals. The border decision is still waiting.",
      },
    ],
  },
};

export const EVENTS = {
  home: {
    id: "home",
    region: "Northern Honduras",
    location: "The family home",
    time: "05:10",
    weather: "Humid dawn",
    weatherDetail: "The bus leaves after sunrise",
    route: "elmstead",
    contentNote: "Threats against a child; forced displacement",
    source: sources.honduras,
    messages: [
      {
        sender: "Marisol",
        initial: "M",
        role: "Family notebook",
        time: "04:48",
        trusted: true,
        body: "The family home and its small plot were sold for a quarter of what they were worth. The men who tried to recruit Edwin said they would return tonight. Four bags are by the door. There is no choice that feels like a choice.",
      },
    ],
    known: [
      "The threat against Edwin named tonight as a deadline.",
      "The family has $1,800 from the rushed sale of their home.",
      "A church safe house can receive them for two nights.",
    ],
    assumed: [
      "The gang will not watch the bus terminal.",
      "The land papers will matter later.",
      "The cousin in Houston can still help.",
    ],
    choices: [
      {
        id: "leaveDawn",
        title: "Leave before sunrise",
        hint: "Take the first bus and do not return",
        icon: "navigate",
        tone: "uncertain",
        route: "quarry",
        days: 1,
        next: "guideOffer",
        effects: { battery: -3, stress: 8, exposure: 5, progress: 6 },
        consequence: "Stress +8 · Risk +5 · Progress +6%",
        outcomeTitle: "The porch light stays on",
        outcome: "Aurelia locks the door even though they no longer own it. Daniela waves to the dog. Nobody says when they will come back.",
      },
      {
        id: "safeHouse",
        title: "Go through the church safe house",
        hint: "Trade two days and some money for verified help",
        icon: "aid",
        tone: "trusted",
        route: "elmstead",
        days: 2,
        next: "guideOffer",
        effects: { cash: -80, supplies: -1, stress: -8, exposure: -6, progress: 4, trustAll: 1 },
        consequence: "Cash -$80 · Food -1 day · Risk -6",
        outcomeTitle: "A volunteer writes down every name",
        outcome: "The family sleeps in one room and receives a list of shelters. The list is not a promise, but it is verified.",
        setFlags: { shelterContacts: true },
      },
      {
        id: "collectPapers",
        title: "Return for the land papers",
        hint: "Keep proof of what was lost, but risk being seen",
        icon: "wait",
        tone: "danger",
        route: "ridge",
        days: 1,
        next: "guideOffer",
        effects: { stress: 12, exposure: 18, progress: 3, people: { aurelia: -4 } },
        consequence: "Stress +12 · Risk +18 · Aurelia health -4",
        outcomeTitle: "The papers are under the flour tin",
        outcome: "Marisol retrieves the deed and Edwin's school records. A motorcycle idles at the end of the road as they leave.",
        setFlags: { landPapers: true },
        skillBonus: {
          personId: "marisol",
          skill: "Planning",
          label: "Marisol remembers a back path away from the main road",
          effects: { exposure: -4, stress: -2 },
        },
      },
    ],
  },

  guideOffer: {
    id: "guideOffer",
    region: "Guatemala transit corridor",
    location: "Regional bus terminal",
    time: "11:35",
    weather: "Heavy heat",
    weatherDetail: "Rumors change by the hour",
    route: "quarry",
    contentNote: "Smuggling, fraud, and family separation risk",
    source: sources.smugglers,
    messages: [
      {
        sender: "Unknown contact",
        initial: "?",
        role: "Calls himself a coyote; identity unverified",
        time: "11:22",
        trusted: false,
        body: "I take families north. Pay most now, the rest when you arrive. Fast buses, safe houses, no waiting. Decide before noon.",
      },
      {
        sender: "Sister Beatriz",
        initial: "B",
        role: "Shelter network volunteer",
        time: "11:29",
        trusted: true,
        body: "We cannot promise a route. A church bus reaches the next shelter tonight. Keep the family together and do not hand anyone your documents.",
      },
    ],
    known: [
      "The church bus and destination shelter are verified.",
      "The coyote uses a name no traveler recognizes.",
      "A larger group plans to leave on foot this afternoon.",
    ],
    assumed: [
      "The paid guide controls what happens farther north.",
      "A large group will be safer from robbery.",
      "The church bus will pass every checkpoint.",
    ],
    choices: [
      {
        id: "churchBus",
        title: "Take the shelter bus",
        hint: "Slower, verified, and still not risk-free",
        icon: "car",
        tone: "trusted",
        route: "elmstead",
        days: 2,
        next: "roadRobbery",
        requires: { cash: 120 },
        effects: { cash: -120, supplies: -1, stress: -4, exposure: -5, progress: 11 },
        consequence: "Cash -$120 · Food -1 day · Progress +11%",
        outcomeTitle: "Names are checked before anyone boards",
        outcome: "The driver knows the next shelter, but a road closure pushes the bus onto a quieter highway after dark.",
      },
      {
        id: "hireCoyote",
        title: "Hire the coyote",
        hint: "Spend half the land money on an unverified promise",
        icon: "navigate",
        tone: "danger",
        route: "ridge",
        days: 2,
        next: "guideAbandon",
        requires: { cash: 900 },
        effects: { cash: -900, battery: -8, stress: 12, exposure: 12, progress: 18, trustAll: -1 },
        consequence: "Cash -$900 · Stress +12 · Progress +18%",
        outcomeTitle: "The guide takes the deposit",
        outcome: "The first vehicle arrives as promised. The second does not. The family waits in a roadside room with no address and no receipt.",
      },
      {
        id: "largeGroup",
        title: "Join the larger group",
        hint: "Keep the money, accept slower and more visible travel",
        icon: "walk",
        tone: "uncertain",
        route: "quarry",
        days: 3,
        next: "roadRobbery",
        effects: { supplies: -2, water: -4, stress: 5, exposure: 18, progress: 14, peopleAll: -4 },
        consequence: "Food -2 days · Water -4 L · Risk +18",
        outcomeTitle: "Forty people leave together",
        outcome: "There are more eyes on the children and more footsteps on the road. By the third evening, water and patience are both low.",
      },
    ],
  },

  roadRobbery: {
    id: "roadRobbery",
    region: "Southern Mexico",
    location: "Road outside a market town",
    time: "20:15",
    weather: "Warm night",
    weatherDetail: "The last shops are closing",
    route: "quarry",
    contentNote: "Threat of robbery; weapon mentioned without graphic violence",
    source: sources.routes,
    messages: [
      {
        sender: "Family notebook",
        initial: "M",
        role: "Recorded later",
        time: "20:15",
        trusted: true,
        body: "Two thieves step from behind a parked truck. One holds a machete low and asks for every pocket. Daniela's hand closes around Marisol's fingers.",
      },
    ],
    known: [
      "Other people are still within shouting distance.",
      "Most of the cash is in Marisol's bag.",
      "The phone contains every contact and document photo.",
    ],
    assumed: [
      "The thieves will leave after taking one valuable item.",
      "Calling attention will make bystanders intervene.",
      "Hidden money has not been noticed.",
    ],
    choices: [
      {
        id: "handCash",
        title: "Hand over the cash pouch",
        hint: "Lose most savings and keep everyone together",
        icon: "wait",
        tone: "uncertain",
        route: "elmstead",
        days: 1,
        next: "blueDoorShelter",
        effects: { cash: -1200, stress: 16, exposure: -3, progress: 8 },
        consequence: "Cash heavily reduced · Stress +16",
        outcomeTitle: "They take the pouch and leave",
        outcome: "Aurelia waits until the men are gone before showing Marisol the folded emergency bills sewn inside her skirt.",
        setFlags: { emergencyMoney: true },
      },
      {
        id: "offerPhone",
        title: "Offer the phone instead",
        hint: "Keep money, lose contacts and navigation",
        icon: "phone",
        tone: "danger",
        route: "ridge",
        days: 1,
        next: "blueDoorShelter",
        effects: { battery: -100, stress: 18, exposure: 8, progress: 7, trustAll: -1 },
        consequence: "Phone lost · Stress +18 · Risk +8",
        outcomeTitle: "The screen disappears into a pocket",
        outcome: "The money remains, but the family loses the cousin's number, document photos, and the shelter map saved offline.",
        setFlags: { phoneLost: true },
      },
      {
        id: "callForHelp",
        title: "Call toward the open shops",
        hint: "Make the confrontation public",
        icon: "talk",
        tone: "trusted",
        route: "elmstead",
        days: 1,
        next: "blueDoorShelter",
        effects: { cash: -260, battery: -4, stress: 12, exposure: 10, progress: 8, people: { edwin: -6 } },
        consequence: "Cash -$260 · Edwin health -6 · Risk +10",
        outcomeTitle: "A shopkeeper switches on every light",
        outcome: "The thieves grab loose bills and run. The shopkeeper locks the family inside until a shelter van arrives.",
      },
    ],
  },

  guideAbandon: {
    id: "guideAbandon",
    region: "Unknown transit town",
    location: "Roadside rooms",
    time: "06:30",
    weather: "Dry morning",
    weatherDetail: "The guide's phone is disconnected",
    route: "ridge",
    contentNote: "Fraud, abandonment, and coercion risk",
    source: sources.routes,
    messages: [
      {
        sender: "Edwin",
        initial: "E",
        role: "Family notebook",
        time: "06:22",
        trusted: true,
        body: "The coyote is gone. So are the deposit and the copies of our names. A different driver says the price changed and Marisol must ride in front, alone.",
      },
    ],
    known: [
      "The original guide cannot be reached.",
      "A verified shelter number is written inside Aurelia's prayer book.",
      "The replacement driver refuses to keep the family in one vehicle.",
    ],
    assumed: [
      "The new driver is connected to the first guide.",
      "Walking to town is safe in daylight.",
      "The shelter can arrange transport.",
    ],
    choices: [
      {
        id: "callShelter",
        title: "Call the shelter number",
        hint: "Ask for a public pickup and refuse separation",
        icon: "phone",
        tone: "trusted",
        route: "elmstead",
        days: 1,
        next: "blueDoorShelter",
        requires: { battery: 12 },
        effects: { battery: -12, stress: -8, exposure: -8, progress: 5, trustAll: 1 },
        consequence: "Phone -12% · Stress -8 · Risk -8",
        outcomeTitle: "The volunteer asks for a landmark, not a route",
        outcome: "A marked shelter van arrives in daylight. The family leaves the rooms together and the driver does not follow.",
      },
      {
        id: "walkTown",
        title: "Walk toward the town",
        hint: "Abandon the paid route and stay together",
        icon: "walk",
        tone: "uncertain",
        route: "quarry",
        days: 1,
        next: "blueDoorShelter",
        effects: { water: -3, supplies: -1, stress: 9, exposure: 8, progress: 7, people: { aurelia: -8 } },
        consequence: "Water -3 L · Aurelia health -8 · Risk +8",
        outcomeTitle: "The highway takes most of the day",
        outcome: "Aurelia's knee swells, but a mechanic points them toward a shelter with blue doors before sunset.",
      },
      {
        id: "replacementDriver",
        title: "Accept the replacement driver",
        hint: "Keep moving despite a demand to split up",
        icon: "car",
        tone: "danger",
        route: "ridge",
        days: 1,
        next: "blueDoorShelter",
        effects: { cash: -300, stress: 28, exposure: 30, progress: 13, trustAll: -1, people: { marisol: -10 } },
        consequence: "Cash -$300 · Marisol health -10 · Risk +30",
        outcomeTitle: "Marisol refuses to be isolated",
        outcome: "She opens the door at a fuel stop and calls the children out with her. The driver keeps their money and leaves them there.",
      },
    ],
  },

  blueDoorShelter: {
    id: "blueDoorShelter",
    region: "Chiapas",
    location: "Shelter with blue doors",
    time: "18:40",
    weather: "Rain on the roof",
    weatherDetail: "The legal clinic comes Thursday",
    route: "elmstead",
    contentNote: "Non-graphic reference to rape and survivor care",
    source: sources.gbv,
    messages: [
      {
        sender: "Shelter counselor",
        initial: "C",
        role: "Private intake note",
        time: "18:32",
        trusted: true,
        body: "A woman traveling with another group arrived after being raped on the road. The assault is not shown. A nurse asks what care she wants; nobody asks her to retell it for the room. Marisol helps watch her children while she decides.",
      },
      {
        sender: "Aurelia",
        initial: "A",
        role: "At dinner",
        time: "19:05",
        trusted: true,
        body: "The soup is mostly beans. It is also hot, and every person at this table has a name.",
      },
    ],
    known: [
      "The shelter offers confidential medical and legal referrals.",
      "The family may stay for three nights.",
      "A verified bus company travels north from the next city.",
    ],
    assumed: [
      "Three nights will not exhaust the remaining money.",
      "The bus route will remain open.",
      "The phone can be repaired nearby.",
    ],
    choices: [
      {
        id: "stayShelter",
        title: "Stay for three nights",
        hint: "Rest, seek care, and attend the legal clinic",
        icon: "rest",
        tone: "trusted",
        route: "elmstead",
        days: 3,
        next: "waitingTown",
        effects: { cash: -90, supplies: 2, water: 6, battery: 100, stress: -20, exposure: -12, progress: 7, peopleAll: 12, trustAll: 1 },
        consequence: "Health +12 each · Phone charged · Risk -12",
        outcomeTitle: "Three nights with a locked door",
        outcome: "Daniela's cough eases. A lawyer organizes the land deed, school records, and written threat into one dry folder.",
        setFlags: { legalPacket: true },
        contextBonuses: [
          {
            flag: "shelterContacts",
            kind: "payoff",
            label: "The verified list leads directly to the blue-door shelter",
            effects: { cash: 20, exposure: -3 },
          },
        ],
      },
      {
        id: "helpKitchen",
        title: "Help the shelter while you rest",
        hint: "Trade time and labor for food and reliable information",
        icon: "work",
        tone: "trusted",
        route: "elmstead",
        days: 4,
        next: "waitingTown",
        effects: { supplies: 3, water: 8, battery: 80, stress: -15, exposure: -14, progress: 6, peopleAll: 8, trustAll: 1 },
        consequence: "Food +3 days · Water +8 L · Cohesion rises",
        outcomeTitle: "The family works the dinner shift",
        outcome: "Edwin repairs two fans. Aurelia teaches Daniela and three other children a card game that requires no shared language.",
      },
      {
        id: "leaveMorning",
        title: "Leave after one night",
        hint: "Keep the travel window, give up more recovery",
        icon: "navigate",
        tone: "uncertain",
        route: "quarry",
        days: 1,
        next: "waitingTown",
        effects: { supplies: 1, water: 3, battery: 35, stress: -4, exposure: -4, progress: 10, peopleAll: 3 },
        consequence: "Food +1 day · Phone partly charged · Progress +10%",
        outcomeTitle: "Breakfast is wrapped for the road",
        outcome: "The counselor writes two verified addresses on paper in case the phone fails again.",
      },
    ],
  },

  waitingTown: {
    id: "waitingTown",
    region: "Southern Mexico",
    location: "Room above a mechanic's shop",
    time: "17:25",
    weather: "Afternoon rain",
    weatherDetail: "Northbound departures have been suspended again",
    route: "quarry",
    contentNote: "Housing insecurity, fraud, and prolonged uncertainty",
    source: sources.routes,
    messages: [
      {
        sender: "Marisol",
        initial: "M",
        role: "Family notebook · Day twelve",
        time: "17:12",
        trusted: true,
        body: "The room is paid by the week. The landlord wants the next payment tomorrow. Every morning someone says the buses will move; every evening the same bags are still against the wall.",
      },
      {
        sender: "Shelter noticeboard",
        initial: "i",
        role: "Verified local update",
        time: "16:50",
        trusted: true,
        body: "Travel has slowed after new inspections. Families can join the shelter rotation, remain in private rooms, or verify tickets only at the official station window.",
      },
    ],
    known: [
      "The landlord will provide a receipt for another twelve days.",
      "The shelter rotation includes meals but little privacy.",
      "A street reseller's tickets cannot be verified at the station.",
    ],
    assumed: [
      "The delay will end before the next rent payment.",
      "A private room is always safer than a crowded shelter.",
      "The reseller has access to seats the station is hiding.",
    ],
    choices: [
      {
        id: "rentWhileWaiting",
        title: "Pay for twelve more days",
        hint: "Keep one locked room and wait for verified transport",
        icon: "rest",
        tone: "trusted",
        route: "elmstead",
        days: 12,
        next: "clinicQueue",
        requires: { cash: 180 },
        effects: { cash: -180, supplies: -1, water: -3, stress: -3, exposure: -5, progress: 4, peopleAll: 2 },
        consequence: "Cash -$180 · 12 days pass · Risk -5",
        outcomeTitle: "The bags remain packed for twelve days",
        outcome: "Marisol takes posted day work when it appears. Edwin studies repair diagrams borrowed from the mechanic. Waiting becomes its own kind of travel.",
        skillBonus: {
          personId: "marisol",
          skill: "Planning",
          label: "Marisol budgets the room and finds posted day work",
          effects: { cash: 30, stress: -2 },
        },
        contextBonuses: [
          {
            flag: "emergencyMoney",
            kind: "payoff",
            label: "Aurelia's hidden emergency bills cover part of the room",
            effects: { cash: 60, stress: -2 },
          },
        ],
      },
      {
        id: "shelterRotation",
        title: "Join the shelter rotation",
        hint: "Save rent, accept crowds and changing beds",
        icon: "aid",
        tone: "uncertain",
        route: "quarry",
        days: 9,
        next: "clinicQueue",
        effects: { cash: -45, supplies: 1, water: 2, stress: 6, exposure: -8, progress: 3, peopleAll: -1 },
        consequence: "9 days pass · Food +1 day · Stress +6",
        outcomeTitle: "Every third night brings a different room",
        outcome: "The family keeps their bags under one blanket. Volunteers provide meals and reliable updates, but sleep comes in short pieces.",
      },
      {
        id: "resellerTicket",
        title: "Buy the reseller's ticket",
        hint: "Try to leave sooner with an unverified ticket",
        icon: "navigate",
        tone: "danger",
        route: "ridge",
        days: 3,
        next: "clinicQueue",
        requires: { cash: 160 },
        effects: { cash: -160, stress: 14, exposure: 10, progress: 7, trustAll: -1 },
        consequence: "Cash -$160 · Stress +14 · Risk +10",
        outcomeTitle: "The barcode belongs to another date",
        outcome: "The station rejects the ticket. The reseller is gone, and Daniela's cough worsens during three days spent moving between waiting rooms.",
      },
    ],
  },

  clinicQueue: {
    id: "clinicQueue",
    region: "Southern Mexico",
    location: "Community clinic courtyard",
    time: "06:45",
    weather: "Cool morning",
    weatherDetail: "Forty-three names are ahead of Daniela",
    route: "elmstead",
    contentNote: "Child illness and breathing distress",
    source: sources.routes,
    messages: [
      {
        sender: "Marisol",
        initial: "M",
        role: "Family notebook",
        time: "06:32",
        trusted: true,
        body: "Daniela has four inhaler doses left. She says she can breathe if she sits still. The clinic is free, the pharmacy is not, and the next verified bus leaves tomorrow.",
      },
    ],
    known: [
      "The humanitarian clinic will see children, but the queue may take three days.",
      "A licensed pharmacy has the prescribed refill in stock.",
      "Continuing without care risks a more serious breathing crisis.",
    ],
    assumed: [
      "The clinic queue will move in the order names were written.",
      "The bus company will honor tomorrow's ticket after a delay.",
      "Daniela will remain stable if the family leaves now.",
    ],
    choices: [
      {
        id: "waitForClinic",
        title: "Wait for the clinic",
        hint: "Spend three days and receive supervised care",
        icon: "aid",
        tone: "trusted",
        route: "elmstead",
        days: 3,
        next: "transport",
        effects: { cash: -20, supplies: 1, medicine: 1, stress: -5, exposure: -3, progress: 2, people: { daniela: 9, aurelia: 3 } },
        consequence: "Medicine +1 · Daniela health +9 · 3 days pass",
        outcomeTitle: "Daniela's name is called on the third morning",
        outcome: "A clinician checks her breathing, replaces the inhaler, and writes the medicine name on paper in case the phone is lost.",
        contextBonuses: [
          {
            flag: "phoneLost",
            kind: "setback",
            label: "Without the saved map, local travel to find the clinic costs $25",
            effects: { cash: -25, stress: 3 },
          },
        ],
      },
      {
        id: "buyPharmacyRefill",
        title: "Buy the pharmacy refill",
        hint: "Spend more and keep tomorrow's bus",
        icon: "medical",
        tone: "uncertain",
        route: "quarry",
        days: 1,
        next: "transport",
        requires: { cash: 95 },
        effects: { cash: -95, medicine: 1, stress: -4, progress: 4, people: { daniela: 7 } },
        consequence: "Cash -$95 · Medicine +1 · Daniela health +7",
        outcomeTitle: "The pharmacist seals the refill in a plastic bag",
        outcome: "The family keeps the bus ticket. Marisol also keeps the receipt and the printed instructions, knowing another refill may be harder to find.",
      },
      {
        id: "continueWithoutCare",
        title: "Keep the travel window",
        hint: "Leave now with four doses and no medical review",
        icon: "navigate",
        tone: "danger",
        route: "ridge",
        days: 1,
        next: "transport",
        effects: { stress: 15, exposure: 5, progress: 7, trustAll: -1, people: { daniela: -14 } },
        consequence: "Daniela health -14 · Stress +15 · Progress +7%",
        outcomeTitle: "Every cough changes the rhythm of the trip",
        outcome: "The family boards without knowing when the next clinic will appear. Marisol counts inhaler doses instead of kilometers.",
      },
    ],
  },

  transport: {
    id: "transport",
    region: "Central Mexico",
    location: "Freight and bus corridor",
    time: "07:20",
    weather: "Bright heat",
    weatherDetail: "Checkpoints reported on the highway",
    route: "elmstead",
    contentNote: "Injury, extortion, and exploitation risk",
    source: sources.routes,
    messages: [
      {
        sender: "Shelter noticeboard",
        initial: "i",
        role: "Information from three recent groups",
        time: "07:00",
        trusted: true,
        body: "Buses cost most of what many families have left. Freight trains are cheaper and far more dangerous. A second paid guide is asking for cash with no receipt.",
      },
    ],
    known: [
      "The bus company is licensed, but document checks are possible.",
      "People have been injured riding freight trains.",
      "The paid guide's reputation cannot be verified.",
    ],
    assumed: [
      "The bus will complete the full trip.",
      "The family can board and leave the train safely.",
      "The new guide is unrelated to the first.",
    ],
    choices: [
      {
        id: "busNorth",
        title: "Buy bus tickets",
        hint: "Spend heavily for a seat and a public route",
        icon: "car",
        tone: "trusted",
        route: "elmstead",
        days: 4,
        next: "checkpointDelay",
        requires: { cash: 260 },
        effects: { cash: -260, supplies: -2, water: -4, stress: 4, exposure: 14, progress: 18 },
        consequence: "Cash -$260 · Risk +14 · Progress +18%",
        outcomeTitle: "The bus moves north in daylight",
        outcome: "The family sleeps sitting up. At each stop, Marisol counts four heads before the driver closes the door.",
      },
      {
        id: "freightTrain",
        title: "Ride the freight corridor",
        hint: "Faster and cheaper, with serious fall and extortion risk",
        icon: "navigate",
        tone: "danger",
        route: "ridge",
        days: 3,
        next: "checkpointDelay",
        effects: { cash: -80, supplies: -2, water: -5, stress: 18, exposure: 18, progress: 23, peopleAll: -10, people: { aurelia: -8 } },
        consequence: "Health falls · Stress +18 · Progress +23%",
        outcomeTitle: "Every movement requires both hands",
        outcome: "No one sleeps. Aurelia's knee buckles during a stop, and strangers lift her down before the train moves again.",
      },
      {
        id: "secondGuide",
        title: "Pay another guide",
        hint: "Faster if the promises are true",
        icon: "walk",
        tone: "danger",
        route: "ridge",
        days: 3,
        next: "checkpointDelay",
        requires: { cash: 450 },
        effects: { cash: -450, supplies: -1, water: -3, stress: 14, exposure: 10, progress: 21, trustAll: -1 },
        consequence: "Cash -$450 · Stress +14 · Progress +21%",
        outcomeTitle: "This guide keeps the first promise",
        outcome: "The family reaches the northern corridor. The guide then asks for more money to continue and refuses to explain the next vehicle.",
      },
    ],
  },

  checkpointDelay: {
    id: "checkpointDelay",
    region: "Central-northern Mexico",
    location: "Interior bus checkpoint",
    time: "14:15",
    weather: "White midday heat",
    weatherDetail: "The buses have not moved since morning",
    route: "quarry",
    contentNote: "Immigration enforcement, detention fear, and extortion risk",
    source: sources.routes,
    messages: [
      {
        sender: "Bus driver",
        initial: "D",
        role: "Public announcement",
        time: "13:48",
        trusted: true,
        body: "The vehicle may remain here for several days while permits and passenger documents are reviewed. Nobody can promise who will be allowed to continue.",
      },
      {
        sender: "Unknown guide",
        initial: "?",
        role: "Unverified voice message",
        time: "14:02",
        trusted: false,
        body: "Pay today and I will move your family around the delay. No documents needed. Do not ask where the next vehicle waits.",
      },
    ],
    known: [
      "The licensed bus company is contesting the delay.",
      "A verified shelter van can collect families from the public station.",
      "The guide will not provide a name, receipt, or destination.",
    ],
    assumed: [
      "Staying on the bus guarantees permission to continue.",
      "Leaving for the shelter will invalidate every ticket.",
      "The unknown guide controls the inspection schedule.",
    ],
    choices: [
      {
        id: "remainWithBus",
        title: "Remain with the licensed bus",
        hint: "Keep the ticket and accept document review",
        icon: "wait",
        tone: "uncertain",
        route: "quarry",
        days: 4,
        next: "policyNews",
        effects: { cash: -70, supplies: -1, water: -2, stress: 10, exposure: 12, progress: 5 },
        consequence: "4 days pass · Stress +10 · Risk +12",
        outcomeTitle: "The bus moves on the fourth evening",
        outcome: "Officers copy names and return the shelter letters. The family continues, but nobody explains why this bus was released and another was not.",
        skillBonus: {
          personId: "edwin",
          skill: "Some English",
          label: "Edwin follows the announcements and avoids a false line",
          effects: { stress: -4, exposure: -3 },
        },
      },
      {
        id: "waitForShelterVan",
        title: "Wait for the shelter van",
        hint: "Leave the bus for a verified public pickup",
        icon: "aid",
        tone: "trusted",
        route: "elmstead",
        days: 6,
        next: "policyNews",
        effects: { cash: -50, supplies: 1, water: 3, stress: 3, exposure: -5, progress: 3, trustAll: 1 },
        consequence: "6 days pass · Food +1 day · Risk -5",
        outcomeTitle: "Six days pass under the shelter's address",
        outcome: "The van arrives in daylight. The family loses the original tickets but receives meals, a receipt, and places on a later bus.",
        contextBonuses: [
          {
            flag: "communityFavor",
            kind: "payoff",
            label: "A community-center contact confirms the pickup",
            effects: { cash: 20, stress: -2 },
          },
        ],
      },
      {
        id: "payCheckpointGuide",
        title: "Pay the unknown guide",
        hint: "Move sooner through an unverified arrangement",
        icon: "navigate",
        tone: "danger",
        route: "ridge",
        days: 2,
        next: "policyNews",
        requires: { cash: 220 },
        effects: { cash: -220, water: -2, stress: 18, exposure: 20, progress: 9, trustAll: -1 },
        consequence: "Cash -$220 · Stress +18 · Risk +20",
        outcomeTitle: "The family is transferred twice without explanation",
        outcome: "They reach the next city, but the guide keeps their documents until the last vehicle stops. Marisol gets the papers back only after refusing another payment.",
      },
    ],
  },

  policyNews: {
    id: "policyNews",
    region: "Northern Mexico",
    location: "Crowded waiting room",
    time: "21:05",
    weather: "Dust outside",
    weatherDetail: "Rules at the border changed again",
    route: "quarry",
    contentNote: "Hostile political rhetoric and deportation",
    source: sources.policy,
    messages: [
      {
        sender: "News alert",
        initial: "N",
        role: "Verified public policy report",
        time: "20:48",
        trusted: true,
        body: "A clip of President Donald Trump plays beside a White House order calling for broader enforcement, detention capacity, and removals. The legal volunteer says the policy is real; the group-chat explanation is not reliable.",
      },
      {
        sender: "Liberty Stream",
        initial: "L",
        role: "Fictional MAGA-style influencer · unverified commentary",
        time: "20:56",
        trusted: false,
        body: "The streamer cheers over footage of people boarding a deportation flight. Edwin recognizes cousin Mateo in the line. The video treats his removal as entertainment.",
      },
    ],
    known: [
      "The enforcement order and expanded detention policy are public documents.",
      "The influencer is commentary, not legal information.",
      "Cousin Mateo's phone no longer connects.",
    ],
    assumed: [
      "Mateo has already reached Honduras.",
      "Every family at the border will face the same process.",
      "Arguing online can correct the false claims.",
    ],
    choices: [
      {
        id: "callLegalAid",
        title: "Save the clip and call legal aid",
        hint: "Verify what changed before making the next decision",
        icon: "legal",
        tone: "trusted",
        route: "elmstead",
        days: 1,
        next: "northernWait",
        requires: { battery: 12 },
        effects: { battery: -12, stress: -6, exposure: -10, progress: 5, trustAll: 1 },
        consequence: "Phone -12% · Stress -6 · Risk -10",
        outcomeTitle: "The lawyer separates policy from rumor",
        outcome: "She cannot promise entry or release. She explains the appointment, detention, and return possibilities in plain language.",
        setFlags: { legalAdvice: true },
      },
      {
        id: "comfortChildren",
        title: "Turn off the video",
        hint: "Tell the children what is known and what is not",
        icon: "rest",
        tone: "uncertain",
        route: "quarry",
        days: 1,
        next: "northernWait",
        effects: { stress: -9, exposure: -3, progress: 4, trustAll: 1 },
        consequence: "Stress -9 · Cohesion rises",
        outcomeTitle: "Aurelia says Mateo's name",
        outcome: "The family refuses to let a stranger's celebration become the last word about someone they love.",
      },
      {
        id: "argueOnline",
        title: "Reply to the influencer",
        hint: "Defend Mateo publicly, revealing the family's account",
        icon: "talk",
        tone: "danger",
        route: "ridge",
        days: 1,
        next: "northernWait",
        effects: { battery: -16, stress: 12, exposure: 22, progress: 4 },
        consequence: "Phone -16% · Stress +12 · Risk +22",
        outcomeTitle: "The replies multiply faster than facts",
        outcome: "Strangers repost the family profile and call them criminals. Marisol deletes the thread, but screenshots remain.",
      },
    ],
  },

  northernWait: {
    id: "northernWait",
    region: "Northern Mexico",
    location: "Migrant shelter waiting list",
    time: "09:30",
    weather: "Cold desert morning",
    weatherDetail: "The appointment system has failed twice this week",
    route: "elmstead",
    contentNote: "Prolonged displacement, unstable housing, and appointment fraud",
    source: sources.policy,
    messages: [
      {
        sender: "Shelter coordinator",
        initial: "S",
        role: "Verified morning briefing",
        time: "09:08",
        trusted: true,
        body: "The family may remain on the verified list, but the wait could be weeks. A local landlord offers a monthly room. A broker outside claims he can sell an earlier appointment; the clinic says appointments are not for sale.",
      },
      {
        sender: "Edwin",
        initial: "E",
        role: "Family notebook · Day forty-one",
        time: "09:19",
        trusted: true,
        body: "I thought the road would be walking. Mostly it is waiting with shoes on, afraid the one time you sleep will be the time your name is called.",
      },
    ],
    known: [
      "The shelter list is verified but has no guaranteed date.",
      "A monthly room allows the family to stay together and seek temporary work.",
      "The legal clinic says the broker cannot sell official appointments.",
    ],
    assumed: [
      "The verified list will move within three weeks.",
      "A longer local stay will make the eventual process harder.",
      "The broker has a contact inside the appointment system.",
    ],
    choices: [
      {
        id: "verifiedWaitlist",
        title: "Remain on the verified list",
        hint: "Wait three weeks with the shelter network",
        icon: "wait",
        tone: "trusted",
        route: "elmstead",
        days: 21,
        next: "borderCity",
        effects: { cash: -210, supplies: 1, water: 2, stress: 10, exposure: -8, progress: 4, peopleAll: -2 },
        consequence: "21 days pass · Cash -$210 · Risk -8",
        outcomeTitle: "Three weeks are crossed out one square at a time",
        outcome: "The family rotates between two shelters. On the twenty-first day, the clinic confirms a place in the next stage of the official process.",
      },
      {
        id: "rentNorthernRoom",
        title: "Rent a room for one month",
        hint: "Pause, work locally, and keep checking the list",
        icon: "rest",
        tone: "uncertain",
        route: "quarry",
        days: 30,
        next: "borderCity",
        requires: { cash: 260 },
        effects: { cash: -260, supplies: 2, water: 4, stress: -6, exposure: 3, progress: 3, peopleAll: 5, trustAll: 1 },
        consequence: "30 days pass · Health +5 each · Cash -$260",
        outcomeTitle: "For one month, the key belongs to the family",
        outcome: "Marisol works temporary shifts, Edwin studies with borrowed books, and Daniela learns the walk to the corner shop. The appointment still decides when they leave.",
      },
      {
        id: "payAppointmentBroker",
        title: "Pay the appointment broker",
        hint: "Risk savings on a promise the clinic says is false",
        icon: "navigate",
        tone: "danger",
        route: "ridge",
        days: 5,
        next: "borderCity",
        requires: { cash: 350 },
        effects: { cash: -350, battery: -12, stress: 20, exposure: 16, progress: 6, trustAll: -1 },
        consequence: "Cash -$350 · Stress +20 · Risk +16",
        outcomeTitle: "The confirmation page disappears",
        outcome: "The broker blocks Marisol's number. The appointment code never works, and the family returns to the shelter list with less money and five lost days.",
      },
    ],
  },

  borderCity: {
    id: "borderCity",
    region: "U.S.-Mexico border region",
    location: "Border-city shelter",
    time: "16:10",
    weather: "Dry wind",
    weatherDetail: "Appointment access is restricted",
    route: "elmstead",
    contentNote: "Detention, deportation, and child endangerment",
    source: sources.routes,
    messages: [
      {
        sender: "Legal clinic",
        initial: "J",
        role: "Verified adviser",
        time: "15:44",
        trusted: true,
        body: "You may ask for protection through the official process, but detention is possible and the outcome is uncertain. A coyote outside is offering a crowded river boat. We cannot tell you what to choose.",
      },
    ],
    known: [
      "The official process may involve detention and an interview.",
      "The boat is visibly overloaded and has too few life jackets.",
      "Remaining in Mexico is possible, though work and housing are uncertain.",
    ],
    assumed: [
      "The official appointment will keep the family together.",
      "The boat operator will return for anyone left behind.",
      "A transit-country asylum claim will be accepted.",
    ],
    choices: [
      {
        id: "officialAppointment",
        title: "Present through the official process",
        hint: "Accept detention risk and ask for protection",
        icon: "legal",
        tone: "trusted",
        route: "elmstead",
        days: 8,
        next: "detention",
        effects: { cash: -160, supplies: -2, water: -3, stress: 16, exposure: -18, progress: 18 },
        consequence: "8 days pass · Stress +16 · Progress +18%",
        outcomeTitle: "The family receives numbered wristbands",
        outcome: "Their phones and shoelaces are taken for storage. They are moved to a processing room where the lights stay on all night.",
        contextBonuses: [
          {
            flag: "legalAdvice",
            kind: "payoff",
            label: "The earlier legal call helps the family prepare",
            effects: { stress: -4, exposure: -3 },
          },
        ],
      },
      {
        id: "boatOffer",
        title: "Pay for the river boat",
        hint: "A shorter path with an overloaded boat and no guarantees",
        icon: "navigate",
        tone: "danger",
        route: "ridge",
        days: 1,
        next: "riverCrossing",
        requires: { cash: 500 },
        effects: { cash: -500, stress: 20, exposure: 28, progress: 12, trustAll: -1 },
        consequence: "Cash -$500 · Stress +20 · Risk +28",
        outcomeTitle: "The boat is smaller than promised",
        outcome: "The operator keeps counting passengers after every safe space is gone. Daniela asks why there are only three life jackets.",
      },
      {
        id: "stayMexico",
        title: "Stop and seek protection in Mexico",
        hint: "End this journey together in a transit country",
        icon: "rest",
        tone: "uncertain",
        route: "quarry",
        days: 14,
        next: null,
        effects: { cash: -280, supplies: -2, stress: -14, exposure: -20, progress: 76, peopleAll: 6 },
        consequence: "The northbound journey ends · Family remains together",
        outcomeTitle: "A different future becomes possible",
        outcome: "The family enters a local protection process. Work, school, and housing are uncertain, but nobody boards the boat today.",
        ending: {
          type: "transit",
          status: "won",
          title: "A life in the transit country",
          copy: "The family stops moving north and begins again in Mexico. This is not framed as failure; safety and stability can take more than one form.",
        },
      },
    ],
  },

  riverCrossing: {
    id: "riverCrossing",
    region: "Border river",
    location: "Unmarked riverbank",
    time: "02:20",
    weather: "Cold current",
    weatherDetail: "The boat sits low in the water",
    route: "ridge",
    contentNote: "Child death and drowning risk; no graphic depiction",
    source: sources.missing,
    messages: [
      {
        sender: "Family notebook",
        initial: "M",
        role: "Written before boarding",
        time: "02:14",
        trusted: true,
        body: "The operator says there is no time to wait. Another family refuses to board. A rescue light is visible downstream, but the phone has almost no signal.",
      },
    ],
    known: [
      "The boat is overloaded.",
      "There are not enough life jackets.",
      "The family can still turn back together.",
    ],
    assumed: [
      "The crossing takes only a few minutes.",
      "The operator can control the boat in the current.",
      "The distant light belongs to a rescue team.",
    ],
    choices: [
      {
        id: "callRescue",
        title: "Call for rescue and wait",
        hint: "Use the remaining signal and accept apprehension",
        icon: "phone",
        tone: "trusted",
        route: "elmstead",
        days: 1,
        next: "detention",
        requires: { battery: 20 },
        effects: { battery: -20, stress: 8, exposure: 24, progress: 10, peopleAll: -3 },
        consequence: "Phone -20% · Risk +24 · Family remains together",
        outcomeTitle: "A patrol boat answers the call",
        outcome: "The family is taken to processing. They are cold, exhausted, and alive. Detention is still possible.",
      },
      {
        id: "turnBackRiver",
        title: "Refuse the boat and turn back",
        hint: "Lose the payment and return to the legal clinic",
        icon: "walk",
        tone: "uncertain",
        route: "quarry",
        days: 2,
        next: "detention",
        effects: { supplies: -1, water: -2, stress: 6, exposure: -8, progress: 4, people: { aurelia: -5 } },
        consequence: "Food -1 day · Progress slows · Family remains together",
        outcomeTitle: "The operator leaves without them",
        outcome: "Marisol listens to the motor fade. At dawn, the legal clinic helps the family present at the official process.",
      },
      {
        id: "boardOverloaded",
        title: "Board before the current rises",
        hint: "The fastest option carries an extreme, irreversible risk",
        icon: "navigate",
        tone: "danger",
        route: "ridge",
        days: 1,
        next: "memorial",
        effects: { supplies: -1, water: -4, stress: 40, exposure: 35, progress: 15, peopleAll: -18, fatality: "daniela" },
        consequence: "Daniela dies · Stress +40 · The journey continues with loss",
        outcomeTitle: "The boat turns sideways",
        outcome: "The current throws everyone into the dark water. Marisol reaches Edwin and Aurelia. Daniela slips from her grasp. Search lights move across the river until dawn, but do not find her.",
        deferThresholdEnding: true,
      },
    ],
  },

  memorial: {
    id: "memorial",
    region: "Border processing zone",
    location: "Temporary family room",
    time: "19:30",
    weather: "Wind against glass",
    weatherDetail: "Search operations ended at dusk",
    route: "ridge",
    contentNote: "Death of a child and grief",
    source: sources.missing,
    messages: [
      {
        sender: "Family notebook",
        initial: "M",
        role: "Memorial entry",
        time: "19:30",
        trusted: true,
        body: "Daniela's stuffed rabbit is on the chair. The game pauses here. There is no score for surviving someone you love.",
      },
    ],
    known: [
      "Daniela died during the crossing.",
      "The surviving family members are together.",
      "A Red Cross family-tracing worker has recorded her name.",
    ],
    assumed: [
      "Continuing means leaving Daniela behind.",
      "Returning home will make grief easier.",
      "Any ending can repair what happened.",
    ],
    choices: [
      {
        id: "lightCandle",
        title: "Light a candle and say her name",
        hint: "Create a private memorial before the interview",
        icon: "rest",
        tone: "trusted",
        route: "elmstead",
        days: 1,
        next: "detention",
        effects: { stress: -10, exposure: -6, progress: 4, trustAll: 1 },
        consequence: "Daniela is remembered · Cohesion rises",
        outcomeTitle: "Nube sits beside the candle",
        outcome: "Each person tells one true thing about Daniela. Nobody calls the moment closure.",
      },
      {
        id: "recordName",
        title: "Record her name with family tracing",
        hint: "Preserve the record and ask for the search report",
        icon: "legal",
        tone: "uncertain",
        route: "quarry",
        days: 1,
        next: "detention",
        effects: { battery: -5, stress: 2, exposure: -8, progress: 4 },
        consequence: "A formal record is created",
        outcomeTitle: "The worker spells every name back",
        outcome: "Marisol receives a case number and a promise that any future information will be shared. It is a process, not an answer.",
      },
      {
        id: "returnAfterLoss",
        title: "End the journey and return",
        hint: "Choose grief at home over another institution",
        icon: "wait",
        tone: "danger",
        route: "ridge",
        days: 6,
        next: null,
        effects: { stress: 8, exposure: -30, progress: 58 },
        consequence: "The journey ends after Daniela's death",
        outcomeTitle: "The road turns south",
        outcome: "The surviving family accepts return assistance. They go home without the land and without Daniela.",
        ending: {
          type: "returned",
          status: "stopped",
          title: "Returned with an empty place",
          copy: "The family returns to Honduras after Daniela's death. The threats that forced them out have not disappeared, and neither has her name.",
        },
      },
    ],
  },

  detention: {
    id: "detention",
    region: "United States processing system",
    location: "Family detention facility",
    time: "03:05",
    weather: "Fluorescent light",
    weatherDetail: "No one knows when the next interview begins",
    route: "elmstead",
    contentNote: "Civil detention and deportation",
    source: sources.policy,
    messages: [
      {
        sender: "Facility notice",
        initial: "i",
        role: "Translated by a volunteer",
        time: "02:40",
        trusted: true,
        body: "The family may request legal counsel, but none is automatically provided for this civil immigration process. They may contest removal, remain detained while the case continues, or accept a removal order.",
      },
    ],
    known: [
      "A legal-aid lawyer can review the land deed and threat evidence.",
      "Detention can continue while a case is pending.",
      "A removal order sends the family back to Honduras.",
    ],
    assumed: [
      "Requesting counsel guarantees release.",
      "Accepting removal reunites the family quickly.",
      "The case outcome can be predicted from one interview.",
    ],
    choices: [
      {
        id: "requestLawyer",
        title: "Request the legal-aid lawyer",
        hint: "Present the threat evidence and accept a longer wait",
        icon: "legal",
        tone: "trusted",
        route: "elmstead",
        days: 18,
        next: null,
        requires: { battery: 5 },
        effects: { battery: -5, cash: -120, supplies: -1, stress: 8, exposure: -20, progress: 100, trustAll: 1 },
        consequence: "18 days pass · Case continues · Journey reaches an ending",
        outcomeTitle: "The lawyer starts at the beginning",
        outcome: "The family is released to a sponsor while the protection case proceeds. Release is not asylum, and the next hearing is months away.",
        contextBonuses: [
          {
            flag: "landPapers",
            kind: "payoff",
            label: "The recovered land deed supports the family timeline",
            effects: { stress: -4, exposure: -5 },
          },
          {
            flag: "legalPacket",
            kind: "payoff",
            label: "The shelter's organized evidence packet saves time",
            effects: { exposure: -5 },
          },
          {
            flag: "legalAdvice",
            kind: "payoff",
            label: "Earlier legal advice helps Marisol explain the case",
            effects: { stress: -3 },
          },
        ],
        ending: {
          type: "released",
          status: "won",
          title: "Released while the case continues",
          copy: "The family reaches a cousin's apartment with a court date, debt, and no guarantee of protection. Arrival is the start of another uncertain chapter.",
        },
      },
      {
        id: "contestDetained",
        title: "Contest removal while detained",
        hint: "Keep the case open and remain in institutional limbo",
        icon: "wait",
        tone: "uncertain",
        route: "quarry",
        days: 30,
        next: null,
        effects: { cash: -240, supplies: -2, stress: 26, exposure: -15, progress: 92, peopleAll: -5 },
        consequence: "30 days pass · Health falls · The case remains unresolved",
        outcomeTitle: "Another month is marked on the wall",
        outcome: "The family stays together, but the facility becomes their whole world. The game ends while they are still waiting.",
        ending: {
          type: "detained",
          status: "stopped",
          title: "Detained in legal limbo",
          copy: "The case has not been decided. The family remains detained, counting hearings and phone calls rather than miles.",
        },
      },
      {
        id: "acceptRemoval",
        title: "Accept the removal order",
        hint: "End detention by returning to the danger that began the journey",
        icon: "navigate",
        tone: "danger",
        route: "ridge",
        days: 9,
        next: null,
        effects: { stress: 24, exposure: -40, progress: 84, trustAll: -1 },
        consequence: "The family is deported to Honduras",
        outcomeTitle: "Their names are called for the flight",
        outcome: "A social-media clip celebrates the removal numbers. It does not show where the family will sleep after landing.",
        ending: {
          type: "deported",
          status: "stopped",
          title: "Deported to the place they fled",
          copy: "The family returns without the money from the forced sale of their home and with the original threat unresolved. Deportation ends the route, not the reasons they left.",
        },
      },
    ],
  },

  haddadHome: {
    id: "haddadHome",
    region: "Northern Syria · 2015",
    location: "The Haddad apartment",
    time: "04:40",
    weather: "Dust before dawn",
    weatherDetail: "The electricity has been out since yesterday",
    route: "elmstead",
    contentNote: "War, bombardment, and forced displacement",
    source: sources.syria,
    messages: [
      {
        sender: "Nadia",
        initial: "N",
        role: "Family conversation",
        time: "04:32",
        trusted: true,
        body: "The workshop is gone. The school is closed. Kareem was ordered to report to an armed unit, and the next street was hit last night. We have four bags, the document folder, and one apartment key.",
      },
    ],
    known: [
      "The workshop that supported the family was destroyed.",
      "The children cannot safely return to school.",
      "A neighbor plans to leave for the Turkish border before sunrise.",
    ],
    assumed: [
      "The apartment will still be standing next month.",
      "The neighbor knows which roads remain open.",
      "Leaving today means the family will never return.",
    ],
    choices: [
      {
        id: "haddadNeighborConvoy",
        title: "Leave with the neighbor's convoy",
        hint: "Stay with people the family knows, but leave immediately",
        icon: "car",
        tone: "trusted",
        route: "elmstead",
        days: 2,
        next: "haddadBorder",
        effects: { supplies: -1, water: -3, stress: 5, exposure: 4, progress: 7 },
        consequence: "Food -1 day · Water -3 L · The family stays together",
        outcomeTitle: "The apartment key turns once more",
        outcome: "Nadia locks a door that may no longer protect anything. The convoy travels slowly and stops whenever aircraft are heard.",
        setFlags: { keptDocuments: true },
      },
      {
        id: "haddadWaitForUncle",
        title: "Wait for Nadia's brother to call",
        hint: "Seek better information while supplies and time run down",
        icon: "wait",
        tone: "uncertain",
        route: "quarry",
        days: 4,
        next: "haddadBorder",
        effects: { supplies: -2, water: -4, battery: -24, stress: 11, exposure: 7, progress: 5 },
        consequence: "Four days pass · Phone -24% · Food -2 days",
        outcomeTitle: "A short message arrives through static",
        outcome: "Her brother confirms a reception center across the border, but cannot confirm whether the road to it is open.",
        setFlags: { receptionContact: true },
      },
      {
        id: "haddadFirstBroker",
        title: "Pay a broker to leave tonight",
        hint: "Buy speed from someone who refuses to give his full name",
        icon: "navigate",
        tone: "danger",
        route: "ridge",
        days: 1,
        next: "haddadBorder",
        requires: { cash: 600 },
        effects: { cash: -600, stress: 13, exposure: 15, progress: 9, trustAll: -1 },
        consequence: "Cash -$600 · Risk +15 · Trust falls",
        outcomeTitle: "The first promise changes at the first stop",
        outcome: "The broker moves the family to an unfinished house and demands another payment before explaining when they will leave.",
        setFlags: { brokerDebt: true },
      },
    ],
  },

  haddadBorder: {
    id: "haddadBorder",
    region: "Türkiye–Syria border region · 2015",
    location: "A crowded reception town",
    time: "16:10",
    weather: "Cold rain",
    weatherDetail: "Families wait beneath plastic sheeting",
    route: "elmstead",
    contentNote: "Border controls and exploitation risk",
    source: sources.syria,
    messages: [
      {
        sender: "Aid desk volunteer",
        initial: "A",
        role: "Registered humanitarian worker",
        time: "15:55",
        trusted: true,
        body: "Registration can connect you with temporary protection and health care here. It does not guarantee travel onward or a place in Europe.",
      },
    ],
    known: [
      "Mariam's breathing is worse in the wet weather.",
      "Registration is free at the marked aid desk.",
      "A cousin has offered one room several hours away.",
    ],
    assumed: [
      "Registering will prevent every future detention.",
      "The cousin can host four people indefinitely.",
      "A paid driver can bypass every document check.",
    ],
    choices: [
      {
        id: "haddadRegisterTurkey",
        title: "Register at the humanitarian desk",
        hint: "Wait, document every name, and request medical care",
        icon: "aid",
        tone: "trusted",
        route: "elmstead",
        days: 5,
        next: "haddadTurkey",
        effects: { supplies: 2, medicine: 1, stress: -10, exposure: -8, progress: 10, people: { mariam: 8 } },
        consequence: "Medicine +1 · Mariam health +8 · Risk falls",
        outcomeTitle: "Every name is written twice",
        outcome: "The family receives temporary papers, blankets, and an asthma check. The document explains protection in Türkiye, not passage to Europe.",
        setFlags: { turkeyRegistration: true },
      },
      {
        id: "haddadCousinRoom",
        title: "Travel to the cousin's room",
        hint: "Avoid the camp and rely on family support",
        icon: "car",
        tone: "uncertain",
        route: "quarry",
        days: 3,
        next: "haddadTurkey",
        effects: { cash: -140, supplies: -1, stress: -2, exposure: 5, progress: 12 },
        consequence: "Cash -$140 · A locked room · No registration",
        outcomeTitle: "Eight people share two rooms",
        outcome: "The cousin makes space on the floor and refuses payment. The family is safe tonight, but remains outside formal support.",
        setFlags: { cousinSupport: true },
      },
      {
        id: "haddadBorderDriver",
        title: "Pay the driver waiting outside",
        hint: "Move quickly without registration or a written destination",
        icon: "navigate",
        tone: "danger",
        route: "ridge",
        days: 2,
        next: "haddadTurkey",
        requires: { cash: 800 },
        effects: { cash: -800, battery: -12, stress: 14, exposure: 18, progress: 16, peopleAll: -3 },
        consequence: "Cash -$800 · Risk +18 · Health falls",
        outcomeTitle: "The van stops far from the address",
        outcome: "The driver unloads everyone beside a highway and leaves. Kareem recognizes none of the landmarks he was promised.",
      },
    ],
  },

  haddadTurkey: {
    id: "haddadTurkey",
    region: "Western Türkiye · 2015",
    location: "A basement room near İzmir",
    time: "21:20",
    weather: "Warm night",
    weatherDetail: "The rent is due again in six days",
    route: "quarry",
    contentNote: "Informal labor and wage theft",
    source: sources.europeBorders,
    messages: [
      {
        sender: "Cousin Fadi",
        initial: "F",
        role: "Family contact",
        time: "20:58",
        trusted: true,
        body: "The repair shop posts its daily wage. The garment room pays more but keeps passports until the week ends. A broker says the sea crossing leaves as soon as the cash is ready.",
      },
    ],
    known: [
      "The repair shop wage is posted and paid daily.",
      "The garment-room owner asks to hold identity documents.",
      "The family does not have enough cash for four promised boat places.",
    ],
    assumed: [
      "Working longer will make the next route safer.",
      "The broker's price will not change.",
      "Keeping documents always prevents exploitation.",
    ],
    choices: [
      {
        id: "haddadRepairWork",
        title: "Take the posted repair work",
        hint: "Kareem repairs mixers and refrigeration motors for a modest wage",
        icon: "work",
        tone: "trusted",
        route: "elmstead",
        days: 14,
        next: "haddadAegean",
        effects: { cash: 520, supplies: -3, water: -5, stress: 2, progress: 12, people: { kareem: -8 } },
        consequence: "Cash +$520 · 14 days pass · Kareem health -8",
        outcomeTitle: "The owner counts the wage in front of everyone",
        outcome: "The work is exhausting, but the amount matches the posted rate. Kareem keeps every identity paper in his own pocket.",
        skillBonus: {
          personId: "kareem",
          skill: "Machine repair",
          label: "Kareem's repair experience earns a completion bonus",
          effects: { cash: 120, stress: -2 },
        },
        setFlags: { verifiedWages: true },
      },
      {
        id: "haddadGarmentRoom",
        title: "Accept the garment-room offer",
        hint: "Nadia can earn more, but the owner wants the document folder",
        icon: "work",
        tone: "uncertain",
        route: "quarry",
        days: 10,
        next: "haddadAegean",
        effects: { cash: 650, supplies: -2, stress: 15, exposure: 8, progress: 10, people: { nadia: -10 } },
        consequence: "Cash +$650 · Nadia health -10 · Stress +15",
        outcomeTitle: "Only part of the wage is returned",
        outcome: "Nadia works long nights. The owner returns the documents but keeps two days of pay for a fee that was never mentioned.",
      },
      {
        id: "haddadBorrowForBoat",
        title: "Borrow the difference from relatives",
        hint: "Leave sooner with a debt no one can comfortably afford",
        icon: "phone",
        tone: "danger",
        route: "ridge",
        days: 4,
        next: "haddadAegean",
        effects: { cash: 900, battery: -26, stress: 17, exposure: 10, progress: 14, trustAll: -1 },
        consequence: "Cash +$900 · Phone -26% · A family debt begins",
        outcomeTitle: "Three households send what they can",
        outcome: "The transfers arrive in small amounts. The broker raises his price when he learns the family now has the money.",
        setFlags: { familyDebt: true },
      },
    ],
  },

  haddadAegean: {
    id: "haddadAegean",
    region: "Aegean coast · 2015",
    location: "A rented room near the sea",
    time: "02:15",
    weather: "Wind rising",
    weatherDetail: "The operator says the departure cannot wait",
    route: "ridge",
    contentNote: "Dangerous sea crossing and risk of child death",
    source: sources.mediterranean,
    messages: [
      {
        sender: "Boat operator",
        initial: "?",
        role: "Unverified message",
        time: "01:47",
        trusted: false,
        body: "Four places. Pay now. The sea is short and the weather is fine. Do not bring bags. There is no refund if you walk away.",
      },
    ],
    known: [
      "The small boat has fewer life jackets than passengers.",
      "A humanitarian office can review protection options in Türkiye tomorrow.",
      "Another operator claims to have a less crowded boat later in the week.",
    ],
    assumed: [
      "A short distance means a safe crossing.",
      "The later boat will match its photograph.",
      "Seeking protection in Türkiye ends every danger.",
    ],
    choices: [
      {
        id: "haddadTurkeyProtection",
        title: "Walk away and seek protection in Türkiye",
        hint: "End the sea route and accept an uncertain life where the family is",
        icon: "aid",
        tone: "trusted",
        route: "elmstead",
        days: 18,
        next: null,
        effects: { cash: -280, stress: -12, exposure: -22, progress: 58, trustAll: 1 },
        consequence: "The sea crossing ends · A local protection process begins",
        outcomeTitle: "The family keeps all four names together",
        outcome: "A legal clinic helps the family renew temporary papers and enter a housing waitlist. Work and school remain uncertain, but nobody boards tonight.",
        ending: {
          type: "local_protection",
          status: "won",
          title: "A different safe place",
          copy: "The Haddads stop moving west and begin again in Türkiye. Safety is incomplete, but choosing another destination is not failure.",
        },
      },
      {
        id: "haddadLaterBoat",
        title: "Wait for the less crowded crossing",
        hint: "Spend more time and money for a boat with life jackets",
        icon: "wait",
        tone: "uncertain",
        route: "quarry",
        days: 6,
        next: "haddadGreece",
        requires: { cash: 900 },
        effects: { cash: -900, supplies: -2, water: -3, stress: 12, exposure: 20, progress: 18, peopleAll: -6 },
        consequence: "Cash -$900 · Health -6 each · The family reaches Greece",
        outcomeTitle: "A rescue crew meets the boat before dawn",
        outcome: "The crossing is cold and frightening. A rescue crew brings every passenger ashore and directs families toward registration.",
      },
      {
        id: "haddadOverloadedBoat",
        title: "Board the overloaded boat now",
        hint: "Accept the operator's deadline despite the missing life jackets",
        icon: "navigate",
        tone: "danger",
        route: "ridge",
        days: 2,
        next: "haddadMemorial",
        effects: { cash: -700, water: -3, stress: 40, exposure: 34, progress: 16, peopleAll: -17, fatality: "mariam" },
        consequence: "Mariam dies · Stress +40 · The family continues with loss",
        outcomeTitle: "The boat takes on water in the dark",
        outcome: "Passengers are thrown into the water before rescue lights arrive. Kareem, Nadia, and Sami are pulled aboard. Mariam is not found. The loss is recorded without graphic detail.",
        deferThresholdEnding: true,
      },
    ],
  },

  haddadMemorial: {
    id: "haddadMemorial",
    region: "Eastern Aegean · 2015",
    location: "A temporary reception room",
    time: "18:05",
    weather: "Salt wind",
    weatherDetail: "The search ended before sunset",
    route: "ridge",
    contentNote: "Death of a child and grief",
    source: sources.mediterranean,
    messages: [
      {
        sender: "Family notebook",
        initial: "M",
        role: "Memorial entry",
        time: "17:50",
        trusted: true,
        body: "Mariam's apartment key is inside Nadia's document folder. The family tells the tracing worker how she drew every room they slept in.",
      },
    ],
    known: [
      "Mariam died during the crossing.",
      "The surviving family members reached the same reception center.",
      "A family-tracing worker can create a formal record.",
    ],
    assumed: [
      "Continuing means forgetting Mariam.",
      "Returning will restore the life the family lost.",
      "Any official record can answer their grief.",
    ],
    choices: [
      {
        id: "haddadRecordMariam",
        title: "Record Mariam's name with family tracing",
        hint: "Create a case record before continuing",
        icon: "legal",
        tone: "trusted",
        route: "elmstead",
        days: 2,
        next: "haddadGreece",
        effects: { stress: -7, exposure: -8, progress: 4, trustAll: 1 },
        consequence: "A formal record is created · Cohesion rises",
        outcomeTitle: "The worker repeats her name carefully",
        outcome: "The record includes Mariam's drawing habit, her asthma, and the brass key. It does not reduce her to a number from a boat.",
      },
      {
        id: "haddadShoreVigil",
        title: "Join the shoreline vigil",
        hint: "Pause with other survivors before the next decision",
        icon: "rest",
        tone: "uncertain",
        route: "quarry",
        days: 3,
        next: "haddadGreece",
        effects: { supplies: -1, stress: -10, progress: 3, trustAll: 1 },
        consequence: "Three days pass · Mariam is remembered",
        outcomeTitle: "Four names are spoken into the wind",
        outcome: "Other families add names of people they lost. Nobody calls the gathering closure.",
      },
      {
        id: "haddadReturnAfterLoss",
        title: "Return to Türkiye",
        hint: "End the westward journey after Mariam's death",
        icon: "wait",
        tone: "danger",
        route: "ridge",
        days: 8,
        next: null,
        effects: { stress: 10, exposure: -30, progress: 45 },
        consequence: "The journey ends after Mariam's death",
        outcomeTitle: "The ferry carries an empty seat",
        outcome: "The surviving family accepts return assistance and begins another protection process in Türkiye.",
        ending: {
          type: "returned",
          status: "stopped",
          title: "Returned with an empty place",
          copy: "The family returns to Türkiye without Mariam. The war that forced them from Syria and the debt from the journey remain unresolved.",
        },
      },
    ],
  },

  haddadGreece: {
    id: "haddadGreece",
    region: "Greece · 2015",
    location: "Island reception center",
    time: "11:25",
    weather: "Hard sunlight",
    weatherDetail: "Registration lines fill the courtyard",
    route: "elmstead",
    contentNote: "Detention, fingerprinting, and family separation risk",
    source: sources.europeBorders,
    messages: [
      {
        sender: "Legal volunteer",
        initial: "L",
        role: "Verified aid organization",
        time: "11:03",
        trusted: true,
        body: "Keep your documents and registration paper. Rules about where an asylum claim is examined are complex, and no volunteer can promise which country will accept the case.",
      },
    ],
    known: [
      "The official line keeps the family registered together.",
      "People outside the gate sell transport without receipts.",
      "A ferry ticket requires documents the family may not have.",
    ],
    assumed: [
      "Registration guarantees travel to Germany.",
      "Avoiding the camp prevents all detention.",
      "The private driver knows every changing border rule.",
    ],
    choices: [
      {
        id: "haddadGreekRegistration",
        title: "Complete registration together",
        hint: "Accept a longer wait and keep an official record",
        icon: "legal",
        tone: "trusted",
        route: "elmstead",
        days: 8,
        next: "haddadBalkans",
        effects: { cash: -120, supplies: 2, medicine: 1, stress: -5, exposure: -12, progress: 13 },
        consequence: "Eight days pass · Medicine +1 · Risk falls",
        outcomeTitle: "Four names stay on one file",
        outcome: "The family receives registration papers and a referral to a mainland shelter. The papers record arrival; they do not decide asylum.",
        setFlags: { greekRegistration: true },
      },
      {
        id: "haddadLeaveCamp",
        title: "Leave with families from the same bus",
        hint: "Follow shared information without waiting for every paper",
        icon: "walk",
        tone: "uncertain",
        route: "quarry",
        days: 5,
        next: "haddadBalkans",
        effects: { cash: -220, supplies: -2, water: -4, stress: 12, exposure: 12, progress: 17, peopleAll: -5 },
        consequence: "Cash -$220 · Risk +12 · Health -5 each",
        outcomeTitle: "The group reaches the mainland exhausted",
        outcome: "Families share food and watch the children in shifts. Nobody can confirm which northern border will still be open.",
      },
      {
        id: "haddadPrivateVan",
        title: "Pay the private van driver",
        hint: "Trade most remaining cash for an unverified shortcut",
        icon: "car",
        tone: "danger",
        route: "ridge",
        days: 3,
        next: "haddadBalkans",
        requires: { cash: 700 },
        effects: { cash: -700, battery: -18, stress: 18, exposure: 24, progress: 20, peopleAll: -4 },
        consequence: "Cash -$700 · Risk +24 · Phone -18%",
        outcomeTitle: "The van leaves everyone beside a closed station",
        outcome: "The driver keeps the fare and points north. The station has not served passengers for months.",
      },
    ],
  },

  haddadBalkans: {
    id: "haddadBalkans",
    region: "Western Balkans · 2015",
    location: "A closed transit station",
    time: "06:30",
    weather: "Freezing fog",
    weatherDetail: "A new barrier went up overnight",
    route: "quarry",
    contentNote: "Border closure, pushback risk, and exposure",
    source: sources.europeBorders,
    messages: [
      {
        sender: "Station announcement",
        initial: "i",
        role: "Official notice",
        time: "06:15",
        trusted: true,
        body: "Transit is suspended. Families requiring medical assistance should report to the marked tent. No reopening time has been announced.",
      },
    ],
    known: [
      "The humanitarian tent confirms names before moving families.",
      "A large group plans to walk toward the next town.",
      "A document seller promises papers that cannot be verified.",
    ],
    assumed: [
      "The border will reopen today.",
      "A larger group cannot be pushed back.",
      "A convincing document will survive database checks.",
    ],
    choices: [
      {
        id: "haddadAidTransfer",
        title: "Wait for the verified family transfer",
        hint: "Lose time but keep names and documents together",
        icon: "aid",
        tone: "trusted",
        route: "elmstead",
        days: 12,
        next: "haddadEuropeNews",
        effects: { cash: -180, supplies: 1, water: 2, stress: -8, exposure: -10, progress: 15 },
        consequence: "12 days pass · Risk falls · Food +1 day",
        outcomeTitle: "A manifest lists the whole family",
        outcome: "The transfer moves slowly through formal reception points. Volunteers explain that each border can still make a different decision.",
      },
      {
        id: "haddadWalkNorth",
        title: "Walk north with the larger group",
        hint: "Move despite the closure and worsening weather",
        icon: "walk",
        tone: "uncertain",
        route: "quarry",
        days: 7,
        next: "haddadEuropeNews",
        effects: { supplies: -3, water: -4, stress: 16, exposure: 18, progress: 18, peopleAll: -12 },
        consequence: "Food -3 days · Health -12 each · Risk +18",
        outcomeTitle: "The group turns back from the fence",
        outcome: "Police block the road and redirect families toward an aid station. The walking gains little distance and costs nearly all remaining food.",
      },
      {
        id: "haddadFalsePapers",
        title: "Buy the seller's transit papers",
        hint: "Risk detention for documents that may be false",
        icon: "legal",
        tone: "danger",
        route: "ridge",
        days: 4,
        next: "haddadEuropeNews",
        requires: { cash: 500 },
        effects: { cash: -500, stress: 23, exposure: 30, progress: 20, trustAll: -1 },
        consequence: "Cash -$500 · Risk +30 · Trust falls",
        outcomeTitle: "The first scanner rejects every page",
        outcome: "The family spends a night in a holding room before being released to the official reception line. The seller is gone.",
      },
    ],
  },

  haddadEuropeNews: {
    id: "haddadEuropeNews",
    region: "Central Europe · 2015",
    location: "A temporary rail shelter",
    time: "20:10",
    weather: "Rain on metal roofing",
    weatherDetail: "Phones replay the same border speech",
    route: "quarry",
    contentNote: "Anti-refugee rhetoric and dehumanizing social media",
    source: sources.europeBorders,
    messages: [
      {
        sender: "Shared social post",
        initial: "!",
        role: "Fictional anti-refugee influencer",
        time: "19:42",
        trusted: false,
        body: "Close every border. Turn the trains around. Tonight's removals prove pressure works. Share if you want Europe protected from people like them.",
      },
      {
        sender: "Shelter legal desk",
        initial: "L",
        role: "Verified information",
        time: "19:55",
        trusted: true,
        body: "A viral post is not an official notice. Registration remains open in the destination city, but processing rules and wait times can change.",
      },
    ],
    known: [
      "The legal desk has tomorrow's official registration address.",
      "The influencer does not identify the people shown in removal footage.",
      "Posting publicly can expose the family's location and account.",
    ],
    assumed: [
      "A viral slogan describes the law accurately.",
      "Arguing online will change the influencer's audience.",
      "Reaching Germany guarantees a positive asylum decision.",
    ],
    choices: [
      {
        id: "haddadVerifyRules",
        title: "Ask the legal desk to verify the rules",
        hint: "Separate public rhetoric from the process the family will face",
        icon: "legal",
        tone: "trusted",
        route: "elmstead",
        days: 2,
        next: "haddadGermany",
        effects: { battery: -6, stress: -8, exposure: -12, progress: 10, trustAll: 1 },
        consequence: "Phone -6% · Stress -8 · Risk falls",
        outcomeTitle: "The volunteer writes the address on paper",
        outcome: "The family learns what documents to present and which parts of the process remain uncertain. The post continues circulating without them.",
        setFlags: { germanLegalAdvice: true },
      },
      {
        id: "haddadCloseFeed",
        title: "Close the feed and rest together",
        hint: "Protect the family's attention before the final leg",
        icon: "rest",
        tone: "uncertain",
        route: "quarry",
        days: 1,
        next: "haddadGermany",
        effects: { battery: 8, stress: -5, progress: 9 },
        consequence: "Stress -5 · Phone +8%",
        outcomeTitle: "The shelter roof replaces the shouting",
        outcome: "Nadia puts the phone away. The family reviews names, documents, and the morning meeting place instead.",
      },
      {
        id: "haddadArgueOnline",
        title: "Reply from the family account",
        hint: "Challenge the post while exposing identity and location",
        icon: "talk",
        tone: "danger",
        route: "ridge",
        days: 1,
        next: "haddadGermany",
        effects: { battery: -22, stress: 14, exposure: 22, progress: 9 },
        consequence: "Phone -22% · Stress +14 · Risk +22",
        outcomeTitle: "The reply is copied without its context",
        outcome: "Some strangers offer support. Others repost the family's profile beside slurs and demands for removal.",
      },
    ],
  },

  haddadGermany: {
    id: "haddadGermany",
    region: "Germany · 2015",
    location: "Regional arrival center",
    time: "09:05",
    weather: "Clear cold morning",
    weatherDetail: "Numbers are called in several languages",
    route: "elmstead",
    contentNote: "Asylum registration and uncertain legal status",
    source: sources.europeAsylum,
    messages: [
      {
        sender: "Arrival-center interpreter",
        initial: "i",
        role: "Official information",
        time: "08:48",
        trusted: true,
        body: "Registration begins the asylum process. It is not a promise of protection, permanent residence, family housing, or a quick decision.",
      },
    ],
    known: [
      "The center can register the surviving family members together.",
      "A legal clinic can review their Syrian and transit documents.",
      "A relative in another country cannot transfer the case by invitation alone.",
    ],
    assumed: [
      "Arrival means the family has already won asylum.",
      "Avoiding registration preserves every option.",
      "One missing document decides the entire case.",
    ],
    choices: [
      {
        id: "haddadRegisterGermany",
        title: "Register and request legal review",
        hint: "Enter the asylum process with every document and recorded name",
        icon: "legal",
        tone: "trusted",
        route: "elmstead",
        days: 21,
        next: null,
        effects: { cash: -160, stress: 9, exposure: -28, progress: 100, trustAll: 1 },
        consequence: "21 days pass · The asylum case begins · Route complete",
        outcomeTitle: "A case number is read back to the family",
        outcome: "The Haddads move to temporary family accommodation while their claim is reviewed. Arrival has ended the route, not the uncertainty.",
        contextBonuses: [
          {
            flag: "keptDocuments",
            kind: "payoff",
            label: "The protected document folder supports the family timeline",
            effects: { stress: -4, exposure: -5 },
          },
          {
            flag: "greekRegistration",
            kind: "payoff",
            label: "Earlier registration records explain the route clearly",
            effects: { exposure: -4 },
          },
          {
            flag: "germanLegalAdvice",
            kind: "payoff",
            label: "The verified legal address prevents another missed queue",
            effects: { stress: -4 },
          },
        ],
        ending: {
          type: "asylum_pending",
          status: "won",
          title: "Registered while the case continues",
          copy: "The Haddads reach temporary accommodation with a case number, debt, grief, and no guarantee of protection. Their new chapter begins with another wait.",
        },
      },
      {
        id: "haddadFamilySponsor",
        title: "Ask the clinic about family sponsorship",
        hint: "Delay registration while a lawful transfer is reviewed",
        icon: "phone",
        tone: "uncertain",
        route: "quarry",
        days: 35,
        next: null,
        requires: { battery: 5 },
        effects: { battery: -8, cash: -260, supplies: -2, stress: 18, exposure: -18, progress: 96, peopleAll: -4 },
        consequence: "35 days pass · The transfer remains unresolved",
        outcomeTitle: "The family waits under temporary protection",
        outcome: "The clinic files an inquiry, but the family cannot move based on a relative's promise alone. They remain housed while options are reviewed.",
        ending: {
          type: "transfer_pending",
          status: "won",
          title: "Safe, with the destination undecided",
          copy: "The immediate journey ends in temporary protection. The legal destination remains unresolved, and safety does not erase the cost of reaching it.",
        },
      },
      {
        id: "haddadAvoidRegistration",
        title: "Leave before registration",
        hint: "Avoid the system and rely on informal shelter and work",
        icon: "walk",
        tone: "danger",
        route: "ridge",
        days: 12,
        next: null,
        effects: { cash: -420, supplies: -3, stress: 25, exposure: 34, progress: 91, peopleAll: -8 },
        consequence: "The family remains undocumented and without stable shelter",
        outcomeTitle: "Every knock sounds official",
        outcome: "The family finds temporary work and a crowded room, but avoids health care and school enrollment because they fear detection.",
        ending: {
          type: "undocumented",
          status: "stopped",
          title: "Arrival without stability",
          copy: "The map says the family reached Germany. Their lives remain hidden, precarious, and outside a protection process.",
        },
      },
    ],
  },
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function createInitialGame(familyId = "ramirez") {
  const family = getFamilyPreset(familyId);
  return {
    version: GAME_VERSION,
    familyId: family.id,
    runId: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    phase: "decision",
    status: "playing",
    day: 1,
    progress: 0,
    eventId: family.startEventId,
    route: family.startRoute,
    resources: { ...family.resources },
    people: Object.fromEntries(Object.entries(family.peopleState).map(([id, state]) => [id, { ...state }])),
    losses: [],
    history: [],
    activityLog: [],
    relationshipNotes: {},
    relationshipHistory: [],
    storyThreads: {},
    storyThreadHistory: [],
    flags: {},
    completedRoadsideWork: {},
    lastRoadsideOutcome: null,
    currentOutcome: null,
    pendingNext: null,
    pendingEnding: null,
  };
}

export function getEvent(game) {
  return EVENTS[game.eventId];
}

export function getRoadsideOpportunity(game) {
  return ROADSIDE_OPPORTUNITIES[game.eventId] ?? null;
}

export function hasCompletedRoadsideWork(game) {
  return Boolean(game.completedRoadsideWork?.[game.eventId]);
}

export function getCondition(health, alive = true) {
  if (!alive) return { label: "Remembered", tone: "danger" };
  if (health >= 75) return { label: "Good", tone: "safe" };
  if (health >= 55) return { label: "Tired", tone: "caution" };
  if (health >= 35) return { label: "Struggling", tone: "danger" };
  return { label: "Needs urgent care", tone: "danger" };
}

export function getPortraitMood(personState, groupStress = 0) {
  if (!personState || personState.alive === false) return "critical";
  if (personState.health <= 45 || groupStress >= 80 || (100 - personState.health) + (groupStress * 0.5) >= 80) return "critical";
  if (personState.health <= 70 || groupStress >= 50 || (100 - personState.health) + (groupStress * 0.5) >= 45) return "strained";
  return "healthy";
}

export function getPortraitImage(person, personState, groupStress = 0, gameOrFamilyId = "ramirez") {
  const family = getFamilyPreset(gameOrFamilyId);
  return family.portraitStrips[getPortraitMood(personState, groupStress)] ?? person?.image;
}

export function getResourceTone(resource, value) {
  if (resource === "stress" || resource === "exposure") {
    if (value >= 80) return "danger";
    if (value >= 55) return "caution";
    return "safe";
  }
  if (resource === "battery") return value <= 15 ? "danger" : value <= 30 ? "caution" : "default";
  if (resource === "supplies") return value <= 1 ? "danger" : value <= 2 ? "caution" : "default";
  if (resource === "water") return value <= 3 ? "danger" : value <= 7 ? "caution" : "default";
  if (resource === "medicine") return value === 0 ? "danger" : "default";
  return "safe";
}

export function getRequirementFailure(game, choice) {
  if (!choice.requires) return null;
  for (const [resource, needed] of Object.entries(choice.requires)) {
    const current = game.resources[resource] ?? 0;
    if (current < needed) {
      const labels = {
        cash: `$${needed}`,
        battery: `${needed}% phone charge`,
        medicine: `${needed} medicine dose`,
        water: `${needed} L water`,
      };
      return `Requires ${labels[resource] ?? needed}`;
    }
  }
  return null;
}

function mergeEffects(...effectSets) {
  const merged = {};
  for (const effects of effectSets.filter(Boolean)) {
    for (const [key, value] of Object.entries(effects)) {
      if (key === "people" || key === "trust") {
        merged[key] = { ...(merged[key] ?? {}) };
        for (const [personId, amount] of Object.entries(value)) {
          merged[key][personId] = (merged[key][personId] ?? 0) + amount;
        }
      } else if (key === "fatality") {
        const current = merged.fatality ? (Array.isArray(merged.fatality) ? merged.fatality : [merged.fatality]) : [];
        const incoming = Array.isArray(value) ? value : [value];
        merged.fatality = [...new Set([...current, ...incoming])];
      } else if (typeof value === "number") {
        merged[key] = (merged[key] ?? 0) + value;
      }
    }
  }
  return merged;
}

export function getChoiceBonuses(game, choice) {
  if (!choice) return [];
  const bonuses = [];
  if (choice.skillBonus) {
    const traveler = game.people[choice.skillBonus.personId];
    if (traveler?.alive !== false) bonuses.push(choice.skillBonus);
  }
  for (const bonus of choice.contextBonuses ?? []) {
    if (game.flags?.[bonus.flag]) bonuses.push(bonus);
  }
  return bonuses;
}

function getChoiceReactions(game, choice) {
  return (CHOICE_REACTIONS[choice.id] ?? [])
    .filter((reaction) => game.people[reaction.personId]?.alive !== false);
}

function getStoryThreadUpdates(game, choice) {
  return (STORY_THREAD_UPDATES[choice.id] ?? [])
    .filter((update) => !update.requiresThread || game.storyThreads?.[update.requiresThread]);
}

function applyStoryThreadUpdates(game, updates, choiceId, day = game.day) {
  const storyThreads = { ...(game.storyThreads ?? {}) };
  const historyEntries = [];
  for (const update of updates) {
    const previous = storyThreads[update.id];
    const entry = {
      ...previous,
      id: update.id,
      title: update.title,
      status: update.status,
      summary: update.summary,
      openedDay: previous?.openedDay ?? day,
      updatedDay: day,
    };
    storyThreads[update.id] = entry;
    historyEntries.push({ ...entry, day, choiceId });
  }
  return {
    storyThreads,
    storyThreadHistory: [...(game.storyThreadHistory ?? []), ...historyEntries],
  };
}

function recordRelationshipReactions(game, applied, reactions, choiceId, day = game.day) {
  const relationshipNotes = { ...(game.relationshipNotes ?? {}) };
  const entries = reactions.map((reaction) => {
    const person = getPeople(game).find((traveler) => traveler.id === reaction.personId);
    const trustDelta = applied.people[reaction.personId].trust - game.people[reaction.personId].trust;
    const entry = {
      ...reaction,
      personName: person?.name ?? "Traveler",
      trustDelta,
      day,
      choiceId,
    };
    relationshipNotes[reaction.personId] = entry;
    return entry;
  });
  return {
    recordedReactions: entries,
    relationshipNotes,
    relationshipHistory: [...(game.relationshipHistory ?? []), ...entries],
  };
}

function resolveChoiceEffects(game, choice) {
  const bonuses = getChoiceBonuses(game, choice);
  const reactions = getChoiceReactions(game, choice);
  const reactionTrust = reactions.reduce((trust, reaction) => {
    trust[reaction.personId] = (trust[reaction.personId] ?? 0) + (reaction.trustDelta ?? 0);
    return trust;
  }, {});
  return {
    effects: mergeEffects(choice.effects, ...bonuses.map((bonus) => bonus.effects), { trust: reactionTrust }),
    bonuses,
    reactions,
  };
}

function travelWeeks(game) {
  return Math.max(1, Math.ceil((game.currentOutcome?.days ?? 1) / 7));
}

export function requiresTravelPlan(game) {
  return Boolean(
    game.phase === "outcome"
      && game.status === "playing"
      && !game.pendingEnding
      && game.pendingNext
      && (game.currentOutcome?.days ?? 0) >= 3
      && !game.currentOutcome?.travelPlan,
  );
}

export function getTravelPlanOptions(game) {
  const weeks = travelWeeks(game);
  const recoverCost = weeks * 25;
  const planDetails = {
    conserve: {
      consequence: `Save cash · Stress +${weeks * 2} · Health -${weeks}`,
      effects: { water: -weeks, supplies: -Math.floor(weeks / 2), stress: weeks * 2, peopleAll: -weeks },
    },
    steady: {
      consequence: `Cash -$${weeks * 10} · Water -${weeks} L · Stress +${weeks}`,
      effects: { cash: -(weeks * 10), water: -weeks, stress: weeks },
    },
    recover: {
      consequence: `Cash -$${recoverCost} · Stress -${weeks * 2} · Health +${weeks}`,
      effects: { cash: -recoverCost, water: -weeks, stress: -(weeks * 2), peopleAll: weeks },
      unavailable: game.resources.cash < recoverCost ? `Requires $${recoverCost}` : null,
    },
  };
  return TRAVEL_STRATEGIES.map((strategy) => ({ ...strategy, weeks, ...planDetails[strategy.id] }));
}

function applyEffects(game, effects = {}) {
  const resources = { ...game.resources };
  const resourceKeys = ["cash", "supplies", "water", "medicine", "battery", "stress", "exposure"];
  for (const key of resourceKeys) resources[key] += effects[key] ?? 0;

  resources.cash = Math.max(0, resources.cash);
  resources.supplies = clamp(resources.supplies, 0, 12);
  resources.water = clamp(resources.water, 0, 40);
  resources.medicine = clamp(resources.medicine, 0, 4);
  resources.battery = clamp(resources.battery, 0, 100);
  resources.stress = clamp(resources.stress, 0, 100);
  resources.exposure = clamp(resources.exposure, 0, 100);

  const people = Object.fromEntries(
    Object.entries(game.people).map(([id, values]) => {
      if (values.alive === false) return [id, { ...values }];
      const healthDelta = (effects.peopleAll ?? 0) + (effects.people?.[id] ?? 0);
      const trustDelta = (effects.trustAll ?? 0) + (effects.trust?.[id] ?? 0);
      return [id, {
        ...values,
        health: clamp(values.health + healthDelta, 0, 100),
        trust: clamp(values.trust + trustDelta, 1, 5),
      }];
    }),
  );

  const explicitFatalityIds = effects.fatality ? (Array.isArray(effects.fatality) ? effects.fatality : [effects.fatality]) : [];
  for (const id of explicitFatalityIds) {
    if (people[id]) people[id] = { ...people[id], health: 0, alive: false };
  }

  if (resources.supplies === 0) {
    resources.stress = clamp(resources.stress + 7, 0, 100);
    for (const person of Object.values(people)) {
      if (person.alive !== false) person.health = clamp(person.health - 5, 0, 100);
    }
  }

  if (resources.water === 0) {
    resources.stress = clamp(resources.stress + 10, 0, 100);
    for (const person of Object.values(people)) {
      if (person.alive !== false) person.health = clamp(person.health - 8, 0, 100);
    }
  }

  const healthFatalityIds = Object.entries(people)
    .filter(([, person]) => person.alive !== false && person.health <= 0)
    .map(([id]) => id);
  const fatalityIds = [...new Set([...explicitFatalityIds, ...healthFatalityIds])];
  for (const id of fatalityIds) {
    people[id] = { ...people[id], health: 0, alive: false };
  }

  return {
    resources,
    people,
    losses: [...new Set([...(game.losses ?? []), ...fatalityIds])],
    progress: clamp(game.progress + (effects.progress ?? 0), 0, 100),
  };
}

function getNewLossEntries(previousGame, nextGame, day = previousGame.day) {
  const previousLosses = new Set(previousGame.losses ?? []);
  return (nextGame.losses ?? [])
    .filter((id) => !previousLosses.has(id))
    .map((id) => {
      const person = getPeople(previousGame).find((traveler) => traveler.id === id);
      return {
        day,
        kind: "remembrance",
        title: `${person?.name ?? "A traveler"} is remembered`,
        detail: `${person?.name ?? "A member of the family"} died during the journey. The loss is recorded without graphic detail.`,
        tone: "danger",
      };
    });
}

function evaluateEnding(nextGame, choice) {
  const livingPeople = Object.values(nextGame.people).filter((person) => person.alive !== false);
  if (livingPeople.length === 0) {
    return {
      type: "all_lost",
      status: "stopped",
      title: "No one can continue the journey",
      copy: "Every member of the family has died. Their route ends here, and the journey log preserves their names and the choices that brought them this far.",
    };
  }
  if (choice.ending) return choice.ending;
  if (choice.deferThresholdEnding) return null;
  if (nextGame.resources.exposure >= 100) {
    return {
      type: "apprehended",
      status: "stopped",
      title: "The family is taken into custody",
      copy: "Their movements have become too visible. The run ends in detention while the legal process remains unresolved.",
    };
  }
  if (nextGame.resources.stress >= 100) {
    return {
      type: "stress",
      status: "stopped",
      title: "The family cannot keep moving",
      copy: "Grief, exhaustion, and conflict make another leg unsafe. They stop at a shelter and reconsider the journey.",
    };
  }
  return null;
}

export function chooseOption(game, choiceId) {
  if (game.phase !== "decision" || game.status !== "playing") return game;
  const event = getEvent(game);
  const choice = event.choices.find((item) => item.id === choiceId);
  if (!choice || getRequirementFailure(game, choice)) return game;

  const resolved = resolveChoiceEffects(game, choice);
  const applied = applyEffects(game, resolved.effects);
  const relationshipState = recordRelationshipReactions(game, applied, resolved.reactions, choice.id);
  const threadUpdates = getStoryThreadUpdates(game, choice);
  const threadState = applyStoryThreadUpdates(game, threadUpdates, choice.id);
  const nextGame = {
    ...game,
    ...applied,
    relationshipNotes: relationshipState.relationshipNotes,
    relationshipHistory: relationshipState.relationshipHistory,
    ...threadState,
    phase: "outcome",
    route: choice.route ?? game.route,
    currentOutcome: {
      id: choice.id,
      title: choice.outcomeTitle,
      copy: choice.outcome,
      tone: choice.tone,
      consequence: choice.consequence,
      days: choice.days,
      appliedBonuses: resolved.bonuses.filter((bonus) => !bonus.kind).map((bonus) => bonus.label),
      returningConsequences: resolved.bonuses.filter((bonus) => bonus.kind).map((bonus) => ({ label: bonus.label, kind: bonus.kind })),
      reactions: relationshipState.recordedReactions,
      threadUpdates,
      travelPlan: null,
    },
    pendingNext: choice.next,
    flags: { ...(game.flags ?? {}), ...(choice.setFlags ?? {}) },
    history: [
      ...game.history,
      {
        day: game.day,
        eventId: game.eventId,
        location: event.location,
        choiceId: choice.id,
        choiceTitle: choice.title,
        outcomeTitle: choice.outcomeTitle,
        tone: choice.tone,
      },
    ],
    activityLog: [
      ...(game.activityLog ?? []),
      ...getNewLossEntries(game, applied),
    ],
  };

  return { ...nextGame, pendingEnding: evaluateEnding(nextGame, choice) };
}

export function takeRoadsideJob(game, choiceId) {
  if (game.phase !== "decision" || game.status !== "playing" || hasCompletedRoadsideWork(game)) return game;
  const opportunity = getRoadsideOpportunity(game);
  const choice = opportunity?.choices.find((item) => item.id === choiceId);
  if (!choice || getRequirementFailure(game, choice)) return game;

  const resolved = resolveChoiceEffects(game, choice);
  const applied = applyEffects(game, resolved.effects);
  const relationshipState = recordRelationshipReactions(game, applied, resolved.reactions, choice.id);
  const threadUpdates = getStoryThreadUpdates(game, choice);
  const threadState = applyStoryThreadUpdates(game, threadUpdates, choice.id);
  const nextGame = {
    ...game,
    ...applied,
    relationshipNotes: relationshipState.relationshipNotes,
    relationshipHistory: relationshipState.relationshipHistory,
    ...threadState,
    day: game.day + (choice.days ?? 1),
    flags: { ...(game.flags ?? {}), ...(choice.setFlags ?? {}) },
    completedRoadsideWork: {
      ...(game.completedRoadsideWork ?? {}),
      [game.eventId]: choice.id,
    },
    lastRoadsideOutcome: {
      eventId: game.eventId,
      id: choice.id,
      title: choice.outcomeTitle,
      copy: choice.outcome,
      tone: choice.tone,
      consequence: choice.consequence,
      appliedBonuses: resolved.bonuses.filter((bonus) => !bonus.kind).map((bonus) => bonus.label),
      returningConsequences: resolved.bonuses.filter((bonus) => bonus.kind).map((bonus) => ({ label: bonus.label, kind: bonus.kind })),
      reactions: relationshipState.recordedReactions,
      threadUpdates,
    },
    activityLog: [
      ...(game.activityLog ?? []),
      {
        day: game.day,
        kind: "work",
        title: choice.title,
        detail: choice.outcomeTitle,
        tone: choice.tone,
      },
      ...getNewLossEntries(game, applied),
    ],
  };

  const pendingEnding = evaluateEnding(nextGame, {});
  return pendingEnding
    ? { ...nextGame, phase: "ended", status: pendingEnding.status ?? "stopped", ending: pendingEnding, pendingEnding: null }
    : nextGame;
}

export function planTravelLeg(game, strategyId) {
  if (!requiresTravelPlan(game)) return game;
  const strategy = getTravelPlanOptions(game).find((option) => option.id === strategyId);
  if (!strategy || strategy.unavailable) return game;

  const applied = applyEffects(game, strategy.effects);
  const nextGame = {
    ...game,
    ...applied,
    currentOutcome: {
      ...game.currentOutcome,
      travelPlan: {
        id: strategy.id,
        title: strategy.title,
        consequence: strategy.consequence,
        tone: strategy.tone,
      },
    },
    activityLog: [
      ...(game.activityLog ?? []),
      {
        day: game.day,
        kind: "travel",
        title: strategy.title,
        detail: `${game.currentOutcome.days} days planned · ${strategy.consequence}`,
        tone: strategy.tone,
      },
      ...getNewLossEntries(game, applied),
    ],
  };

  return { ...nextGame, pendingEnding: evaluateEnding(nextGame, {}) };
}

export function useMedicine(game, personId) {
  const traveler = game.people[personId];
  if (game.status !== "playing" || !traveler || traveler.alive === false || traveler.health >= 100 || game.resources.medicine < 1) return game;
  const person = getPeople(game).find((item) => item.id === personId);
  const applied = applyEffects(game, { medicine: -1, stress: -2, people: { [personId]: 15 } });
  const nextGame = {
    ...game,
    ...applied,
    activityLog: [
      ...(game.activityLog ?? []),
      {
        day: game.day,
        kind: "care",
        title: `Medicine for ${person.name}`,
        detail: `${person.name}'s health rises to ${applied.people[personId].health}%.`,
        tone: "trusted",
      },
      ...getNewLossEntries(game, applied),
    ],
  };
  const terminalEnding = evaluateEnding(nextGame, {});
  return terminalEnding?.type === "all_lost"
    ? { ...nextGame, phase: "ended", status: terminalEnding.status, ending: terminalEnding, pendingEnding: null }
    : nextGame;
}

export function continueJourney(game) {
  if (game.phase !== "outcome") return game;
  if (requiresTravelPlan(game)) return game;
  if (game.pendingEnding) {
    return {
      ...game,
      phase: "ended",
      status: game.pendingEnding.status ?? "stopped",
      day: game.day + (game.currentOutcome?.days ?? 1),
      ending: game.pendingEnding,
    };
  }
  const nextEvent = EVENTS[game.pendingNext];
  if (!nextEvent) return game;
  return {
    ...game,
    phase: "decision",
    day: game.day + (game.currentOutcome?.days ?? 1),
    eventId: game.pendingNext,
    route: nextEvent.route ?? game.route,
    currentOutcome: null,
    pendingNext: null,
    pendingEnding: null,
  };
}

export function getJourneyScore(game) {
  const living = Object.values(game.people).filter((person) => person.alive !== false);
  const averageHealth = living.length
    ? Math.round(living.reduce((sum, person) => sum + person.health, 0) / living.length)
    : 0;
  const averageTrust = living.length
    ? living.reduce((sum, person) => sum + person.trust, 0) / living.length
    : 0;
  return clamp(
    Math.round(averageHealth * 0.45 + averageTrust * 8 + game.resources.cash * 0.01 + (100 - game.resources.exposure) * 0.12),
    0,
    100,
  );
}

export function isSavedGameValid(value) {
  return Boolean(
    value
      && value.version === GAME_VERSION
      && FAMILY_PRESETS[value.familyId]
      && EVENTS[value.eventId]
      && value.resources
      && value.people
      && value.activityLog
      && value.flags
      && value.completedRoadsideWork
      && getPeople(value).every((person) => value.people[person.id])
      && ["decision", "outcome", "ended"].includes(value.phase),
  );
}
