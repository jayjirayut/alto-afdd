import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, HardDrive, AlertTriangle, Shield, ArrowLeft, ChevronRight, Clock } from 'lucide-react';
import HealthScore from '../components/common/HealthScore';
import SeverityBadge from '../components/common/SeverityBadge';
import StatusDot from '../components/common/StatusDot';
import { sites, getSiteById } from '../data/sites';
import { getEquipmentBySite } from '../data/equipment';
import { getFaultsBySite } from '../data/faults';
import { statusConfig, equipmentStatusConfig, formatRelativeTime } from '../utils/helpers';

export default function Sites() {
  const { siteId } = useParams();
  const navigate = useNavigate();

  if (siteId) {
    return <SiteDetail siteId={siteId} navigate={navigate} />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Sites</h1>
        <p className="text-sm text-gray-500 mt-0.5">{sites.length} properties monitored · {sites.reduce((s, site) => s + site.equipmentCount, 0)} total equipment</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {sites.map((site) => (
          <div
            key={site.id}
            className="border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow cursor-pointer group"
            onClick={() => navigate(`/sites/${site.id}`)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-sky-600 transition-colors">{site.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                  <MapPin size={13} />
                  {site.location.split(',').slice(-2).join(',').trim()}
                </div>
              </div>
              {site.isPilot && (
                <span className="px-2 py-0.5 bg-sky-50 text-sky-700 text-xs font-medium rounded-full">Pilot</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Health</div>
                <HealthScore score={site.healthScore} size="md" />
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">AFDD Coverage</div>
                <span className="text-lg font-semibold text-sky-600 tabular-nums">{site.afddCoverage}%</span>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Equipment</div>
                <div className="flex items-center gap-1">
                  <HardDrive size={13} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{site.equipmentCount}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Active Faults</div>
                <div className="flex items-center gap-1">
                  <AlertTriangle size={13} className={site.activeFaults > 5 ? 'text-red-500' : site.activeFaults > 0 ? 'text-amber-500' : 'text-emerald-500'} />
                  <span className={`text-sm font-medium ${site.activeFaults > 5 ? 'text-red-600' : site.activeFaults > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{site.activeFaults}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">{site.customer}</span>
              <ChevronRight size={14} className="text-gray-300 group-hover:text-sky-500 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SiteDetail({ siteId, navigate }) {
  const site = getSiteById(siteId);
  if (!site) return <div className="p-6 text-gray-500">Site not found.</div>;

  const siteEquipment = getEquipmentBySite(siteId);
  const siteFaults = getFaultsBySite(siteId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const activeFaults = siteFaults.filter(f => f.status !== 'resolved');

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/sites')} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{site.name}</h1>
          <p className="text-sm text-gray-500">{site.location} · {site.customer}</p>
        </div>
        {site.isPilot && (
          <span className="px-2 py-0.5 bg-sky-50 text-sky-700 text-xs font-medium rounded-full ml-2">Pilot Site</span>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Health Score', value: <HealthScore score={site.healthScore} size="lg" /> },
          { label: 'AFDD Coverage', value: <span className="text-2xl font-semibold text-sky-600 tabular-nums">{site.afddCoverage}%</span> },
          { label: 'Equipment', value: <span className="text-2xl font-semibold text-gray-900 tabular-nums">{site.equipmentCount}</span> },
          { label: 'Active Faults', value: <span className={`text-2xl font-semibold tabular-nums ${activeFaults.length > 5 ? 'text-red-600' : activeFaults.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{activeFaults.length}</span> },
          { label: 'Area', value: <span className="text-lg font-semibold text-gray-900">{site.totalArea}</span> },
        ].map(kpi => (
          <div key={kpi.label} className="bg-gray-50 rounded-lg p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{kpi.label}</div>
            {kpi.value}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Faults */}
        <div className="col-span-2">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Recent Faults ({siteFaults.length})</h2>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                  <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Fault</th>
                  <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Sev</th>
                  <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {siteFaults.map(f => (
                  <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2.5 text-sm text-gray-500">{formatRelativeTime(f.timestamp)}</td>
                    <td className="px-4 py-2.5 text-sm font-medium text-gray-900">{f.equipmentName}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-700">{f.faultType}</td>
                    <td className="px-4 py-2.5"><SeverityBadge severity={f.severity} showLabel={false} /></td>
                    <td className="px-4 py-2.5"><StatusDot status={f.status} config={statusConfig} size="xs" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Equipment List */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-3">Equipment ({siteEquipment.length})</h2>
          <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
            {siteEquipment.map(eq => (
              <div key={eq.id} className="px-4 py-2.5 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{eq.name}</div>
                  <div className="text-xs text-gray-500">{eq.manufacturer} {eq.model}</div>
                </div>
                <div className="flex items-center gap-3">
                  <HealthScore score={eq.healthScore} size="sm" />
                  <StatusDot status={eq.status} config={equipmentStatusConfig} showLabel={false} size="xs" />
                </div>
              </div>
            ))}
          </div>

          {/* Site Info */}
          <div className="mt-6">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Site Info</h2>
            <div className="border border-gray-200 rounded-lg p-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Building Type</span>
                <span className="text-gray-900 font-medium">{site.buildingType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Chiller Plant</span>
                <span className="text-gray-900 font-medium text-right max-w-48">{site.chillerPlant}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Deployed Models</span>
                <div className="flex flex-wrap gap-1 justify-end max-w-48">
                  {site.deployedModels.map(m => (
                    <span key={m} className="px-1.5 py-0.5 bg-sky-50 text-sky-700 text-xs rounded">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
