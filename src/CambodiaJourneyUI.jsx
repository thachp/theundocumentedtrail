import { StatusMetric } from "./StatusMetric.jsx";
import {Drop,ForkKnife,Wallet,BookOpenText,FirstAidKit,Handshake,ShieldWarning,Heartbeat,Clock,Pill,Eye,PencilSimple} from '@phosphor-icons/react';
import { HouseholdEditionNotice } from './HouseholdEditionNotice.jsx';
import { cambodiaEdition } from './cambodiaEdition.js';
import { isAuthoredJourney } from "./authoredJourney.js";
import { AuthoredJourneyContext } from "./AuthoredJourneyUI.jsx";
import { useEffect, useRef } from "react";
import { CAMBODIA_SCENES, CAMBODIA_SOURCES, STORY_NOTICE, CONTENT_NOTE, callbacks, sceneFor } from "./cambodiaStory.js";
import "./cambodiaJourney.css";

export function CambodiaResources({game,variant='planning'}) {
 if(game.householdEdition===3) {
  const metrics=[
   {icon:Wallet,label:game.resourceContext.label==='Household budget units'?'Budget':'Exchange',value:`${game.resources.cash} units`,hint:game.resourceContext.label==='Household budget units'?'Household money available for everyday expenses.':'Belongings and other means available for exchange.',tone:game.resources.cash>0?'safe':'caution'},
   {icon:ForkKnife,label:'Food',value:`${game.resources.supplies} units`,hint:'Food carried by the household.',danger:game.resources.supplies===0},
   {icon:Drop,label:'Water',value:`${game.resources.water} units`,hint:'Clean water carried by the household. Running out adds fatigue and stress.',danger:game.resources.water===0},
   {icon:Pill,label:'Medicine',value:game.resources.medicine,hint:'Carried medicine supplies. Select a traveler to use one supply for 15 health and less stress. Illness and clinic assessment can still require care.',danger:game.resources.medicine===0},
   {icon:ShieldWarning,label:'Stress',value:`${game.resources.stress}%`,hint:'Shared strain. Shortages, travel, rest and care change this percentage.',danger:game.resources.stress>=60,tone:game.resources.stress>=60?'danger':game.resources.stress>=40?'caution':'safe'},
   {icon:Eye,label:'Exposure',value:`${game.resources.exposure}%`,hint:'Exposure to unsafe offers, theft and travel hazards.',danger:game.resources.exposure>=65,tone:game.resources.exposure>=65?'danger':game.resources.exposure>=35?'caution':'safe'},
  ];
  if (variant === 'planning') return <div className="status-strip status-strip-dense" style={{'--resource-count': metrics.length}} aria-label="Household resources">
   {metrics.map(({icon,label,value,hint,danger,tone})=><StatusMetric key={label} icon={icon} label={label} value={value} tooltip={hint} tone={tone??(danger?'danger':'default')} />)}
  </div>;
  return <section className={`cambodia-hud ${variant==='guided'?'cinematic-resources':''}`} style={{'--resource-count':metrics.length}} aria-label="Household resources">
   {metrics.map(({icon:Icon,label,value,hint,danger})=><div key={label} className={`cinematic-status-item${danger?' danger':''}`} aria-label={`${label}: ${value}. ${hint}`} title={hint}>
    <Icon weight="duotone" aria-hidden="true"/><span><small>{label}</small><strong>{value}</strong></span>
   </div>)}
  </section>;
 }
 const p=game.planning;
 return <section className="cambodia-resources" aria-label="Household planning resources"><div><strong>{p.time}/4</strong><span>Planning time</span></div><div><strong>{p.energy}/4</strong><span>Energy</span></div><div><strong>{Object.keys(game.flags).length}</strong><span>Choices carried forward</span></div><p>Authored planning units for this scene, not historical quantities. Survival and legal outcomes follow authored story premises, independent of choices.</p></section>;
}

export function CambodiaJourneyContext({game,onChange}) {
 if(isAuthoredJourney(game))return <AuthoredJourneyContext game={game} onChange={onChange} />;
 const {sceneFor,STORY_NOTICE,CONTENT_NOTE,callbacks,CAMBODIA_SOURCES}=cambodiaEdition(game);
 const scene=sceneFor(game.cambodiaState);
 if(game.householdEdition===3)return <>
  {game.saveWarning&&<p role="status">{game.saveWarning}</p>}
  <CambodiaNarrative game={game} />
 </>;
 return <section className="cambodia-journey-context" aria-label="Historical journey context"><HouseholdEditionNotice game={game} onChange={onChange} /><p><strong>{STORY_NOTICE}</strong></p><p>Illustrative fictional imagery · {scene.date}. {CONTENT_NOTE}</p>{game.saveWarning&&<p role="status">{game.saveWarning}</p>}<details><summary>Planning model, scene summary &amp; earlier choices</summary><p>{game.planning.limit}</p><p>{scene.summary}</p>{callbacks(game.cambodiaState).map((text,i)=><p key={i}>{text}</p>)}</details>
 {scene.id==="C06"&&<details><summary>Other people’s camp experiences · separate testimony</summary><p>Monoram Hang recalled camp access in 1985; Thaly Chhour described disruption and movement between camps. These are different people's retrospective accounts, not Dara's biography, a universal camp policy or endorsements.</p><a href={CAMBODIA_SOURCES.C7.url} target="_blank" rel="noreferrer">Monoram Hang’s labeled transcript (new tab)</a><br/><a href={CAMBODIA_SOURCES.C8.url} target="_blank" rel="noreferrer">Thaly Chhour’s labeled transcript (new tab)</a></details>}</section>;
}
export function CambodiaPersonDialog({person,onClose,game}) {
 const ref=useRef(null);
 useEffect(()=>{const previous=document.activeElement,dialog=ref.current;dialog.showModal();return()=>{dialog.close();if(previous?.isConnected)previous.focus();};},[]);
 return <dialog className="cambodia-person-dialog" ref={ref} onCancel={event=>{event.preventDefault();onClose();}} aria-labelledby="cambodia-person-title"><button onClick={onClose}>Close</button><h2 id="cambodia-person-title">{person.name}</h2><p>{person.story}</p><p>{game?.householdEdition===3?`Health: ${game.people[person.id].health}/100. Cohesion: ${game.people[person.id].trust}/5. ${game.people[person.id].condition??"No current condition reported"}.`:"Health and mortality are not measured for this historical household. They survive as an authored premise."}</p></dialog>;
}

export function CambodiaNarrative({game}) {
 const n=game.narrative;
 if(!n)return null;
 return <section className="cambodia-narrative" aria-label="The household’s story">
  {game.phase==='decision'&&n.memory&&<p className="cambodia-memory"><strong>What stays with them</strong>{n.memory}</p>}
  <details className="cambodia-keepsakes"><summary>What they carry · objects &amp; memories</summary>
   <ul>{n.objects.map(item=><li key={item.id}><span aria-hidden="true">{item.id==='notes'?<BookOpenText/>:item.id==='pot'?<ForkKnife/>:<PencilSimple/>}</span><div><strong>{item.title}</strong><p>{item.text}</p></div></li>)}</ul>
  </details>
 </section>;
}

export function CambodiaEndingReflection({game}) {
 if(!game.ending?.reflections)return null;
 return <section className="cambodia-ending-reflection" aria-label="The life they are making"><h3>The life they are making</h3>{game.ending.reflections.map((text,i)=><p key={i}>{text}</p>)}</section>;
}
