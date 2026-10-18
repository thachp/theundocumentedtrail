import { EVENTS, FAMILY_PRESETS } from "./game.js";

// Coordinates are [longitude, latitude] in decimal degrees. These are regional
// anchors for the authored story, never addresses, GPS fixes, or navigable tracks.
// Broad / unspecified regions deliberately share an anchor rather than inventing
// a town, island, transit hub, detention facility, or historical itinerary.
const place = (familyId, coordinates, label, uncertainty) => Object.freeze({
  familyId, coordinates: Object.freeze(coordinates), label, uncertainty,
});
const locations = {};
function assign(familyId, eventIds, coordinates, label, uncertainty) {
  for (const id of eventIds.split(" ")) locations[id] = place(familyId, coordinates, label, uncertainty);
}
assign("ramirez", "home", [-87, 15.5], "Northern Honduras", "Regional anchor; home town unspecified");
assign("ramirez", "guideOffer", [-90, 15], "Guatemala transit corridor", "Regional anchor; terminal unspecified");
assign("ramirez", "roadRobbery blueDoorShelter waitingTown clinicQueue", [-92.5, 16.5], "Southern Mexico / Chiapas", "Broad regional anchor; towns and facilities unspecified");
assign("ramirez", "guideAbandon", [-92.5, 16.5], "Unknown transit town", "Position unknown; held at the southern Mexico transit anchor");
assign("ramirez", "transport", [-100, 22], "Central Mexico", "Broad regional anchor; corridor unspecified");
assign("ramirez", "checkpointDelay", [-102, 25], "Central-northern Mexico", "Broad regional anchor; checkpoint unspecified");
assign("ramirez", "policyNews northernWait", [-104, 28], "Northern Mexico", "Broad regional anchor; town unspecified");
assign("ramirez", "borderCity riverCrossing memorial detention", [-106.5, 31.75], "U.S.–Mexico border region", "Representative border anchor; city, crossing and facility unspecified");
assign("haddad", "haddadHome", [37.16, 36.2], "Aleppo, Syria", "Approximate city-area anchor; home unspecified");
assign("haddad", "haddadBorder", [36.8, 36.8], "Türkiye–Syria border region", "Regional anchor; reception town unspecified");
assign("haddad", "haddadTurkey haddadAegean", [27.14, 38.42], "İzmir / Aegean coast, Türkiye", "Approximate coastal anchor; departure beach unspecified");
assign("haddad", "haddadMemorial haddadGreece", [26, 39], "Eastern Aegean, Greece", "Regional island anchor; island and reception center unspecified");
assign("haddad", "haddadBalkans", [20, 43], "Western Balkans", "Broad regional anchor; transit station unspecified");
assign("haddad", "haddadEuropeNews", [15, 48], "Central Europe", "Broad regional anchor; rail shelter unspecified");
assign("haddad", "haddadGermany", [10.5, 51], "Germany", "Country anchor; arrival center unspecified");
assign("diop", "diopHome", [-16.97, 14.42], "Mbour, Senegal", "Approximate city anchor; courtyard unspecified");
assign("diop", "diopDakar", [-17.39, 14.75], "Pikine / Dakar, Senegal", "Approximate city anchor; cooperative unspecified");
assign("diop", "diopSaintLouis", [-16.49, 16.03], "Saint-Louis, Senegal", "Approximate city anchor; coach yard unspecified");
assign("diop", "diopNouakchott diopAtlantic", [-16.03, 18.07], "Nouakchott / Atlantic coast, Mauritania", "Approximate coastal anchor; departure beach unspecified");
assign("diop", "diopMemorial", [-17, 24], "Atlantic rescue corridor", "Illustrative sea-region anchor; rescue position unknown");
assign("diop", "diopCanaryLanding diopIslandWait diopFinal", [-15.6, 28], "Canary Islands, Spain", "Archipelago anchor; island and facilities unspecified");
assign("nguyen", "nguyenHome", [104.9, 19.2], "Nghệ An, Vietnam", "Province anchor; home town unspecified");
assign("nguyen", "nguyenRecruiter", [106.7, 10.78], "Ho Chi Minh City, Vietnam", "Approximate city anchor; office unspecified");
assign("nguyen", "nguyenTransit nguyenSafeHouse", [15, 49], "Continental Europe", "Illustrative regional anchor; country, transit route and premises unknown");
assign("nguyen", "nguyenFrance nguyenChannel", [2, 50.9], "Northern France / Channel coast", "Regional anchor; town and departure area unspecified");
assign("nguyen", "nguyenUKArrival nguyenPolicy nguyenFinal", [0.5, 51], "Southern England / United Kingdom", "Regional anchor; accommodation and facilities unspecified");
assign("punjab", "punjabHome", [75.58, 31.33], "Near Jalandhar, Punjab, India", "Approximate city-area anchor; courtyard unspecified");
assign("punjab", "punjabDelhi punjabAirport", [77.1, 28.6], "Delhi, India", "Approximate city anchor; no intermediate flight hub is specified");
assign("punjab", "punjabDublin punjabPolicy punjabFinal", [-6.26, 53.35], "Dublin, Ireland", "Approximate city anchor; facilities unspecified");
assign("punjab", "punjabWorksite punjabInspection", [-7.5, 53.4], "Irish Midlands", "Regional anchor; plant and worker house unspecified");
assign("rohingya", "rohingyaCamp rohingyaPapers rohingyaCoast", [92.1, 21.2], "Cox’s Bazar / Bangladesh coast", "Regional anchor; camp block and departure beach unspecified");
assign("rohingya", "rohingyaSea", [92, 16], "Bay of Bengal", "Illustrative sea-region anchor; boat position unknown");
assign("rohingya", "rohingyaWeather", [94, 11], "Andaman Sea", "Illustrative sea-region anchor; island and boat position unknown");
assign("rohingya", "rohingyaSignal", [96, 8], "Eastern Andaman Sea", "Illustrative sea-region anchor; boat position unknown");
assign("rohingya", "rohingyaLanding rohingyaAceh", [96, 5.2], "Aceh, Indonesia", "Province coastal anchor; landing and reception points unspecified");

export const EVENT_LOCATIONS = Object.freeze(locations);

// Fixed family extents keep maps stable between decisions and saves. Uniform
// SVG scaling and a single equirectangular projection apply to every layer.
export const MAP_BOUNDS = Object.freeze({
  ramirez: [-114, 9, -82, 36], haddad: [3, 31, 43, 57],
  diop: [-24, 10, -9, 32], nguyen: [-12, 0, 117, 61],
  punjab: [-17, 17, 86, 63], rohingya: [84, -1, 105, 25],
});
export const MAP_SIZE = Object.freeze({ width: 600, height: 500, padding: 32 });
export function projectCoordinate(coordinates, bounds, size = MAP_SIZE) {
  const [longitude, latitude] = coordinates;
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude) || Math.abs(longitude) > 180 || Math.abs(latitude) > 90) throw new RangeError("Expected [longitude, latitude] in decimal degrees");
  const [west, south, east, north] = bounds;
  const scale = Math.min((size.width - size.padding * 2) / (east - west), (size.height - size.padding * 2) / (north - south));
  return [size.width / 2 + (longitude - (west + east) / 2) * scale, size.height / 2 - (latitude - (south + north) / 2) * scale];
}

// Only committed terminal choices may change the displayed final destination.
// Their coordinates stay regional where the ending names no exact town.
const ENDING_LOCATIONS = Object.freeze({
  ramirez: { returned: place("ramirez", [-87, 15.5], "Returned to Honduras", "Regional return anchor; final address unspecified"), deported: place("ramirez", [-87, 15.5], "Returned to Honduras", "Regional return anchor; final address unspecified") },
  haddad: { returned: place("haddad", [27.14, 38.42], "Returned to Türkiye", "Regional return anchor; final town unspecified") },
  diop: Object.fromEntries(["safe_return", "returned_after_loss", "assisted_return"].map((type) => [type, place("diop", [-16.97, 14.42], "Returned to Senegal", "Regional return anchor; final town unspecified")])),
  nguyen: { supported_return_vietnam: place("nguyen", [104.9, 19.2], "Returned to Vietnam", "Regional return anchor; final town unspecified") },
  punjab: { ireland_voluntary_return: place("punjab", [75.58, 31.33], "Returned to India", "Regional return anchor; final town unspecified") },
  rohingya: { returned_to_camp: place("rohingya", [92.1, 21.2], "Returned to Cox’s Bazar", "Regional camp anchor; block unspecified") },
});

export function getJourneyGeography(game) {
  const family = FAMILY_PRESETS[game.familyId];
  const validLocation = (id) => EVENT_LOCATIONS[id]?.familyId === family?.id;
  const eventId = validLocation(game.eventId) ? game.eventId : family?.startEventId;
  if (!family || !eventId) throw new Error("Unknown journey geography");
  const history = (game.history ?? []).filter((entry) => validLocation(entry.eventId));
  const ids = [family.startEventId, ...history.map((entry) => entry.eventId), eventId].filter((id, index, all) => index === 0 || id !== all[index - 1]);
  const itinerary = ids.map((id) => ({ ...EVENT_LOCATIONS[id], eventId: id, storyLocation: EVENTS[id].location, region: EVENTS[id].region }));
  const finalLocation = game.phase === "ended" ? ENDING_LOCATIONS[family.id]?.[game.ending?.type] : null;
  if (finalLocation) itinerary.push({ ...finalLocation, eventId: "ending", storyLocation: game.ending.title, region: finalLocation.label });
  const current = itinerary.at(-1);
  return { family, bounds: MAP_BOUNDS[family.id], itinerary, current, points: itinerary.map((entry) => projectCoordinate(entry.coordinates, MAP_BOUNDS[family.id])) };
}
