// Dated case studies, not a forecast or a fiscal attribute of a fictional family.
export const US_FISCAL_CASES = [
  {
    id: "state-local-2023",
    title: "State and local budgets · retrospective estimate",
    published: "5 June 2025",
    period: "Calendar year 2023",
    geography: "United States aggregate; not one city",
    governmentLevel: "State and local governments",
    population: "Incremental 2021–2023 surge, primarily CBO’s ‘other foreign nationals’; includes people with and without permission to remain. Not all immigrants or all undocumented residents.",
    figures: "$10.1bn additional taxes; $19.3bn additional spending; $9.2bn direct net cost",
    denominator: "Billions of U.S. dollars in 2023; net cost ≈0.3% of state/local spending excluding federal grants. No per-person denominator.",
    method: "Estimated against a no-surge counterfactual, not a directly observed bill attributed to individuals.",
    limit: "Uncertain methods; geographic variation. Direct spending excludes some crowding and broader effects considered in CBO’s separate potential-effects measure.",
    url: "https://www.cbo.gov/publication/61464",
    locator: "Summary; CBO’s Analysis; How Immigration Affects State and Local Budgets",
  },
  {
    id: "federal-projection-2024",
    title: "Federal budget · dated projection",
    published: "23 July 2024",
    period: "2024–2034 projection made in 2024",
    geography: "United States",
    governmentLevel: "Federal government",
    population: "Incremental 2021–2026 surge, primarily CBO’s ‘other foreign nationals’; includes people with and without permission. Not all immigration; a different cohort window from the 2023 case.",
    figures: "About $0.9tn lower projected deficits over 2024–2034",
    denominator: "Trillions of U.S. dollars accumulated across 2024–2034 versus a no-surge counterfactual; not annual or per-person.",
    method: "Revenues exceed added mandatory spending and interest. Discretionary spending is excluded from that headline; proportional increases could add $0.2tn over the same period, conditional on lawmakers’ choices.",
    limit: "Very uncertain, dated model—not a measured present outcome. Excludes state/local budgets; not a guarantee for a person or later cohort.",
    url: "https://www.cbo.gov/publication/60165",
    locator: "Summary; Budgetary Effects",
  },
];

export function usFiscalEvidenceAvailable(game) {
  return game?.familyId === "ramirez" && game?.eventId === "detention";
}
