import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Server, Shield, FileCheck, Upload, ChevronRight, ChevronLeft,
  CheckCircle, AlertTriangle, Download, Copy, ArrowRight, Layers, Clock,
  Target, TrendingUp, Lock, Zap, FileText, BarChart3, X
} from "lucide-react";
import { format } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  orgName: string;
  industry: string;
  orgSize: string;
  urgency: string;
  primaryCompliance: string[];
  serverCount: string;
  operatingSystems: string[];
  webServers: string[];
  databases: string[];
  cloudProviders: string[];
  tlsVersion: string;
  certificateAuthority: string;
  keyManagement: string;
  pqcAdoption: string;
  hasInventory: string;
  primaryChallenge: string[];
  complianceFrameworks: string[];
  assessmentHistory: string;
  deadline: string;
}

const EMPTY_FORM: FormData = {
  orgName: "", industry: "", orgSize: "", urgency: "", primaryCompliance: [],
  serverCount: "", operatingSystems: [], webServers: [], databases: [],
  cloudProviders: [], tlsVersion: "", certificateAuthority: "", keyManagement: "",
  pqcAdoption: "", hasInventory: "", primaryChallenge: [], complianceFrameworks: [],
  assessmentHistory: "", deadline: "",
};

// ─── Scoring ──────────────────────────────────────────────────────────────────

function computeScore(f: FormData) {
  let score = 40;
  if (f.tlsVersion === "tls13") score += 12;
  else if (f.tlsVersion === "tls12") score += 5;
  else if (f.tlsVersion === "tls10") score -= 15;
  if (f.pqcAdoption === "prod") score += 28;
  else if (f.pqcAdoption === "testing") score += 14;
  else if (f.pqcAdoption === "no") score -= 8;
  if (f.hasInventory === "yes") score += 10;
  if (f.keyManagement === "hsm") score += 8;
  else if (f.keyManagement === "unknown") score -= 8;
  if (f.complianceFrameworks.length >= 2) score += 6;
  if (f.assessmentHistory === "yes") score += 6;
  if (f.urgency === "past") score -= 5;
  const riskySystems = [...f.webServers, ...f.databases].length;
  score -= Math.min(riskySystems * 1.5, 12);
  return Math.max(5, Math.min(95, Math.round(score)));
}

function getRiskLevel(score: number) {
  if (score >= 70) return { label: "Low Risk", color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" };
  if (score >= 50) return { label: "Moderate Risk", color: "#b45309", bg: "#fffbeb", border: "#fde68a" };
  if (score >= 30) return { label: "High Risk", color: "#c2410c", bg: "#fff7ed", border: "#fed7aa" };
  return { label: "Critical Risk", color: "#b91c1c", bg: "#fef2f2", border: "#fecaca" };
}

function buildReport(f: FormData, score: number): string {
  const risk = getRiskLevel(score);
  const date = format(new Date(), "MMMM d, yyyy");
  return `# Quantum Readiness Assessment Report
## ${f.orgName || "Your Organization"}
**Date:** ${date}  
**Readiness Score:** ${score}/100: ${risk.label}

---

## Executive Summary

${f.orgName || "Your organization"} has completed a Quantum Readiness Assessment against CNSA 2.0 and NIST post-quantum standards. Based on responses across organization profile, technology infrastructure, and current cryptographic posture, a readiness score of **${score}/100** was calculated.

${score < 40 ? "Immediate action is recommended. Critical gaps in post-quantum cryptography adoption leave your organization exposed to Harvest Now, Decrypt Later (HNDL) attacks." : score < 65 ? "Moderate gaps exist. A structured migration program is strongly recommended to meet CNSA 2.0 and NSM-10 deadlines." : "Your organization shows meaningful progress toward quantum readiness. Continued migration and monitoring is recommended to maintain compliance."}

---

## Organization Profile

| Field | Value |
|-------|-------|
| Industry | ${f.industry} |
| Organization Size | ${f.orgSize} |
| Timeline Urgency | ${f.urgency} |
| TLS Version in Use | ${f.tlsVersion} |
| Key Management | ${f.keyManagement} |
| PQC Adoption Status | ${f.pqcAdoption} |
| Existing Crypto Inventory | ${f.hasInventory} |

---

## Risk Findings

### Finding 1: Algorithm Exposure
${f.tlsVersion === "tls10" ? "TLS 1.0/1.1 in use, immediately deprecated by NSA and CISA. All sessions are vulnerable to classical and quantum attacks." : f.tlsVersion === "tls12" ? "TLS 1.2 in use, supported under CNSA 2.0 transitionally, but key exchange algorithms (ECDH, RSA) are quantum-vulnerable." : "TLS 1.3 detected, strong classical baseline. Requires ML-KEM-768 hybrid key exchange layer to achieve CNSA 2.0 compliance."}

### Finding 2: PQC Adoption Gap
${f.pqcAdoption === "prod" ? "ML-KEM or equivalent in production. Excellent posture. Ensure CBOM reflects all deployed PQC endpoints and maintain monitoring." : f.pqcAdoption === "testing" ? "PQC in testing/staging. Accelerate production rollout. CNSA 2.0 milestones require production deployment." : "No PQC algorithms deployed. Every encrypted session is a potential HNDL target. Migration planning should begin immediately."}

### Finding 3: Asset Visibility
${f.hasInventory === "yes" ? "Crypto inventory exists. Integrate with QVault for continuous automated tracking. Manual inventories drift within weeks." : "No cryptographic inventory. Blind spots are the highest-risk posture. Deploy QVault telemetry to establish ground truth before planning migration."}

### Finding 4: Key Management Posture
${f.keyManagement === "hsm" ? "Hardware Security Module in use, strong key protection baseline. Verify HSM firmware supports PQC key types." : f.keyManagement === "unknown" ? "Key management posture unknown. This is a critical gap. Discovery sprint required before migration can begin." : "Software key management in place. Consider HSM adoption as part of CNSA 2.0 migration, particularly for NSS workloads."}

---

## 90-Day Migration Roadmap

### Phase 1: Weeks 1-4: Inventory and Baseline
- Deploy QVault telemetry collectors on all priority nodes
- Generate live CBOM from eBPF telemetry (no manual inventory required)
- Classify all nodes by algorithm type and HNDL exposure score
- Identify top 10 highest-risk systems for immediate attention
- Establish compliance baseline against selected frameworks

### Phase 2: Weeks 5-8: Priority Migration
- Deploy ML-KEM-768 hybrid TLS on top 10 critical nodes
- Update certificate authority to support ML-DSA-65 signatures
- Configure OpenSSL 3.x on all RHEL/Ubuntu endpoints
- Implement Zero Trust alerting for classical-only fallback events
- Validate CNSA 2.0 compliance on migrated nodes via telemetry

### Phase 3: Weeks 9-12: Scale and Sustain
- Roll out PQC migration to remaining node inventory
- Generate audit-ready CBOM for ATO evidence package
- Implement ISM policies for ongoing compliance monitoring
- Conduct tabletop exercise using HNDL threat scenario
- Brief leadership on compliance velocity and next-milestone targets

---

## Compliance Frameworks

${f.complianceFrameworks.map(fw => `- **${fw}**: gap analysis available in QVault Compliance Velocity module`).join("\n") || "- No frameworks selected. Recommend aligning to CNSA 2.0 minimum"}

---

## Recommended Next Steps

1. Deploy QVault telemetry collectors (Fluent Bit + eBPF probes). See Config Builder
2. Run live CBOM generation to replace manual inventory
3. Schedule stakeholder briefing with Readiness Score and Risk Map findings
4. Engage key vendor (OpenSSL, PKI provider) for PQC roadmap alignment
5. Submit CNSA 2.0 migration plan to ISSO/AO within 30 days

---

*Generated by QVault: PQC Command Center*  
*https://github.com/saisravan909/Quantum-Audit-for-Cryptographic-Modernization*
`;
}

// ─── Option helpers ───────────────────────────────────────────────────────────

const MULTI = (opts: { id: string; label: string }[], value: string[], onChange: (v: string[]) => void) => (
  <div className="flex flex-wrap gap-2 mt-2">
    {opts.map(o => {
      const active = value.includes(o.id);
      return (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(active ? value.filter(x => x !== o.id) : [...value, o.id])}
          className="px-4 py-2 rounded-full border text-sm transition-all select-none"
          style={active
            ? { borderColor: "#1e3a5f", background: "#1e3a5f", color: "#fff" }
            : { borderColor: "#d1d5db", background: "#fff", color: "#374151" }
          }
        >
          {active && <span className="mr-1.5 text-xs">✓</span>}
          {o.label}
        </button>
      );
    })}
  </div>
);

const SELECT = (opts: { id: string; label: string }[], value: string, onChange: (v: string) => void) => (
  <div className="flex flex-col gap-2 mt-2">
    {opts.map(o => {
      const active = value === o.id;
      return (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-all"
          style={active
            ? { borderColor: "#1e3a5f", background: "#f0f4ff", color: "#1e3a5f" }
            : { borderColor: "#e5e7eb", background: "#fff", color: "#374151" }
          }
        >
          <div className="w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center" style={{ borderColor: active ? "#1e3a5f" : "#d1d5db" }}>
            {active && <div className="w-2 h-2 rounded-full" style={{ background: "#1e3a5f" }} />}
          </div>
          {o.label}
        </button>
      );
    })}
  </div>
);

// ─── Steps config ─────────────────────────────────────────────────────────────

const STEPS = [
  { id: "org", label: "Organization", icon: Building2 },
  { id: "infra", label: "Infrastructure", icon: Server },
  { id: "crypto", label: "Crypto Posture", icon: Shield },
  { id: "compliance", label: "Compliance", icon: FileCheck },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Assessment() {
  const [phase, setPhase] = useState<"welcome" | "form" | "processing" | "results">("welcome");
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [processingStep, setProcessingStep] = useState(0);
  const [score, setScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [copied, setCopied] = useState(false);
  const scoreRef = useRef(0);

  const set = (key: keyof FormData) => (val: any) => setForm(f => ({ ...f, [key]: val }));

  // Processing animation
  useEffect(() => {
    if (phase !== "processing") return;
    const steps = [
      "Analyzing organization profile...",
      "Mapping infrastructure risk surface...",
      "Evaluating cryptographic posture...",
      "Cross-referencing compliance frameworks...",
      "Computing quantum readiness score...",
      "Generating migration roadmap...",
    ];
    let i = 0;
    const id = setInterval(() => {
      i++;
      setProcessingStep(i);
      if (i >= steps.length) {
        clearInterval(id);
        const s = computeScore(form);
        scoreRef.current = s;
        setScore(s);
        setTimeout(() => setPhase("results"), 500);
      }
    }, 600);
    return () => clearInterval(id);
  }, [phase, form]);

  // Animated score counter
  useEffect(() => {
    if (phase !== "results") return;
    let current = 0;
    const target = score;
    const id = setInterval(() => {
      current = Math.min(current + 2, target);
      setDisplayScore(current);
      if (current >= target) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [phase, score]);

  const risk = getRiskLevel(score);
  const report = buildReport(form, score);

  const handleDownload = useCallback(() => {
    const blob = new Blob([report], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qvault-assessment-${format(new Date(), "yyyy-MM-dd")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [report]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [report]);

  return (
    <div className="min-h-full" style={{ background: "#f7f8fc", color: "#111827" }}>
      <AnimatePresence mode="wait">
        {phase === "welcome" && <WelcomeScreen key="welcome" onStart={() => setPhase("form")} />}
        {phase === "form" && (
          <FormScreen
            key="form"
            step={step}
            form={form}
            set={set}
            onNext={() => {
              if (step < STEPS.length - 1) setStep(s => s + 1);
              else { setPhase("processing"); setProcessingStep(0); }
            }}
            onBack={() => step > 0 ? setStep(s => s - 1) : setPhase("welcome")}
          />
        )}
        {phase === "processing" && <ProcessingScreen key="processing" processingStep={processingStep} />}
        {phase === "results" && (
          <ResultsScreen
            key="results"
            score={displayScore}
            finalScore={score}
            risk={risk}
            form={form}
            onDownload={handleDownload}
            onCopy={handleCopy}
            copied={copied}
            onRestart={() => { setPhase("welcome"); setStep(0); setForm(EMPTY_FORM); setDisplayScore(0); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Welcome Screen ───────────────────────────────────────────────────────────

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="min-h-full flex flex-col items-center justify-center px-4 py-16"
    >
      <div className="max-w-2xl w-full text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
          style={{ background: "#e8edf5", color: "#1e3a5f", border: "1px solid #c7d2e8" }}>
          <Shield className="w-3.5 h-3.5" /> Quantum Readiness Assessment
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ color: "#0f1c36" }}>
          Understand Your Cryptographic Risk in Under 10 Minutes
        </h1>
        <p className="text-lg mb-10 leading-relaxed" style={{ color: "#4b5563" }}>
          Answer a focused set of questions about your organization and infrastructure.
          QVault will compute your Quantum Readiness Score, identify your highest-risk assets,
          and generate a personalized 90-day migration roadmap.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { icon: BarChart3, title: "Readiness Score", desc: "A single 0–100 metric that benchmarks your PQC posture against CNSA 2.0 and NSM-10 standards." },
            { icon: Layers, title: "Risk Findings", desc: "Prioritized findings across algorithm exposure, asset visibility, and compliance gaps, with plain-English explanations." },
            { icon: Target, title: "90-Day Roadmap", desc: "A phased migration plan built for your infrastructure, compliance obligations, and timeline urgency." },
          ].map(item => (
            <div key={item.title} className="rounded-2xl p-6 text-left" style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "#e8edf5" }}>
                <item.icon className="w-5 h-5" style={{ color: "#1e3a5f" }} />
              </div>
              <div className="font-semibold text-sm mb-1" style={{ color: "#0f1c36" }}>{item.title}</div>
              <div className="text-xs leading-relaxed" style={{ color: "#6b7280" }}>{item.desc}</div>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: "#1e3a5f", color: "#fff" }}
        >
          Begin Assessment <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-xs mt-4" style={{ color: "#9ca3af" }}>No account required · Approximately 8 minutes · Results are not stored</p>
      </div>
    </motion.div>
  );
}

// ─── Form Screen ──────────────────────────────────────────────────────────────

function FormScreen({ step, form, set, onNext, onBack }: {
  step: number; form: FormData;
  set: (k: keyof FormData) => (v: any) => void;
  onNext: () => void; onBack: () => void;
}) {
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="min-h-full px-4 py-8 md:py-12"
    >
      <div className="max-w-2xl mx-auto">
        {/* Progress header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {STEPS.map((s, i) => (
                <div key={s.id} className="flex items-center gap-1.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                    style={i === step
                      ? { background: "#1e3a5f", color: "#fff" }
                      : i < step
                      ? { background: "#d1fae5", color: "#15803d", border: "1px solid #6ee7b7" }
                      : { background: "#f3f4f6", color: "#9ca3af", border: "1px solid #e5e7eb" }
                    }
                  >
                    {i < step ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="w-6 h-px" style={{ background: i < step ? "#6ee7b7" : "#e5e7eb" }} />
                  )}
                </div>
              ))}
            </div>
            <span className="text-xs font-medium" style={{ color: "#6b7280" }}>
              Step {step + 1} of {STEPS.length}
            </span>
          </div>
          <div className="h-1 rounded-full" style={{ background: "#e5e7eb" }}>
            <motion.div
              className="h-full rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ background: "#1e3a5f" }}
            />
          </div>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && <StepOrg form={form} set={set} />}
            {step === 1 && <StepInfra form={form} set={set} />}
            {step === 2 && <StepCrypto form={form} set={set} />}
            {step === 3 && <StepCompliance form={form} set={set} />}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-medium transition-all hover:opacity-80"
            style={{ borderColor: "#d1d5db", background: "#fff", color: "#374151" }}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: "#1e3a5f", color: "#fff" }}
          >
            {step < STEPS.length - 1 ? (
              <><span>Continue</span> <ChevronRight className="w-4 h-4" /></>
            ) : (
              <><span>Generate Report</span> <Zap className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Step 1: Organization ─────────────────────────────────────────────────────

function StepOrg({ form, set }: { form: FormData; set: (k: keyof FormData) => (v: any) => void }) {
  return (
    <div className="rounded-2xl p-6 md:p-8 space-y-6" style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#6b7280" }}>Step 1 of 4</div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: "#0f1c36" }}>Your Organization</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>
          Help us understand the context in which your infrastructure operates. This shapes the compliance requirements and urgency of your readiness score.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>Organization Name</label>
        <input
          type="text"
          placeholder="e.g. Cascade Valley Regional Authority"
          value={form.orgName}
          onChange={e => set("orgName")(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
          style={{ border: "1.5px solid #d1d5db", color: "#111827", background: "#fff" }}
          onFocus={e => e.target.style.borderColor = "#1e3a5f"}
          onBlur={e => e.target.style.borderColor = "#d1d5db"}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>Industry Sector</label>
        <p className="text-xs mb-2" style={{ color: "#9ca3af" }}>Select the sector that best describes your organization's primary mission.</p>
        {SELECT([
          { id: "federal", label: "Federal Government / Civilian Agency" },
          { id: "defense", label: "Defense / Intelligence Community / NSS" },
          { id: "critinfra", label: "Critical Infrastructure (Energy, Water, Transport)" },
          { id: "healthcare", label: "Healthcare / Life Sciences" },
          { id: "finance", label: "Financial Services / Banking" },
          { id: "other", label: "Other / Commercial Enterprise" },
        ], form.industry, set("industry"))}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>Organization Size (Endpoints / Systems)</label>
        {SELECT([
          { id: "small", label: "Under 100 systems" },
          { id: "medium", label: "100 to 1,000 systems" },
          { id: "large", label: "1,000 to 10,000 systems" },
          { id: "enterprise", label: "10,000+ systems" },
        ], form.orgSize, set("orgSize"))}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>Timeline Urgency</label>
        <p className="text-xs mb-2" style={{ color: "#9ca3af" }}>How urgent is your quantum readiness mandate?</p>
        {SELECT([
          { id: "past", label: "Past a compliance deadline: remediation in progress" },
          { id: "12mo", label: "Deadline within 12 months: active planning required" },
          { id: "3yr", label: "Deadline in 1 to 3 years: migration program underway" },
          { id: "planning", label: "Early planning stage: evaluating options" },
        ], form.urgency, set("urgency"))}
      </div>
    </div>
  );
}

// ─── Step 2: Infrastructure ───────────────────────────────────────────────────

function StepInfra({ form, set }: { form: FormData; set: (k: keyof FormData) => (v: any) => void }) {
  return (
    <div className="rounded-2xl p-6 md:p-8 space-y-6" style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#6b7280" }}>Step 2 of 4</div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: "#0f1c36" }}>Your Infrastructure</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>
          Every system that negotiates encrypted connections is a potential HNDL target. Tell us what you run so we can identify the right migration priorities.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>Estimated Server / Node Count</label>
        {SELECT([
          { id: "1-10", label: "1 to 10 nodes" },
          { id: "11-50", label: "11 to 50 nodes" },
          { id: "51-200", label: "51 to 200 nodes" },
          { id: "201-1000", label: "201 to 1,000 nodes" },
          { id: "1000+", label: "1,000+ nodes" },
        ], form.serverCount, set("serverCount"))}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>Operating Systems in Use</label>
        <p className="text-xs mb-2" style={{ color: "#9ca3af" }}>Select all that apply. OpenSSL version availability varies by OS.</p>
        {MULTI([
          { id: "rhel9", label: "RHEL 9 / Rocky / Alma 9" },
          { id: "rhel8", label: "RHEL 8 / Rocky / Alma 8" },
          { id: "ubuntu24", label: "Ubuntu 24.04 LTS" },
          { id: "ubuntu22", label: "Ubuntu 22.04 LTS" },
          { id: "debian12", label: "Debian 12" },
          { id: "windows", label: "Windows Server" },
          { id: "mixed", label: "Mixed / Unknown" },
        ], form.operatingSystems, set("operatingSystems"))}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>Web / API Servers</label>
        <p className="text-xs mb-2" style={{ color: "#9ca3af" }}>Each server type has a different TLS configuration path.</p>
        {MULTI([
          { id: "nginx", label: "NGINX" },
          { id: "apache", label: "Apache HTTPD" },
          { id: "nodejs", label: "Node.js / Express" },
          { id: "iis", label: "IIS" },
          { id: "tomcat", label: "Tomcat" },
          { id: "none", label: "None / Custom" },
        ], form.webServers, set("webServers"))}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>Databases</label>
        {MULTI([
          { id: "postgres", label: "PostgreSQL" },
          { id: "mysql", label: "MySQL / MariaDB" },
          { id: "oracle", label: "Oracle DB" },
          { id: "mssql", label: "SQL Server" },
          { id: "mongo", label: "MongoDB" },
          { id: "none", label: "None" },
        ], form.databases, set("databases"))}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>Cloud / Hosting Environment</label>
        {MULTI([
          { id: "aws", label: "AWS" },
          { id: "azure", label: "Azure" },
          { id: "gcp", label: "Google Cloud" },
          { id: "onprem", label: "On-Premises / Data Center" },
          { id: "hybrid", label: "Hybrid" },
          { id: "govcloud", label: "GovCloud / IL4/IL5" },
        ], form.cloudProviders, set("cloudProviders"))}
      </div>
    </div>
  );
}

// ─── Step 3: Crypto Posture ───────────────────────────────────────────────────

function StepCrypto({ form, set }: { form: FormData; set: (k: keyof FormData) => (v: any) => void }) {
  return (
    <div className="rounded-2xl p-6 md:p-8 space-y-6" style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#6b7280" }}>Step 3 of 4</div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: "#0f1c36" }}>Your Cryptographic Posture</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>
          These answers directly drive your Quantum Readiness Score. Be as accurate as possible. Honest answers produce the most useful recommendations.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>Current TLS Version in Production</label>
        <p className="text-xs mb-2" style={{ color: "#9ca3af" }}>Select the version most commonly negotiated across your environment.</p>
        {SELECT([
          { id: "tls13", label: "TLS 1.3: current standard, still quantum-vulnerable at key exchange" },
          { id: "tls12", label: "TLS 1.2: widely deployed, quantum-vulnerable" },
          { id: "tls10", label: "TLS 1.0 / 1.1: deprecated, classically and quantum-vulnerable" },
          { id: "mixed", label: "Mixed across environment: no uniform version enforced" },
          { id: "unknown", label: "Unknown: no current inventory" },
        ], form.tlsVersion, set("tlsVersion"))}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>PQC Algorithm Adoption Status</label>
        <p className="text-xs mb-2" style={{ color: "#9ca3af" }}>ML-KEM-768, ML-DSA-65, or equivalent NIST-standardized post-quantum algorithms.</p>
        {SELECT([
          { id: "prod", label: "In production: PQC algorithms actively negotiated on live systems" },
          { id: "testing", label: "In testing / staging: deployed but not yet production" },
          { id: "planned", label: "Planned: on the roadmap but not yet deployed" },
          { id: "no", label: "Not deployed: no PQC implementation exists" },
          { id: "unknown", label: "Unknown: posture unclear" },
        ], form.pqcAdoption, set("pqcAdoption"))}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>Key Management</label>
        {SELECT([
          { id: "hsm", label: "Hardware Security Module (HSM): e.g. Thales, AWS CloudHSM, Entrust" },
          { id: "kms", label: "Cloud KMS: AWS KMS, Azure Key Vault, GCP Cloud KMS" },
          { id: "software", label: "Software-based key storage: application-level or file-based" },
          { id: "manual", label: "Manual key management: no centralized system" },
          { id: "unknown", label: "Unknown: not assessed" },
        ], form.keyManagement, set("keyManagement"))}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>Do you have an existing cryptographic asset inventory?</label>
        {SELECT([
          { id: "yes", label: "Yes: we maintain a documented inventory of all cryptographic assets" },
          { id: "partial", label: "Partial: some systems documented, others not" },
          { id: "no", label: "No: no formal cryptographic inventory exists" },
        ], form.hasInventory, set("hasInventory"))}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>Primary Migration Challenges</label>
        <p className="text-xs mb-2" style={{ color: "#9ca3af" }}>Select all that apply. This helps tailor roadmap recommendations.</p>
        {MULTI([
          { id: "inventory", label: "No asset inventory" },
          { id: "vendors", label: "Vendor / third-party dependencies" },
          { id: "legacy", label: "Legacy systems cannot be updated" },
          { id: "budget", label: "Budget constraints" },
          { id: "expertise", label: "Lack of in-house expertise" },
          { id: "timeline", label: "Compressed timeline" },
          { id: "leadership", label: "Leadership awareness / buy-in" },
        ], form.primaryChallenge, set("primaryChallenge"))}
      </div>
    </div>
  );
}

// ─── Step 4: Compliance ───────────────────────────────────────────────────────

function StepCompliance({ form, set }: { form: FormData; set: (k: keyof FormData) => (v: any) => void }) {
  return (
    <div className="rounded-2xl p-6 md:p-8 space-y-6" style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#6b7280" }}>Step 4 of 4</div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: "#0f1c36" }}>Your Compliance Obligations</h2>
        <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>
          Different mandates have different cryptographic requirements and deadlines. Selecting the right frameworks ensures your roadmap targets the right milestones.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>Applicable Compliance Frameworks</label>
        <p className="text-xs mb-2" style={{ color: "#9ca3af" }}>Select all frameworks your organization must comply with.</p>
        {MULTI([
          { id: "CNSA 2.0", label: "CNSA 2.0: NSA Commercial National Security Algorithm Suite" },
          { id: "NSM-10", label: "NSM-10: National Security Memorandum on Quantum Computing" },
          { id: "NIST 800-207", label: "NIST SP 800-207: Zero Trust Architecture" },
          { id: "NIST 800-53", label: "NIST SP 800-53 rev5: Security Controls (SC-12/13)" },
          { id: "OMB M-23-02", label: "OMB M-23-02: Federal PQC Migration Guidance" },
          { id: "EO 14028", label: "EO 14028: Improving Nation's Cybersecurity" },
          { id: "FedRAMP", label: "FedRAMP: Federal Cloud Authorization" },
          { id: "CMMC", label: "CMMC: Cybersecurity Maturity Model Certification" },
          { id: "HIPAA", label: "HIPAA: Health Insurance Portability and Accountability" },
          { id: "PCI DSS", label: "PCI DSS: Payment Card Industry Standards" },
        ], form.complianceFrameworks, set("complianceFrameworks"))}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>Previous PQC Assessment</label>
        {SELECT([
          { id: "yes", label: "Yes: we have conducted a prior quantum readiness or PQC gap assessment" },
          { id: "informal", label: "Informal only: internal review, no formal assessment methodology" },
          { id: "no", label: "No: this is our first formal quantum readiness evaluation" },
        ], form.assessmentHistory, set("assessmentHistory"))}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "#374151" }}>Hardest Compliance Deadline</label>
        <p className="text-xs mb-2" style={{ color: "#9ca3af" }}>CNSA 2.0 requires NSS systems to complete PQC migration by 2030. Select where you stand relative to your most pressing deadline.</p>
        {SELECT([
          { id: "2025", label: "2025: deadline already passed or imminent" },
          { id: "2026", label: "2026: within the next 12 months" },
          { id: "2028", label: "2028: NSS soft deadline for key encapsulation" },
          { id: "2030", label: "2030: full CNSA 2.0 migration requirement" },
          { id: "none", label: "No specific regulatory deadline currently applies" },
        ], form.deadline, set("deadline"))}
      </div>

      <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: "#fffbeb", border: "1px solid #fde68a" }}>
        <Zap className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#b45309" }} />
        <p className="text-xs leading-relaxed" style={{ color: "#92400e" }}>
          After you click <strong>Generate Report</strong>, QVault will analyze all your responses and produce a Quantum Readiness Score, risk findings, a draft CBOM outline, and a 90-day migration roadmap tailored to your profile.
        </p>
      </div>
    </div>
  );
}

// ─── Processing Screen ────────────────────────────────────────────────────────

const PROCESSING_STEPS = [
  "Analyzing organization profile...",
  "Mapping infrastructure risk surface...",
  "Evaluating cryptographic posture...",
  "Cross-referencing compliance frameworks...",
  "Computing quantum readiness score...",
  "Generating migration roadmap...",
];

function ProcessingScreen({ processingStep }: { processingStep: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-full flex items-center justify-center px-4 py-16"
    >
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "#e8edf5" }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
            <Shield className="w-8 h-8" style={{ color: "#1e3a5f" }} />
          </motion.div>
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#0f1c36" }}>Analyzing Your Responses</h2>
        <p className="text-sm mb-8" style={{ color: "#6b7280" }}>Generating your personalized quantum readiness report...</p>
        <div className="space-y-3 text-left">
          {PROCESSING_STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center"
                style={i < processingStep
                  ? { background: "#d1fae5", border: "1px solid #6ee7b7" }
                  : i === processingStep
                  ? { background: "#e8edf5", border: "1.5px solid #1e3a5f" }
                  : { background: "#f3f4f6", border: "1px solid #e5e7eb" }
                }
              >
                {i < processingStep
                  ? <CheckCircle className="w-3 h-3" style={{ color: "#15803d" }} />
                  : i === processingStep
                  ? <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-2 h-2 rounded-full" style={{ background: "#1e3a5f" }} />
                  : null
                }
              </div>
              <span className="text-sm" style={{ color: i <= processingStep ? "#111827" : "#d1d5db" }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Results Screen ───────────────────────────────────────────────────────────

function ResultsScreen({ score, finalScore, risk, form, onDownload, onCopy, copied, onRestart }: {
  score: number; finalScore: number; risk: ReturnType<typeof getRiskLevel>;
  form: FormData; onDownload: () => void; onCopy: () => void; copied: boolean; onRestart: () => void;
}) {
  const arcRadius = 80;
  const arcCirc = 2 * Math.PI * arcRadius;
  const arcOffset = arcCirc - (arcCirc * (score / 100));

  const FINDINGS = [
    {
      icon: Lock,
      title: "Algorithm Exposure",
      color: form.tlsVersion === "tls13" ? "#15803d" : form.tlsVersion === "tls12" ? "#b45309" : "#b91c1c",
      severity: form.tlsVersion === "tls13" ? "Moderate" : form.tlsVersion === "tls12" ? "High" : "Critical",
      desc: form.tlsVersion === "tls13"
        ? "TLS 1.3 in use, strong classical baseline. Key exchange layer requires ML-KEM-768 upgrade for CNSA 2.0."
        : form.tlsVersion === "tls12"
        ? "TLS 1.2 key exchange (RSA/ECDH) is quantum-vulnerable. All sessions are HNDL targets."
        : "Deprecated TLS version detected. Immediate remediation required across all endpoints.",
    },
    {
      icon: Target,
      title: "PQC Adoption",
      color: form.pqcAdoption === "prod" ? "#15803d" : form.pqcAdoption === "testing" ? "#b45309" : "#b91c1c",
      severity: form.pqcAdoption === "prod" ? "Low" : form.pqcAdoption === "testing" ? "Moderate" : "High",
      desc: form.pqcAdoption === "prod"
        ? "ML-KEM algorithms in production. Maintain monitoring and expand CBOM coverage."
        : form.pqcAdoption === "testing"
        ? "PQC in staging. Accelerate production rollout to meet CNSA 2.0 milestones."
        : "No PQC deployment detected. Every encrypted session is a potential HNDL target.",
    },
    {
      icon: Layers,
      title: "Asset Visibility",
      color: form.hasInventory === "yes" ? "#15803d" : form.hasInventory === "partial" ? "#b45309" : "#b91c1c",
      severity: form.hasInventory === "yes" ? "Low" : form.hasInventory === "partial" ? "Moderate" : "High",
      desc: form.hasInventory === "yes"
        ? "Inventory exists. Integrate with QVault for continuous automated tracking. Manual inventories drift."
        : form.hasInventory === "partial"
        ? "Partial inventory creates blind spots. Deploy telemetry to fill gaps before migration begins."
        : "No cryptographic inventory. You cannot migrate what you cannot see. Start here.",
    },
    {
      icon: Shield,
      title: "Key Management",
      color: form.keyManagement === "hsm" ? "#15803d" : form.keyManagement === "unknown" ? "#b91c1c" : "#b45309",
      severity: form.keyManagement === "hsm" ? "Low" : form.keyManagement === "unknown" ? "Critical" : "Moderate",
      desc: form.keyManagement === "hsm"
        ? "HSM in use, strong key protection. Verify PQC key type support in HSM firmware."
        : form.keyManagement === "unknown"
        ? "Key management posture unknown. A discovery sprint is required before migration can begin."
        : "Software key management. Consider HSM adoption for NSS-classified workloads under CNSA 2.0.",
    },
  ];

  const ROADMAP = [
    {
      phase: "Phase 1",
      weeks: "Weeks 1 to 4",
      title: "Inventory and Baseline",
      color: "#1e3a5f",
      tasks: [
        "Deploy QVault eBPF telemetry collectors on all priority nodes",
        "Generate live CBOM, no manual spreadsheet required",
        "Classify all nodes by algorithm type and HNDL exposure score",
        "Identify top 10 highest-risk systems for immediate remediation",
      ],
    },
    {
      phase: "Phase 2",
      weeks: "Weeks 5 – 8",
      title: "Priority Migration",
      color: "#b45309",
      tasks: [
        "Deploy ML-KEM-768 hybrid TLS on top-10 critical nodes",
        "Update certificate authority to support ML-DSA-65 signatures",
        "Configure OpenSSL 3.x on all RHEL/Ubuntu endpoints",
        "Implement Zero Trust alerting for classical-only fallback events",
      ],
    },
    {
      phase: "Phase 3",
      weeks: "Weeks 9 – 12",
      title: "Scale & Sustain",
      color: "#15803d",
      tasks: [
        "Roll out PQC migration to remaining node inventory",
        "Generate audit-ready CBOM for ATO evidence package",
        "Implement ISM policies for ongoing compliance monitoring",
        "Brief leadership on compliance velocity and next-milestone targets",
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-full px-4 py-8 md:py-12"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#6b7280" }}>Assessment Complete</div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "#0f1c36" }}>
              Quantum Readiness Report{form.orgName ? `: ${form.orgName}` : ""}
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6b7280" }}>Generated {format(new Date(), "MMMM d, yyyy")}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={onCopy} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-medium transition-all"
              style={{ borderColor: "#d1d5db", background: "#fff", color: "#374151" }}>
              {copied ? <CheckCircle className="w-3.5 h-3.5" style={{ color: "#15803d" }} /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button onClick={onDownload} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: "#1e3a5f", color: "#fff" }}>
              <Download className="w-3.5 h-3.5" /> Download Report
            </button>
          </div>
        </div>

        {/* Score card */}
        <div className="rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8"
          style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
          {/* Gauge */}
          <div className="shrink-0 relative w-48 h-48 flex items-center justify-center">
            <svg width="192" height="192" className="-rotate-90">
              <circle cx="96" cy="96" r={arcRadius} fill="none" stroke="#f3f4f6" strokeWidth="12" />
              <motion.circle
                cx="96" cy="96" r={arcRadius}
                fill="none"
                stroke={risk.color}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={arcCirc}
                initial={{ strokeDashoffset: arcCirc }}
                animate={{ strokeDashoffset: arcOffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-bold" style={{ color: risk.color }}>{score}</div>
              <div className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: "#6b7280" }}>out of 100</div>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ background: risk.bg, color: risk.color, border: `1px solid ${risk.border}` }}>
              {score >= 70 ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              {risk.label}
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: "#0f1c36" }}>Quantum Readiness Score: {finalScore}/100</h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "#4b5563" }}>
              {finalScore < 40
                ? "Significant gaps exist across algorithm exposure, asset visibility, and PQC adoption. Immediate action is recommended to address HNDL risk and meet approaching CNSA 2.0 milestones."
                : finalScore < 65
                ? "Moderate progress observed. A structured migration program targeting the findings below will substantially improve your posture and position you ahead of the 2028–2030 CNSA 2.0 deadlines."
                : "Strong baseline posture. Targeted improvements in the areas flagged below will drive full CNSA 2.0 compliance and maintain your lead in quantum readiness."}
            </p>
            <div className="flex flex-wrap gap-2">
              {form.complianceFrameworks.slice(0, 4).map(fw => (
                <span key={fw} className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ background: "#e8edf5", color: "#1e3a5f" }}>{fw}</span>
              ))}
              {form.complianceFrameworks.length > 4 && (
                <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "#f3f4f6", color: "#6b7280" }}>+{form.complianceFrameworks.length - 4} more</span>
              )}
            </div>
          </div>
        </div>

        {/* Findings */}
        <div>
          <h2 className="text-lg font-bold mb-3" style={{ color: "#0f1c36" }}>Key Findings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {FINDINGS.map(f => (
              <div key={f.title} className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: f.color + "18" }}>
                    <f.icon className="w-4.5 h-4.5" style={{ color: f.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm" style={{ color: "#0f1c36" }}>{f.title}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider"
                        style={{ background: f.color + "18", color: f.color }}>{f.severity}</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "#4b5563" }}>{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 90-Day Roadmap */}
        <div className="rounded-2xl p-6 md:p-8" style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-5 h-5" style={{ color: "#1e3a5f" }} />
            <h2 className="text-lg font-bold" style={{ color: "#0f1c36" }}>90-Day Migration Roadmap</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ROADMAP.map((phase, i) => (
              <div key={phase.phase} className="rounded-xl p-5" style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: phase.color }}>{i + 1}</div>
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: phase.color }}>{phase.weeks}</span>
                </div>
                <div className="font-bold text-sm mb-3" style={{ color: "#0f1c36" }}>{phase.title}</div>
                <ul className="space-y-2">
                  {phase.tasks.map((t, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: "#4b5563" }}>
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: phase.color }} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Restart + CTA */}
        <div className="rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ background: "#1e3a5f" }}>
          <div>
            <div className="font-bold text-white mb-1">Ready to see your live infrastructure?</div>
            <p className="text-sm" style={{ color: "#94a3b8" }}>
              QVault can generate this same report from real telemetry, continuously and automatically.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button onClick={onRestart} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>
              Retake Assessment
            </button>
            <a href="/dashboard" className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: "#fff", color: "#1e3a5f" }}>
              Open Live Dashboard <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
