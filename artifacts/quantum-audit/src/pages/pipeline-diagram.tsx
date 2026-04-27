import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Radio, Filter, Cpu, Database, Shield, ChevronRight, X, Zap, Lock, Eye, GitBranch, AlertTriangle, CheckCircle } from "lucide-react";

const STAGES = [
  {
    id: "infra",
    icon: Server,
    color: "#6366f1",
    label: "Your Infrastructure",
    sublabel: "Linux Nodes & Services",
    plain: "Every server, database, and network device running in your environment — the systems that encrypt and transmit sensitive data every day.",
    technical: "Linux kernel 5.x+ endpoints running OpenSSL 3.x, nginx, Apache, PostgreSQL, and custom services. TLS 1.3 sessions initiated on every outbound connection.",
    mandate: "NSM-10 Inventory Requirement",
    mandateDesc: "Every cryptographic asset must be catalogued and tracked by asset type, owner, and algorithm.",
    stat: "10 nodes monitored",
    statColor: "#6366f1",
  },
  {
    id: "ebpf",
    icon: Eye,
    color: "#22d3ee",
    label: "Invisible Scanner",
    sublabel: "eBPF Kernel Probe",
    plain: "A microscopic security camera embedded directly into the operating system kernel. It watches every encryption negotiation — invisibly, in real time — without affecting performance.",
    technical: "eBPF-based probes attached to OpenSSL uprobe hooks capture TLS ClientHello/ServerHello frames, extracting key_share extensions (0x0033), supported_groups (0x000a), and cipher suite identifiers from raw hex.",
    mandate: "NIST SP 800-53 SC-12/SC-13",
    mandateDesc: "Agencies must establish and manage cryptographic keys for required cryptography for all data in transit.",
    stat: "< 1ms capture latency",
    statColor: "#22d3ee",
  },
  {
    id: "fluent",
    icon: Filter,
    color: "#f97316",
    label: "Data Collector",
    sublabel: "Fluent Bit Agent",
    plain: "A lightweight courier that picks up the security data from every node, filters out noise, formats it consistently, and ships it to the intelligence engine — all in real time.",
    technical: "Fluent Bit 3.x running as a DaemonSet, parsing JSON-structured OpenSSL audit logs. Applies enrichment filters to tag session IDs, extract cipher suites, and forward to Data Prepper via gRPC with mTLS.",
    mandate: "OMB M-23-02",
    mandateDesc: "Agencies must maintain continuous automated inventory of all cryptographic implementations across federal information systems.",
    stat: "~50MB/hr per node",
    statColor: "#f97316",
  },
  {
    id: "prepper",
    icon: Cpu,
    color: "#a855f7",
    label: "Intelligence Engine",
    sublabel: "OpenSearch Data Prepper",
    plain: "The brain of the pipeline. It receives raw cryptographic events, scores each one for quantum risk, flags violations, and routes critical findings to the alerting system.",
    technical: "Data Prepper pipeline applies ML-KEM detection rules, assigns HNDL risk scores using algorithm age × key size × session volume heuristics, and routes to OpenSearch indices partitioned by severity and date.",
    mandate: "CNSA 2.0 Algorithm Suite",
    mandateDesc: "NSS systems must negotiate ML-KEM-768 for key agreement and ML-DSA-65 for digital signatures by 2030.",
    stat: "Real-time scoring",
    statColor: "#a855f7",
  },
  {
    id: "opensearch",
    icon: Database,
    color: "#f59e0b",
    label: "Security Database",
    sublabel: "OpenSearch Cluster",
    plain: "A searchable, auditable record of every cryptographic event across your entire infrastructure. Stores months of history so you can prove compliance at any point in time.",
    technical: "OpenSearch 2.x cluster with Index State Management (ISM) policies, ML Commons risk-scoring plugin, and anomaly detection jobs. Indices follow ILM: hot (7d) → warm (30d) → cold (90d) → delete.",
    mandate: "EO 14028 Section 4",
    mandateDesc: "Federal agencies must maintain audit logs for all cryptographic operations in support of zero trust architecture adoption.",
    stat: "30-day indexed history",
    statColor: "#f59e0b",
  },
  {
    id: "qvault",
    icon: Shield,
    color: "#22c55e",
    label: "QVault Dashboard",
    sublabel: "You Are Here",
    plain: "The command center you are looking at right now. It transforms all that raw data into clear, actionable intelligence for every role — from the security engineer to the C-suite executive.",
    technical: "React + TypeScript SPA consuming OpenSearch REST APIs via Express proxy. Real-time telemetry via 5-second polling. CBOM generated from live index aggregations. Compliance scores computed against CNSA 2.0 milestones.",
    mandate: "NIST SP 800-207 Zero Trust",
    mandateDesc: "All access decisions must be informed by real-time resource posture and environmental context — including cryptographic negotiation health.",
    stat: "Live — updating every 5s",
    statColor: "#22c55e",
  },
];

const CONNECTORS = [
  { label: "Kernel Hooks", desc: "eBPF uprobes intercept OpenSSL calls at the syscall boundary" },
  { label: "Structured Logs", desc: "JSON-formatted TLS handshake events streamed over gRPC" },
  { label: "Enriched Events", desc: "Tagged, scored, and routed cryptographic intelligence" },
  { label: "Indexed Records", desc: "Persistent, searchable compliance evidence at scale" },
  { label: "REST + WebSocket", desc: "Live queries and alert streams delivered to the UI" },
];

export default function PipelineDiagram() {
  const [selected, setSelected] = useState<string | null>(null);
  const [pulseActive, setPulseActive] = useState(true);
  const selectedStage = STAGES.find(s => s.id === selected);

  useEffect(() => {
    const id = setInterval(() => setPulseActive(p => !p), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-full bg-background p-4 md:p-6 pb-16">
      <style>{`
        @keyframes flowDot {
          0% { left: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes flowDot2 {
          0% { left: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        .flow-dot { animation: flowDot 2s linear infinite; }
        .flow-dot-delayed { animation: flowDot 2s linear infinite 1s; }
        .flow-dot-delayed2 { animation: flowDot 2s linear infinite 0.5s; }
        @keyframes gridLine {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.08; }
        }
        .grid-pulse { animation: gridLine 4s ease-in-out infinite; }
      `}</style>

      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="grid-pulse absolute top-0 bottom-0 border-l border-cyan-400" style={{ left: `${(i + 1) * 8.33}%`, animationDelay: `${i * 0.3}s` }} />
        ))}
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="font-mono text-xs text-cyan-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5" /> Data Pipeline Architecture
          </div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
            From Raw Event to Actionable Alert
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed">
            This is how QVault watches your infrastructure in real time. Tap any stage to understand what it does and why it matters.
          </p>
        </div>

        {/* Pipeline stages — desktop horizontal, mobile vertical */}
        <div className="hidden md:flex items-center gap-0 mb-8 overflow-x-auto pb-4">
          {STAGES.map((stage, i) => (
            <div key={stage.id} className="flex items-center shrink-0">
              <StageCard stage={stage} selected={selected === stage.id} onClick={() => setSelected(selected === stage.id ? null : stage.id)} />
              {i < STAGES.length - 1 && (
                <ConnectorDesktop connector={CONNECTORS[i]} fromColor={stage.color} toColor={STAGES[i + 1].color} />
              )}
            </div>
          ))}
        </div>

        {/* Mobile vertical layout */}
        <div className="md:hidden flex flex-col gap-0 mb-8">
          {STAGES.map((stage, i) => (
            <div key={stage.id} className="flex flex-col items-center">
              <StageCardMobile stage={stage} selected={selected === stage.id} onClick={() => setSelected(selected === stage.id ? null : stage.id)} />
              {i < STAGES.length - 1 && (
                <ConnectorMobile connector={CONNECTORS[i]} fromColor={stage.color} toColor={STAGES[i + 1].color} />
              )}
            </div>
          ))}
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {selectedStage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl border bg-card overflow-hidden"
              style={{ borderColor: selectedStage.color + "44" }}
            >
              <div className="p-4 md:p-6 border-b flex items-start justify-between" style={{ borderColor: selectedStage.color + "33", background: selectedStage.color + "0d" }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ background: selectedStage.color + "20", border: `1px solid ${selectedStage.color}44` }}>
                    <selectedStage.icon className="w-6 h-6" style={{ color: selectedStage.color }} />
                  </div>
                  <div>
                    <div className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: selectedStage.color }}>Stage Detail</div>
                    <h2 className="text-xl font-bold text-foreground">{selectedStage.label}</h2>
                    <p className="text-muted-foreground text-sm">{selectedStage.sublabel}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="md:col-span-1">
                  <div className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Eye className="w-3 h-3" /> Plain English
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{selectedStage.plain}</p>
                  <div className="mt-4 px-3 py-2 rounded-lg border" style={{ borderColor: selectedStage.color + "44", background: selectedStage.color + "0d" }}>
                    <div className="text-xs font-mono" style={{ color: selectedStage.color }}>{selectedStage.stat}</div>
                  </div>
                </div>
                <div className="md:col-span-1">
                  <div className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Cpu className="w-3 h-3" /> Technical Detail
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-mono">{selectedStage.technical}</p>
                </div>
                <div className="md:col-span-1">
                  <div className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Lock className="w-3 h-3" /> Mandate Addressed
                  </div>
                  <div className="px-3 py-2 rounded border border-orange-500/30 bg-orange-500/5 mb-2">
                    <div className="text-orange-400 font-mono text-xs font-bold">{selectedStage.mandate}</div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{selectedStage.mandateDesc}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary stats at bottom */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "End-to-end latency", value: "< 3 seconds", desc: "From kernel event to dashboard alert", color: "#22d3ee" },
            { label: "Data loss tolerance", value: "Zero", desc: "Persistent queue ensures no event is dropped", color: "#22c55e" },
            { label: "Performance impact", value: "< 0.5%", desc: "eBPF adds negligible CPU overhead", color: "#f97316" },
            { label: "Compliance coverage", value: "5 mandates", desc: "NSM-10, CNSA 2.0, EO-14028, 800-53, 800-207", color: "#a855f7" },
          ].map(stat => (
            <div key={stat.label} className="rounded-lg border border-border bg-card p-4">
              <div className="text-lg md:text-2xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</div>
              <div className="text-xs text-muted-foreground/60">{stat.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StageCard({ stage, selected, onClick }: { stage: typeof STAGES[0]; selected: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="w-40 rounded-xl border bg-card p-4 text-left transition-all duration-300 cursor-pointer relative overflow-hidden"
      style={{
        borderColor: selected ? stage.color : stage.color + "33",
        boxShadow: selected ? `0 0 24px ${stage.color}44` : "none",
        background: selected ? stage.color + "12" : undefined,
      }}
    >
      {selected && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          animate={{ opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ background: `radial-gradient(circle, ${stage.color}30 0%, transparent 70%)` }}
        />
      )}
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: stage.color + "20", border: `1px solid ${stage.color}44` }}>
          <stage.icon className="w-5 h-5" style={{ color: stage.color }} />
        </div>
        <div className="font-bold text-foreground text-xs leading-tight mb-1">{stage.label}</div>
        <div className="text-muted-foreground text-[10px] leading-tight">{stage.sublabel}</div>
        {selected && (
          <div className="mt-2 font-mono text-[9px] uppercase tracking-widest" style={{ color: stage.color }}>
            Selected ↓
          </div>
        )}
      </div>
    </motion.button>
  );
}

function StageCardMobile({ stage, selected, onClick }: { stage: typeof STAGES[0]; selected: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full rounded-xl border bg-card p-4 text-left transition-all duration-300"
      style={{
        borderColor: selected ? stage.color : stage.color + "33",
        boxShadow: selected ? `0 0 20px ${stage.color}33` : "none",
        background: selected ? stage.color + "10" : undefined,
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: stage.color + "20", border: `1px solid ${stage.color}44` }}>
          <stage.icon className="w-5 h-5" style={{ color: stage.color }} />
        </div>
        <div className="flex-1">
          <div className="font-bold text-foreground text-sm">{stage.label}</div>
          <div className="text-muted-foreground text-xs">{stage.sublabel}</div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" style={{ color: selected ? stage.color : undefined, transform: selected ? "rotate(90deg)" : undefined }} />
      </div>
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 pt-3 border-t" style={{ borderColor: stage.color + "33" }}>
            <p className="text-sm text-foreground leading-relaxed">{stage.plain}</p>
            <div className="mt-2 font-mono text-xs" style={{ color: stage.color }}>{stage.mandate}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function ConnectorDesktop({ connector, fromColor, toColor }: { connector: typeof CONNECTORS[0]; fromColor: string; toColor: string }) {
  return (
    <div className="flex flex-col items-center w-16 shrink-0">
      <div className="text-[8px] font-mono text-muted-foreground/40 uppercase tracking-wider text-center mb-1 w-16 truncate">{connector.label}</div>
      <div className="relative w-16 h-6 flex items-center">
        <div className="absolute inset-y-0 left-0 right-0 flex items-center">
          <div className="w-full h-0.5 relative" style={{ background: `linear-gradient(to right, ${fromColor}66, ${toColor}66)` }}>
            <div className="flow-dot absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ background: toColor, boxShadow: `0 0 6px ${toColor}` }} />
            <div className="flow-dot-delayed absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ background: fromColor, boxShadow: `0 0 6px ${fromColor}` }} />
          </div>
        </div>
        <ChevronRight className="absolute right-0 w-3 h-3" style={{ color: toColor }} />
      </div>
    </div>
  );
}

function ConnectorMobile({ connector, fromColor, toColor }: { connector: typeof CONNECTORS[0]; fromColor: string; toColor: string }) {
  return (
    <div className="flex flex-col items-center w-12 py-1">
      <div className="relative h-8 w-0.5 flex items-center" style={{ background: `linear-gradient(to bottom, ${fromColor}66, ${toColor}66)` }}>
        <div className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ background: toColor, boxShadow: `0 0 6px ${toColor}`, top: "40%", animation: "flowDotVertical 2s linear infinite" }} />
      </div>
    </div>
  );
}
