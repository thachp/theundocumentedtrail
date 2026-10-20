import {Drop,ForkKnife,Wallet,BookOpenText,FirstAidKit,Handshake,WarningCircle,Clock} from '@phosphor-icons/react';
import {resourceHint} from './cambodiaExpanded/resources.js';
import { HouseholdEditionNotice } from './HouseholdEditionNotice.jsx';
import { cambodiaEdition, backCambodiaEdition } from './cambodiaEdition.js';
import { isAuthoredJourney } from "./authoredJourney.js";
import { AuthoredJourneyContext } from "./AuthoredJourneyUI.jsx";
import { useEffect, useRef } from "react";
import { CAMBODIA_SCENES, CAMBODIA_SOURCES, STORY_NOTICE, CONTENT_NOTE, callbacks, sceneFor } from "./cambodiaStory.js";
import { backCambodiaJourney } from "./cambodiaJourney.js";
import "./cambodiaJourney.css";

export function CambodiaResources({game,variant='planning'}) {
 if(game.householdEdition===3) {
  const people=Object.values(game.people);
  const health=Math.round(people.reduce((sum,p)=>sum+p.health,0)/people.length);
  const cohesion=people.reduce((sum,p)=>sum+p.trust,0)/people.length;
  const metrics=[
   {icon:Drop,label:'Water',value:`${game.resources.water} units`,hint:'Clean water for selected occasions. Empty stores add fatigue and stress.',danger:game.resources.water===0},
   {icon:ForkKnife,label:'Food',value:`${game.resources.supplies} units`,hint:'Carried food for selected occasions, not a count of calendar days.',danger:game.resources.supplies===0},
   {icon:Wallet,label:game.resourceContext.label==='Household budget units'?'Budget':'Exchange',value:`${game.resources.cash} units`,hint:game.resourceContext.description},
   {icon:BookOpenText,label:'Contacts',value:game.flags.contact==='notes'?'Notes kept':'Uncertain',hint:'Paper contact notes help organize later questions. They are not identity documents or a guarantee of safety.'},
   {icon:FirstAidKit,label:'Health',value:`${health}/100`,hint:'Average fictional health units. Read each person’s state through their portrait.',danger:health<55},
   {icon:Handshake,label:'Cohesion',value:cohesion>=4?'Strong':cohesion>=3?'Steady':'Fragile',hint:'Shared trust, with individual values in household notes.'},
   {icon:WarningCircle,label:'Stress',value:`${game.resources.stress}/20`,hint:'Fictional strain units. Shortages can increase strain; this is not a clinical measure.',danger:game.resources.stress>=12},
   {icon:Clock,label:'Turns',value:game.planning.time,hint:'Elapsed authored planning turns, not elapsed days.'},
  ];
  return <section className={`cambodia-hud ${variant==='guided'?'cinematic-resources':''}`} aria-label="Household resources">
   {metrics.map(({icon:Icon,label,value,hint,danger})=><div key={label} className={`cinematic-status-item${danger?' danger':''}`} aria-label={`${label}: ${value}. ${hint}`} title={hint}>
    <Icon weight="duotone" aria-hidden="true"/><span><small>{label}</small><strong>{value}</strong></span>
   </div>)}
  </section>;
 }
 const p=game.planning;
 return <section className="cambodia-resources" aria-label="Household planning resources"><div><strong>{p.time}/4</strong><span>Planning time</span></div><div><strong>{p.energy}/4</strong><span>Energy</span></div><div><strong>{Object.keys(game.flags).length}</strong><span>Choices carried forward</span></div><p>Authored planning units for this scene, not historical quantities. Survival and legal outcomes follow authored story premises, independent of choices.</p></section>;
}

function ExpandedHouseholdNotes({game,onChange,scene,notice}) {
 return <section className="cambodia-journey-context cambodia-compact-context" aria-label="Historical journey context">
  <details>
   <summary>Household notes &amp; resources · Fictional composite</summary>
   <HouseholdEditionNotice game={game} onChange={onChange}/>
   <p>{notice}</p><p>Illustrative fictional household · {scene.date}.</p>
   <p>{resourceHint(game.cambodiaState)}</p><p>{game.resourceContext.label}: {game.resourceContext.description}</p>
   <p>{game.planning.limit} Food and water are occasion units, not liters, days or a simulation of every meal during the intervening months.</p>
   <h3>Carried information &amp; contacts</h3>
   <ul>{game.inventory.map(item=><li key={item}>{item}</li>)}</ul>
   <p>Paper notes and letters need no charge. Names help organize questions; neither contacts nor resource balances can secure admission.</p>
   <ul>{Object.entries(game.people).map(([id,p])=><li key={id}>{id.charAt(0).toUpperCase()+id.slice(1)}: health {p.health}/100 · cohesion {p.trust}/5</li>)}</ul>
  </details>
  {game.saveWarning&&<p role="status">{game.saveWarning}</p>}
  <button type="button" disabled={!game.cambodiaState.history.length} onClick={()=>onChange(backCambodiaEdition)}>Back to the previous choice</button>
 </section>;
}
export function CambodiaJourneyContext({game,onChange}) {
 if(isAuthoredJourney(game))return <AuthoredJourneyContext game={game} onChange={onChange} />;
 const {sceneFor,STORY_NOTICE,CONTENT_NOTE,callbacks,CAMBODIA_SOURCES}=cambodiaEdition(game);
 const scene=sceneFor(game.cambodiaState);
 if(game.householdEdition===3)return <ExpandedHouseholdNotes game={game} onChange={onChange} scene={scene} notice={STORY_NOTICE}/>;
 return <section className="cambodia-journey-context" aria-label="Historical journey context"><HouseholdEditionNotice game={game} onChange={onChange} /><p><strong>{STORY_NOTICE}</strong></p><p>Illustrative fictional imagery · {scene.date}. {CONTENT_NOTE}</p>{game.saveWarning&&<p role="status">{game.saveWarning}</p>}<details><summary>Planning model, scene summary &amp; earlier choices</summary><p>{game.planning.limit}</p><p>{scene.summary}</p>{callbacks(game.cambodiaState).map((text,i)=><p key={i}>{text}</p>)}</details><button type="button" disabled={!game.cambodiaState.history.length} onClick={()=>onChange(backCambodiaEdition)}>Back to the previous choice</button>
 {scene.id==="C06"&&<details><summary>Other people’s camp experiences · separate testimony</summary><p>Monoram Hang recalled camp access in 1985; Thaly Chhour described disruption and movement between camps. These are different people's retrospective accounts, not Dara's biography, a universal camp policy or endorsements.</p><a href={CAMBODIA_SOURCES.C7.url} target="_blank" rel="noreferrer">Monoram Hang’s labeled transcript (new tab)</a><br/><a href={CAMBODIA_SOURCES.C8.url} target="_blank" rel="noreferrer">Thaly Chhour’s labeled transcript (new tab)</a></details>}</section>;
}
export function CambodiaPersonDialog({person,onClose,game}) {
 const ref=useRef(null);
 useEffect(()=>{const previous=document.activeElement,dialog=ref.current;dialog.showModal();return()=>{dialog.close();if(previous?.isConnected)previous.focus();};},[]);
 return <dialog className="cambodia-person-dialog" ref={ref} onCancel={event=>{event.preventDefault();onClose();}} aria-labelledby="cambodia-person-title"><button onClick={onClose}>Close</button><h2 id="cambodia-person-title">{person.name}</h2><p>{person.story}</p><p>{game?.householdEdition===3?`Fictional health units: ${game.people[person.id].health}/100. Cohesion: ${game.people[person.id].trust}/5. These describe authored circumstances, not medical measurements or worth. All four survive as a story premise.`:"Health and mortality are not measured for this historical household. They survive as an authored premise."}</p></dialog>;
}
