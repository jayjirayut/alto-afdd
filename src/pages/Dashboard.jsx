import { useNavigate } from 'react-router-dom';
import { Clock, ArrowUpRight, ArrowDownRight, Minus, ChevronRight } from 'lucide-react';
import KPIBar from '../components/layout/KPIBar';
import SeverityBadge from '../components/common/SeverityBadge';
import StatusDot from '../components/common/StatusDot';
import HealthScore from '../components/common/HealthScore';
import { faults } from '../data/faults';
import { getEquipmentTypeSummary, equipmentIconMap } from '../data/equipment';
import { siteMap } from '../data/sites';
import { getAllAgents } from '../data/agents';
import { statusConfig, agentStatusConfig, formatRelativeTime } from '../utils/helpers';

const trendIcons = {
  up: <ArrowUpRight size={14} className="text-emerald-500" />,
  down: <ArrowDownRight size={14} className="text-red-500" />,
  stable: <Minus size={14} className="text-gray-400" />,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const recentFaults = [...faults].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const equipmentSummary = getEquipmentTypeSummary();

  return (
    <div>
      <KPIBar />

      <div className="p-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Fault Feed — 2 cols */}
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Faults</h2>
              <button
                onClick={() => navigate('/faults')}
                className="text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1"
              >
                View all <ChevronRight size={14} />
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                    <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Fault</th>
                    <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Sev</th>
                    <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentFaults.slice(0, 12).map((fault) => (
                    <tr
                      key={fault.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate('/faults')}
                    >
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Clock size={13} className="text-gray-400" />
                          {formatRelativeTime(fault.timestamp)}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-sm font-medium text-gray-900">{fault.equipmentName}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-700">{fault.faultType}</td>
                      <td className="px-4 py-2.5"><SeverityBadge severity={fault.severity} showLabel={false} /></td>
                      <td className="px-4 py-2.5"><StatusDot status={fault.status} config={statusConfig} size="xs" /></td>
                      <td className="px-4 py-2.5 text-sm text-gray-500">{siteMap[fault.site]?.shortName || fault.site}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Equipment Health Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Equipment Health</h2>
                <button
                  onClick={() => navigate('/equipment')}
                  className="text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1"
                >
                  View all <ChevronRight size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {equipmentSummary.map((eq) => {
                  const Icon = equipmentIconMap[eq.icon] || equipmentIconMap.Snowflake;
                  return (
                    <div
                      key={eq.id}
                      className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow cursor-pointer"
                      onClick={() => navigate('/equipment')}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon size={16} className="text-sky-500" />
                          <span className="text-sm font-medium text-gray-900">{eq.name}</span>
                        </div>
                        {trendIcons[eq.trend]}
                      </div>
                      <div className="flex items-baseline justify-between">
                        <HealthScore score={eq.avgHealth} size="sm" />
                        {eq.activeFaults > 0 && (
                          <span className="text-xs text-red-600 font-medium">{eq.activeFaults} fault{eq.activeFaults > 1 ? 's' : ''}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Agent Status */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Agent Status</h2>
                <button
                  onClick={() => navigate('/agents')}
                  className="text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1"
                >
                  View all <ChevronRight size={14} />
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
                {getAllAgents().map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate('/agents')}
                  >
                    <span className="text-sm text-gray-900">{agent.name}</span>
                    <StatusDot status={agent.status} config={agentStatusConfig} size="xs" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
