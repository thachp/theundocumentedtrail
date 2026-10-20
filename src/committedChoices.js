// Within one run, navigation can read progress but cannot change its receipts.
// Explicit restart creates a new run through the existing restart functions.
export function preservesCommittedChoices(before, after) {
 const previous=before.history??[],next=after.history??[];
 if(next.length<previous.length)return false;
 if(previous.some((entry,i)=>entry.choiceId!==next[i]?.choiceId || (entry.sceneId??entry.eventId)!==(next[i]?.sceneId??next[i]?.eventId)))return false;
 const phaseRank={intro:0,scene:1,decision:1,consequence:0,outcome:0,complete:2,ended:2};
 return next.length*3+(phaseRank[after.phase]??0)>=previous.length*3+(phaseRank[before.phase]??0);
}
