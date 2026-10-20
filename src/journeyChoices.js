import { AUTHORED_STORIES } from "./authoredStories.js";
import { isJourneyHidden } from './journeyAvailability.js';
import { FAMILY_PRESETS } from "./game.js";
import { cambodiaStoryEnabled } from "./cambodiaState.js";

export const CAMBODIA_CHOICE = Object.freeze({
  id: "cambodia-1979",
  kind: "historical",
  name: "A Place for Tomorrow",
  origin: "Cambodia · Forced displacement",
  period: "1979–1985",
  context: "Four relatives face displacement, scarce resources and camp decisions, then rebuild in Long Beach. A later optional chapter distinguishes Site One and Site Two.",
  journey: "Cambodia → Khao-I-Dang → Long Beach",
  href: "/?story=cambodia-1979",
});

export function getJourneyChoices(env = {}) {
  return [...Object.values(FAMILY_PRESETS), ...(cambodiaStoryEnabled(env) ? [CAMBODIA_CHOICE] : []), ...AUTHORED_STORIES.filter(s=>!isJourneyHidden(s.id)).map(s=>({id:s.id,kind:"authored-household",name:s.title,origin:s.origin,period:s.period,context:s.historicalSummary,journey:s.route,heroImage:`/assets/${s.id}/cover.webp`,href:`/?story=${s.id}`}))];
}

export function journeyKeyIndex(key, current, count) {
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  if (key === "ArrowLeft") return Math.max(0, current - 1);
  if (key === "ArrowRight") return Math.min(count - 1, current + 1);
  return null;
}

export function scrollJourneyCard(rail, index, { behavior = "smooth", focus = false, reducedMotion = false } = {}) {
  if (!rail?.children.length) return null;
  const bounded = Math.max(0, Math.min(rail.children.length - 1, index));
  const card = rail.children[bounded];
  rail.scrollTo({ left: Math.max(0, card.offsetLeft - (rail.clientWidth - card.clientWidth) / 2), behavior: reducedMotion ? "auto" : behavior });
  if (focus) card.querySelector("button:not([disabled]),a[href]")?.focus({ preventScroll: true });
  return bounded;
}
