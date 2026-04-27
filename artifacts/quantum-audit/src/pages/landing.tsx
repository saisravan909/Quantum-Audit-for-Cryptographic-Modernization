import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { QuantumKeyLogo } from "@/components/QuantumKeyLogo";
import { ChevronRight } from "lucide-react";

/* ────────────────────────────────────────────────────────────
   Shared styles injected once
──────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
  .orbitron { font-family: 'Orbitron', monospace; }
  .mono     { font-family: 'Share Tech Mono', monospace; }

  @keyframes gradient-x {
    0%,100% { background-position: 0% 50%; }
    50%     { background-position: 100% 50%; }
  }
  .gradient-text {
    background: linear-gradient(135deg, #ff8800, #ffcc44, #ff6600, #ffaa00);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradient-x 4s ease infinite;
  }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  .float { animation: float 5s ease-in-out infinite; }

  @keyframes scan-line { 0%{top:-2px} 100%{top:100%} }
  .scan-line {
    position:absolute; left:0; right:0; height:1px;
    background:linear-gradient(90deg,transparent,rgba(255,136,0,0.3),transparent);
    animation:scan-line 8s linear infinite; pointer-events:none;
  }
  .grid-bg {
    background-image:
      linear-gradient(rgba(255,136,0,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,136,0,0.03) 1px, transparent 1px);
    background-size: 56px 56px;
  }
  @keyframes fadeUp {
    from{opacity:0;transform:translateY(20px)}
    to{opacity:1;transform:translateY(0)}
  }
  .fade-up   { animation: fadeUp 0.9s ease forwards; }
  .fade-up-1 { animation-delay:0.1s; opacity:0; }
  .fade-up-2 { animation-delay:0.3s; opacity:0; }
  .fade-up-3 { animation-delay:0.5s; opacity:0; }
  .fade-up-4 { animation-delay:0.8s; opacity:0; }

  @keyframes avatar-glow {
    0%,100% { box-shadow: 0 0 30px rgba(255,136,0,0.25), 0 0 60px rgba(255,136,0,0.08); }
    50%     { box-shadow: 0 0 50px rgba(255,136,0,0.55), 0 0 100px rgba(255,136,0,0.18); }
  }
  .avatar-glow { animation: avatar-glow 3s ease-in-out infinite; }

  @keyframes pulse-ring {
    0%  { transform:scale(1); opacity:0.6; }
    100%{ transform:scale(1.6); opacity:0; }
  }
  .pulse-ring::before {
    content:''; position:absolute; inset:-8px; border-radius:50%;
    border:1px solid rgba(255,136,0,0.4);
    animation: pulse-ring 2.2s ease-out infinite;
  }

  /* flow arrow pulse */
  @keyframes flow-arrow { 0%,100%{opacity:0.4} 50%{opacity:1} }
  .flow-arrow { animation: flow-arrow 1.6s ease-in-out infinite; }

  /* node glow pulse */
  @keyframes node-glow {
    0%,100%{box-shadow:0 0 0 0 rgba(255,136,0,0)} 
    50%{box-shadow:0 0 16px 4px rgba(255,136,0,0.25)}
  }
  .node-glow { animation: node-glow 2.5s ease-in-out infinite; }
`;

/* ────────────────────────────────────────────────────────────
   Subtle star field
──────────────────────────────────────────────────────────── */
function StarField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    c.width = c.offsetWidth; c.height = c.offsetHeight;
    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      r: Math.random() * 0.9, t: Math.random() * Math.PI * 2,
    }));
    let af: number;
    function draw() {
      ctx.clearRect(0, 0, c.width, c.height);
      stars.forEach(s => {
        s.t += 0.006;
        const a = 0.2 + Math.sin(s.t) * 0.2;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,210,255,${a})`; ctx.fill();
      });
      af = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(af);
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }} />;
}

/* ────────────────────────────────────────────────────────────
   Animated counter
──────────────────────────────────────────────────────────── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = () => {
        start += Math.ceil(target / 55);
        if (start >= target) { setVal(target); return; }
        setVal(start); requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ────────────────────────────────────────────────────────────
   HNDL Attack Chain Diagram
──────────────────────────────────────────────────────────── */
function HndlDiagram() {
  const steps = [
    { icon: "🏛️", label: "Your Systems", sub: "RSA-2048 / ECC-256 encrypted traffic leaves your network every day", color: "#94a3b8" },
    { icon: "🕵️", label: "Adversary Harvests", sub: "Nation-state actors intercept and archive encrypted sessions at scale", color: "#f87171" },
    { icon: "🗄️", label: "Data Stored Cold", sub: "Archives sit in secure storage — unreadable today, waiting for tomorrow", color: "#fb923c" },
    { icon: "⚛️", label: "CRQC Arrives ~2031", sub: "A cryptographically-relevant quantum computer breaks RSA and ECC in hours", color: "#facc15" },
    { icon: "🔓", label: "Plaintext Revealed", sub: "Every archived session — years of classified data — becomes readable", color: "#f87171" },
  ];
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-8">
      <div className="mono text-red-400/80 text-xs uppercase tracking-widest mb-6 text-center">
        The HNDL Attack Chain — happening right now
      </div>
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-0">
        {steps.map((s, i) => (
          <div key={s.label} className="flex flex-col lg:flex-row items-center flex-1 min-w-0">
            {/* Node */}
            <div className="flex flex-col items-center text-center px-2 flex-1">
              <div className="node-glow w-14 h-14 rounded-full border-2 flex items-center justify-center text-2xl mb-3 shrink-0"
                style={{ borderColor: s.color + "60", background: s.color + "12" }}>
                {s.icon}
              </div>
              <div className="font-semibold text-sm mb-1" style={{ color: s.color }}>{s.label}</div>
              <div className="text-slate-400 text-xs leading-relaxed max-w-[140px]">{s.sub}</div>
            </div>
            {/* Arrow */}
            {i < steps.length - 1 && (
              <div className="flex lg:flex-col items-center my-3 lg:my-0 shrink-0">
                <div className="flow-arrow flex items-center">
                  <div className="w-8 lg:w-6 h-px lg:h-8 lg:w-px bg-gradient-to-r lg:bg-gradient-to-b from-red-500/60 to-orange-500/60" />
                  <svg width="10" height="10" className="hidden lg:block rotate-90 -mt-1" viewBox="0 0 10 10">
                    <path d="M0 0 L5 8 L10 0" fill="none" stroke="rgba(251,146,60,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <svg width="10" height="10" className="lg:hidden -ml-1" viewBox="0 0 10 10">
                    <path d="M0 0 L8 5 L0 10" fill="none" stroke="rgba(251,146,60,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-lg border border-orange-500/20 bg-orange-500/8 p-4 text-center">
        <p className="text-orange-200 text-sm leading-relaxed">
          <strong className="text-orange-300">The risk is retroactive.</strong> Data encrypted yesterday with RSA-2048 is already archived and waiting to be decrypted. Migration cannot wait for the quantum computer to arrive — it has to happen before.
        </p>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   QVault Pipeline Diagram
──────────────────────────────────────────────────────────── */
function PipelineDiagram() {
  const sources = ["SCADA / ICS", "TLS Endpoints", "Cloud APIs", "On-Prem Servers", "IoT / OT Devices"];
  const modules = [
    { icon: "🎯", label: "Command Center", color: "#ff8800", desc: "HNDL score, posture, risk" },
    { icon: "🖥️", label: "Node Inventory", color: "#ff6600", desc: "Per-asset cipher audit" },
    { icon: "📋", label: "CBOM Explorer", color: "#ff4400", desc: "NIST SP 800-235 output" },
    { icon: "🚨", label: "Zero Trust Alerts", color: "#cc3300", desc: "Real-time violations" },
    { icon: "📈", label: "Compliance Velocity", color: "#ff8800", desc: "CNSA 2.0 progress" },
    { icon: "📡", label: "Telemetry Feed", color: "#ffaa00", desc: "eBPF event stream" },
  ];
  return (
    <div className="rounded-xl border border-orange-500/20 bg-[#0b1120]/80 p-8">
      <div className="mono text-orange-400/80 text-xs uppercase tracking-widest mb-8 text-center">
        How QVault Works — The Data Pipeline
      </div>
      <div className="flex flex-col gap-6">
        {/* Layer 1: Sources */}
        <div>
          <div className="mono text-[10px] text-slate-500 uppercase tracking-widest mb-3 text-center">Your Infrastructure</div>
          <div className="flex flex-wrap justify-center gap-3">
            {sources.map(s => (
              <div key={s} className="px-3 py-2 rounded-lg border border-slate-600/40 bg-slate-800/50 text-slate-300 text-xs font-mono flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Arrow down */}
        <div className="flex flex-col items-center gap-1">
          <div className="flow-arrow w-px h-8 bg-gradient-to-b from-slate-500 to-orange-500" />
          <div className="mono text-[9px] text-slate-500 uppercase tracking-widest">Passive telemetry collection via eBPF + TLS inspection</div>
          <div className="flow-arrow w-px h-8 bg-gradient-to-b from-orange-500/60 to-orange-400/30" />
        </div>

        {/* Layer 2: Engine */}
        <div className="rounded-lg border-2 border-orange-500/40 bg-orange-500/8 p-5 text-center relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0b1120] px-4">
            <span className="mono text-[9px] text-orange-400/70 uppercase tracking-widest">QVault Analysis Engine</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs text-slate-300 mt-2">
            <div className="rounded bg-orange-500/10 border border-orange-500/20 px-3 py-2">
              <div className="text-orange-300 font-semibold mb-0.5">Algorithm Classifier</div>
              <div className="text-slate-400 text-[10px]">Identifies RSA, ECC, ML-KEM, ML-DSA per connection</div>
            </div>
            <div className="rounded bg-orange-500/10 border border-orange-500/20 px-3 py-2">
              <div className="text-orange-300 font-semibold mb-0.5">Compliance Scorer</div>
              <div className="text-slate-400 text-[10px]">Maps posture to CNSA 2.0, NIST 800-207, NSM-10</div>
            </div>
            <div className="rounded bg-orange-500/10 border border-orange-500/20 px-3 py-2">
              <div className="text-orange-300 font-semibold mb-0.5">CBOM Generator</div>
              <div className="text-slate-400 text-[10px]">Builds machine-readable crypto inventory per NIST SP 800-235</div>
            </div>
          </div>
        </div>

        {/* Arrow down */}
        <div className="flex flex-col items-center gap-1">
          <div className="flow-arrow w-px h-8 bg-gradient-to-b from-orange-400/30 to-orange-400" />
          <div className="mono text-[9px] text-slate-500 uppercase tracking-widest">Live enriched events and compliance signals</div>
          <div className="flow-arrow w-px h-8 bg-gradient-to-b from-orange-400 to-orange-300/60" />
        </div>

        {/* Layer 3: Modules */}
        <div>
          <div className="mono text-[10px] text-slate-500 uppercase tracking-widest mb-3 text-center">Dashboard Modules — Operator Visibility</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {modules.map(m => (
              <div key={m.label} className="rounded-lg border bg-[#0e1728]/80 p-4 hover:bg-orange-500/5 transition-colors"
                style={{ borderColor: m.color + "33" }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{m.icon}</span>
                  <span className="text-xs font-semibold" style={{ color: m.color }}>{m.label}</span>
                </div>
                <div className="text-slate-400 text-[11px] leading-relaxed">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   PQC Migration Journey Diagram
──────────────────────────────────────────────────────────── */
function MigrationJourneyDiagram() {
  const before = [
    { algo: "RSA-2048", use: "Key exchange", safe: false },
    { algo: "ECC P-256", use: "Digital signatures", safe: false },
    { algo: "SHA-256", use: "Hashing (safe)", safe: true },
    { algo: "AES-128", use: "Symmetric (partial)", safe: "partial" as const },
  ];
  const after = [
    { algo: "ML-KEM-1024", use: "Key encapsulation (FIPS 206)", safe: true },
    { algo: "ML-DSA-87", use: "Digital signatures (FIPS 205)", safe: true },
    { algo: "SHA-384", use: "Hashing", safe: true },
    { algo: "AES-256", use: "Symmetric encryption", safe: true },
  ];
  const phases = [
    { phase: "1", title: "Inventory", desc: "CBOM scan all systems", icon: "📋", color: "#94a3b8" },
    { phase: "2", title: "Prioritize", desc: "Score by HNDL exposure", icon: "🎯", color: "#fb923c" },
    { phase: "3", title: "Migrate", desc: "Deploy ML-KEM / ML-DSA", icon: "⚡", color: "#ff8800" },
    { phase: "4", title: "Verify", desc: "Telemetry confirms PQC", icon: "✅", color: "#4ade80" },
    { phase: "5", title: "Report", desc: "NSM-10 evidence package", icon: "📄", color: "#60a5fa" },
  ];
  return (
    <div className="rounded-xl border border-green-500/20 bg-[#071210]/60 p-8 space-y-8">
      <div className="mono text-green-400/70 text-xs uppercase tracking-widest text-center">
        The Migration Journey — Before and After
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Before */}
        <div className="rounded-lg border border-red-500/20 bg-red-950/20 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <div className="mono text-red-400 text-xs uppercase tracking-widest">Current State — Vulnerable</div>
          </div>
          <div className="space-y-2">
            {before.map(b => (
              <div key={b.algo} className="flex items-center justify-between px-3 py-2 rounded border border-slate-700/50 bg-slate-800/40">
                <div>
                  <div className="text-slate-200 text-sm font-mono font-semibold">{b.algo}</div>
                  <div className="text-slate-400 text-xs">{b.use}</div>
                </div>
                <span className={`mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${
                  b.safe === true ? "text-green-400 border-green-500/30 bg-green-500/10" :
                  b.safe === "partial" ? "text-yellow-400 border-yellow-500/30 bg-yellow-500/10" :
                  "text-red-400 border-red-500/30 bg-red-500/10"
                }`}>
                  {b.safe === true ? "safe" : b.safe === "partial" ? "partial" : "vulnerable"}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* After */}
        <div className="rounded-lg border border-green-500/20 bg-green-950/20 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <div className="mono text-green-400 text-xs uppercase tracking-widest">Target State — Quantum-Safe</div>
          </div>
          <div className="space-y-2">
            {after.map(a => (
              <div key={a.algo} className="flex items-center justify-between px-3 py-2 rounded border border-green-900/40 bg-green-950/30">
                <div>
                  <div className="text-green-200 text-sm font-mono font-semibold">{a.algo}</div>
                  <div className="text-green-400/60 text-xs">{a.use}</div>
                </div>
                <span className="mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border text-green-400 border-green-500/30 bg-green-500/10">
                  safe
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Migration phases */}
      <div>
        <div className="mono text-[10px] text-slate-500 uppercase tracking-widest mb-4 text-center">QVault Guides Every Phase</div>
        <div className="flex flex-col sm:flex-row gap-0">
          {phases.map((p, i) => (
            <div key={p.phase} className="flex sm:flex-col items-center sm:items-start flex-1">
              <div className="flex sm:flex-col items-center sm:items-start gap-2 sm:gap-1 flex-1 px-3 py-2 sm:py-0">
                <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-lg shrink-0"
                  style={{ borderColor: p.color + "60", background: p.color + "15" }}>
                  {p.icon}
                </div>
                <div>
                  <div className="text-xs font-bold" style={{ color: p.color }}>{p.phase}. {p.title}</div>
                  <div className="text-slate-400 text-[11px]">{p.desc}</div>
                </div>
              </div>
              {i < phases.length - 1 && (
                <div className="flow-arrow hidden sm:block shrink-0 mt-4">
                  <svg width="18" height="10" viewBox="0 0 18 10">
                    <path d="M0 5 L12 5 M8 1 L16 5 L8 9" fill="none" stroke="rgba(148,163,184,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Section wrapper
──────────────────────────────────────────────────────────── */
function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`relative py-24 px-6 md:px-16 lg:px-24 ${className}`}>
      {children}
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Section label + heading helper
──────────────────────────────────────────────────────────── */
function SectionHeader({ eyebrow, heading, sub }: { eyebrow: string; heading: React.ReactNode; sub?: string }) {
  return (
    <div className="text-center mb-14">
      <div className="mono text-orange-500/60 text-xs tracking-[0.4em] uppercase mb-3">{eyebrow}</div>
      <h2 className="orbitron font-black text-3xl md:text-4xl text-white mb-5 leading-tight">{heading}</h2>
      {sub && <p className="text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">{sub}</p>}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Benefit row
──────────────────────────────────────────────────────────── */
function BenefitRow({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="flex gap-5 items-start group p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:border-orange-500/25 hover:bg-orange-500/4 transition-all duration-300">
      <div className="shrink-0 w-11 h-11 rounded-full border border-orange-500/30 bg-orange-500/10 flex items-center justify-center text-xl">
        {icon}
      </div>
      <div>
        <h4 className="text-slate-100 font-semibold text-sm tracking-wide mb-1.5">{title}</h4>
        <p className="text-slate-400 text-sm leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Main landing page
──────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60);
    return () => clearInterval(id);
  }, []);
  const glow = 0.6 + Math.sin(tick * 0.1) * 0.35;

  const BG = "#080e1c";

  return (
    <div style={{ backgroundColor: BG, color: "#e2e8f0" }} className="min-h-screen overflow-x-hidden">
      <style>{STYLES}</style>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden grid-bg">
        <StarField />
        <div className="scan-line" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, rgba(255,136,0,${glow * 0.1}) 0%, transparent 65%)`, transition: "background 0.15s" }} />

        <div className="float relative z-10 mb-2">
          <QuantumKeyLogo width={200} height={120} className="sm:w-[300px] sm:h-[180px]" />
        </div>

        <div className="relative z-10 text-center fade-up fade-up-1 px-4">
          <div className="orbitron font-black text-5xl sm:text-6xl md:text-8xl gradient-text tracking-tight leading-none mb-2">QVault</div>
          <div className="orbitron text-xs sm:text-sm md:text-base tracking-[0.3em] sm:tracking-[0.5em] text-orange-400/70 uppercase mb-4 md:mb-6">PQC Command Center</div>
          <div className="mono text-[10px] sm:text-xs text-orange-500/40 tracking-[0.2em] sm:tracking-[0.3em] mb-8 md:mb-10">CNSA 2.0 · PQC · ZERO TRUST · ML-KEM-768 · ML-DSA-65</div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row gap-3 sm:gap-4 fade-up fade-up-2 mb-12 md:mb-16 px-6 w-full sm:w-auto">
          <button
            onClick={() => setLocation("/dashboard")}
            className="group px-6 sm:px-8 py-3 sm:py-3.5 rounded border border-orange-500 bg-orange-500/12 text-orange-200 orbitron text-xs sm:text-sm tracking-widest uppercase hover:bg-orange-500/25 transition-all duration-300 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">Launch Dashboard <ChevronRight className="w-4 h-4" /></span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
          <a
            href="https://github.com/saisravan909/Quantum-Audit-for-Cryptographic-Modernization"
            target="_blank" rel="noopener noreferrer"
            className="px-6 sm:px-8 py-3 sm:py-3.5 rounded border border-slate-600/50 text-slate-400 orbitron text-xs sm:text-sm tracking-widest uppercase hover:border-orange-500/40 hover:text-orange-300 transition-all duration-300 text-center"
          >
            GitHub Repository
          </a>
        </div>

        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-10 text-center fade-up fade-up-3">
          {[
            { label: "Cryptographic Assets", n: 10000, s: "+" },
            { label: "PQC Algorithms Tracked", n: 12 },
            { label: "Compliance Frameworks", n: 7 },
            { label: "Year of CNSA 2.0 Mandate", n: 2030 },
          ].map(({ label, n, s = "" }) => (
            <div key={label}>
              <div className="orbitron text-2xl font-black text-orange-400 mb-1">
                <Counter target={n} suffix={s} />
              </div>
              <div className="mono text-[10px] text-slate-500 uppercase tracking-widest leading-tight max-w-[100px] mx-auto">{label}</div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 fade-up fade-up-4">
          <span className="mono text-[9px] tracking-widest text-orange-500">SCROLL TO EXPLORE</span>
          <div className="w-px h-8 bg-gradient-to-b from-orange-500 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── THE STORY: THE PROBLEM ───────────────────────────── */}
      <Section style={{ backgroundColor: "#060b16" }} className="border-t border-orange-500/8">
        <div className="max-w-5xl mx-auto space-y-14">
          <SectionHeader
            eyebrow="Chapter 1 — The Threat"
            heading={<>The Quantum Clock<br /><span className="gradient-text">Is Already Ticking</span></>}
            sub="Nation-state adversaries are executing Harvest Now, Decrypt Later attacks today — silently archiving your encrypted traffic to decrypt it once quantum computers are powerful enough. Your RSA-2048 and ECC keys are already being collected."
          />
          <HndlDiagram />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: "⚛️", color: "#a78bfa", title: "CRQC Timeline: 2029 to 2033", body: "IBM, Google, and Microsoft all project fault-tolerant quantum computers capable of breaking RSA within this decade. CNSA 2.0 mandates full PQC adoption no later than 2030 for National Security Systems." },
              { icon: "🏛️", color: "#fb923c", title: "Regulatory Mandates Are Active", body: "NSM-10 requires annual cryptographic inventories. EO 14028 mandates Zero Trust and encrypted communications. CNSA 2.0 formally deprecates RSA, ECDSA, and ECDH. Non-compliance risks mission failure." },
              { icon: "📊", color: "#34d399", title: "Most Organizations Are Unprepared", body: "CISA estimates fewer than 20% of federal agencies have completed a cryptographic inventory. Without an inventory, there is no migration plan. Without a plan, there is no compliance." },
            ].map(c => (
              <div key={c.title} className="rounded-xl border bg-white/[0.02] p-6 hover:border-opacity-50 transition-all"
                style={{ borderColor: c.color + "30" }}>
                <div className="text-3xl mb-3">{c.icon}</div>
                <h3 className="font-semibold text-sm mb-2" style={{ color: c.color }}>{c.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── THE STORY: THE SOLUTION ──────────────────────────── */}
      <Section className="border-t border-orange-500/8 grid-bg">
        <div className="max-w-5xl mx-auto space-y-14">
          <SectionHeader
            eyebrow="Chapter 2 — The Solution"
            heading={<>QVault Gives You <span className="gradient-text">Complete Visibility</span></>}
            sub="QVault is a real-time, open-source cryptographic governance platform built for the organizations that operate National Security Systems, critical infrastructure, and regulated enterprise environments. It answers the question every CISO needs answered: where exactly are we exposed, and how fast are we fixing it?"
          />
          <PipelineDiagram />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              {[
                "Live cryptographic posture monitoring across your entire node estate",
                "Automatic CBOM generation aligned with NIST SP 800-235",
                "CNSA 2.0 compliance scoring with migration velocity tracking",
                "Zero Trust policy alerts with eBPF-level protocol visibility",
                "NSM-10 and EO 14028 migration timeline dashboards",
                "Real-time HNDL exposure risk quantification per segment",
              ].map(f => (
                <div key={f} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5" />
                  <span className="text-slate-300 text-sm leading-relaxed">{f}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Command Center", desc: "Unified threat and compliance overview", icon: "🎯", color: "#ff8800" },
                { label: "Node Inventory", desc: "Per-asset cryptographic posture scoring", icon: "🖥️", color: "#ff6600" },
                { label: "CBOM Explorer", desc: "Machine-readable crypto bill of materials", icon: "📋", color: "#ff4400" },
                { label: "Zero Trust Alerts", desc: "Real-time policy violation stream", icon: "🚨", color: "#cc3300" },
                { label: "Compliance Velocity", desc: "CNSA 2.0 migration progress tracker", icon: "📈", color: "#ff8800" },
                { label: "Telemetry Feed", desc: "eBPF and protocol-level event stream", icon: "📡", color: "#ffaa00" },
              ].map(m => (
                <div key={m.label} className="rounded-xl border p-5 hover:bg-white/[0.04] transition-all duration-300 cursor-default"
                  style={{ borderColor: m.color + "25", backgroundColor: m.color + "08" }}>
                  <div className="text-2xl mb-2">{m.icon}</div>
                  <div className="text-xs font-bold mb-1" style={{ color: m.color }}>{m.label}</div>
                  <div className="text-slate-500 text-xs leading-relaxed">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── THE STORY: THE JOURNEY ───────────────────────────── */}
      <Section style={{ backgroundColor: "#060b16" }} className="border-t border-orange-500/8">
        <div className="max-w-5xl mx-auto space-y-14">
          <SectionHeader
            eyebrow="Chapter 3 — The Migration"
            heading={<>From Vulnerable to <span className="gradient-text">Quantum-Safe</span></>}
            sub="Cryptographic modernization is not a one-time event — it is a structured journey. QVault guides your organization through every phase, from initial inventory to verified deployment and regulatory reporting."
          />
          <MigrationJourneyDiagram />
        </div>
      </Section>

      {/* ── WHO IT'S BUILT FOR ───────────────────────────────── */}
      <Section className="border-t border-orange-500/8 grid-bg">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            eyebrow="Chapter 4 — The Audience"
            heading={<>Built for Those Who <span className="gradient-text">Secure What Matters</span></>}
            sub="Every role in the PQC migration lifecycle has a specific job to do. QVault is designed so each person can do their job without waiting on someone else."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BenefitRow icon="🏛️" title="Federal CISOs and Mission Owners"
              body="Executive-level visibility into cryptographic risk, compliance gaps, and CNSA 2.0 migration velocity — ready for DepSecDef briefings and OMB reporting." />
            <BenefitRow icon="🔐" title="Cryptographers and Security Engineers"
              body="Deep per-algorithm telemetry, CBOM dependency views, and protocol-level events. Find deprecated cipher usage before it becomes an audit finding." />
            <BenefitRow icon="⚖️" title="Compliance and Risk Officers"
              body="Map your cryptographic estate to NIST 800-207, NSM-10, EO 14028, and CNSA 2.0. Generate evidence packages and track remediation progress toward deadlines." />
            <BenefitRow icon="⚡" title="Critical Infrastructure Operators"
              body="Protect power grids, water systems, financial rails, and telecom backbones. Monitor OT and IT cryptographic convergence without disrupting operations." />
            <BenefitRow icon="🎓" title="Researchers and Academic Institutions"
              body="An open, extensible PQC telemetry platform for studying real-world migration patterns, algorithm adoption rates, and Zero Trust implementation challenges." />
            <BenefitRow icon="🏢" title="Defense Contractors and System Integrators"
              body="Demonstrate CMMC, FedRAMP, and STIG cryptographic compliance to DoD primes. Accelerate ATO packages with automated cryptographic evidence generation." />
          </div>
        </div>
      </Section>

      {/* ── OPEN ARCHITECTURE ────────────────────────────────── */}
      <Section style={{ backgroundColor: "#060b16" }} className="border-t border-orange-500/8">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            eyebrow="Open Source"
            heading={<><span className="gradient-text">No Vendor Lock-In.</span> Ever.</>}
            sub="QVault is fully open source under MIT license. Inspect every line, fork it, extend it. The cryptographic trust crisis should not be solved by proprietary black boxes."
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { cat: "Frontend", color: "#60a5fa", items: ["React 18", "TypeScript", "Vite 5", "Recharts", "Tailwind CSS"] },
              { cat: "Backend", color: "#34d399", items: ["Node.js 20", "Express 5", "REST / OpenAPI", "Drizzle ORM", "Zod Validation"] },
              { cat: "Data Layer", color: "#fb923c", items: ["PostgreSQL 16", "Live telemetry polling", "CBOM schema", "Alert engine"] },
              { cat: "Standards", color: "#f472b6", items: ["CNSA 2.0", "NIST 800-207", "NSM-10", "EO 14028", "FIPS 205 / 206"] },
            ].map(({ cat, color, items }) => (
              <div key={cat} className="rounded-xl border bg-white/[0.02] p-5"
                style={{ borderColor: color + "25" }}>
                <div className="mono text-xs font-bold uppercase tracking-widest mb-4" style={{ color }}>{cat}</div>
                <ul className="space-y-2">
                  {items.map(i => (
                    <li key={i} className="text-slate-400 text-xs flex items-center gap-2">
                      <span style={{ color }} className="shrink-0">▸</span>
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <a
              href="https://github.com/saisravan909/Quantum-Audit-for-Cryptographic-Modernization"
              target="_blank" rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-3.5 rounded-lg border border-slate-600/40 bg-white/[0.03] text-slate-300 hover:border-orange-500/40 hover:text-orange-200 hover:bg-orange-500/8 transition-all duration-300 text-sm orbitron tracking-wider uppercase"
            >
              View Source on GitHub
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </Section>

      {/* ── INNOVATOR ────────────────────────────────────────── */}
      <Section className="border-t border-orange-900/30 grid-bg">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            eyebrow="The Innovator"
            heading={<>Built With Purpose by<br /><span className="gradient-text">Sai Sravan Cherukuri</span></>}
          />
          <div className="flex flex-col lg:flex-row gap-14 items-center">
            <div className="shrink-0 flex flex-col items-center gap-5">
              <div className="relative pulse-ring">
                <div className="avatar-glow w-48 h-48 rounded-full border-2 border-orange-500/50 overflow-hidden">
                  <img src="/sai-sravan.png" alt="Sai Sravan Cherukuri" className="w-full h-full object-cover object-top" />
                </div>
              </div>
              <div className="text-center">
                <div className="orbitron font-black text-xl text-orange-300 mb-1">Sai Sravan Cherukuri</div>
                <div className="mono text-orange-500/50 text-xs tracking-widest uppercase mb-4">Innovator and Open Source Contributor</div>
                <div className="flex gap-3 justify-center">
                  <a href="https://github.com/saisravan909" target="_blank" rel="noopener noreferrer"
                    className="px-4 py-1.5 rounded border border-slate-600/50 text-slate-400 mono text-xs hover:border-orange-400/60 hover:text-orange-300 transition-all">
                    GitHub
                  </a>
                  <a href="https://github.com/saisravan909/Quantum-Audit-for-Cryptographic-Modernization" target="_blank" rel="noopener noreferrer"
                    className="px-4 py-1.5 rounded border border-slate-600/50 text-slate-400 mono text-xs hover:border-orange-400/60 hover:text-orange-300 transition-all">
                    Repository
                  </a>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-5">
              <blockquote className="border-l-2 border-orange-500/50 pl-6">
                <p className="text-slate-200 text-xl leading-relaxed italic mb-3">
                  "Our critical infrastructure runs on cryptographic assumptions made in the 1970s and 80s.
                  Every organization that can see the problem clearly can start fixing it. QVault makes the invisible visible."
                </p>
                <cite className="text-orange-500/60 mono text-xs uppercase tracking-widest">Sai Sravan Cherukuri, Creator of QVault</cite>
              </blockquote>
              <p className="text-slate-400 leading-relaxed">
                Sai built QVault because he kept running into the same gap across organizations: security teams knew
                the quantum threat was real, but had no practical way to measure their actual exposure or track progress
                toward fixing it. Strategy documents were everywhere. Real-time operational visibility was not.
              </p>
              <p className="text-slate-400 leading-relaxed">
                With deep roots in post-quantum cryptography, Zero Trust architecture, and national security systems,
                Sai understood both the technical depth of the problem and the operational urgency it carries.
                The regulatory clock is running. NSM-10, CNSA 2.0, and EO 14028 have set timelines.
                Organizations without a live picture of their cryptographic estate are flying blind.
              </p>
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { label: "Focus", value: "Post-Quantum Crypto" },
                  { label: "Domain", value: "Zero Trust and NSS" },
                  { label: "License", value: "MIT / Free Forever" },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg border border-slate-700/40 bg-white/[0.02] p-3 text-center">
                    <div className="mono text-[9px] text-slate-500 uppercase tracking-widest mb-1">{label}</div>
                    <div className="text-orange-300 text-xs font-semibold">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <Section style={{ backgroundColor: "#060b16" }} className="border-t border-orange-500/8">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="mono text-orange-500/50 text-xs tracking-[0.4em] uppercase">The Question is Simple</div>
          <h2 className="orbitron font-black text-4xl md:text-5xl text-white leading-tight">
            Do You Know Where Your<br />
            <span className="gradient-text">Quantum Exposure Is?</span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Every day without a cryptographic inventory is another day of compounding HNDL risk.
            QVault gives you the visibility to answer that question in under 30 seconds — and a roadmap to fix it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setLocation("/dashboard")}
              className="group px-10 py-4 rounded-lg border border-orange-500 bg-orange-500/15 text-orange-200 orbitron text-sm tracking-widest uppercase hover:bg-orange-500/30 transition-all duration-300 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Enter Command Center <ChevronRight className="w-4 h-4" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
            <button
              onClick={() => setLocation("/demo")}
              className="px-10 py-4 rounded-lg border border-slate-600/40 text-slate-400 orbitron text-sm tracking-widest uppercase hover:border-orange-500/40 hover:text-orange-300 transition-all duration-300"
            >
              Watch the Demo
            </button>
          </div>
          <div className="mono text-[10px] text-slate-600 uppercase tracking-widest">Open source · MIT License · No vendor lock-in · Built for defense</div>
        </div>
      </Section>
    </div>
  );
}
