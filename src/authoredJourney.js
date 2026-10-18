import { authoredStory } from './authoredStories.js';
export const isAuthoredJourney = game => Boolean(authoredStory(game));
export const storyScene = game => authoredStory(game)?.scenes[game.storyState.index];
export const storyHero = (story,id='cover') => `${story.assetRoot??`/assets/${story.id}`}/${id}.webp`;
export function storyFamily(story) {
 const cover=storyHero(story);
 return {id:story.id,name:story.name,shortName:story.shortName,origin:story.origin,context:story.historicalSummary,journey:story.route,destination:'Continuing life',startEventId:story.scenes[0].id,startRoute:'elmstead',heroImage:cover,portraitStrips:{healthy:cover,strained:cover,critical:cover},portraitSheet:{width:1672,height:941},people:story.people.map(([id,name,age,pronouns,skills,description],i)=>({id,name,age,pronouns,skills,image:cover,portraitViewBox:story.portraits?.[id]?.viewBox??['595 90 490 700','80 60 570 750','1040 210 430 620'][i],portraitSheet:story.portraits?.[id]?{width:story.portraits[id].width,height:story.portraits[id].height}:undefined,portraitImage:story.portraits?.[id]?.image,story:`${description} An invented person, not a real survivor’s biography.`}))};
}
export function storyCallbacks(game) {
 const story=authoredStory(game);
 return story.callbacks.filter(c=>game.storyState.index>=c.scene).map(c=>c.texts[game.storyState.flags[c.flag]]).filter(Boolean);
}
export function authoredGame(story,state={index:0,phase:'decision',history:[],flags:{}},meta={}) {
 const scene=story.scenes[state.index],entry=state.history.find(h=>h.sceneId===scene.id),choice=scene.choices.find(c=>c.id===entry?.choiceId),cost=choice?.cost??[0,0];
 const game={version:14,householdEdition:story.edition??2,familyId:story.id,journeyKind:'historical',runId:meta.runId??`new-${story.id}`,saveRevision:meta.saveRevision??0,saveWritable:meta.saveWritable!==false,saveWarning:meta.saveWarning??'',storyState:state,phase:state.phase,status:state.phase==='ended'?'won':'playing',eventId:scene.id,day:state.index+1,progress:Math.round(state.history.length/story.scenes.length*100),route:'elmstead',resources:{cash:0,supplies:0,water:0,medicine:0,battery:0,stress:0,exposure:0},planning:{time:4-cost[0],energy:4-cost[1],capacity:4,limit:`Fictional planning units for this scene, not historical prices, nutrition, probabilities or eligibility. Later scenes are new planning occasions. ${story.premise}`},people:Object.fromEntries(story.people.map(p=>[p[0],{health:100,trust:3,alive:true}])),losses:[],flags:state.flags,history:state.history.map((h,i)=>{const s=story.scenes[i],c=s.choices.find(c=>c.id===h.choiceId);return {eventId:s.id,choiceId:c.id,choiceTitle:c.title,outcomeTitle:c.consequence,location:s.place,day:i+1,date:s.date};}),activityLog:[],relationshipNotes:{},relationshipHistory:[],storyThreads:{},storyThreadHistory:[],completedRoadsideWork:{},supplyPurchases:[],resolvedSocialFeeds:{},socialClimate:50,lastRoadsideOutcome:null,lastSocialOutcome:null,pendingIncident:null,incidentHistory:[],incidentCooldown:0,incidentDryStreak:0,pendingNext:null,pendingEnding:null,currentOutcome:null,ending:null,notice:story.notice};
 const callbacks=storyCallbacks(game);game.storyThreads=Object.fromEntries(callbacks.map((summary,i)=>[i,{id:String(i),title:'Earlier choice',summary,status:'active'}]));
 if(choice&&state.phase!=='decision')game.currentOutcome={id:choice.id,title:'After your choice',copy:choice.consequence,tone:'uncertain',days:0,appliedBonuses:[],returningConsequences:[],reactions:[],threadUpdates:[],travelPlan:null,consequence:`Planning time remaining: ${game.planning.time}/4 · Energy remaining: ${game.planning.energy}/4`};
 const ending={type:`${story.id}-continuing-life`,status:'won',title:'Their lives continue beyond the frame',copy:[scene.prose,choice?.consequence,...callbacks].filter(Boolean).join(' ')};
 if(state.phase==='outcome'&&state.index===story.scenes.length-1)game.pendingEnding=ending;
 if(state.phase==='ended')game.ending=ending;
 return game;
}
export function chooseAuthored(game,id) {
 if(game.phase!=='decision')return game;
 const scene=storyScene(game),choice=scene.choices.find(c=>c.id===id);if(!choice)return game;
 return authoredGame(authoredStory(game),{...game.storyState,phase:'outcome',flags:{...game.flags,[choice.flag[0]]:choice.flag[1]},history:[...game.storyState.history,{sceneId:scene.id,choiceId:id}]},game);
}
export function continueAuthored(game) {
 if(game.phase!=='outcome')return game;const story=authoredStory(game),last=game.storyState.index===story.scenes.length-1;
 return authoredGame(story,{...game.storyState,index:game.storyState.index+(last?0:1),phase:last?'ended':'decision'},game);
}
export function backAuthored(game) {
 if(!game.storyState.history.length)return game;
 let next=authoredGame(authoredStory(game),undefined,game);
 for(const h of game.storyState.history.slice(0,-1))next=continueAuthored(chooseAuthored(next,h.choiceId));
 return next;
}
export function authoredEvent(game) {
 const story=authoredStory(game),s=storyScene(game),source=story.sources[s.sourceIds[0]];
 return {id:s.id,region:s.place,location:s.title,time:s.date,weather:'Historical fictional composite',weatherDetail:story.premise,route:'elmstead',contentNote:story.contentNote,heroImage:storyHero(story,s.id),heroFocalPoint:'50% 45%',heroAlt:`Original illustration: ${s.title}, ${s.place}, ${s.date}; fictional ${story.name}, not archival imagery`,source:{label:source.title,url:source.url},messages:[{sender:'Household account',initial:story.people[0][1][0],role:'Authored fictional narrative',body:s.prose}],known:[story.premise,'Choose one option. Exact planning consequences appear afterward.'],assumed:['Choices can earn immigration approval.'],choices:s.choices.map(c=>({...c,hint:c.description,icon:'talk',tone:'uncertain',days:0,route:'elmstead',next:null,effects:{},outcomeTitle:'After this choice',outcome:c.consequence}))};
}
export function authoredHistory(story) {
 return {place:story.route,era:story.period,historicalSummary:story.historicalSummary,familyStakes:`${story.shortName} and their relationships, dates, work and conversations are authored fiction. ${story.premise} ${story.notice}`,contentNote:story.contentNote,sourceIds:Object.keys(story.sources),timeline:story.scenes.map(s=>({kind:'Authored scene · evidence linked separately',date:s.date,text:s.title,sourceId:s.sourceIds[0]}))};
}
