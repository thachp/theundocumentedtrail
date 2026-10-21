// Fictional household dialogue, never testimony. Derived from committed history;
// presentation adds no choices, resource effects, or fields to saved runs.
import { illustratedMapForScene } from '../cambodiaIllustratedLocations.js';

const names = {dara:'Dara',vann:'Vann',maly:'Maly',sophea:'Sophea'};
const beats = {
 E01:['maly','I would like room for the cooking pot. We will still have to eat together.','sophea','And I need time for these names. I do not want a rumor to become the only thing we remember.'],
 E02:['dara','I cannot talk about this place today. Will someone sit with me?','vann','I can take another bundle for a while. Ask me again at the next rest.'],
 E03:['maly','What can we put together for tonight? Let us count what is still here.','sophea','We need food. But that man has given us no reason to believe his promise.'],
 R01:['vann','I want to look for food. I cannot carry for everyone and do that too.','sophea','Then let us ask for what we need, instead of promising more than we can give.'],
 E04:['vann','Waiting is hard. I keep thinking we should already be farther along.','maly','I want us to ask someone we can rely on. Moving is not the same as knowing the way.'],
 T01:['vann','I have repacked this bundle twice. I need something useful to do—or a rest.','maly','First, water. Then we can decide what today can hold.'],
 M01:['vann','Stay with me while we wait. Please tell me what they say, even when the answer is that they do not know yet.','dara','I will stay. We will ask for trained help, and someone else can take the bundles.'],
 M02:['vann','I cannot take the heavier tasks now. I still want a say in how we go on.','maly','Then we will plan around what you need, and share the work differently.'],
 E05:['maly','May I sit while you ask? I want to hear the answer too.','dara','I will come back and tell you. We can leave some questions for tomorrow.'],
 W01:['dara','When we say we will cook, who do we mean? I need a turn sitting down.','vann','I can help prepare the meal. Tell me what needs doing first.'],
 E06:['maly','Stay until I know where I am meant to wait.','dara','I will. We need help with the other tasks today.'],
 H01:['sophea','I can accompany her. Please leave me a quieter task afterward.','maly','Ask me what I can manage before you decide everything for me.'],
 E07:['dara','A repair is something I know how to begin. But I wanted an hour for my own drawing too.','sophea','I want to read. We cannot both keep waiting until every other task is finished.'],
 J01:['dara','Finishing one sleeve does not mean my hands are ready for another.','vann','If you want help, ask me. If you want to stop, we can say that too.'],
 F01:['sophea','I have marked my page. We need something to eat before I return to it.','vann','Let us make a plan for today, then keep that hour in mind.'],
 E08:['sophea','I can put our questions in order. I cannot fill in the names we do not know.','dara','Ask them to explain it again. I want to understand what is still undecided.'],
 E09:['sophea','I do not want leaving to mean losing everyone’s address.','vann','And I want to know what we are carrying. Can we make time for both?'],
 E10:['dara','I want to help with the bills. I also want an hour that belongs to my designs.','maly','Put my name on the timetable too. Ask what I want to do.'],
 E11:['vann','There will still be tasks tomorrow. Which ones can wait?','sophea','Leave some room on the page. We have not finished making plans.'],
 P01:['sophea','This letter comes from another place and another year. Let us read it carefully.','maly','What can we offer without promising something we cannot do?'],
 P02:['dara','I wish an address here could settle everything for our friend. It cannot.','sophea','We can still write back. I will say what we know, and what we do not.'],
};
const ordinary = {
 E01:'Dara smooths the mended sleeve across her knees. Maly tests how the pot fits among the bundles; Vann suggests turning it sideways. For a moment they all have advice about the same small thing.',
 E05:'Near their resting place, someone is trying to make a container stand level. Vann steadies it with a small stone. Maly watches, then points to a flatter one.',
 E07:'Dara folds a scrap into the shape of a pocket. Sophea asks whether it is for a letter. Dara says she has not decided what it is for yet.',
 E10:'At the borrowed table, Vann repeats a new word under his breath. Sophea tries it too. They disagree about the sound, then laugh when neither will give way.',
 E11:'Maly describes a meal she would like them to make. Vann starts a list. Dara draws in the margin until Sophea asks him to leave room for the ingredients.',
};
const chapters = {
 western:{number:1,title:'What they carry',arrival:'Western Cambodia · late 1979',text:'The four are together, but leaving means deciding what can travel with them. Maly wants a pot for shared meals; Sophea wants room for the names of people still missing.'},
 border:{number:2,title:'A day at a time',arrival:'The border region · late 1979',text:'The landscape changes to another stretch of waiting and uncertainty. Vann hopes to move soon. Maly wants reliable assistance before anyone calls a route safe.'},
 camp:{number:3,title:'Making a day together',arrival:'Khao-I-Dang area · December 1979 onward',text:'Shelters, queues, water containers: arrival gives them new routines to learn. They need food and rest now; questions about relatives and the future will take longer.'},
 longBeach:{number:4,title:'Room for tomorrow',arrival:'Long Beach · 1981–1982',text:'A relative shares a table and practical help. Housing, work, learning and belonging now compete for space in the same day.'},
 letters:{number:5,title:'The people still far away',arrival:'Long Beach · 1985 · optional letters',text:'Years pass. The household remains in California. Letters bring news of distinct border-camp circumstances in Site One and Site Two; these are other people’s locations, not another leg of this family’s route.'},
};
const selected = (state,id) => state.history.find(h=>h.sceneId===id)?.choiceId;
const chapterKey = scene => scene.id.startsWith('P')?'letters':illustratedMapForScene(scene).id;

export function carriedObjects(state) {
 const contact=selected(state,'E01'),work=selected(state,'E07'),ending=selected(state,'E11');
 return [
  {id:'notes',title:'Names & correspondence',text:selected(state,'P01')==='news'?'Sophea has prepared a reply with confirmed news and permission to share names.':selected(state,'E09')==='contact'?'Addresses exchanged with permission join the family’s contact notes.':selected(state,'E08')==='relative'?'A letter asks their Long Beach relative about practical help. A reply is still awaited.':selected(state,'E08')==='records'?'Sophea has organized the household’s questions; missing information stays marked as unknown.':contact==='notes'?'Confirmed names are separated from rumors in Sophea’s paper notes.':contact?'Names and unanswered questions travel with them; the notes were not their first preparation priority.':'Sophea is sorting uncertain news of relatives.'},
  {id:'pot',title:'The cooking pot',text:selected(state,'W01')==='share'||work==='meal'?'The shared meals give Maly’s wish for a cooking pot a new meaning: making room for another household.':contact==='food'?'Preparing food together gave Maly’s concern for shared meals the first hours.':'Maly’s wish to bring a cooking pot keeps returning in conversations about meals and home.'},
  {id:'sewing',title:'A sleeve, a pocket, a design',text:ending==='design'?'Dara draws again; Sophea suggests a pocket for a folded letter. The design is still hers to finish.':selected(state,'J01')==='extra'?'An extra repair brought an exchange and left Dara exhausted. Her own design still needs time.':selected(state,'J01')==='limit'?'Dara set a limit on further repairs, protecting time to rest.':work==='repair'?'Dara completed the neighbor’s repair and asked others to take the evening tasks.':work==='learning'?'Dara sketched a pocket while Maly rested and Sophea read.':'Dara’s mended sleeve is the first sign of a skill—and an interest—that belongs to her.'},
 ];
}

export function narrativeFor(story,state) {
 const scene=story.scenes.find(s=>s.id===state.sceneId),key=chapterKey(scene);
 const prior=state.history.filter(h=>h.sceneId!==scene.id).at(-1);
 const previous=prior&&story.scenes.find(s=>s.id===prior.sceneId);
 const arrival=!previous||chapterKey(previous)!==key;
 const beat=beats[scene.id];
 const voices=[0,2].map(i=>({personId:beat[i],sender:names[beat[i]],initial:names[beat[i]][0],role:'Family conversation',trusted:true,body:beat[i+1]}));
 const memories=[];
 if(['E05','E07','E10'].includes(scene.id)&&selected(state,'M02'))memories.push('Vann asks for a lighter task while his leg recovers. The others make room in the timetable without leaving him out of the discussion.');
 if(['E04','T01'].includes(scene.id)&&selected(state,'E02')==='bundles')memories.push('Vann shifts the heavier bundle he took earlier. This time, he asks who can take a turn before they move again.');
 if(['E07','J01','E10'].includes(scene.id)&&selected(state,'E06')==='turns')memories.push('Dara and Vann remember taking turns at the clinic. Neither wants the next timetable to depend on the same two people always being available.');
 if(scene.id==='E08'&&selected(state,'E01')==='notes')memories.push('Sophea opens the notes she protected before departure. Some names are clear; the gaps are still there. She leaves them visible.');
 if(scene.id==='E08'&&selected(state,'E03')==='offer')memories.push('After the payment that did not recover their bundle, they ask what can actually be verified before trusting another promise.');
 if(['E10','E11'].includes(scene.id)&&selected(state,'J01')==='extra')memories.push('Dara remembers the extra repair that left her exhausted. She asks for a timetable with a stopping point.');
 if(scene.id==='E11'&&selected(state,'E10')==='classes')memories.push('The learning hour they protected is now on their timetable. Dara asks them to keep it there when the next expenses arrive.');
 if(scene.id==='E11'&&selected(state,'E10')==='community')memories.push('The household’s decision to make time for community help has given them people to ask—and people who ask them in return.');
 return {chapter:chapters[key],arrival,from:previous?.date,voices,memory:memories[0]??null,moment:ordinary[scene.id]??null,objects:carriedObjects(state)};
}

export function choiceReaction(state) {
 const h=state.history.at(-1);if(!h)return null;
 const special={
  'E02:bundles':['vann','I can carry this for now. At the next rest, I need someone to take a turn.'],
  'E06:clinic':['maly','Thank you for staying. Let us ask what happens next before we leave.'],
  'E06:turns':['vann','We managed the turns today. I need a lighter task tomorrow.'],
  'J01:extra':['dara','I have finished. Please do not promise my hands for tomorrow too.'],
  'J01:limit':['dara','The unfinished things can wait while I rest.'],
  'E10:classes':['sophea','Put the hour on our timetable. I want us to remember that we chose it.'],
  'E11:design':['dara','A pocket for a letter. Let me try drawing it another way.'],
  'E11:tomorrow':['maly','Come for a walk with me. We can finish the list afterward.'],
 };
 const beat=special[`${h.sceneId}:${h.choiceId}`];
 // Selected decisions receive a spoken reflection without changing their outcome.
 return beat?{personId:beat[0],personName:names[beat[0]],text:beat[1],narrative:true}:null;
}

export function personalReflection(state) {
 const pieces=[
  selected(state,'E01')==='notes'?'Sophea began by protecting the contact notes. Names stayed separate from rumors; some answers never arrived.':'Sophea still has unanswered questions about relatives. Keeping a relationship alive remains unfinished work.',
  selected(state,'E07')==='repair'?'Dara used her sewing skill to help with household means. '+(selected(state,'J01')==='extra'?'The extra task cost her rest, a limit she carries into later plans.':'She also had to decide how much of her time could be promised.'):'Dara’s own designs still ask for time alongside everyday needs.',
  selected(state,'M02')?'Vann continues to need lighter tasks after his injury. Sharing responsibility now includes listening to what he can manage.':selected(state,'E02')==='bundles'?'Vann took the heavier bundle. Later, sharing responsibility also meant letting him ask for relief.':'Vann’s place in the household includes naming his limits, not only taking on tasks.',
  selected(state,'E06')==='clinic'?'The family made time to accompany Maly for care. Her preferences still belong in tomorrow’s plans.':'Maly’s need for care and her wish to help shape daily life remain part of the household’s plans.',
  selected(state,'E10')==='classes'?'In Long Beach they protected learning time, with a tighter budget.':selected(state,'E10')==='income'?'In Long Beach they gave income planning the first hours, while agreeing Dara could not always be available.':'In Long Beach they made room for reciprocal community help, alongside their own unfinished tasks.',
  selected(state,'E11')==='letter'?'Later letters keep the household connected to people whose futures remain unresolved. They are still in California.':'At their table, there is more life ahead: a design, a meal, a letter, and a day they can plan together.',
 ];
 return pieces;
}

export function characterThreads(state) {
 const choice=id=>selected(state,id);
 return [
  {id:'dara',title:'Dara · room for her own work',summary:choice('E11')==='design'?'Dara returns to her design, with a suggestion for a letter pocket.':choice('E10')==='classes'?'Learning has a protected hour alongside Dara’s design ambitions.':choice('J01')==='extra'?'An extra repair left Dara exhausted; her own work still needs room.':choice('J01')==='limit'?'Dara set a boundary and rested instead of promising another repair.':choice('E07')==='repair'?'Dara finished a repair and asked others to take the evening tasks.':choice('E07')==='learning'?'Dara has sketched a pocket, leaving its purpose open.':'Dara mends clothing and wants space for her own designs.'},
  {id:'vann',title:'Vann · sharing responsibility',summary:choice('M02')?'Vann is recovering from his injury; lighter tasks and a voice in the plan remain important.':choice('M01')?'Vann needs care and companionship while the household reorganizes its tasks.':choice('E11')==='tomorrow'?'Vann names what can wait so the household can rest.':choice('J01')==='share'?'Vann volunteered for part of the repair after naming his limits.':choice('E06')==='turns'?'The clinic rotation left Vann tired; future tasks still need sharing.':choice('W01')==='share'?'Vann took a turn preparing a shared meal, then asked for a break.':choice('E02')==='bundles'?'Vann took a heavier bundle; he will need a turn resting too.':'Vann wants to contribute without becoming the person who must always carry more.'},
  {id:'maly',title:'Maly · care and a say in the day',summary:choice('E11')==='tomorrow'?'Maly asks for a walk together; ordinary companionship belongs in tomorrow too.':choice('E10')?'Maly wants her own preferences included in the household timetable.':choice('H01')?'Maly received assessment with support from family and neighbors.':choice('E06')==='help'?'Maly is still waiting for assessment; coordination is not the same as receiving care.':choice('E06')?'Maly has been accompanied to seek assessment; recovery still needs time.':choice('E01')==='food'?'Maly led food preparation while questions about relatives waited.':'Maly wants shared meals, rest when she needs it, and a say in decisions made around her.'},
  {id:'sophea',title:'Sophea · names, learning and letters',summary:choice('P01')==='news'?'Sophea prepares a careful reply using confirmed news and permission to share names.':choice('E11')==='letter'?'Sophea makes room for a later letter and a friend’s different circumstances.':choice('E10')==='classes'?'Sophea’s learning has an hour on the household timetable.':choice('E09')==='contact'?'Addresses were exchanged with consent before departure.':choice('E08')==='relative'?'A letter asks their Long Beach relative about practical support.':choice('E08')==='records'?'Sophea marks missing information rather than pretending it is known.':choice('E01')==='notes'?'Sophea protected the paper notes, separating confirmed names from rumors.':'Sophea wants news of relatives and time for learning; uncertainty leaves spaces on her page.'},
 ].map(thread=>({...thread,status:'active',updatedDay:state.elapsed}));
}
