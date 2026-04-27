import { useState } from "react";
import { ChevronDown, ChevronRight, CheckCircle, Clock, AlertCircle, ExternalLink } from "lucide-react";

interface Requirement {
  id: string;
  text: string;
  qvaultModule: string;
  status: "covered" | "partial" | "roadmap";
}

interface Framework {
  id: string;
  name: string;
  shortName: string;
  issuer: string;
  year: number;
  deadline: string;
  color: string;
  description: string;
  scope: string;
  url: string;
  requirements: Requirement[];
}

const FRAMEWORKS: Framework[] = [
  {
    id: "cnsa2",
    name: "Commercial National Security Algorithm Suite 2.0",
    shortName: "CNSA 2.0",
    issuer: "NSA / CISA",
    year: 2022,
    deadline: "2030 (NSS systems)",
    color: "#ff6600",
    description: "Mandates migration to post-quantum algorithms for all National Security Systems. Specifies ML-KEM-1024, ML-DSA-87, SLH-DSA, and XMSS as approved algorithms. Deprecates RSA, ECDSA, ECDH, and SHA-2 for NSS use.",
    scope: "National Security Systems (NSS), DoD, IC, defense contractors",
    url: "https://media.defense.gov/2022/Sep/07/2003071834/-1/-1/0/CSA_CNSA_2.0_ALGORITHMS_.PDF",
    requirements: [
      { id: "cnsa-1", text: "Maintain inventory of all cryptographic algorithms in use across NSS systems", qvaultModule: "CBOM Explorer + Node Inventory", status: "covered" },
      { id: "cnsa-2", text: "Identify systems using deprecated algorithms (RSA, ECDSA, ECDH)", qvaultModule: "Compliance Dashboard", status: "covered" },
      { id: "cnsa-3", text: "Track migration progress toward ML-KEM-768 / ML-KEM-1024", qvaultModule: "Compliance Velocity", status: "covered" },
      { id: "cnsa-4", text: "Monitor ML-DSA-65 / ML-DSA-87 adoption for digital signatures", qvaultModule: "Telemetry Feed", status: "covered" },
      { id: "cnsa-5", text: "Generate migration timeline with milestone tracking", qvaultModule: "Compliance Dashboard", status: "covered" },
      { id: "cnsa-6", text: "Alert on non-compliant algorithm negotiation in real time", qvaultModule: "Zero Trust Alerts", status: "covered" },
      { id: "cnsa-7", text: "Produce evidence packages for ATO and authority review", qvaultModule: "CBOM Explorer (export)", status: "partial" },
    ],
  },
  {
    id: "nsm10",
    name: "National Security Memorandum 10",
    shortName: "NSM-10",
    issuer: "White House / NSC",
    year: 2022,
    deadline: "Ongoing (annual reporting)",
    color: "#cc4400",
    description: "Directs federal agencies to inventory cryptographic systems, identify quantum-vulnerable systems, and develop migration plans. Requires CISA and NSA to provide guidance and agencies to report progress annually.",
    scope: "All federal agencies, National Security Systems",
    url: "https://www.whitehouse.gov/briefing-room/statements-releases/2022/05/04/national-security-memorandum-on-promoting-united-states-leadership-in-quantum-computing-while-mitigating-risks-to-vulnerable-cryptographic-systems/",
    requirements: [
      { id: "nsm-1", text: "Inventory all cryptographic systems across the agency", qvaultModule: "Node Inventory + CBOM Explorer", status: "covered" },
      { id: "nsm-2", text: "Prioritize quantum-vulnerable systems by mission criticality", qvaultModule: "Command Center (risk scoring)", status: "covered" },
      { id: "nsm-3", text: "Develop a migration plan with prioritized remediation steps", qvaultModule: "Compliance Velocity", status: "covered" },
      { id: "nsm-4", text: "Establish continuous monitoring of cryptographic posture", qvaultModule: "Telemetry Feed + Alerts", status: "covered" },
      { id: "nsm-5", text: "Produce annual progress reports on PQC migration", qvaultModule: "Compliance Dashboard (reporting)", status: "partial" },
      { id: "nsm-6", text: "Coordinate with CISA and NSA on migration milestones", qvaultModule: "Evidence export (roadmap)", status: "roadmap" },
    ],
  },
  {
    id: "eo14028",
    name: "Executive Order 14028 — Improving the Nation's Cybersecurity",
    shortName: "EO 14028",
    issuer: "White House",
    year: 2021,
    deadline: "Phased (2021–ongoing)",
    color: "#aa3300",
    description: "Requires federal agencies to modernize cybersecurity, adopt Zero Trust architecture, and improve software supply chain security. Establishes minimum cryptographic standards and mandates encryption for data at rest and in transit.",
    scope: "All federal civilian agencies, federal contractors",
    url: "https://www.whitehouse.gov/briefing-room/presidential-actions/2021/05/12/executive-order-on-improving-the-nations-cybersecurity/",
    requirements: [
      { id: "eo-1", text: "Implement Zero Trust Architecture aligned to NIST 800-207", qvaultModule: "Zero Trust Alerts", status: "covered" },
      { id: "eo-2", text: "Encrypt data in transit using approved cryptographic protocols", qvaultModule: "Node Inventory (TLS posture)", status: "covered" },
      { id: "eo-3", text: "Monitor and log all network access attempts and policy decisions", qvaultModule: "Telemetry Feed", status: "covered" },
      { id: "eo-4", text: "Establish software supply chain cryptographic integrity checks", qvaultModule: "CBOM Explorer", status: "covered" },
      { id: "eo-5", text: "Deploy endpoint detection and cryptographic event monitoring", qvaultModule: "Zero Trust Alerts", status: "covered" },
    ],
  },
  {
    id: "nist800207",
    name: "NIST Special Publication 800-207",
    shortName: "NIST 800-207",
    issuer: "NIST",
    year: 2020,
    deadline: "Required for EO 14028 compliance",
    color: "#3366cc",
    description: "Defines Zero Trust Architecture (ZTA) principles including never-trust-always-verify, micro-segmentation, and continuous validation. Provides an abstract definition and several deployment models for federal and enterprise environments.",
    scope: "Federal agencies, DoD, critical infrastructure operators",
    url: "https://csrc.nist.gov/publications/detail/sp/800-207/final",
    requirements: [
      { id: "zt-1", text: "Verify all users and devices before granting access (never trust, always verify)", qvaultModule: "Zero Trust Alerts", status: "covered" },
      { id: "zt-2", text: "Use least-privilege access controls enforced at every transaction", qvaultModule: "Node Inventory (posture scoring)", status: "covered" },
      { id: "zt-3", text: "Assume breach — monitor all network traffic continuously", qvaultModule: "Telemetry Feed", status: "covered" },
      { id: "zt-4", text: "Authenticate and authorize all connections using cryptography", qvaultModule: "Compliance Dashboard", status: "covered" },
      { id: "zt-5", text: "Collect and analyze security telemetry in real time", qvaultModule: "Command Center + Telemetry Feed", status: "covered" },
      { id: "zt-6", text: "Classify and protect all data based on sensitivity", qvaultModule: "CBOM Explorer", status: "partial" },
    ],
  },
  {
    id: "fips205",
    name: "FIPS 205 — Module-Lattice-Based Digital Signature Standard (ML-DSA)",
    shortName: "FIPS 205",
    issuer: "NIST",
    year: 2024,
    deadline: "Adopt when transitioning from ECDSA/RSA",
    color: "#6633cc",
    description: "Finalizes ML-DSA (formerly CRYSTALS-Dilithium) as the primary post-quantum digital signature algorithm. Specifies three security levels: ML-DSA-44 (Level 2), ML-DSA-65 (Level 3), and ML-DSA-87 (Level 5).",
    scope: "Federal agencies, vendors supplying to federal government",
    url: "https://csrc.nist.gov/pubs/fips/205/final",
    requirements: [
      { id: "dsa-1", text: "Track adoption of ML-DSA-65 and ML-DSA-87 across signing systems", qvaultModule: "CBOM Explorer + Telemetry Feed", status: "covered" },
      { id: "dsa-2", text: "Identify systems still using RSA or ECDSA for signatures", qvaultModule: "Compliance Dashboard", status: "covered" },
      { id: "dsa-3", text: "Alert when deprecated signature algorithms are detected", qvaultModule: "Zero Trust Alerts", status: "covered" },
      { id: "dsa-4", text: "Validate key sizes meet FIPS 205 parameter set requirements", qvaultModule: "Node Inventory", status: "partial" },
    ],
  },
  {
    id: "fips206",
    name: "FIPS 206 — Module-Lattice-Based Key-Encapsulation Mechanism Standard (ML-KEM)",
    shortName: "FIPS 206",
    issuer: "NIST",
    year: 2024,
    deadline: "Adopt when transitioning from RSA/ECDH key exchange",
    color: "#9933cc",
    description: "Finalizes ML-KEM (formerly CRYSTALS-Kyber) as the primary post-quantum key encapsulation mechanism. Specifies ML-KEM-512 (Level 1), ML-KEM-768 (Level 3), and ML-KEM-1024 (Level 5). CNSA 2.0 mandates ML-KEM-1024 for NSS.",
    scope: "Federal agencies, DoD, vendors supplying to federal government",
    url: "https://csrc.nist.gov/pubs/fips/206/final",
    requirements: [
      { id: "kem-1", text: "Track adoption of ML-KEM-768 and ML-KEM-1024 for key exchange", qvaultModule: "CBOM Explorer + Telemetry Feed", status: "covered" },
      { id: "kem-2", text: "Identify systems still using RSA key encapsulation or ECDH", qvaultModule: "Compliance Dashboard", status: "covered" },
      { id: "kem-3", text: "Monitor TLS sessions for X25519MLKEM768 hybrid negotiation", qvaultModule: "Telemetry Feed", status: "covered" },
      { id: "kem-4", text: "Alert on classical-only key exchange in production systems", qvaultModule: "Zero Trust Alerts", status: "covered" },
    ],
  },
  {
    id: "sp800235",
    name: "NIST SP 800-235 — Cryptographic Bill of Materials (CBOM)",
    shortName: "SP 800-235",
    issuer: "NIST",
    year: 2024,
    deadline: "Guidance (not yet mandatory)",
    color: "#008855",
    description: "Defines the structure and content requirements for a Cryptographic Bill of Materials (CBOM) — a machine-readable inventory of all cryptographic assets in a software system or organization. Analogous to SBOM but focused on algorithms, key lengths, and protocols.",
    scope: "Federal agencies, software vendors, critical infrastructure operators",
    url: "https://csrc.nist.gov/publications/detail/sp/800-235/draft",
    requirements: [
      { id: "cbom-1", text: "Generate a complete inventory of all cryptographic algorithms in use", qvaultModule: "CBOM Explorer", status: "covered" },
      { id: "cbom-2", text: "Record algorithm name, key length, mode, and usage context", qvaultModule: "CBOM Explorer (detail view)", status: "covered" },
      { id: "cbom-3", text: "Map each cryptographic asset to the system or component using it", qvaultModule: "CBOM Explorer + Node Inventory", status: "covered" },
      { id: "cbom-4", text: "Identify deprecated or non-compliant algorithms in the CBOM", qvaultModule: "Compliance Dashboard", status: "covered" },
      { id: "cbom-5", text: "Enable CBOM export in machine-readable format", qvaultModule: "CBOM Explorer (export — roadmap)", status: "roadmap" },
    ],
  },
];

const STATUS_CONFIG = {
  covered:  { label: "Fully Covered", color: "text-green-400",  bg: "bg-green-500/10 border-green-500/30",  icon: CheckCircle },
  partial:  { label: "Partial Coverage", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30", icon: Clock },
  roadmap:  { label: "On Roadmap",    color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/30",   icon: AlertCircle },
};

function FrameworkCard({ fw }: { fw: Framework }) {
  const [open, setOpen] = useState(false);
  const covered = fw.requirements.filter(r => r.status === "covered").length;
  const total = fw.requirements.length;
  const pct = Math.round((covered / total) * 100);

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden transition-all duration-200 hover:border-orange-500/30">
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left p-5 flex items-start gap-4 hover:bg-secondary/30 transition-colors"
      >
        {/* Color stripe */}
        <div className="shrink-0 w-1 self-stretch rounded-full" style={{ background: fw.color }} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <span
              className="mono text-xs font-bold tracking-wider px-2 py-0.5 rounded"
              style={{ color: fw.color, background: fw.color + "22", border: `1px solid ${fw.color}55` }}
            >
              {fw.shortName}
            </span>
            <span className="text-muted-foreground text-xs mono">{fw.issuer} · {fw.year}</span>
            <span className="text-muted-foreground text-xs mono ml-auto hidden sm:block">Deadline: {fw.deadline}</span>
          </div>
          <div className="text-sm text-foreground font-medium mb-2 pr-8">{fw.name}</div>
          <div className="text-xs text-muted-foreground mb-3 line-clamp-2">{fw.description}</div>

          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: fw.color }}
              />
            </div>
            <span className="mono text-xs shrink-0" style={{ color: fw.color }}>{pct}% covered</span>
            <span className="text-muted-foreground text-xs shrink-0">({covered}/{total} req.)</span>
          </div>
        </div>

        <div className="shrink-0 text-muted-foreground mt-1">
          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded requirements */}
      {open && (
        <div className="border-t border-border bg-black/30 p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
            <div className="rounded border border-border bg-secondary/20 p-3">
              <div className="mono text-muted-foreground/60 text-[9px] uppercase tracking-widest mb-1">Scope</div>
              <div className="text-muted-foreground">{fw.scope}</div>
            </div>
            <div className="rounded border border-border bg-secondary/20 p-3 flex items-center justify-between">
              <div>
                <div className="mono text-muted-foreground/60 text-[9px] uppercase tracking-widest mb-1">Official Reference</div>
                <div className="text-muted-foreground">{fw.shortName} — {fw.issuer}</div>
              </div>
              <a
                href={fw.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-3 shrink-0 flex items-center gap-1 text-orange-400 hover:text-orange-300 transition-colors"
                onClick={e => e.stopPropagation()}
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="mono text-[9px] text-muted-foreground/50 uppercase tracking-widest mb-2">Requirements Mapping</div>
          <div className="space-y-2">
            {fw.requirements.map(req => {
              const cfg = STATUS_CONFIG[req.status];
              const Icon = cfg.icon;
              return (
                <div key={req.id} className={`flex items-start gap-3 p-3 rounded border text-xs ${cfg.bg}`}>
                  <Icon className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${cfg.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-foreground mb-1 leading-relaxed">{req.text}</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="mono text-muted-foreground/60 text-[9px]">QVault module:</span>
                      <span className={`mono text-[9px] font-medium ${cfg.color}`}>{req.qvaultModule}</span>
                    </div>
                  </div>
                  <span className={`shrink-0 mono text-[8px] uppercase tracking-wider px-2 py-0.5 rounded border ${cfg.bg} ${cfg.color}`}>
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RegulatoryPage() {
  const [filter, setFilter] = useState<"all" | "covered" | "partial" | "roadmap">("all");

  const totalReqs = FRAMEWORKS.flatMap(f => f.requirements);
  const coveredCount = totalReqs.filter(r => r.status === "covered").length;
  const partialCount = totalReqs.filter(r => r.status === "partial").length;
  const roadmapCount = totalReqs.filter(r => r.status === "roadmap").length;

  const filtered = FRAMEWORKS.filter(fw =>
    filter === "all" ? true : fw.requirements.some(r => r.status === filter)
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 rounded-full bg-orange-500" />
          <span className="font-mono text-xs text-orange-500 uppercase tracking-widest">Regulatory Intelligence</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Compliance Framework Mapping</h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          A precise mapping of every applicable regulatory and standards framework to QVault modules. Each requirement
          is individually assessed for coverage so security teams, compliance officers, and ATO reviewers can
          understand exactly what is addressed, what is partially addressed, and what is on the roadmap.
        </p>
      </div>

      {/* Summary scorecards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Frameworks Covered", value: FRAMEWORKS.length, color: "text-orange-400", border: "border-orange-500/30" },
          { label: "Requirements Met", value: coveredCount, color: "text-green-400", border: "border-green-500/30" },
          { label: "Partial Coverage", value: partialCount, color: "text-yellow-400", border: "border-yellow-500/30" },
          { label: "On Roadmap", value: roadmapCount, color: "text-blue-400", border: "border-blue-500/30" },
        ].map(({ label, value, color, border }) => (
          <div key={label} className={`rounded-lg border ${border} bg-card p-4 text-center`}>
            <div className={`text-3xl font-bold font-mono ${color} mb-1`}>{value}</div>
            <div className="text-muted-foreground text-xs font-mono uppercase tracking-widest">{label}</div>
          </div>
        ))}
      </div>

      {/* Coverage legend + filter */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-muted-foreground mono uppercase tracking-widest mr-2">Filter:</span>
        {(["all", "covered", "partial", "roadmap"] as const).map(f => {
          const labels = { all: "All Frameworks", covered: "Fully Covered", partial: "Partial", roadmap: "Roadmap" };
          const colors: Record<string, string> = { all: "border-orange-500 text-orange-400", covered: "border-green-500 text-green-400", partial: "border-yellow-500 text-yellow-400", roadmap: "border-blue-500 text-blue-400" };
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded border text-xs mono uppercase tracking-wider transition-all ${
                filter === f ? colors[f] + " bg-white/5" : "border-border text-muted-foreground hover:border-orange-500/40"
              }`}
            >
              {labels[f]}
            </button>
          );
        })}
      </div>

      {/* Coverage key */}
      <div className="flex flex-wrap gap-4 p-4 rounded-lg border border-border bg-card/50">
        <span className="mono text-[9px] text-muted-foreground/50 uppercase tracking-widest self-center">Legend:</span>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <div key={key} className="flex items-center gap-1.5">
              <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
              <span className={`mono text-[10px] ${cfg.color}`}>{cfg.label}</span>
            </div>
          );
        })}
      </div>

      {/* Framework cards */}
      <div className="space-y-3">
        {filtered.map(fw => <FrameworkCard key={fw.id} fw={fw} />)}
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg border border-border bg-card/30 p-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-orange-400 font-mono">Note:</span> This mapping reflects QVault capabilities as of v2026.1.
          Regulatory frameworks evolve continuously. Organizations should conduct independent legal and compliance review
          before relying on this mapping for formal ATO submissions or audit evidence. Requirements marked
          "On Roadmap" are planned for future releases.
          Official framework documents are linked directly for reference.
        </p>
      </div>
    </div>
  );
}
