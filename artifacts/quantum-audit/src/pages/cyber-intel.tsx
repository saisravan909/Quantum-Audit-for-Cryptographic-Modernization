import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle, Circle } from "lucide-react";

type SubTab = "algorithms" | "threats" | "zerotrust";

/* ─── Algorithm Library data ────────────────────────────── */
const ALGORITHMS = [
  {
    name: "ML-KEM-768", family: "Lattice (CRYSTALS-Kyber)", type: "Key Encapsulation", standard: "FIPS 206",
    keySize: "1184 bytes (public)", securityLevel: "NIST Level 3", quantumSafe: true,
    hndlSafe: true, cnsa2: "Recommended", status: "active",
    performance: "Fast", notes: "Hybrid X25519MLKEM768 used for TLS 1.3 transition deployments.",
    color: "#00cc88",
  },
  {
    name: "ML-KEM-1024", family: "Lattice (CRYSTALS-Kyber)", type: "Key Encapsulation", standard: "FIPS 206",
    keySize: "1568 bytes (public)", securityLevel: "NIST Level 5", quantumSafe: true,
    hndlSafe: true, cnsa2: "Mandated for NSS", status: "active",
    performance: "Moderate", notes: "Mandatory for National Security Systems per CNSA 2.0.",
    color: "#00aaff",
  },
  {
    name: "ML-DSA-65", family: "Lattice (CRYSTALS-Dilithium)", type: "Digital Signature", standard: "FIPS 205",
    keySize: "1952 bytes (public)", securityLevel: "NIST Level 3", quantumSafe: true,
    hndlSafe: true, cnsa2: "Recommended", status: "active",
    performance: "Fast", notes: "Primary PQC signature algorithm for general federal use.",
    color: "#aa66ff",
  },
  {
    name: "ML-DSA-87", family: "Lattice (CRYSTALS-Dilithium)", type: "Digital Signature", standard: "FIPS 205",
    keySize: "2592 bytes (public)", securityLevel: "NIST Level 5", quantumSafe: true,
    hndlSafe: true, cnsa2: "Mandated for NSS", status: "active",
    performance: "Moderate", notes: "Mandatory for NSS digital signature operations.",
    color: "#8844ff",
  },
  {
    name: "SLH-DSA-128s", family: "Hash-based (SPHINCS+)", type: "Digital Signature", standard: "FIPS 205",
    keySize: "32 bytes (public)", securityLevel: "NIST Level 1", quantumSafe: true,
    hndlSafe: true, cnsa2: "Alternative", status: "active",
    performance: "Slow (signing)", notes: "Stateless hash-based. Conservative security assumptions. Use when key size matters over performance.",
    color: "#ff9900",
  },
  {
    name: "RSA-2048", family: "Integer Factorization", type: "Key Exchange / Signature", standard: "PKCS#1",
    keySize: "256 bytes (public)", securityLevel: "Classical 112-bit", quantumSafe: false,
    hndlSafe: false, cnsa2: "Deprecated", status: "deprecated",
    performance: "Moderate", notes: "Broken by Shor's algorithm on CRQC. All sessions using this algorithm are HNDL-vulnerable today.",
    color: "#cc0000",
  },
  {
    name: "ECC P-256", family: "Elliptic Curve", type: "Key Exchange / Signature", standard: "NIST FIPS 186",
    keySize: "64 bytes (public)", securityLevel: "Classical 128-bit", quantumSafe: false,
    hndlSafe: false, cnsa2: "Deprecated", status: "deprecated",
    performance: "Fast", notes: "Broken by Shor's algorithm on CRQC. Widely deployed but vulnerable. Do not use for new systems.",
    color: "#cc3300",
  },
  {
    name: "AES-256", family: "Symmetric Block Cipher", type: "Symmetric Encryption", standard: "FIPS 197",
    keySize: "256-bit key", securityLevel: "128-bit post-quantum", quantumSafe: true,
    hndlSafe: true, cnsa2: "Approved", status: "active",
    performance: "Very Fast", notes: "Grover's algorithm halves effective key length. AES-256 retains 128-bit security post-quantum.",
    color: "#00aa44",
  },
];

/* ─── Threat Intelligence data ───────────────────────────── */
const THREAT_EVENTS = [
  { year: 2016, label: "NIST PQC Competition Launched", type: "milestone", detail: "NIST opens global competition to standardize post-quantum cryptographic algorithms. 69 submissions received." },
  { year: 2019, label: "Google Sycamore Quantum Supremacy", type: "quantum", detail: "Google demonstrates quantum supremacy on a narrow computational problem. First public evidence of practical quantum advantage." },
  { year: 2020, label: "NSA HNDL Warning Issued", type: "threat", detail: "NSA publicly acknowledges adversaries are collecting encrypted traffic for future decryption. HNDL threat confirmed by intelligence community." },
  { year: 2022, label: "NSM-10 and CNSA 2.0 Published", type: "milestone", detail: "White House mandates federal PQC migration. NSA releases CNSA 2.0 algorithm suite. Migration clock officially starts." },
  { year: 2022, label: "IBM Eagle 127-qubit Processor", type: "quantum", detail: "IBM releases 127-qubit Eagle processor. Quantum hardware scaling accelerates significantly." },
  { year: 2023, label: "NIST PQC Draft Standards Released", type: "milestone", detail: "FIPS 203 (ML-KEM), 204 (ML-DSA), and 205 (SLH-DSA) drafts published for public comment." },
  { year: 2024, label: "FIPS 205 and 206 Finalized", type: "milestone", detail: "NIST finalizes ML-KEM (FIPS 206) and ML-DSA (FIPS 205) as the primary PQC standards. Migration becomes technically mandatory." },
  { year: 2024, label: "IBM Condor 1000+ Qubit Processor", type: "quantum", detail: "IBM surpasses 1,000 qubits. Error rates remain high but trajectory toward fault-tolerant QC is clear." },
  { year: 2025, label: "Google Willow Quantum Chip", type: "quantum", detail: "Google announces Willow chip with improved error correction. CRQC timeline estimates tighten to 2029 to 2033 range." },
  { year: 2028, label: "CNSA 2.0 NSS Deadline (projected)", type: "deadline", detail: "All National Security Systems must be PQC-compliant. Non-compliant systems risk mission failure and contract termination." },
  { year: 2030, label: "Full Federal PQC Mandate (projected)", type: "deadline", detail: "All federal civilian systems must complete PQC migration. RSA and ECC declared cryptographically unacceptable for new deployments." },
  { year: 2031, label: "Estimated CRQC Capability (early estimate)", type: "quantum", detail: "Some research projections place fault-tolerant CRQC capability by 2031. All data encrypted before this date is at risk if HNDL-collected." },
];

/* ─── Zero Trust Maturity data ───────────────────────────── */
const ZT_LEVELS = [
  {
    level: 1, name: "Traditional", color: "#cc0000",
    description: "Perimeter-based security. Trust is implicit inside the network. No continuous verification.",
    criteria: [
      "Flat network with implicit trust after authentication",
      "No micro-segmentation between zones",
      "Minimal cryptographic logging or visibility",
      "Static firewall rules as primary defense",
    ],
    qvaultIndicators: ["High HNDL Exposure Score (60+)", "Many deprecated algorithm alerts", "Zero PQC adoption in telemetry"],
  },
  {
    level: 2, name: "Aware", color: "#ff6600",
    description: "Organization understands Zero Trust principles and has begun assessment. Some identity controls in place.",
    criteria: [
      "MFA deployed for privileged accounts",
      "Asset inventory initiated",
      "Basic network segmentation in place",
      "Cryptographic audit started but incomplete",
    ],
    qvaultIndicators: ["CBOM partially populated", "Some nodes inventoried", "Compliance scoring below 40%"],
  },
  {
    level: 3, name: "Implementing", color: "#ffaa00",
    description: "Active Zero Trust deployment. Micro-segmentation in progress. Cryptographic controls being modernized.",
    criteria: [
      "Micro-segmentation deployed on critical segments",
      "Identity-based access control enforced",
      "TLS 1.3 required on monitored segments",
      "CBOM generated and reviewed quarterly",
    ],
    qvaultIndicators: ["HNDL Score 30 to 60", "CBOM complete for priority systems", "Active alert management workflow"],
  },
  {
    level: 4, name: "Advanced", color: "#88cc00",
    description: "Zero Trust architecture operational. PQC migration underway. Continuous monitoring in place.",
    criteria: [
      "All traffic authenticated and encrypted",
      "Least privilege enforced at transaction level",
      "ML-KEM deployed on all new connections",
      "Automated alert triage and response playbooks",
    ],
    qvaultIndicators: ["HNDL Score 15 to 30", "50%+ PQC adoption", "Zero critical alerts sustained for 30+ days"],
  },
  {
    level: 5, name: "Optimal", color: "#00cc88",
    description: "Full Zero Trust with complete PQC migration. Cryptographic agility built into architecture.",
    criteria: [
      "100% PQC adoption across all systems",
      "Cryptographic agility: algorithm updates without re-architecture",
      "Automated CBOM generation and continuous comparison",
      "CNSA 2.0 fully compliant across all segments",
    ],
    qvaultIndicators: ["HNDL Score below 10", "100% PQC adoption", "Compliance velocity at 95%+"],
  },
];

const CHECKLIST: Record<number, string[]> = {
  1: ["Complete asset inventory using Node Inventory module", "Run CBOM Explorer scan on all segments", "Identify all RSA and ECC key exchange endpoints", "Establish baseline HNDL Exposure Score"],
  2: ["Deploy ML-KEM-768 on internet-facing endpoints", "Configure Zero Trust Alerts for deprecated algorithm detection", "Generate CBOM for top 20 priority systems", "Map compliance gaps using Compliance Velocity dashboard"],
  3: ["Complete ML-KEM deployment on all internal segments", "Achieve CNSA 2.0 compliance score above 50%", "Implement automated alert triage workflow", "Publish quarterly CBOM review process"],
  4: ["Deploy ML-KEM-1024 on NSS-equivalent systems", "Achieve HNDL Exposure Score below 20", "Implement cryptographic agility in new systems", "Complete NSM-10 annual inventory submission"],
  5: ["Achieve 100% PQC adoption across all monitored nodes", "HNDL Exposure Score sustained below 10 for 90 days", "CNSA 2.0 compliance at 95% or above", "Automated CBOM diff alerting operational"],
};

export default function CyberIntelPage() {
  const [subTab, setSubTab] = useState<SubTab>("algorithms");
  const [ztLevel, setZtLevel] = useState(1);
  const [riskAlgorithm, setRiskAlgorithm] = useState("RSA-2048");
  const [dataAge, setDataAge] = useState(5);

  const riskScore = riskAlgorithm === "RSA-2048" || riskAlgorithm === "ECC P-256"
    ? Math.min(95, 40 + dataAge * 4)
    : Math.max(5, 10 - dataAge);

  const riskColor = riskScore > 70 ? "#cc0000" : riskScore > 40 ? "#ff8800" : "#00cc88";

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 rounded-full bg-orange-500" />
          <span className="font-mono text-xs text-orange-500 uppercase tracking-widest">Cyber Intelligence</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">PQC Intelligence Center</h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          Three intelligence resources in one place: a PQC algorithm library, a quantum threat timeline with HNDL risk calculator,
          and a Zero Trust maturity model with self-assessment checklist.
        </p>
      </div>

      {/* Sub-tab bar */}
      <div className="flex gap-1 p-1 rounded-lg bg-secondary/30 border border-border w-fit">
        {([
          { id: "algorithms", label: "PQC Algorithm Library", icon: Shield },
          { id: "threats", label: "Threat Intelligence", icon: AlertTriangle },
          { id: "zerotrust", label: "Zero Trust Maturity", icon: CheckCircle },
        ] as const).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSubTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded text-xs mono uppercase tracking-wider transition-all ${
              subTab === id
                ? "bg-orange-500/20 text-orange-400 border border-orange-500/40"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* ── ALGORITHM LIBRARY ─────────────────────────────── */}
      {subTab === "algorithms" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            A comparison of post-quantum and classical algorithms across key size, security level, quantum resistance, and CNSA 2.0 status.
          </p>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  {["Algorithm", "Type", "Standard", "Key Size", "Security Level", "Quantum Safe", "HNDL Safe", "CNSA 2.0", "Performance"].map(h => (
                    <th key={h} className="text-left px-4 py-3 mono text-[9px] uppercase tracking-widest text-muted-foreground/60 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALGORITHMS.map((algo, i) => (
                  <tr key={algo.name} className={`border-b border-border/50 hover:bg-secondary/20 transition-colors ${i % 2 === 0 ? "bg-black/10" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: algo.color }} />
                        <span className="font-mono font-bold" style={{ color: algo.color }}>{algo.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{algo.type}</td>
                    <td className="px-4 py-3 mono text-orange-400/70">{algo.standard}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{algo.keySize}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{algo.securityLevel}</td>
                    <td className="px-4 py-3">
                      <span className={`mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border ${algo.quantumSafe ? "text-green-400 border-green-500/30 bg-green-500/10" : "text-red-400 border-red-500/30 bg-red-500/10"}`}>
                        {algo.quantumSafe ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border ${algo.hndlSafe ? "text-green-400 border-green-500/30 bg-green-500/10" : "text-red-400 border-red-500/30 bg-red-500/10"}`}>
                        {algo.hndlSafe ? "Safe" : "Vulnerable"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`mono text-[9px] uppercase tracking-wider whitespace-nowrap ${
                        algo.cnsa2.includes("Mandated") ? "text-blue-400" :
                        algo.cnsa2.includes("Recommended") || algo.cnsa2 === "Approved" ? "text-green-400" :
                        algo.cnsa2 === "Alternative" ? "text-yellow-400" : "text-red-400"
                      }`}>{algo.cnsa2}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{algo.performance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ALGORITHMS.filter(a => a.notes).slice(0, 3).map(a => (
              <div key={a.name} className="rounded border border-border bg-card/50 p-4">
                <div className="mono text-[10px] font-bold mb-2" style={{ color: a.color }}>{a.name}</div>
                <p className="text-muted-foreground text-xs leading-relaxed">{a.notes}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── THREAT INTELLIGENCE ───────────────────────────── */}
      {subTab === "threats" && (
        <div className="space-y-8">
          {/* Risk calculator */}
          <div className="rounded-lg border border-orange-500/25 bg-card p-6">
            <div className="mono text-xs text-orange-500 uppercase tracking-widest mb-4">HNDL Risk Calculator</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <label className="mono text-[9px] text-muted-foreground/60 uppercase tracking-widest block mb-2">Algorithm in Use</label>
                <select
                  value={riskAlgorithm}
                  onChange={e => setRiskAlgorithm(e.target.value)}
                  className="w-full rounded border border-border bg-secondary text-foreground text-sm px-3 py-2 font-mono"
                >
                  {["RSA-2048", "ECC P-256", "ML-KEM-768", "ML-KEM-1024", "AES-256"].map(a => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mono text-[9px] text-muted-foreground/60 uppercase tracking-widest block mb-2">Years of Historical Data Exposed: {dataAge}</label>
                <input
                  type="range" min={1} max={20} value={dataAge}
                  onChange={e => setDataAge(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
                <div className="flex justify-between mono text-[9px] text-muted-foreground/40 mt-1">
                  <span>1 yr</span><span>20 yr</span>
                </div>
              </div>
              <div className="text-center">
                <div className="mono text-[9px] text-muted-foreground/60 uppercase tracking-widest mb-2">HNDL Risk Score</div>
                <div className="text-5xl font-black font-mono" style={{ color: riskColor }}>{riskScore}</div>
                <div className="mono text-[9px] mt-1" style={{ color: riskColor }}>
                  {riskScore > 70 ? "CRITICAL EXPOSURE" : riskScore > 40 ? "HIGH EXPOSURE" : "LOW EXPOSURE"}
                </div>
              </div>
            </div>
            <p className="text-muted-foreground text-xs mt-4 leading-relaxed">
              This score estimates relative HNDL exposure based on algorithm quantum-resistance and the historical depth of potentially-collected encrypted data.
              Higher scores indicate greater risk from archive decryption when CRQC capability arrives.
            </p>
          </div>

          {/* Timeline */}
          <div>
            <div className="mono text-xs text-muted-foreground/60 uppercase tracking-widest mb-4">Quantum Threat Timeline</div>
            <div className="relative">
              <div className="absolute left-16 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-4">
                {THREAT_EVENTS.map(ev => {
                  const typeColors: Record<string, string> = { milestone: "#ff8800", quantum: "#aa44ff", threat: "#cc0000", deadline: "#cc4400" };
                  const c = typeColors[ev.type] || "#888";
                  return (
                    <div key={`${ev.year}-${ev.label}`} className="flex gap-4 items-start">
                      <div className="w-12 shrink-0 text-right mono text-[10px] text-muted-foreground/60 pt-1">{ev.year}</div>
                      <div className="relative flex items-start gap-3 flex-1">
                        <div className="absolute -left-2.5 top-1.5 w-2 h-2 rounded-full border-2 border-background" style={{ background: c }} />
                        <div className="pl-4 flex-1 p-3 rounded border border-border/50 bg-card/40 hover:bg-card/80 transition-colors">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded" style={{ color: c, background: c + "22", border: `1px solid ${c}44` }}>{ev.type}</span>
                            <span className="text-foreground text-xs font-medium">{ev.label}</span>
                          </div>
                          <p className="text-muted-foreground text-[11px] leading-relaxed">{ev.detail}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ZERO TRUST MATURITY ───────────────────────────── */}
      {subTab === "zerotrust" && (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            A 5-level Zero Trust maturity framework mapped to NIST 800-207. Select your current level to see the corresponding
            QVault indicators and the checklist for advancing to the next level.
          </p>

          {/* Level selector */}
          <div className="flex gap-2 flex-wrap">
            {ZT_LEVELS.map(l => (
              <button
                key={l.level}
                onClick={() => setZtLevel(l.level)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs mono uppercase tracking-wider transition-all"
                style={{
                  borderColor: ztLevel === l.level ? l.color : undefined,
                  color: ztLevel === l.level ? l.color : undefined,
                  background: ztLevel === l.level ? l.color + "18" : undefined,
                }}
              >
                <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 font-bold text-[9px]"
                  style={{ borderColor: l.color, color: l.color }}>
                  {l.level}
                </span>
                {l.name}
              </button>
            ))}
          </div>

          {ZT_LEVELS.filter(l => l.level === ztLevel).map(l => (
            <div key={l.level} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="rounded-lg border bg-card p-5" style={{ borderColor: l.color + "44" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-black text-sm"
                      style={{ borderColor: l.color, color: l.color }}>
                      {l.level}
                    </div>
                    <div>
                      <div className="font-bold text-foreground">Level {l.level}: {l.name}</div>
                      <div className="mono text-[9px] text-muted-foreground/50 uppercase tracking-widest">NIST 800-207 Alignment</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{l.description}</p>
                  <div className="mono text-[9px] text-muted-foreground/50 uppercase tracking-widest mb-2">Characteristics</div>
                  <ul className="space-y-1.5">
                    {l.criteria.map(c => (
                      <li key={c} className="flex items-start gap-2 text-xs text-gray-300">
                        <Circle className="w-2.5 h-2.5 shrink-0 mt-0.5" style={{ color: l.color }} />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded border border-border bg-card/50 p-4">
                  <div className="mono text-[9px] text-muted-foreground/50 uppercase tracking-widest mb-2">QVault Indicators at This Level</div>
                  <ul className="space-y-1.5">
                    {l.qvaultIndicators.map(q => (
                      <li key={q} className="flex items-start gap-2 text-xs" style={{ color: l.color }}>
                        <span className="shrink-0 mt-0.5">▸</span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-card p-5">
                  <div className="mono text-[9px] text-muted-foreground/50 uppercase tracking-widest mb-3">
                    {l.level < 5 ? `Checklist to Reach Level ${l.level + 1}` : "Sustaining Level 5"}
                  </div>
                  <ul className="space-y-3">
                    {CHECKLIST[l.level].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded border border-border shrink-0 mt-0.5 flex items-center justify-center">
                          <span className="mono text-[9px] text-muted-foreground/40">{i + 1}</span>
                        </div>
                        <span className="text-muted-foreground text-xs leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Progress visual */}
                <div className="rounded border border-border bg-card/50 p-4">
                  <div className="mono text-[9px] text-muted-foreground/50 uppercase tracking-widest mb-3">Maturity Progress</div>
                  <div className="flex items-center gap-1">
                    {ZT_LEVELS.map(lvl => (
                      <div key={lvl.level} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full h-2 rounded-full transition-all"
                          style={{ background: lvl.level <= l.level ? lvl.color : "#333" }}
                        />
                        <span className="mono text-[8px]" style={{ color: lvl.level <= l.level ? lvl.color : "#555" }}>{lvl.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
