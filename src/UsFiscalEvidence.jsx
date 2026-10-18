import { US_FISCAL_CASES, usFiscalEvidenceAvailable } from "./usFiscalEvidence.js";
import "./sharedPlace.css";

export function UsFiscalEvidence({ game }) {
  if (!usFiscalEvidenceAvailable(game)) return null;
  return <details className="shared-place-context us-fiscal-evidence">
    <summary><span>Optional · United States · dated evidence</span><strong>Whose budget, which year?</strong></summary>
    <h3>Two questions, different budgets</h3>
    <p>These historical case studies sit outside the Ramírez family’s fictional timeline. They do not establish this household’s status, eligibility, costs or contributions, or describe today’s policy.</p>
    {US_FISCAL_CASES.map(source => <section className="shared-place-source" key={source.id} aria-label={source.title}>
      <h4>{source.title}</h4>
      <p><strong>{source.figures}</strong></p>
      <dl>
        <dt>Population/category</dt><dd>{source.population}</dd>
        <dt>Period</dt><dd>{source.period}</dd>
        <dt>Geography</dt><dd>{source.geography}</dd>
        <dt>Government level</dt><dd>{source.governmentLevel}</dd>
        <dt>Unit / denominator</dt><dd>{source.denominator}</dd>
        <dt>Method / exclusions</dt><dd>{source.method}</dd>
        <dt>Uncertainty / limits</dt><dd>{source.limit}</dd>
      </dl>
      <p><a href={source.url} target="_blank" rel="noreferrer">CBO · {source.published} (opens in a new tab)</a><small>{source.locator}</small></p>
    </section>)}
    <h4>Read them together without pooling them</h4>
    <p>A projected federal gain does not fund a particular city’s immediate shortfall automatically. Different population windows, years and levels of government prevent subtracting these headlines into one migration balance. Distribution, funding decisions and service capacity still matter.</p>
    <p className="shared-place-limit">These estimates cannot decide a family’s legal claim or human worth. This context awards no score, changes no resources and saves no decision. Close it whenever you wish; the journey choices remain available.</p>
  </details>;
}
