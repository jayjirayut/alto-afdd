export const DEMO_NOW = new Date('2026-03-24T09:30:00+07:00');

export const severityConfig = {
  1: { label: 'Info', color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400', ring: 'ring-gray-200' },
  2: { label: 'Minor', color: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500', ring: 'ring-blue-200' },
  3: { label: 'Moderate', color: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500', ring: 'ring-amber-200' },
  4: { label: 'Major', color: 'bg-orange-50 text-orange-700', dot: 'bg-orange-500', ring: 'ring-orange-200' },
  5: { label: 'Critical', color: 'bg-red-50 text-red-700', dot: 'bg-red-500', ring: 'ring-red-200' },
};

export const statusConfig = {
  active: { label: 'Active', color: 'bg-red-50 text-red-700', dot: 'bg-red-500' },
  acknowledged: { label: 'Acknowledged', color: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  resolved: { label: 'Resolved', color: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
};

export const agentStatusConfig = {
  live: { label: 'Live', color: 'text-emerald-600', dot: 'bg-emerald-500', bg: 'bg-emerald-50' },
  dev: { label: 'Dev', color: 'text-amber-600', dot: 'bg-amber-500', bg: 'bg-amber-50' },
  planned: { label: 'Planned', color: 'text-gray-500', dot: 'bg-gray-400', bg: 'bg-gray-50' },
};

export const equipmentStatusConfig = {
  online: { label: 'Online', dot: 'bg-emerald-500', color: 'text-emerald-700' },
  offline: { label: 'Offline', dot: 'bg-gray-400', color: 'text-gray-500' },
  degraded: { label: 'Degraded', dot: 'bg-amber-500', color: 'text-amber-700' },
};

export const formatDate = (isoString) => {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatDateTime = (isoString) => {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
  });
};

export const formatRelativeTime = (isoString) => {
  const now = DEMO_NOW;
  const d = new Date(isoString);
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(isoString);
};

export const getHealthColor = (score) => {
  if (score >= 90) return 'text-emerald-600';
  if (score >= 75) return 'text-amber-600';
  return 'text-red-600';
};

export const getHealthBg = (score) => {
  if (score >= 90) return 'bg-emerald-50';
  if (score >= 75) return 'bg-amber-50';
  return 'bg-red-50';
};

export const formatNumber = (n) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
};

// Convert kWh/day waste to ฿/month cost (at ฿3.50/kWh)
export const kwhToBaht = (kwhPerDay) => Math.round(kwhPerDay * 30 * 3.5);

export const formatBaht = (baht) => `฿${baht.toLocaleString()}`;
