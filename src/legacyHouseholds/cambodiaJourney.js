import { CAMBODIA_SCENES, CAMBODIA_SOURCES, STORY_ID, STORY_NOTICE, callbacks, sceneFor } from "./cambodiaStory.js";
import { chooseCambodia, continueCambodia, createCambodiaState, startCambodia } from "./cambodiaState.js";

export const isCambodiaJourney = game => game?.familyId === STORY_ID;
export const CAMBODIA_COVER = "/assets/legacy-households/cambodia/cover.webp";
export const cambodiaHero = id => id === "C03" ? CAMBODIA_COVER : `/assets/legacy-households/cambodia/${id}.webp`;
export const CAMBODIA_FAMILY = {
  id:STORY_ID,name:"Dara, Vann & Maly",shortName:"Dara’s household",origin:"Cambodia · Forced displacement · 1979–1982",
  context:"A fictional Khmer Cambodian household carries relationships and ordinary ambitions through displacement, refuge and rebuilding.",journey:"Cambodia → Thailand → Minnesota",destination:"Continuing life",startEventId:"C01",startRoute:"elmstead",heroImage:CAMBODIA_COVER,
  portraitStrips:{healthy:CAMBODIA_COVER,strained:CAMBODIA_COVER,critical:CAMBODIA_COVER},portraitSheet:{width:1672,height:941},
  people:[
    {id:"dara",name:"Dara",age:"Adult",pronouns:"she/her",skills:["Clothing repair","Design"],image:CAMBODIA_COVER,portraitViewBox:"625 125 330 470",story:"A fictional Khmer Cambodian woman, 24 in late 1979. Clothing repair and design are interests as well as practical skills; admission is not earned by those skills."},
    {id:"vann",name:"Vann",age:"Adult",pronouns:"he/him",skills:["Sharing tasks","Family contact"],image:CAMBODIA_COVER,portraitViewBox:"320 75 350 500",story:"Dara’s younger adult brother. Their conversations, disagreements and shared tasks belong to this invented household, not a real survivor’s biography."},
    {id:"maly",name:"Maly",age:"Adult",pronouns:"she/her",skills:["Household planning","Care"],image:CAMBODIA_COVER,portraitViewBox:"970 155 350 500",story:"Dara and Vann’s aunt. She asks for rest, offers help within her means and has preferences of her own; her needs are not a penalty or test of worth."},
  ],
};

// Authored planning units, never nutrition, currency, historical measurements,
// survival odds or eligibility. Each scene is a different planning occasion.
const allocation={
 C01:{drawing:[1,1],conversation:[1,0]},C02:{summary:[0,0],history:[0,0]},
 C03:{contacts:[2,1],prepare:[1,2]},C04:{rest:[2,-1],share:[1,1]},
 C05:{report:[2,1],neighbor:[1,1]},C06:{support:[2,2],questions:[2,1]},
 C07:{contact:[2,1],practical:[2,1]},C08:{work:[3,2],classes:[3,1]},C09:{memory:[1,0],design:[2,1]},
};
export function cambodiaPlanning(state) {
 const current=sceneFor(state),entry=state.history.find(h=>h.sceneId===state.sceneId);
 const cost=entry?allocation[current.id][entry.choiceId]:[0,0];
 return {time:4-cost[0],energy:Math.min(4,4-cost[1]),timeUsed:cost[0],energyUsed:cost[1],capacity:4,
  retained:Object.values(state.flags),limit:"Fictional planning units for this scene, not historical quantities or a measure of human worth. Later scenes are new planning occasions; survival and 1981 admission remain fixed premises."};
}
export function cambodiaEvent(game) {
 const state=game.cambodiaState,scene=sceneFor(state);
 return {id:scene.id,region:scene.place,location:scene.title,time:scene.date,weather:"Historical fictional composite",weatherDetail:scene.status,route:"elmstead",contentNote:"Non-graphic historical context; survival and admission are authored premises",heroImage:cambodiaHero(scene.id),heroAlt:`Illustration of ${scene.place}, ${scene.date}; fictional household and setting, not an archival image`,source:{label:CAMBODIA_SOURCES[scene.sourceIds[0]].title,url:CAMBODIA_SOURCES[scene.sourceIds[0]].url},
  messages:[{sender:"Household account",initial:"D",role:"Authored fictional narrative",body:scene.prose}],known:[scene.status,"Planning units describe attention and effort, not admission or survival."],assumed:["A helpful act can secure admission or settle another person’s case."],
  choices:scene.choices.map(c=>({...c,hint:c.description,icon:"talk",tone:"uncertain",days:0,route:"elmstead",next:null,effects:{},outcomeTitle:"After this choice",outcome:c.consequence}))};
}
export function cambodiaGame(state,meta={}) {
 const scene=sceneFor(state),index=CAMBODIA_SCENES.indexOf(scene),entry=state.history.at(-1),choice=scene.choices.find(c=>c.id===entry?.choiceId);
 const planning=cambodiaPlanning(state),ending={type:"cambodia_continuing_life",status:"won",title:"Their lives continue beyond the frame",copy:choice?.consequence??scene.summary};
 return {version:14,householdEdition:1,familyId:STORY_ID,journeyKind:"historical",runId:meta.runId??"legacy-cambodia-1979",saveRevision:meta.saveRevision??0,cambodiaState:state,saveWarning:meta.warning??meta.saveWarning??"",saveWritable:(meta.writable??meta.saveWritable)!==false,
 phase:state.phase==="complete"?"ended":state.phase==="consequence"?"outcome":"decision",status:state.phase==="complete"?"won":"playing",eventId:scene.id,day:index+1,progress:Math.round(state.history.length/9*100),route:"elmstead",
 resources:{cash:0,supplies:0,water:0,medicine:0,battery:0,stress:0,exposure:0},planning,people:Object.fromEntries(CAMBODIA_FAMILY.people.map(p=>[p.id,{health:100,trust:3,alive:true}])),losses:[],flags:{...state.flags},
 history:state.history.map(h=>{const s=CAMBODIA_SCENES.find(s=>s.id===h.sceneId),c=s.choices.find(c=>c.id===h.choiceId);return {eventId:s.id,choiceId:c.id,choiceTitle:c.title,outcomeTitle:c.consequence,location:s.place,day:CAMBODIA_SCENES.indexOf(s)+1,date:s.date};}),
 activityLog:[],relationshipNotes:{},relationshipHistory:[],storyThreads:Object.fromEntries(callbacks(state).map((summary,i)=>[i,{id:String(i),title:"Earlier choice",summary,status:"active"}])),storyThreadHistory:[],completedRoadsideWork:{},supplyPurchases:[],resolvedSocialFeeds:{},socialClimate:50,lastRoadsideOutcome:null,lastSocialOutcome:null,pendingIncident:null,incidentHistory:[],incidentCooldown:0,incidentDryStreak:0,
 currentOutcome:state.phase==="consequence"||state.phase==="complete"?{id:choice?.id,title:"After your choice",copy:choice?.consequence,tone:"uncertain",days:0,appliedBonuses:[],returningConsequences:[],reactions:[],threadUpdates:[],travelPlan:null,consequence:`Planning time remaining: ${planning.time}/4 units · Energy remaining: ${planning.energy}/4 units`}:null,
 pendingNext:null,pendingEnding:state.phase==="consequence"&&scene.id==="C09"?ending:null,ending:state.phase==="complete"?ending:null,notice:STORY_NOTICE};
}
export function newCambodiaGame() {return cambodiaGame(createCambodiaState(),{runId:`cambodia-${Date.now()}-${Math.random().toString(16).slice(2)}`});}
export function chooseCambodiaJourney(game,id) {return cambodiaGame(chooseCambodia(game.cambodiaState.phase==="intro"?startCambodia(game.cambodiaState):game.cambodiaState,id),game);}
export function continueCambodiaJourney(game) {return cambodiaGame(continueCambodia(game.cambodiaState),game);}
export function backCambodiaJourney(game) {return game;}
