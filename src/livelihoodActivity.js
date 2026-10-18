// One authored episode at the existing Diop cooperative, not a job catalogue.
export const REPAIR_ACTIVITY_ID = "diop-repair-counter-v1";
export const REPAIR_TERMS = Object.freeze({ parts: 2, partCost: 20, benchFee: 5, upfront: 45, days: 1, supplies: 1, water: 2 });
export function isRepairScene(game) { return game.familyId === "diop" && game.eventId === "diopDakar"; }
export function repairRecord(game) { return game.livelihoodActivities?.[REPAIR_ACTIVITY_ID] ?? null; }
export function repairActive(game) { return repairRecord(game)?.phase === "active"; }
export function repairUnavailable(game) {
  if (!isRepairScene(game) || game.phase !== "decision" || game.status !== "playing" || game.pendingIncident) return "Available only before the Diop cooperative decision.";
  if (repairRecord(game)) return "This repair-counter day has already been committed.";
  if (game.completedRoadsideWork?.diopDakar) return "The cooperative’s one optional work slot has already been used.";
  if (game.people.ibrahima?.alive === false || game.people.ibrahima?.health <= 35) return "Ibrahima needs rest; this skilled shift is unavailable.";
  if (game.resources.cash < REPAIR_TERMS.upfront) return "Requires $45 upfront in fictional game units.";
  if (game.resources.supplies < 1 || game.resources.water < 2) return "Set aside one food day and 2 L of water before committing.";
  return null;
}
function demand(instanceId) {
  // Fixed for this durable instance: refresh/summary/navigation cannot reroll.
  let n = 0; for (const c of instanceId) n = (Math.imul(n,31) + c.charCodeAt(0)) >>> 0;
  return 1 + (n % 2);
}
export function beginRepair(game) {
  if (repairUnavailable(game)) return game;
  const instanceId = `${game.runId ?? "legacy-run"}:${REPAIR_ACTIVITY_ID}`;
  const activity = { version: 1, instanceId, phase: "active", step: 0, startedDay: game.day, upfrontPaid: REPAIR_TERMS.upfront, inventoryBought: 2 };
  return { ...game, resources: { ...game.resources, cash: game.resources.cash - activity.upfrontPaid, supplies: game.resources.supplies - 1, water: game.resources.water - 2 }, livelihoodActivities: { ...(game.livelihoodActivities ?? {}), [REPAIR_ACTIVITY_ID]: activity } };
}
export function advanceRepair(game) {
  const activity = repairRecord(game);
  if (!isRepairScene(game) || !repairActive(game) || activity.step !== 0) return game;
  return { ...game, livelihoodActivities: { ...game.livelihoodActivities, [REPAIR_ACTIVITY_ID]: { ...activity, step: 1 } } };
}
export function settleRepair(game, { summary = false } = {}) {
  const activity = repairRecord(game);
  if (!isRepairScene(game) || !repairActive(game) || (!summary && activity.step !== 1)) return game;
  const sold = demand(activity.instanceId), returned = activity.inventoryBought - sold;
  const revenue = sold * 60, refund = returned * REPAIR_TERMS.partCost;
  const netCash = revenue + refund - activity.upfrontPaid;
  const ledger = { revenue, refund, upfront: activity.upfrontPaid, inventoryCost: 40, operatingCost: 5, feesAtSettlement: 0, lossCost: 0, netCash,
    inventory: { bought: 2, sold, consumed: 0, retained: 0, returned, spoiled: 0, lost: 0 }, foodProduced: 0, foodConsumed: 1, waterConsumed: 2, elapsedDays: 1 };
  const settled = { ...activity, phase: "settled", step: 2, settledDay: game.day + 1, ledger };
  const copy = `${sold} agreed repair${sold === 1 ? " is" : "s are"} collected. Revenue $${revenue}; unused-parts refund $${refund}; upfront parts $40 and bench fee $5 already paid. Net cash +$${netCash}. One day, one food day and 2 L of water used. The optional work slot is finished; the next story decision is still yours.`;
  return { ...game, day: game.day + 1,
    resources: { ...game.resources, cash: game.resources.cash + revenue + refund },
    livelihoodActivities: { ...game.livelihoodActivities, [REPAIR_ACTIVITY_ID]: settled },
    completedRoadsideWork: { ...game.completedRoadsideWork, diopDakar: REPAIR_ACTIVITY_ID },
    flags: { ...game.flags, repairCounterCompleted: true },
    lastRoadsideOutcome: { eventId: "diopDakar", id: REPAIR_ACTIVITY_ID, title: "The repair counter balances its books", copy, tone: "trusted", consequence: `Net cash +$${netCash} · One day · Food -1 day · Water -2 L`, appliedBonuses: [] },
    activityLog: [...game.activityLog, { day: activity.startedDay, kind: "work", title: "One repair-counter day", detail: copy, tone: "trusted" }],
  };
}
export function repairFollowUp(game) {
  const activity = repairRecord(game);
  if (game.familyId !== "diop" || game.eventId !== "diopSaintLouis" || activity?.phase !== "settled") return null;
  return `The cooperative counter added $${activity.ledger.netCash} net after parts and the bench fee. That day also used one food day and 2 L of water, and our calendar moved forward. The cash is already in our budget; it is not another payment. Now we weigh the choices at Saint-Louis.`;
}
