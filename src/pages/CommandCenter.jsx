import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, LineChart, Line, ResponsiveContainer, Tooltip, XAxis,
} from 'recharts';
import {
  AlertTriangle, Zap, ArrowRight, HardDrive, Radio, Shield, Banknote,
  Clock, Activity, MapPin, ListChecks,
} from 'lucide-react';
import { faults } from '../data/faults';
import { getSiteById } from '../data/sites';
import { equipment, equipmentTypes, equipmentIconMap } from '../data/equipment';
import { getAllAgents } from '../data/agents';
import { energyWaste24h, faultRate24h } from '../data/metrics';
import {
  severityConfig, agentStatusConfig, formatRelativeTime, getHealthColor, kwhToBaht, formatBaht, DEMO_NOW,
} from '../utils/helpers';

const SITE_ID = 'central-rama-9';
const TOOLTIP_STYLE = { fontSize: '10px', borderRadius: '6px', border: '1px solid #e5e7eb' };
const EFFORT_CFG = {
  urgent: { label: 'Urgent', bg: 'bg-red-50 text-red-700' },
  medium: { label: 'Medium', bg: 'bg-amber-50 text-amber-700' },
  routine: { label: 'Routine', bg: 'bg-gray-100 text-gray-600' },
};

export default function CommandCenter() {
  const navigate = useNavigate();
  const [clock, setClock] = useState(DEMO_NOW);

  useEffect(() => {
    const t = setInterval(() => setClock(prev => new Date(prev.getTime() + 1000)), 1000);
    return () => clearInterval(t);
  }, []);

  // All data derivations memoized — clock tick won't re-run these
  const { site, siteEquip, activeFaults, criticalFaults, recentFaults, totalWaste, totalCostMonth, avgHealth, punchList, typeStats } = useMemo(() => {
    const s = getSiteById(SITE_ID);
    const eq = equipment.filter(e => e.site === SITE_ID);
    const sf = faults.filter(f => f.site === SITE_ID);
    const active = sf.filter(f => f.status !== 'resolved');
    const critical = sf.filter(f => f.severity >= 4 && f.status !== 'resolved');
    const recent = [...sf].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 12);
    const waste = active.reduce((sum, f) => sum + (f.energyWaste || 0), 0);
    const health = Math.round(eq.reduce((sum, e) => sum + e.healthScore, 0) / eq.length);
    const punch = active.filter(f => f.energyWaste > 0).sort((a, b) => b.energyWaste - a.energyWaste).slice(0, 5).map((f, i) => ({
      priority: i + 1,
      action: f.recommendations?.[0]?.action || `Address ${f.faultType}`,
      equipment: f.equipmentName,
      savingsMonth: kwhToBaht(f.energyWaste),
      effort: f.severity >= 4 ? 'urgent' : f.severity >= 3 ? 'medium' : 'routine',
    }));
    const types = equipmentTypes.map(type => {
      const items = eq.filter(e => e.type === type.id);
      if (items.length === 0) return null;
      const avg = Math.round(items.reduce((sum, e) => sum + e.healthScore, 0) / items.length);
      const faultCount = items.reduce((sum, e) => sum + e.activeFaults, 0);
      return { ...type, items, avg, faultCount, count: items.length };
    }).filter(Boolean);
    return { site: s, siteEquip: eq, activeFaults: active, criticalFaults: critical, recentFaults: recent, totalWaste: waste, totalCostMonth: kwhToBaht(waste), avgHealth: health, punchList: punch, typeStats: types };
  }, []);

  const allAgents = useMemo(() => getAllAgents(), []);
  const liveCount = allAgents.filter(a => a.status === 'live').length;
  const devCount = allAgents.filter(a => a.status === 'dev').length;
  const plannedCount = allAgents.filter(a => a.status === 'planned').length;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50">
      {/* Row 1: Status Strip */}
      <div className="h-11 bg-white border-b border-gray-200 flex items-center justify-between px-5 shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">CP9 Command Center</span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin size={10} />
            Central Rama 9
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock size={12} />
            <span className="font-mono tabular-nums">{clock.toLocaleTimeString('en-US', { hour12: false })}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-emerald-600">LIVE</span>
          </span>
        </div>
        <div className="flex items-center gap-6">
          <StatChip icon={AlertTriangle} label="Active" value={activeFaults.length} color="text-red-600" />
          <StatChip icon={Activity} label="Health" value={`${avgHealth}%`} color={getHealthColor(avgHealth)} />
          <StatChip icon={Banknote} label="Avoidable" value={`${formatBaht(totalCostMonth)}/mo`} color="text-red-600" />
          <StatChip icon={HardDrive} label="Equipment" value={siteEquip.length} color="text-sky-600" />
        </div>
        <div className="text-xs text-gray-400">Sync: 09:29:47</div>
      </div>

      {/* Row 2: Critical Alerts */}
      {criticalFaults.length > 0 ? (
        <div className="bg-red-50 border-b border-red-200 px-5 py-2 shrink-0 flex items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Critical</span>
          </div>
          {criticalFaults.map(fault => (
            <div key={fault.id} className="flex items-center gap-3 bg-white border border-red-200 rounded-lg px-3 py-1.5 cursor-pointer hover:shadow-sm" onClick={() => navigate('/faults')}>
              <span className={`text-xs font-bold ${severityConfig[fault.severity].color} px-1.5 py-0.5 rounded-full`}>SEV {fault.severity}</span>
              <span className="text-sm font-semibold text-gray-900">{fault.equipmentName}</span>
              <span className="text-sm text-red-700">{fault.faultType}</span>
              <span className="text-xs text-gray-400">{formatRelativeTime(fault.timestamp)}</span>
              {fault.energyWaste > 0 && <span className="text-xs text-amber-600 font-medium flex items-center gap-0.5"><Zap size={9} />{fault.energyWaste} kWh/d</span>}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-1.5 shrink-0 flex items-center gap-2">
          <Shield size={12} className="text-emerald-600" />
          <span className="text-xs font-medium text-emerald-700">No critical alerts</span>
        </div>
      )}

      {/* Row 3: Main 3-Column Layout — CSS Grid with fixed right column */}
      <div className="flex-1 grid grid-cols-[1fr_1fr_320px] gap-3 p-3 min-h-0 overflow-hidden">

        {/* Column 1: Site + Equipment Types */}
        <div className="overflow-y-auto space-y-3 min-h-0">
          {/* CP9 Compact Hero */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Central Rama 9</h2>
                <span className="text-[11px] text-gray-500">{site.buildingType} · {site.totalArea}</span>
              </div>
              <span className="px-2 py-0.5 bg-sky-50 text-sky-700 text-[10px] font-bold rounded-full uppercase">Pilot</span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Health</div>
                <div className={`text-2xl font-bold tabular-nums ${getHealthColor(site.healthScore)}`}>{site.healthScore}<span className="text-sm">%</span></div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Coverage</div>
                <div className="text-2xl font-bold tabular-nums text-sky-600">{site.afddCoverage}<span className="text-sm">%</span></div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Equip</div>
                <div className="text-2xl font-bold tabular-nums text-gray-900">{site.equipmentCount}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Faults</div>
                <div className={`text-2xl font-bold tabular-nums ${site.activeFaults > 5 ? 'text-red-600' : 'text-amber-600'}`}>{site.activeFaults}</div>
              </div>
            </div>
          </div>

          {/* Equipment by Type — compact 3-col grid */}
          <div>
            <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Equipment by Type</h2>
            <div className="grid grid-cols-3 gap-2">
              {typeStats.map(type => {
                const Icon = equipmentIconMap[type.icon] || equipmentIconMap.Snowflake;
                const bgTint = type.avg >= 90 ? 'bg-emerald-50/60' : type.avg >= 75 ? 'bg-amber-50/60' : 'bg-red-50/60';
                return (
                  <div key={type.id} className={`${bgTint} border border-gray-200 rounded-lg p-2.5`}>
                    <div className="flex items-center gap-1 mb-1">
                      <Icon size={12} className="text-sky-500" />
                      <span className="text-xs font-medium text-gray-900">{type.name}</span>
                      <span className="text-[10px] text-gray-400 ml-auto">{type.count}</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className={`text-lg font-bold tabular-nums ${getHealthColor(type.avg)}`}>{type.avg}%</span>
                      {type.faultCount > 0 && <span className="text-[10px] font-semibold text-red-600">{type.faultCount}f</span>}
                    </div>
                    <div className="flex gap-0.5 mt-1.5">
                      {type.items.map(eq => {
                        const bg = eq.healthScore >= 90 ? 'bg-emerald-400' : eq.healthScore >= 80 ? 'bg-emerald-300' : eq.healthScore >= 70 ? 'bg-amber-300' : eq.healthScore >= 60 ? 'bg-amber-400' : 'bg-red-400';
                        return (
                          <div key={eq.id} className="flex-1 group relative">
                            <div className={`h-1.5 rounded-full ${bg}`} />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                              {eq.name}: {eq.healthScore}%
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Punch List — prioritized actions by financial impact */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <ListChecks size={13} className="text-sky-500" />
                <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Today's Priority Actions</h2>
              </div>
              <span className="text-[10px] text-gray-400">Top {punchList.length} by savings</span>
            </div>
            <div className="space-y-2">
              {punchList.map(item => {
                const eCfg = EFFORT_CFG[item.effort];
                return (
                  <div key={item.priority} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow cursor-pointer" onClick={() => navigate('/faults')}>
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-blue-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {item.priority}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-900 leading-snug">{item.action}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-gray-500">{item.equipment}</span>
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${eCfg.bg}`}>{eCfg.label}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-emerald-600 tabular-nums">{formatBaht(item.savingsMonth)}</div>
                        <div className="text-[10px] text-gray-400">/month</div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {punchList.length > 0 && (
                <div className="text-right pt-1">
                  <span className="text-[11px] text-gray-500">Total recoverable: </span>
                  <span className="text-sm font-bold text-emerald-600">{formatBaht(punchList.reduce((s, p) => s + p.savingsMonth, 0))}/mo</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Column 2: Live Fault Feed */}
        <div className="flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Live Fault Feed</h2>
            <span className="flex items-center gap-1 text-[10px] text-gray-400">
              <Radio size={9} className="text-red-400" />CP9
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 min-h-0 pr-1">
            {recentFaults.map((fault) => {
              const isActive = fault.status !== 'resolved';
              const sevCfg = severityConfig[fault.severity];
              return (
                <div
                  key={fault.id}
                  className={`flex items-start gap-2.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${isActive ? 'bg-white border border-gray-100 hover:border-gray-200' : 'opacity-40 hover:opacity-60'}`}
                  onClick={() => navigate('/faults')}
                >
                  <span className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${sevCfg.dot} ${isActive ? 'ring-2 ring-offset-1 ' + sevCfg.ring : ''}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 truncate">{fault.equipmentName}</span>
                      <span className="text-[11px] text-gray-400 tabular-nums shrink-0 ml-2">{formatRelativeTime(fault.timestamp)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs text-gray-600 truncate">{fault.faultType}</span>
                      {fault.energyWaste > 0 && <span className="text-[10px] text-red-600 font-medium shrink-0 ml-2">{formatBaht(kwhToBaht(fault.energyWaste))}/mo</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 3: Metrics + Pipeline */}
        <div className="overflow-y-auto space-y-3 min-h-0">
          {/* Energy Waste */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Energy Waste</h2>
              <Zap size={12} className="text-amber-500" />
            </div>
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-xl font-bold text-red-600 tabular-nums">{formatBaht(totalCostMonth)}</span>
              <span className="text-[10px] text-gray-500">/mo</span>
              <span className="text-[10px] text-gray-400 ml-auto">{totalWaste.toLocaleString()} kWh/d</span>
            </div>
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={energyWaste24h}>
                <defs>
                  <linearGradient id="wasteGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} interval={5} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="waste" stroke="#0ea5e9" strokeWidth={1.5} fill="url(#wasteGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Fault Rate */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Fault Rate</h2>
              <span className="text-[10px] text-gray-400">24h</span>
            </div>
            <div className="flex items-baseline gap-3 mb-2">
              <div><span className="text-base font-bold text-red-600 tabular-nums">{faultRate24h.reduce((s, d) => s + d.detected, 0)}</span><span className="text-[10px] text-gray-500 ml-1">detected</span></div>
              <div><span className="text-base font-bold text-emerald-600 tabular-nums">{faultRate24h.reduce((s, d) => s + d.resolved, 0)}</span><span className="text-[10px] text-gray-500 ml-1">resolved</span></div>
            </div>
            <ResponsiveContainer width="100%" height={50}>
              <LineChart data={faultRate24h}>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Line type="monotone" dataKey="detected" stroke="#ef4444" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Agent Pipeline */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Agent Pipeline</h2>
              <span className="text-[10px] text-gray-400">
                <span className="text-emerald-600 font-medium">{liveCount}</span> Live · <span className="text-amber-600 font-medium">{devCount}</span> Dev · <span className="text-gray-500">{plannedCount}</span> Plan
              </span>
            </div>
            <div className="flex items-center gap-1 mb-2">
              {[
                { label: 'DET', live: true },
                { label: 'DIAG', live: true },
                { label: 'REC', live: true },
                { label: 'ACT', live: false },
              ].map((stage, i) => (
                <div key={stage.label} className="flex items-center gap-1 flex-1">
                  <div className={`flex-1 py-1 rounded text-center text-[9px] font-bold uppercase tracking-wider ${stage.live ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white' : 'bg-gray-100 text-gray-400'}`}>{stage.label}</div>
                  {i < 3 && <ArrowRight size={8} className="text-gray-300 shrink-0" />}
                </div>
              ))}
            </div>
            <div className="space-y-0.5">
              {allAgents.map(agent => {
                const cfg = agentStatusConfig[agent.status];
                return (
                  <div key={agent.id} className="flex items-center justify-between py-0.5">
                    <span className="text-[11px] text-gray-700 truncate">{agent.name}</span>
                    <span className={`flex items-center gap-1 text-[10px] font-medium ${cfg.color} shrink-0`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatChip({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon size={12} className={color} />
      <span className="text-xs text-gray-400">{label}</span>
      <span className={`text-xs font-semibold tabular-nums ${color}`}>{value}</span>
    </div>
  );
}
