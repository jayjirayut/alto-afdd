export const waterSideLibrary = {
  title: 'Water-Side AFDD Fault Library',
  totalFaults: 30,
  categories: [
    { name: 'Chiller', faults: 10, critical: 3, major: 6, minor: 1, details: [
      { code: 'CH-01', name: 'Low Delta-T Syndrome', severity: 'critical' },
      { code: 'CH-02', name: 'Condenser Fouling', severity: 'critical' },
      { code: 'CH-03', name: 'Refrigerant Undercharge', severity: 'critical' },
      { code: 'CH-04', name: 'Compressor Surge', severity: 'major' },
      { code: 'CH-05', name: 'Oil Pressure Low', severity: 'major' },
      { code: 'CH-06', name: 'High Discharge Temperature', severity: 'major' },
      { code: 'CH-07', name: 'Evaporator Fouling', severity: 'major' },
      { code: 'CH-08', name: 'VFD Fault', severity: 'major' },
      { code: 'CH-09', name: 'Bearing Wear', severity: 'major' },
      { code: 'CH-10', name: 'Capacity Degradation', severity: 'minor' },
    ]},
    { name: 'Pump', faults: 5, critical: 2, major: 1, minor: 2, details: [
      { code: 'PM-01', name: 'Cavitation', severity: 'critical' },
      { code: 'PM-02', name: 'Bearing Wear', severity: 'critical' },
      { code: 'PM-03', name: 'Seal Leak', severity: 'major' },
      { code: 'PM-04', name: 'Impeller Degradation', severity: 'minor' },
      { code: 'PM-05', name: 'VFD Fault', severity: 'minor' },
    ]},
    { name: 'Cooling Tower', faults: 5, critical: 2, major: 2, minor: 1, details: [
      { code: 'CT-01', name: 'Fan Motor Overload', severity: 'critical' },
      { code: 'CT-02', name: 'Fill Fouling', severity: 'critical' },
      { code: 'CT-03', name: 'Scale Buildup', severity: 'major' },
      { code: 'CT-04', name: 'Drift Eliminator Damage', severity: 'major' },
      { code: 'CT-05', name: 'Basin Heater Fault', severity: 'minor' },
    ]},
    { name: 'Valve & Piping', faults: 5, critical: 1, major: 2, minor: 2, details: [
      { code: 'VP-01', name: 'Valve Leak-By', severity: 'critical' },
      { code: 'VP-02', name: 'Actuator Failure', severity: 'major' },
      { code: 'VP-03', name: 'Stuck Valve', severity: 'major' },
      { code: 'VP-04', name: 'Pipe Insulation Damage', severity: 'minor' },
      { code: 'VP-05', name: 'Expansion Joint Leak', severity: 'minor' },
    ]},
    { name: 'Sensor', faults: 5, critical: 1, major: 3, minor: 1, details: [
      { code: 'SN-01', name: 'Temperature Sensor Drift', severity: 'critical' },
      { code: 'SN-02', name: 'Pressure Sensor Offset', severity: 'major' },
      { code: 'SN-03', name: 'Flow Meter Calibration Error', severity: 'major' },
      { code: 'SN-04', name: 'Stuck Sensor Reading', severity: 'major' },
      { code: 'SN-05', name: 'Intermittent Signal Loss', severity: 'minor' },
    ]},
  ],
};

export const airSideLibrary = {
  title: 'Air-Side AFDD Fault Library',
  totalFaults: 30,
  categories: [
    { name: 'AHU', faults: 10, critical: 4, major: 4, minor: 2, details: [
      { code: 'AH-01', name: 'Stuck Damper', severity: 'critical' },
      { code: 'AH-02', name: 'Simultaneous Heating & Cooling', severity: 'critical' },
      { code: 'AH-03', name: 'Economizer Malfunction', severity: 'critical' },
      { code: 'AH-04', name: 'Coil Fouling', severity: 'critical' },
      { code: 'AH-05', name: 'Belt Slip', severity: 'major' },
      { code: 'AH-06', name: 'Filter Differential Pressure High', severity: 'major' },
      { code: 'AH-07', name: 'SAT Reset Failure', severity: 'major' },
      { code: 'AH-08', name: 'Fan Vibration', severity: 'major' },
      { code: 'AH-09', name: 'VFD Fault', severity: 'minor' },
      { code: 'AH-10', name: 'Duct Leakage', severity: 'minor' },
    ]},
    { name: 'Damper', faults: 5, critical: 2, major: 2, minor: 1, details: [
      { code: 'DM-01', name: 'Actuator Failure', severity: 'critical' },
      { code: 'DM-02', name: 'Linkage Disconnect', severity: 'critical' },
      { code: 'DM-03', name: 'Blade Damage', severity: 'major' },
      { code: 'DM-04', name: 'Seal Leak', severity: 'major' },
      { code: 'DM-05', name: 'Position Feedback Error', severity: 'minor' },
    ]},
    { name: 'Zone/Terminal', faults: 5, critical: 1, major: 2, minor: 2, details: [
      { code: 'ZT-01', name: 'VAV Box Stuck', severity: 'critical' },
      { code: 'ZT-02', name: 'Reheat Valve Leak', severity: 'major' },
      { code: 'ZT-03', name: 'Thermostat Drift', severity: 'major' },
      { code: 'ZT-04', name: 'Airflow Imbalance', severity: 'minor' },
      { code: 'ZT-05', name: 'Occupancy Sensor Fault', severity: 'minor' },
    ]},
    { name: 'Ventilation/IAQ', faults: 5, critical: 2, major: 2, minor: 1, details: [
      { code: 'VQ-01', name: 'CO\u2082 Sensor Drift', severity: 'critical' },
      { code: 'VQ-02', name: 'Low Outside Air Fraction', severity: 'critical' },
      { code: 'VQ-03', name: 'Exhaust Fan Failure', severity: 'major' },
      { code: 'VQ-04', name: 'Enthalpy Sensor Fault', severity: 'major' },
      { code: 'VQ-05', name: 'DCV Malfunction', severity: 'minor' },
    ]},
    { name: 'Energy Efficiency', faults: 5, critical: 2, major: 2, minor: 1, details: [
      { code: 'EE-01', name: 'Simultaneous Operation', severity: 'critical' },
      { code: 'EE-02', name: 'Setpoint Deviation', severity: 'critical' },
      { code: 'EE-03', name: 'Schedule Override Active', severity: 'major' },
      { code: 'EE-04', name: 'Unoccupied Conditioning', severity: 'major' },
      { code: 'EE-05', name: 'Excess Reheat Energy', severity: 'minor' },
    ]},
  ],
};

export const showcaseAgents = [
  {
    name: 'Orchestrator Agent',
    autonomy: 'advisory',
    description: 'Master coordinator that routes tasks to specialist agents, resolves conflicts between competing objectives (e.g., energy vs comfort), and maintains system-wide state. Acts as the central nervous system for all AFDD operations.',
  },
  {
    name: 'Air-Side Detective',
    autonomy: 'semi-autonomous',
    description: 'Monitors all AHUs, FCUs, VAV boxes, dampers, and zone conditions for air-side faults. Implements full ASHRAE RP-1312 fault library plus custom tropical-climate faults. Reports to Orchestrator with severity classifications.',
  },
  {
    name: 'Maintenance Planner',
    autonomy: 'advisory',
    description: 'Predicts equipment failures, schedules preventive maintenance, generates work orders, and tracks spare parts inventory. Uses fault history and equipment degradation trends to optimize maintenance windows.',
  },
  {
    name: 'Water-Side Detective',
    autonomy: 'semi-autonomous',
    description: 'Monitors chiller plant equipment (chillers, pumps, cooling towers, valves, piping) for all water-side faults in the fault library. Runs continuous detection using rule-based, statistical, and ML methods.',
  },
  {
    name: 'Comfort Guardian',
    autonomy: 'fully-autonomous',
    description: 'Ensures thermal comfort per ASHRAE 55 in all occupied zones. Monitors PMV/PPD, operative temperature, humidity, and draft conditions. Has full autonomy for fan speed adjustments and setpoint tuning.',
  },
  {
    name: 'IAQ Sentinel',
    autonomy: 'fully-autonomous',
    description: 'Monitors indoor air quality metrics: CO\u2082, PM2.5, humidity, TVOCs, and formaldehyde. Controls ventilation rates per ASHRAE 62.1. Has full autonomy to increase ventilation when IAQ thresholds are breached.',
  },
  {
    name: 'Compliance Auditor',
    autonomy: 'advisory',
    description: 'Continuously checks building operation against Green Mark, BEAM Plus, Thailand BEC, IPMVP, and ASHRAE standards. Generates compliance reports, identifies gaps, and recommends actions to maintain certifications.',
  },
];

export const architectureLayers = [
  { id: 'L1', name: 'Perception Layer', color: 'from-sky-400 to-sky-500' },
  { id: 'L2', name: 'Detection Layer', color: 'from-sky-500 to-sky-600' },
  { id: 'L3', name: 'Diagnosis Layer', color: 'from-sky-600 to-blue-500' },
  { id: 'L4', name: 'Recommendation Layer', color: 'from-blue-500 to-blue-500' },
  { id: 'L5', name: 'Optimization Layer', color: 'from-blue-500 to-blue-600' },
  { id: 'L6', name: 'Communication Layer', color: 'from-blue-600 to-blue-700' },
];
