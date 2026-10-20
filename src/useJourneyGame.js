import { useCallback, useEffect, useRef, useState } from "react";
import { applySavedJourneyAction, loadCurrentGame, loadFamilySaves } from "./saveStore.js";
import { isCambodiaJourney } from "./cambodiaJourney.js";
import { loadCambodiaJourney, applyCambodiaJourneyAction } from "./cambodiaJourneyStore.js";
import { authoredStory } from "./authoredStories.js";
import { isAuthoredJourney } from "./authoredJourney.js";
import { loadAuthoredJourney, applyAuthoredAction } from "./authoredJourneyStore.js";
import { cambodiaStoryEnabled } from "./cambodiaState.js";

export function observeJourneyRestore(restore, windowTarget = window, documentTarget = document) {
  const visible = () => { if (documentTarget.visibilityState === "visible") restore(); };
  windowTarget.addEventListener("pageshow", restore);
  windowTarget.addEventListener("popstate", restore);
  windowTarget.addEventListener("storage", restore);
  documentTarget.addEventListener("visibilitychange", visible);
  restore();
  return () => {
    windowTarget.removeEventListener("pageshow", restore);
    windowTarget.removeEventListener("popstate", restore);
    windowTarget.removeEventListener("storage", restore);
    documentTarget.removeEventListener("visibilitychange", visible);
  };
}

// Both interfaces share a revision-aware durable state boundary. Saving in an
// effect after render allowed a bfcache-restored page to write its old snapshot.
export function useJourneyGame() {
  const [game, renderGame] = useState(() => authoredStory(new URLSearchParams(window.location.search).get("story")) ? loadAuthoredJourney(new URLSearchParams(window.location.search).get("story"),undefined,new URLSearchParams(window.location.search).get("edition")==="1"?1:undefined) : cambodiaStoryEnabled(import.meta.env) && new URLSearchParams(window.location.search).get("story") === "cambodia-1979" ? loadCambodiaJourney(undefined,[1,2,3].includes(Number(new URLSearchParams(window.location.search).get("edition")))?Number(new URLSearchParams(window.location.search).get("edition")):undefined) : loadCurrentGame());
  const current = useRef(game);
  const setGame = useCallback((action) => {
    const historicalAction = isCambodiaJourney(current.current) && (typeof action === "function" || isCambodiaJourney(action));
    const next = isAuthoredJourney(action)||isCambodiaJourney(action) ? action : isAuthoredJourney(current.current) && (typeof action === "function" || isAuthoredJourney(action)) ? applyAuthoredAction(current.current, action) : historicalAction ? applyCambodiaJourneyAction(current.current, action) : applySavedJourneyAction(current.current, action);
    if (isAuthoredJourney(next)||isCambodiaJourney(next)) { const url=new URL(window.location.href); url.searchParams.set("story",next.familyId); if(next.familyId==="cambodia-1979")url.searchParams.set("edition",String(next.householdEdition));else if(next.householdEdition===1)url.searchParams.set("edition","1");else url.searchParams.delete("edition"); window.history.replaceState(null,"",url); }
    if (!isCambodiaJourney(next) && !isAuthoredJourney(next) && new URLSearchParams(window.location.search).has("story")) {
      const url = new URL(window.location.href); url.searchParams.delete("story"); url.searchParams.delete("edition"); window.history.replaceState(null, "", url);
    }
    current.current = next;
    renderGame(next);
  }, []);
  useEffect(() => {
    const restore = () => {
      const saved = isAuthoredJourney(current.current) ? loadAuthoredJourney(current.current.familyId,undefined,current.current.householdEdition) : isCambodiaJourney(current.current) ? loadCambodiaJourney(undefined,current.current.householdEdition) : loadFamilySaves()[current.current.familyId];
      if (!saved || ((isAuthoredJourney(current.current)||isCambodiaJourney(current.current)) && !saved.saveWritable)) return;
      current.current = saved;
      renderGame(saved);
    };
    return observeJourneyRestore(restore);
  }, []);
  return [game, setGame];
}
