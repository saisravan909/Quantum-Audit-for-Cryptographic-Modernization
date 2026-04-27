import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Clock, Zap, Shield, Database, Activity, ChevronDown } from "lucide-react";

const ALGORITHMS = [
  { id: "rsa2048", label: "RSA-2048", yearsLeft: 12, urgency: 0.85, status: "CRITICAL", detail: "Most widely deployed key exchange algorithm. Broken by Shor's algorithm in polynomial time on a CRQC estimated at 4000+ logical qubits." },
  { id: "aes128", label: "AES-128", yearsLeft: 22, urgency: 0.4, status: "MODERATE", detail: "Grover's algorithm provides quadratic speedup, effectively reducing AES-128 to AES-64 security. CNSA 2.0 requires AES-256 minimum." },
  { id: "ecc256", label: "ECC P-256", yearsLeft: 11, urgency: 0.9, status: "CRITICAL", detail: "Elliptic Curve Cryptography is fully broken by Shor's algorithm, same threat as RSA but with smaller key sizes, so potentially easier to attack." },
  { id: "ecc384", label: "ECC P-384", yearsLeft: 13, urgency: 0.8, status: "HIGH", detail: "P-384 provides marginally higher classical security than P-256, but quantum threat profile is essentially identical. Not in CNSA 2.0 approved list." },
  { id: "aes256", label: "AES-256", yearsLeft: 35, urgency: 0.1, status: "LOW", detail: "AES-256 with 256-bit keys retains ~128-bit security against Grover's algorithm. Approved in CNSA 2.0 for symmetric encryption of classified data." },
  { id: "mlkem768", label: "ML-KEM-768", yearsLeft: 9999, urgency: 0.0, status: "PROTECTED", detail: "NIST FIPS 203 standardized. Security based on Module Learning With Errors, no known quantum speedup. Fully compliant with CNSA 2.0 and NSM-10." },
];

const STATUS_STYLE: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  CRITICAL: { text: "#ef4444", bg: "#ef444415", border: "#ef444444", glow: "#ef444455" },
  HIGH: { text: "#f97316", bg: "#f9731615", border: "#f9731644", glow: "#f9731655" },
  MODERATE: { text: "#eab308", bg: "#eab30815", border: "#eab30844", glow: "#eab30855" },
  LOW: { text: "#22c55e", bg: "#22c55e15", border: "#22c55e44", glow: "#22c55e55" },
  PROTECTED: { text: "#22d3ee", bg: "#22d3ee15", border: "#22d3ee44", glow: "#22d3ee55" },
};

const HARVEST_EVENTS = [
  { time: "2026-04-27 03:14:22", node: "prod-db-primary", algo: "RSA-2048", bytes: "14.2 MB", threat: "APT-41" },
  { time: "2026-04-27 03:11:08", node: "fed-node-alpha", algo: "ECDH P-256", bytes: "8.7 MB", threat: "APT-29" },
  { time: "2026-04-27 02:58:44", node: "prod-api-gateway", algo: "RSA-2048", bytes: "31.1 MB", threat: "Unknown" },
  { time: "2026-04-27 02:44:19", node: "stg-worker-01", algo: "ECDH P-384", bytes: "5.3 MB", threat: "APT-41" },
  { time: "2026-04-27 02:31:05", node: "prod-auth-svc", algo: "RSA-2048", bytes: "9.8 MB", threat: "APT-29" },
  { time: "2026-04-27 02:17:50", node: "fed-node-bravo", algo: "ECDH P-256", bytes: "22.4 MB", threat: "Unknown" },
  { time: "2026-04-27 02:04:33", node: "prod-search-node", algo: "RSA-2048", bytes: "3.6 MB", threat: "APT-41" },
  { time: "2026-04-27 01:51:18", node: "prod-db-primary", algo: "ECDH P-256", bytes: "17.9 MB", threat: "APT-29" },
];

export default function ThreatClock() {
  const [selected, setSelected] = useState("rsa2048");
  const [elapsed, setElapsed] = useState(0);
  const [tickerIdx, setTickerIdx] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const algo = ALGORITHMS.find(a => a.id === selected)!;
  const style = STATUS_STYLE[algo.status];

  useEffect(() => {
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTickerIdx(i => (i + 1) % HARVEST_EVENTS.length), 4000);
    return () => clearInterval(id);
  }, []);

  const totalSeconds = algo.yearsLeft === 9999 ? 9999 * 365.25 * 86400 : algo.yearsLeft * 365.25 * 86400;
  const remaining = Math.max(0, totalSeconds - elapsed);
  const years = algo.yearsLeft === 9999 ? "∞" : Math.floor(remaining / (365.25 * 86400)).toString();
  const days = Math.floor((remaining % (365.25 * 86400)) / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const mins = Math.floor((remaining % 3600) / 60);
  const secs = Math.floor(remaining % 60);

  const arcRadius = 90;
  const arcCircumference = 2 * Math.PI * arcRadius;
  const arcDash = algo.status === "PROTECTED" ? 0 : arcCircumference * algo.urgency;

  return (
    <div className="min-h-full bg-background p-4 md:p-6 pb-16">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="font-mono text-xs text-red-500 uppercase tracking-widest mb-2 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5" /> HNDL Threat Clock
        </div>
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
          Your Data Has an Expiry Date
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed">
          Harvest Now, Decrypt Later (HNDL) is not a future threat. It is happening today. Adversaries are recording encrypted traffic to decrypt it once quantum computers exist. Select an algorithm to see how much time is left.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Clock */}
        <div className="space-y-4">
          {/* Algorithm selector */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(d => !d)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card hover:border-orange-500/40 transition-colors text-sm font-mono"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ background: style.text }} />
                <span className="text-foreground font-bold">{algo.label}</span>
                <span className="text-xs px-2 py-0.5 rounded border" style={{ color: style.text, borderColor: style.border, background: style.bg }}>
                  {algo.status}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showDropdown ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-border bg-card z-20 overflow-hidden shadow-2xl"
                >
                  {ALGORITHMS.map(a => {
                    const s = STATUS_STYLE[a.status];
                    return (
                      <button
                        key={a.id}
                        onClick={() => { setSelected(a.id); setElapsed(0); setShowDropdown(false); }}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors text-sm font-mono border-b border-border/50 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full" style={{ background: s.text }} />
                          <span className="text-foreground">{a.label}</span>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded border" style={{ color: s.text, borderColor: s.border, background: s.bg }}>
                          {a.status}
                        </span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Clock face */}
          <div className="rounded-xl border bg-card p-6 flex flex-col items-center" style={{ borderColor: style.border, boxShadow: `0 0 40px ${style.glow}` }}>
            <div className="relative w-56 h-56 flex items-center justify-center">
              {/* Animated ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r={arcRadius} fill="none" stroke="#ffffff08" strokeWidth="8" />
                {algo.status !== "PROTECTED" && (
                  <motion.circle
                    cx="100" cy="100" r={arcRadius}
                    fill="none"
                    stroke={style.text}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={arcCircumference}
                    strokeDashoffset={arcCircumference - arcDash}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ filter: `drop-shadow(0 0 8px ${style.text})` }}
                  />
                )}
                {algo.status === "PROTECTED" && (
                  <motion.circle
                    cx="100" cy="100" r={arcRadius}
                    fill="none"
                    stroke={style.text}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={arcCircumference}
                    strokeDashoffset={0}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{ filter: `drop-shadow(0 0 8px ${style.text})` }}
                  />
                )}
              </svg>

              <div className="text-center z-10">
                {algo.status === "PROTECTED" ? (
                  <>
                    <Shield className="w-10 h-10 mx-auto mb-2" style={{ color: style.text }} />
                    <div className="text-2xl font-bold" style={{ color: style.text }}>Quantum</div>
                    <div className="text-xl font-bold" style={{ color: style.text }}>Resistant</div>
                  </>
                ) : (
                  <>
                    <div className="text-4xl md:text-5xl font-bold font-mono leading-none" style={{ color: style.text, textShadow: `0 0 20px ${style.text}` }}>
                      {years}
                    </div>
                    <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-1">years remaining</div>
                  </>
                )}
              </div>
            </div>

            {algo.status !== "PROTECTED" && (
              <div className="flex gap-3 mt-4 font-mono text-sm">
                {[{ v: days, l: "D" }, { v: hours, l: "H" }, { v: mins, l: "M" }, { v: secs, l: "S" }].map(({ v, l }) => (
                  <div key={l} className="text-center">
                    <div className="text-lg font-bold" style={{ color: style.text }}>{String(v).padStart(2, "0")}</div>
                    <div className="text-[9px] text-muted-foreground">{l}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 text-center px-4">
              <div className="text-xs text-muted-foreground/60 leading-relaxed">{algo.detail}</div>
            </div>
          </div>

          {/* Urgency bar */}
          {algo.status !== "PROTECTED" && (
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-muted-foreground uppercase tracking-wider">HNDL Exposure Risk</span>
                <span style={{ color: style.text }}>{Math.round(algo.urgency * 100)}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${algo.urgency * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{ background: `linear-gradient(to right, ${style.text}88, ${style.text})`, boxShadow: `0 0 8px ${style.glow}` }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-mono mt-1 text-muted-foreground/40">
                <span>Protected</span>
                <span>Critical</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Live harvest feed + info */}
        <div className="space-y-4">
          {/* Algorithm comparison */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Activity className="w-3 h-3" /> All Algorithm Risk Levels
            </div>
            <div className="space-y-2">
              {ALGORITHMS.map(a => {
                const s = STATUS_STYLE[a.status];
                return (
                  <button
                    key={a.id}
                    onClick={() => { setSelected(a.id); setElapsed(0); }}
                    className="w-full flex items-center gap-3 group"
                  >
                    <div className="w-20 text-xs font-mono text-right shrink-0" style={{ color: selected === a.id ? s.text : "#6b7280" }}>
                      {a.label}
                    </div>
                    <div className="flex-1 h-4 bg-secondary rounded-full overflow-hidden relative">
                      <motion.div
                        className="h-full rounded-full"
                        animate={{ width: a.status === "PROTECTED" ? "0%" : `${a.urgency * 100}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        style={{ background: s.text, opacity: selected === a.id ? 1 : 0.4 }}
                      />
                    </div>
                    <div className="w-16 text-right">
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border" style={{ color: s.text, borderColor: s.border, background: s.bg }}>
                        {a.status === "PROTECTED" ? "SAFE" : a.status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Simulated harvest events ticker */}
          <div className="rounded-xl border border-red-500/20 bg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-red-500/20 bg-red-500/5 flex items-center gap-2">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-red-500"
              />
              <span className="text-xs font-mono text-red-400 uppercase tracking-widest">Simulated Harvest Events: Live Feed</span>
            </div>
            <div className="p-3 space-y-2">
              <AnimatePresence mode="popLayout">
                {HARVEST_EVENTS.slice(tickerIdx, tickerIdx + 4).concat(HARVEST_EVENTS.slice(0, Math.max(0, 4 - (HARVEST_EVENTS.length - tickerIdx)))).map((evt, i) => (
                  <motion.div
                    key={`${evt.time}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1 - i * 0.2, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-2 text-xs font-mono py-1.5 border-b border-border/30 last:border-0"
                  >
                    <span className="text-muted-foreground/40 shrink-0 text-[10px]">{evt.time.split(" ")[1]}</span>
                    <span className="text-red-400/80 shrink-0 w-2 h-2 rounded-full bg-red-500/60 inline-block" />
                    <span className="text-foreground/80 truncate">{evt.node}</span>
                    <span className="text-orange-400/60 shrink-0">{evt.algo}</span>
                    <span className="text-muted-foreground/40 ml-auto shrink-0">{evt.bytes}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              <p className="text-[10px] text-muted-foreground/40 text-center pt-1">These events represent simulated harvested sessions stored for future quantum decryption</p>
            </div>
          </div>

          {/* CTA card */}
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-cyan-400 text-sm mb-1">The Executive Summary</div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every day your infrastructure runs classical cryptography, adversaries record more sessions for future decryption. The window to act is closing.
                  <span className="text-cyan-300 font-medium"> QVault identifies exactly which systems need urgent migration, so you fix the right ones first.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
