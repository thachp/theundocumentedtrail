import { cambodiaEdition } from './cambodiaEdition.js';
import { CAMBODIA_SCENES, sceneFor } from "./cambodiaStory.js";
import { projectCoordinate } from "./journeyGeography.js";
export const PILOT_MAP_BOUNDS = { cambodiaRegion: [98, 10, 108, 17], minnesotaRegion: [-98, 42, -89, 50], longBeachRegion: [-121, 32, -116, 36] };
const locations = {
  C01: [103, 13], C02: [103, 13], C03: [103, 13], C04: [103, 13],
  // Broad Thai–Cambodian border-region anchor, not a claim of a camp entrance.
  C05: [102.5, 14], C06: [102.5, 14], C07: [102.5, 14],
  C08: [-94.5, 46], C09: [-94.5, 46],
};
export function getCambodiaGeography(state,game) {
  if(game?.householdEdition===3){
   const {CAMBODIA_SCENES,sceneFor}=cambodiaEdition(game),scene=sceneFor(state);
   const visited=[...state.history.map(h=>h.sceneId),state.sceneId].filter((id,i,a)=>a.indexOf(id)===i);
   const landKey=scene.coordinates[0]<0?'longBeachRegion':'cambodiaRegion';
   const bounds=PILOT_MAP_BOUNDS[landKey];
   const itinerary=visited.map(id=>{const s=CAMBODIA_SCENES.find(s=>s.id===id);return {eventId:id,label:s.place,storyLocation:`${s.date} · ${s.title}`,region:s.place,coordinates:s.coordinates,uncertainty:'Regional story anchor; crossing and flight itinerary unspecified. Parallel letters do not move the household.'};});
   const current=itinerary.at(-1),inPanel=itinerary.filter(s=>(s.coordinates[0]<0)===(scene.coordinates[0]<0));
   return {family:{id:'cambodia-1979',name:'A Place for Tomorrow',shortName:'Dara, Vann, Maly & Sophea'},landKey,bounds,itinerary,current,points:inPanel.map(s=>projectCoordinate(s.coordinates,bounds)),dateLabel:scene.date,note:'Actual visited story locations only. Regional anchors, not traveled routes or crossing directions. The 1985 letters are read in Long Beach; Site One and Site Two are not stops on this household’s itinerary.'};
  }
  const {CAMBODIA_SCENES,sceneFor}=cambodiaEdition(game);
  const index = CAMBODIA_SCENES.indexOf(sceneFor(state));
  const landKey = index >= 7 ? "minnesotaRegion" : "cambodiaRegion";
  const bounds = PILOT_MAP_BOUNDS[landKey];
  const itinerary = CAMBODIA_SCENES.slice(0, index + 1).map(s => ({
    eventId: s.id, label: s.place, storyLocation: `${s.date} · ${s.title}`, region: s.place,
    coordinates: locations[s.id], uncertainty: s.id === "C02" ? "Locations unknown; held at an illustrative western Cambodia regional anchor, not a reconstruction of forced movement" : s.id >= "C08" ? "State-level anchor; city and onward itinerary unspecified" : s.id >= "C05" ? "Broad border-region anchor for Khao-I-Dang context; camp location not plotted precisely" : "Broad regional anchor; home, movement and crossing route unspecified",
  }));
  const current = itinerary.at(-1);
  const inPanel = itinerary.filter(s => landKey === "minnesotaRegion" ? s.eventId >= "C08" : s.eventId < "C08");
  return { family: { id: "cambodia-1979", name: "A Place for Tomorrow", shortName: game?.householdEdition===1?"Dara, Vann & Maly":"Dara, Vann, Maly & Sophea" }, landKey, bounds, itinerary, current, points: inPanel.map(s => projectCoordinate(s.coordinates, bounds)), dateLabel: sceneFor(state).date,
    note: "Regional story anchors only, not traveled routes or crossing directions. Separate regional panels avoid inventing a flight path. Intermediate processing and flight itinerary are unspecified." };
}
