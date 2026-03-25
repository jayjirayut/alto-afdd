import { useState } from 'react';
import { ArrowRight, Bot, ChevronRight, ChevronDown, Zap } from 'lucide-react';
import {
  waterSideLibrary, airSideLibrary, showcaseAgents, architectureLayers,
} from '../data/faultLibrary';

const autonomyConfig = {
  advisory: { label: 'advisory', bg: 'bg-gray-100', text: 'text-gray-600' },
  'semi-autonomous': { label: 'semi-autonomous', bg: 'bg-teal-50', text: 'text-teal-700' },
  'fully-autonomous': { label: 'fully-autonomous', bg: 'bg-emerald-50', text: 'text-emerald-700' },
};

export default function FaultLibrary() {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Automatic Fault Detection and Diagnostic (AFDD)
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">with AI-Recommended Actions — 60 fault types across water-side and air-side systems</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="text-xs text-gray-500">TOR - Topic 5.1.4, 5.2.1</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center">
                <Zap size={14} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900">AltoTech</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Content */}
      <div className="flex-1 grid grid-cols-[1fr_1fr_1.2fr] gap-5 px-6 min-h-0 overflow-hidden">

        {/* Column 1: Water-Side */}
        <div className="overflow-y-auto min-h-0 pr-1">
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-gray-900">{waterSideLibrary.title}</h2>
            <span className="text-xs text-gray-500">({waterSideLibrary.totalFaults} faults)</span>
          </div>
          <div className="space-y-3">
            {waterSideLibrary.categories.map(cat => (
              <FaultCategory key={cat.name} category={cat} />
            ))}
          </div>
        </div>

        {/* Column 2: Air-Side */}
        <div className="overflow-y-auto min-h-0 pr-1">
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-gray-900">{airSideLibrary.title}</h2>
            <span className="text-xs text-gray-500">({airSideLibrary.totalFaults} faults)</span>
          </div>
          <div className="space-y-3">
            {airSideLibrary.categories.map(cat => (
              <FaultCategory key={cat.name} category={cat} />
            ))}
          </div>
        </div>

        {/* Column 3: AI Agents */}
        <div className="overflow-y-auto min-h-0 pl-1">
          <div className="space-y-2.5">
            {showcaseAgents.map(agent => (
              <AgentCard key={agent.name} agent={agent} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom: Architecture Pipeline */}
      <div className="px-6 py-4 border-t border-gray-100 shrink-0">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
          Autonomous AI Agent Architecture — 6 Layers
        </div>
        <div className="flex items-center gap-2">
          {architectureLayers.map((layer, i) => (
            <div key={layer.id} className="flex items-center gap-2 flex-1">
              <div className={`flex-1 bg-gradient-to-r ${layer.color} text-white rounded-lg px-3 py-2 text-center`}>
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">{layer.id}</div>
                <div className="text-xs font-medium">{layer.name.replace(' Layer', '')}</div>
              </div>
              {i < architectureLayers.length - 1 && (
                <ArrowRight size={14} className="text-gray-300 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FaultCategory({ category }) {
  const [expanded, setExpanded] = useState(false);
  const sevDot = { critical: 'bg-red-500', major: 'bg-amber-500', minor: 'bg-teal-500' };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setExpanded(e => !e)}>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold text-gray-900">{category.name}</span>
            <span className="text-sm text-gray-400">({category.faults} faults)</span>
          </div>
          <ChevronDown size={16} className={`text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {category.critical > 0 && (
            <span className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-md">
              {category.critical} critical
            </span>
          )}
          {category.major > 0 && (
            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-md">
              {category.major} major
            </span>
          )}
          {category.minor > 0 && (
            <span className="px-2.5 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-md">
              {category.minor} minor
            </span>
          )}
        </div>
      </div>
      {expanded && category.details && (
        <div className="border-t border-gray-100 px-4 py-2 space-y-1 bg-gray-50/50">
          {category.details.map(fault => (
            <div key={fault.code} className="flex items-center gap-2.5 py-1">
              <span className={`w-2 h-2 rounded-full ${sevDot[fault.severity]} shrink-0`} />
              <span className="text-[11px] font-mono text-gray-400 w-10 shrink-0">{fault.code}</span>
              <span className="text-xs text-gray-700">{fault.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AgentCard({ agent }) {
  const cfg = autonomyConfig[agent.autonomy];
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex gap-3">
      <div className="w-9 h-9 rounded-lg bg-sky-100 flex items-center justify-center shrink-0 mt-0.5">
        <Bot size={18} className="text-sky-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-900">{agent.name}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.bg} ${cfg.text}`}>
            {cfg.label}
          </span>
          <ChevronRight size={14} className="text-gray-300 ml-auto shrink-0" />
        </div>
        <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{agent.description}</p>
      </div>
    </div>
  );
}
