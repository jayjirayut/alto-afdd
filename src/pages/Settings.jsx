import { useState } from 'react';
import { Bell, Bot, Building2, ChevronRight } from 'lucide-react';
import { sites } from '../data/sites';
import { getAllAgents } from '../data/agents';
import { agentStatusConfig } from '../utils/helpers';

const tabs = [
  { id: 'site', label: 'Site Configuration', icon: Building2 },
  { id: 'agent', label: 'Agent Configuration', icon: Bot },
  { id: 'notification', label: 'Notifications', icon: Bell },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('site');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Configure AFDD thresholds, agents, and notifications</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.id
                  ? 'border-sky-500 text-sky-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'site' && <SiteConfig />}
      {activeTab === 'agent' && <AgentConfig />}
      {activeTab === 'notification' && <NotificationConfig />}
    </div>
  );
}

function SiteConfig() {
  return (
    <div className="space-y-6">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
              <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Delta-T Threshold (°C)</th>
              <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">COP Threshold</th>
              <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Filter DP (Pa)</th>
              <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">LINE Alerts</th>
              <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sites.map(site => (
              <tr key={site.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">{site.name}</div>
                  <div className="text-xs text-gray-500">{site.shortName}</div>
                </td>
                <td className="px-4 py-3">
                  <input type="number" defaultValue={3.0} step={0.5} className="w-20 px-2 py-1 border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </td>
                <td className="px-4 py-3">
                  <input type="number" defaultValue={3.5} step={0.1} className="w-20 px-2 py-1 border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </td>
                <td className="px-4 py-3">
                  <input type="number" defaultValue={250} step={10} className="w-20 px-2 py-1 border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </td>
                <td className="px-4 py-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-sky-500 rounded-full peer peer-checked:bg-sky-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                  </label>
                </td>
                <td className="px-4 py-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-sky-500 rounded-full peer peer-checked:bg-sky-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end">
        <button className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white text-sm font-medium rounded-lg hover:from-sky-600 hover:to-blue-600 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function AgentConfig() {
  const allAgents = getAllAgents();

  return (
    <div className="space-y-6">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
              <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Enabled</th>
              <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence Threshold</th>
              <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Auto-Alert</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {allAgents.map(agent => {
              const cfg = agentStatusConfig[agent.status];
              return (
                <tr key={agent.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                    <div className="text-xs text-gray-500">{agent.layer}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={agent.status === 'live'} disabled={agent.status === 'planned'} className="sr-only peer" />
                      <div className={`w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-sky-500 rounded-full peer peer-checked:bg-sky-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full ${agent.status === 'planned' ? 'opacity-40' : ''}`} />
                    </label>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      defaultValue={agent.status === 'live' ? 85 : 70}
                      min={0}
                      max={100}
                      disabled={agent.status === 'planned'}
                      className="w-20 px-2 py-1 border border-gray-200 rounded text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-40 disabled:bg-gray-50"
                    />
                    <span className="text-xs text-gray-400 ml-1">%</span>
                  </td>
                  <td className="px-4 py-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={agent.status === 'live'} disabled={agent.status === 'planned'} className="sr-only peer" />
                      <div className={`w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-sky-500 rounded-full peer peer-checked:bg-sky-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full ${agent.status === 'planned' ? 'opacity-40' : ''}`} />
                    </label>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end">
        <button className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white text-sm font-medium rounded-lg hover:from-sky-600 hover:to-blue-600 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function NotificationConfig() {
  const severities = [
    { level: 1, label: 'Info', line: false, email: false, dashboard: true },
    { level: 2, label: 'Minor', line: false, email: true, dashboard: true },
    { level: 3, label: 'Moderate', line: true, email: true, dashboard: true },
    { level: 4, label: 'Major', line: true, email: true, dashboard: true },
    { level: 5, label: 'Critical', line: true, email: true, dashboard: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Severity Routing</h3>
        <p className="text-sm text-gray-500 mb-4">Configure which notification channels are used for each severity level.</p>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">LINE (Real-time)</th>
                <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Email (Digest)</th>
                <th className="px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Dashboard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {severities.map(sev => (
                <tr key={sev.level} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-900">Severity {sev.level}</span>
                    <span className="text-xs text-gray-500 ml-2">{sev.label}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={sev.line} className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-sky-500 rounded-full peer peer-checked:bg-sky-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={sev.email} className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-sky-500 rounded-full peer peer-checked:bg-sky-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={sev.dashboard} className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-sky-500 rounded-full peer peer-checked:bg-sky-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Email Settings</h3>
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">Digest Frequency</label>
              <select className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500">
                <option>Daily (8:00 AM)</option>
                <option>Twice daily (8:00 AM, 5:00 PM)</option>
                <option>Weekly (Monday 8:00 AM)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">Recipients</label>
              <input type="text" defaultValue="facility@centralpattana.com, engineering@altotech.ai" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">LINE Settings</h3>
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">LINE Group</label>
              <input type="text" defaultValue="AFDD Alerts — CP9" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">Quiet Hours</label>
              <div className="flex items-center gap-2 mt-1">
                <input type="time" defaultValue="22:00" className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500" />
                <span className="text-sm text-gray-500">to</span>
                <input type="time" defaultValue="06:00" className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <p className="text-xs text-gray-400 mt-1">Severity 5 alerts bypass quiet hours</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 text-white text-sm font-medium rounded-lg hover:from-sky-600 hover:to-blue-600 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}
