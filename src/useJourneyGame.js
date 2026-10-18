import { useCallback, useEffect, useRef, useState } from "react";
import { applySavedJourneyAction, loadCurrentGame, loadFamilySaves } from "./saveStore.js";
import { isCambodiaJourney } from "./cambodiaJourney.js";
import { loadCambodiaJourney, applyCambodiaJourneyAction } from "./cambodiaJourneyStore.js";
import { cambodiaStoryEnabled } from "./cambodiaState.js";

export function observeJourneyRestore(restore, windowTarget = window, documentTarget = document) {
  const visible = () => { if (documentTarget.visibilityState === "visible") restore(); };
  windowTarget.addEventListener("pageshow", restore);
  windowTarget.addEventListener("storage", restore);
  documentTarget.addEventListener("visibilitychange", visible);
  restore();
  return () => {
    windowTarget.removeEventListener("pageshow", restore);
    windowTarget.removeEventListener("storage", restore);
    documentTarget.removeEventListener("visibilitychange", visible);
  };
}

// Both interfaces share a revision-aware durable state boundary. Saving in an
// effect after render allowed a bfcache-restored page to write its old snapshot.
export function useJourneyGame() {
  const [game, renderGame] = useState(() => cambodiaStoryEnabled(import.meta.env) && new URLSearchParams(window.location.search).get("story") === "cambodia-1979" ? loadCambodiaJourney() : loadCurrentGame());
  const current = useRef(game);
  const setGame = useCallback((action) => {
    const historicalAction = isCambodiaJourney(current.current) && (typeof action === "function" || isCambodiaJourney(action));
    const next = historicalAction ? applyCambodiaJourneyAction(current.current, action) : applySavedJourneyAction(current.current, action);
    if (!isCambodiaJourney(next) && new URLSearchParams(window.location.search).has("story")) {
      const url = new URL(window.location.href); url.searchParams.delete("story"); window.history.replaceState(null, "", url);
    }
    current.current = next;
    renderGame(next);
  }, []);
  useEffect(() => {
    const restore = () => {
      const saved = isCambodiaJourney(current.current) ? loadCambodiaJourney() : loadFamilySaves()[current.current.familyId];
      if (!saved) return;
      current.current = saved;
      renderGame(saved);
    };
    return observeJourneyRestore(restore);
  }, []);
  return [game, setGame];
}
