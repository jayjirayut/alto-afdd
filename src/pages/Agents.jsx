import { ArrowRight, Cpu, Radio, Gauge, User } from 'lucide-react';
import StatusDot from '../components/common/StatusDot';
import { agentLayers } from '../data/agents';
import { agentStatusConfig } from '../utils/helpers';

const pipelineStages = [
  { label: 'DETECT', desc: 'ASHRAE Rules + XGBoost', color: 'from-sky-500 to-sky-400' },
  { label: 'DIAGNOSE', desc: 'Isolation Forest + SHAP', color: 'from-sky-400 to-blue-400' },
  { label: 'RECOMMEND', desc: 'LLM + Cost Analysis', color: 'from-blue-400 to-blue-500' },
  { label: 'ACT', desc: 'MPC + Work Orders', color: 'from-blue-500 to-blue-600' },
];

export default function Agents() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">AI Agents</h1>
        <p className="text-sm text-gray-500 mt-0.5">6-layer intelligence stack · {agentLayers.flatMap(l => l.agents).length} agents</p>
      </div>

      {/* Pipeline Diagram */}
      <div className="mb-8 border border-gray-200 rounded-lg p-6 bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Four-Stage Pipeline</h2>
        <div className="flex items-center gap-3">
          {pipelineStages.map((stage, i) => (
            <div key={stage.label} className="flex items-center gap-3 flex-1">
              <div className={`flex-1 rounded-lg bg-gradient-to-r ${stage.color} p-4 text-white`}>
                <div className="text-sm font-bold">{stage.label}</div>
                <div className="text-xs opacity-80 mt-0.5">{stage.desc}</div>
              </div>
              {i < pipelineStages.length - 1 && (
                <ArrowRight size={18} className="text-gray-300 shrink-0" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Cpu size={12} /> Edge Processing (Jetson T4000)</span>
          <span className="flex items-center gap-1"><Radio size={12} /> Pub/Sub Communication</span>
          <span className="flex items-center gap-1"><Gauge size={12} /> {'<100ms detection latency'}</span>
        </div>
      </div>

      {/* Agent Layers */}
      <div className="space-y-8">
        {agentLayers.map((layer) => (
          <div key={layer.id}>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-blue-500 text-white text-xs font-bold flex items-center justify-center">
                {layer.layerNumber}
              </span>
              <div>
                <h2 className="text-base font-semibold text-gray-900">{layer.name}</h2>
                <p className="text-sm text-gray-500">{layer.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 ml-10">
              {layer.agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentCard({ agent }) {
  const statusCfg = agentStatusConfig[agent.status];

  return (
    <div className="border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900">{agent.name}</h3>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${statusCfg.bg} ${statusCfg.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
          {statusCfg.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{agent.description}</p>

      {/* Techniques */}
      <div className="mb-3">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Techniques</div>
        <div className="flex flex-wrap gap-1.5">
          {agent.techniques.map(t => (
            <span key={t} className="px-2 py-0.5 bg-gray-100 text-xs text-gray-700 rounded-md">{t}</span>
          ))}
        </div>
      </div>

      {/* Pub/Sub */}
      <div className="mb-3">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Pub/Sub</div>
        <div className="text-xs font-mono text-gray-500 space-y-0.5">
          <div><span className="text-gray-400">IN:</span> {agent.pubsub.subscribes}</div>
          <div><span className="text-gray-400">OUT:</span> {agent.pubsub.publishes}</div>
        </div>
      </div>

      {/* Metrics */}
      {agent.metrics.accuracy !== null && (
        <div className="grid grid-cols-4 gap-2 pt-3 border-t border-gray-100">
          {agent.metrics.accuracy !== null && (
            <div>
              <div className="text-xs text-gray-400">Accuracy</div>
              <div className="text-sm font-medium text-gray-900 tabular-nums">{agent.metrics.accuracy}%</div>
            </div>
          )}
          {agent.metrics.latency !== null && (
            <div>
              <div className="text-xs text-gray-400">Latency</div>
              <div className="text-sm font-medium text-gray-900 tabular-nums">{agent.metrics.latency}</div>
            </div>
          )}
          {agent.metrics.throughput !== null && (
            <div>
              <div className="text-xs text-gray-400">Throughput</div>
              <div className="text-sm font-medium text-gray-900 tabular-nums">{agent.metrics.throughput}</div>
            </div>
          )}
          {agent.metrics.uptime !== null && (
            <div>
              <div className="text-xs text-gray-400">Uptime</div>
              <div className="text-sm font-medium text-gray-900 tabular-nums">{agent.metrics.uptime}%</div>
            </div>
          )}
        </div>
      )}

      {/* Owner & Deployment */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
        <span className="flex items-center gap-1"><User size={11} /> {agent.owner}</span>
        <span>{agent.deployment}</span>
      </div>
    </div>
  );
}
