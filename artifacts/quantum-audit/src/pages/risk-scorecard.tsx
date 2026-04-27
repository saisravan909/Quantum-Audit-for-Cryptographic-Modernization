import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListNodes } from "@workspace/api-client-react";
import { Shield, AlertTriangle, TrendingUp, X, Target, Zap, CheckCircle } from "lucide-react";

const QUADRANT_DEFS = [
  { id: "act-now", x: "right", y: "top", label: "Act Now", color: "#ef4444", bg: "#ef444408", desc: "High exposure, hard to fix. These need an emergency response plan." },
  { id: "quick-wins", x: "left", y: "top", label: "Quick Wins", color: "#f97316", bg: "#f9731608", desc: "High exposure but straightforward to fix. Start here for maximum risk reduction." },
  { id: "plan-carefully", x: "right", y: "bottom", label: "Plan Carefully", color: "#eab308", bg: "#eab30808", desc: "Low current exposure but complex migration. Schedule and resource properly." },
  { id: "monitor", x: "left", y: "bottom", label: "Monitor", color: "#22c55e", bg: "#22c55e08", desc: "Low exposure and low effort. Address as part of regular maintenance cycle." },
];

const STATIC_SCORES = [
  { id: 1, hostname: "fed-node-alpha", x: 0.72, y: 0.78, riskScore: 87, effort: 0.72, exposure: 0.78, algo: "RSA-2048", env: "FEDERAL", status: "critical", reason: "RSA-2048 on classified segment. HNDL sessions detected. No PQC migration scheduled.", action: "Emergency PQC deployment required. Escalate to CISO." },
  { id: 2, hostname: "prod-db-primary", x: 0.38, y: 0.85, riskScore: 82, effort: 0.38, exposure: 0.85, algo: "RSA-2048", env: "PROD", status: "critical", reason: "Highest traffic volume of any node. RSA-2048 key encapsulation on all sessions.", action: "Quick win: standard ML-KEM-768 library swap. Prioritize immediately." },
  { id: 3, hostname: "fed-node-bravo", x: 0.65, y: 0.70, riskScore: 76, effort: 0.65, exposure: 0.70, algo: "ECDH P-256", env: "FEDERAL", status: "high", reason: "ECC P-256 has same quantum vulnerability as RSA. Federal classification increases impact.", action: "Coordinate with ISSO for federated migration plan." },
  { id: 4, hostname: "prod-auth-svc", x: 0.28, y: 0.75, riskScore: 71, effort: 0.28, exposure: 0.75, algo: "RSA-2048", env: "PROD", status: "high", reason: "Authentication service. Compromise enables full session hijacking across the estate.", action: "Replace RSA cert with ML-DSA-65. Update client libraries." },
  { id: 5, hostname: "prod-api-gateway", x: 0.55, y: 0.58, riskScore: 64, effort: 0.55, exposure: 0.58, algo: "ECDH P-384", env: "PROD", status: "high", reason: "Gateway handles all inbound traffic. ECDH P-384 not in CNSA 2.0 approved algorithms.", action: "Stage ML-KEM migration in next maintenance window." },
  { id: 6, hostname: "stg-worker-01", x: 0.32, y: 0.55, riskScore: 55, effort: 0.32, exposure: 0.55, algo: "RSA-2048", env: "STAGING", status: "medium", reason: "Staging environment but mirrors production config. Serves as migration test bed.", action: "Use as PQC pilot. Deploy ML-KEM here first before production rollout." },
  { id: 7, hostname: "prod-search-node", x: 0.48, y: 0.40, riskScore: 44, effort: 0.48, exposure: 0.40, algo: "ML-KEM-768", env: "PROD", status: "compliant", reason: "Fully migrated to ML-KEM-768. Monitoring confirms 100% PQC negotiation.", action: "Maintain. Add to CNSA 2.0 compliance evidence package." },
  { id: 8, hostname: "stg-web-01", x: 0.22, y: 0.32, riskScore: 28, effort: 0.22, exposure: 0.32, algo: "ML-KEM-768", env: "STAGING", status: "compliant", reason: "Low-traffic staging node, fully PQC-migrated. Minimal HNDL exposure.", action: "No action required. Use as reference implementation for other nodes." },
  { id: 9, hostname: "dev-sandbox-01", x: 0.15, y: 0.18, riskScore: 18, effort: 0.15, exposure: 0.18, algo: "AES-256-GCM", env: "DEV", status: "low", reason: "Development sandbox with no production data. AES-256 symmetric only, no key exchange risk.", action: "Schedule PQC library update during next sprint cycle." },
  { id: 10, hostname: "mgmt-bastion", x: 0.42, y: 0.22, riskScore: 22, effort: 0.42, exposure: 0.22, algo: "ECDH P-256", env: "MGMT", status: "low", reason: "Management plane, access-controlled, low traffic volume, minimal sensitive data.", action: "Include in Q3 migration batch. Low priority but don't skip." },
];

const STATUS_DOT: Record<string, { fill: string; stroke: string; size: number }> = {
  critical: { fill: "#ef4444", stroke: "#ef4444", size: 14 },
  high: { fill: "#f97316", stroke: "#f97316", size: 12 },
  medium: { fill: "#eab308", stroke: "#eab308", size: 11 },
  low: { fill: "#22c55e", stroke: "#22c55e", size: 10 },
  compliant: { fill: "#22d3ee", stroke: "#22d3ee", size: 10 },
};

export default function RiskScorecard() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<typeof STATIC_SCORES[0] | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filtered = filterStatus ? STATIC_SCORES.filter(n => n.status === filterStatus) : STATIC_SCORES;
  const avgRisk = Math.round(STATIC_SCORES.reduce((s, n) => s + n.riskScore, 0) / STATIC_SCORES.length);
  const criticalCount = STATIC_SCORES.filter(n => n.status === "critical" || n.status === "high").length;
  const compliantCount = STATIC_SCORES.filter(n => n.status === "compliant").length;

  const svgW = 560;
  const svgH = 400;
  const padLeft = 40;
  const padBottom = 32;
  const plotW = svgW - padLeft - 16;
  const plotH = svgH - padBottom - 16;

  return (
    <div className="min-h-full bg-background p-4 md:p-6 pb-16">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="font-mono text-xs text-orange-500 uppercase tracking-widest mb-2 flex items-center gap-2">
          <Target className="w-3.5 h-3.5" /> Quantum Risk Scorecard
        </div>
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
          Every Node, Ranked by Risk
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed">
          Not every system needs fixing today. This map ranks your entire infrastructure by how exposed it is to quantum threats versus how difficult it is to fix, so you always work on the right problem first.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Portfolio Risk Score", value: avgRisk, max: 100, color: "#f97316", suffix: "/100" },
          { label: "Urgent Nodes", value: criticalCount, max: 10, color: "#ef4444", suffix: " nodes" },
          { label: "PQC Compliant", value: compliantCount, max: 10, color: "#22d3ee", suffix: " nodes" },
          { label: "CNSA 2.0 Ready", value: `${Math.round(compliantCount / STATIC_SCORES.length * 100)}%`, max: 100, color: "#22c55e", suffix: "" },
        ].map(stat => (
          <div key={stat.label} className="rounded-lg border border-border bg-card p-4">
            <div className="text-xl md:text-2xl font-bold font-mono mb-1" style={{ color: stat.color }}>
              {stat.value}{stat.suffix}
            </div>
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setFilterStatus(null)}
          className={`px-3 py-1.5 rounded-full border text-xs font-mono uppercase tracking-wider transition-all ${!filterStatus ? "border-orange-500 text-orange-400 bg-orange-500/10" : "border-border text-muted-foreground"}`}
        >
          All Nodes
        </button>
        {[
          { id: "critical", label: "Critical", color: "#ef4444" },
          { id: "high", label: "High Risk", color: "#f97316" },
          { id: "medium", label: "Medium", color: "#eab308" },
          { id: "compliant", label: "Compliant", color: "#22d3ee" },
          { id: "low", label: "Low Risk", color: "#22c55e" },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilterStatus(filterStatus === f.id ? null : f.id)}
            className={`px-3 py-1.5 rounded-full border text-xs font-mono uppercase tracking-wider transition-all`}
            style={filterStatus === f.id ? { borderColor: f.color, color: f.color, background: f.color + "18" } : {}}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Risk Matrix */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-4 overflow-x-auto">
          <div className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-widest mb-3">
            Risk Matrix: Exposure vs Migration Effort. Click any node for details
          </div>
          <div className="relative" style={{ minWidth: `${svgW}px` }}>
            <svg width={svgW} height={svgH} className="overflow-visible">
              {/* Quadrant backgrounds */}
              <rect x={padLeft} y={16} width={plotW / 2} height={plotH / 2} fill="#f9731606" />
              <rect x={padLeft + plotW / 2} y={16} width={plotW / 2} height={plotH / 2} fill="#ef444408" />
              <rect x={padLeft} y={16 + plotH / 2} width={plotW / 2} height={plotH / 2} fill="#22c55e06" />
              <rect x={padLeft + plotW / 2} y={16 + plotH / 2} width={plotW / 2} height={plotH / 2} fill="#eab30806" />

              {/* Quadrant dividers */}
              <line x1={padLeft + plotW / 2} y1={16} x2={padLeft + plotW / 2} y2={16 + plotH} stroke="#ffffff10" strokeWidth="1" strokeDasharray="4 4" />
              <line x1={padLeft} y1={16 + plotH / 2} x2={padLeft + plotW} y2={16 + plotH / 2} stroke="#ffffff10" strokeWidth="1" strokeDasharray="4 4" />

              {/* Quadrant labels */}
              <text x={padLeft + plotW * 0.25} y={30} textAnchor="middle" fill="#f97316" fontSize="10" fontFamily="monospace" opacity="0.7">QUICK WINS</text>
              <text x={padLeft + plotW * 0.75} y={30} textAnchor="middle" fill="#ef4444" fontSize="10" fontFamily="monospace" opacity="0.7">ACT NOW</text>
              <text x={padLeft + plotW * 0.25} y={16 + plotH - 8} textAnchor="middle" fill="#22c55e" fontSize="10" fontFamily="monospace" opacity="0.7">MONITOR</text>
              <text x={padLeft + plotW * 0.75} y={16 + plotH - 8} textAnchor="middle" fill="#eab308" fontSize="10" fontFamily="monospace" opacity="0.7">PLAN CAREFULLY</text>

              {/* Axes */}
              <line x1={padLeft} y1={16} x2={padLeft} y2={16 + plotH} stroke="#ffffff20" strokeWidth="1" />
              <line x1={padLeft} y1={16 + plotH} x2={padLeft + plotW} y2={16 + plotH} stroke="#ffffff20" strokeWidth="1" />

              {/* Axis labels */}
              <text x={padLeft + plotW / 2} y={svgH - 4} textAnchor="middle" fill="#6b7280" fontSize="9" fontFamily="monospace">MIGRATION EFFORT →</text>
              <text x={10} y={16 + plotH / 2} textAnchor="middle" fill="#6b7280" fontSize="9" fontFamily="monospace" transform={`rotate(-90, 10, ${16 + plotH / 2})`}>HNDL EXPOSURE →</text>

              {/* Grid lines */}
              {[0.25, 0.5, 0.75].map(t => (
                <g key={t}>
                  <line x1={padLeft + t * plotW} y1={16} x2={padLeft + t * plotW} y2={16 + plotH} stroke="#ffffff06" strokeWidth="1" />
                  <line x1={padLeft} y1={16 + t * plotH} x2={padLeft + plotW} y2={16 + t * plotH} stroke="#ffffff06" strokeWidth="1" />
                </g>
              ))}

              {/* Nodes */}
              {STATIC_SCORES.map(node => {
                const dot = STATUS_DOT[node.status];
                const cx = padLeft + node.x * plotW;
                const cy = 16 + (1 - node.y) * plotH;
                const isFiltered = filterStatus && node.status !== filterStatus;
                const isHovered = hovered === node.id;
                const isSelected = selected?.id === node.id;

                return (
                  <g key={node.id}>
                    {isHovered && (
                      <motion.circle cx={cx} cy={cy} r={dot.size + 8} fill={dot.fill} opacity={0.15} initial={{ r: dot.size }} animate={{ r: dot.size + 10 }} transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }} />
                    )}
                    <motion.circle
                      cx={cx}
                      cy={cy}
                      r={dot.size / 2}
                      fill={dot.fill}
                      stroke={isSelected ? "#fff" : dot.stroke}
                      strokeWidth={isSelected ? 2 : 1}
                      opacity={isFiltered ? 0.15 : 1}
                      style={{ cursor: "pointer", filter: `drop-shadow(0 0 ${isHovered ? 8 : 4}px ${dot.fill})` }}
                      whileHover={{ r: dot.size / 2 + 3 }}
                      onMouseEnter={() => setHovered(node.id)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => setSelected(selected?.id === node.id ? null : node)}
                    />
                    {(isHovered || isSelected) && (
                      <text x={cx} y={cy - dot.size / 2 - 4} textAnchor="middle" fill="#fff" fontSize="8" fontFamily="monospace" opacity={0.8}>
                        {node.hostname.split("-").slice(0, 2).join("-")}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-3">
          {/* Legend */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-widest mb-3">Legend</div>
            <div className="space-y-2">
              {[
                { status: "critical", label: "Critical: Act Today", color: "#ef4444" },
                { status: "high", label: "High Risk: This Quarter", color: "#f97316" },
                { status: "medium", label: "Medium: This Year", color: "#eab308" },
                { status: "compliant", label: "Compliant: PQC-Ready", color: "#22d3ee" },
                { status: "low", label: "Low: Scheduled", color: "#22c55e" },
              ].map(l => (
                <div key={l.status} className="flex items-center gap-2.5 text-xs">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: l.color, boxShadow: `0 0 6px ${l.color}` }} />
                  <span className="text-muted-foreground">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected node detail */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="rounded-xl border bg-card overflow-hidden"
                style={{ borderColor: STATUS_DOT[selected.status].fill + "44" }}
              >
                <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: STATUS_DOT[selected.status].fill + "22", background: STATUS_DOT[selected.status].fill + "0d" }}>
                  <span className="font-bold text-sm text-foreground font-mono">{selected.hostname}</span>
                  <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div><div className="text-muted-foreground/50 mb-0.5">Risk Score</div><div className="font-bold" style={{ color: STATUS_DOT[selected.status].fill }}>{selected.riskScore}/100</div></div>
                    <div><div className="text-muted-foreground/50 mb-0.5">Algorithm</div><div className="text-foreground">{selected.algo}</div></div>
                    <div><div className="text-muted-foreground/50 mb-0.5">Environment</div><div className="text-foreground">{selected.env}</div></div>
                    <div><div className="text-muted-foreground/50 mb-0.5">Exposure</div><div style={{ color: STATUS_DOT[selected.status].fill }}>{Math.round(selected.exposure * 100)}%</div></div>
                  </div>
                  <div className="rounded border border-border bg-secondary/20 p-3">
                    <div className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-widest mb-1 flex items-center gap-1"><AlertTriangle className="w-2.5 h-2.5" /> Finding</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{selected.reason}</p>
                  </div>
                  <div className="rounded border border-cyan-500/20 bg-cyan-500/5 p-3">
                    <div className="font-mono text-[9px] text-cyan-400/50 uppercase tracking-widest mb-1 flex items-center gap-1"><CheckCircle className="w-2.5 h-2.5 text-cyan-400" /> Recommended Action</div>
                    <p className="text-xs text-cyan-100/70 leading-relaxed">{selected.action}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!selected && (
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Zap className="w-3 h-3" /> Highest Priority Nodes
              </div>
              <div className="space-y-2">
                {STATIC_SCORES.filter(n => n.status === "critical" || n.status === "high").slice(0, 5).map(n => (
                  <button
                    key={n.id}
                    onClick={() => setSelected(n)}
                    className="w-full flex items-center gap-2 text-xs py-1.5 hover:bg-secondary/30 rounded px-1 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: STATUS_DOT[n.status].fill }} />
                    <span className="font-mono text-foreground/80 truncate flex-1 text-left">{n.hostname}</span>
                    <span className="font-bold font-mono shrink-0" style={{ color: STATUS_DOT[n.status].fill }}>{n.riskScore}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
