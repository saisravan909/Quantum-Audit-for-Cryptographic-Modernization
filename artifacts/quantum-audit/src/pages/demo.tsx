import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { ChevronRight, ChevronLeft, Play, RotateCcw, Zap, Shield, AlertTriangle, CheckCircle, Clock, Activity, Compass, Monitor, ClipboardList, TrendingUp, Bell, Radio, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const GUIDED_STEPS = [
  {
    id: 1,
    module: "Command Center",
    path: "/",
    title: "Start with the Big Picture",
    description: "The Command Center gives your security team an instant operational snapshot. HNDL Exposure Score, active alerts, compliance velocity, and cryptographic posture, all live and in one place. A federal CISO can answer 'are we quantum-ready?' in under 30 seconds.",
    operator: "Security Operations Lead",
    action: "Reviews daily cryptographic risk posture before morning stand-up",
    callout: "The HNDL Exposure Score aggregates your RSA and ECC exposure into a single mission-critical number. Lower is better. Zero means fully PQC-migrated.",
    icon: Target,
  },
  {
    id: 2,
    module: "Node Inventory",
    path: "/nodes",
    title: "Know Every Asset",
    description: "Every system running cryptography is a potential HNDL target. The Node Inventory maps your entire estate: each node's algorithm suite, certificate expiry, TLS version, and compliance status. You cannot migrate what you have not mapped.",
    operator: "Cryptographic Asset Manager",
    action: "Identifies nodes still running RSA-2048 for prioritized remediation",
    callout: "Filter by algorithm type to instantly surface all RSA and ECDH nodes. Each node shows its exact cipher suite, so engineers know exactly what to replace.",
    icon: Monitor,
  },
  {
    id: 3,
    module: "CBOM Explorer",
    path: "/cbom",
    title: "Generate Your Cryptographic BOM",
    description: "The Cryptographic Bill of Materials (CBOM) is required by NIST SP 800-235 and increasingly expected in ATO packages. QVault auto-generates it from live telemetry, with no manual spreadsheets or gaps.",
    operator: "Compliance Officer",
    action: "Pulls CBOM to attach to quarterly ATO evidence package",
    callout: "Every cryptographic dependency: algorithm, key length, usage context, and owning node, is catalogued. This is your ground truth for migration planning.",
    icon: ClipboardList,
  },
  {
    id: 4,
    module: "Compliance Velocity",
    path: "/compliance",
    title: "Track Migration Progress",
    description: "CNSA 2.0 sets a 2030 deadline. NSM-10 requires annual reporting. Compliance Velocity translates your cryptographic posture into framework-specific progress scores and migration timelines that leadership and auditors can understand.",
    operator: "Program Manager",
    action: "Pulls compliance velocity report for DepSecDef quarterly review",
    callout: "Each framework has its own progress bar and deadline countdown. Red means at risk. Green means on track. The velocity trend shows whether you are accelerating or slipping.",
    icon: TrendingUp,
  },
  {
    id: 5,
    module: "Zero Trust Alerts",
    path: "/alerts",
    title: "Catch Violations in Real Time",
    description: "Zero Trust means never trusting, always verifying, alerting immediately when a policy is violated. The Alerts Center streams cryptographic policy violations as they happen, with severity classification and affected node attribution.",
    operator: "Security Analyst",
    action: "Investigates a critical alert: RSA-2048 key exchange detected on classified segment",
    callout: "Critical alerts fire when deprecated algorithms are negotiated on monitored segments. Each alert includes the node, timestamp, algorithm detected, and recommended remediation step.",
    icon: Bell,
  },
  {
    id: 6,
    module: "Telemetry Feed",
    path: "/telemetry",
    title: "Protocol-Level Visibility",
    description: "eBPF-level telemetry captures every cryptographic event: TLS handshakes, cipher suite negotiations, key exchange outcomes, and algorithm transitions. This is the raw intelligence layer that powers every other module.",
    operator: "Cryptographic Engineer",
    action: "Validates that ML-KEM-768 is being negotiated on all new TLS connections",
    callout: "The telemetry stream shows the exact algorithm negotiated per connection. When you deploy a PQC update, you can confirm adoption here within seconds.",
    icon: Radio,
  },
];

const SCENARIO_STEPS = [
  {
    id: 1,
    time: "06:47 UTC",
    phase: "Detection",
    color: "#ff4400",
    title: "HNDL Alert Triggered at Cascade Valley Power",
    org: "Cascade Valley Regional Power Authority",
    description: "QVault's telemetry collector detects a sustained pattern of encrypted traffic being mirrored to an external IP range associated with a known nation-state collection infrastructure. The traffic is encrypted with RSA-2048, a HNDL-vulnerable cipher. An automated critical alert fires.",
    module: "Zero Trust Alerts",
    path: "/alerts",
    finding: "17 RSA-2048 encrypted sessions captured and mirrored in the last 4 hours. Destination: 185.220.x.x (known SIGINT collection range). Sessions include SCADA control plane communications.",
    action: "Alert escalated to on-call security lead. Incident declared.",
    icon: Bell,
    severity: "CRITICAL",
  },
  {
    id: 2,
    time: "07:02 UTC",
    phase: "Scoping",
    color: "#ff6600",
    title: "CBOM Pulled: Scope of Exposure Mapped",
    org: "Cascade Valley Regional Power Authority",
    description: "The incident team opens the CBOM Explorer to understand exactly which systems are running RSA-2048 and what data those sessions carry. The CBOM instantly shows 4 SCADA nodes, 2 historian servers, and 1 EMS gateway as the affected assets.",
    module: "CBOM Explorer",
    path: "/cbom",
    finding: "7 systems identified. All running RSA-2048 key encapsulation. Zero ML-KEM deployment. Estimated data exposure window: 14 months of archived traffic.",
    action: "Affected systems isolated from external routing. CISA notified per sector coordination agreement.",
    icon: ClipboardList,
    severity: "HIGH",
  },
  {
    id: 3,
    time: "07:31 UTC",
    phase: "Assessment",
    color: "#ffaa00",
    title: "Compliance Velocity Gap Quantified",
    org: "Cascade Valley Regional Power Authority",
    description: "The compliance team pulls the Compliance Velocity report to understand how far behind CNSA 2.0 migration the organization actually is. The report shows 23% PQC adoption across monitored endpoints, well below the 60% milestone that should have been reached by Q4 2025.",
    module: "Compliance Velocity",
    path: "/compliance",
    finding: "CNSA 2.0 compliance at 23%. 31 endpoints still running RSA or ECC exclusively. ML-KEM-768 deployed on 8 endpoints. Migration velocity insufficient to meet 2028 NSS deadline.",
    action: "Emergency migration plan drafted. Board briefing scheduled for 09:00.",
    icon: TrendingUp,
    severity: "HIGH",
  },
  {
    id: 4,
    time: "08:15 UTC",
    phase: "Remediation",
    color: "#88cc00",
    title: "Targeted Remediation Begins",
    org: "Cascade Valley Regional Power Authority",
    description: "Using the Node Inventory, the engineering team prioritizes the 7 critical SCADA nodes for immediate ML-KEM-768 deployment. QVault's per-node detail view shows exactly which cipher suites are configured, which certificates are in use, and what the upgrade path looks like.",
    module: "Node Inventory",
    path: "/nodes",
    finding: "4 SCADA nodes updated to ML-KEM-768 within 2 hours using pre-staged PQC libraries. 3 historian servers queued for maintenance window. TLS 1.3 enforced on all updated nodes.",
    action: "Telemetry confirms ML-KEM-768 negotiation on all updated nodes. Alerts cleared.",
    icon: Monitor,
    severity: "MEDIUM",
  },
  {
    id: 5,
    time: "14:30 UTC",
    phase: "Verification",
    color: "#00cc88",
    title: "Telemetry Confirms Clean State",
    org: "Cascade Valley Regional Power Authority",
    description: "The Telemetry Feed is monitored for 6 hours post-remediation. Zero RSA-2048 key exchange events detected on the 4 updated SCADA nodes. ML-KEM-768 hybrid sessions confirmed. The remaining 3 historian servers are flagged for next maintenance window.",
    module: "Telemetry Feed",
    path: "/telemetry",
    finding: "4 SCADA nodes: 100% ML-KEM-768 negotiation. 0 RSA events in 6-hour window. 3 historian servers: pending maintenance window. Estimated full remediation: 72 hours.",
    action: "Incident downgraded. CISA notified of partial remediation. Evidence package generated for sector ISAC.",
    icon: Radio,
    severity: "LOW",
  },
  {
    id: 6,
    time: "T+72 hours",
    phase: "Closure",
    color: "#00aaff",
    title: "Full Migration Complete: Posture Restored",
    org: "Cascade Valley Regional Power Authority",
    description: "All 7 systems migrated to ML-KEM-768. CNSA 2.0 compliance for affected segment rises from 23% to 61%. The Command Center HNDL Exposure Score drops from 74 (critical) to 18 (low). Full incident report filed with CISA and sector ISAC. Lessons learned incorporated into migration roadmap.",
    module: "Command Center",
    path: "/",
    finding: "HNDL Exposure Score: 18 (was 74). PQC adoption on critical segment: 100%. CNSA 2.0 overall velocity: 61%. Zero deprecated algorithm events in 72-hour clean window.",
    action: "Incident closed. Playbook updated. Board received final briefing. Migration acceleration plan approved.",
    icon: CheckCircle,
    severity: "RESOLVED",
  },
];

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: "text-red-400 bg-red-500/10 border-red-500/40",
  HIGH: "text-orange-400 bg-orange-500/10 border-orange-500/40",
  MEDIUM: "text-yellow-400 bg-yellow-500/10 border-yellow-500/40",
  LOW: "text-green-400 bg-green-500/10 border-green-500/40",
  RESOLVED: "text-blue-400 bg-blue-500/10 border-blue-500/40",
};

export default function DemoPage() {
  const [mode, setMode] = useState<"choose" | "guided" | "scenario">("choose");
  const [step, setStep] = useState(0);
  const [, setLocation] = useLocation();
  const [autoPlay, setAutoPlay] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const guidedSteps = GUIDED_STEPS;
  const scenarioSteps = SCENARIO_STEPS;
  const steps = mode === "guided" ? guidedSteps : scenarioSteps;
  const current = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  useEffect(() => {
    if (autoPlay && mode !== "choose") {
      timerRef.current = setInterval(() => {
        setStep(s => {
          if (s >= steps.length - 1) { setAutoPlay(false); return s; }
          return s + 1;
        });
      }, 6000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [autoPlay, mode, steps.length]);

  function reset() { setMode("choose"); setStep(0); setAutoPlay(false); }

  if (mode === "choose") {
    return (
      <div className="min-h-full bg-background flex flex-col items-center justify-center p-8">
        <div className="text-center mb-12 max-w-2xl">
          <div className="font-mono text-xs text-orange-500 uppercase tracking-widest mb-3">Interactive Demo</div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Choose Your Experience</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Explore QVault two ways: a guided module tour that shows what each operator does, or a live
            threat scenario that walks through a real incident from detection to remediation.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          <button
            onClick={() => { setMode("guided"); setStep(0); }}
            className="group text-left rounded-lg border border-orange-500/30 bg-card p-7 hover:border-orange-500/70 hover:bg-orange-500/5 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4">
              <Compass className="w-6 h-6 text-orange-400" />
            </div>
            <div className="font-mono text-orange-400 text-xs uppercase tracking-widest mb-2">Option 1</div>
            <h2 className="text-xl font-bold text-foreground mb-3">Interactive Guided Tour</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Step through each QVault module with annotated callouts showing exactly what a real operator does and why.
              6 modules, 6 operator roles, one complete picture.
            </p>
            <div className="flex items-center gap-2 text-orange-400 text-sm font-mono">
              <ChevronRight className="w-4 h-4" />
              <span>Start Tour</span>
            </div>
          </button>
          <button
            onClick={() => { setMode("scenario"); setStep(0); }}
            className="group text-left rounded-lg border border-red-500/30 bg-card p-7 hover:border-red-500/60 hover:bg-red-500/5 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-red-400" />
            </div>
            <div className="font-mono text-red-400 text-xs uppercase tracking-widest mb-2">Option 2</div>
            <h2 className="text-xl font-bold text-foreground mb-3">Scenario Simulator</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Follow Cascade Valley Power Authority through a live HNDL quantum threat event, from initial detection
              at 06:47 UTC to full remediation 72 hours later. Real modules, real data.
            </p>
            <div className="flex items-center gap-2 text-red-400 text-sm font-mono">
              <Zap className="w-4 h-4" />
              <span>Run Scenario</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background p-6 max-w-5xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button onClick={reset} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-xs mono uppercase tracking-wider transition-colors">
            <RotateCcw className="w-3.5 h-3.5" />
            Back
          </button>
          <div className="w-px h-4 bg-border" />
          <span className="font-mono text-xs text-orange-500 uppercase tracking-widest">
            {mode === "guided" ? "Guided Tour" : "Scenario: Cascade Valley Power"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="mono text-xs text-muted-foreground">{step + 1} / {steps.length}</span>
          <button
            onClick={() => setAutoPlay(a => !a)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs mono uppercase tracking-wider transition-colors ${
              autoPlay ? "border-orange-500 text-orange-400 bg-orange-500/10" : "border-border text-muted-foreground hover:border-orange-500/40"
            }`}
          >
            <Play className="w-3 h-3" />
            {autoPlay ? "Auto-playing" : "Auto-play"}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-secondary rounded-full mb-8 overflow-hidden">
        <div className="h-full rounded-full bg-orange-500 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Step indicators */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setStep(i)}
            className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs mono uppercase tracking-wider transition-all ${
              i === step
                ? "border-orange-500 text-orange-400 bg-orange-500/10"
                : i < step
                ? "border-green-500/40 text-green-400/60 bg-green-500/5"
                : "border-border text-muted-foreground/50"
            }`}
          >
            {i < step ? <CheckCircle className="w-3 h-3" /> : <span>{i + 1}</span>}
            <span className="hidden sm:inline">
              {mode === "guided" ? (s as typeof GUIDED_STEPS[0]).module : (s as typeof SCENARIO_STEPS[0]).phase}
            </span>
          </button>
        ))}
      </div>

      {/* Main content */}
      {mode === "guided" ? (
        <GuidedStepCard step={current as typeof GUIDED_STEPS[0]} onNavigate={setLocation} />
      ) : (
        <ScenarioStepCard step={current as typeof SCENARIO_STEPS[0]} onNavigate={setLocation} />
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded border border-border text-muted-foreground text-sm mono uppercase tracking-wider hover:border-orange-500/40 hover:text-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        {step < steps.length - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded border border-orange-500 bg-orange-500/10 text-orange-300 text-sm mono uppercase tracking-wider hover:bg-orange-500/20 transition-all"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={reset}
            className="flex items-center gap-2 px-5 py-2.5 rounded border border-green-500 bg-green-500/10 text-green-300 text-sm mono uppercase tracking-wider hover:bg-green-500/20 transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            Complete
          </button>
        )}
      </div>
    </div>
  );
}

function GuidedStepCard({ step, onNavigate }: { step: typeof GUIDED_STEPS[0]; onNavigate: (p: string) => void }) {
  return (
    <div className="rounded-lg border border-orange-500/25 bg-card overflow-hidden">
      <div className="bg-orange-500/8 border-b border-orange-500/20 p-6 flex items-start gap-5">
        <div className="shrink-0 w-12 h-12 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center">
          <step.icon className="w-6 h-6 text-orange-400" />
        </div>
        <div className="flex-1">
          <div className="font-mono text-xs text-orange-500 uppercase tracking-widest mb-1">{step.module}</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{step.title}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="rounded border border-border bg-secondary/20 p-4">
            <div className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Activity className="w-3 h-3" /> Operator Role
            </div>
            <div className="text-orange-300 text-sm font-medium mb-1">{step.operator}</div>
            <div className="text-muted-foreground text-xs leading-relaxed">{step.action}</div>
          </div>
          <div className="rounded border border-blue-500/20 bg-blue-500/5 p-4">
            <div className="font-mono text-[9px] text-blue-400/60 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-blue-400" /> Key Insight
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{step.callout}</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded border border-border bg-secondary/10 p-5 flex-1 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <step.icon className="w-5 h-5 text-orange-400" />
            </div>
            <div className="font-mono text-xs text-muted-foreground uppercase tracking-widest">{step.module}</div>
            <p className="text-muted-foreground text-xs">Click below to explore this module live in QVault</p>
          </div>
          <button
            onClick={() => onNavigate(step.path)}
            className="group flex items-center justify-center gap-2 px-5 py-3 rounded border border-orange-500 bg-orange-500/10 text-orange-300 text-sm mono uppercase tracking-wider hover:bg-orange-500/20 transition-all relative overflow-hidden"
          >
            <span className="relative z-10">Open {step.module}</span>
            <ChevronRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ScenarioStepCard({ step, onNavigate }: { step: typeof SCENARIO_STEPS[0]; onNavigate: (p: string) => void }) {
  const sevColor = SEVERITY_COLORS[step.severity] || SEVERITY_COLORS.LOW;
  return (
    <div className="rounded-lg border bg-card overflow-hidden" style={{ borderColor: step.color + "44" }}>
      <div className="p-6 border-b" style={{ borderColor: step.color + "33", background: step.color + "0a" }}>
        <div className="flex items-start gap-4 flex-wrap">
          <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: step.color + "15", border: `1px solid ${step.color}30` }}>
            <step.icon className="w-5 h-5" style={{ color: step.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="font-mono text-xs uppercase tracking-widest px-2 py-0.5 rounded border" style={{ color: step.color, borderColor: step.color + "55", background: step.color + "22" }}>
                {step.phase}
              </span>
              <span className="font-mono text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> {step.time}
              </span>
              <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border ${sevColor}`}>
                {step.severity}
              </span>
            </div>
            <h2 className="text-xl font-bold text-foreground mb-1">{step.title}</h2>
            <div className="font-mono text-xs text-muted-foreground">{step.org}</div>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-5">
        <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded border border-border bg-secondary/20 p-4">
            <div className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3" /> Finding
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{step.finding}</p>
          </div>
          <div className="rounded border border-border bg-secondary/20 p-4">
            <div className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3" /> Action Taken
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{step.action}</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate(step.path)}
          className="group flex items-center gap-2 px-5 py-2.5 rounded border text-sm mono uppercase tracking-wider hover:opacity-90 transition-all relative overflow-hidden"
          style={{ borderColor: step.color + "66", color: step.color, background: step.color + "15" }}
        >
          <span className="relative z-10">See {step.module} in QVault</span>
          <ChevronRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
