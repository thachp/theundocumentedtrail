import { authoredSaveKey, loadAuthoredJourney, restartAuthoredJourney } from './authoredJourneyStore.js';
import { loadCambodiaJourney, restartCambodiaJourney } from './cambodiaJourneyStore.js';
export function HouseholdEditionNotice({game,onChange}) {
 if(game.familyId==='cambodia-1979'){
  const available=[1,2,3].filter(edition=>{try{return edition!==game.householdEdition&&window.localStorage.getItem(`undocumented-trail:review:cambodia-1979:v${edition}`)!==null;}catch{return false;}});
  const names={1:'original three-person',2:'original four-person',3:'expanded four-person'};
  return <aside className="household-edition-notice" aria-label="Saved story edition"><p>{names[game.householdEdition]} edition. Each edition keeps its own save and archives.</p>{available.map(edition=><button key={edition} onClick={()=>onChange(loadCambodiaJourney(undefined,edition))}>Resume {names[edition]} edition</button>)}{game.householdEdition!==3&&!available.includes(3)&&<button onClick={()=>onChange(restartCambodiaJourney())}>Start expanded four-person edition</button>}</aside>;
 }
 let originalAvailable=false,revisedAvailable=false;
 try{revisedAvailable=window.localStorage.getItem(game.familyId==='cambodia-1979'?'undocumented-trail:review:cambodia-1979:v2':authoredSaveKey(game.familyId,2))!==null;originalAvailable=window.localStorage.getItem(game.familyId==='cambodia-1979'?'undocumented-trail:review:cambodia-1979:v1':authoredSaveKey(game.familyId,1))!==null;}catch{}
 const original=game.householdEdition===1;
 if(!original&&!originalAvailable)return null;
 const switchEdition=()=>onChange(game.familyId==='cambodia-1979'?(original?(revisedAvailable?loadCambodiaJourney(undefined,2):restartCambodiaJourney()):loadCambodiaJourney(undefined,1)):(original?(revisedAvailable?loadAuthoredJourney(game.familyId,undefined,2):restartAuthoredJourney(game.familyId)):loadAuthoredJourney(game.familyId,undefined,1)));
 return <aside className="household-edition-notice" aria-label="Saved story edition"><p>{original?'Original three-person edition. Your people, earlier decisions and illustrations remain as they were. The revised four-person edition keeps a separate run; your original save and archives are retained.':'Revised four-person edition. Your original three-person save and archives are retained separately.'}</p><button type="button" onClick={switchEdition}>{original?(revisedAvailable?'Resume revised four-person edition':'Start revised four-person edition'):'Resume original saved edition'}</button></aside>;
}
