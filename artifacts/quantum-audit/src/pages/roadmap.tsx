import { useState } from "react";
import { CheckCircle, Circle, Clock, ChevronRight, Github, ExternalLink } from "lucide-react";

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  phase: number;
  quarter: string;
  status: "shipped" | "in-progress" | "planned";
  label: string;
  githubIssue?: number;
}

interface Phase {
  number: number;
  name: string;
  quarter: string;
  color: string;
  summary: string;
}

const PHASES: Phase[] = [
  {
    number: 1,
    name: "Foundation",
    quarter: "Q2 – Q3 2025",
    color: "#00cc88",
    summary: "Core platform shipped: real-time telemetry, node inventory, CBOM explorer, compliance velocity, and Zero Trust alerting.",
  },
  {
    number: 2,
    name: "Operator Productivity",
    quarter: "Q4 2025",
    color: "#ff8800",
    summary: "Features that reduce manual effort for compliance teams and security engineers.",
  },
  {
    number: 3,
    name: "Production Telemetry",
    quarter: "Q1 2026",
    color: "#ff6600",
    summary: "Connecting QVault to real production telemetry pipelines and automating cryptographic change detection.",
  },
  {
    number: 4,
    name: "Standards Integration",
    quarter: "Q2 2026",
    color: "#aa44ff",
    summary: "Deep integration with established government and industry compliance automation standards.",
  },
  {
    number: 5,
    name: "Enterprise Scale",
    quarter: "Q3 2026",
    color: "#3399ff",
    summary: "Threat intelligence feeds and cloud-native deployment automation for enterprise and multi-cluster environments.",
  },
];

const ITEMS: RoadmapItem[] = [
  // Phase 1 — shipped
  {
    id: "p1-1", phase: 1, quarter: "Q2 2025", status: "shipped", label: "core", githubIssue: 9,
    title: "Real-Time Telemetry Feed",
    description: "eBPF-level cryptographic event stream capturing every TLS handshake, cipher suite negotiation, and algorithm transition across monitored endpoints. Shipped July 2025.",
  },
  {
    id: "p1-2", phase: 1, quarter: "Q2 2025", status: "shipped", label: "core", githubIssue: 10,
    title: "Node Inventory and Posture Scoring",
    description: "Comprehensive cryptographic asset inventory with per-node algorithm audit, certificate tracking, and quantum vulnerability scoring. Shipped August 2025.",
  },
  {
    id: "p1-3", phase: 1, quarter: "Q3 2025", status: "shipped", label: "compliance", githubIssue: 11,
    title: "CBOM Explorer",
    description: "Cryptographic Bill of Materials generation aligned with NIST SP 800-235, with per-asset algorithm cataloguing and dependency mapping. Shipped September 2025.",
  },
  {
    id: "p1-4", phase: 1, quarter: "Q3 2025", status: "shipped", label: "compliance", githubIssue: 12,
    title: "Compliance Velocity Dashboard",
    description: "CNSA 2.0, NSM-10, and EO 14028 migration progress scoring with milestone tracking and deadline countdown. Shipped September 2025.",
  },
  {
    id: "p1-5", phase: 1, quarter: "Q3 2025", status: "shipped", label: "zero-trust", githubIssue: 13,
    title: "Zero Trust Alerts Center",
    description: "Real-time cryptographic policy violation stream with severity classification, node attribution, and remediation guidance aligned with NIST SP 800-207. Shipped September 2025.",
  },
  // Phase 2 — in progress / planned
  {
    id: "p2-1", phase: 2, quarter: "Q4 2025", status: "in-progress", label: "export", githubIssue: 7,
    title: "Export to PDF for ATO Evidence Packages",
    description: "One-click generation of Authority to Operate evidence packages in PDF format, mapping CBOM output and compliance scores to specific framework requirements.",
  },
  {
    id: "p2-2", phase: 2, quarter: "Q4 2025", status: "planned", label: "access-control", githubIssue: 6,
    title: "Role-Based Access Control for Multi-Team Environments",
    description: "Granular RBAC allowing security teams, compliance officers, and executives to each see a tailored view without exposing sensitive operational details across roles.",
  },
  // Phase 3
  {
    id: "p3-1", phase: 3, quarter: "Q1 2026", status: "planned", label: "telemetry", githubIssue: 5,
    title: "OpenTelemetry Collector Plugin for Production Telemetry Ingestion",
    description: "Native OpenTelemetry receiver plugin to ingest cryptographic spans and metrics from existing OTel pipelines in production environments, removing the need for dedicated agents.",
  },
  {
    id: "p3-2", phase: 3, quarter: "Q1 2026", status: "planned", label: "cbom", githubIssue: 2,
    title: "Automated CBOM Diff Alerts When Algorithm Dependencies Change",
    description: "Continuous comparison of CBOM snapshots to detect any change in cryptographic dependencies — new algorithms, removed certificates, or modified key parameters — with automated alerting.",
  },
  // Phase 4
  {
    id: "p4-1", phase: 4, quarter: "Q2 2026", status: "planned", label: "standards", githubIssue: 3,
    title: "NIST NCCoE PQC Migration Project Playbook Templates",
    description: "Pre-built migration playbook templates aligned to the NIST NCCoE PQC Migration Project, enabling organizations to execute structured migrations with embedded QVault checkpoints.",
  },
  {
    id: "p4-2", phase: 4, quarter: "Q2 2026", status: "planned", label: "compliance", githubIssue: 4,
    title: "SCAP Content Generation for Automated Compliance Scanning",
    description: "Export QVault compliance assessments as Security Content Automation Protocol (SCAP) content, enabling integration with existing federal compliance scanning infrastructure.",
  },
  // Phase 5
  {
    id: "p5-1", phase: 5, quarter: "Q3 2026", status: "planned", label: "threat-intel", githubIssue: 1,
    title: "STIX/TAXII Threat Intelligence Integration for HNDL Campaign Attribution",
    description: "Ingest STIX threat bundles via TAXII feeds to correlate observed HNDL collection activity with known nation-state campaigns, providing attribution context alongside cryptographic risk scores.",
  },
  {
    id: "p5-2", phase: 5, quarter: "Q3 2026", status: "planned", label: "infrastructure", githubIssue: 8,
    title: "Kubernetes Operator for Automated Node Discovery",
    description: "Native Kubernetes operator that automatically discovers and registers new pods and services into the QVault node inventory as they are deployed, with zero manual configuration.",
  },
];

const STATUS_CONFIG = {
  shipped:     { label: "Shipped",     color: "text-green-400",  bg: "bg-green-500/10 border-green-500/30",  icon: CheckCircle },
  "in-progress": { label: "In Progress", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30", icon: Clock },
  planned:     { label: "Planned",     color: "text-slate-400",  bg: "bg-slate-500/10 border-slate-500/30",  icon: Circle },
};

const LABEL_COLORS: Record<string, string> = {
  core: "#00cc88", compliance: "#ff8800", "zero-trust": "#ff6600", export: "#aa44ff",
  "access-control": "#3399ff", telemetry: "#ffaa00", cbom: "#ff4400",
  standards: "#aa44ff", "threat-intel": "#ff3366", infrastructure: "#3399ff",
};

export default function RoadmapPage() {
  const [filter, setFilter] = useState<"all" | "shipped" | "in-progress" | "planned">("all");
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);

  const filtered = ITEMS.filter(i => filter === "all" || i.status === filter);
  const shippedCount = ITEMS.filter(i => i.status === "shipped").length;
  const inProgressCount = ITEMS.filter(i => i.status === "in-progress").length;
  const plannedCount = ITEMS.filter(i => i.status === "planned").length;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 rounded-full bg-orange-500" />
          <span className="font-mono text-xs text-orange-500 uppercase tracking-widest">Project Roadmap</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">QVault Development Roadmap</h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          QVault began development in mid-2025 as an open-source response to the HNDL threat and CNSA 2.0 mandate.
          This roadmap reflects the phased build-out from initial platform to enterprise-scale deployment.
          All items are tracked as open GitHub issues on the public repository.
        </p>
        <div className="flex items-center gap-4 mt-3">
          <a
            href="https://github.com/saisravan909/Quantum-Audit-for-Cryptographic-Modernization/issues"
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs mono text-orange-400 hover:text-orange-300 transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            View on GitHub Issues
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-green-500/30 bg-card p-4 text-center">
          <div className="text-3xl font-bold font-mono text-green-400 mb-1">{shippedCount}</div>
          <div className="text-muted-foreground text-xs font-mono uppercase tracking-widest">Shipped</div>
        </div>
        <div className="rounded-lg border border-orange-500/30 bg-card p-4 text-center">
          <div className="text-3xl font-bold font-mono text-orange-400 mb-1">{inProgressCount}</div>
          <div className="text-muted-foreground text-xs font-mono uppercase tracking-widest">In Progress</div>
        </div>
        <div className="rounded-lg border border-slate-500/30 bg-card p-4 text-center">
          <div className="text-3xl font-bold font-mono text-slate-400 mb-1">{plannedCount}</div>
          <div className="text-muted-foreground text-xs font-mono uppercase tracking-widest">Planned</div>
        </div>
      </div>

      {/* Timeline visual */}
      <div className="rounded-xl border border-border bg-card p-6 overflow-x-auto">
        <div className="mono text-[9px] text-muted-foreground/50 uppercase tracking-widest mb-5">Project Timeline — Started June 2025</div>
        <div className="flex items-start gap-0 min-w-[600px]">
          {PHASES.map((ph, i) => {
            const phItems = ITEMS.filter(it => it.phase === ph.number);
            const allShipped = phItems.every(it => it.status === "shipped");
            const someActive = phItems.some(it => it.status === "in-progress");
            return (
              <div key={ph.number} className="flex-1 flex flex-col items-center">
                {/* Connector line */}
                <div className="flex items-center w-full mb-3">
                  <div className="flex-1 h-px" style={{ background: i === 0 ? ph.color : `linear-gradient(90deg, ${PHASES[i-1].color}, ${ph.color})`, opacity: allShipped || someActive ? 1 : 0.3 }} />
                  <div
                    className="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center text-[9px] font-bold"
                    style={{
                      borderColor: ph.color,
                      background: allShipped ? ph.color : someActive ? ph.color + "44" : "transparent",
                      color: allShipped ? "#000" : ph.color,
                    }}
                  >
                    {ph.number}
                  </div>
                  {i < PHASES.length - 1 && <div className="flex-1 h-px" style={{ background: ph.color, opacity: allShipped ? 1 : 0.2 }} />}
                </div>
                {/* Label */}
                <div className="text-center px-1">
                  <div className="text-[10px] font-bold mono" style={{ color: ph.color }}>{ph.name}</div>
                  <div className="text-[9px] text-muted-foreground/50 mono">{ph.quarter}</div>
                  <div className="mt-1 mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                    style={{ color: allShipped ? "#00cc88" : someActive ? "#ff8800" : "#666", background: allShipped ? "#00cc8818" : someActive ? "#ff880018" : "#33333318" }}>
                    {allShipped ? "done" : someActive ? "active" : "upcoming"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-muted-foreground mono uppercase tracking-widest mr-1">Filter:</span>
        {(["all", "shipped", "in-progress", "planned"] as const).map(f => {
          const labels = { all: "All", shipped: "Shipped", "in-progress": "In Progress", planned: "Planned" };
          const colors: Record<string, string> = { all: "border-orange-500 text-orange-400", shipped: "border-green-500 text-green-400", "in-progress": "border-orange-500 text-orange-400", planned: "border-slate-500 text-slate-400" };
          return (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded border text-xs mono uppercase tracking-wider transition-all ${filter === f ? colors[f] + " bg-white/5" : "border-border text-muted-foreground hover:border-orange-500/40"}`}>
              {labels[f]}
            </button>
          );
        })}
      </div>

      {/* Phase groups */}
      {PHASES.map(ph => {
        const phItems = filtered.filter(it => it.phase === ph.number);
        if (phItems.length === 0) return null;
        const isExpanded = expandedPhase === ph.number || expandedPhase === null;
        return (
          <div key={ph.number} className="space-y-3">
            {/* Phase header */}
            <button
              onClick={() => setExpandedPhase(expandedPhase === ph.number ? null : ph.number)}
              className="w-full flex items-center gap-4 text-left group"
            >
              <div className="w-7 h-7 rounded-full border-2 shrink-0 flex items-center justify-center font-bold text-xs"
                style={{ borderColor: ph.color, color: ph.color }}>
                {ph.number}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-bold text-sm" style={{ color: ph.color }}>Phase {ph.number}: {ph.name}</span>
                  <span className="mono text-xs text-muted-foreground/60">{ph.quarter}</span>
                </div>
                <div className="text-muted-foreground text-xs leading-relaxed mt-0.5">{ph.summary}</div>
              </div>
              <ChevronRight className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
            </button>

            {/* Items */}
            {isExpanded && (
              <div className="ml-11 space-y-2">
                {phItems.map(item => {
                  const cfg = STATUS_CONFIG[item.status];
                  const Icon = cfg.icon;
                  const labelColor = LABEL_COLORS[item.label] || "#888";
                  return (
                    <div key={item.id} className={`rounded-lg border p-4 transition-all hover:border-opacity-60 ${cfg.bg}`}>
                      <div className="flex items-start gap-3">
                        <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${cfg.color}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-foreground text-sm font-medium">{item.title}</span>
                            {item.githubIssue && (
                              <a
                                href={`https://github.com/saisravan909/Quantum-Audit-for-Cryptographic-Modernization/issues/${item.githubIssue}`}
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                                onClick={e => e.stopPropagation()}
                              >
                                <Github className="w-3 h-3" />
                                <span className="mono text-[9px]">#{item.githubIssue}</span>
                              </a>
                            )}
                          </div>
                          <p className="text-muted-foreground text-xs leading-relaxed mb-2">{item.description}</p>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="mono text-[9px] text-muted-foreground/50 uppercase tracking-widest">{item.quarter}</span>
                            <span className="mono text-[9px] px-2 py-0.5 rounded border"
                              style={{ color: labelColor, borderColor: labelColor + "44", background: labelColor + "18" }}>
                              {item.label}
                            </span>
                            <span className={`mono text-[9px] px-2 py-0.5 rounded border ${cfg.bg} ${cfg.color}`}>
                              {cfg.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Contributing */}
      <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-6">
        <div className="mono text-orange-400/70 text-xs uppercase tracking-widest mb-2">Open Source</div>
        <h3 className="text-foreground font-semibold mb-2">Contributions Welcome</h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          QVault is MIT-licensed and open to contributions. If you are working in federal security, critical infrastructure,
          or post-quantum cryptography research, your input on the roadmap and implementation is valued.
          Open an issue or submit a pull request on GitHub.
        </p>
        <a
          href="https://github.com/saisravan909/Quantum-Audit-for-Cryptographic-Modernization"
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded border border-orange-500/40 text-orange-300 text-xs mono uppercase tracking-wider hover:bg-orange-500/10 transition-colors"
        >
          <Github className="w-3.5 h-3.5" />
          github.com/saisravan909
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
