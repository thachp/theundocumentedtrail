import { useEffect, useRef } from "react";
import { X, Pill } from "@phosphor-icons/react";
import { ROUTES, getCondition } from "./game.js";
import { Portrait } from "./Portrait.jsx";

export function DetailDrawer({ person, personState, relationshipNote, route, medicine, stress, familyId, onUseMedicine, onClose }) {
  const drawerRef = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const drawer = drawerRef.current;
    drawer?.querySelector('.drawer-close')?.focus({preventScroll:true});
    const bounds = drawer?.getBoundingClientRect();
    if (bounds && (bounds.top < 0 || bounds.bottom > window.innerHeight)) drawer.scrollIntoView({block:'center',behavior:'instant'});
    const dismiss = event => { if (event.key === 'Escape') { event.preventDefault(); onClose(); } };
    window.addEventListener('keydown', dismiss);
    return () => { window.removeEventListener('keydown', dismiss); if (previous?.isConnected) previous.focus({preventScroll:true}); };
  }, []);
  const selectedRoute = route ? ROUTES[route] : null;
  const condition = personState ? getCondition(personState.health, personState.alive !== false) : null;
  return (
    <div ref={drawerRef} className="detail-drawer" role="dialog" aria-modal="false" aria-label="Planning details">
      <button className="drawer-close" onClick={onClose} aria-label="Close details" data-sound="dismiss"><X weight="bold" /></button>
      {person ? (
        <>
          <Portrait person={person} state={personState} stress={stress} family={familyId} alt={`Portrait of ${person.name}`} />
          <div className="drawer-copy">
            <small>Group member</small>
            <h2>{person.name}</h2>
            <p>{person.story}</p>
            <dl>
              <div><dt>Condition</dt><dd>{personState.alive === false ? condition.label : `${condition.label} · ${personState.health}%`}</dd></div>
              <div><dt>Trust</dt><dd>{personState.trust}/5</dd></div>
              {personState.condition && <div><dt>Current needs</dt><dd>{personState.condition}</dd></div>}
              <div><dt>Strengths</dt><dd>{person.skills.join(" · ")}</dd></div>
            </dl>
            {relationshipNote && (
              <blockquote className="drawer-voice">
                <small>Latest family voice · Day {relationshipNote.day}</small>
                <p>“{relationshipNote.text}”</p>
              </blockquote>
            )}
            {onUseMedicine && <button
              className="drawer-medicine"
              onClick={() => onUseMedicine(person.id)}
              disabled={personState.alive === false || personState.health >= 100 || medicine < 1}
              data-sound="confirm"
            >
              <Pill weight="duotone" />{medicine < 1 ? "No medicine remains" : personState.health >= 100 ? "Health is already full" : `Use medicine · ${medicine} available`}
            </button>}
          </div>
        </>
      ) : (
        <div className="drawer-copy route-detail">
          <small>Route assessment</small>
          <h2>{selectedRoute.title}</h2>
          <p>{selectedRoute.detail}. Reports become less reliable as weather and visibility change.</p>
          <dl>
            <div><dt>Travel window</dt><dd>{selectedRoute.duration}</dd></div>
            <div><dt>Assessment</dt><dd>{selectedRoute.confidence}</dd></div>
          </dl>
        </div>
      )}
    </div>
  );
}

