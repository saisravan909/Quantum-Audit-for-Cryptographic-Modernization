import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { QuantumKeyLogo } from "@/components/QuantumKeyLogo";
import { ChevronRight, Building2, Eye, Archive, Cpu, Unlock, Target, Monitor, ClipboardList, Bell, TrendingUp, Radio, Zap, CheckCircle, FileText, BarChart3, Lock, Scale, BookOpen, Landmark } from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
    background: linear-gradient(135deg, #00b4d8, #48cae4, #0096c7, #90e0ef);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradient-x 4s ease infinite;
  }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  .float { animation: float 5s ease-in-out infinite; }

  .grid-bg {
    background-image:
      linear-gradient(rgba(0,180,216,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,180,216,0.05) 1px, transparent 1px);
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
    0%,100% { box-shadow: 0 0 30px rgba(0,180,216,0.25), 0 0 60px rgba(0,180,216,0.08); }
    50%     { box-shadow: 0 0 50px rgba(0,180,216,0.45), 0 0 100px rgba(0,180,216,0.16); }
  }
  .avatar-glow { animation: avatar-glow 3s ease-in-out infinite; }

  @keyframes pulse-ring {
    0%  { transform:scale(1); opacity:0.6; }
    100%{ transform:scale(1.6); opacity:0; }
  }
  .pulse-ring::before {
    content:''; position:absolute; inset:-8px; border-radius:50%;
    border:1px solid rgba(0,180,216,0.4);
    animation: pulse-ring 2.2s ease-out infinite;
  }

  @keyframes flow-arrow { 0%,100%{opacity:0.5} 50%{opacity:1} }
  .flow-arrow { animation: flow-arrow 1.6s ease-in-out infinite; }

  @keyframes node-glow {
    0%,100%{box-shadow:0 0 0 0 rgba(0,180,216,0)}
    50%{box-shadow:0 0 20px 6px rgba(0,180,216,0.25)}
  }
  .node-glow { animation: node-glow 2.5s ease-in-out infinite; }

  /* Card: clearly visible on the dark background */
  .landing-card {
    background: rgba(15, 30, 55, 0.85);
    border: 1px solid rgba(100, 140, 200, 0.35);
    border-radius: 12px;
    transition: all 0.25s ease;
  }
  .landing-card:hover {
    background: rgba(18, 36, 65, 0.95);
    border-color: rgba(0, 180, 216, 0.45);
  }
  .landing-card-accent-l {
    border-left-width: 3px;
  }
  .landing-card-accent-t {
    border-top-width: 2px;
  }
`;

/* ────────────────────────────────────────────────────────────
   Star field
──────────────────────────────────────────────────────────── */
function StarField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    c.width = c.offsetWidth; c.height = c.offsetHeight;
    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      r: Math.random() * 1.4 + 0.4, t: Math.random() * Math.PI * 2,
    }));
    let af: number;
    function draw() {
      ctx.clearRect(0, 0, c.width, c.height);
      stars.forEach(s => {
        s.t += 0.004;
        const a = 0.22 + Math.sin(s.t) * 0.14;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(72,202,228,${a})`; ctx.fill();
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
    { icon: Building2, label: "Your Systems", sub: "RSA-2048 / ECC-256 encrypted traffic leaves your network every day", color: "#94a3b8" },
    { icon: Eye, label: "Adversary Harvests", sub: "Nation-state actors intercept and archive encrypted sessions at scale", color: "#f87171" },
    { icon: Archive, label: "Data Stored Cold", sub: "Archives sit in secure storage, unreadable today and waiting for tomorrow", color: "#fb923c" },
    { icon: Cpu, label: "CRQC Arrives ~2031", sub: "A cryptographically-relevant quantum computer breaks RSA and ECC in hours", color: "#facc15" },
    { icon: Unlock, label: "Plaintext Revealed", sub: "Every archived session, years of classified data, becomes readable", color: "#f87171" },
  ];
  return (
    <div className="rounded-xl p-8" style={{ background: "rgba(120,20,20,0.20)", border: "1px solid rgba(248,113,113,0.30)" }}>
      <div className="mono text-red-300 text-sm uppercase tracking-widest mb-8 text-center font-semibold">
        The HNDL Attack Chain · Happening Right Now
      </div>
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-0">
        {steps.map((s, i) => (
          <div key={s.label} className="flex flex-col lg:flex-row items-center flex-1 min-w-0">
            <div className="flex flex-col items-center text-center px-2 flex-1">
              <div className="node-glow w-16 h-16 rounded-full border-2 flex items-center justify-center mb-4 shrink-0"
                style={{ borderColor: s.color + "80", background: s.color + "20" }}>
                <s.icon className="w-7 h-7" style={{ color: s.color }} />
              </div>
              <div className="font-bold text-base mb-2" style={{ color: s.color }}>{s.label}</div>
              <div className="text-slate-200 text-sm leading-relaxed max-w-[150px]">{s.sub}</div>
            </div>
            {i < steps.length - 1 && (
              <div className="flex lg:flex-col items-center my-4 lg:my-0 shrink-0">
                <div className="flow-arrow flex items-center">
                  <div className="w-10 lg:w-px h-px lg:h-10 bg-gradient-to-r lg:bg-gradient-to-b from-red-400/70 to-orange-400/70" />
                  <svg width="12" height="12" className="hidden lg:block rotate-90 -mt-1" viewBox="0 0 10 10">
                    <path d="M0 0 L5 8 L10 0" fill="none" stroke="rgba(251,146,60,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <svg width="12" height="12" className="lg:hidden -ml-1" viewBox="0 0 10 10">
                    <path d="M0 0 L8 5 L0 10" fill="none" stroke="rgba(251,146,60,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-lg p-5 text-center" style={{ background: "rgba(180,80,0,0.25)", border: "1px solid rgba(251,146,60,0.40)" }}>
        <p className="text-orange-100 text-base leading-relaxed">
          <strong className="text-orange-300 font-bold">The risk is retroactive.</strong> Data encrypted yesterday with RSA-2048 is already archived and waiting to be decrypted. Migration cannot wait for the quantum computer to arrive; it has to happen before.
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
    { icon: Target, label: "Command Center", color: "#ff8800", desc: "HNDL score, posture, risk" },
    { icon: Monitor, label: "Node Inventory", color: "#ff6600", desc: "Per-asset cipher audit" },
    { icon: ClipboardList, label: "CBOM Explorer", color: "#ff4400", desc: "NIST SP 800-235 output" },
    { icon: Bell, label: "Zero Trust Alerts", color: "#cc3300", desc: "Real-time violations" },
    { icon: TrendingUp, label: "Compliance Velocity", color: "#ff8800", desc: "CNSA 2.0 progress" },
    { icon: Radio, label: "Telemetry Feed", color: "#ffaa00", desc: "eBPF event stream" },
  ];
  return (
    <div className="rounded-xl p-8" style={{ background: "rgba(10, 25, 50, 0.80)", border: "1px solid rgba(100, 160, 220, 0.35)" }}>
      <div className="mono text-[#48cae4] text-sm uppercase tracking-widest mb-8 text-center font-semibold">
        How QVault Works: The Data Pipeline
      </div>
      <div className="flex flex-col gap-6">
        {/* Layer 1: Sources */}
        <div>
          <div className="mono text-xs text-slate-400 uppercase tracking-widest mb-4 text-center">Your Infrastructure</div>
          <div className="flex flex-wrap justify-center gap-3">
            {sources.map(s => (
              <div key={s} className="px-4 py-2.5 rounded-lg text-slate-100 text-sm font-mono flex items-center gap-2"
                style={{ background: "rgba(15,35,70,0.90)", border: "1px solid rgba(100,160,220,0.40)" }}>
                <div className="w-2 h-2 rounded-full bg-[#00b4d8] animate-pulse" />
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Arrow down */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flow-arrow w-px h-8 bg-gradient-to-b from-slate-600 to-[#00b4d8]" />
          <div className="mono text-xs text-slate-300 uppercase tracking-widest text-center">Passive telemetry collection via eBPF + TLS inspection</div>
          <div className="flow-arrow w-px h-8 bg-gradient-to-b from-[#00b4d8] to-[#00b4d8]/40" />
        </div>

        {/* Layer 2: Engine */}
        <div className="rounded-lg p-6 text-center relative" style={{ background: "rgba(0,100,150,0.20)", border: "2px solid rgba(0,180,216,0.45)" }}>
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4" style={{ background: "#080e1c" }}>
            <span className="mono text-xs text-[#00b4d8] uppercase tracking-widest font-semibold">QVault Analysis Engine</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            {[
              { title: "Algorithm Classifier", desc: "Identifies RSA, ECC, ML-KEM, ML-DSA per connection" },
              { title: "Compliance Scorer", desc: "Maps posture to CNSA 2.0, NIST 800-207, NSM-10" },
              { title: "CBOM Generator", desc: "Builds machine-readable crypto inventory per NIST SP 800-235" },
            ].map(e => (
              <div key={e.title} className="rounded-lg px-4 py-3" style={{ background: "rgba(15,40,80,0.85)", border: "1px solid rgba(100,160,220,0.40)" }}>
                <div className="text-[#48cae4] font-bold text-sm mb-1.5">{e.title}</div>
                <div className="text-slate-200 text-sm leading-relaxed">{e.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Arrow down */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flow-arrow w-px h-8 bg-gradient-to-b from-[#00b4d8]/50 to-[#00b4d8]" />
          <div className="mono text-xs text-slate-300 uppercase tracking-widest text-center">Live enriched events and compliance signals</div>
          <div className="flow-arrow w-px h-8 bg-gradient-to-b from-[#00b4d8] to-[#00b4d8]/40" />
        </div>

        {/* Layer 3: Modules */}
        <div>
          <div className="mono text-xs text-slate-400 uppercase tracking-widest mb-4 text-center">Dashboard Modules: Operator Visibility</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {modules.map(m => (
              <div key={m.label} className="rounded-lg p-4 transition-all landing-card landing-card-accent-l"
                style={{ borderLeftColor: m.color }}>
                <div className="flex items-center gap-2 mb-2">
                  <m.icon className="w-5 h-5 shrink-0" style={{ color: m.color }} />
                  <span className="text-sm font-bold text-white">{m.label}</span>
                </div>
                <div className="text-slate-200 text-sm leading-relaxed">{m.desc}</div>
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
    { phase: "1", title: "Inventory", desc: "CBOM scan all systems", icon: ClipboardList, color: "#94a3b8" },
    { phase: "2", title: "Prioritize", desc: "Score by HNDL exposure", icon: Target, color: "#fb923c" },
    { phase: "3", title: "Migrate", desc: "Deploy ML-KEM / ML-DSA", icon: Zap, color: "#ff8800" },
    { phase: "4", title: "Verify", desc: "Telemetry confirms PQC", icon: CheckCircle, color: "#4ade80" },
    { phase: "5", title: "Report", desc: "NSM-10 evidence package", icon: FileText, color: "#60a5fa" },
  ];
  return (
    <div className="rounded-xl p-8 space-y-8" style={{ background: "rgba(5, 30, 20, 0.75)", border: "1px solid rgba(74,222,128,0.25)" }}>
      <div className="mono text-green-300 text-sm uppercase tracking-widest text-center font-semibold">
        The Migration Journey: Before and After
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Before */}
        <div className="rounded-lg p-6" style={{ background: "rgba(100,10,10,0.35)", border: "1px solid rgba(248,113,113,0.35)" }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse" />
            <div className="mono text-red-300 text-sm uppercase tracking-widest font-semibold">Current State: Vulnerable</div>
          </div>
          <div className="space-y-3">
            {before.map(b => (
              <div key={b.algo} className="flex items-center justify-between px-4 py-3 rounded-lg"
                style={{ background: "rgba(20,10,10,0.60)", border: "1px solid rgba(100,60,60,0.50)" }}>
                <div>
                  <div className="text-white text-base font-mono font-bold">{b.algo}</div>
                  <div className="text-slate-300 text-sm mt-0.5">{b.use}</div>
                </div>
                <span className={`mono text-xs uppercase tracking-wider px-2.5 py-1 rounded border font-semibold ${
                  b.safe === true ? "text-green-300 border-green-500/40 bg-green-500/15" :
                  b.safe === "partial" ? "text-yellow-300 border-yellow-500/40 bg-yellow-500/15" :
                  "text-red-300 border-red-500/40 bg-red-500/15"
                }`}>
                  {b.safe === true ? "safe" : b.safe === "partial" ? "partial" : "vulnerable"}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* After */}
        <div className="rounded-lg p-6" style={{ background: "rgba(5,50,25,0.45)", border: "1px solid rgba(74,222,128,0.35)" }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
            <div className="mono text-green-300 text-sm uppercase tracking-widest font-semibold">Target State: Quantum-Safe</div>
          </div>
          <div className="space-y-3">
            {after.map(a => (
              <div key={a.algo} className="flex items-center justify-between px-4 py-3 rounded-lg"
                style={{ background: "rgba(5,30,15,0.60)", border: "1px solid rgba(40,100,60,0.50)" }}>
                <div>
                  <div className="text-green-100 text-base font-mono font-bold">{a.algo}</div>
                  <div className="text-green-300/80 text-sm mt-0.5">{a.use}</div>
                </div>
                <span className="mono text-xs uppercase tracking-wider px-2.5 py-1 rounded border text-green-300 border-green-500/40 bg-green-500/15 font-semibold">
                  safe
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Migration phases */}
      <div>
        <div className="mono text-sm text-slate-300 uppercase tracking-widest mb-5 text-center font-semibold">QVault Guides Every Phase</div>
        <div className="flex flex-col sm:flex-row gap-0">
          {phases.map((p, i) => (
            <div key={p.phase} className="flex sm:flex-col items-center sm:items-start flex-1">
              <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 flex-1 px-3 py-2 sm:py-0">
                <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0"
                  style={{ borderColor: p.color + "80", background: p.color + "20" }}>
                  <p.icon className="w-5 h-5" style={{ color: p.color }} />
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: p.color }}>{p.phase}. {p.title}</div>
                  <div className="text-slate-200 text-sm mt-0.5">{p.desc}</div>
                </div>
              </div>
              {i < phases.length - 1 && (
                <div className="flow-arrow hidden sm:block shrink-0 mt-5">
                  <svg width="20" height="12" viewBox="0 0 18 10">
                    <path d="M0 5 L12 5 M8 1 L16 5 L8 9" fill="none" stroke="rgba(148,163,184,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
function Section({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <section className={`relative py-24 px-6 md:px-16 lg:px-24 ${className}`} style={style}>
      {children}
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   Section label + heading helper
──────────────────────────────────────────────────────────── */
function SectionHeader({ eyebrow, heading, sub }: { eyebrow: string; heading: React.ReactNode; sub?: string }) {
  return (
    <div className="text-center mb-16">
      <div className="mono text-[#48cae4] text-sm tracking-[0.35em] uppercase mb-4 font-semibold">{eyebrow}</div>
      <h2 className="orbitron font-black text-4xl md:text-5xl text-white mb-6 leading-tight">{heading}</h2>
      {sub && <p className="text-slate-200 max-w-2xl mx-auto text-lg leading-relaxed">{sub}</p>}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Benefit row
──────────────────────────────────────────────────────────── */
function BenefitRow({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <div className="flex gap-5 items-start group p-6 rounded-xl landing-card hover:border-[#00b4d8]/50 transition-all duration-300">
      <div className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
        style={{ background: "rgba(0,180,216,0.18)", border: "1px solid rgba(0,180,216,0.40)" }}>
        <Icon className="w-6 h-6 text-[#48cae4]" />
      </div>
      <div>
        <h4 className="text-white font-bold text-base tracking-wide mb-2">{title}</h4>
        <p className="text-slate-200 text-base leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Innovation Showcase
──────────────────────────────────────────────────────────── */
function InnovationShowcase() {
  const innovations = [
    {
      number: "01",
      color: "#00b4d8",
      tag: "First of Its Kind",
      title: "The World's First Open-Source PQC Governance Dashboard",
      body: "Every major government and enterprise has a PQC problem. Nobody had an open tool to actually see it. QVault fills that gap -- a live, real-time window into cryptographic posture that any organization can deploy, inspect, extend, and trust.",
    },
    {
      number: "02",
      color: "#4ade80",
      tag: "Invisible by Design",
      title: "It Watches Without Touching Anything",
      body: "QVault uses eBPF -- the same kernel-level technology trusted by Netflix, Google, and Cloudflare -- to observe every cryptographic handshake on your network without installing agents, modifying code, or interrupting a single packet. It is the equivalent of reading every conversation in a building without opening a single door.",
    },
    {
      number: "03",
      color: "#fb923c",
      tag: "Quantified Risk",
      title: "It Turns an Abstract Threat Into a Real Number",
      body: "Most security tools tell you what is wrong. QVault tells you how exposed you are -- in bytes, in time, in probability. The HNDL Exposure Score is a live calculation of how much of your encrypted data is already harvested and waiting to be broken the moment a quantum computer arrives.",
    },
    {
      number: "04",
      color: "#c084fc",
      tag: "Unified Compliance",
      title: "Five Regulatory Frameworks. One Dashboard. Zero Confusion.",
      body: "CNSA 2.0, NSM-10, NIST 800-207, EO 14028, FIPS 205/206 -- each framework has different language, different timelines, different requirements. QVault maps your cryptographic estate to all five simultaneously and shows you exactly where you stand on each, with the evidence to prove it.",
    },
    {
      number: "05",
      color: "#f87171",
      tag: "Forward-Looking",
      title: "A Compliance Velocity Engine, Not a Snapshot",
      body: "Most compliance tools take a picture. QVault measures speed. The Compliance Velocity Engine tracks how fast you are migrating, projects whether you will hit regulatory deadlines, and surfaces the exact nodes slowing you down -- before an auditor finds them.",
    },
    {
      number: "06",
      color: "#34d399",
      tag: "The Ingredient Label for Security",
      title: "CBOM: A Crypto Bill of Materials for Every Asset",
      body: "Every piece of software you run contains cryptographic ingredients. Most organizations have no idea what those ingredients are. QVault automatically generates a CBOM -- a machine-readable inventory of every algorithm, key length, and cipher in use -- aligned with NIST SP 800-235. Think of it as a nutrition label for your cryptographic health.",
    },
  ];

  const formulas = [
    {
      color: "#00b4d8",
      label: "HNDL Exposure Score",
      formula: "E = Σ ( B\u209c × W\u209c × Q\u209c ) / V",
      vars: [
        { sym: "B\u209c", def: "Bytes transmitted over classical encryption per node" },
        { sym: "W\u209c", def: "Sensitivity weight of that data segment (1.0 to 5.0)" },
        { sym: "Q\u209c", def: "Quantum threat proximity factor (0 to 1, increasing toward 2031)" },
        { sym: "V", def: "Migration velocity -- how fast PQC is being deployed" },
      ],
      plain: "In plain English: the more sensitive data you have sent over breakable encryption, and the closer we get to a working quantum computer, the higher your score. The only way to bring it down is to migrate faster.",
    },
    {
      color: "#4ade80",
      label: "Migration Velocity",
      formula: "V = \u0394PQC\u2099\u2092\u2093\u2091\u209b / \u0394T \u00d7 C\u1d42",
      vars: [
        { sym: "\u0394PQC\u2099\u2092\u2093\u2091\u209b", def: "Change in PQC-enabled nodes over the measurement window" },
        { sym: "\u0394T", def: "Time window (days) of the measurement" },
        { sym: "C\u1d42", def: "Weighted compliance score across all active frameworks" },
      ],
      plain: "This tells you not just where you are today, but whether you are moving fast enough to reach the 2030 CNSA 2.0 mandate on time. A velocity of zero means you are standing still while the clock runs.",
    },
    {
      color: "#fb923c",
      label: "Why Quantum Breaks RSA: The Math in Plain Terms",
      formula: "RSA: N = p \u00d7 q \u2003\u2003 Classical: 10\u00b3\u2070\u2070 years \u2003\u2003 Shor's: hours",
      vars: [
        { sym: "N", def: "The public key -- a number so large it seems impossible to factor" },
        { sym: "p, q", def: "Two secret prime numbers whose product is N" },
        { sym: "Shor's Algorithm", def: "A quantum algorithm that finds p and q in polynomial time, collapsing RSA security to zero" },
      ],
      plain: "RSA security relies on a simple fact: multiplying two large primes is easy, but reversing the operation -- finding those primes from the result -- takes longer than the age of the universe on a classical computer. Shor's algorithm running on a quantum computer does it in hours. That is the entire threat model.",
    },
    {
      color: "#c084fc",
      label: "The New Math: Why ML-KEM Is Quantum-Safe",
      formula: "ML-KEM: b = A\u00b7s + e (mod q) \u2003 SVP remains hard even for quantum",
      vars: [
        { sym: "A", def: "A large random matrix (public parameter)" },
        { sym: "s", def: "The secret vector -- the private key" },
        { sym: "e", def: "A small error vector that hides s even when you know A and b" },
        { sym: "SVP", def: "Shortest Vector Problem -- finding s requires solving a lattice problem with no known quantum shortcut" },
      ],
      plain: "Instead of prime factoring, ML-KEM hides secrets inside a high-dimensional mathematical lattice -- a structure so complex that no quantum algorithm, not even Shor's, can solve it efficiently. This is the math at the heart of CNSA 2.0's replacement for RSA. QVault tracks adoption of exactly this algorithm across your infrastructure.",
    },
  ];

  return (
    <Section style={{ backgroundColor: "#060b16" }} className="border-t border-slate-700/50">
      <div className="max-w-5xl mx-auto space-y-20">

        {/* Header */}
        <SectionHeader
          eyebrow="Chapter 5: The Innovation"
          heading={<>What We Built and <span className="gradient-text">Why It Matters</span></>}
          sub="QVault is not a feature list. It is a set of original ideas applied to one of the most consequential security problems of our generation. Here is the thinking behind it -- the math, the engineering decisions, and the outcomes only this approach can deliver."
        />

        {/* 6 innovations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {innovations.map(inn => (
            <div key={inn.number} className="rounded-xl p-7 landing-card landing-card-accent-l transition-all group hover:border-opacity-80"
              style={{ borderLeftColor: inn.color }}>
              <div className="flex items-start gap-4 mb-4">
                <div className="orbitron font-black text-3xl shrink-0" style={{ color: inn.color + "40" }}>{inn.number}</div>
                <div>
                  <div className="mono text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: inn.color }}>{inn.tag}</div>
                  <h3 className="text-white font-bold text-lg leading-snug">{inn.title}</h3>
                </div>
              </div>
              <p className="text-slate-200 text-base leading-relaxed">{inn.body}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600/60 to-transparent" />
          <div className="mono text-sm text-[#48cae4] uppercase tracking-widest font-semibold whitespace-nowrap">The Mathematics</div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600/60 to-transparent" />
        </div>

        {/* Math intro */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-slate-200 text-lg leading-relaxed">
            QVault's scoring and alerting system is grounded in real cryptographic mathematics.
            No hand-waving. No magic scores. Every number in the dashboard traces back to a formula
            -- and every formula traces back to the standards. Here they are, explained in human terms.
          </p>
        </div>

        {/* Formulas */}
        <div className="space-y-8">
          {formulas.map(f => (
            <div key={f.label} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${f.color}35` }}>
              {/* Formula header */}
              <div className="px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-4" style={{ background: `${f.color}12` }}>
                <div className="flex-1">
                  <div className="mono text-xs uppercase tracking-widest mb-2 font-semibold" style={{ color: f.color }}>{f.label}</div>
                  <div className="orbitron font-bold text-xl md:text-2xl text-white tracking-wide">{f.formula}</div>
                </div>
              </div>
              {/* Variables */}
              <div className="px-8 py-6 space-y-4" style={{ background: "rgba(10, 20, 40, 0.85)" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {f.vars.map(v => (
                    <div key={v.sym} className="flex items-start gap-3">
                      <code className="orbitron text-sm font-bold shrink-0 mt-0.5 w-28 text-right" style={{ color: f.color }}>{v.sym}</code>
                      <span className="text-slate-300 text-sm leading-relaxed border-l border-slate-700 pl-3">{v.def}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-5 border-t border-slate-700/60">
                  <p className="text-slate-100 text-base leading-relaxed italic">"{f.plain}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* The "so what" executive callout */}
        <div className="rounded-2xl p-10 text-center" style={{ background: "linear-gradient(135deg, rgba(0,100,150,0.30), rgba(60,20,100,0.30))", border: "1px solid rgba(0,180,216,0.35)" }}>
          <div className="mono text-[#48cae4] text-sm uppercase tracking-widest font-semibold mb-6">The Bottom Line for Decision-Makers</div>
          <h3 className="orbitron font-black text-3xl md:text-4xl text-white mb-6 leading-tight">
            Every Day You Wait Is Another Day<br />
            <span className="gradient-text">of Harvested, Unprotected Data</span>
          </h3>
          <p className="text-slate-100 text-lg leading-relaxed max-w-3xl mx-auto mb-8">
            Nation-state adversaries are not waiting for 2031. They are collecting your encrypted traffic today --
            patient, systematic, and certain that quantum computers will eventually hand them the keys.
            The question QVault answers is not "are we at risk?" -- every organization with RSA or ECC is at risk.
            The question is: "exactly how much of our data is already waiting to be decrypted, and how fast are we fixing it?"
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              { num: "10", unit: "Minutes", label: "to run your first cryptographic inventory with QVault", color: "#00b4d8" },
              { num: "2030", unit: "Deadline", label: "CNSA 2.0 requires full PQC adoption for National Security Systems", color: "#fb923c" },
              { num: "0", unit: "Cost", label: "QVault is fully open source. No license. No vendor. No lock-in.", color: "#4ade80" },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-6 text-center" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)" }}>
                <div className="orbitron font-black text-4xl mb-1" style={{ color: s.color }}>{s.num}</div>
                <div className="mono text-sm font-bold uppercase tracking-widest mb-2" style={{ color: s.color }}>{s.unit}</div>
                <div className="text-slate-200 text-sm leading-relaxed">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Section>
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, rgba(0,180,216,${glow * 0.08}) 0%, transparent 65%)`, transition: "background 0.15s" }} />

        <div className="float relative z-10 mb-2">
          <QuantumKeyLogo width={200} height={120} className="sm:w-[300px] sm:h-[180px]" />
        </div>

        <div className="relative z-10 text-center fade-up fade-up-1 px-4">
          <div className="orbitron font-black text-5xl sm:text-6xl md:text-8xl gradient-text tracking-tight leading-none mb-3">QVault</div>
          <div className="orbitron text-sm sm:text-base md:text-xl tracking-[0.3em] sm:tracking-[0.4em] text-[#48cae4] uppercase mb-4 md:mb-6">PQC Command Center</div>
          <div className="mono text-xs sm:text-sm text-[#90e0ef]/80 tracking-[0.15em] sm:tracking-[0.2em] mb-8 md:mb-10">CNSA 2.0 · PQC · ZERO TRUST · ML-KEM-768 · ML-DSA-65</div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row gap-3 sm:gap-4 fade-up fade-up-2 mb-14 md:mb-18 px-6 w-full sm:w-auto">
          <button
            onClick={() => setLocation("/dashboard")}
            className="group px-8 sm:px-10 py-4 rounded-xl border border-[#00b4d8] bg-[#00b4d8] text-white orbitron text-sm tracking-widest uppercase hover:bg-[#0096c7] transition-all duration-300 relative overflow-hidden shadow-lg"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">Launch Dashboard <ChevronRight className="w-4 h-4" /></span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
          <a
            href="https://github.com/saisravan909/Quantum-Audit-for-Cryptographic-Modernization"
            target="_blank" rel="noopener noreferrer"
            className="px-8 sm:px-10 py-4 rounded-xl text-slate-100 orbitron text-sm tracking-widest uppercase hover:text-[#48cae4] transition-all duration-300 text-center"
            style={{ border: "1px solid rgba(150,180,220,0.45)", background: "rgba(15,35,70,0.75)" }}
          >
            GitHub Repository
          </a>
        </div>

        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-12 text-center fade-up fade-up-3">
          {[
            { label: "Cryptographic Assets", n: 10000, s: "+" },
            { label: "PQC Algorithms Tracked", n: 12 },
            { label: "Compliance Frameworks", n: 7 },
            { label: "Year of CNSA 2.0 Mandate", n: 2030 },
          ].map(({ label, n, s = "" }) => (
            <div key={label}>
              <div className="orbitron text-3xl font-black text-[#48cae4] mb-2">
                <Counter target={n} suffix={s} />
              </div>
              <div className="mono text-xs text-slate-300 uppercase tracking-widest leading-tight max-w-[110px] mx-auto">{label}</div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 fade-up fade-up-4">
          <span className="mono text-xs tracking-widest text-[#48cae4]">SCROLL TO EXPLORE</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#00b4d8] to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── THE STORY: THE PROBLEM ───────────────────────────── */}
      <Section style={{ backgroundColor: "#060b16" }} className="border-t border-slate-700/50">
        <div className="max-w-5xl mx-auto space-y-16">
          <SectionHeader
            eyebrow="Chapter 1: The Threat"
            heading={<>The Quantum Clock<br /><span className="gradient-text">Is Already Ticking</span></>}
            sub="Nation-state adversaries are executing Harvest Now, Decrypt Later attacks today, silently archiving your encrypted traffic to decrypt it once quantum computers are powerful enough. Your RSA-2048 and ECC keys are already being collected."
          />
          <HndlDiagram />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Cpu, color: "#a78bfa", title: "CRQC Timeline: 2029 to 2033", body: "IBM, Google, and Microsoft all project fault-tolerant quantum computers capable of breaking RSA within this decade. CNSA 2.0 mandates full PQC adoption no later than 2030 for National Security Systems." },
              { icon: Landmark, color: "#fb923c", title: "Regulatory Mandates Are Active", body: "NSM-10 requires annual cryptographic inventories. EO 14028 mandates Zero Trust and encrypted communications. CNSA 2.0 formally deprecates RSA, ECDSA, and ECDH. Non-compliance risks mission failure." },
              { icon: BarChart3, color: "#34d399", title: "Most Organizations Are Unprepared", body: "CISA estimates fewer than 20% of federal agencies have completed a cryptographic inventory. Without an inventory, there is no migration plan. Without a plan, there is no compliance." },
            ].map(c => (
              <div key={c.title} className="rounded-xl p-7 landing-card landing-card-accent-l transition-all"
                style={{ borderLeftColor: c.color }}>
                <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-4" style={{ background: c.color + "20", border: `1px solid ${c.color}40` }}>
                  <c.icon className="w-6 h-6" style={{ color: c.color }} />
                </div>
                <h3 className="font-bold text-base mb-3 text-white">{c.title}</h3>
                <p className="text-slate-200 text-base leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── THE STORY: THE SOLUTION ──────────────────────────── */}
      <Section style={{ backgroundColor: "#080e1c" }} className="border-t border-slate-700/50 grid-bg">
        <div className="max-w-5xl mx-auto space-y-16">
          <SectionHeader
            eyebrow="Chapter 2: The Solution"
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
                <div key={f} className="flex items-start gap-4 p-4 rounded-lg transition-all landing-card">
                  <div className="w-2 h-2 rounded-full bg-[#48cae4] shrink-0 mt-2" />
                  <span className="text-slate-100 text-base leading-relaxed">{f}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Command Center", desc: "Unified threat and compliance overview", icon: Target, color: "#00b4d8" },
                { label: "Node Inventory", desc: "Per-asset cryptographic posture scoring", icon: Monitor, color: "#48cae4" },
                { label: "CBOM Explorer", desc: "Machine-readable crypto bill of materials", icon: ClipboardList, color: "#60a5fa" },
                { label: "Zero Trust Alerts", desc: "Real-time policy violation stream", icon: Bell, color: "#f87171" },
                { label: "Compliance Velocity", desc: "CNSA 2.0 migration progress tracker", icon: TrendingUp, color: "#4ade80" },
                { label: "Telemetry Feed", desc: "eBPF and protocol-level event stream", icon: Radio, color: "#c084fc" },
              ].map(m => (
                <div key={m.label} className="rounded-xl p-5 landing-card transition-all duration-300 cursor-default">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: m.color + "20", border: `1px solid ${m.color}40` }}>
                    <m.icon className="w-5 h-5" style={{ color: m.color }} />
                  </div>
                  <div className="text-sm font-bold mb-1.5" style={{ color: m.color }}>{m.label}</div>
                  <div className="text-slate-200 text-sm leading-relaxed">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── THE STORY: THE JOURNEY ───────────────────────────── */}
      <Section style={{ backgroundColor: "#060b16" }} className="border-t border-slate-700/50">
        <div className="max-w-5xl mx-auto space-y-16">
          <SectionHeader
            eyebrow="Chapter 3: The Migration"
            heading={<>From Vulnerable to <span className="gradient-text">Quantum-Safe</span></>}
            sub="Cryptographic modernization is not a one-time event. It is a structured journey. QVault guides your organization through every phase, from initial inventory to verified deployment and regulatory reporting."
          />
          <MigrationJourneyDiagram />
        </div>
      </Section>

      {/* ── WHO IT'S BUILT FOR ───────────────────────────────── */}
      <Section style={{ backgroundColor: "#080e1c" }} className="border-t border-slate-700/50 grid-bg">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            eyebrow="Chapter 4: The Audience"
            heading={<>Built for Those Who <span className="gradient-text">Secure What Matters</span></>}
            sub="Every role in the PQC migration lifecycle has a specific job to do. QVault is designed so each person can do their job without waiting on someone else."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <BenefitRow icon={Landmark} title="Federal CISOs and Mission Owners"
              body="Executive-level visibility into cryptographic risk, compliance gaps, and CNSA 2.0 migration velocity, ready for DepSecDef briefings and OMB reporting." />
            <BenefitRow icon={Lock} title="Cryptographers and Security Engineers"
              body="Deep per-algorithm telemetry, CBOM dependency views, and protocol-level events. Find deprecated cipher usage before it becomes an audit finding." />
            <BenefitRow icon={Scale} title="Compliance and Risk Officers"
              body="Map your cryptographic estate to NIST 800-207, NSM-10, EO 14028, and CNSA 2.0. Generate evidence packages and track remediation progress toward deadlines." />
            <BenefitRow icon={Zap} title="Critical Infrastructure Operators"
              body="Protect power grids, water systems, financial rails, and telecom backbones. Monitor OT and IT cryptographic convergence without disrupting operations." />
            <BenefitRow icon={BookOpen} title="Researchers and Academic Institutions"
              body="An open, extensible PQC telemetry platform for studying real-world migration patterns, algorithm adoption rates, and Zero Trust implementation challenges." />
            <BenefitRow icon={Building2} title="Defense Contractors and System Integrators"
              body="Demonstrate CMMC, FedRAMP, and STIG cryptographic compliance to DoD primes. Accelerate ATO packages with automated cryptographic evidence generation." />
          </div>
        </div>
      </Section>

      {/* ── OPEN ARCHITECTURE ────────────────────────────────── */}
      <Section style={{ backgroundColor: "#060b16" }} className="border-t border-slate-700/50">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            eyebrow="Open Source"
            heading={<><span className="gradient-text">No Vendor Lock-In.</span> Ever.</>}
            sub="QVault is fully open source under MIT license. Inspect every line, fork it, extend it. The cryptographic trust crisis should not be solved by proprietary black boxes."
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
            {[
              { cat: "Frontend", color: "#60a5fa", items: ["React 18", "TypeScript", "Vite 5", "Recharts", "Tailwind CSS"] },
              { cat: "Backend", color: "#4ade80", items: ["Node.js 20", "Express 5", "REST / OpenAPI", "Drizzle ORM", "Zod Validation"] },
              { cat: "Data Layer", color: "#00b4d8", items: ["PostgreSQL 16", "Live telemetry polling", "CBOM schema", "Alert engine"] },
              { cat: "Standards", color: "#c084fc", items: ["CNSA 2.0", "NIST 800-207", "NSM-10", "EO 14028", "FIPS 205 / 206"] },
            ].map(({ cat, color, items }) => (
              <div key={cat} className="rounded-xl p-6 landing-card landing-card-accent-t transition-all"
                style={{ borderTopColor: color }}>
                <div className="mono text-sm font-bold uppercase tracking-widest mb-5" style={{ color }}>{cat}</div>
                <ul className="space-y-2.5">
                  {items.map(i => (
                    <li key={i} className="text-slate-200 text-sm flex items-center gap-2.5">
                      <span style={{ color }} className="shrink-0 font-bold">▸</span>
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
              className="group flex items-center gap-3 px-10 py-4 rounded-xl text-slate-100 hover:text-[#48cae4] transition-all duration-300 text-base orbitron tracking-wider uppercase landing-card"
            >
              View Source on GitHub
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </Section>

      {/* ── INNOVATION SHOWCASE ──────────────────────────────── */}
      <InnovationShowcase />

      {/* ── INNOVATOR ────────────────────────────────────────── */}
      <Section style={{ backgroundColor: "#080e1c" }} className="border-t border-slate-700/50 grid-bg">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            eyebrow="The Innovator"
            heading={<>Built With Purpose by<br /><span className="gradient-text">Sai Sravan Cherukuri</span></>}
          />
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="shrink-0 flex flex-col items-center gap-6">
              <div className="relative pulse-ring">
                <div className="avatar-glow w-48 h-48 rounded-full overflow-hidden" style={{ border: "2px solid rgba(0,180,216,0.50)" }}>
                  <img src="/sai-sravan.png" alt="Sai Sravan Cherukuri" className="w-full h-full object-cover object-top" />
                </div>
              </div>
              <div className="text-center">
                <div className="orbitron font-black text-2xl text-[#48cae4] mb-2">Sai Sravan Cherukuri</div>
                <div className="mono text-[#90e0ef] text-sm tracking-widest uppercase mb-5">Innovator and Open Source Contributor</div>
                <div className="flex gap-3 justify-center">
                  <a href="https://github.com/saisravan909" target="_blank" rel="noopener noreferrer"
                    className="px-5 py-2 rounded-lg text-slate-100 mono text-sm hover:text-[#48cae4] transition-all landing-card">
                    GitHub
                  </a>
                  <a href="https://github.com/saisravan909/Quantum-Audit-for-Cryptographic-Modernization" target="_blank" rel="noopener noreferrer"
                    className="px-5 py-2 rounded-lg text-slate-100 mono text-sm hover:text-[#48cae4] transition-all landing-card">
                    Repository
                  </a>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-6">
              <blockquote className="border-l-3 pl-7" style={{ borderLeft: "3px solid rgba(0,180,216,0.65)" }}>
                <p className="text-white text-xl leading-relaxed italic mb-4">
                  "Our critical infrastructure runs on cryptographic assumptions made in the 1970s and 80s.
                  Every organization that can see the problem clearly can start fixing it. QVault makes the invisible visible."
                </p>
                <cite className="text-[#48cae4] mono text-sm uppercase tracking-widest">Sai Sravan Cherukuri, Creator of QVault</cite>
              </blockquote>
              <p className="text-slate-200 text-base leading-relaxed">
                Sai built QVault because he kept running into the same gap across organizations: security teams knew
                the quantum threat was real, but had no practical way to measure their actual exposure or track progress
                toward fixing it. Strategy documents were everywhere. Real-time operational visibility was not.
              </p>
              <p className="text-slate-200 text-base leading-relaxed">
                With deep roots in post-quantum cryptography, Zero Trust architecture, and national security systems,
                Sai understood both the technical depth of the problem and the operational urgency it carries.
                The regulatory clock is running. NSM-10, CNSA 2.0, and EO 14028 have set timelines.
                Organizations without a live picture of their cryptographic estate are flying blind.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-2">
                {[
                  { label: "Focus", value: "Post-Quantum Crypto" },
                  { label: "Domain", value: "Zero Trust and NSS" },
                  { label: "License", value: "MIT / Free Forever" },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg p-4 text-center landing-card">
                    <div className="mono text-xs text-slate-400 uppercase tracking-widest mb-2">{label}</div>
                    <div className="text-[#48cae4] text-sm font-bold">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <Section style={{ backgroundColor: "#0096c7" }} className="border-t border-[#0077a8]">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="mono text-white/80 text-sm tracking-[0.35em] uppercase font-semibold">The Question is Simple</div>
          <h2 className="orbitron font-black text-4xl md:text-5xl text-white leading-tight">
            Do You Know Where Your<br />
            <span style={{ color: "#caf0f8" }}>Quantum Exposure Is?</span>
          </h2>
          <p className="text-white/90 text-lg leading-relaxed">
            Every day without a cryptographic inventory is another day of compounding HNDL risk.
            QVault gives you the visibility to answer that question in under 30 seconds, and a roadmap to fix it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setLocation("/dashboard")}
              className="group px-10 py-4 rounded-xl border border-white bg-white text-[#0077a8] orbitron text-sm tracking-widest uppercase hover:bg-white/90 transition-all duration-300 relative overflow-hidden shadow-lg font-bold"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Enter Command Center <ChevronRight className="w-4 h-4" />
              </span>
            </button>
            <button
              onClick={() => setLocation("/demo")}
              className="px-10 py-4 rounded-xl border border-white/60 text-white orbitron text-sm tracking-widest uppercase hover:bg-white/15 transition-all duration-300 font-semibold"
            >
              Watch the Demo
            </button>
          </div>
          <div className="mono text-xs text-white/70 uppercase tracking-widest">Open source · MIT License · No vendor lock-in · Built for defense</div>
        </div>
      </Section>
    </div>
  );
}
