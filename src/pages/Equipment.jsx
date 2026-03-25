import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import HealthScore from '../components/common/HealthScore';
import StatusDot from '../components/common/StatusDot';
import SeverityBadge from '../components/common/SeverityBadge';
import Modal from '../components/common/Modal';
import { equipment, equipmentTypes, equipmentIconMap } from '../data/equipment';
import { faults } from '../data/faults';
import { sites, getSiteById, siteMap } from '../data/sites';
import { equipmentStatusConfig, formatDate } from '../utils/helpers';
import { generateHealthTrend } from '../data/metrics';



export default function Equipment() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterSite, setFilterSite] = useState('All');
  const [selectedEquip, setSelectedEquip] = useState(null);

  const filtered = useMemo(() => {
    return equipment.filter((e) => {
      if (filterType !== 'All' && e.type !== filterType) return false;
      if (filterSite !== 'All' && e.site !== filterSite) return false;
      if (search) {
        const q = search.toLowerCase();
        return e.id.toLowerCase().includes(q) || e.name.toLowerCase().includes(q) || e.manufacturer.toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, filterType, filterSite]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Equipment</h1>
          <p className="text-sm text-gray-500 mt-0.5">{equipment.length} items across {sites.length} sites</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500">
          <option value="All">All Types</option>
          {equipmentTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <select value={filterSite} onChange={(e) => setFilterSite(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500">
          <option value="All">All Sites</option>
          {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
              <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Health</th>
              <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Active Faults</th>
              <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Last Maintenance</th>
              <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((eq) => {
              const site = siteMap[eq.site];
              const typeInfo = equipmentTypes.find(t => t.id === eq.type);
              const Icon = equipmentIconMap[typeInfo?.icon] || equipmentIconMap.Snowflake;
              return (
                <tr key={eq.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelectedEquip(eq)}>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <Icon size={15} className="text-sky-500" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{eq.name}</div>
                        <div className="text-xs font-mono text-gray-400">{eq.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-700">{typeInfo?.name || eq.type}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-700">{site?.shortName}</td>
                  <td className="px-4 py-2.5"><HealthScore score={eq.healthScore} size="sm" /></td>
                  <td className="px-4 py-2.5">
                    {eq.activeFaults > 0 ? (
                      <span className="text-sm font-medium text-red-600">{eq.activeFaults}</span>
                    ) : (
                      <span className="text-sm text-gray-400">0</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-500">{formatDate(eq.lastMaintenance)}</td>
                  <td className="px-4 py-2.5"><StatusDot status={eq.status} config={equipmentStatusConfig} size="xs" /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-500 text-sm">No equipment matches your filters.</div>
        )}
      </div>

      {/* Equipment Detail Modal */}
      <Modal
        isOpen={!!selectedEquip}
        onClose={() => setSelectedEquip(null)}
        title={selectedEquip ? `${selectedEquip.name} — ${selectedEquip.id}` : ''}
        wide
      >
        {selectedEquip && <EquipmentDetail equip={selectedEquip} />}
      </Modal>
    </div>
  );
}

function EquipmentDetail({ equip }) {
  const site = sites.find(s => s.id === equip.site);
  const typeInfo = equipmentTypes.find(t => t.id === equip.type);
  const equipFaults = faults.filter(f => f.equipment === equip.id);
  const activeFaults = equipFaults.filter(f => f.status !== 'resolved');
  const healthTrend = useMemo(() => generateHealthTrend(equip.healthScore), [equip.healthScore]);

  return (
    <div className="space-y-6">
      {/* Equipment Info */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Manufacturer / Model</div>
          <div className="text-sm font-medium text-gray-900">{equip.manufacturer}</div>
          <div className="text-xs text-gray-500">{equip.model}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Rated Capacity</div>
          <div className="text-sm font-medium text-gray-900">{equip.ratedCapacity}</div>
          <div className="text-xs text-gray-500">Installed: {formatDate(equip.installDate)}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Health / Status</div>
          <HealthScore score={equip.healthScore} size="md" />
          <div className="mt-1">
            <StatusDot status={equip.status} config={equipmentStatusConfig} size="xs" />
          </div>
        </div>
      </div>

      {/* Health Score Trend */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Health Score — Last 30 Days</h3>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={healthTrend}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} interval={4} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={30} />
              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
              <Line type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Faults */}
      {activeFaults.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Active Faults ({activeFaults.length})</h3>
          <div className="space-y-2">
            {activeFaults.map(f => (
              <div key={f.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <SeverityBadge severity={f.severity} showLabel={false} />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{f.faultType}</div>
                    <div className="text-xs text-gray-500">{f.rootCause}</div>
                  </div>
                </div>
                <StatusDot status={f.status} config={{
                  active: { label: 'Active', dot: 'bg-red-500', color: 'text-red-600' },
                  acknowledged: { label: 'Ack', dot: 'bg-amber-500', color: 'text-amber-600' },
                }} size="xs" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Maintenance History */}
      {equip.maintenanceHistory?.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Maintenance History</h3>
          <div className="space-y-2">
            {equip.maintenanceHistory.map((m, i) => (
              <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 w-20 shrink-0">{formatDate(m.date)}</div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{m.type}</div>
                  <div className="text-xs text-gray-500">{m.notes}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sensors */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Associated Sensors ({equip.sensors.length})</h3>
        <div className="flex flex-wrap gap-2">
          {equip.sensors.map(s => (
            <span key={s} className="px-2.5 py-1 bg-gray-100 text-xs text-gray-600 rounded-md font-medium">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
