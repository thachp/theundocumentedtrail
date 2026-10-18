// Usage: node scripts/prepare-map-geography.mjs /absolute/path/countries-50m.json
// Input: world-atlas@2.0.2, Natural Earth 4.1.0. No network or runtime dependency.
import { readFile, writeFile } from "node:fs/promises";
import { MAP_BOUNDS } from "../src/journeyGeography.js";
import { PILOT_MAP_BOUNDS } from "../src/cambodiaGeography.js";
const topology = JSON.parse(await readFile(process.argv[2], "utf8"));
const { scale, translate } = topology.transform;
const arcs = topology.arcs.map((arc) => {
  let x = 0, y = 0;
  return arc.map(([dx, dy]) => { x += dx; y += dy; return [x * scale[0] + translate[0], y * scale[1] + translate[1]]; });
});
function ring(indices) {
  return indices.flatMap((index, i) => {
    const points = index < 0 ? [...arcs[~index]].reverse() : arcs[index];
    return i ? points.slice(1) : points;
  });
}
function clip(points, bounds) {
  let result = points;
  for (const [axis, edge, direction] of [[0, bounds[0], 1], [0, bounds[2], -1], [1, bounds[1], 1], [1, bounds[3], -1]]) {
    const input = result; result = [];
    for (let i = 0; i < input.length; i++) {
      const a = input[i], b = input[(i + 1) % input.length];
      const aInside = (a[axis] - edge) * direction >= 0, bInside = (b[axis] - edge) * direction >= 0;
      if (aInside) result.push(a);
      if (aInside !== bInside) {
        const t = (edge - a[axis]) / (b[axis] - a[axis]);
        result.push(a.map((v, j) => v + t * (b[j] - v)));
      }
    }
  }
  return result.map((p) => p.map((n) => Math.round(n * 100) / 100));
}
function simplify(points, tolerance = .04) {
  if (points.length < 5) return points;
  const first = points[0], last = points.at(-1);
  let maxDistance = 0, split = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [x, y] = points[i], dx = last[0] - first[0], dy = last[1] - first[1];
    const t = dx || dy ? Math.max(0, Math.min(1, ((x - first[0]) * dx + (y - first[1]) * dy) / (dx * dx + dy * dy))) : 0;
    const distance = Math.hypot(x - first[0] - t * dx, y - first[1] - t * dy);
    if (distance > maxDistance) { maxDistance = distance; split = i; }
  }
  return maxDistance > tolerance
    ? [...simplify(points.slice(0, split + 1), tolerance).slice(0, -1), ...simplify(points.slice(split), tolerance)]
    : [first, last];
}
const result = Object.fromEntries(Object.entries({ ...MAP_BOUNDS, ...PILOT_MAP_BOUNDS }).map(([familyId, bounds]) => [familyId,
  topology.objects.countries.geometries.flatMap((country) => {
    // Every first ring is an exterior. Inland holes are intentionally omitted
    // for this small-scale land context; it is not a political boundary map.
    const polygons = country.type === "Polygon" ? [country.arcs] : country.arcs;
    const rings = polygons.map((polygon) => ring(polygon[0])).filter((points) => {
      // No antimeridian polygons intersect these story windows.
      return !points.some((p, i) => i && Math.abs(p[0] - points[i - 1][0]) > 180);
    }).map((points) => simplify(clip(points, bounds), Math.max(.04, (bounds[2] - bounds[0]) / 536 * .6))).filter((points) => points.length > 2);
    return rings.length ? [{ name: country.properties.name, rings }] : [];
  })]));
await writeFile(new URL("../src/mapLand.json", import.meta.url), JSON.stringify(result));
