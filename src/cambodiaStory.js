// Review prototype for issue #2. Fictional household; no survival/admission model.
export const STORY_ID = "cambodia-1979";
export const STORY_NOTICE = "Fictional composite · No community or external historical review or endorsement is claimed.";
export const CONTENT_NOTE = "Non-graphic references to genocide, forced displacement and labor, hunger, bereavement, family separation and uncertainty. No timed choices or violence scenes. The optional soundtrack starts off.";
export const CAMBODIA_SOURCES = {
  C1: { title: "ECCC · Case 002/01: forced population movement", date: "Court case summary · retrospective judicial findings", url: "https://www.eccc.gov.kh/en/cases/case-002/trial-01" },
  C2: { title: "ECCC · Guide to the ECCC: displacement and worksites", date: "Court-issued institutional synthesis · 2025 · printed pp. 7, 12–16 read; not the judgment itself", url: "https://backend.eccc.gov.kh/uploads/Guide_to_The_ECCC_EN_digital_preview_63c9203337.pdf" },
  C3: { title: "USHMM · Renewed War", date: "Later historical summary · war and displacement after January 1979", url: "https://www.ushmm.org/genocide-prevention/countries/cambodia/renewed-war" },
  C4: { title: "UNHCR · State of the World’s Refugees, chapter 4", date: "Operational history · 2000 · indexed extracts read; full PDF retrieval pending; page range not independently checked", url: "https://www.unhcr.org/africa/sites/afr/files/legacy-pdf/3ebf9bad0.pdf" },
  C5: { title: "UN Secretary-General · Thailand visit, January 1985", date: "Contemporaneous institutional record · opening-date indexed extract read; full PDF retrieval pending", url: "https://digitallibrary.un.org/record/3969373/files/SG_T_1295-EN.pdf" },
  C6: { title: "United States · Refugee Act of 1980", date: "Statute · Public Law 96-212 · 17 March 1980 · PDF", url: "https://www.govinfo.gov/content/pkg/STATUTE-94/pdf/STATUTE-94-Pg102.pdf" },
  C7: { title: "MNHS · Monoram Hang, interview transcript", date: "Individual retrospective testimony · 30 July 1992 · read labeled transcript, not teaching-page background", url: "https://mnhs.gitlab.io/archive/becoming-minnesotan/education.mnhs.org/immigration/narrators/khmer/monoram-hang/they-approve-me-to-come-to-the-united-states.html" },
  C8: { title: "MNHS · Thaly Chhour, interview transcript", date: "Individual retrospective testimony · 14 August 1992 · read labeled transcript, not teaching-page background", url: "https://mnhs.gitlab.io/archive/becoming-minnesotan/education.mnhs.org/immigration/narrators/khmer/thaly-chhour/we-were-lucky.html" },
  C9: { title: "MNHS · Khmer oral-history collection", date: "Archived collection context read · interviews July–August 1992 · copyright credited to Minnesota Advocates for Human Rights; no reproduction permission obtained", url: "https://mnhs.gitlab.io/archive/minnesota-immigrant-oral-histories/collections.mnhs.org/ioh/10000831.html" },
};
CAMBODIA_SOURCES.C10 = { title: "UNHCR · 1980 annual report: Thailand assistance", date: "Contemporaneous operational record · A/35/12 · paragraphs 296–298 read; holding centres distinguished from border-zone assistance", url: "https://www.refworld.org/reference/annualreport/unhcr/1980/42268" };
export const CAMBODIA_HISTORY = {
  place: "Western Cambodia → Thailand → Minnesota", era: "1979–1982 · recollections of 1974–1979",
  historicalSummary: "The Khmer Rouge took Phnom Penh on 17 April 1975. Forced movement, forced labor and mass crimes followed. Its overthrow in January 1979 did not end war or displacement. Fighting and disrupted food production drove further flight. Indexed UN institutional records date Khao-I-Dang’s opening to 21 November 1979. UNHCR’s 2000 operational history distinguishes holding centres from militarized border camps and records Thailand’s January 1980 announcement closing holding centres to new arrivals. These indexed extracts do not establish universal enforcement; full source-document verification remains pending. The Refugee Act of 1980 established a systematic U.S. refugee-admission framework; camp reception did not itself grant U.S. admission.",
  familyStakes: "Dara, 24 in late 1979, her younger adult brother Vann and their aunt Maly are invented Khmer Cambodian people. Dara learned clothing repair and design. They want contact with missing relatives, time together and room for ordinary ambitions. Their 1981 refugee admission and survival are fixed authorial premises. These names, relationships and everyday details are authored fiction; no Khmer community review or endorsement is claimed. This household cannot stand for Cham Muslim, ethnic Vietnamese, ethnic Chinese, Indigenous or all Cambodian experiences.",
  contentNote: CONTENT_NOTE, sourceIds: Object.keys(CAMBODIA_SOURCES),
  timeline: [
    { kind: "Historical anchor · court", date: "17 April 1975", text: "Khmer Rouge takeover of Phnom Penh and forced movement.", sourceId: "C1" },
    { kind: "Historical anchor · later summary", date: "January 1979 onward", text: "Overthrow did not end war or displacement.", sourceId: "C3" },
    { kind: "Historical anchor · institutional record", date: "21 November 1979", text: "Opening date reported in indexed institutional records; full PDF verification remains pending.", sourceId: "C5" },
    { kind: "Historical anchor · operational history", date: "January 1980", text: "UNHCR’s operational history records Thailand’s closure announcement. This does not establish universal enforcement or describe every later arrival; full PDF verification remains pending.", sourceId: "C4" },
    { kind: "Historical anchor · statute", date: "17 March 1980", text: "Refugee Act of 1980 became law.", sourceId: "C6" },
    { kind: "Authored fiction", date: "1981–1982", text: "This household receives refugee admission and begins life in Minnesota. Their waiting time and scenes are invented." },
    { kind: "Separate person’s retrospective testimony", date: "1985, recalled in 1992", text: "Monoram Hang described a different experience of camp access years later. His account is not Dara’s timeline or a universal policy chronology.", sourceId: "C7" },
  ],
};
const choice = (id, title, description, flag, consequence) => ({ id, title, description, flag, consequence });
const scene = (id, date, order, place, title, prose, summary, context, sourceIds, choices, status) => ({ id, date, order, place, title, prose, summary, context, sourceIds, choices, status });
export const CAMBODIA_SCENES = [
  scene("C01", "1974 · a recollection", 1974, "Western Cambodia · home unspecified", "A shirt and a drawing",
    "Before the years that separated them, Dara remembers mending a shirt. She sketches another shape for its sleeves while Vann jokes that she has designed something he will never sit still long enough to wear. Maly joins the conversation. These are ordinary people with interests and disagreements, before the events that will dominate official accounts. Choose what the telling pauses over; neither memory makes anyone more deserving of safety.",
    "Dara remembers clothing design and conversation with Vann and Maly before their displacement.",
    "This ordinary household scene is authored fiction. The dates that follow come from historical evidence; these memories do not come from a real narrator’s biography.", ["C1", "C9"], [
      choice("drawing", "Stay with the drawings", "Attend to Dara’s interest in clothing and design.", ["memory", "design"], "The telling lingers over an unfinished sleeve design. Dara’s interests will remain part of her life, even when there is little time for them."),
      choice("conversation", "Stay with the conversation", "Attend to the household’s familiar voices.", ["memory", "family"], "The telling holds onto the teasing and overlapping voices. Ordinary conversation, not only loss, will be part of what Dara remembers."),
    ], "Recollection · before displacement"),
  scene("C02", "1975–1979 · years not played through", 1975, "Cambodia · locations unspecified", "Years outside your control",
    "On 17 April 1975 the Khmer Rouge took Phnom Penh. The years of forced movement, forced labor and mass crimes that followed are not a playable test. In this fictional household’s account, separation, hunger and bereavement leave gaps that cannot be repaired by choosing correctly. The story does not stage violence or ask you to prevent historical atrocities. You may continue with this short account or open the documented history; both paths preserve exactly the same story state.",
    "Forced displacement, labor, hunger, separation and bereavement affected this fictional household. These years cannot be changed through choices.",
    "The ECCC findings concern specified crimes and periods. Court findings, later summaries and individual testimony have different scopes. The story keeps that distinction visible.", ["C1", "C2"], [
      choice("summary", "Continue with the short account", "Move on without opening further historical detail.", null, "The story moves forward to November 1979. No reader choice could have prevented these years."),
      choice("history", "Read the historical context", "Open sources, then continue to the same point.", null, "The story moves forward to November 1979. No reader choice could have prevented these years."),
    ], "Forced displacement · no playable prevention"),
  scene("C03", "November 1979", 1979.85, "Western Cambodia · regional anchor", "News that is not an answer",
    "Dara, Vann and Maly are together again. Their reunions have not answered every question about relatives. The overthrow of the Khmer Rouge earlier that year has not brought a dependable peace. Food and news are uncertain. A group they know is preparing to leave. They discuss whether to spend another day asking known contacts or to prepare with the group. Neither decision will resolve the war or determine who survives.",
    "Together again, the household weighs one more day asking about relatives against preparing to leave with a known group.",
    "War continued after January 1979; disrupted food production and insecurity helped drive flight. This household’s timing and conversations are invented.", ["C3"], [
      choice("contacts", "Ask known contacts for one more day", "Give the search more time while supplies become tighter.", ["contact", "asked"], "A contact has only an uncertain lead. The extra day makes supplies tighter, and they agree on what news they would want passed on. A shared contact plan is something to carry; it is not an answer."),
      choice("prepare", "Prepare with the departing group", "Use the day to arrange belongings; leave the relative’s whereabouts unresolved.", ["contact", "unresolved"], "They spend the day arranging what they can carry. Dara cannot turn an unresolved absence into certainty. Vann asks that they keep space for future news."),
    ], "Displaced in Cambodia · relatives’ whereabouts unresolved"),
  scene("C04", "Late November 1979", 1979.9, "Western Cambodia toward Thailand · broad region", "Making room to rest",
    "Movement is tiring. Maly wants to stop for a while; Vann offers to change how they share the bundles. Dara listens before replying. The account stays with care and effort, without reconstructing a crossing, giving directions or inventing guard routines. The destination is not a reward for choosing the more strenuous option.",
    "The household discusses rest and how to share what they carry. Both choices lead to the same next stage.",
    "The broad regional map is not a crossing route. Conditions differed across border areas and dates; no tactical details or admission odds are modeled.", ["C3", "C4"], [
      choice("rest", "Stop together for rest", "Accept help and let some daylight pass.", ["care", "rest"], "They stop. Vann takes a turn helping Maly settle the bundles, and Dara accepts help too. Daylight passes; receiving care becomes part of what they remember."),
      choice("share", "Rearrange the bundles together", "Share the effort, while acknowledging everyone’s tiredness.", ["care", "shared"], "They discuss what each can carry and rearrange the bundles. Shared effort does not make the journey easy; they remain tired and make room to say so."),
    ], "Displacement toward Thailand · crossing details unspecified"),
  scene("C05", "December 1979", 1979.95, "Khao-I-Dang area, Thailand", "A holding centre, not a destination",
    "At Khao-I-Dang, Dara finds herself listening for familiar names and learning the rhythm of a new place. Indexed institutional records date the centre’s opening to 21 November 1979. This fictional December arrival is later; full source-document verification remains pending. Reception here is not permission to enter the United States. A neighbor offers conversation while Dara considers asking how to pass on news of relatives. Neither conversation earns food or a place in a faster resettlement line.",
    "The household reaches Khao-I-Dang after its opening. Dara can ask about family contact or spend time learning a neighbor’s routine.",
    "UNHCR’s contemporary 1980 annual report distinguishes assistance in holding centres from border-zone programmes. Its later institutional history discusses militarized border camps. Indexed UN records supply the opening date; full documents remain unverified here. This story’s December arrival is invented and must not be generalized to later arrivals.", ["C4", "C5", "C10"], [
      choice("report", "Ask how to pass on family news", "Make time for a question; do not expect a quick answer.", ["camp", "contact"], "Dara asks what can be shared about missing relatives. She comes away with questions and a clearer contact plan, not a promised result or a new entitlement."),
      choice("neighbor", "Spend time with the neighbor", "Learn a household routine and begin a reciprocal connection.", ["camp", "neighbor"], "They talk about arranging the day and offer what small help each can. Dara has a new connection; the unanswered questions about relatives remain."),
    ], "Received at a Thai holding centre · no U.S. admission yet"),
  scene("C06", "1980", 1980, "Khao-I-Dang area, Thailand", "A change they cannot vote away",
    "UNHCR’s operational history records Thailand’s January 1980 announcement closing holding centres to new arrivals. In this fictional scene, the household hears the news. They are already here; the announcement still brings uncertainty about people beyond the centre. They cannot alter the policy through a good deed or a clever answer. Dara and Maly discuss what they can offer without promising help they cannot sustain, and what they still need to ask.",
    "Closure to new arrivals is outside the household’s control. They discuss limited mutual support or questions for staff.",
    "The January 1980 announcement is reported in indexed UNHCR text; full PDF verification remains pending. This is not a claim of universal enforcement or identical access rules at every camp. The separate 1985 testimony below concerns another person and another time.", ["C4", "C7", "C8"], [
      choice("support", "Discuss help within their means", "Offer a modest amount of time, leaving less for their own plans.", ["support", "neighbors"], "They agree on help they can sustain and say when they need time for themselves. The relationship grows through limits as well as generosity. Policy does not change."),
      choice("questions", "Ask what information can be shared", "Spend the time asking staff; accept that answers may remain uncertain.", ["support", "questions"], "Dara brings their questions forward. Some answers remain uncertain. Asking is useful for planning, but it cannot secure admission or change the closure."),
    ], "Existing holding-centre residents · later access differs"),
  scene("C07", "1981 · after a long wait", 1981, "Thailand · departure arrangements unspecified", "Approval is not a score",
    "Time passes before the household is approved for refugee admission to the United States in 1981. This is an authored outcome under a refugee-admission pathway, not undocumented entry and not instant citizenship. Money, English proficiency and earlier choices did not earn it. Many other people waited longer, went elsewhere, returned, or never received such an opportunity. Dara can ask one set of questions now and carry the other questions forward. The story does not invent an airport or an intermediate processing itinerary.",
    "After an authored wait, all three receive refugee admission in 1981. The reader did not earn this approval.",
    "The Refugee Act of 1980 supplies the legal framework, not proof of this invented household’s case or timetable. Camp residence and admission to a different country are separate matters.", ["C6"], [
      choice("contact", "Ask about continuing family contact", "Give communication questions attention; practical arrival questions remain.", ["arrival", "contact"], "Dara prepares questions about staying reachable and passing on news. Questions about the first weeks in Minnesota remain on the table. No answer restores missing relatives."),
      choice("practical", "Ask about the first weeks in Minnesota", "Discuss practical questions; leave more contact questions for later.", ["arrival", "practical"], "They discuss what they still need to learn about daily life. Practical questions receive attention; their need for family news travels with them."),
    ], "Approved for U.S. refugee admission · not citizenship"),
  scene("C08", "Minnesota · 1981", 1981.5, "Minnesota, United States · community unspecified", "An unfinished timetable",
    "Around a table, Dara compares questions about work, classes, a bus trip and a letter. Khmer neighbors and local helpers exchange knowledge with the household; help does not move in only one direction. Vann and Maly have their own needs and preferences. There is no schedule that removes fatigue or makes belonging automatic. They can give one priority more room while agreeing to revisit the other.",
    "In Minnesota, the household discusses work, language learning and shared responsibilities. Both schedules have costs.",
    "Minnesota oral histories document varied lives and ambitions. This household’s table, timetable and employment questions are invented, with no guaranteed job or measure of assimilation.", ["C9", "C6"], [
      choice("work", "Plan around work and ask about evening classes", "Give income planning earlier attention; discuss fatigue and awkward hours.", ["schedule", "work"], "Dara gives work questions earlier attention without a job guarantee. Evening study may be tiring or difficult to fit. The household agrees to revisit how tasks and rest are shared."),
      choice("classes", "Protect class time and share household tasks", "Make learning time explicit; discuss a tighter budget and who does what.", ["schedule", "classes"], "They protect time for learning and discuss household responsibilities. Money remains tight and the arrangement requires further conversation. Learning is an interest and a need, not a test of worth."),
    ], "Admitted as refugees · no instant citizenship"),
  scene("C09", "Minnesota · 1982", 1982, "Minnesota, United States · community unspecified", "A place for tomorrow",
    "A drawing and an unfinished letter lie near each other. Some news has arrived; other questions about relatives have no answer. Dara’s life cannot be reduced to the journey that brought her here. Vann interrupts with a comment, and Maly asks what will happen to the letter. There is room to end this telling with an ordinary memory or an ambition still taking shape. Neither is a victory screen or a verdict on how well anyone has adapted.",
    "The telling ends with continuing relationships, unanswered questions and Dara’s ambitions. Neither ending is graded.",
    "Resettlement is not the end of a person’s story. These two fictional reflections do not claim a typical outcome or reproduce an oral-history narrator’s ending.", ["C9"], [
      choice("memory", "End with an ordinary memory", "Hold onto relationships and a moment from before displacement.", ["ending", "memory"], "Dara puts the letter aside long enough to listen. The household makes room for an ordinary conversation, with grief and uncertainty still present. Their lives continue beyond the frame."),
      choice("design", "End with a design still in progress", "Give Dara’s interest room without promising a career or an easy future.", ["ending", "design"], "Dara returns to an unfinished design. She has questions about time, materials and work, and a reason to keep drawing. An ambition can matter without becoming a promised success."),
    ], "Continuing life after refugee admission · future open"),
];
export function sceneFor(state) { return CAMBODIA_SCENES.find(s => s.id === state.sceneId); }
export function callbacks(state) {
  const { flags, sceneId } = state;
  const notes = [];
  if (["C07", "C08", "C09"].includes(sceneId)) {
    if (flags.contact === "asked") notes.push("The shared contact plan from the extra day in Cambodia returns to their discussion; the lead never became a certain answer.");
    if (flags.contact === "unresolved") notes.push("The relative whose whereabouts remained unresolved before departure is still part of their conversation.");
    if (flags.care === "rest") notes.push("Dara remembers receiving help when they stopped to rest. Accepting care still matters alongside offering it.");
    if (flags.care === "shared") notes.push("The conversation about sharing bundles returns as they discuss sharing work and saying when they are tired.");
  }
  if (sceneId === "C09") {
    notes.push(flags.memory === "design" ? "The early sleeve drawings return to Dara’s mind; design has remained one of her interests." : "The remembered family conversation returns in a familiar interruption from Vann.");
    notes.push(flags.schedule === "work" ? "The work-first timetable still needs room for study and rest." : "The protected class time still depends on shared tasks and difficult budget conversations.");
  }
  return notes;
}
export const CAMBODIA = { id: STORY_ID, title: "A Place for Tomorrow", history: CAMBODIA_HISTORY, sources: CAMBODIA_SOURCES };
