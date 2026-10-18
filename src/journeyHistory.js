import { cambodiaEdition } from './cambodiaEdition.js';
// Shared editorial context. Dates in sources describe reporting, not the lives
// of these fictional composites. Ramírez and Haddad have authored calendars.
import { CAMBODIA, CAMBODIA_SOURCES, sceneFor } from "./cambodiaStory.js";
import { AUTHORED_STORIES, authoredStory } from "./authoredStories.js";
import { authoredHistory, storyScene } from "./authoredJourney.js";
export const HISTORY_SOURCES = Object.freeze({
  ...Object.assign({},...AUTHORED_STORIES.map(s=>s.sources)),
  ...CAMBODIA_SOURCES,
  syriaUprising: { title: "UN Secretary-General: fourth anniversary of the Syrian crisis", date: "12 March 2015", url: "https://www.un.org/sg/en/content/former-secretary-general/statements/2015-03-12/statement-the-secretary-general-fulfilling-our-collective-responsibility-syria" },
  aleppo2015: { title: "UN report S/2015/368, paragraphs 7–8: attacks and interrupted schooling", date: "22 May 2015", url: "https://www.refworld.org/reference/countryrep/unsc/2015/105060" },
  sea2015: { title: "UNHCR: The sea route to Europe", date: "1 July 2015", url: "https://www.unhcr.org/us/media/sea-route-europe-mediterranean-passage-age-refugees" },
  turkey2014: { title: "Türkiye: Temporary Protection Regulation, 2014/6883", date: "22 October 2014; archive includes annotated later amendments", url: "https://www.refworld.org/legal/natleginstr/natlegbod/2014/151442" },
  balkans2015: { title: "UNHCR: concern at the Greece–FYR Macedonia border", date: "21 August 2015", url: "https://www.unhcr.org/africa/news/press-releases/unhcr-voices-concern-about-developments-border-fyr-macedonia-and-greece" },
  honduras: { title: "UNHCR: Gangs drive Hondurans from their homes and land", date: "8 September 2017 · background reporting", url: "https://www.unhcr.org/news/stories/gangs-drive-hondurans-their-homes-and-land" },
  usBorder2023: { title: "DHS/DOJ: Circumvention of Lawful Pathways · rule text and CBP One access discussion", date: "16 May 2023 publication · effective 11 May 2023 · historical rule, not current guidance", url: "https://www.govinfo.gov/content/pkg/FR-2023-05-16/html/2023-10146.htm" },
  cbpOne2024: { title: "CBP testimony: scheduling function distinct from asylum, parole and inspection · prepared statement pp. 23–25", date: "21 March 2024 hearing · agency testimony within a contested hearing, not endorsement of every speaker", url: "https://www.govinfo.gov/content/pkg/CHRG-118hhrg57673/html/CHRG-118hhrg57673.htm" },
  senegal: { title: "IOM: Senegal departure-area monitoring toward the Canary Islands", date: "Observation period: December 2025–January 2026", url: "https://dtm.iom.int/reports/senegal-departure-areas-monitoring-tool-movements-canary-islands-december-2025-january-2026" },
  vietnam: { title: "UK Home Office: Vietnam trafficking country information, sections 3.1.9–3.1.12", date: "February 2025 edition · webpage updated March 2026", url: "https://www.gov.uk/government/publications/vietnam-country-policy-and-information-notes/country-policy-and-information-note-trafficking-vietnam-february-2025-accessible" },
  ireland: { title: "Ireland: employment rights and protection of migrant workers", date: "Undated official guidance · checked 18 October 2026", url: "https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/economic-migration-policy/protection-of-migrant-workers.html" },
  irelandVisa: { title: "Ireland ISD: Employment visa · application and At border control sections", date: "Updated 23 September 2024 · checked 18 October 2026; not a processing-time promise", url: "https://www.irishimmigration.ie/coming-to-work-in-ireland/what-are-my-work-visa-options/applying-for-a-long-stay-employment-visa/employment-visa/" },
  irelandRedundancy: { title: "Ireland DETE: Employment permit holders who are made redundant", date: "Undated official guidance · checked 18 October 2026; qualifying permit types and individual circumstances matter", url: "https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/redundancy/employment-permit-holders-who-are-made-redundant.html" },
  irelandReactivation: { title: "Ireland DETE: Reactivation Employment Permit · Conditions and Employee criteria", date: "Undated official guidance · checked 18 October 2026; eligibility and approval are separate", url: "https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/permit-types/reactivation-employment-permit/" },
  rohingya: { title: "UNICEF: Rohingya education threatened by funding shortages", date: "1 June 2025", url: "https://www.unicef.org/bangladesh/en/press-releases/education-almost-quarter-million-rohingya-refugee-children-risk-unicef-calls-urgent" },
});

const contemporary = "Contemporary composite · calendar date unspecified";
const fiction = "The people, dialogue, household details, incidents and outcomes are fictional composites. Sources document conditions, not this family's biography. No community review is claimed.";
export const JOURNEY_HISTORY = Object.freeze({
  ramirez: {
    place: "Northern Honduras", era: "January 2024 departure · historical early-2024 border setting", departureDate: "2024-01-15",
    historicalSummary: "UNHCR's 2017 reporting documents gang-driven displacement and land loss. This fictional household leaves in January 2024, when CBP One could schedule U.S. port inspections from central or northern Mexico. Booking, admission, asylum and release were separate questions; access and outcomes were not guaranteed.",
    familyStakes: "Threats against Edwin force Marisol to sell the home below its value. Aurelia worries about leaving familiar support; Daniela needs her inhaler. The family must pay for food and transport with what remains. They first choose whether to leave before sunrise, seek a safer place nearby, or secure documents. People, dates, waits and outcomes are authored fiction, not a typical case.",
    contentNote: "Threats against children, displacement, exploitation and possible loss.",
    sourceIds: ["honduras", "usBorder2023", "cbpOne2024"],
    timeline: [
      { date: "8 September 2017", kind: "Documented reporting", text: "UNHCR reports gang-driven displacement and loss of homes and land.", sourceId: "honduras" },
      { date: "11 May 2023", kind: "Historical rule effective", text: "The border rule establishes a rebuttable asylum-eligibility presumption for certain arrivals, with exceptions. It is not a universal ban or a promise of protection.", sourceId: "usBorder2023" },
      { date: "15 January 2024", kind: "Fictional editorial setting", text: "The family departs. The authored route stays before June 2024 changes; this is not present-day guidance." },
      { date: "21 March 2024", kind: "Documented agency testimony", text: "CBP describes scheduling in central/northern Mexico and distinguishes it from asylum, parole and inspection. Other hearing participants express competing political views.", sourceId: "cbpOne2024" },
      { date: "Before departure · fictional", kind: "Family story", text: "Marisol sells the home under pressure; the household's resources and choices belong to this composite." },
    ],
  },
  haddad: {
    place: "Aleppo, Syria", era: "July 2015 departure · Syrian civil war", departureDate: "2015-07-01",
    historicalSummary: "Syria's uprising began in March 2011 with peaceful demands for political reform. Repression and armed conflict escalated into war. A May 2015 UN report describes civilian harm, damaged buildings and interrupted schooling in Aleppo, including attacks by government forces and non-State armed groups.",
    familyStakes: "For the fictional Haddads, staying has become unsafe. Kareem's repair work has stopped; Nadia packs identity and school papers. Sixteen-year-old Sami wants to keep studying, while nine-year-old Mariam needs a dependable place to sleep and manage her asthma. They leave Aleppo in July 2015, hoping first to reach safety in Türkiye. Their departure is four years after the uprising began, not a return after the war.",
    contentNote: "Wartime civilian harm, displacement, exploitation, dangerous crossing and possible child death.",
    sourceIds: ["syriaUprising", "aleppo2015", "turkey2014", "sea2015", "balkans2015"],
    timeline: [
      { date: "March 2011", kind: "Documented history", text: "Peaceful protests call for political reform; the UN's fourth-anniversary statement recalls their violent repression.", sourceId: "syriaUprising" },
      { date: "April–May 2015", kind: "Documented history", text: "UN reporting records attacks, property damage and school interruption in Aleppo.", sourceId: "aleppo2015" },
      { date: "July 2015", kind: "Fictional editorial setting", text: "The Haddads leave Aleppo. July is an authored anchor, not a documented departure date for a real family." },
      { date: "1 July 2015", kind: "Documented reporting", text: "UNHCR's sea-route report describes movement from Türkiye to Greece and onward through the Balkans.", sourceId: "sea2015" },
      { date: "21 August 2015", kind: "Later historical context", text: "UNHCR reports force and precarious conditions at the Greece–FYR Macedonia border. This does not date every fictional transit delay to that incident.", sourceId: "balkans2015" },
    ],
  },
  diop: {
    place: "Mbour, Senegal", era: contemporary,
    historicalSummary: "IOM monitored coastal departure areas in Senegal in December 2025–January 2026 in connection with movements toward the Canary Islands. This documents a route and an observation period; it does not establish the motives, itinerary or outcome of every person who travels.",
    familyStakes: "The Diop brothers and their cousins are a fictional group facing unstable work and family debt. Ibrahima's repair tools have become collateral, Mamadou can find only irregular fishing work, and Cheikh feels responsible for twelve-year-old Lamine. They disagree about whether another paid journey can restore opportunity or deepen the debt. Their story begins at a repair-stall courtyard in Mbour, before any Atlantic crossing has been chosen.",
    contentNote: "Debt, exploitation, dangerous sea travel and possible child death.",
    sourceIds: ["senegal"],
    timeline: [
      { date: "December 2025–January 2026", kind: "Documented observation period", text: "IOM monitors Senegal's departure areas for movement toward the Canary Islands.", sourceId: "senegal" },
      { date: "Before departure · fictional", kind: "Family story", text: "Repair work, fishing work and apprenticeship wages have become unreliable for this group." },
      { date: "During the journey · fictional", kind: "Family story", text: "The route may stop in West Africa or continue toward reception in the Canary Islands; the family is not an IOM case record." },
    ],
  },
  nguyen: {
    place: "Nghệ An, Vietnam", era: contemporary,
    historicalSummary: "The UK Home Office's February 2025 country information describes cases in which people seeking work abroad incur travel debts and face exploitation during transit or in the UK. It also describes differing experiences on return. Seeking overseas work does not itself establish trafficking or an asylum entitlement.",
    familyStakes: "In the fictional Bùi family, a promised British job has been financed against the home. Minh wants to protect that investment; Lan wants to keep control of the family's papers. Mai and Bảo have their own hopes and doubts about the move. The recruiter keeps the route, visas and contract vague. At home in Nghệ An, the family must decide how much of the promise to trust before another payment is made.",
    contentNote: "Recruitment deception, debt bondage, labour exploitation and dangerous crossing.",
    sourceIds: ["vietnam"],
    timeline: [
      { date: "February 2025", kind: "Documented country information", text: "The Home Office describes recruitment debt and exploitation risks, with individual circumstances affecting outcomes.", sourceId: "vietnam" },
      { date: "Before departure · fictional", kind: "Family story", text: "The family pledges its home against a promised overseas job." },
      { date: "During the journey · fictional", kind: "Family story", text: "Unspecified European transit is deliberately left unspecified; the story is not a reconstruction of a documented trafficking case." },
    ],
  },
  punjab: {
    place: "Near Jalandhar, Punjab, India", era: contemporary,
    historicalSummary: "Irish official guidance describes employment protections including written contracts, possession of the original permit and restrictions on deductions for permit applications. A legal framework and a recruiter's promise are different things: a worker's documents, job and circumstances still need to be checked.",
    familyStakes: "Four fictional relatives have pooled loans and family assets for promised Irish jobs. Gurpreet sees a chance to repay the debt; Simran wants the contract and deductions explained before they leave. Arjun and Neha bring practical skills but cannot afford a long unpaid wait. The recruiter keeps changing the housing costs and job descriptions. The first decision happens near Jalandhar, where verifying a promise may cost time as well as money.",
    contentNote: "Recruitment fraud, debt, workplace exploitation and uncertain immigration status.",
    sourceIds: ["ireland"],
    timeline: [
      { date: "Official framework · checked October 2026", kind: "Undated guidance", text: "Ireland's guidance sets out employment and permit-related protections. This date is a source check, not the group's departure date.", sourceId: "ireland" },
      { date: "Before departure · fictional", kind: "Family story", text: "The group borrows against shared assets after receiving an employment offer." },
      { date: "During the journey · fictional", kind: "Family story", text: "The choices explore checking documents, working conditions and access to advice; no permit outcome is guaranteed." },
    ],
  },
  rohingya: {
    place: "Cox’s Bazar, Bangladesh", era: contemporary,
    historicalSummary: "In June 2025 UNICEF warned that funding shortages threatened learning for Rohingya refugee children in Bangladesh. Its account also describes effects on host-community volunteer teachers. These are pressures on children, teachers and services; they do not mean that every household responds by taking a sea journey.",
    familyStakes: "The fictional Karim family weighs education, aid and family ties against an unverified route toward Indonesia. Yasmin hopes to contact her sister; Hamida fears leaving what support they still have. Rafiq and Sadia need a future that includes learning as well as survival. Their papers and phone are fragile links to people who may help. The story begins beside a camp learning shelter, where remaining, organizing support and leaving carry different uncertainties.",
    contentNote: "Statelessness, interrupted schooling, trafficking risk and dangerous sea travel.",
    sourceIds: ["rohingya"],
    timeline: [
      { date: "1 June 2025", kind: "Documented reporting", text: "UNICEF warns that a funding shortfall threatens Rohingya education and affects host-community volunteer teachers.", sourceId: "rohingya" },
      { date: "Before departure · fictional", kind: "Family story", text: "The Karims weigh remaining in the camp against an unverified sea route and family tracing." },
      { date: "Possible arrival · fictional", kind: "Family story", text: "Survival and temporary reception in Aceh do not settle the family's long-term status, work or belonging." },
    ],
  },
});

export const FICTION_NOTICE = fiction;
export function getJourneyHistory(gameOrId) {
  if(authoredStory(gameOrId)) return authoredHistory(authoredStory(gameOrId));
  if ((typeof gameOrId === "string" ? gameOrId : gameOrId.familyId) === "cambodia-1979") return cambodiaEdition(gameOrId).CAMBODIA.history;
  return JOURNEY_HISTORY[typeof gameOrId === "string" ? gameOrId : gameOrId.familyId];
}
export function getJourneyDate(game) {
  if(authoredStory(game)) return storyScene(game).date;
  if (game.familyId === "cambodia-1979") return cambodiaEdition(game).sceneFor(game.cambodiaState).date;
  const context = getJourneyHistory(game);
  if (!context.departureDate) return "Contemporary · story day " + game.day;
  if (game.familyId === "ramirez" && game.day > 142) return "Historical early-2024 setting · saved story day " + game.day + " (calendar not reconstructed)";
  const date = new Date(context.departureDate + "T12:00:00Z");
  date.setUTCDate(date.getUTCDate() + Math.max(0, Math.floor(game.day || 1) - 1));
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}

const sceneNotes = {};
function scenes(familyId, ids, text, sourceIds) {
  for (const id of ids.split(" ")) sceneNotes[id] = { familyId, text, sourceIds };
}
scenes("ramirez", "home guideOffer roadRobbery guideAbandon blueDoorShelter waitingTown clinicQueue transport checkpointDelay policyNews northernWait borderCity riverCrossing memorial detention", "The Ramírez household is a fictional example of displacement under threat. The background reporting documents loss of homes and land; it does not determine this family's asylum eligibility, transit conditions or border outcome.", ["honduras"]);
scenes("ramirez", "policyNews northernWait borderCity riverCrossing detention", "Historical early 2024, before the June 2024 rule change. CBP One scheduled port inspection from central/northern Mexico; it was not an asylum application, parole grant or admission decision. Access barriers, limited slots and individual requirements mattered. The family’s bookings, wait lengths, clinic assistance and processing outcomes are fictional continuations, not guaranteed procedures or current legal advice. Other arrivals and exceptions require individual assessment.", ["usBorder2023", "cbpOne2024"]);
scenes("haddad", "haddadHome", "This is wartime Aleppo in 2015, four years after the uprising began. The UN report records civilian harm and interrupted schooling; the Haddads' workshop, papers and departure are authored family details.", ["syriaUprising", "aleppo2015"]);
scenes("haddad", "haddadBorder haddadTurkey haddadAegean", "Türkiye's temporary-protection framework dates to October 2014. Registration concerns protection there, not a ticket to Europe or a promise of work. The family's rent, job offers and decisions are fictional circumstances within that setting.", ["turkey2014"]);
scenes("haddad", "haddadMemorial haddadGreece", "The Türkiye–Greece crossing belongs to the broad route documented in 2015. Rescue, loss and registration in this story are fictional events; arrival does not itself decide a protection claim.", ["sea2015"]);
scenes("haddad", "haddadBalkans", "A fictional transport delay is not a permanent closure of the Balkan route. UNHCR's dated account of the 21 August 2015 border crisis is available in the history panel; it is not silently imposed on an earlier story day.", ["balkans2015", "sea2015"]);
scenes("haddad", "haddadEuropeNews haddadGermany", "The story remains in 2015. A relative's invitation, a public slogan or a registration paper cannot promise the family's eventual outcome. The fictional dialogue distinguishes family hopes and local capacity pressures from an official decision.", ["sea2015"]);
scenes("diop", "diopHome diopDakar diopSaintLouis diopNouakchott diopAtlantic diopMemorial diopCanaryLanding diopIslandWait diopFinal", "IOM's departure-area monitoring documents movements toward the Canary Islands. The relatives' debts, work, rescue and reception decisions are fictional; the reporting does not prove an exact itinerary or a shared motive for everyone on this route.", ["senegal"]);
scenes("nguyen", "nguyenHome nguyenRecruiter nguyenTransit nguyenSafeHouse nguyenFrance nguyenChannel nguyenUKArrival nguyenPolicy nguyenFinal", "Country information describes recruitment debts and exploitation risks. The Bùis' contract and incidents are fictional. A trafficking concern, an immigration claim and a work permission are separate questions, with outcomes depending on individual circumstances.", ["vietnam"]);
scenes("punjab", "punjabHome punjabDelhi punjabAirport punjabDublin punjabWorksite punjabInspection punjabPolicy punjabFinal", "Ireland's official framework describes employment protections. This fictional group's experience explores the gap between a promised job, written terms and what happens at work; it is not a guarantee that every worker can enter or remain through the same procedure.", ["ireland"]);
scenes("punjab", "punjabDelhi punjabAirport punjabDublin", "Employment permits, visas where required, border admission and residence registration are separate checks. The airport scene compresses a further wait in India before issued permits and separate visas exist in this fictional continuation, including after the premature PDF trip. Story days and resource costs do not model official processing times or fees; admission and service availability are not guaranteed. Guidance checked October 2026 supplies context, not this group's biography or current legal advice.", ["irelandVisa", "ireland"]);
scenes("punjab", "punjabInspection punjabFinal", "Employer closure alone does not establish loss of permission or reactivation eligibility. The adviser distinguishes qualifying redundancy/new-employer options from the separate ISD and reactivation prerequisites. Check dates, permit type and individual permission; do not infer a group entitlement. The appointments and help depicted are fictional, not guaranteed services. The linked undated official guidance was checked in October 2026, not fixed to a real departure date.", ["irelandRedundancy", "irelandReactivation"]);
scenes("rohingya", "rohingyaCamp rohingyaPapers rohingyaCoast rohingyaSea rohingyaWeather rohingyaSignal rohingyaLanding rohingyaAceh", "UNICEF's June 2025 funding warning concerns education and service capacity in Bangladesh. The Karim family's sea journey and reception are fictional possibilities, not a claim that aid shortages force every family to leave or that landing resolves statelessness.", ["rohingya"]);
export const SCENE_HISTORY = Object.freeze(sceneNotes);
export function getSceneHistory(game) {
  if(authoredStory(game)){const s=storyScene(game);return {text:s.context,sourceIds:s.sourceIds};}
  if (game.familyId === "cambodia-1979") { const scene=cambodiaEdition(game).sceneFor(game.cambodiaState); return {text:scene.context,sourceIds:scene.sourceIds}; }
  const note = SCENE_HISTORY[game.eventId];
  return note?.familyId === game.familyId ? note : null;
}

const INTRO_KEY = "the-undocumented-trail-context-v1";
export function shouldShowJourneyIntro(game, storage) {
  if (game.phase !== "decision" || game.history.length || game.day !== 1) return false;
  try { return storage.getItem(`${INTRO_KEY}:${game.runId}`) !== "seen"; } catch { return true; }
}
export function rememberJourneyIntro(game, storage) {
  try { storage.setItem(`${INTRO_KEY}:${game.runId}`, "seen"); } catch { /* Reading must never prevent play. */ }
}
