export const kpis = {
  activeFaults: {
    total: 18,
    bySeverity: { 1: 3, 2: 7, 3: 5, 4: 2, 5: 1 },
    trend: '+3 from yesterday',
    trendDirection: 'up',
  },
  equipmentHealth: {
    score: 87,
    trend: '-2% from last week',
    trendDirection: 'down',
  },
  energyWaste: {
    daily: 2280,
    unit: 'kWh/day',
    monthlyCost: '≈฿239,400/mo',
    trend: '+12% from last week',
    trendDirection: 'up',
  },
  timeSaved: {
    hours: 42.5,
    unit: 'hrs/month',
    trend: '+5.2 hrs vs last month',
    trendDirection: 'up',
  },
  sitesMonitored: {
    count: 6,
    totalEquipment: 92,
    totalSensors: 369400,
    coverage: '78%',
  },
};

// Fault trend over the last 30 days
export const faultTrendData = [
  { date: 'Feb 23', faults: 8, resolved: 6 },
  { date: 'Feb 24', faults: 10, resolved: 7 },
  { date: 'Feb 25', faults: 9, resolved: 8 },
  { date: 'Feb 26', faults: 12, resolved: 9 },
  { date: 'Feb 27', faults: 11, resolved: 10 },
  { date: 'Feb 28', faults: 14, resolved: 11 },
  { date: 'Mar 01', faults: 13, resolved: 12 },
  { date: 'Mar 02', faults: 11, resolved: 10 },
  { date: 'Mar 03', faults: 10, resolved: 9 },
  { date: 'Mar 04', faults: 12, resolved: 8 },
  { date: 'Mar 05', faults: 15, resolved: 12 },
  { date: 'Mar 06', faults: 14, resolved: 13 },
  { date: 'Mar 07', faults: 16, resolved: 14 },
  { date: 'Mar 08', faults: 13, resolved: 11 },
  { date: 'Mar 09', faults: 11, resolved: 10 },
  { date: 'Mar 10', faults: 10, resolved: 9 },
  { date: 'Mar 11', faults: 12, resolved: 10 },
  { date: 'Mar 12', faults: 14, resolved: 12 },
  { date: 'Mar 13', faults: 13, resolved: 11 },
  { date: 'Mar 14', faults: 15, resolved: 13 },
  { date: 'Mar 15', faults: 17, resolved: 14 },
  { date: 'Mar 16', faults: 16, resolved: 15 },
  { date: 'Mar 17', faults: 14, resolved: 12 },
  { date: 'Mar 18', faults: 18, resolved: 15 },
  { date: 'Mar 19', faults: 19, resolved: 16 },
  { date: 'Mar 20', faults: 17, resolved: 14 },
  { date: 'Mar 21', faults: 20, resolved: 17 },
  { date: 'Mar 22', faults: 18, resolved: 15 },
  { date: 'Mar 23', faults: 21, resolved: 18 },
  { date: 'Mar 24', faults: 18, resolved: 14 },
];

// Fault frequency by type
export const faultByTypeData = [
  { type: 'Low Delta-T', count: 28, color: '#0ea5e9' },
  { type: 'Sensor Drift', count: 22, color: '#38bdf8' },
  { type: 'Stuck Damper', count: 18, color: '#7dd3fc' },
  { type: 'High Filter DP', count: 16, color: '#bae6fd' },
  { type: 'Economizer Fault', count: 14, color: '#3b82f6' },
  { type: 'Condenser Fouling', count: 12, color: '#60a5fa' },
  { type: 'Refrigerant Issue', count: 9, color: '#93c5fd' },
  { type: 'Staging Error', count: 7, color: '#bfdbfe' },
  { type: 'Simultaneous H&C', count: 6, color: '#dbeafe' },
  { type: 'Other', count: 11, color: '#e0f2fe' },
];

// MTTR by severity
export const mttrBySeverityData = [
  { severity: 'Sev 1 (Info)', mttr: 168, color: '#9ca3af' },
  { severity: 'Sev 2 (Minor)', mttr: 48, color: '#3b82f6' },
  { severity: 'Sev 3 (Moderate)', mttr: 12, color: '#f59e0b' },
  { severity: 'Sev 4 (Major)', mttr: 4, color: '#f97316' },
  { severity: 'Sev 5 (Critical)', mttr: 1.5, color: '#ef4444' },
];

// Energy waste by equipment type
export const energyWasteByEquipmentData = [
  { type: 'Chillers', waste: 1250, color: '#0ea5e9' },
  { type: 'AHUs', waste: 640, color: '#38bdf8' },
  { type: 'Cooling Towers', waste: 210, color: '#7dd3fc' },
  { type: 'Pumps', waste: 95, color: '#bae6fd' },
  { type: 'VRF', waste: 55, color: '#3b82f6' },
  { type: 'Boilers', waste: 30, color: '#60a5fa' },
];

// Detection method breakdown
export const detectionMethodData = [
  { method: 'Rule FDD', count: 124, percentage: 68 },
  { method: 'ML FDD', count: 32, percentage: 18 },
  { method: 'Both', count: 26, percentage: 14 },
];

// Cross-site health comparison
export const siteHealthData = [
  { site: 'CP9', health: 82, faults: 7, color: '#0ea5e9' },
  { site: 'JWM', health: 88, faults: 4, color: '#38bdf8' },
  { site: 'CWG', health: 91, faults: 3, color: '#7dd3fc' },
  { site: 'DHM-BP', health: 93, faults: 2, color: '#bae6fd' },
  { site: 'DHM-NS', health: 95, faults: 1, color: '#3b82f6' },
  { site: 'DEPA', health: 96, faults: 1, color: '#60a5fa' },
];

// 24-hour energy waste timeline (hourly, kWh)
export const energyWaste24h = [
  { hour: '00:00', waste: 82 }, { hour: '01:00', waste: 68 }, { hour: '02:00', waste: 55 },
  { hour: '03:00', waste: 48 }, { hour: '04:00', waste: 52 }, { hour: '05:00', waste: 61 },
  { hour: '06:00', waste: 78 }, { hour: '07:00', waste: 95 }, { hour: '08:00', waste: 118 },
  { hour: '09:00', waste: 135 }, { hour: '10:00', waste: 142 }, { hour: '11:00', waste: 138 },
  { hour: '12:00', waste: 145 }, { hour: '13:00', waste: 152 }, { hour: '14:00', waste: 148 },
  { hour: '15:00', waste: 140 }, { hour: '16:00', waste: 132 }, { hour: '17:00', waste: 125 },
  { hour: '18:00', waste: 110 }, { hour: '19:00', waste: 98 }, { hour: '20:00', waste: 105 },
  { hour: '21:00', waste: 95 }, { hour: '22:00', waste: 88 }, { hour: '23:00', waste: 95 },
];

// Fault detection rate (hourly, last 24h)
export const faultRate24h = [
  { hour: '00:00', detected: 0, resolved: 1 }, { hour: '01:00', detected: 0, resolved: 0 },
  { hour: '02:00', detected: 1, resolved: 0 }, { hour: '03:00', detected: 0, resolved: 0 },
  { hour: '04:00', detected: 0, resolved: 1 }, { hour: '05:00', detected: 1, resolved: 0 },
  { hour: '06:00', detected: 0, resolved: 0 }, { hour: '07:00', detected: 2, resolved: 1 },
  { hour: '08:00', detected: 1, resolved: 0 }, { hour: '09:00', detected: 3, resolved: 1 },
  { hour: '10:00', detected: 1, resolved: 2 }, { hour: '11:00', detected: 2, resolved: 0 },
  { hour: '12:00', detected: 0, resolved: 1 }, { hour: '13:00', detected: 1, resolved: 0 },
  { hour: '14:00', detected: 2, resolved: 1 }, { hour: '15:00', detected: 1, resolved: 0 },
  { hour: '16:00', detected: 0, resolved: 1 }, { hour: '17:00', detected: 1, resolved: 0 },
  { hour: '18:00', detected: 0, resolved: 0 }, { hour: '19:00', detected: 1, resolved: 1 },
  { hour: '20:00', detected: 2, resolved: 0 }, { hour: '21:00', detected: 1, resolved: 1 },
  { hour: '22:00', detected: 0, resolved: 0 }, { hour: '23:00', detected: 1, resolved: 0 },
];

// Health score trend (30 days) for equipment detail
export const generateHealthTrend = (currentScore) => {
  const data = [];
  const base = currentScore + Math.floor(Math.random() * 5);
  for (let i = 29; i >= 0; i--) {
    const date = new Date('2026-03-24');
    date.setDate(date.getDate() - i);
    const noise = (Math.random() - 0.5) * 4;
    const trend = (29 - i) * ((currentScore - base) / 29);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: Math.max(0, Math.min(100, Math.round(base + trend + noise))),
    });
  }
  return data;
};
