import { severityConfig } from '../../utils/helpers';

export default function SeverityBadge({ severity, showLabel = true }) {
  const cfg = severityConfig[severity] || severityConfig[1];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {severity}
      {showLabel && <span className="hidden sm:inline">— {cfg.label}</span>}
    </span>
  );
}
