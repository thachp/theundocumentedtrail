import { SharedPlaceContext } from "./SharedPlaceContext.jsx";
import { UsFiscalEvidence } from "./UsFiscalEvidence.jsx";
import { useEffect, useId, useRef } from "react";
import { getEvent, getFamilyPreset } from "./game.js";
import { FICTION_NOTICE, HISTORY_SOURCES, getJourneyDate, getJourneyHistory, getSceneHistory } from "./journeyHistory.js";
import "./journeyHistory.css";

function SourceLinks({ ids, sources = HISTORY_SOURCES }) {
  return <ul className="history-sources">{ids.map((id) => {
    const source = sources[id];
    return <li key={id}><a href={source.url} target="_blank" rel="noreferrer">{source.title}<span className="history-new-tab"> (opens in a new tab)</span></a><small>{source.date}</small></li>;
  })}</ul>;
}

export function JourneyHistoryDialog({ game, introduction = false, onClose, story }) {
  const dialogRef = useRef(null);
  const headingId = useId();
  const context = story?.history ?? getJourneyHistory(game);
  const sources = story?.sources ?? HISTORY_SOURCES;
  const family = story ? { name: story.title } : getFamilyPreset(game);
  useEffect(() => {
    const previous = document.activeElement;
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => {
      dialog.close();
      if (previous?.isConnected) previous.focus();
      else document.querySelector("[data-history-return]")?.focus();
    };
  }, []);
  return <dialog ref={dialogRef} className="journey-history-dialog" aria-labelledby={headingId} onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="journey-history-content">
      <header><span>{introduction ? "Before the journey" : "Explore the history"}</span><button type="button" aria-label="Close historical context" onClick={onClose}>Close ×</button></header>
      <h2 id={headingId}>{family.name}</h2>
      <p className="history-setting"><strong>{context.place}</strong><span>{context.era}</span></p>
      <div className="history-actions"><button type="button" onClick={onClose}>{introduction ? "Continue to the first decision" : "Return to the journey"}</button>{introduction && <button type="button" className="history-skip" onClick={onClose}>Skip introduction</button>}</div>
      <section aria-label="Documented background"><h3>Documented background</h3><p>{context.historicalSummary}</p></section>
      <section aria-label="Fictional household"><h3>This household</h3><p>{context.familyStakes}</p></section>
      <p className="history-fiction">{FICTION_NOTICE}</p>
      <p className="history-content-note"><strong>Content note:</strong> {context.contentNote}</p>
      {game.familyId === "haddad" && <p className="history-calendar-note">July 2015 is an editorial setting. The simulated calendar starts on 1 July and follows elapsed story days; the family’s exact dates and incidents are invented. Current story date: {getJourneyDate(game)}.</p>}
      {game.narrativeUpdated && <p className="history-calendar-note">This saved journey now uses the corrected 2015 setting. Your decisions, resources and progress are preserved.</p>}
      <details className="history-explore">
        <summary>Explore the history · Timeline &amp; sources</summary>
        <ol className="history-timeline">{context.timeline.map((entry, index) => <li key={index}><span>{entry.kind}</span><strong>{entry.date}</strong><p>{entry.text}</p>{entry.sourceId && <a href={sources[entry.sourceId].url} target="_blank" rel="noreferrer">Read source <span className="history-new-tab">(opens in a new tab)</span></a>}</li>)}</ol>
        <h3>Sources and their scope</h3>
        <p>Source dates describe the evidence, not the fictional family’s departure. Reporting, policy and individual experience are different kinds of evidence. These links provide background, not current legal advice or a promised route.</p>
        <SourceLinks ids={context.sourceIds} sources={sources} />
        <dl className="history-glossary">{story ? <><dt>Refugee admission</dt><dd>Authorization to enter a receiving country under a refugee-admission pathway. Camp reception alone does not confer it; admission is not instant citizenship.</dd><dt>Holding centre and border camp</dt><dd>Different settings with different histories and access conditions; neither label describes one universal experience.</dd></> : <><dt>Asylum seeker</dt><dd>A person seeking protection whose claim has not been finally decided.</dd><dt>Temporary protection</dt><dd>A specific protection framework; it is not a promise of permanent status or admission elsewhere.</dd></>}<dt>Fictional composite</dt><dd>Authored people and incidents informed by evidence, without claiming to reproduce a real person’s testimony.</dd></dl>
        <button type="button" className="history-return" onClick={onClose}>Return to the journey</button>
      </details>
    </div>
  </dialog>;
}

export function SceneHistory({ game, onExplore, storyScene, sources }) {
  const note = storyScene ? { text: storyScene.context, sourceIds: storyScene.sourceIds } : getSceneHistory(game);
  if (!note) return null;
  const event = storyScene ? { region: storyScene.place } : getEvent(game);
  return <><details className="scene-history" key={storyScene?.id ?? `${game.familyId}-${game.eventId}`}>
    <summary><span>{event.region} · {storyScene?.date ?? getJourneyDate(game)}</span><strong>Why this setting matters</strong></summary>
    <p>{note.text}</p>
    <SourceLinks ids={note.sourceIds} sources={sources} />
    <button type="button" onClick={onExplore}>Explore the history</button>
  </details><SharedPlaceContext key={`${game.familyId}-${game.eventId}`} game={game} /><UsFiscalEvidence key={`fiscal-${game.familyId}-${game.eventId}`} game={game} /></>;
}
