import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  faultTrendData, faultByTypeData, mttrBySeverityData,
  energyWasteByEquipmentData, detectionMethodData, siteHealthData,
} from '../data/metrics';

const DETECTION_COLORS = ['#0ea5e9', '#3b82f6', '#6366f1'];

export default function Analytics() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Fault patterns, energy waste, and cross-site comparison</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Fault Trend Over Time */}
        <div className="border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Fault Trend — Last 30 Days</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={faultTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} interval={4} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={30} />
              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="faults" stroke="#ef4444" strokeWidth={2} dot={false} name="Detected" />
              <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} dot={false} name="Resolved" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Fault Frequency by Type */}
        <div className="border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Fault Frequency by Type</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={faultByTypeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="type" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={120} />
              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {faultByTypeData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* MTTR by Severity */}
        <div className="border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Mean Time to Resolution by Severity (hours)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={mttrBySeverityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="severity" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={40} />
              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
              <Bar dataKey="mttr" name="MTTR (hrs)" radius={[4, 4, 0, 0]}>
                {mttrBySeverityData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Energy Waste by Equipment */}
        <div className="border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Energy Waste by Equipment Type (kWh/day)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={energyWasteByEquipmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="type" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={40} />
              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
              <Bar dataKey="waste" name="kWh/day" radius={[4, 4, 0, 0]}>
                {energyWasteByEquipmentData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cross-site Health */}
        <div className="border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Cross-Site Health Comparison</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={siteHealthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="site" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={30} />
              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
              <Bar dataKey="health" name="Health %" radius={[4, 4, 0, 0]}>
                {siteHealthData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detection Method Breakdown */}
        <div className="border border-gray-200 rounded-lg p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Detection Method Breakdown</h2>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width="50%" height={220}>
              <PieChart>
                <Pie
                  data={detectionMethodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {detectionMethodData.map((_, i) => (
                    <Cell key={i} fill={DETECTION_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 flex-1">
              {detectionMethodData.map((item, i) => (
                <div key={item.method} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: DETECTION_COLORS[i] }} />
                    <span className="text-sm text-gray-700">{item.method}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900 tabular-nums">{item.count}</span>
                    <span className="text-xs text-gray-400 ml-1">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Total detections</span>
                  <span className="font-semibold text-gray-900 tabular-nums">{detectionMethodData.reduce((s, d) => s + d.count, 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
