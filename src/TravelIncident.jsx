import {
  ArrowRight,
  ClockCountdown,
  FirstAidKit,
  PersonSimpleWalk,
  Pill,
} from "@phosphor-icons/react";
import {
  getPeople,
  getPortraitImage,
  getTravelIncidentOptions,
} from "./game.js";
import "./travelIncident.css";

const responseIcons = {
  medicine: Pill,
  rest: ClockCountdown,
  continue: PersonSimpleWalk,
};

export function TravelIncident({ game, onResolve }) {
  const incident = game.pendingIncident;
  if (!incident) return null;

  const person = getPeople(game).find((traveler) => traveler.id === incident.personId);
  const personState = game.people[incident.personId];
  const options = getTravelIncidentOptions(game);
  const firstAvailableId = options.find((option) => !option.unavailable)?.id;
  if (!person || !personState) return null;

  return (
    <div className="travel-incident-backdrop">
      <section className={`travel-incident-modal ${incident.kind}`} role="dialog" aria-modal="true" aria-labelledby="travel-incident-title">
        <span className="travel-incident-symbol"><FirstAidKit weight="duotone" aria-hidden="true" /></span>
        <small>Unexpected event · Day {incident.startedDay}</small>
        <h2 id="travel-incident-title">{person.name}: {incident.title}</h2>
        <p>{incident.summary}</p>

        <div className="travel-incident-patient">
          <img src={getPortraitImage(person, personState, game.resources.stress, game)} alt="" style={{ objectPosition: person.focus }} />
          <span>
            <small>Needs care before the next decision</small>
            <strong>{person.name} · {personState.health}% health</strong>
            <em>Health -{incident.healthLoss} · Group stress increased</em>
          </span>
          <span className="travel-incident-medicine"><Pill weight="fill" aria-hidden="true" /><strong>{game.resources.medicine}</strong><small>medicine</small></span>
        </div>

        <div className="travel-incident-options" aria-label="Care options">
          {options.map((option) => {
            const Icon = responseIcons[option.id];
            return (
              <button
                className={option.tone}
                key={option.id}
                onClick={() => onResolve(option.id)}
                disabled={Boolean(option.unavailable)}
                data-sound={option.tone === "danger" ? "warning" : "choice"}
                autoFocus={option.id === firstAvailableId}
              >
                <Icon weight={option.id === "medicine" ? "fill" : "duotone"} aria-hidden="true" />
                <span>
                  <strong>{option.title}</strong>
                  <small>{option.unavailable ?? option.hint}</small>
                  <em>{option.consequence}</em>
                </span>
                <ArrowRight weight="bold" aria-hidden="true" />
              </button>
            );
          })}
        </div>

        <p className="travel-incident-note">Symptoms are not a diagnosis. Medicine represents basic symptom relief or first aid, not a guaranteed cure.</p>
      </section>
    </div>
  );
}
