import {useEffect,useRef} from 'react';
import {Bug,Lightbulb,ArrowSquareOut,X} from '@phosphor-icons/react';
import {feedbackIssueUrl} from './feedback.js';
import './feedback.css';

export function FeedbackDialog({context,onClose}) {
 const ref=useRef(null);
 useEffect(()=>{
  const previous=document.activeElement,dialog=ref.current;
  dialog.showModal();dialog.querySelector('h2').focus({preventScroll:true});
  return ()=>{dialog.close();if(previous?.isConnected)previous.focus({preventScroll:true});};
 },[]);
 return <dialog className="feedback-dialog" ref={ref} aria-labelledby="feedback-title" aria-describedby="feedback-description" onCancel={event=>{event.preventDefault();onClose();}} onClick={event=>{if(event.target===ref.current){const r=ref.current.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)onClose();}}}>
  <button className="feedback-close" onClick={onClose} aria-label="Close feedback" data-sound="dismiss"><X aria-hidden="true"/></button>
  <h2 id="feedback-title" tabIndex="-1">Feedback &amp; bug reports</h2>
  <p id="feedback-description">Help improve The Undocumented Trail. Choose an option to open a draft on GitHub.</p>
  <div className="feedback-options">
   {[{type:'bug',icon:Bug,title:'Report a bug',copy:'Tell us what happened and how to reproduce it.'},{type:'feature',icon:Lightbulb,title:'Suggest a feature',copy:'Share an idea and how it would improve the journey.'}].map(({type,icon:Icon,title,copy})=><a key={type} href={feedbackIssueUrl(type,context)} target="_blank" rel="noopener noreferrer" aria-label={`${title} on GitHub (opens in a new tab)`} data-sound="tap"><Icon aria-hidden="true"/><span><strong>{title}</strong><small>{copy}</small></span><ArrowSquareOut aria-hidden="true"/></a>)}
  </div>
  <p className="feedback-note">Opens GitHub · account required</p>
  <p className="feedback-note">Only the current journey, view and edition are included. You can edit the draft before submitting.</p>
 </dialog>;
}
