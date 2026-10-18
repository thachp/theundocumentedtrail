import { useCallback, useEffect, useRef, useState } from "react";
import { applySavedJourneyAction, loadCurrentGame, loadFamilySaves } from "./saveStore.js";

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
  const [game, renderGame] = useState(loadCurrentGame);
  const current = useRef(game);
  const setGame = useCallback((action) => {
    const next = applySavedJourneyAction(current.current, action);
    current.current = next;
    renderGame(next);
  }, []);
  useEffect(() => {
    const restore = () => {
      const saved = loadFamilySaves()[current.current.familyId];
      if (!saved) return;
      current.current = saved;
      renderGame(saved);
    };
    return observeJourneyRestore(restore);
  }, []);
  return [game, setGame];
}
