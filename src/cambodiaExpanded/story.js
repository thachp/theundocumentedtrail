import {CAMBODIA_SOURCES as originalSources,STORY_NOTICE,CONTENT_NOTE} from '../cambodiaStory.js';
export {STORY_NOTICE,CONTENT_NOTE};
export const CAMBODIA_SOURCES={...originalSources,
 E5:{title:'USHMM · Forced Labor and Collectivization',date:'Institutional retrospective · currency abolition under Khmer Rouge rule; read 20 October 2026. Not a 1979 market price or exchange-rate source.',url:'https://www.ushmm.org/genocide-prevention/countries/cambodia/forced-labor-and-collectivization'},
 E1:{title:'Historical Society of Long Beach · Cambodian American oral histories',date:'Retrospective individual accounts and collection captions · read 18 October 2026; not a universal pathway',url:'https://hslb.org/cambodian-american-collection/oral-histories/'},
 E3:{title:'CDC · Khao-I-Dang health surveillance',date:'1983 report, December 1981–June 1983 observations · later context, not a diagnosis for the fictional 1980 scene',url:'https://www.cdc.gov/mmwr/preview/mmwrhtml/00000123.htm'},
 E4:{title:'Soriya J.-M. Birsens s.j. · Vluchteling in Samlor Chngangn. Geschiedenis van een kamp.',date:'Streven 1986–87, pp. 207–210 · contemporary account; January/March displacement, June 1985 schools and hospital; later developments distinguished',url:'https://www.dbnl.org/tekst/_str008198601_01/_str008198601_01_0023.php'},
 E2:{title:'UNHCR · The State of the World’s Refugees 2000, chapter 4',date:'Institutional retrospective · camp distinctions; pp. 93–94 · holding-centre and border-camp distinctions; separately delegated research read 18 October 2026',url:'https://www.unhcr.org/sites/default/files/legacy-pdf/3ebf9bad0.pdf'},
};
const c=(id,title,description,consequence,effects={},flags={},next,time=1)=>({id,title,description,consequence,effects,flags,next,time});
const s=(id,date,order,place,title,prose,choices,next,art='C04',coordinates=[103,13],sources=['C3'])=>({id,date,order,place,title,prose,summary:prose,context:'The people, dialogue, incidents, quantities and waits here are invented. Sources describe the wider setting, not this household or the consequences of a particular choice.',sourceIds:sources,status:'Fictional composite · no guaranteed admission',choices,next,art,coordinates});
export const CAMBODIA_SCENES=[
 s('E01','November 1979',1979.86,'Western Cambodia · regional anchor','Four people, unfinished plans',
 'Dara, 24, folds a sleeve she has been mending. Her brother Vann counts bundles; their aunt Maly wants room for a cooking pot. Sophea, their cousin, 22, has been recording uncertain news of relatives. They are together after years of forced movement, loss and hunger. The Khmer Rouge have been overthrown, but war continues. A known group is preparing to leave. Choose one priority; the others will need attention later.',[
 c('notes','Protect the contact notes','Sophea organizes names while the others prepare; less time remains for food.','Sophea separates confirmed names from rumors. Some food preparation waits.',{supplies:-1},{contact:'notes'}),
 c('food','Prepare food together','Maly leads preparation; questions about relatives remain unresolved.','Food is easier to share on the road. The unanswered names travel with them.',{supplies:2},{contact:'unresolved'}),
 c('neighbors','Coordinate with the neighbors','Vann offers time to agree on mutual help, leaving less time to pack.','They agree to speak up when someone needs rest. Their own packing finishes late.',{cohesion:1,stress:-1},{contact:'neighbors'},undefined,2),
 ],'E02','C03'),
 s('E02','Late November 1979',1979.9,'Western Cambodia · route unspecified','Across a landscape of loss',
 'Their movement takes them through countryside affected by Khmer Rouge mass killing and forced labor. There are absences no map can show. Maly asks to pause; Dara finds herself unable to talk. No violence is shown, and no choice changes the atrocities. The household can decide how to care for one another today.',[
 c('pause','Pause together','Rest uses daylight and some of the food they carry.','They eat and sit quietly. Dara accepts company without having to explain.',{supplies:-1,health:4,stress:-1},{care:'rest'},undefined,2),
 c('bundles','Redistribute the bundles','Vann takes a heavier share; everyone must name their limits.','They move again with a more workable load. Vann is tired and asks for a turn resting later.',{health:-2,cohesion:1},{care:'shared'}),
 c('summary','Continue with a brief account','Use the same pause and care without reading further detail.','The household rests together. The account continues without additional detail.',{supplies:-1,health:4,stress:-1},{care:'rest'},undefined,2),
 ],'E03','C02'),
 s('E03','Late November 1979',1979.91,'Western Cambodia · regional anchor','A bundle is missing',
 'At a crowded resting place a bundle disappears. It held part of the food, not a person’s worth or their right to help. An unfamiliar man offers to recover it for payment he wants in advance. He gives no way to verify his claim. Sophea wants to protect the remaining belongings; Maly asks what they will eat tonight.',[
 c('help','Ask known companions for help','Spend time asking openly; the bundle may remain missing.','The bundle is not found. A companion shares a small meal, and they reorganize what remains.',{supplies:-1,cohesion:1},{theft:'help'},'R01',2),
 c('guard','Keep the group and remaining things together','Leave the missing food behind and continue with less.','They keep the notes and remaining bundle together. Tonight’s meal is smaller.',{supplies:-2,stress:1},{theft:'guard'}),
 c('offer','Pay for the promised recovery','The claim cannot be verified; payment could leave them with less.','The man does not return. They have lost their payment as well as the bundle; the account assigns no identity to him.',{cash:-2,supplies:-2,stress:1},{theft:'offer'}),
 ],'E04','C04'),
 s('E04','Late November 1979',1979.92,'Thai–Cambodian border region · broad anchor','No safe shortcut promised',
 'News of fighting and mines makes the way ahead uncertain. There is no route-finding or mine-handling puzzle. Vann wants to keep moving; Maly asks them to seek reliable local assistance rather than trust a stranger’s claim of a shortcut. Help may take time and may not resolve every uncertainty.',[
 c('wait','Wait together for reliable assistance','Use time and supplies while avoiding an unverified shortcut.','They wait. The story leaves the actual crossing offscreen; no route is certified safe.',{supplies:-1,water:-1,stress:-1},{routeCare:'wait'},undefined,3),
 c('care','Organize rest while another adult asks for help','Split household tasks without separating the traveling party.','Dara helps Maly rest while Vann asks questions within sight. They still need assistance before moving.',{health:3,water:-1},{routeCare:'care'},undefined,2),
 c('group','Discuss the uncertainty with known companions','Mutual planning costs daylight; companions cannot guarantee safety.','They reject the unsupported shortcut claim together. The next movement is summarized, without tactical directions.',{cohesion:1,supplies:-1},{routeCare:'group'},undefined,2),
 ],'E05','C04'),
 s('E05','December 1979',1979.95,'Khao-I-Dang area, Thailand · approximate regional anchor','Reception is a beginning',
 'In this fictional continuation the four reach Khao-I-Dang after its opening on 21 November 1979. They need rest, food, water and information. The centre is guarded; arrival does not give free movement or U.S. admission. A neighbor offers to explain the routines. Dara wants to ask about relatives, while Maly needs a quieter place to sit.',[
 c('water','Wait for the water distribution','Give water the available time; contact questions wait.','They return with water. Sophea keeps a place for tomorrow’s unanswered questions.',{water:3,stress:-1},{camp:'water'},'W01',2),
 c('neighbor','Accept a neighbor’s practical help','Share a small portion of food while learning how the day is organized.','The neighbor helps them settle. They share food and agree on reciprocal help within their limits.',{supplies:-1,cohesion:1},{camp:'neighbor'}),
 c('questions','Ask staff about the household’s immediate needs','Spend time seeking information; answers may be incomplete.','They learn where to ask for assistance. Nothing in this conversation grants movement or resettlement permission.',{stress:-1},{camp:'questions'},undefined,2),
 ],'E06','expanded-camp-water',[102.5,14],['C5','C10']),
 s('E06','Early 1980',1980.05,'Khao-I-Dang area, Thailand','A queue and a fever',
 'Maly is feverish and weak. Medical care is under pressure; the household cannot diagnose her illness. Malaria and malnutrition belong to the wider displacement history, not a random punishment or a diagnosis made by the player. The family weighs time at the clinic against collecting supplies. Humanitarian care is not earned by work or generosity.',[
 c('clinic','Accompany Maly to seek care','Spend the day seeking assessment; ask a neighbor about supplies.','Care is sought without a promised diagnosis or instant recovery. A neighbor helps with part of the household’s tasks.',{health:4,water:-1},{medical:'clinic'},undefined,3),
 c('turns','Take turns between the clinic and daily tasks','Share effort while leaving less time for rest.','Maly is accompanied. The others take turns; everyone is tired, and the account leaves clinical decisions to staff.',{health:2,supplies:1,stress:1},{medical:'turns'},undefined,3),
 c('help','Ask relief staff and neighbors to help coordinate','Accept help and explain the need; assistance may be delayed.','Someone helps organize the household’s requests. Maly still waits for assessment, with family beside her.',{health:3,cohesion:1},{medical:'help'},undefined,2),
 ],'E07','C06',[102.5,14],['C10','E3']),
 s('E07','1980 · a later camp routine',1980.3,'Khao-I-Dang area, Thailand','A repair, a meal, a lesson',
 'Dara has a small opportunity to repair a neighbor’s clothing using materials the neighbor provides. The neighbor offers a modest exchange. Vann can help with a shared meal, while Sophea wants time to read and Maly needs a rest. Camp tasks and informal exchanges are not a general permission for formal employment outside the centre. No work buys a place in a resettlement queue.',[
 c('repair','Take the short clothing repair','A modest exchange can help the household; Dara will have less rest.','The repair is finished once. The neighbor provides the agreed exchange; Dara asks someone else to handle the evening tasks.',{cash:1,health:-2},{work:'repair'},'J01',2),
 c('meal','Help prepare a shared meal','Contribute time to mutual aid; this is not paid employment.','Vann helps with the meal while Dara rests. Shared preparation leaves a portion for the household.',{supplies:1,cohesion:1},{work:'meal'},undefined,2),
 c('learning','Protect rest and learning time','Decline this exchange; the household forgoes the extra resources.','Maly rests, Sophea reads, and Dara sketches a pocket. They still need to plan tomorrow’s supplies.',{health:3,stress:-1},{work:'learning'},undefined,2),
 ],'E08','expanded-camp-work',[102.5,14],['E1']),
 s('E08','1980–1981 · authored waiting period',1980.8,'Khao-I-Dang area, Thailand','An application, not a promise',
 'The household asks about possible U.S. resettlement. Long Beach, California is their hoped-for destination because an invented relative lives there. They must distinguish a relative’s willingness to help from an official admission decision. Earlier care, work and resources cannot earn approval. The Refugee Act of 1980 is part of the historical framework; this is not a present-day application guide.',[
 c('records','Organize the household’s names and questions','Sophea makes uncertainty explicit; no missing paper is magically restored.','Their questions are organized. Staff still have decisions to make, and the household still waits.',{stress:-1},{application:'records'},undefined,2),
 c('relative','Write to the relative in Long Beach','Clarify possible support; a reply cannot authorize admission.','They ask about housing and practical help. The letter is not an approval or a promise of a placement.',{cash:-1,cohesion:1},{application:'relative'},undefined,2),
 c('explain','Ask for the process to be explained again','Use time seeking clarity; no invented filing deadline is imposed.','Dara asks what remains undecided. The questions are legitimate, and the wait continues.',{stress:-1},{application:'explain'},undefined,2),
 ],'E09','C07',[102.5,14],['C6','E1']),
 s('E09','1981 · fictional case outcome',1981.2,'Thailand · departure arrangements unspecified','The decision comes from elsewhere',
 'After an invented wait, this household receives approval for U.S. refugee admission. That is a fixed fictional continuation, independent of resources and choices; many others did not receive it. Practical arrangements include support from their invented relative in Long Beach. No airport, flight connection or universal sponsorship procedure is reconstructed.',[
 c('contact','Arrange how to stay reachable','Protect contact details while leaving some packing for later.','They exchange addresses with permission. Their relationships do not end at departure.',{cohesion:1},{departure:'contact'}),
 c('pack','Share packing and care tasks','Prepare together; some farewell conversations remain unfinished.','They divide tasks according to their limits. They carry questions as well as belongings.',{health:2},{departure:'pack'}),
 c('questions','Ask about the first weeks in California','Give housing and transport questions time; answers remain provisional.','They prepare practical questions without a guaranteed home, job or citizenship.',{stress:-1},{departure:'questions'}),
 ],'E10','C07',[102.5,14],['C6']),
 s('E10','Long Beach · 1981',1981.6,'Long Beach, California, United States','A different kind of timetable',
 'The journey to the United States happens offscreen. In Long Beach the four sit around a borrowed table with their relative. Space and money are tight. Dara wants work and time to design; Sophea wants learning and correspondence. Maly and Vann want a say in how tasks are shared. Admission is not citizenship, a guaranteed job or automatic belonging.',[
 c('income','Give income planning the first open hours','Ask about work while sharing tasks; study may be tiring to fit in.','Dara begins asking about work. The household agrees that earning cannot make her always available.',{cash:1,health:-2},{schedule:'work'},undefined,2),
 c('classes','Protect learning time','Budget more carefully and share household tasks.','Sophea and Dara protect an hour for learning; the household revisits expenses and care.',{cash:-1,cohesion:1},{schedule:'learning'},undefined,2),
 c('community','Make time for reciprocal community help','Offer limited help and ask about local routines; practical tasks take longer.','They share what they know and accept help with unfamiliar routines. Neither side is only a helper or recipient.',{cohesion:1,stress:-1},{schedule:'community'},undefined,2),
 ],'E11','expanded-long-beach',[-118.19,33.77],['E1','C6']),
 s('E11','Long Beach · 1982',1982,'Long Beach, California, United States','A place for tomorrow',
 'A design and an unfinished letter share the table. Some questions about relatives remain unanswered. Their lives hold ordinary disagreement, fatigue, learning and plans. Choose where this telling ends; no ending grades how well anyone has adapted.',[
 c('design','Return to the unfinished design','Give Dara’s interest room without promising a career.','Dara draws while Sophea proposes a pocket for a folded letter. Their ambitions remain in progress.',{}, {ending:'design'}),
 c('letter','Read the letter together','Make room for relationships and uncertain news.','They ask what each person wants included. The next chapter moves forward to 1985 and a fictional friend’s different camp circumstances.',{}, {ending:'letter'},'P01'),
 c('tomorrow','Plan a shared day of rest','Leave some tasks unfinished; rest does not need to be earned.','Vann names what can wait; Maly asks for a walk together. They make room for an ordinary tomorrow.',{health:2},{ending:'rest'}),
 ],null,'expanded-long-beach',[-118.19,33.77],['E1']),
];
CAMBODIA_SCENES.push(
 s('R01','Late November 1979 · the next rest',1979.915,'Western Cambodia · regional anchor','Help has its own limits',
 'After the theft, companions offer help. They cannot replace everything. Vann wants to use the available time to find food; Sophea wants to protect the names and contact notes that remain. The household must say what it needs and what can wait.',[
 c('food','Accept food and share the next task','Accept a meal while committing some time to reciprocal help.','They eat and later help carry a companion’s ordinary belongings. Accepting food creates no debt of obedience.',{supplies:2,health:-1},{recovery:'food'},undefined,2),
 c('rest','Ask for company while they rest','Leave food replacement for later; quiet company can help.','Someone stays nearby while the household rests. The lost supplies still need attention.',{health:3,stress:-1},{recovery:'rest'},undefined,2),
 c('notes','Protect notes and remaining belongings together','Use the pause to agree on shared responsibility.','They agree who can carry each bundle without assuming Maly or Sophea is always available.',{cohesion:1},{recovery:'notes'}),
 ],'E04','C04'),
 s('W01','Early 1980 · daily distribution',1980.01,'Khao-I-Dang area, Thailand','Food, water and a neighbor',
 'Water collection has taken part of the day. The household has food to prepare and a neighbor asking for help. Relief makes daily life possible, but a household can still run short or be exhausted. Dara asks them to make a plan that does not quietly assign every task to one person.',[
 c('meal','Prepare the household meal first','Use some stored food; help for the neighbor waits.','They eat and Maly rests. They tell the neighbor when someone may be available.',{supplies:-1,health:3},{ration:'household'},undefined,2),
 c('share','Pool preparation with the neighbor','Share food and effort while acknowledging everyone’s limits.','Two households prepare together. Vann takes a turn and asks for a break afterward.',{supplies:-1,cohesion:1,health:1},{ration:'shared'},undefined,2),
 c('relief','Ask the relief point about a shortage','Spend time asking rather than assuming assistance has run out.','They ask about the household’s needs. A fictional distribution helps today; no universal ration amount is implied.',{supplies:1,water:1},{ration:'relief'},undefined,3),
 ],'E06','expanded-camp-water',[102.5,14],['C10']),
 s('J01','1980 · after the repair',1980.31,'Khao-I-Dang area, Thailand','One exchange does not make a livelihood',
 'The repair is complete. Another request comes before Dara has rested. She can set a limit, ask whether the work can be shared, or accept one more small task. The first exchange cannot be collected twice, and no task changes the household’s resettlement position.',[
 c('limit','Set a limit and rest','Decline the extra exchange to protect time for care and learning.','Dara rests while Sophea reads. The household keeps the earlier payment and forgoes another.',{health:3},{workLimit:'rest'},undefined,2),
 c('share','Ask whether another willing adult can share the task','Agree on effort and a modest exchange; no one is assigned by default.','Vann volunteers for part of the task after naming his limits. The small exchange is shared.',{cash:1,cohesion:1,health:-1},{workLimit:'shared'},undefined,2),
 c('extra','Accept one extra task','Gain a small exchange while leaving less time for rest.','Dara completes the extra task and is tired. The household agrees not to build tomorrow’s plan around endless work.',{cash:1,health:-3,stress:1},{workLimit:'extra'},undefined,3),
 ],'E08','expanded-camp-work',[102.5,14],['E1']),
 s('P01','January 1985 · a later parallel account',1985,'Long Beach, California · a letter about Site One','A friend’s different circumstances',
 'Three years after the preceding scene, the household in Long Beach reads a letter about an invented friend in Site One. The four travelers are still in California. Site One and Site Two belong to a later border-relief context; neither is another name for Khao-I-Dang. Site One was an exposed emergency refuge during the 1984–85 fighting and evacuations. The letter asks for family news. This is a parallel fictional account, not a transfer route for Dara’s household.',[
 c('news','Write down confirmed family news','Ask consent before sharing names; some questions cannot be answered.','Sophea prepares a careful reply without turning an uncertain report into a fact.',{cohesion:1},{parallel:'news'}),
 c('relief','Ask what reliable humanitarian information is available','Spend time seeking dated information; a distant household cannot promise protection.','They separate public relief information from rumors about the friend’s location.',{stress:-1},{parallel:'relief'},undefined,2),
 c('brief','Read a brief comparison','Continue with the same context without additional personal detail.','Site One and Site Two remain distinct later border-camp contexts. The family does not travel through them.',{}, {parallel:'brief'}),
 ],'P02','expanded-long-beach',[-118.19,33.77],['E2','E4']),
 s('P02','March 1985 · parallel historical context',1985.1,'Long Beach, California · discussing Site Two','A camp name is not a pathway',
 'A later message concerns Site Two, associated with the 1984–85 border evacuations. The March account concerns displacement and initial relief, alongside restrictions and uncertainty. Later developments belong to the separately dated historical context. This does not establish that the same friend moved from Site One to Site Two. These border camps did not generally offer Khao-I-Dang’s possible third-country resettlement pathway. Dara cannot promise that a sponsor in Long Beach will secure admission. The household chooses what it can responsibly offer from California.',[
 c('contact','Offer continued correspondence','Keep the relationship alive without promising a legal outcome.','The reply offers a way to remain in contact. The friend’s future is unresolved; support is not admission.',{cohesion:1},{parallelEnd:'contact'}),
 c('questions','Ask a qualified organization about the distinction','Give the question time; do not invent a case or available application.','They ask what is known and what remains unavailable. No resettlement application or approval is created for the friend.',{stress:-1},{parallelEnd:'questions'},undefined,2),
 c('limits','Write honestly about the limits of their help','Acknowledge distance and uncertainty alongside the relationship.','They offer care without making a promise they cannot keep. Long Beach remains their home and a hope, not a guaranteed destination for others.',{}, {parallelEnd:'limits'}),
 ],null,'expanded-long-beach',[-118.19,33.77],['E2','E4'])
);
CAMBODIA_SCENES.find(scene=>scene.id==='P02').context='Birsens, p. 209, dates primary schools, a new hospital and a nursing school to June 1985. The article also describes later expansion. Those later facilities are not presented as already available in this fictional March letter.';
// Currency history supports context, never fictional balances or prices.
for(const scene of CAMBODIA_SCENES)if(['E01','E03'].includes(scene.id))scene.sourceIds.push('E5');
// Shortages affect the next occasion, rather than resetting resources per scene.
for(const scene of CAMBODIA_SCENES){
 if(['E06','E07','J01'].includes(scene.id))for(const choice of scene.choices){choice.when={resource:'supplies',below:2};choice.conditionalEffects={health:-2};choice.conditionalNote='Food carried from earlier decisions is running low. The extra fatigue persists even while help and care remain available.';}
}
CAMBODIA_SCENES.find(s=>s.id==='E03').choices.find(c=>c.id==='offer').requires={cash:2};
const classChoice=CAMBODIA_SCENES.find(s=>s.id==='E10').choices.find(c=>c.id==='classes');
classChoice.when={resource:'cash',below:2};classChoice.conditionalEffects={stress:1};classChoice.conditionalNote='Earlier exchange decisions leave little budget room. Their relative shares materials while the household postpones another purchase; learning remains possible, with a tighter timetable.';
// Additional obstacles are reachable only under new-run event rules.
CAMBODIA_SCENES.push(
 s('T01','Late November 1979 · a delayed departure',1979.925,'Thai–Cambodian border region · broad anchor','Another day without a departure',
 'The expected assistance is delayed. Maly needs water and Vann is worn out. Nobody can verify a shortcut. Decide how to manage the wait; the crossing remains offscreen.',[
 c('share','Pool food with known companions','Share preparation and ask openly about water.','A shared meal stretches what remains; Sophea takes time to collect water with companions.',{supplies:2,water:2,cohesion:1},{delay:'shared'},undefined,2),
 c('exchange','Exchange a remaining belonging for supplies','Use portable means while keeping the party together.','The agreed exchange brings food and water, leaving fewer belongings to exchange later.',{cash:-1,supplies:3,water:2},{delay:'exchange'}),
 c('rest','Protect rest and request relief','Wait for help without accepting an unsupported route offer.','They receive a small meal and water. Vann rests, but the extra waiting takes effort.',{supplies:1,water:1,health:3,stress:1},{delay:'rest'},undefined,3),
 ],'E05','C04'),
 s('H01','Early 1980 · the next care day',1980.06,'Khao-I-Dang area, Thailand','Maly still needs assessment',
 'Yesterday’s coordination has not yet brought Maly to assessment. Food collection and accompanying her both need someone’s time. They agree who can help and what must wait.',[
 c('accompany','Dara accompanies Maly','Give care the day; use the household’s stored food.','Maly is assessed and begins resting. Dara postpones the repair opportunity.',{supplies:-1,stress:-1},{followup:'care'},'E08',2),
 c('rotate','Sophea offers to take a turn','Sophea accompanies Maly while Vann collects relief.','Maly is assessed. Supplies arrive; Sophea asks for a lighter day afterward.',{supplies:2,water:1},{followup:'rotate'},'E07',2),
 c('neighbor','Ask a trusted neighbor to help with collection','Keep Dara beside Maly and accept practical help.','Maly receives assessment while a neighbor helps collect food. The shared meal will take the next available hours.',{supplies:1,water:2,cohesion:1},{followup:'neighbor'},'E07',3),
 ],'E07','C06',[102.5,14],['C10','E3']),
 s('F01','1980 · a shortage interrupts plans',1980.32,'Khao-I-Dang area, Thailand','The next meal cannot wait',
 'Their supplies are low after earlier decisions. Dara’s learning hour is interrupted by the need to collect food and water. Choose how to cover today before returning to the household’s questions.',[
 c('relief','Spend the day seeking relief','Explain the shortage; assistance does not depend on payment.','A distribution replenishes supplies. The questions about resettlement wait another day.',{supplies:3,water:3},{shortage:'relief'},undefined,2),
 c('exchange','Use a belonging for food and water','Keep time for other tasks at the cost of exchange means.','They agree a modest exchange. Food and water arrive; less remains for later expenses.',{cash:-1,supplies:2,water:2},{shortage:'exchange'}),
 c('meal','Join shared meal preparation','Contribute within their limits and ask for water help.','Vann helps prepare a meal; the household eats and carries water back together.',{supplies:2,water:2,cohesion:1},{shortage:'meal'},undefined,3),
 ],'E08','expanded-camp-work',[102.5,14],['C10'])
);
for(const id of ['T01','F01'])CAMBODIA_SCENES.find(s=>s.id===id).choices.find(c=>c.id==='exchange').requires={cash:1};
export const STORY={id:'cambodia-1979',start:'E01',scenes:CAMBODIA_SCENES};
export const sceneFor=state=>CAMBODIA_SCENES.find(s=>s.id===state.sceneId);
export function callbacks(state){const f=state.flags;return [
 f.contact==='notes'?'Sophea still distinguishes confirmed names from uncertain news.':f.contact?'Questions about relatives remain part of their plans.':null,
 f.theft==='offer'?'The payment that did not recover the bundle makes the household question unsupported promises.':f.theft?'The missing bundle returns to their discussions of sharing supplies and protecting belongings.':null,
 f.work==='repair'?'Dara’s repair exchange helped with resources and cost her rest; it earned no admission priority.':f.work==='meal'?'Vann remembers preparing a shared meal and receiving help in return.':f.work?'The learning hour required shared tasks and resources.':null,
 f.application?'Their resettlement questions did not determine the official decision.':null,
 f.care==='rest'?'They remember making time to rest together rather than treating care as something to earn.':f.care?'The earlier shared-load agreement returns when someone needs a lighter task.':null,
 f.medical==='turns'?'The clinic rotation kept Maly accompanied and left the others tired; later work still needs limits.':f.medical?'They sought help for Maly without turning illness into a test of deserving care.':null,
 f.workLimit==='extra'?'The extra repair brought an exchange and fatigue, not a dependable wage or priority in a queue.':f.workLimit?'Dara’s limit on extra work is carried into the household schedule.':null,
 state.elapsed>20?'Many planning turns have accumulated. They agree to leave some ordinary tasks for later rather than assume everyone can keep working.':null,
 ].filter(Boolean);}
export const CAMBODIA={id:STORY.id,title:'A Place for Tomorrow',sources:CAMBODIA_SOURCES,history:{place:'Western Cambodia → Khao-I-Dang → Long Beach',era:'1979–1982 · optional parallel chapter 1985',historicalSummary:'A fictional four-person household in the aftermath of genocide, seeking refuge and later rebuilding in Long Beach. Camp reception, sponsorship and U.S. admission are separate matters.',fictionalPremise:'All four survive. U.S. admission in this branch is an authored premise, independent of choices. Resources describe fictional household circumstances, not historical measurements or eligibility.',familyStakes:'Dara, Vann, Maly and Sophea have distinct aims, skills and limits. All four survive; admission in 1981 is an invented case outcome independent of player choices. A later optional chapter in 1985 concerns friends at border camps, not this household’s route.',contentNote:CONTENT_NOTE,sourceIds:['C1','C3','C5','C6','C10','E1','E2','E3','E4','E5'],timeline:[{date:'21 November 1979',kind:'Historical anchor',text:'Khao-I-Dang opens. The household’s December arrival is fictional.',sourceId:'C5'},{date:'1981–1982',kind:'Authored continuation',text:'This household receives U.S. admission and rebuilds in Long Beach. Their choices do not earn approval.'},{date:'January–March 1985',kind:'Separate later context',text:'Site One and Site Two are distinct border-camp contexts. The optional fictional letters do not move the household out of California.',sourceId:'E4'}]}};
