import { AlertTriangle, Heart, Zap, Clock, Building2, TrendingUp, TrendingDown } from 'lucide-react';
import { kpis } from '../../data/metrics';

const kpiItems = [
  {
    label: 'Active Faults',
    value: kpis.activeFaults.total,
    detail: `Sev 4-5: ${kpis.activeFaults.bySeverity[4] + kpis.activeFaults.bySeverity[5]}`,
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    trend: kpis.activeFaults.trend,
    trendDir: kpis.activeFaults.trendDirection,
  },
  {
    label: 'Equipment Health',
    value: `${kpis.equipmentHealth.score}%`,
    detail: 'Avg across all sites',
    icon: Heart,
    iconColor: 'text-emerald-500',
    trend: kpis.equipmentHealth.trend,
    trendDir: kpis.equipmentHealth.trendDirection,
  },
  {
    label: 'Energy Waste',
    value: kpis.energyWaste.monthlyCost,
    detail: `${kpis.energyWaste.daily.toLocaleString()} kWh/day`,
    unit: '',
    icon: Zap,
    iconColor: 'text-red-500',
    trend: kpis.energyWaste.trend,
    trendDir: kpis.energyWaste.trendDirection,
  },
  {
    label: 'Time Saved',
    value: kpis.timeSaved.hours,
    detail: kpis.timeSaved.trend,
    unit: 'hrs/mo',
    icon: Clock,
    iconColor: 'text-sky-500',
    trend: null,
    trendDir: 'up',
  },
  {
    label: 'Sites Monitored',
    value: kpis.sitesMonitored.count,
    detail: `${kpis.sitesMonitored.totalEquipment} equipment · ${kpis.sitesMonitored.coverage} coverage`,
    icon: Building2,
    iconColor: 'text-blue-500',
    trend: null,
    trendDir: null,
  },
];

export default function KPIBar() {
  return (
    <div className="grid grid-cols-5 gap-px bg-gray-200 border-b border-gray-200">
      {kpiItems.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div key={kpi.label} className="bg-white px-5 py-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{kpi.label}</span>
              <Icon size={16} className={kpi.iconColor} />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-semibold text-gray-900 tabular-nums">{kpi.value}</span>
              {kpi.unit && <span className="text-sm text-gray-500">{kpi.unit}</span>}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {kpi.trend && (
                <>
                  {kpi.trendDir === 'up' && kpi.label !== 'Time Saved' ? (
                    <TrendingUp size={12} className="text-red-500" />
                  ) : kpi.trendDir === 'down' ? (
                    <TrendingDown size={12} className="text-red-500" />
                  ) : null}
                </>
              )}
              <span className="text-xs text-gray-500">{kpi.detail}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
