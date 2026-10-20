import { loadCambodiaJourney } from "./cambodiaJourneyStore.js";
import { authoredStory } from "./authoredStories.js";
import { storyHero } from "./authoredJourney.js";
import { loadAuthoredJourney } from "./authoredJourneyStore.js";
import { useEffect, useRef, useState } from "react";
import { ArrowCounterClockwise, ArrowLeft, ArrowRight, MapPin, X } from "@phosphor-icons/react";
import { FAMILY_PRESETS } from "./game.js";
import { getJourneyChoices, journeyKeyIndex, scrollJourneyCard } from "./journeyChoices.js";
import "./beginner.css";

const chooserSummary = {
  ramirez: 'A family leaves gang threats in January 2024 for an uncertain U.S. border process.',
  haddad: 'War disrupts work and school as the family leaves Aleppo in July 2015.',
  diop: 'Two brothers and two cousins leave shrinking livelihoods and family debt.',
  nguyen: 'A promised British job hides recruitment debt and an uncertain route.',
  punjab: 'Four relatives question changing fees and promised Irish work permits.',
  rohingya: 'A family weighs shrinking aid against a dangerous route toward Aceh.',
  'cambodia-1979': 'Four relatives manage scarce supplies, refuge and rebuilding in Long Beach.',
};

export function FamilySelection({ currentFamilyId, required, saves, archive, onSelect, onRestart, onClose, mode = "guided" }) {
  const families = getJourneyChoices(import.meta.env);
  const initialIndex = Math.max(0, families.findIndex((family) => family.id === currentFamilyId));
  const carouselRef = useRef(null);
  const dialogRef = useRef(null);
  const headingRef = useRef(null);
  const [carouselIndex, setCarouselIndex] = useState(initialIndex);

  const scrollToFamily = (index, behavior = "smooth", focus = false) => {
    const nextIndex = scrollJourneyCard(carouselRef.current, index, { behavior, focus, reducedMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches });
    if (nextIndex !== null) setCarouselIndex(nextIndex);
  };

  useEffect(() => {
    const previous = document.activeElement;
    const dialog = dialogRef.current;
    dialog.showModal();
    headingRef.current?.focus({ preventScroll: true });
    return () => { dialog.close(); if (previous?.isConnected) previous.focus(); };
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => scrollToFamily(initialIndex, "auto"));
    return () => cancelAnimationFrame(frame);
  }, [currentFamilyId]);

  const updateCarouselIndex = () => {
    const rail = carouselRef.current;
    if (!rail) return;
    const center = rail.scrollLeft + (rail.clientWidth / 2);
    const nextIndex = [...rail.children].reduce((closest, card, index) => {
      const cardCenter = card.offsetLeft + (card.clientWidth / 2);
      return Math.abs(cardCenter - center) < closest.distance
        ? { index, distance: Math.abs(cardCenter - center) }
        : closest;
    }, { index: 0, distance: Number.POSITIVE_INFINITY }).index;
    setCarouselIndex(nextIndex);
  };

  const handleCarouselKeys = (event) => {
    const nextIndex = journeyKeyIndex(event.key, carouselIndex, families.length);
    if (nextIndex === null) return;
    event.preventDefault();
    scrollToFamily(nextIndex, "smooth", true);
  };

  return (
    <dialog ref={dialogRef} className="cinematic-family-backdrop" aria-labelledby="family-selection-title" onCancel={event => { event.preventDefault(); if (!required) onClose(); }}>
      <section className="cinematic-family-dialog">
        {!required && <button className="cinematic-work-close" onClick={onClose} aria-label="Close family selection" data-sound="dismiss"><X weight="bold" /></button>}
        <small>Choose a journey</small>
        <h2 id="family-selection-title" tabIndex="-1" ref={headingRef}>Whose road will you follow?</h2>
        <p>Choose a family journey. Each keeps its own progress, so you can safely return later.</p>
        <div className="cinematic-family-carousel">
          <div className="cinematic-family-carousel-controls">
            <span aria-live="polite"><strong>{carouselIndex + 1} of {families.length}</strong><small>Swipe or use arrows · Home/End: first/last</small></span>
            <div>
              <button onClick={() => scrollToFamily(carouselIndex - 1)} disabled={carouselIndex === 0} aria-label="Previous journey" data-sound="tap"><ArrowLeft weight="bold" /></button>
              <button onClick={() => scrollToFamily(carouselIndex + 1)} disabled={carouselIndex === families.length - 1} aria-label="Next journey" data-sound="tap"><ArrowRight weight="bold" /></button>
            </div>
          </div>
          <div
            className="cinematic-family-options"
            ref={carouselRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Journey choices"
            tabIndex="0"
            onScroll={updateCarouselIndex}
            onKeyDown={handleCarouselKeys}
          >
          {families.map((family, index) => {
            if (family.kind === "authored-household") {
              const saved=loadAuthoredJourney(family.id);
              const started=saved.storyState.history.length>0;
              return <article className="cinematic-family-card" key={family.id} role="group" aria-roledescription="slide" aria-label={`${index+1} of ${families.length}: ${family.name} · ${family.period}`}><div className="cinematic-family-portrait"><img src={storyHero(authoredStory(saved))} alt={`Original illustration of the fictional household · ${family.name}`} /><span>{saved.phase==='ended'?'Completed':started?`In progress · Scene ${saved.day}`:'Not started'} · {family.period}</span></div><div className="cinematic-family-copy"><small>{family.origin}</small><strong>{family.name}</strong><p>{chooserSummary[family.id] ?? family.context}</p><em><MapPin weight="fill" />{family.journey}</em><p>{saved.householdEdition===1?"Original three-person save · Revised four-person edition available inside":"Four-person journey · Separate saved progress"}</p></div><div className="cinematic-family-actions"><button className="continue" onClick={()=>onSelect(family.id)}>{saved.phase==='ended'?'View result':started?'Continue':'Start journey'}<ArrowRight weight="bold" /></button>{started&&onRestart&&<button className="restart" onClick={()=>onRestart(family.id)}><ArrowCounterClockwise weight="bold" />Start again</button>}</div></article>;
            }
            if (family.kind === "historical") {const saved=loadCambodiaJourney();return <article className="cinematic-family-card" key={family.id} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${families.length}: Cambodia · ${family.name} · ${family.period}`}>
              <div className="cinematic-family-portrait"><img src={saved.householdEdition===1?"/assets/legacy-households/cambodia/cover.webp":"/assets/cambodia/cover.webp"} alt={saved.householdEdition===1?"Original fictional household: Dara, Vann and Maly":"Illustrative fictional household: Dara, Vann, Maly and Sophea in late-1979 Cambodia"} /><span>Family journey · {saved.householdEdition===3?"1979–1982 · optional 1985 chapter":"1979–1982"}</span></div>
              <div className="cinematic-family-copy"><small>{family.origin}</small><strong>{family.name}</strong><p>{chooserSummary[family.id] ?? family.context}</p><em><MapPin weight="fill" />{family.journey}</em></div><div className="cinematic-family-actions"><a className="continue" href={mode === "full" ? `${family.href}&mode=full` : family.href}>Open Cambodian story<ArrowRight weight="bold" /></a></div>
            </article>;}
            const saved = saves[family.id];
            const savedStatus = saved?.phase === "ended"
              ? `${saved.status === "won" ? "Completed" : "Journey stopped"}`
              : saved
                ? `In progress · Day ${saved.day} · ${saved.progress}%`
                : "Not started";
            return (
              <article
                className={`cinematic-family-card ${currentFamilyId === family.id ? "selected" : ""}`}
                key={family.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${families.length}: ${family.name}`}
              >
                <div className="cinematic-family-portrait">
                  <img src={family.portraitStrips.healthy} alt={`Portraits of ${family.name}`} />
                  <span className={saved?.phase === "ended" ? saved.status : saved ? "playing" : "new"}>{savedStatus}</span>
                </div>
                <div className="cinematic-family-copy">
                  <small>{family.origin}</small>

                  <strong>{family.name}</strong>
                  <p>{chooserSummary[family.id] ?? family.context}</p>
                  <em><MapPin weight="fill" />{family.journey}</em>
                </div>
                <div className="cinematic-family-actions">
                  <button className="continue" onClick={() => onSelect(family.id)} data-sound="confirm">
                    {saved ? (saved.phase === "ended" ? "View result" : "Continue") : "Start journey"}<ArrowRight weight="bold" />
                  </button>
                  {saved && onRestart && (
                    <button className="restart" onClick={() => onRestart(family.id)} data-sound="warning">
                      <ArrowCounterClockwise weight="bold" />Start again
                    </button>
                  )}
                </div>
              </article>
            );
          })}
          </div>
        </div>

        <footer>All journeys are fictional composites grounded in historical sources; people, incidents and game quantities are invented. Stories include displacement, exploitation, detention, family loss, and uncertain legal outcomes. Difficult events remain non-graphic.</footer>
      </section>
    </dialog>
  );
}

