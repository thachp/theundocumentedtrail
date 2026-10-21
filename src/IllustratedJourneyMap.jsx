import { Compass, MapPin, Clock } from '@phosphor-icons/react';
import { JourneyMap } from './JourneyMap.jsx';
import { getEvent, getFamilyPreset } from './game.js';
import { getJourneyDate } from './journeyHistory.js';
import { cambodiaIllustratedLocation } from './cambodiaIllustratedLocations.js';
import './cambodiaIllustratedMap.css';

export function IllustratedJourneyMap({ game }) {
  const event = getEvent(game);
  const family = getFamilyPreset(game);
  const cambodia = game.familyId === 'cambodia-1979' && game.householdEdition === 3;
  const location = cambodia ? cambodiaIllustratedLocation(game) : null;
  const map = location ? {...location,src:`/assets/cambodia/${location.image}`} : {
    id:`${family.id}:${event.id}`,label:event.region,
    src:family.id==='ramirez'?family.mapImage:`/assets/journey-maps/${family.id}.png`,
    alt:`Scenic parchment illustration for ${family.name}: ${family.journey}. A fictional symbolic journey, not an exact geographic route or a guarantee of arrival.`,
  };
  return <section className="illustrated-journey-map" aria-label={`Illustrated journey · ${map.label}`} data-map-location={map.id} data-map-family={game.familyId}>
    <img key={map.id} className="illustrated-route-art" src={map.src} alt={map.alt} decoding="async" />
    <div className="illustrated-map-date"><Clock aria-hidden="true"/><span><strong>{getJourneyDate(game)}</strong><small>Day {game.day} · {event.weather}</small></span></div>
    <div className="illustrated-map-progress"><strong>Journey progress <span>{game.progress}%</span></strong><progress max="100" value={game.progress} aria-label="Journey progress"/></div>
    <div className="illustrated-map-current"><MapPin weight="fill" aria-hidden="true"/><span><small>Current location</small><strong>{event.region}</strong><em>{event.location}</em></span></div>
    <div className="illustrated-map-caption"><Compass aria-hidden="true"/>Illustrated journey · symbolic route</div>
    <details className="illustrated-map-geography"><summary>Geographic map &amp; visited itinerary</summary><JourneyMap game={game} /></details>
  </section>;
}
