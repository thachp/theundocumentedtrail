import { useCallback, useEffect, useRef, useState } from "react";
import { applySavedJourneyAction, loadCurrentGame, loadFamilySaves } from "./saveStore.js";

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
    const visible = () => { if (document.visibilityState === "visible") restore(); };
    window.addEventListener("pageshow", restore);
    window.addEventListener("storage", restore);
    document.addEventListener("visibilitychange", visible);
    restore();
    return () => {
      window.removeEventListener("pageshow", restore);
      window.removeEventListener("storage", restore);
      document.removeEventListener("visibilitychange", visible);
    };
  }, []);
  return [game, setGame];
}
