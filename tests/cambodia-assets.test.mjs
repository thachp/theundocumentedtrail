import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { CAMBODIA_HISTORY, CAMBODIA_SCENES, CAMBODIA_SOURCES } from "../src/cambodiaStory.js";
const read = p => readFile(new URL(p, import.meta.url), "utf8");
function rgb(hex) { return hex.match(/[a-f\d]{2}/gi).map(n => parseInt(n,16)/255); }
function luminance(values) { return values.map(c => c <= .04045 ? c/12.92 : ((c+.055)/1.055)**2.4).reduce((v,c,i) => v+c*[.2126,.7152,.0722][i],0); }
function contrast(a,b) { const [lo,hi] = [luminance(a),luminance(b)].sort((a,b)=>a-b); return (hi+.05)/(lo+.05); }
test("pilot parchment links retain normal-text contrast across the full map gradient", async () => {
  const css = await read("../src/cambodiaStory.css"), mapCss = await read("../src/journeyMap.css");
  // The P2 was a more-specific general pilot link rule overriding map credit.
  const rule = css.match(/\.cambodia-pilot \.journey-map a\s*\{([^}]+)\}/)?.[1];
  assert.ok(rule, "map-scoped link rule must beat the general dark-page link color");
  const ink = rgb(rule.match(/color:\s*(#[a-f\d]{6})/i)[1]);
  const gradient = mapCss.match(/background:\s*radial-gradient\([^;]+;/)[0].match(/#[a-f\d]{6}/gi).map(rgb);
  for (let i=0;i<=100;i++) {
    const background = gradient[0].map((c,j)=>c+(gradient[1][j]-c)*i/100);
    assert.ok(contrast(ink,background)>=4.5, `gradient stop ${i}: ${contrast(ink,background).toFixed(2)}:1`);
  }
  assert.match(css, /\.cambodia-pilot \.journey-map a:focus-visible\s*\{\s*outline-color:#174f49/);
});
test("the source drawer replaces the unread pinpoint and qualifies indexed policy evidence", () => {
  assert.match(CAMBODIA_SOURCES.C2.title, /Guide to the ECCC/);
  assert.match(CAMBODIA_SOURCES.C2.date, /not the judgment itself/);
  assert.doesNotMatch(JSON.stringify(CAMBODIA_SOURCES), /paragraph 277/);
  assert.match(CAMBODIA_HISTORY.historicalSummary, /announcement/);
  assert.match(CAMBODIA_HISTORY.historicalSummary, /full source-document verification remains pending/);
  assert.match(CAMBODIA_SCENES.find(s=>s.id==="C05").prose, /Indexed institutional records/);
  assert.match(CAMBODIA_SCENES.find(s=>s.id==="C06").context, /not a claim of universal enforcement/);
  assert.match(CAMBODIA_SOURCES.C9.date, /no reproduction permission obtained/);
});
test("the built fallback ships unchanged installed licenses and actual font copyright notices", async () => {
  for (const [name,pkg,copyright] of [
    ["IBM-Plex-Sans-OFL.txt","ibm-plex-sans","Copyright 2019 IBM Corp."],
    ["Rajdhani-OFL.txt","rajdhani","Copyright (c) 2014 Indian Type Foundry"],
  ]) {
    const notice = await read(`../public/licenses/${name}`);
    assert.ok(notice.includes(copyright));
    assert.ok(notice.endsWith(await read(`../node_modules/@fontsource/${pkg}/LICENSE`)));
    assert.equal(await read(`../dist/client/licenses/${name}`),notice);
  }
  assert.equal(await read("../public/licenses/world-atlas-ISC.txt"),await read("../docs/world-atlas-LICENSE"));
  assert.equal(await read("../dist/client/licenses/world-atlas-ISC.txt"),await read("../docs/world-atlas-LICENSE"));
  assert.match(await read("../dist/client/licenses/README.txt"), /public domain/);
});
