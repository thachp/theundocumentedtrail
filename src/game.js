export const GAME_VERSION = 9;
export const GAME_SAVE_KEY = "the-long-road-save-v9";

const PORTRAIT_STRIP = "/assets/ramirez-family-portraits.webp";
const PORTRAIT_STRIPS = {
  healthy: PORTRAIT_STRIP,
  strained: "/assets/ramirez-family-portraits-strained.webp",
  critical: "/assets/ramirez-family-portraits-critical.webp",
};

export const PEOPLE = [
  {
    id: "marisol",
    name: "Marisol",
    pronouns: "she/her",
    age: 34,
    image: PORTRAIT_STRIP,
    focus: "0% 40%",
    skills: ["Former teacher", "Planning"],
    story: "A former primary-school teacher. She sold the family's home and small plot for far less than they were worth after a gang threatened Edwin.",
  },
  {
    id: "edwin",
    name: "Edwin",
    pronouns: "he/him",
    age: 15,
    image: PORTRAIT_STRIP,
    focus: "33% 40%",
    skills: ["Observation", "Some English"],
    story: "He wants to study electrical repair. Recruitment pressure from a neighborhood gang is the reason the family cannot safely stay.",
  },
  {
    id: "daniela",
    name: "Daniela",
    pronouns: "she/her",
    age: 7,
    image: PORTRAIT_STRIP,
    focus: "67% 40%",
    skills: ["Curious", "Asthma"],
    story: "She carries a stuffed rabbit named Nube and counts every bus she sees. Her inhaler has twelve doses left.",
  },
  {
    id: "aurelia",
    name: "Aurelia",
    pronouns: "she/her",
    age: 61,
    image: PORTRAIT_STRIP,
    focus: "100% 40%",
    skills: ["Devout", "Cooking"],
    story: "Marisol's mother. Her knee slows the group, but she remembers names, favors, and which promises people kept.",
  },
];

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
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function createInitialGame() {
  return {
    version: GAME_VERSION,
    runId: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    phase: "decision",
    status: "playing",
    day: 1,
    progress: 0,
    eventId: "home",
    route: "elmstead",
    resources: {
      cash: 1800,
      supplies: 5,
      water: 18,
      medicine: 1,
      battery: 82,
      stress: 42,
      exposure: 12,
    },
    people: {
      marisol: { health: 84, trust: 4, alive: true },
      edwin: { health: 86, trust: 4, alive: true },
      daniela: { health: 78, trust: 5, alive: true },
      aurelia: { health: 65, trust: 4, alive: true },
    },
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

export function getPortraitImage(personState, groupStress = 0) {
  return PORTRAIT_STRIPS[getPortraitMood(personState, groupStress)];
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
    const person = PEOPLE.find((traveler) => traveler.id === reaction.personId);
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
      const person = PEOPLE.find((traveler) => traveler.id === id);
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
  const person = PEOPLE.find((item) => item.id === personId);
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
      && EVENTS[value.eventId]
      && value.resources
      && value.people
      && value.activityLog
      && value.flags
      && value.completedRoadsideWork
      && ["decision", "outcome", "ended"].includes(value.phase),
  );
}
