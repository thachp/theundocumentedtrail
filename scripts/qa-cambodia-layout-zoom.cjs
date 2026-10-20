// Real Chromium Page zoom, not viewport, CSS zoom, pinch zoom or DPR emulation.
const { chromium } = require('playwright');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const assert = require('node:assert/strict');
const report = {
  head: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  dirty: !!execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim(),
  setup: 'Persistent fresh profiles; headless Chromium; viewport:null; fixed Browser window bounds; chrome://settings/appearance Page zoom select #zoomLevel = 2; no deviceScaleFactor or CSS zoom applied',
  zoom: [], scenes: [], flows: [], errors: [], browserChromeFocusTransitions: 0,
};
const saveKey = 'undocumented-trail:review:cambodia-1979:v3';
const readSave = page => page.evaluate(key => localStorage.getItem(key), saveKey);
async function focusPress(locator, page) { await locator.focus(); await page.keyboard.press('Enter'); }
async function containedTabs(page, dialog, count = 10) {
  for (let i = 0; i < count; i++) {
    await page.keyboard.press(i % 3 === 0 ? 'Shift+Tab' : 'Tab');
    const focus=await dialog.evaluate(d=>({inside:d.contains(document.activeElement),active:document.activeElement.tagName,documentFocused:document.hasFocus(),modal:d.matches(':modal')}));
    if(!focus.inside && !focus.documentFocused && focus.active==='BODY' && focus.modal) report.browserChromeFocusTransitions++;
    else assert.ok(focus.inside, `Tab must not focus background application controls: ${JSON.stringify(focus)}`);
  }
  // Native dialogs permit browser-chrome navigation. Tab back into the page
  // before sending app dismissal keys; CDP can otherwise inject Escape into
  // a document that a real user's keyboard would not currently target.
  for(let i=0;i<6&&!await page.evaluate(()=>document.hasFocus());i++) await page.keyboard.press('Tab');
  assert.ok(await dialog.evaluate(d=>document.hasFocus()&&d.contains(document.activeElement)), 'Tab returns from browser chrome to the modal');
}
(async () => {
  for (const width of [1440, 780, 640]) for (const mode of ['guided', 'full']) {
    const profile = fs.mkdtempSync('/tmp/cambodia-zoom-qa-');
    const context = await chromium.launchPersistentContext(profile, {
      headless: true, executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
      viewport: null, reducedMotion: 'reduce', args: ['--no-sandbox', `--window-size=${width},1000`],
    });
    try {
      report.browser ??= context.browser().version();
      const page = context.pages()[0];
      page.on('pageerror', error => report.errors.push({ mode, width, error: error.message }));
      const cdp = await context.newCDPSession(page);
      const { windowId } = await cdp.send('Browser.getWindowForTarget');
      const url = `http://localhost:5173/?story=cambodia-1979&edition=3${mode === 'full' ? '&mode=full' : ''}`;
      const measure = async () => ({
        bounds: (await cdp.send('Browser.getWindowBounds', { windowId })).bounds,
        ...await page.evaluate(() => ({ outer: [outerWidth, outerHeight], inner: [innerWidth, innerHeight], dpr: devicePixelRatio, visualScale: visualViewport.scale, cssZoom: getComputedStyle(document.documentElement).zoom })),
      });
      await page.goto(url);
      await cdp.send('Browser.setWindowBounds', { windowId, bounds: { width, height: 1000 } });
      const baseline = await measure();
      await page.goto('chrome://settings/appearance');
      await page.locator('#zoomLevel').selectOption('2');
      assert.equal(await page.locator('#zoomLevel').inputValue(), '2');
      await page.goto(url);
      await cdp.send('Browser.setWindowBounds', { windowId, bounds: { width, height: 1000 } });
      await page.waitForTimeout(150);
      const zoomed = await measure();
      assert.deepEqual(zoomed.outer, baseline.outer);
      assert.equal(zoomed.inner[0], baseline.inner[0] / 2);
      assert.equal(zoomed.dpr, baseline.dpr * 2);
      assert.equal(zoomed.visualScale, 1);
      assert.equal(zoomed.cssZoom, '1');
      report.zoom.push({ mode, width, baseline, zoomed });
      const fixtures = await page.evaluate(async () => {
        const { STORY, sceneFor } = await import('/src/cambodiaExpanded/story.js');
        const api = await import('/src/cambodiaExpanded/state.js');
        const queue = [api.startState(api.createState(STORY))], states = {};
        while (queue.length) {
          const state = queue.shift();
          if (states[state.sceneId]) continue;
          states[state.sceneId] = state;
          for (const choice of sceneFor(state).choices) {
            const next = api.continueState(STORY, api.chooseState(STORY, state, choice.id));
            if (next.phase !== 'complete') queue.push(next);
          }
        }
        return states;
      });
      async function load(id) {
        await page.evaluate(({ state, key }) => localStorage.setItem(key, JSON.stringify({ ...state, runId: 'native-zoom-fixture', saveRevision: 0 })), { state: fixtures[id], key: saveKey });
        await page.goto(url);
        await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0),null,{timeout:15000});
      }
      for (const id of ['E01', 'H01', 'F01', 'E10']) {
        await load(id);
        const layout = await page.evaluate(() => ({
          width: innerWidth, dpr: devicePixelRatio,
          overflow: document.documentElement.scrollWidth > innerWidth,
          images: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.src),
          roster: (document.querySelector('[aria-label="People traveling together"],.character-row')?.textContent || ''),
          reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
          motion: getComputedStyle(document.querySelector('.decision,.cinematic-choice')).animationDuration,
          body: document.body.innerText,
        }));
        assert.equal(layout.width, width / 2); assert.equal(layout.dpr, 2);
        assert.equal(layout.overflow, false); assert.deepEqual(layout.images, []);
        assert.ok(layout.reducedMotion);
        assert.ok(layout.motion.split(',').every(value=>parseFloat(value)<=0.01), 'reduced-motion animation duration is suppressed');
        for (const name of ['Dara', 'Vann', 'Maly', 'Sophea']) assert.ok(layout.body.includes(name));
        if (id.startsWith('P')) assert.ok(layout.body.includes('Long Beach') && layout.body.includes('1985'));
        delete layout.body;
        report.scenes.push({ mode, width, id, ...layout });
        if (process.env.CAMBODIA_ZOOM_CAPTURE && ['E07', 'P02'].includes(id)) await page.screenshot({ path: `artifacts/cambodia-expanded/zoom200-${mode}-${width}-${id}.png`, fullPage: true });
      }
      await load('E08');
      const unchanged = await readSave(page);
      for (let repeat = 0; repeat < 2; repeat++) {
        if (mode === 'guided' && await page.getByRole('button', { name: 'Journey tools', exact: true }).isVisible()) await focusPress(page.getByRole('button', { name: 'Journey tools', exact: true }), page);
        await focusPress(page.getByRole('button', { name: 'Explore the history', exact: true }).first(), page);
        const dialog = page.getByRole('dialog');
        await dialog.waitFor(); await containedTabs(page, dialog);
        await focusPress(dialog.locator('.history-explore summary'), page);
        assert.equal(await dialog.locator('.history-sources a').count(), 10);
        await page.keyboard.press('Escape');
        assert.equal(await page.getByRole('dialog').count(), 0);
        assert.ok(await page.evaluate(() => document.activeElement.matches('[data-history-return],button[aria-label="Explore the history"]') && document.activeElement.getClientRects().length > 0));
        const people = page.locator(mode === 'guided' ? '.cinematic-person' : '.character-card');
        await focusPress(people.nth(repeat ? 3 : 0), page);
        const person = page.getByRole('dialog'); await person.waitFor();
        assert.match(await person.innerText(), /Health:/);
        await containedTabs(page, person, 5);
        await page.keyboard.press('Escape'); assert.equal(await page.getByRole('dialog').count(), 0);
        const returned=await people.nth(repeat ? 3 : 0).evaluate(node=>({same:node===document.activeElement,focus:document.hasFocus(),active:document.activeElement.outerHTML.slice(0,240)})); assert.ok(returned.same, `person focus return ${JSON.stringify(returned)}`);
      }
      assert.equal(await readSave(page), unchanged, 'reading and dismissing dialogs changes no choice');
      await load('E01'); const decision = page.getByRole('button', { name: /Protect the contact notes/ });
      const before = await readSave(page);
      if (mode === 'full') {
        for (const dismiss of ['Escape', 'Keep thinking', 'Close decision']) {
          await focusPress(decision, page); const dialog = page.getByRole('dialog'); await dialog.waitFor();
          assert.ok(await dialog.evaluate(d => d.contains(document.activeElement)));
          await containedTabs(page, dialog);
          if (dismiss === 'Escape') await page.keyboard.press('Escape');
          else await focusPress(dialog.getByRole('button', { name: dismiss, exact: true }), page);
          assert.equal(await page.getByRole('dialog').count(), 0);
          assert.ok(await decision.evaluate(node => node === document.activeElement));
          assert.equal(await readSave(page), before, 'dismiss does not commit or charge');
        }
      }
      await focusPress(decision, page);
      if (mode === 'full') await focusPress(page.getByRole('button', { name: 'Make this choice', exact: true }), page);
      assert.equal(JSON.parse(await readSave(page)).phase, 'consequence');
      const savedOutcome = await readSave(page); await page.reload(); assert.equal(await readSave(page), savedOutcome);
      const continueButton = page.getByRole('button', { name: mode === 'guided' ? 'Continue the journey' : 'Continue journey', exact: true });
      await focusPress(continueButton, page);
      assert.equal(JSON.parse(await readSave(page)).sceneId, 'E02');
      const resumed = await readSave(page); await page.reload(); assert.equal(await readSave(page), resumed);
      assert.equal((await measure()).dpr, 2);
      report.flows.push({ mode, width, sourceAndRosterRepeatDismiss: true, focusContainedAndRestored: true, decisionDismissRepeat: mode === 'full' ? 3 : 'direct choice', outcomeResume: true, decisionResume: true, reducedMotion: 'emulated preference; computed animation duration recorded' });
      console.log(`PASS ${mode} ${width}px outer / ${width / 2}px layout at genuine 200%`);
    } finally { await context.close(); }
  }
  assert.deepEqual(report.errors, []);
})().then(() => {
  fs.writeFileSync(process.env.CAMBODIA_QA_REPORT || '/tmp/cambodia-native-zoom-report.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ head: report.head, zoomProofs: report.zoom.length, sceneChecks: report.scenes.length, flows: report.flows.length, pageErrors: report.errors.length }));
}).catch(error => {
  report.failure = error.stack;
  fs.writeFileSync(process.env.CAMBODIA_QA_REPORT || '/tmp/cambodia-native-zoom-report.json', JSON.stringify(report, null, 2));
  console.error(error); process.exitCode = 1;
});
