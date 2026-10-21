import test from 'node:test';
import assert from 'node:assert/strict';
import { CAMBODIA_SCENES } from '../src/cambodiaExpanded/story.js';
import { illustratedMapForScene, cambodiaIllustratedLocation } from '../src/cambodiaIllustratedLocations.js';

const scene = id => CAMBODIA_SCENES.find(scene => scene.id === id);
test('illustrated artwork follows every main and branching household location', () => {
  const groups = {
    western: ['E01','E02','E03','R01'],
    border: ['E04','T01','M01','M02'],
    camp: ['E05','E06','E07','E08','E09','W01','J01','H01','F01'],
    longBeach: ['E10','E11','P01','P02'],
  };
  assert.deepEqual(Object.values(groups).flat().sort(), CAMBODIA_SCENES.map(s => s.id).sort());
  for (const [expected, ids] of Object.entries(groups)) for (const id of ids) {
    const current = scene(id);
    assert.equal(illustratedMapForScene(current).id, expected, id);
    const game = {cambodiaState:{sceneId:id}, progress:0};
    const before = JSON.stringify(game);
    assert.equal(cambodiaIllustratedLocation(game).id, expected, id);
    assert.equal(JSON.stringify(game), before, 'display selection never changes save state');
  }
});
test('letters about other camps leave the household in Long Beach', () => {
  for (const id of ['P01','P02']) {
    assert.match(scene(id).prose, /Site One|Site Two/);
    assert.equal(illustratedMapForScene(scene(id)).id, 'longBeach');
  }
});
