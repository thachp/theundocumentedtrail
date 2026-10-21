import { FeedbackDialog } from './FeedbackDialog.jsx';
import { useEffect, useRef, useState } from 'react';
import { UsersThree, ArrowCounterClockwise, DotsThree, BookOpenText, Compass, GithubLogo, MusicNotes, SpeakerHigh, Question, WarningCircle, ChatCircleDots } from '@phosphor-icons/react';

export function PlanningHeaderActions({ onChooseJourney, onRestart, onHistory, onLog, guidedHref, soundtrackOn, soundtrackTheme, onToggleSoundtrack, viewLabel = "Guided view", onTutorial, onContentSettings, feedbackContext }) {
 const tools = useRef(null);
 const [showFeedback,setShowFeedback]=useState(false);
 useEffect(() => {
  const dismiss = event => {if (tools.current && !tools.current.contains(event.target)) tools.current.open = false;};
  const escape = event => {if(event.key === 'Escape' && tools.current?.open){event.preventDefault();event.stopPropagation();tools.current.open=false;tools.current.querySelector('summary').focus();}};
  document.addEventListener('pointerdown',dismiss);
  document.addEventListener('keydown',escape);
  return () => {document.removeEventListener('pointerdown',dismiss);document.removeEventListener('keydown',escape);};
 }, []);
 const close = () => {tools.current.open=false;tools.current.querySelector('summary').focus({preventScroll:true});};
 return <span className="header-actions planning-header-actions">
  <button data-ending-return onClick={onChooseJourney} aria-label="Choose a journey" data-tooltip="Choose family journey" data-sound="tap"><UsersThree weight="duotone" /></button>
  <details className="planning-tools" ref={tools}>
   <summary aria-label="Journey tools" data-tooltip="Journey tools"><DotsThree weight="bold" /></summary>
   <span className="planning-tools-menu" role="group" aria-label="Journey tools" onClick={event=>{if(event.target.closest('button,a'))close();}}>
    <button onClick={onHistory} aria-label="Explore the history" data-sound="tap"><BookOpenText weight="duotone"/>Explore the history</button>
    {onTutorial && <button onClick={onTutorial} aria-label="Open tutorial" data-sound="tap"><Question weight="duotone"/>How to play</button>}
    {onContentSettings && <button onClick={onContentSettings} aria-label="Open content settings" data-sound="tap"><WarningCircle weight="duotone"/>Content settings</button>}
    <button onClick={onLog} aria-label="Open journey log" data-sound="tap"><BookOpenText weight="duotone"/>Journey log</button>
    <button onClick={onToggleSoundtrack} aria-pressed={soundtrackOn} aria-label={soundtrackOn?`Pause soundtrack — ${soundtrackTheme.label}`:'Play soundtrack'} data-sound="tap">{soundtrackOn?<SpeakerHigh weight="fill"/>:<MusicNotes weight="duotone"/>}{soundtrackOn?'Pause soundtrack':'Play soundtrack'}</button>
    <button onClick={()=>setShowFeedback(true)} aria-label="Feedback and bug reports" data-sound="tap"><ChatCircleDots weight="duotone"/>Feedback &amp; bug reports</button>
    <a href="https://github.com/thachp/theundocumentedtrail" target="_blank" rel="noreferrer" aria-label="View the open-source project on GitHub"><GithubLogo weight="fill"/>Open-source project</a>
    <button onClick={onRestart} aria-label="Reset journey" data-sound="warning"><ArrowCounterClockwise weight="duotone"/>Start over</button>
   </span>
  </details>
  {showFeedback && <FeedbackDialog context={feedbackContext} onClose={()=>setShowFeedback(false)} />}
  <a className="guided-return planning-guided-link" href={guidedHref} data-ending-return><Compass weight="duotone"/>{viewLabel}</a>
 </span>;
}
