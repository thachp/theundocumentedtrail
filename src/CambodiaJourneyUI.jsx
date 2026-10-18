import { HouseholdEditionNotice } from './HouseholdEditionNotice.jsx';
import { cambodiaEdition, backCambodiaEdition } from './cambodiaEdition.js';
import { isAuthoredJourney } from "./authoredJourney.js";
import { AuthoredJourneyContext } from "./AuthoredJourneyUI.jsx";
import { useEffect, useRef } from "react";
import { CAMBODIA_SCENES, CAMBODIA_SOURCES, STORY_NOTICE, CONTENT_NOTE, callbacks, sceneFor } from "./cambodiaStory.js";
import { backCambodiaJourney } from "./cambodiaJourney.js";
import "./cambodiaJourney.css";

export function CambodiaResources({game}) {
 const p=game.planning;
 return <section className="cambodia-resources" aria-label="Household planning resources"><div><strong>{p.time}/4</strong><span>Planning time</span></div><div><strong>{p.energy}/4</strong><span>Energy</span></div><div><strong>{Object.keys(game.flags).length}</strong><span>Choices carried forward</span></div><p>Authored planning units for this scene, not historical quantities. Survival and legal outcomes follow authored story premises, independent of choices.</p></section>;
}
export function CambodiaJourneyContext({game,onChange}) {
 if(isAuthoredJourney(game))return <AuthoredJourneyContext game={game} onChange={onChange} />;
 const {sceneFor,STORY_NOTICE,CONTENT_NOTE,callbacks,CAMBODIA_SOURCES}=cambodiaEdition(game);
 const scene=sceneFor(game.cambodiaState);
 return <section className="cambodia-journey-context" aria-label="Historical journey context"><HouseholdEditionNotice game={game} onChange={onChange} /><p><strong>{STORY_NOTICE}</strong></p><p>Illustrative fictional imagery · {scene.date}. {CONTENT_NOTE}</p>{game.saveWarning&&<p role="status">{game.saveWarning}</p>}<details><summary>Planning model, scene summary &amp; earlier choices</summary><p>{game.planning.limit}</p><p>{scene.summary}</p>{callbacks(game.cambodiaState).map((text,i)=><p key={i}>{text}</p>)}</details><button type="button" disabled={!game.cambodiaState.history.length} onClick={()=>onChange(backCambodiaEdition)}>Back to the previous choice</button>
 {scene.id==="C06"&&<details><summary>Other people’s camp experiences · separate testimony</summary><p>Monoram Hang recalled camp access in 1985; Thaly Chhour described disruption and movement between camps. These are different people's retrospective accounts, not Dara's biography, a universal camp policy or endorsements.</p><a href={CAMBODIA_SOURCES.C7.url} target="_blank" rel="noreferrer">Monoram Hang’s labeled transcript (new tab)</a><br/><a href={CAMBODIA_SOURCES.C8.url} target="_blank" rel="noreferrer">Thaly Chhour’s labeled transcript (new tab)</a></details>}</section>;
}
export function CambodiaPersonDialog({person,onClose}) {
 const ref=useRef(null);
 useEffect(()=>{const previous=document.activeElement;ref.current.showModal();return()=>{ref.current?.close();if(previous?.isConnected)previous.focus();};},[]);
 return <dialog className="cambodia-person-dialog" ref={ref} onCancel={onClose} aria-labelledby="cambodia-person-title"><button onClick={onClose}>Close</button><h2 id="cambodia-person-title">{person.name}</h2><p>{person.story}</p><p>Health and mortality are not measured for this historical household. They survive as an authored premise.</p></dialog>;
}
