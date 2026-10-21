import {useState,useRef} from 'react';
import './cambodiaTravelControls.css';
import {Clock,ArrowRight,ForkKnife} from '@phosphor-icons/react';

// One control flow for both existing layouts. Selections remain drafts until commit.
export function CambodiaTravelPlanner({game,onChoose}){
 const [personId,setPerson]=useState(null),[paceId,setPace]=useState(null);
 const paceRefs=useRef({});
 const model=game.controlModel,selected=model.leads.find(p=>p.personId===personId&&!p.unavailable),pace=model.paces.find(p=>p.id===paceId);
 return <section className="cinematic-travel-planner cambodia-travel-controls" aria-label="Plan this travel leg">
  <header><Clock aria-hidden="true"/><span><small>{model.pendingLeg.title}</small><strong>Assign a family coordinator, then choose the pace</strong></span></header>
  <p>Pace changes actual elapsed travel days. Food and clean water are used each travel day. An empty store adds fatigue and strain; it does not prevent seeking help.</p>
  <section className="cinematic-travel-leadership" aria-label="Assign a family coordinator"><div className="cinematic-travel-step"><small>Step 1 · Family role</small><strong>Who will coordinate this leg?</strong><span>Current health and conditions affect availability; cohesion affects how strongly a role helps.</span></div>
   <div className="cinematic-travel-leads" role="group" aria-label="Choose a traveler to coordinate the leg">{model.leads.map(p=><button className={personId===p.personId?'selected':''} key={p.personId} type="button" disabled={!!p.unavailable} aria-pressed={personId===p.personId} onClick={()=>{setPerson(p.personId);setPace(null);}}><span><strong>{p.name}</strong><small>{p.unavailable??p.roleTitle}</small><small>{p.hint}</small></span></button>)}</div>
  </section>
  <div className="cinematic-travel-step"><small>Step 2 · Travel pace</small><strong>{selected?`${selected.name} will coordinate. Choose a travel strategy.`:'Choose a family coordinator to unlock the strategies.'}</strong></div>
  <div className="cinematic-travel-strategies">{model.paces.map(p=><button ref={el=>{paceRefs.current[p.id]=el;}} key={p.id} type="button" disabled={!selected} aria-pressed={paceId===p.id} onClick={()=>setPace(p.id)}><small>{p.days} actual travel {p.days===1?'day':'days'}</small><strong>{p.title}</strong><span>{p.hint}</span></button>)}</div>
  {selected&&pace&&<section className="cinematic-travel-step" aria-label="Review travel plan"><strong>{selected.name} · {pace.title} · {pace.days} travel {pace.days===1?'day':'days'}</strong><p>Committing records this assignment, time and supply use once. Exact condition and role changes appear afterward.</p><button type="button" className="continue-button" onClick={()=>onChoose(pace.id,selected.personId)}>Commit travel plan<ArrowRight aria-hidden="true"/></button><button type="button" className="back-button" onClick={()=>{setPace(null);paceRefs.current[paceId]?.focus();}}>Keep thinking about this leg</button></section>}
 </section>;
}
export function CambodiaResupply({game,onBuy}){
 const model=game.controlModel;if(!model?.stop||game.phase!=='decision')return null;
 const units=game.resourceContext.label==='Household budget units'?'budget':'exchange';
 return <details className="cinematic-optional-actions cambodia-resupply-controls" key={`resupply-${game.eventId}`}><summary><span><small>Optional before choosing</small><strong>Resupply · {model.stop.title}</strong></span><ForkKnife aria-hidden="true"/></summary>
  <div className="cinematic-optional-list"><p>{model.stop.detail}</p><p>Available: {game.resources.cash} {units} units. Each allocation can be collected once at this stop; food and water capacity is 12 units each.</p>
  {model.supplies.map(item=><button key={item.id} disabled={!!item.unavailable} onClick={()=>onBuy(item.id)}><span><strong>{item.title}</strong><small>{item.unavailable??`${item.cost} ${units} units · ${Object.entries(item.effects).map(([k,v])=>`${k==='supplies'?'food':'water'} +${v} units (up to capacity)`).join(' · ')}`}</small></span><ArrowRight aria-hidden="true"/></button>)}
  {game.cambodiaState.purchases.filter(p=>p.sceneId===game.eventId).map(p=><p role="status" key={p.itemId}>{p.title} recorded: {p.cost} {units} units used; {Object.entries(p.amounts).map(([k,v])=>`${k==='supplies'?'food':'water'} +${v}`).join(', ')}.</p>)}
  </div></details>;
}
