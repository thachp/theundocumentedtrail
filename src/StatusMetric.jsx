export function StatusMetric({ icon: Icon, value, label, tone = "default", tooltip }) {
  return (
    <div
      className={`status-metric ${tone}`}
      tabIndex="0"
      data-tooltip={tooltip}
      aria-label={`${label}: ${value}. ${tooltip}`}
    >
      <Icon weight="duotone" aria-hidden="true" />
      <span>
        <strong>{value}</strong>
        <small>{label}</small>
      </span>
    </div>
  );
}

