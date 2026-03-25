export const suggestedPrompts = [
  "What's wrong with Chiller 2?",
  'Show me critical faults',
  'Energy saving recommendations',
  'Explain low delta-T syndrome',
];

export const chatResponses = {
  "What's wrong with Chiller 2?": `**Chiller 2 (CP9-CH-02) — 3 Active Faults**

Chiller 2 at Central Rama 9 is currently experiencing multiple related issues:

1. **Low Delta-T Syndrome** (Severity 4) — Delta-T has dropped to 2.1°C vs expected 5.5°C. This is the primary issue.

2. **High Compressor Power** (Severity 3) — Power consumption up 18% (312 kW → 368 kW) as the compressor works harder to compensate.

3. **Low COP** (Severity 3) — COP degraded from 5.2 to 3.1, representing a 40% efficiency loss.

**Root Cause:** Condenser fouling. The condenser approach temperature has increased from 2.8°C to 5.4°C over 14 days.

**Recommended Action:** Schedule condenser tube cleaning within 48 hours. Estimated energy waste: **420 kWh/day** (~฿44,100/month).`,

  'Show me critical faults': `**Critical Faults at CP9 (Severity 4-5)**

Currently **1 critical fault** active at Central Rama 9:

| Fault | Equipment | Severity | Waste |
|-------|-----------|----------|-------|
| Low Delta-T Syndrome | Chiller 2 | SEV 4 | 420 kWh/d |

**Recently resolved critical faults (last 7 days):**
- Oil Pressure Low on Chiller 3 (SEV 5) — resolved Mar 17
- Fan Motor Overload on CT-2 (SEV 4) — resolved Mar 18

The system is detecting faults earlier through ML augmentation — average detection-to-acknowledgment time has improved to **2.4 hours**.`,

  'Energy saving recommendations': `**Top Energy Saving Opportunities at CP9**

Total current waste: **1,495 kWh/day** (~฿156,975/month)

**Priority actions ranked by impact:**

1. **Clean Chiller 2 condenser tubes** — Save ~420 kWh/day
   - COP will recover from 3.1 → 5.2
   - ROI: same-day payback

2. **Fix AHU-1 stuck damper** — Save ~185 kWh/day
   - Damper stuck at 45%, causing 15% excess cooling load
   - Requires actuator inspection

3. **Repair AHU-3 reheat valve** — Save ~95 kWh/day
   - Simultaneous heating & cooling detected
   - Valve leaking by at 15%

4. **Address Chiller 1 early fouling** — Save ~120 kWh/day
   - Preventive cleaning before it reaches Chiller 2 levels

**Combined savings potential: 820 kWh/day** (~฿86,100/month)`,

  'Explain low delta-T syndrome': `**Low Delta-T Syndrome — HVAC Fault Explanation**

Low delta-T occurs when the temperature difference between chilled water supply and return is lower than design. For CP9 chillers, design delta-T is **5.5°C**.

**Why it matters:**
- Chillers must pump more water to deliver the same cooling
- Pump energy increases significantly
- Chiller efficiency (COP) drops as it operates outside design conditions
- Can cascade — one low-delta-T chiller forces others to run

**Common causes:**
- Condenser fouling (most common — this is Chiller 2's issue)
- Dirty coils on AHUs
- Stuck or leaking control valves
- Oversized pumps or incorrect balancing

**At CP9 right now:** Chiller 2 has delta-T of 2.1°C (62% below design). This is caused by condenser fouling — approach temp increased from 2.8°C to 5.4°C. The fix is condenser tube cleaning.

**ASHRAE Reference:** RP-1043, Guideline 36`,
};

export const defaultResponse = `I can help you with AFDD diagnostics, fault analysis, and equipment recommendations. Here are some things I can assist with:

- **Fault diagnosis** — Ask about specific equipment or fault types
- **Energy analysis** — Identify waste and saving opportunities
- **Maintenance planning** — Prioritize repairs by impact
- **HVAC concepts** — Explain fault types, ASHRAE standards

Try asking me about a specific piece of equipment or fault condition!`;
