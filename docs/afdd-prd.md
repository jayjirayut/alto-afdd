# Agentic AFDD — Product Requirements Document

## Context

AltoTech Global is building an Agentic AFDD (Automated Fault Detection, Diagnostics & AI Recommendation) product to deliver autonomous fault detection, root cause diagnosis, and AI-powered remediation recommendations for commercial HVAC systems. This PRD captures everything learned across the ProductOS project — architecture decisions, validated tech stack, customer context, team capabilities, deployment data, and competitive positioning — into a single document comprehensive enough to bootstrap a new Claude Code project from scratch.

**Priority customers:** CPN (Central Pattana, 42 properties), CP9 (Central Rama 9 — first pilot), JW Marriott Bangkok, Dohome.

**Business driver:** CPN AI CPMS (Chiller Plant Management System) Guarantee Saving contract. AltoTech closing Series A round with CPN/G-Land investor pipeline (~7M USD / ~250M THB). AFDD is the key differentiator — cross-system fault detection that competitors (Clockworks, CopperTree, BrainBox) cannot do because they lack edge+cloud hybrid architecture and air+water integration.

---

## 1. Product Vision

**One-liner:** An autonomous AI agent system that detects HVAC faults in real-time, diagnoses root causes in <30 seconds, recommends prioritized maintenance actions, and eventually self-heals equipment — saving 40+ hours/month per site.

**Key principle:** XGBoost detects, Qwen explains on-site, Claude reasons in the cloud.

### What Makes This "Agentic"

Each AI capability operates as an autonomous agent with:
- **Own inputs/outputs** — subscribes to data topics, publishes results
- **Autonomous operation** — runs without human intervention once calibrated
- **Composability** — agents chain together (detection feeds diagnosis feeds recommendation)
- **LLM orchestration** — Claude/Qwen orchestrate multi-agent workflows, not just single-model inference
- **Tool use** — LLM agents query VOLTTRON agents iteratively (Agentic RAG pattern)
- **Edge-first** — works offline; cloud augments but isn't required

---

## 2. Architecture Overview

### 2.1 Four-Stage Pipeline

```
Stage 1: DETECT          Stage 2: DIAGNOSE        Stage 3: RECOMMEND       Stage 4: ACT
─────────────────        ─────────────────        ──────────────────       ──────────────
Location: Edge           Location: Edge           Location: Edge+Cloud     Location: Cloud+Edge

ASHRAE Rules             Isolation Forest         LSTM / TFT               MPC (CasADi)
Physics Equations        EWMA / CUSUM             XGBoost                  CAG / Agentic RAG
XGBoost                  Kalman Filter            Temporal CNN             LLM Orchestrator
Autoencoder              SHAP Explainability
LightGBM

Models:                  Models:                  Models:                  Models:
├ AHU Fault Classifier   ├ Sensor Anomaly Det.    ├ Cooling Load Forecast  ├ Chiller Sequencing MPC
└ Chiller Anomaly Det.   └ State Estimation       └ Energy Demand          └ AltoACE LLM

Output:                  Output:                  Output:                  Output:
→ Fault Alerts           → Root Cause + Severity  → Actionable Plan        → Control + Remediation
  (target: 97-99%)         (in <30 seconds)         (prioritized by $)       (auto work orders)
```

### 2.2 Six-Layer Intelligence Stack

This is the AltoOS platform layer that AFDD agents live within:

| Layer | Name | Technology | Purpose | Deployment | Status |
|-------|------|-----------|---------|------------|--------|
| Foundation | Data Quality Agent | EWMA, CUSUM, Isolation Forest, LSTM Autoencoders | Detect bias, stuck sensors, noise | Edge (ONNX Runtime) | **Live** |
| 1 | State Estimation Agent | Kalman Filter, Extended Kalman Filter | Hidden state inference (fouling, degradation) | Edge | Dev |
| 2 | FDD (Diagnostics) | XGBoost, ASHRAE Rules | Fault detection & classification | Edge (ONNX) | Rule FDD: **Live**, ML FDD: Dev |
| 3 | Forecasting | LSTM, Temporal CNN, TFT | Load & comfort prediction | Edge (Quantized) | Load Forecast: **Live**, Comfort: Dev |
| 4 | Optimization | MPC (CasADi/Pyomo) | Solver-based control | Edge (MPC Engine) | Dev |
| 5 | Reasoning | LLM + CAG + Agentic RAG | Orchestration & explanation | Edge GPU (NVIDIA NIM) | **Live** (AltoACE) |
| 6 | Evolution | Bayesian Optimization | Twin calibration, learning | Cloud → Edge push | Planned |

**Critical design rules:**
- **ML FDD augments, NEVER overrides Rule FDD** — rules are auditable, ML is early-warning
- **MPC for control, NOT Deep Learning** — DL is for forecasting only
- **LLMs explain; MPCs optimize** — never let an LLM make control decisions
- **If perception is wrong, everything above LIES** — Data Quality Agent is the foundation
- **LLM NEVER reads raw telemetry** — consumes only summarized insights from other agents
- **Safety mode: RECOMMEND-ONLY** (no direct BAS writes until Q4 self-healing phase)

### 2.3 Pub/Sub Agent Communication

```
telemetry/raw          → Data Quality Agent    → telemetry/validated
telemetry/validated    → Rule FDD Agent        → plant/fdd/rules
telemetry/validated    → ML FDD Agent          → plant/fdd/ml
telemetry/validated    → State Estimation      → plant/estimated_state
telemetry/validated    → Load Forecast Agent   → plant/forecast/load
plant/fdd/*            → LLM Orchestrator      → operator/recommendation
plant/forecast/*       → Predictive Control    → plant/optimization/proposal
plant/optimization/*   → Safety Guard Agent    → validated proposals only
```

### 2.4 System Boundary Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                    CLOUD — AltoACE AI Assistant                   │
│                                                                  │
│  Claude Sonnet 4.6 (Primary)    91% BS detection, 3% accepted   │
│  Claude Haiku 4.5 (Fast)        77% BS detection, 3x cheaper    │
│  Qwen 3.5-397B (Fallback)       78% BS detection, Apache 2.0    │
│                                                                  │
│  Capabilities: Fault explanation, diagnostic reports,            │
│  maintenance recommendations, multi-stage agentic workflows,    │
│  multi-property portfolio management                             │
└────────────────────────────────↑↓─────────────────────────────────┘
                           Bifrost Gateway
                     (Go, <100µs overhead, failover)
┌──────────────────────────────────────────────────────────────────┐
│                      EDGE — On-Site Processing                   │
│                                                                  │
│  ┌─────────┐  ┌─────────┐  ┌───────────┐  ┌──────────┐        │
│  │ DETECT  │→│ DIAGNOSE│→│ RECOMMEND │→│   ACT    │        │
│  │ Stage 1 │  │ Stage 2 │  │  Stage 3  │  │ Stage 4  │        │
│  └─────────┘  └─────────┘  └───────────┘  └──────────┘        │
│                                                                  │
│  Qwen 3.5-9B: Edge AI — fault explanation, Thai language,       │
│  multimodal (text+image+video), Apache 2.0                      │
│                                                                  │
│  Infrastructure: ONNX Runtime, TimescaleDB, BACnet/Modbus,      │
│  VOLTTRON, NVIDIA NIM                                            │
└──────────────────────────────────────────────────────────────────┘
                              ▲ Sensor Data
┌──────────────────────────────────────────────────────────────────┐
│  DATA SOURCES: BAS/BMS, Weather API, DHMS Vibration, CMMS,      │
│  Brick/Haystack ontology, Historical DB                          │
│                                                                  │
│  EQUIPMENT: Chillers, AHUs, Pumps, CTs, VRF, Boilers            │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack (Validated March 2026)

### 3.1 Detection Layer (Stage 1)

| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Primary ML** | XGBoost + ASHRAE RP-1043 Rules | 97-99% accuracy on ASHRAE chiller benchmark |
| **Secondary ML** | Autoencoder (chiller), LightGBM | Early anomaly detection before rules trigger |
| **Inference Runtime** | ONNX Runtime | Runs on edge, no GPU needed for detection |
| **Rule Engine** | ASHRAE Guidelines + Physics Rules + Threshold Logic | Explainable, auditable, regulatory-compliant |
| **Future** | PILLM (Physics-Informed LLM) | Auto-generates ASHRAE rules for new equipment types |

**Faults detected (target: 7 systems, 257 fault types):**
- Simultaneous heating & cooling
- Stuck damper / valve leak-by
- Sensor drift / offset
- Refrigerant undercharge
- Economizer malfunction
- Low delta-T syndrome
- Staging errors
- And 250+ more per ASHRAE standards

**Input data:** Supply/Return temperatures, flow rates, power consumption, schedules, setpoints

### 3.2 Edge AI (Explanation & Diagnostics)

| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Primary Edge LLM** | Qwen 3.5-9B | Best small model as of March 2026. Beats GPT-oss-120B (13x larger), Gemini 2.5 Flash-Lite |
| **Fallback (budget)** | Gemma 3n E4B | 3GB footprint, runs on Jetson Orin Nano |
| **Multimodal** | Text + Image + Video | Qwen 3.5-9B native capability |
| **Language** | Thai native (201 languages) | Critical for Thai building operators |
| **License** | Apache 2.0 | No API dependency, self-hosted |
| **VRAM** | ~6GB quantized | Fits on Jetson AGX Orin or T4000 |
| **Grounding** | Always pair with RAG/context | Never let edge LLM answer from memory alone |

### 3.3 Cloud AI (3-Tier Strategy)

| Tier | Model | Role | BS Detection | Accepted | Use Case |
|------|-------|------|-------------|----------|----------|
| **Primary** | Claude Sonnet 4.6 | Deep analysis | 91% | 3% | Multi-fault analysis, reports, agentic workflows |
| **Fast** | Claude Haiku 4.5 | Quick response | 77% | 12% | Alerts, summaries, simple single-fault diagnosis. 3x faster, 3x cheaper |
| **Fallback** | Qwen 3.5-397B | Independence | 78% | 5% | Open-weight (Apache 2.0), self-hosted, no API dependency |

**Routing:** Bifrost (open-source Go AI gateway) handles failover, load balancing, with <100µs overhead.

**Disqualified models (March 2026):**
- GLM-5 — 53-58% BS acceptance, would accept bad sensor data as fact
- Grok 4.20 — not independently verified, internal vs external benchmarks disagree
- Kimi K2.5 — 28% BS acceptance, poor for fault diagnosis

### 3.4 Hardware Tiers

| Tier | Device | Specs | Price | Target |
|------|--------|-------|-------|--------|
| **Tier 1 (Premium)** | NVIDIA Jetson T4000 | Blackwell, 1200 TOPS, 64GB, 70W | $1,999 | CPN, JWM, large sites. Available Q2 2026 |
| **Tier 2 (Standard)** | NVIDIA Jetson AGX Orin 64GB | Available now | $1,099 | Bridge to T4000. Most sites |
| **Tier 3 (Budget)** | NVIDIA Jetson Orin Nano Super | 249 | $249 | XGBoost + Gemma 3n + cloud fallback. Small sites |

### 3.5 Infrastructure Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Time-series DB** | TimescaleDB | Sensor data storage, hypertables for HVAC telemetry |
| **Agent Platform** | VOLTTRON | Multi-agent platform for building systems, BACnet/Modbus |
| **Protocol Layer** | BACnet/Modbus | BMS communication (read now, write-back Q4) |
| **Inference** | ONNX Runtime | Edge model serving for XGBoost, Autoencoder |
| **LLM Serving** | NVIDIA NIM | Edge GPU LLM deployment for Qwen 3.5-9B |
| **AI Gateway** | Bifrost | Cloud LLM routing, failover, load balancing |
| **Knowledge** | CAG (static) + Agentic RAG (dynamic) | SOPs, manuals, Brick ontology → CAG; FDD results, logs → Agentic RAG |
| **Ontology** | Brick Schema + Haystack | Equipment tagging, semantic interoperability |
| **Model Training** | PyTorch Lightning | Training loop for LSTM, Autoencoder models |
| **Model Export** | Quantized ONNX | Edge deployment of trained models |
| **MLOps** | MLflow or Weights & Biases (planned) | Model registry, versioning, monitoring (not yet built) |

### 3.6 Benchmark Sources (Verified)

| Source | What It Measures | Key Results |
|--------|-----------------|-------------|
| Vectara Hallucination Leaderboard | Grounded summarization | Qwen3-8B: 4.8% hallucination rate |
| BullshitBench v2 | Nonsense detection | Claude Sonnet 4.6: 91%/3%, Qwen 3.5-397B: 78%/5% |
| ASHRAE RP-1043 | Chiller fault detection | XGBoost: 97-99% accuracy |

---

## 4. Target Sites & Customer Context

### 4.1 Site Rollout Order (Priority)

| # | Site | Customer | Status | Why This Order |
|---|------|----------|--------|---------------|
| 1 | **Central Rama 9 (CP9)** | CPN (Central Pattana) | Chiller optimization already live | Fastest path to AFDD proof. Has live water-side, demand limit optimization from CP9 |
| 2 | **JW Marriott Bangkok** | JW Marriott | Most data history, AWI pipeline in progress | 441 rooms, longest deployment, most firefighting. Internal-only = no political risk |
| 3 | **Central Westgate** | CPN | Sensor detection deployed | Already has Sensor Anomaly Detection model (Isolation Forest v1.3) |
| 4 | **Dohome (Bang Phli, Nakhonsawan, Phuket)** | Dohome | Energy forecast live, air-side saving 5-14% | 3 stores with Air-side live. Energy Demand Forecast (XGBoost v2.1) deployed |
| 5 | **depa HQ** | Government | Full 5-layer stack deployed | Full stack but smaller building. Good for testing |

### 4.2 CPN (Central Pattana) — Priority Customer

**Relationship:** Strategic investor pipeline (7M USD / ~250M THB injection). 42 properties with 6 years of data (2019-2025) uploaded.

**Current deployments:**
- Water-side / CPMS: Live at CPN Properties (CEMD Phase 2)
- Multi-Property Platform: CPN onboarded, design workshops completed (4 workshops, 11/11 UX pages)
- AltoACE: CPN is a renewal customer
- Pump & CT Staging: Central Pattana is a customer
- Alto Multi-Property: CPN partner

**Multi-Property Platform milestones (CPN-relevant):**
- v0.9: UX Design — AFDD, EMS, Sanitary & WWTP pages designed ✅
- v1.0: Design Workshop #4 with CPN — 9/11 pages finalized ✅
- v1.1: Core Foundation — Dashboard, Subsystems, AFDD development (61%) 🔄
- v1.2: Unified Portal (internal) — planned
- v2.2: **Collective Intelligence — AFDD with Recommendation, Demand Forecasting, Smart Disaster Management** (planned, target June 2026)
- v3.2: Predictive Management and BIM Integration (planned, Sep 2026)

**CPN AI CPMS TOR Rev.04 requirements** (from earlier session analysis):
- 62 total requirements across 7 categories
- Requires Guarantee Saving model
- AFDD is a key deliverable in the contract scope

### 4.3 JW Marriott Bangkok

**Status:** AWI PoC in progress, most data history (441 rooms, longest deployment)
**Energy:** Gap analysis phase — predictive model built (R²=0.863 train, 0.792 test)
**Why for AFDD:** Causes most firefighting. Internal-only deployment = no political risk.
**Deployed models:** Sensor Anomaly Detection (IF v1.3), People Counter (YOLOv8 v2.0), Cooling Load Forecast (XGBoost v1.2), Energy Demand Forecast (XGBoost v2.1)
**Water-side milestone:** v3.0 SCHP Logic + Air-side Informed Control = AWI for JWM hotel

### 4.4 Dohome

**Status:** 3 stores live with Air-side optimization
**Energy savings:** 5-14% across stores (IPMVP-C verified)
- Bang Phli: 8-14% monthly
- Nakhonsawan: 5-11% monthly
**Issue:** FlowSave manual override reducing savings at some sites
**Deployed models:** Sensor Anomaly Detection (IF v1.3), Energy Demand Forecast (XGBoost v2.1)

---

## 5. Existing Models (Model Registry)

### 5.1 Production Models (4)

| Model | Algorithm | Product | Owner | Version | Sites |
|-------|-----------|---------|-------|---------|-------|
| Sensor Anomaly Detection | Isolation Forest | IoT/Platform | Nyan | v1.3 | JW Marriott, Dohome, Central Westgate |
| People Counter | YOLOv8 | CERO | Zayar | v2.0 | JW Marriott |
| Cooling Load Forecast | XGBoost | Water-side | Ham | v1.2 | JW Marriott |
| Energy Demand Forecast | XGBoost | AWI | Opal | v2.1 | JW Marriott, Dohome |

### 5.2 Training Models (AFDD-relevant)

| Model | Algorithm | Product | Owner | Version | Status |
|-------|-----------|---------|-------|---------|--------|
| **AHU Fault Classifier** | XGBoost | Air-side | Tata | v0.9 | Training (not validated, not deployable) |
| **Chiller Anomaly Detector** | Autoencoder | AFDD | Jay | v0.1 | Training (early) |
| Chiller Sequencing MPC | MPC (CasADi) | Water-side | Ham | v0.3 | Training |

### 5.3 Staging

| Model | Algorithm | Product | Owner | Version |
|-------|-----------|---------|-------|---------|
| Cooling Load Forecast (DL) | LSTM | AWI | Opal | v0.5 |

### 5.4 LLM (Production)

| Model | Algorithm | Product | Owner | Version |
|-------|-----------|---------|-------|---------|
| AltoACE Assistant | Multi-LLM (Claude + Gemini + ChatGPT) + CAG/Agentic RAG | AltoACE | Jay | v1.0 |

---

## 6. AFDD Roadmap (2026)

### Phase 1: FDD Foundation (Q1 2026) — CURRENT

**ID:** AFDD-Q1 | **Priority:** Must have | **Confidence:** Committed

**Objective:** Rule-based fault detection for chillers and AHUs. Alert system MVP.
**Metric:** Alerts live at 3+ sites
**Data readiness:** Ready
**Category:** MOAT — Cross-system FDD detects faults across air and water systems together

**Deliverables:**
- Rule FDD agent for chiller faults (ASHRAE-based)
- Rule FDD agent for AHU faults (ASHRAE-based)
- Alert notification system (LINE integration)
- Fault dashboard in Multi-Property Platform
- Per-site calibration workflow

### Phase 2: ML-based Detection (Q2 2026)

**ID:** AFDD-Q2 | **Priority:** Should have | **Confidence:** Planned

**Objective:** Anomaly detection using ML models. Reduce false positives.
**Metric:** False positive rate <10%
**Data readiness:** Partial
**Dependencies:** AFDD-Q1

**Deliverables:**
- XGBoost AHU Fault Classifier deployed (from Tata's v0.9 → validated production model)
- Autoencoder Chiller Anomaly Detector deployed (from Jay's v0.1 → validated)
- ML FDD augmenting Rule FDD (never overriding)
- Model registry (MLflow/W&B) for version tracking
- False positive tracking and feedback loop
- PILLM Auto-Rules — LLM generates ASHRAE rules for new equipment

### Phase 3: Predictive Maintenance (Q3 2026)

**ID:** AFDD-Q3 | **Priority:** Should have | **Confidence:** Exploratory

**Objective:** Predict equipment failures before they occur. Maintenance scheduling. Vibration-based predictive maintenance.
**Metric:** DHMS pilot at 1+ site; Predict failures 7+ days ahead
**Data readiness:** Partial
**Dependencies:** AFDD-Q2
**Partner:** DHMS (vibration sensors)

**Deliverables:**
- DHMS vibration sensor integration
- Predictive failure models (7+ days ahead)
- Maintenance scheduling system
- Integration with CMMS work order generation
- Multi-property AFDD view (centralized across all sites)

### Phase 4: Self-Healing Systems (Q4 2026)

**ID:** AFDD-Q4 | **Priority:** Nice to have | **Confidence:** Exploratory

**Objective:** Automated remediation for common faults. Integration with BMS.
**Metric:** Auto-remediation for 5+ fault types
**Data readiness:** Blocked (requires BMS write-back)
**Dependencies:** AFDD-Q3

**Deliverables:**
- BMS write-back capability (BACnet/Modbus commands)
- Auto-remediation for 5+ common fault types
- Safety guard validation before every auto-action
- Human-in-the-loop approval for high-risk actions
- Multi-Property centralized AFDD all sites

### Multi-Property Integration Timeline

| Version | Target Date | Feature | Status |
|---------|-------------|---------|--------|
| v1.1 | 2026-03-20 | Core Foundation — AFDD development (61%) | In Progress |
| v2.2 | 2026-06-19 | Collective Intelligence — AFDD with Recommendation, Demand Forecasting | Planned |
| v3.2 | 2026-09-11 | Predictive Management and BIM Integration | Planned |
| v3.4 | 2026-11-30 | Preventive Maintenance (AFDD) — monitoring-as-a-service ready | Planned |

---

## 7. Detailed Agent Specifications

### 7.1 Data Quality Agent (Foundation — LIVE)

**Purpose:** Validates all incoming sensor telemetry. Downstream agents only consume validated data.
**Critical:** If perception is wrong, everything above LIES.

**Techniques:**
- EWMA (Exponentially Weighted Moving Average) — trend detection
- CUSUM (Cumulative Sum) — drift detection
- Isolation Forest — multivariate anomaly detection
- LSTM Autoencoders — temporal pattern anomalies

**Inputs:** Raw sensor telemetry from BAS/BMS
**Outputs:** `telemetry/validated` topic — cleaned, flagged data
**Deployment:** Edge (ONNX Runtime)
**Update cadence:** Continuous
**Current model:** Sensor Anomaly Detection v1.3 (Isolation Forest, Nyan) — deployed at JW Marriott, Dohome, Central Westgate

### 7.2 Rule FDD Agent (Layer 2 — LIVE)

**Purpose:** Physics-based and ASHRAE-standard fault detection. Explainable, auditable, high confidence.

**Techniques:**
- ASHRAE Guidelines (RP-1043, Guideline 36)
- Physics-based rules (thermodynamic equations, mass/energy balance)
- Threshold Logic (configurable per equipment type and site)

**Detects:**
- Low Delta-T syndrome (chiller plant)
- Sensor Drift / offset
- Staging Errors (wrong chiller/pump sequence)
- Simultaneous Heating & Cooling
- Stuck damper / valve leak-by
- Economizer malfunction
- Refrigerant undercharge

**Inputs:** `telemetry/validated`
**Outputs:** `plant/fdd/rules` — fault type, severity (1-5), confidence, affected equipment
**Deployment:** Edge (lightweight, no ML)
**Powers:** AWI, Air-side, Water-side, AFDD

### 7.3 ML FDD Agent (Layer 2 — DEV)

**Purpose:** Pattern-based anomaly detection for early warning BEFORE rules trigger.
**Critical rule:** ML FDD augments, NEVER overrides Rule FDD.

**Techniques:**
- XGBoost — primary classifier (AHU faults)
- LightGBM — secondary classifier
- Random Forest — ensemble diversity
- Autoencoder — unsupervised anomaly detection (chiller)

**Current models in training:**
- AHU Fault Classifier (XGBoost v0.9, Tata) — not validated yet
- Chiller Anomaly Detector (Autoencoder v0.1, Jay) — early training

**Inputs:** `telemetry/validated`, Historical Database
**Outputs:** `plant/fdd/ml` — anomaly scores, early warnings, predicted fault type
**Deployment:** Edge (ONNX) → Cloud fallback for heavy models
**Powers:** AWI, Air-side, Water-side, AFDD

### 7.4 State Estimation Agent (Layer 1 — DEV)

**Purpose:** Infers hidden states (fouling level, degradation rate) from observable sensor data.

**Techniques:**
- Kalman Filter — linear state estimation
- Extended Kalman Filter (EKF) — nonlinear state estimation

**Inputs:** `telemetry/validated`
**Outputs:** `plant/estimated_state` — fouling coefficients, degradation rates, efficiency factors
**Deployment:** Edge
**Powers:** AWI, Water-side

### 7.5 Load Forecast Agent (Layer 3 — LIVE)

**Purpose:** Predicts cooling/heating demand using weather and telemetry data.

**Techniques:**
- XGBoost — production model (v1.2, Ham)
- LSTM — deep learning variant (v0.5 staging, Opal)
- Temporal Fusion Transformers (TFT) — advanced forecasting

**Current models:**
- Cooling Load Forecast (XGBoost v1.2) — Production at JW Marriott
- Cooling Load Forecast DL (LSTM v0.5) — Staging
- Energy Demand Forecast (XGBoost v2.1) — Production at JW Marriott, Dohome

**Training tooling:** PyTorch Lightning (train), Quantized ONNX (deploy)
**Inputs:** `telemetry/validated`, Weather API
**Outputs:** `plant/forecast/load` — hourly/daily demand predictions
**Deployment:** Edge (Quantized) → Cloud for training
**Update cadence:** Monthly retraining

### 7.6 Predictive Control Agent (Layer 4 — DEV)

**Purpose:** MPC-based optimization with physics backend (EnergyPlus FMU).
**Critical:** MPC for control, NOT Deep Learning. DL is for forecasting.

**Techniques:**
- MPC (Model Predictive Control)
- CasADi — optimization solver
- Pyomo — alternative solver

**Current model:** Chiller Sequencing MPC (CasADi v0.3, Ham) — training
**Safety mode:** RECOMMEND-ONLY (no direct BAS writes)
**Inputs:** Load Forecast, Comfort Forecast, Tariff Schedules
**Outputs:** `plant/optimization/proposal` — setpoint changes, staging recommendations

### 7.7 Safety Guard Agent (Layer 4 — DEV)

**Purpose:** Blocks unsafe optimization proposals before they reach operator UI.

**Checks:**
- Humidity risk (critical for hotels)
- Comfort violations (temperature bounds)
- Setpoint bounds (equipment limits)
- Demand caps (utility contract limits)

**Inputs:** Optimization proposals
**Outputs:** Validated proposals only (unsafe proposals blocked and logged)

### 7.8 LLM Orchestrator Agent (Layer 5 — LIVE as AltoACE)

**Purpose:** Synthesizes insights into actionable recommendations for operators.
**Critical:** LLM NEVER reads raw telemetry. Consumes only summarized insights.

**Architecture:**
- **Multi-LLM:** Claude (primary), Gemini (Thai), ChatGPT (reasoning) via LiteLLM gateway
- **CAG (static reference):** SOPs, Equipment Manuals, Brick Ontology, ASHRAE Guidelines — pre-loaded into context window, no vector DB needed
- **Agentic RAG (dynamic ops):** FDD Results, Optimization Proposals, Historical Logs, CMMS Work Orders — LLM queries VOLTTRON agents iteratively
- **Tool Use:** LLM has tools to query individual agents for results

**Deployment target:** Edge GPU (NVIDIA NIM) for on-site Qwen 3.5-9B; Cloud for Claude/Gemini/ChatGPT
**Inputs:** FDD Results, Optimization Proposals, VOLTTRON Agent Tools
**Outputs:** `operator/recommendation` — plain language explanations, prioritized action lists, diagnostic reports

### 7.9 Self-Learning Agent (Layer 6 — PLANNED)

**Purpose:** Continuously calibrates EnergyPlus digital twin using Bayesian Optimization.
**Depends on:** Digital Twin maturity
**Inputs:** Operational data, Operator decisions
**Target:** Q3 2026

---

## 8. Data Architecture

### 8.1 Data Sources

| Source | Protocol | Data Type | Frequency |
|--------|----------|-----------|-----------|
| BAS/BMS | BACnet/Modbus | Equipment status, setpoints, alarms | Real-time (1-5s) |
| Weather API | REST | Temperature, humidity, solar radiation | 15-min intervals |
| DHMS Vibration | IoT (LoRaWAN/MQTT) | Vibration signatures | Continuous |
| CMMS | REST API | Work orders, maintenance history | Event-driven |
| Brick/Haystack | RDF/JSON | Equipment ontology, relationships | Static (updated monthly) |
| Historical DB | TimescaleDB | Historical sensor data, training data | Batch (daily) |

### 8.2 Equipment Scope

**Target: 7 equipment systems, 257 fault types**

| Equipment | Key Sensors | Fault Examples |
|-----------|------------|----------------|
| **Chillers** | CW supply/return temp, CHW supply/return temp, power, flow | Low delta-T, refrigerant undercharge, compressor surge, condenser fouling |
| **AHUs** | Supply/return/mixed air temp, damper position, filter DP, fan speed | Stuck damper, simultaneous heat/cool, economizer fault, sensor drift |
| **Pumps** | Flow rate, power, pressure differential, vibration | Cavitation, bearing wear, impeller degradation, seal leak |
| **Cooling Towers** | Approach temp, fan speed, water flow, basin temp | Fan motor failure, fill fouling, scale buildup, drift eliminator |
| **VRF** | Refrigerant pressure/temp, compressor current, indoor/outdoor coils | Refrigerant leak, compressor failure, expansion valve stuck |
| **Boilers** | Stack temp, combustion efficiency, water temp/pressure | Flame failure, scale buildup, low water cutoff |

### 8.3 Data Pipeline (Edge → Cloud)

```
BAS/BMS (BACnet/Modbus)
    ↓ VOLTTRON agents (read every 1-5s)
    ↓
TimescaleDB (Edge — hypertables, retention policy)
    ↓ Data Quality Agent validates
    ↓
Validated Telemetry (pub/sub)
    ↓ Fan out to: Rule FDD, ML FDD, Load Forecast, State Estimation
    ↓
Agent Results (stored in TimescaleDB)
    ↓ Bifrost gateway (batch sync to cloud)
    ↓
Cloud TimescaleDB (aggregated, multi-site)
    ↓ Multi-Property Dashboard, AltoACE queries
```

---

## 9. User Experience

### 9.1 Personas

| Persona | Role | Needs | Frequency |
|---------|------|-------|-----------|
| **Facility Manager** | Day-to-day operations | Fault alerts, prioritized action list, work order generation | Daily |
| **Building Engineer** | Technical diagnosis | Root cause analysis, sensor data, equipment history | On fault |
| **Property Executive** | Portfolio oversight | Multi-property health dashboard, energy savings, AFDD coverage | Weekly |
| **CAIO / CTO** | Strategic | Model performance, coverage metrics, cost analysis | Monthly |

### 9.2 Key User Flows

**Flow 1: Fault Alert → Resolution**
1. Data Quality Agent validates incoming sensor data
2. Rule FDD Agent detects fault (e.g., "Chiller 2: Low Delta-T, Severity 3")
3. ML FDD Agent confirms/extends (e.g., "Anomaly score 0.87, trending since 3 days ago")
4. LLM Orchestrator (Qwen on edge) generates plain-language explanation:
   > "Chiller 2 has low delta-T (2.1°C vs normal 5.5°C), likely due to condenser fouling. Energy waste: ~350 kWh/day. Recommend: Schedule condenser cleaning within 7 days."
5. Alert sent via LINE with severity, impact estimate, and recommended action
6. FM opens Multi-Property dashboard → sees fault card with root cause
7. FM clicks "Create Work Order" → auto-populated maintenance ticket
8. After resolution, system confirms normal operation

**Flow 2: Predictive Maintenance (Q3)**
1. State Estimation Agent detects increasing fouling coefficient
2. Load Forecast Agent shows degrading efficiency trend
3. LLM predicts: "Based on current degradation rate, Chiller 2 will need tube cleaning in 12 days"
4. System auto-schedules maintenance during low-demand window
5. DHMS vibration data confirms bearing wear pattern

**Flow 3: Multi-Property Portfolio View (CPN)**
1. Executive opens Multi-Property Platform → sees 42-property health grid
2. AFDD health scores for each property (green/amber/red)
3. Drill into any property → see active faults, severity, resolution status
4. Cross-property analytics: fault patterns, common issues, benchmark comparison
5. Monthly report auto-generated with energy waste quantification

### 9.3 Notification System

| Channel | Use Case | Severity |
|---------|----------|----------|
| **LINE** | Real-time alerts | Severity 3-5 (immediate) |
| **Dashboard** | All faults and status | All severities |
| **Email** | Daily/weekly digest | Aggregated |
| **AltoACE Chat** | Interactive diagnosis | On-demand |

### 9.4 Dashboard Pages (Multi-Property Platform)

Already designed (v0.9 milestone complete):
- **AFDD Overview** — fault summary cards, active/resolved/pending
- **EMS (Energy Management System)** — energy consumption, savings tracking
- **Subsystem pages** — per-equipment type views
- **KPI Tracking** — target vs actual metrics per property
- **Analytics & Compare** — cross-property benchmarking

---

## 10. Team & Capacity

### 10.1 Current AFDD-Relevant Team (17 total, 6 AI)

| Person | Role | AFDD Allocation | Current Work |
|--------|------|----------------|--------------|
| **Jay** | CAIO | 35% | Chiller Anomaly Detector (Autoencoder v0.1), LLM Orchestrator, AFDD strategy |
| **Tata** | AI Engineer (junior) | 0% (100% Air-side) | AHU Fault Classifier (XGBoost v0.9) — will transfer to AFDD |
| **Opal** | Director of AI | 0% (AWI/Water) | Load Forecast, Energy Demand — models reusable for AFDD Stage 3 |
| **Ham** | AI Engineer | 0% (Water/AWI) | Chiller Sequencing MPC, Cooling Load Forecast — reusable for Stage 4 |
| **Nyan** | AIoT Engineer | 0% (Water-side) | Sensor Anomaly Detection (Isolation Forest) — directly used in AFDD Stage 2 |
| **Eyp** | Director of Software Eng. | 0% (Multi-Property 100%) | Multi-Property Platform — AFDD dashboard integration |

### 10.2 Skill Requirements for AFDD

Required: AI/ML, Data Engineering, Controls
Missing: Dedicated AFDD ML engineer, AI Platform Lead (for MLOps)

### 10.3 Hiring Needs (AFDD-relevant)

| ID | Role | Level | Urgency | AFDD Impact |
|----|------|-------|---------|-------------|
| hire-3 | ML & Vision Engineer | Mid | Normal | Build shared ML infrastructure (model registry, MLOps, serving). AFDD model deployment |
| hire-2 | Senior PM | Critical | Critical | Unblocks AI Platform Lead hire. Owns Hotel + AWI |
| hire-4 | Senior Controls Engineer | Critical | Critical | Hotel + Air-side. Could support AFDD calibration |

### 10.4 Infrastructure Blockers

**Currently NO centralized ML infrastructure:**
- No model registry (each engineer tracks their own)
- No standardized model serving layer
- No automated versioning/rollback
- No feature store
- No model performance monitoring or drift detection
- No shared training pipeline

**Target state (post AI Platform Lead hire):**

| Component | Tool | Timeline |
|-----------|------|----------|
| Model Registry | MLflow or Weights & Biases | Month 1-2 |
| Model Serving | Standardized inference API | Month 2-3 |
| Versioning & Rollback | Git-based model artifacts | Month 1 |
| Feature Store | TBD (evaluate Feast, Tecton) | Month 3-6 |
| Monitoring | Model performance dashboards | Month 2-3 |
| Training Pipeline | Standardized scripts + CI | Month 1-2 |

**Sequencing (blocked on hires):**
1. Define standards and strategy — Done (this PRD + existing docs)
2. Hire AI Platform Lead — Blocked on Senior PM hire
3. Audit current ML workflows — First 30 days of hire
4. Build minimal MLOps — Months 1-3
5. ML FDD prototype at CP9 / JWM — After step 4
6. Validate internally — 1-2 months
7. Package as sellable module — After validation

---

## 11. Competitive Landscape

| Competitor | Approach | Strength | AltoTech Edge |
|-----------|----------|----------|--------------|
| **Clockworks Analytics** | Largest pure-play AFDD, cloud-only | Market leader, established customer base | We run optimization AND detection on-site (edge-first). They can't do edge |
| **CopperTree (Kaizen)** | Acquired by Dar Group | Enterprise backing | We have cross-system air+water FDD. They're siloed |
| **BrainBox AI** | Autonomous HVAC, up to 25% savings claim | Strong AI narrative | We have proprietary data moat (50-200 buildings), domain expertise embedding |
| **Traditional BMS** | Johnson Controls, Siemens, Honeywell | Installed base, integration | We're BMS-agnostic, work with any existing BMS via BACnet/Modbus |

**AltoTech's moat:**
1. **Proprietary data** — 50-200 buildings generating continuous operational data
2. **Domain expertise** — Deep HVAC/building systems knowledge embedded in models (not generic ML)
3. **Edge AI** — Real-time inference at the building, not dependent on cloud. Works offline
4. **Cross-system** — Air+Water integrated FDD (competitors do one or the other)
5. **Data flywheel** — More buildings → More data → Better models → Better results → More buildings

---

## 12. Knowledge Architecture

### 12.1 CAG (Context-Augmented Generation) — Static Reference

Pre-loaded into LLM context window. No vector DB needed.

| Knowledge Source | Content | Update Frequency |
|-----------------|---------|-----------------|
| ASHRAE Guidelines | Guideline 36, RP-1043, HVAC fault rules | Yearly |
| Equipment Manuals | Chiller, AHU, pump manufacturer specs per site | Per installation |
| Brick Ontology | Equipment relationships, sensor semantics | Monthly |
| SOPs | Standard operating procedures per building type | Quarterly |
| Fault Library | Known fault patterns, root causes, remediation | Continuous (grows) |

### 12.2 Agentic RAG — Dynamic Operations

LLM queries VOLTTRON agents iteratively for live data.

| Data Source | Agent Query | Response |
|------------|-------------|----------|
| FDD Results | "What faults are active on Chiller 2?" | Fault type, severity, timestamps |
| Optimization Proposals | "What's the recommended setpoint for AHU-3?" | Proposed setpoints with justification |
| Historical Logs | "Show Chiller 2 performance last 30 days" | Time-series summary with trends |
| CMMS Work Orders | "What maintenance was done on AHU-3 last month?" | Work order history |
| Sensor Telemetry | "What's the current delta-T on Chiller 2?" | Latest validated reading |

---

## 13. API & Integration Design

### 13.1 Internal Agent API

Each agent exposes a standardized interface:

```python
class AFDDAgent:
    def configure(self, site_config: dict) -> None:
        """Per-site calibration parameters"""

    def process(self, data: ValidatedTelemetry) -> AgentResult:
        """Main processing loop — called on new data"""

    def get_status(self) -> AgentStatus:
        """Health check — running, error, degraded"""

    def get_metrics(self) -> dict:
        """Performance metrics — latency, accuracy, throughput"""
```

### 13.2 External MCP Integration

AltoTech already has MCP (Model Context Protocol) server with 16 tools. AFDD should extend this:

```
New MCP tools for AFDD:
├── get_active_faults(site_id) → current faults with severity
├── get_fault_history(site_id, days) → historical fault timeline
├── get_equipment_health(site_id, equipment_id) → health score + factors
├── get_afdd_coverage() → which sites have AFDD, which models deployed
├── get_fault_analytics(site_id) → fault frequency, MTTR, energy waste
└── diagnose_fault(fault_id) → LLM-powered root cause analysis
```

### 13.3 Notification API

```
POST /api/alerts
{
  "fault_id": "F-2026-03-001",
  "site": "central-rama-9",
  "equipment": "chiller-2",
  "fault_type": "low-delta-t",
  "severity": 3,
  "root_cause": "Condenser fouling suspected",
  "energy_waste_kwh_day": 350,
  "recommended_action": "Schedule condenser cleaning within 7 days",
  "channels": ["line", "dashboard", "email"]
}
```

---

## 14. Metrics & KPIs

### 14.1 Model Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| Detection accuracy (Rule FDD) | 97-99% | ASHRAE RP-1043 benchmark |
| False positive rate | <10% | After ML FDD augmentation |
| Root cause time | <30 seconds | From fault detection to diagnosis |
| Prediction horizon | 7+ days | For predictive maintenance |
| LLM hallucination rate | <5% | Grounded by RAG/CAG |

### 14.2 Operational

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time saved per site | 40+ hrs/month | Manual inspection hours eliminated |
| Fault coverage | 7 equipment systems, 257 fault types | Progressive rollout |
| Edge inference latency | <100ms per detection cycle | ONNX Runtime on Jetson |
| Cloud inference latency | <5s for full diagnosis | Via Bifrost → Claude |
| System uptime | 99.5% | Edge resilience (works offline) |

### 14.3 Business Impact

| Metric | Target | Measurement |
|--------|--------|-------------|
| Energy waste identified | Quantified in kWh/month per site | Per fault |
| Maintenance cost reduction | 20-30% | Predictive vs reactive |
| Equipment downtime reduction | 50% | Predictive maintenance effect |
| Customer retention | Zero missed renewals (JWM, CPN, VENCO, BDMS) | Per CAIO 2026 goals |

---

## 15. Security & Safety

### 15.1 Safety Principles

1. **RECOMMEND-ONLY until Q4** — No direct BMS writes. All actions require human approval
2. **Safety Guard Agent** validates every optimization proposal before display
3. **Severity-gated notifications** — Severity 4-5 require immediate human acknowledgment
4. **Audit trail** — Every fault detection, diagnosis, and recommendation logged with timestamp
5. **Human-in-the-loop** for all BMS write-back actions (even in Q4 self-healing phase, initially)

### 15.2 Data Security

- Edge processing keeps sensitive building data on-site
- Cloud sync is aggregated/summarized, not raw telemetry
- MCP server uses WorkOS AuthKit (Google OAuth) + static bearer token authentication
- Cookie-based sessions with domain restriction (@altotech.ai/net)

### 15.3 Model Safety

- ML FDD never overrides Rule FDD
- LLM never reads raw telemetry
- Edge LLM (Qwen 3.5-9B) always grounded with RAG/context — never answers from memory alone
- BullshitBench v2 validation for all LLM models in the stack

---

## 16. Deployment & DevOps

### 16.1 Per-Site Deployment

```
1. Site Assessment
   ├── Equipment inventory (chillers, AHUs, pumps, CTs)
   ├── BMS type and protocol (BACnet/Modbus)
   ├── Sensor availability audit
   └── Network topology

2. Hardware Installation
   ├── Jetson device (T4000 / AGX Orin / Orin Nano)
   ├── VOLTTRON agent deployment
   ├── TimescaleDB setup (edge)
   └── BACnet/Modbus gateway configuration

3. Site Calibration
   ├── Baseline period (30-90 days of normal operation data)
   ├── Rule FDD threshold tuning (per equipment specs)
   ├── ML model fine-tuning (transfer learning from base models)
   ├── Brick/Haystack ontology mapping
   └── Alert threshold configuration

4. Validation
   ├── Run parallel with manual inspection for 2-4 weeks
   ├── False positive rate validation (<10%)
   ├── Root cause accuracy validation
   └── Operator feedback integration

5. Go-Live
   ├── Switch to autonomous operation
   ├── LINE alert integration
   ├── Dashboard access provisioned
   └── Monthly model retraining scheduled
```

### 16.2 Model Deployment Pipeline (Target)

```
Training (Cloud GPU)
  → MLflow tracking (metrics, artifacts)
  → Model export (ONNX quantized)
  → Model registry (version, metadata)
  → Edge deployment (OTA push via NVIDIA NIM)
  → Canary deployment (one site first)
  → Full rollout (all configured sites)
  → Monitoring (drift detection, accuracy tracking)
```

---

## 17. Open Questions & Risks

### 17.1 Technical Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| ML infrastructure doesn't exist yet | Can't deploy ML FDD models | Start with Rule FDD only (Q1). MLOps is Q2 dependency |
| AHU Fault Classifier not validated | Q2 ML detection delayed | Parallel validation track during Q1 |
| Edge hardware (T4000) not available until Q2 | Can't deploy edge LLM | Use AGX Orin as bridge + cloud fallback |
| BMS write-back requires vendor cooperation | Q4 self-healing blocked | Focus on RECOMMEND-ONLY through Q3 |
| CPN TOR Rev.04 has 62 requirements | Scope creep | Compliance checklist already created, track systematically |

### 17.2 Organizational Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| AI Platform Lead hire blocked on Senior PM hire | All MLOps delayed | Accelerate PM hire (hire-2 is critical priority) |
| Jay at 35% AFDD allocation | CAIO bandwidth | Hire ML engineer (hire-3) to take over model training |
| Tata at 100% Air-side | AHU Fault Classifier stuck | Reassign Tata partially to AFDD after Air-side Q1 completion |
| Zero infrastructure capacity | Can't build MLOps | hire-3 (ML & Vision Engineer) to own infrastructure |
| Hotel PM gap (Dol resigned) | Cascading team pressure | hire-2 (Senior PM) critical |

### 17.3 Open Questions

1. What tools/workflows does each ML person currently use? (Need audit)
2. Has Ham prototyped any shared infrastructure?
3. What's the biggest friction point in deploying a model today?
4. How much time does fault firefighting actually consume per week?
5. CPN Guarantee Saving calculation methodology — IPMVP-C or different?
6. DHMS vibration sensor specifications and integration protocol
7. BMS write-back vendor cooperation at CPN properties

---

## 18. Packaging & Pricing (Future)

ML Services capabilities will be sold as modules. Pricing model TBD:

**Likely structure:** Per-module per-site per-month
- Base AFDD (Rule FDD + Dashboard): included in CPMS contract
- ML FDD add-on: X THB/month/site
- Predictive Maintenance: X THB/month/site
- AltoACE AI Assistant: X THB/month/site
- Self-Healing (BMS write-back): X THB/month/site + setup fee

**Not designing pricing now.** Becomes relevant after ML FDD is validated internally and proven to work at CP9.

---

## 19. Implementation Guide for New Project

### 19.1 Project Structure (Recommended)

```
alto-afdd/
├── agents/
│   ├── data_quality/          # Foundation: sensor validation
│   │   ├── agent.py           # EWMA, CUSUM, Isolation Forest
│   │   ├── config.py          # Per-site thresholds
│   │   └── tests/
│   ├── rule_fdd/              # Layer 2: ASHRAE rules
│   │   ├── agent.py           # Rule engine
│   │   ├── rules/             # ASHRAE rule definitions (YAML/JSON)
│   │   │   ├── chiller.yaml   # Chiller fault rules
│   │   │   ├── ahu.yaml       # AHU fault rules
│   │   │   ├── pump.yaml      # Pump fault rules
│   │   │   └── ct.yaml        # Cooling tower rules
│   │   ├── config.py
│   │   └── tests/
│   ├── ml_fdd/                # Layer 2: ML detection
│   │   ├── agent.py           # XGBoost, Autoencoder wrapper
│   │   ├── models/            # Trained model artifacts (ONNX)
│   │   ├── training/          # Training scripts
│   │   │   ├── ahu_fault_classifier.py
│   │   │   └── chiller_anomaly.py
│   │   ├── config.py
│   │   └── tests/
│   ├── state_estimation/      # Layer 1: Kalman filters
│   ├── load_forecast/         # Layer 3: XGBoost, LSTM
│   ├── predictive_control/    # Layer 4: MPC (CasADi)
│   ├── safety_guard/          # Layer 4: Constraint validation
│   ├── llm_orchestrator/      # Layer 5: Multi-LLM + RAG
│   │   ├── agent.py           # Orchestrator logic
│   │   ├── tools/             # VOLTTRON agent tool definitions
│   │   ├── knowledge/         # CAG content (SOPs, manuals, Brick)
│   │   ├── prompts/           # System prompts per task type
│   │   └── tests/
│   └── self_learning/         # Layer 6: Bayesian optimization (future)
├── core/
│   ├── pubsub.py              # Agent communication bus
│   ├── telemetry.py           # Telemetry data models
│   ├── faults.py              # Fault type definitions
│   ├── equipment.py           # Equipment models (Brick schema)
│   ├── config.py              # Site configuration management
│   └── metrics.py             # Performance metrics collection
├── infrastructure/
│   ├── timescaledb/           # Schema, migrations, queries
│   ├── volttron/              # VOLTTRON agent configs
│   ├── bacnet/                # BACnet/Modbus integration
│   ├── bifrost/               # Cloud AI gateway config
│   ├── nvidia_nim/            # Edge LLM deployment
│   └── mlops/                 # MLflow/W&B setup
├── api/
│   ├── alerts.py              # Notification API (LINE, email)
│   ├── dashboard.py           # Dashboard data API
│   ├── mcp_tools.py           # MCP tool extensions for AFDD
│   └── auth.py                # Authentication
├── dashboard/                 # Web UI (React/Next.js)
│   ├── components/
│   │   ├── FaultCard.jsx
│   │   ├── EquipmentHealth.jsx
│   │   ├── SeverityBadge.jsx
│   │   └── MultiPropertyGrid.jsx
│   └── pages/
│       ├── overview.jsx       # AFDD overview
│       ├── equipment/[id].jsx # Equipment detail
│       └── portfolio.jsx      # Multi-property view
├── deployment/
│   ├── edge/                  # Jetson deployment scripts
│   ├── cloud/                 # Cloud infrastructure (Terraform)
│   └── calibration/           # Site calibration tools
├── data/
│   ├── ashrae_rules/          # ASHRAE RP-1043 rule library
│   ├── fault_library/         # Known fault patterns
│   ├── equipment_specs/       # Per-site equipment configurations
│   └── training_data/         # Historical data for model training
├── docs/
│   ├── PRD.md                 # This document
│   ├── ARCHITECTURE.md        # Technical architecture
│   ├── DEPLOYMENT.md          # Deployment guide
│   └── API.md                 # API documentation
├── scripts/
│   ├── calibrate_site.py      # Per-site calibration workflow
│   ├── train_models.py        # Model training pipeline
│   ├── export_onnx.py         # ONNX model export
│   └── deploy_edge.py         # Edge OTA deployment
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── CLAUDE.md                  # Claude Code project instructions
├── pyproject.toml             # Python project config
├── docker-compose.yml         # Local development
└── README.md
```

### 19.2 Tech Stack for New Project

| Layer | Technology | Version |
|-------|-----------|---------|
| **Language** | Python 3.12+ | Primary for agents, ML |
| **Web Framework** | FastAPI | Agent APIs, dashboard backend |
| **Dashboard** | React 19 + Vite 7 + Tailwind CSS | Reuse ProductOS patterns |
| **ML Training** | PyTorch Lightning, scikit-learn, XGBoost | Model training |
| **ML Serving** | ONNX Runtime | Edge inference |
| **Time-series DB** | TimescaleDB | Both edge and cloud |
| **Message Bus** | VOLTTRON / MQTT | Agent communication |
| **BMS Protocol** | BACnet (bacpypes3), Modbus (pymodbus) | Equipment communication |
| **LLM SDK** | anthropic (Claude), litellm (multi-provider) | Cloud LLM access |
| **Edge LLM** | NVIDIA NIM + Qwen 3.5-9B | On-site LLM inference |
| **AI Gateway** | Bifrost | Cloud LLM routing |
| **MLOps** | MLflow | Model registry, tracking |
| **Ontology** | Brick Schema | Equipment metadata |
| **Containerization** | Docker + Docker Compose | Development and deployment |
| **Edge Platform** | NVIDIA JetPack | Jetson deployment |

### 19.3 Development Phases

**Phase 0: Foundation (Week 1-2)**
- Project scaffolding with recommended structure
- TimescaleDB schema for HVAC telemetry
- VOLTTRON/MQTT pub/sub bus setup
- BACnet/Modbus mock data generator
- Data Quality Agent (port existing Isolation Forest model)

**Phase 1: Rule FDD (Week 3-6)**
- ASHRAE chiller fault rules (RP-1043)
- ASHRAE AHU fault rules
- Fault severity scoring (1-5)
- Alert notification system (LINE integration)
- Basic dashboard (fault list, equipment health)

**Phase 2: ML FDD (Week 7-12)**
- AHU Fault Classifier training pipeline (XGBoost)
- Chiller Anomaly Detector training (Autoencoder)
- ONNX export and edge deployment
- ML augmentation layer (ML warns, Rules confirm)
- False positive tracking and feedback loop

**Phase 3: LLM Integration (Week 13-16)**
- Claude API integration for cloud diagnosis
- Qwen 3.5-9B edge deployment (NVIDIA NIM)
- CAG knowledge base (ASHRAE, SOPs, Brick)
- Agentic RAG (VOLTTRON agent tools)
- Natural language fault explanation

**Phase 4: Multi-Property (Week 17-20)**
- Cloud aggregation pipeline
- Multi-property dashboard
- Cross-property fault analytics
- Portfolio health scoring
- CPN 42-property integration

### 19.4 CLAUDE.md for New Project

```markdown
# Alto AFDD — Agentic Fault Detection, Diagnostics & AI Recommendation

## Architecture
- 4-stage pipeline: Detect → Diagnose → Recommend → Act
- 6-layer intelligence stack (see docs/ARCHITECTURE.md)
- Edge-first: works offline, cloud augments
- Key rule: ML FDD augments, NEVER overrides Rule FDD

## Tech Stack
- Python 3.12+, FastAPI, PyTorch Lightning
- TimescaleDB (edge + cloud), VOLTTRON, BACnet/Modbus
- XGBoost + ONNX Runtime (detection), Claude/Qwen (reasoning)
- React 19 + Vite 7 + Tailwind CSS (dashboard)

## Key Design Principles
- XGBoost detects, Qwen explains on-site, Claude reasons in the cloud
- MPC for control, NOT Deep Learning (DL is for forecasting)
- LLM NEVER reads raw telemetry — only summarized insights
- Safety mode: RECOMMEND-ONLY (no direct BAS writes)
- If perception is wrong, everything above LIES

## Site Priority
1. Central Rama 9 (CP9) — CPN, chiller optimization already live
2. JW Marriott Bangkok — most data, internal-only deployment
3. Central Westgate — sensor detection deployed
4. Dohome — energy forecast live, air-side saving 5-14%

## Agent Communication
Pub/Sub via VOLTTRON/MQTT. Each agent subscribes to input topics, publishes to output topics.

## Common Tasks
### Add new fault rule
Edit agents/rule_fdd/rules/<equipment>.yaml

### Train ML model
Run scripts/train_models.py --model <name> --site <site_id>

### Deploy to edge
Run scripts/deploy_edge.py --site <site_id> --model <model_name>

### Calibrate new site
Run scripts/calibrate_site.py --site <site_id> (30-90 day baseline)

## Testing
pytest tests/ (unit + integration)
```

---

## 20. Verification

After implementing, verify:
1. **Data Quality Agent** — feed synthetic anomalous data, confirm detection
2. **Rule FDD** — run ASHRAE RP-1043 test dataset, verify 97%+ accuracy
3. **ML FDD** — validate against held-out test set, confirm false positive <10%
4. **LLM diagnosis** — feed sample faults, verify plain-language explanations are grounded
5. **Alert system** — trigger fault, verify LINE notification received
6. **Dashboard** — navigate fault list, drill into equipment, verify data accuracy
7. **Edge deployment** — verify ONNX inference on Jetson device, confirm <100ms latency
8. **Multi-property** — verify cross-site aggregation, portfolio health view

---

## Appendix A: ASHRAE Fault Types Reference

### Chiller Faults (RP-1043)
1. Reduced condenser water flow
2. Reduced evaporator water flow
3. Refrigerant overcharge
4. Refrigerant undercharge (leak)
5. Non-condensable gas in refrigerant
6. Condenser fouling (external)
7. Evaporator fouling
8. Excess oil in refrigerant

### AHU Faults (Guideline 36)
1. Stuck outdoor air damper
2. Leaking heating coil valve
3. Leaking cooling coil valve
4. Stuck heating coil valve
5. Stuck cooling coil valve
6. Supply air temperature sensor bias
7. Mixed air temperature sensor bias
8. Outdoor air temperature sensor bias
9. Return air temperature sensor bias
10. Economizer controller fault

## Appendix B: CPN Property Types

Central Pattana operates 42 properties including:
- Shopping malls (Central Plaza, Central World, CentralFestival)
- Mixed-use developments
- Office towers
- Hotels (Centara)
- Residential (co-development)

**Data available:** 6 years (2019-2025), uploaded to Multi-Property Platform
**BMS landscape:** Mixed (multiple BMS vendors across properties)
**Key contact:** CPN design workshops completed (4 workshops, 11/11 UX pages finalized)

## Appendix C: Current Data Infrastructure

**Edge:** Alto EDGE devices with VOLTTRON, TimescaleDB
**Cloud:** TimescaleDB Cloud (available via MCP: `alto-timescaledb-mcp`)
**Ontology:** Brick Schema + Haystack tagging (drag-drop in Alto CERO UI)
**Data pipeline:** Dagster (production stable), Azure/AWS connectors
**Protocol:** BACnet (via bacpypes), Modbus, LoRaWAN, MQTT

## Appendix D: Related AltoTech Products

| Product | Relationship to AFDD |
|---------|---------------------|
| Alto CERO (Water-side/CPMS) | Live chiller optimization at CPN. AFDD extends this with fault detection |
| Alto CERO (Air-side) | AHU optimization at Dohome. AFDD adds AHU fault detection |
| AWI (Air+Water Integration) | Future: AFDD enables cross-system fault correlation |
| Multi-Property Platform | AFDD dashboard lives here. CPN 42-property portfolio view |
| AltoACE | LLM orchestrator. Powers AFDD Stage 3-4 (Recommend + Act) |
| Digital Twin | Future: Self-Learning Agent calibrates EnergyPlus twin |
| IoT/Platform | Data pipeline, sensor management. Foundation for AFDD data ingestion |
| CMMS | Work order generation from AFDD recommendations |
