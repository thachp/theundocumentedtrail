import { AUTHORED_STORIES } from "./authoredStories.js";
import { FAMILY_PRESETS } from "./game.js";
import { cambodiaStoryEnabled } from "./cambodiaState.js";

export const CAMBODIA_CHOICE = Object.freeze({
  id: "cambodia-1979",
  kind: "historical",
  name: "A Place for Tomorrow",
  origin: "Cambodia · Forced displacement",
  period: "1979–1982",
  context: "A fictional Khmer Cambodian household moves from displacement and a Thai holding centre toward rebuilding life in Minnesota.",
  journey: "Cambodia → Thailand → Minnesota",
  href: "/?story=cambodia-1979",
});

export function getJourneyChoices(env = {}) {
  return [...Object.values(FAMILY_PRESETS), ...(cambodiaStoryEnabled(env) ? [CAMBODIA_CHOICE] : []), ...AUTHORED_STORIES.map(s=>({id:s.id,kind:"authored-household",name:s.title,origin:s.origin,period:s.period,context:s.historicalSummary,journey:s.route,heroImage:`/assets/${s.id}/cover.webp`,href:`/?story=${s.id}`}))];
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
