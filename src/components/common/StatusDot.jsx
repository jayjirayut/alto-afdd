export default function StatusDot({ status, config, showLabel = true, size = 'sm' }) {
  const sizeClasses = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
  };

  const cfg = config[status] || { dot: 'bg-gray-400', label: status };

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`${sizeClasses[size]} rounded-full ${cfg.dot} shrink-0`} />
      {showLabel && <span className={`text-sm ${cfg.color || 'text-gray-600'}`}>{cfg.label}</span>}
    </span>
  );
}
