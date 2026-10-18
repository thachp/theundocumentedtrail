import { loadCambodiaJourney, loadCambodiaArchive } from "./cambodiaJourneyStore.js";
import { authoredStory } from "./authoredStories.js";
import { storyHero } from "./authoredJourney.js";
import { loadAuthoredJourney, loadAuthoredArchive } from "./authoredJourneyStore.js";
import { useEffect, useRef, useState } from "react";
import { ArrowCounterClockwise, ArrowLeft, ArrowRight, BookOpenText, MapPin, UsersThree, X } from "@phosphor-icons/react";
import { FAMILY_PRESETS } from "./game.js";
import { getJourneyHistory } from "./journeyHistory.js";
import { getJourneyChoices, journeyKeyIndex, scrollJourneyCard } from "./journeyChoices.js";
import "./beginner.css";

export function FamilySelection({ currentFamilyId, required, saves, archive, onSelect, onRestart, onClose, mode = "guided" }) {
  const families = getJourneyChoices(import.meta.env);
  const initialIndex = Math.max(0, families.findIndex((family) => family.id === currentFamilyId));
  const carouselRef = useRef(null);
  const dialogRef = useRef(null);
  const headingRef = useRef(null);
  const [carouselIndex, setCarouselIndex] = useState(initialIndex);
  const recentJourneys = archive.slice(0, 6);

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
        <span className="cinematic-family-symbol"><UsersThree weight="duotone" /></span>
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
              const saved=loadAuthoredJourney(family.id), completed=loadAuthoredArchive(family.id);
              const started=saved.storyState.history.length>0;
              return <article className="cinematic-family-card" key={family.id} role="group" aria-roledescription="slide" aria-label={`${index+1} of ${families.length}: ${family.name} · ${family.period}`}><div className="cinematic-family-portrait"><img src={storyHero(authoredStory(saved))} alt={`Original illustration of the fictional household · ${family.name}`} /><span>{saved.phase==='ended'?'Completed':started?`In progress · Scene ${saved.day}`:'Not started'} · {family.period}</span></div><div className="cinematic-family-copy"><small>{family.origin}</small><strong>{family.name}</strong><p>{family.context}</p><em><MapPin weight="fill" />{family.journey}</em><p>{saved.householdEdition===1?"Original three-person save · Revised four-person edition available inside":"Four-person journey · Separate saved progress"}</p>{completed.length>0&&<details><summary>Completed journeys · {completed.length}</summary>{completed.map(run=><p key={run.runId}>{run.householdEdition===1?"Original edition":"Four-person edition"} · {run.endingTitle} · {run.decisions} decisions</p>)}</details>}</div><div className="cinematic-family-actions"><button className="continue" onClick={()=>onSelect(family.id)}>{saved.phase==='ended'?'View result':started?'Continue':'Start journey'}<ArrowRight weight="bold" /></button>{started&&onRestart&&<button className="restart" onClick={()=>onRestart(family.id)}><ArrowCounterClockwise weight="bold" />Start again</button>}</div></article>;
            }
            if (family.kind === "historical") {const saved=loadCambodiaJourney(),completed=loadCambodiaArchive();return <article className="cinematic-family-card" key={family.id} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${families.length}: Cambodia · ${family.name} · ${family.period}`}>
              <div className="cinematic-family-portrait"><img src={saved.householdEdition===1?"/assets/legacy-households/cambodia/cover.webp":"/assets/cambodia/cover.webp"} alt={saved.householdEdition===1?"Original fictional household: Dara, Vann and Maly":"Illustrative fictional household: Dara, Vann, Maly and Sophea in late-1979 Cambodia"} /><span>Family journey · 1979–1982</span></div>
              <div className="cinematic-family-copy"><small>{family.origin}</small><span className="history-chooser-setting">Cambodia → Thailand → United States · {family.period}</span><strong>{family.name}</strong><p>{family.context}</p><em><MapPin weight="fill" />{family.journey}</em><p>{saved.householdEdition===1?"Original three-person save · Revised four-person edition available inside":"Four-person journey · Separate saved progress"}</p>{completed.length>0&&<details><summary>Completed journeys · {completed.length}</summary>{completed.map(run=><p key={run.runId}>{run.endingTitle}</p>)}</details>}</div><div className="cinematic-family-actions"><a className="continue" href={mode === "full" ? `${family.href}&mode=full` : family.href}>Open Cambodian story<ArrowRight weight="bold" /></a></div>
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
                  <span className="history-chooser-setting">{getJourneyHistory(family.id).place} · {getJourneyHistory(family.id).era}</span>
                  <strong>{family.name}</strong>
                  <p>{family.context}</p>
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
        {recentJourneys.length > 0 && (
          <section className="cinematic-journey-archive" aria-label="Completed journey archive">
            <header><BookOpenText weight="duotone" /><span><small>Journey archive</small><strong>Roads already traveled</strong></span></header>
            <div>
              {recentJourneys.map((entry) => {
                const family = FAMILY_PRESETS[entry.familyId];
                return (
                  <article key={entry.runId}>
                    <span><strong>{family.shortName}</strong><small>{entry.endingTitle}</small></span>
                    <em>{entry.status === "won" ? "Completed" : "Stopped"}</em>
                    <span><strong>{entry.survivors}/{entry.travelers}</strong><small>Survived</small></span>
                    <span><strong>Day {entry.day}</strong><small>{entry.decisions} decisions</small></span>
                  </article>
                );
              })}
            </div>
          </section>
        )}
        <footer>Stories include displacement, exploitation, detention, family loss, and uncertain legal outcomes. Difficult events remain non-graphic.</footer>
      </section>
    </dialog>
  );
}

