import { useEffect, useRef, useState } from "react";
import { CAMBODIA, CAMBODIA_SCENES, CAMBODIA_SOURCES, CONTENT_NOTE, STORY_NOTICE, callbacks, sceneFor } from "./cambodiaStory.js";
import { backCambodia, chooseCambodia, continueCambodia, createCambodiaState, loadCambodia, saveCambodia, startCambodia } from "./cambodiaState.js";
import { getCambodiaGeography } from "./cambodiaGeography.js";
import { JourneyHistoryDialog, SceneHistory } from "./JourneyHistory.jsx";
import { JourneyMap } from "./JourneyMap.jsx";
import "./cambodiaStory.css";

export function CambodiaConsent({ onStart, onSummary, onExit, onHistory }) {
  return <section aria-labelledby="pilot-intro"><p className="pilot-eyebrow">Fictional Khmer Cambodian household · 1979–1982</p><h1 id="pilot-intro">A Place for Tomorrow</h1>
    <p>{CAMBODIA.history.familyStakes}</p><p>{CAMBODIA.history.historicalSummary}</p>
    <p className="pilot-note"><strong>Before you begin:</strong> {CONTENT_NOTE}</p>
    <p>These choices explore attention, time and relationships. They cannot earn survival, admission or belonging. You may pause, read summaries or leave at any point.</p>
    <div className="pilot-actions"><button onClick={onStart}>Start story</button><button onClick={onSummary}>Read a short summary</button><button onClick={onExit}>Choose another story</button></div>
    <button className="pilot-text-button" onClick={onHistory}>Sources, timeline &amp; content notes</button>
  </section>;
}
export function CambodiaScene({ state, summary = false, onChoose, onContinue, onHistory }) {
  const scene = sceneFor(state);
  const chosen = scene.choices.find(c => c.id === state.history.at(-1)?.choiceId);
  return <article aria-labelledby="pilot-scene-title">
    <p className="pilot-eyebrow">{scene.date} · {scene.place}</p><h1 id="pilot-scene-title" tabIndex="-1">{scene.title}</h1>
    <p className="pilot-status">{scene.status}</p><p>{summary ? scene.summary : scene.prose}</p>
    {callbacks(state).map(note => <p className="pilot-recalled" key={note}>{note}</p>)}
    {state.phase === "scene" ? <><p className="pilot-instruction">{scene.id === "C02" ? "Choose how much to read. Both options continue the same story." : "Choose one response. Both are defensible; the consequences follow your choice."}</p>
      <div className="pilot-choices">{scene.choices.map(choice => <button key={choice.id} onClick={() => onChoose(choice.id)}><strong>{choice.title}</strong><span>{choice.description}</span><span className="pilot-choice-action">{scene.id === "C02" ? "Continue reading →" : "Choose this response →"}</span></button>)}</div></> : <section className="pilot-consequence" aria-label="After your choice"><h2>{state.phase === "complete" ? "The telling ends; their lives continue" : "After your choice"}</h2><p>{chosen?.consequence}</p>
      {state.phase === "complete" ? <p>What could they influence? Attention, schedules and how they asked for or offered help. What remained outside their control? War, policy, family news and the opportunity for admission. This is a fictional reflection, not a reader evaluation.</p> : <button onClick={onContinue}>{scene.id === "C09" ? "Read the closing reflection" : "Continue the story"}</button>}
    </section>}
    <SceneHistory game={state} storyScene={scene} sources={CAMBODIA_SOURCES} onExplore={onHistory} />
    {scene.id === "C06" && <details className="pilot-testimony"><summary>Another person’s experience · 1985, recalled in 1992</summary>
      <p>Monoram Hang recalled arriving in 1985 without authorization to reside in the camp, facing deprivation and fear, and later receiving permission and U.S. resettlement approval. This is his retrospective account, years after Dara’s fictional arrival. It is not a statement of one universal camp policy.</p>
      <p>Thaly Chhour recalled prolonged uncertainty at Nong Samit, repeated disruption and a later move to Khao-I-Dang. Her separate account illustrates why border camps and holding centres cannot be treated as interchangeable.</p>
      <p>Neither narrator is a character here or an endorser. Read their labeled transcripts as situated memories. The teaching pages’ background contains date and admission-count errors; it is not used as policy evidence.</p>
      <a href={CAMBODIA_SOURCES.C7.url} target="_blank" rel="noreferrer">Monoram Hang’s transcript (new tab)</a><br /><a href={CAMBODIA_SOURCES.C8.url} target="_blank" rel="noreferrer">Thaly Chhour’s transcript (new tab)</a>
    </details>}
  </article>;
}
export function CambodiaApp() {
  const [storage] = useState(() => { try { return window.localStorage; } catch { return null; } });
  const [loaded] = useState(() => loadCambodia(storage));
  const [state, setState] = useState(loaded.state);
  const [writable, setWritable] = useState(loaded.writable);
  const [warning, setWarning] = useState(loaded.warning);
  const [history, setHistory] = useState(false);
  const [summary, setSummary] = useState(false);
  const [overview, setOverview] = useState(false);
  const [paused, setPaused] = useState(false);
  const stage = useRef(null);
  const scene = sceneFor(state);
  useEffect(() => {
    if (writable && !saveCambodia(storage, state)) setWarning("Saving is unavailable. Keep this tab open to continue this visit.");
  }, [state, writable, storage]);
  useEffect(() => { if (!history) stage.current?.querySelector("h1")?.focus(); }, [state.sceneId, state.phase, overview, paused]);
  function restart() { setWritable(true); setWarning(""); setState(createCambodiaState()); setOverview(false); setPaused(false); }
  const exit = () => window.location.assign("/");
  return <main className="cambodia-pilot">
    <header className="pilot-header"><a href="/">The Undocumented Trail</a><p>{STORY_NOTICE}</p><nav aria-label="Story tools"><button onClick={() => setPaused(p => !p)}>{paused ? "Resume story" : "Pause story"}</button><button onClick={() => setSummary(s => !s)} aria-pressed={summary}>Scene summary {summary ? "on" : "off"}</button><button onClick={() => setHistory(true)} data-history-return>Sources &amp; content notes</button><button onClick={exit}>Choose another story</button></nav></header>
    {warning && <p className="pilot-warning" role="status">{warning}{!writable && <button onClick={restart}>Start a new story</button>}</p>}
    <p className="pilot-announcement" role="status" aria-live="polite" aria-atomic="true">{paused ? "Story paused" : state.phase === "intro" ? "Story introduction" : `${scene.date}. ${scene.title}. ${state.phase === "scene" ? "Ready to choose." : state.phase === "complete" ? "Closing reflection." : "After your choice."}`}</p>
    <div className="pilot-layout"><div className="pilot-reading" ref={stage}>
      {paused ? <section><h1 tabIndex="-1">Story paused</h1><p>Your choices and place are preserved. Take the time you need.</p><button onClick={() => setPaused(false)}>Resume story</button><button onClick={exit}>Choose another story</button></section> : overview ? <section><h1 tabIndex="-1">A short account</h1><p>Dara, Vann and Maly survive displacement in Cambodia, reach Khao-I-Dang in December 1979, wait and receive U.S. refugee admission in 1981. In Minnesota they negotiate work, learning, relationships and unanswered questions. Their survival and admission are authored premises; neither can be earned through reader choices.</p><p>War, forced labor, bereavement and family separation are acknowledged without reenactment. Two endings attend to ordinary relationships or an unfinished design, with no grade.</p><button onClick={() => setOverview(false)}>Return to your place</button><button onClick={exit}>Choose another story</button></section> : state.phase === "intro" ? <CambodiaConsent onStart={() => setState(startCambodia(state))} onSummary={() => setOverview(true)} onExit={exit} onHistory={() => setHistory(true)} /> : <CambodiaScene state={state} summary={summary} onChoose={id => { setState(chooseCambodia(state, id)); if (scene.id === "C02" && id === "history") setHistory(true); }} onContinue={() => setState(continueCambodia(state))} onHistory={() => setHistory(true)} />}
      {state.phase !== "intro" && !paused && !overview && <div className="pilot-actions"><button onClick={() => setState(backCambodia(state))}>Back · revise previous choice</button><button onClick={() => setOverview(true)}>Read the whole-story summary</button>{state.phase === "complete" && <button onClick={restart}>Start this story again</button>}</div>}
    </div><aside aria-label="Geographic context"><JourneyMap game={state} geography={getCambodiaGeography(state)} /><details className="pilot-method"><summary>Sources, fiction & methodology</summary><p>Research checked 18 October 2026. Sources distinguish court findings, operational history, a statute and situated testimony. C4/C5 are read as indexed extracts; their full PDFs remain unverified. The ECCC Guide, UNHCR’s contemporary 1980 assistance report and archived MNHS collection context have been read. The short factual testimony summaries use original wording and link to the narrators’ accounts; no transcript excerpts, photos or audio are reproduced. The collection credits copyright to Minnesota Advocates for Human Rights. No reproduction permission or endorsement is claimed.</p><p>No external community or historical/pathway review has been performed. Names, relationships, vocabulary and everyday details are authored fiction, not verified descriptions of a real household. No translated Khmer or identity imagery is included. Original text and the public-domain geographic fallback can support a first release; additional imagery, audio and translation are optional and would need clearance or human review. This story does not claim to reproduce what displacement feels like.</p><a href="/licenses/README.txt">Map and font license notices</a><br /><a href="https://github.com/thachp/theundocumentedtrail/issues/2">Research corrections and review record · issue #2</a></details></aside></div>
    {history && <JourneyHistoryDialog game={state} story={CAMBODIA} onClose={() => setHistory(false)} />}
  </main>;
}
