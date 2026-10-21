export const percent = value => Math.max(0,Math.min(100,Math.round(value)));
export const stressPercent = state => percent(state.resources.stress * 5);

// Reconstruct an authored exposure index from committed travel decisions and
// the current setting. No new save field, random roll or legal-outcome gate.
const exposureChanges = {
 'E01:notes':-2,'E01:neighbors':-3,
 'E02:pause':3,'E02:bundles':4,'E02:summary':8,
 'E03:help':-3,'E03:guard':3,'E03:offer':12,
 'E04:wait':-4,'E04:care':-3,'E04:group':-6,
 'T01:share':-3,'T01:exchange':4,'T01:rest':-2,
};
export function exposurePercent(state, scene) {
 const travel = state.history.reduce((value,entry)=>value+(exposureChanges[`${entry.sceneId}:${entry.choiceId}`]??0),12);
 const setting = scene.coordinates[0]<0 ? -10 : scene.coordinates[0]===102.5 ? -6 : 0;
 return percent(travel+setting);
}
