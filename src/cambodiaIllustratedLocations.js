import { sceneFor } from './cambodiaExpanded/story.js';

const maps = {
  western: {
    id: 'western', label: 'Western Cambodia', image: 'western-journey-map.png',
    alt: 'Parchment watercolor of rural western Cambodia: stilt homes, rice fields, village gathering places and woodland paths. The dotted trail is symbolic, not a geographic reconstruction.',
  },
  border: {
    id: 'border', label: 'Thai–Cambodian border region', image: 'border-journey-map.png',
    alt: 'Parchment watercolor of a fictional border-region landscape: wooded hills, a river, resting shelters and companions with bundles. The dotted trail is symbolic and does not identify a safe crossing.',
  },
  camp: {
    id: 'camp', label: 'Khao-I-Dang area, Thailand', image: 'camp-journey-map.png',
    alt: 'Parchment watercolor of a fictional holding-centre neighborhood: bamboo shelters, water collection, food distribution, care and shared work. The illustrated layout is not a reconstruction of Khao-I-Dang.',
  },
  longBeach: {
    id: 'longBeach', label: 'Long Beach, California', image: 'longBeach-journey-map.png',
    alt: 'Parchment watercolor of an early-1980s Long Beach neighborhood: modest apartments, palms, a grocery, buses and community learning. The dotted trail is a symbolic neighborhood journey.',
  },
};

export function illustratedMapForScene(scene) {
  // The household's own location drives the artwork. Camp names in letters
  // never move the family away from California, and progress is not geography.
  if (scene.coordinates[0] < 0) return maps.longBeach;
  if (['E04','T01','M01','M02'].includes(scene.id)) return maps.border;
  if (scene.coordinates[0] === 102.5) return maps.camp;
  return maps.western;
}

export const cambodiaIllustratedLocation = game => illustratedMapForScene(sceneFor(game.cambodiaState));
