// Authored game occasions, not continuous ration accounting across months.
const occasions = new Set(['E02','E03','R01','E04','W01','E06','E07','J01']);
export const usesResourceRules = state => state.resourceRulesVersion === 2;
export function resourceEffects(state, choice) {
 if (!usesResourceRules(state)) return {effects:{},notes:[]};
 const effects={},notes=[];
 if (occasions.has(state.sceneId)) {
  // An already-authored consumption counts toward this occasion's use.
  if (!(choice.effects.supplies < 0)) effects.supplies=-1;
  if (!(choice.effects.water < 0)) effects.water=-1;
  notes.push('This occasion uses carried food and clean water.');
 }
 if (state.sceneId==='E05') {
  effects.supplies=2;
  if (choice.id!=='water') effects.water=2;
  notes.push('Reception assistance replenishes food and water; it is not earned by payment or work.');
 }
 if (state.sceneId==='E06' && choice.id==='help') {
  effects.supplies=(effects.supplies??0)+1;effects.water=(effects.water??0)+2;
  notes.push('Coordinating relief tasks brings water and food while Maly waits for care.');
 }
 if (state.sceneId==='E07' && choice.id==='meal') {
  effects.supplies=(effects.supplies??0)+2;effects.water=(effects.water??0)+2;
  notes.push('The shared meal also includes help collecting clean water; this replenishes stores instead of bringing an exchange payment.');
 }
 if (state.sceneId==='E10') {
  effects.supplies=2;effects.water=2;
  notes.push('In this invented arrival occasion, their relative shares food and clean water. Earlier fatigue and spending still carry forward.');
 }
 if (state.sceneId==='E08' && choice.id==='relative' && state.resources.cash===0) notes.push('With no exchange means left, a neighbor shares writing materials; the letter remains possible.');
 if (state.sceneId==='E08' && choice.id==='records' && state.flags.contact==='notes') {
  effects.stress=-1;
  notes.push('The protected paper contact notes make organizing questions less stressful; they are not identity papers or proof of eligibility.');
 }
 return {effects,notes,consumes:occasions.has(state.sceneId)};
}
export function resourceHint(state) {
 if (!usesResourceRules(state)) return 'Original resource rules retained for this saved run. Restart this edition to use the revised resource model.';
 return `${occasions.has(state.sceneId)?'Food and clean water are used during this occasion. Empty stores add fatigue and stress; help remains available. ':''}${state.sceneId==='E05'?'Each reception choice includes food and water assistance. ':''}${state.sceneId==='E06'?'Coordinating with relief staff also helps replenish supplies. ':''}${state.sceneId==='E07'?'Preparing the shared meal also replenishes food and water. ':''}${state.sceneId==='E10'?'Their relative shares food and clean water during this arrival occasion. ':''}Quantities appear after the choice.`;
}
export function resourceContext(state) {
 const california=['E10','E11','P01','P02'].includes(state.sceneId);
 return {label:california?'Household budget units':'Exchange units',description:california
  ? 'Cash and practical purchasing room in California, expressed as fictional budget units, not dollar amounts. The carried balance summarizes household means; no currency conversion is implied.'
  : 'Portable exchange means, not U.S. dollars or a riel wallet. In late 1979 this represents remaining tradable belongings; in Thai refuge it includes modest informal exchanges. Relief and clinical assessment do not require payment.'};
}
export function householdInventory(state) {
 return [state.flags.contact==='notes'?'Paper contact notes: confirmed names kept separate from rumors':'Family names and remembered contacts: some details remain uncertain',
  state.flags.routeCare==='group'||state.flags.contact==='neighbors'?'Known companions: shared planning, without a guarantee of safety':null,
  state.flags.application==='relative'?'Letter to the Long Beach relative: support questions, not admission approval':null,
  state.flags.application==='records'?'Written household questions: not replacement identity documents':null,
  state.flags.departure==='contact'?'Shared postal addresses: exchanged with permission':null].filter(Boolean);
}

export function resourceChoiceHint(state) {
 if (!usesResourceRules(state)) return '';
 return occasions.has(state.sceneId)?'Uses carried food and clean water.':state.sceneId==='E05'?'Includes food and water assistance.':state.sceneId==='E10'?'Includes a meal and water shared by their relative.':'';
}
