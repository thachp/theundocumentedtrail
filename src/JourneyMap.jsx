import { useId } from "react";
import { getJourneyGeography, MAP_SIZE, projectCoordinate } from "./journeyGeography.js";
import land from "./mapLand.json";
import { getJourneyDate } from "./journeyHistory.js";
import "./journeyMap.css";

export function JourneyMap({ game, compact = false, fitViewport = false, geography }) {
  const id = useId();
  const model = geography ?? getJourneyGeography(game);
  const { family, bounds, itinerary, current, points } = model;
  const path = (ring) => ring.map((coordinate, i) => `${i ? "L" : "M"}${projectCoordinate(coordinate, bounds).map((n) => n.toFixed(2)).join(",")}`).join(" ") + "Z";
  const currentPoint = points.at(-1);
  const same = (a, b) => a[0] === b[0] && a[1] === b[1];
  const uniquePoints = points.filter((point, index) => points.findIndex((other) => same(point, other)) === index);
  const itineraryList = <ol tabIndex="0" aria-label="Visited story locations">{itinerary.map((entry, index) => <li key={`${entry.eventId}-${index}`} aria-current={index === itinerary.length - 1 ? "location" : undefined}>
    <strong>{entry.label}{index === itinerary.length - 1 ? " · Current" : ""}</strong>
    <span>{entry.storyLocation} — {entry.region}</span>
    <small>{entry.uncertainty}</small>
  </li>)}</ol>;
  const mapKey = <div className="journey-map-key"><span><i />Current</span><span><i />Visited</span><span><i />Story connection</span></div>;
  const mapNote = <p className="journey-map-note">{model.note ?? "Dashed connections show story order, not exact roads, flights or sea tracks. Unspecified places use regional anchors."}</p>;
  const mapCredit = <a className="journey-map-credit" href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noreferrer">Land: Natural Earth · Equirectangular projection</a>;
  return (
    <figure className={`journey-map ${compact ? "journey-map-compact" : ""} ${fitViewport ? "journey-map-fit" : ""}`} data-family={family.id} data-event={current.eventId}>
      <figcaption>
        <span>{family.shortName} · {model.dateLabel ?? getJourneyDate(game)}</span>
        <strong>{current.label}</strong>
        <small>{current.uncertainty}</small>
      </figcaption>
      <svg className="journey-map-canvas" viewBox={`0 0 ${MAP_SIZE.width} ${MAP_SIZE.height}`} preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby={`${id}-title ${id}-description`}>
        <title id={`${id}-title`}>{`${family.name}: ${current.label}`}</title>
        <desc id={`${id}-description`}>North is up. Approximate event locations joined in visited story order. Current location: {current.label}. {current.uncertainty}. Read the text itinerary below.</desc>
        <defs><pattern id={`${id}-grid`} width="50" height="50" patternUnits="userSpaceOnUse"><path d="M50 0H0V50" fill="none" stroke="#45675f" strokeOpacity=".12" /></pattern></defs>
        <rect width="600" height="500" fill={`url(#${id}-grid)`} />
        <g className="journey-map-land" aria-hidden="true">{land[model.landKey ?? family.id].map((country) => <path key={country.name} d={country.rings.map(path).join(" ")} />)}</g>
        <g className="journey-map-traveled" aria-hidden="true">
          <polyline points={points.map((point) => point.join(",")).join(" ")} />
          {uniquePoints.map(([x, y], index) => <circle key={`${x}-${y}`} cx={x} cy={y} r="5"><title>{`Visited location ${index + 1}`}</title></circle>)}
        </g>
        <g className="journey-map-current" transform={`translate(${currentPoint.join(",")})`} data-longitude={current.coordinates[0]} data-latitude={current.coordinates[1]}>
          <circle r="12" /><circle r="5" /><title>{`Current: ${current.label} (approximate)`}</title>
        </g>
        <g className="journey-map-north" aria-hidden="true"><path d="M562 57V24m-7 9 7-10 7 10" /><text x="562" y="76">N</text></g>
        <text className="journey-map-watermark" x="18" y="480">APPROXIMATE · NOT FOR NAVIGATION</text>
      </svg>
      {fitViewport ? (
        <details className="journey-map-itinerary journey-map-information" key={family.id}>
          <summary>Text itinerary and map key · {itinerary.length} {itinerary.length === 1 ? "stop" : "stops"}</summary>
          {mapKey}{mapNote}{itineraryList}{mapCredit}
        </details>
      ) : <>
        {mapKey}{mapNote}
        <details className="journey-map-itinerary" key={`${family.id}-${compact}`}>
          <summary>Text itinerary · {itinerary.length} {itinerary.length === 1 ? "stop" : "stops"}</summary>
          {itineraryList}
        </details>
        {mapCredit}
      </>}
    </figure>
  );
}
