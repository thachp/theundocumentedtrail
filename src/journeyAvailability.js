// Retain story data and edition-specific saves while these journeys are reworked.
export const HIDDEN_JOURNEYS = Object.freeze(['mariel-1980', 'vietnam-bidong-1978']);
export const isJourneyHidden = id => HIDDEN_JOURNEYS.includes(id);
