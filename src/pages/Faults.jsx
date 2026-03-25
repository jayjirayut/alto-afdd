import { useState, useMemo } from 'react';
import { Search, Clock, Cpu } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import SeverityBadge from '../components/common/SeverityBadge';
import StatusDot from '../components/common/StatusDot';
import Modal from '../components/common/Modal';
import { faults } from '../data/faults';
import { sites, siteMap } from '../data/sites';
import { statusConfig, severityConfig, formatDateTime, formatRelativeTime } from '../utils/helpers';

const detectionMethods = ['All', 'Rule', 'ML', 'Both'];
const statuses = ['All', 'active', 'acknowledged', 'resolved'];
const severities = ['All', 1, 2, 3, 4, 5];

export default function Faults() {
  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterSite, setFilterSite] = useState('All');
  const [filterMethod, setFilterMethod] = useState('All');
  const [selectedFault, setSelectedFault] = useState(null);

  const filtered = useMemo(() => {
    return faults.filter((f) => {
      if (filterSeverity !== 'All' && f.severity !== Number(filterSeverity)) return false;
      if (filterStatus !== 'All' && f.status !== filterStatus) return false;
      if (filterSite !== 'All' && f.site !== filterSite) return false;
      if (filterMethod !== 'All' && f.detectionMethod !== filterMethod) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          f.id.toLowerCase().includes(q) ||
          f.equipmentName.toLowerCase().includes(q) ||
          f.faultType.toLowerCase().includes(q) ||
          f.rootCause.toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [search, filterSeverity, filterStatus, filterSite, filterMethod]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Faults</h1>
          <p className="text-sm text-gray-500 mt-0.5">{faults.length} total faults · {faults.filter(f => f.status === 'active').length} active</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search faults..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
        <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500">
          {severities.map(s => <option key={s} value={s}>{s === 'All' ? 'All Severities' : `Severity ${s}`}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500">
          {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <select value={filterSite} onChange={(e) => setFilterSite(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500">
          <option value="All">All Sites</option>
          {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500">
          {detectionMethods.map(m => <option key={m} value={m}>{m === 'All' ? 'All Methods' : m}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
              <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
              <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Fault Type</th>
              <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Sev</th>
              <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Root Cause</th>
              <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider w-20">kWh/d</th>
              <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((fault) => {
              const site = siteMap[fault.site];
              return (
                <tr
                  key={fault.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedFault(fault)}
                >
                  <td className="px-4 py-2.5 text-xs font-mono text-gray-500">{fault.id}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-500">{formatRelativeTime(fault.timestamp)}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-700">{site?.shortName || fault.site}</td>
                  <td className="px-4 py-2.5 text-sm font-medium text-gray-900">{fault.equipmentName}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-700">{fault.faultType}</td>
                  <td className="px-4 py-2.5"><SeverityBadge severity={fault.severity} showLabel={false} /></td>
                  <td className="px-4 py-2.5 text-sm text-gray-500 max-w-48 truncate">{fault.rootCause}</td>
                  <td className="px-4 py-2.5 text-sm tabular-nums text-gray-700">{fault.energyWaste || '—'}</td>
                  <td className="px-4 py-2.5"><StatusDot status={fault.status} config={statusConfig} size="xs" /></td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                      fault.detectionMethod === 'Rule' ? 'bg-sky-50 text-sky-700' :
                      fault.detectionMethod === 'ML' ? 'bg-blue-50 text-blue-700' :
                      'bg-indigo-50 text-indigo-700'
                    }`}>
                      <Cpu size={10} />
                      {fault.detectionMethod}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-500 text-sm">No faults match your filters.</div>
        )}
      </div>

      {/* Fault Detail Modal */}
      <Modal
        isOpen={!!selectedFault}
        onClose={() => setSelectedFault(null)}
        title={selectedFault ? `${selectedFault.id} — ${selectedFault.faultType}` : ''}
        wide
      >
        {selectedFault && <FaultDetail fault={selectedFault} />}
      </Modal>
    </div>
  );
}

function FaultDetail({ fault }) {
  const site = siteMap[fault.site];
  const sparkData = fault.sensorData?.data?.map((v, i) => ({ i, value: v })) || [];

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Severity</div>
          <SeverityBadge severity={fault.severity} showLabel />
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Equipment</div>
          <div className="text-sm font-medium text-gray-900">{fault.equipmentName}</div>
          <div className="text-xs text-gray-500">{site?.name}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Energy Waste</div>
          <div className="text-sm font-medium text-gray-900">{fault.energyWaste ? `${fault.energyWaste} kWh/day` : '—'}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Detection</div>
          <div className="flex items-center gap-1.5">
            <Cpu size={14} className="text-sky-500" />
            <span className="text-sm font-medium text-gray-900">{fault.detectionMethod}</span>
          </div>
          <div className="text-xs text-gray-500">Confidence: {fault.confidence}%</div>
        </div>
      </div>

      {/* Root Cause Analysis */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-gradient-to-br from-sky-500 to-blue-500 text-white flex items-center justify-center text-xs font-bold">AI</span>
          Root Cause Analysis
        </h3>
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed border border-gray-100">
          {fault.diagnosis}
        </div>
      </div>

      {/* Recommended Actions */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Recommended Actions</h3>
        <div className="space-y-2">
          {fault.recommendations.map((rec) => (
            <div key={rec.priority} className="flex gap-3 p-3 bg-white border border-gray-200 rounded-lg">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-blue-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                {rec.priority}
              </span>
              <div>
                <div className="text-sm font-medium text-gray-900">{rec.action}</div>
                {rec.costOfInaction && (
                  <div className="text-xs text-gray-500 mt-0.5">Cost of inaction: {rec.costOfInaction}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sensor Data Sparkline */}
      {sparkData.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Sensor Data — {fault.sensorData.metric}</h3>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center gap-4 mb-2 text-xs text-gray-500">
              {fault.sensorData.normal !== null && (
                <span>Normal: <span className="font-medium text-emerald-600">{fault.sensorData.normal}</span></span>
              )}
              <span>Current: <span className="font-medium text-red-600">{fault.sensorData.current}</span></span>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={sparkData}>
                <Tooltip
                  contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  formatter={(v) => [v, fault.sensorData.metric]}
                />
                <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                {fault.sensorData.normal !== null && (
                  <Line type="monotone" dataKey={() => fault.sensorData.normal} stroke="#10b981" strokeWidth={1} strokeDasharray="4 4" dot={false} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Timeline</h3>
        <div className="space-y-0">
          {fault.timeline.map((event, i) => (
            <div key={i} className="flex gap-3 py-2">
              <div className="flex flex-col items-center">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  event.type === 'detected' ? 'bg-red-500' :
                  event.type === 'diagnosed' ? 'bg-amber-500' :
                  event.type === 'notified' ? 'bg-blue-500' :
                  event.type === 'acknowledged' ? 'bg-sky-500' :
                  'bg-emerald-500'
                }`} />
                {i < fault.timeline.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-1" />}
              </div>
              <div className="pb-2">
                <div className="text-sm text-gray-900">{event.event}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <Clock size={10} />
                  {formatDateTime(event.time)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Similar Faults */}
      {fault.similarFaults.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Similar Historical Faults</h3>
          <div className="flex gap-2 flex-wrap">
            {fault.similarFaults.map((fid) => (
              <span key={fid} className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-xs font-mono text-gray-600 rounded">
                {fid}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
