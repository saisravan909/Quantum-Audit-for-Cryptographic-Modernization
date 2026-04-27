import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { QuantumKeyLogo } from "@/components/QuantumKeyLogo";

/* ─── tiny star canvas ─────────────────────────────────────────── */
function StarField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    c.width = c.offsetWidth; c.height = c.offsetHeight;
    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      r: Math.random() * 1.2, t: Math.random() * Math.PI * 2,
    }));
    let af: number;
    function draw() {
      ctx.clearRect(0, 0, c.width, c.height);
      stars.forEach(s => {
        s.t += 0.008;
        const a = 0.25 + Math.sin(s.t) * 0.25;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,180,60,${a})`; ctx.fill();
      });
      af = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(af);
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }} />;
}

/* ─── animated counter ─────────────────────────────────────────── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = () => { start += Math.ceil(target / 60); if (start >= target) { setVal(target); return; } setVal(start); requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ─── section wrapper ──────────────────────────────────────────── */
function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`relative py-24 px-6 md:px-16 lg:px-24 ${className}`}>
      {children}
    </section>
  );
}

/* ─── threat card ──────────────────────────────────────────────── */
function ThreatCard({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-orange-500/20 bg-black/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-orange-500/50 hover:bg-orange-500/5">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-orange-400 font-mono font-bold text-sm uppercase tracking-widest mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{body}</p>
    </div>
  );
}

/* ─── benefit pill ─────────────────────────────────────────────── */
function BenefitRow({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="flex gap-5 items-start group">
      <div className="shrink-0 w-12 h-12 rounded-full border border-orange-500/30 bg-orange-500/10 flex items-center justify-center text-xl group-hover:border-orange-400/60 transition-colors">
        {icon}
      </div>
      <div>
        <h4 className="text-orange-300 font-semibold text-sm tracking-wide mb-1">{title}</h4>
        <p className="text-gray-400 text-sm leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

/* ─── main landing page ────────────────────────────────────────── */
export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [tick, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 60); return () => clearInterval(id); }, []);
  const glow = 0.65 + Math.sin(tick * 0.12) * 0.35;

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
        .orbitron { font-family: 'Orbitron', monospace; }
        .mono     { font-family: 'Share Tech Mono', monospace; }
        @keyframes gradient-x {
          0%,100% { background-position: 0% 50%; }
          50%     { background-position: 100% 50%; }
        }
        @keyframes border-flow {
          0%   { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        .gradient-text {
          background: linear-gradient(135deg, #ff8800, #ffcc44, #ff6600, #ffaa00);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-x 4s ease infinite;
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .pulse-ring::before {
          content: '';
          position: absolute; inset: -8px;
          border-radius: 50%;
          border: 1px solid rgba(255,136,0,0.5);
          animation: pulse-ring 2s ease-out infinite;
        }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-10px); }
        }
        .float { animation: float 5s ease-in-out infinite; }
        @keyframes scan-line {
          0%   { top: -2px; }
          100% { top: 100%; }
        }
        .scan-line {
          position: absolute; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,136,0,0.4), transparent);
          animation: scan-line 6s linear infinite;
          pointer-events: none;
        }
        .grid-bg {
          background-image:
            linear-gradient(rgba(255,136,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,136,0,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.8s ease forwards; }
        .fade-up-1 { animation-delay: 0.1s; opacity: 0; }
        .fade-up-2 { animation-delay: 0.3s; opacity: 0; }
        .fade-up-3 { animation-delay: 0.5s; opacity: 0; }
        .fade-up-4 { animation-delay: 0.7s; opacity: 0; }
        @keyframes avatar-glow {
          0%,100% { box-shadow: 0 0 30px rgba(255,136,0,0.3), 0 0 60px rgba(255,136,0,0.1); }
          50%     { box-shadow: 0 0 50px rgba(255,136,0,0.6), 0 0 100px rgba(255,136,0,0.2); }
        }
        .avatar-glow { animation: avatar-glow 3s ease-in-out infinite; }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden grid-bg">
        <StarField />
        <div className="scan-line" />

        {/* Radial glow behind logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: `radial-gradient(circle, rgba(255,136,0,${glow * 0.12}) 0%, transparent 65%)`, transition: "background 0.1s" }} />

        {/* Logo */}
        <div className="float relative z-10 mb-4">
          <QuantumKeyLogo width={340} height={200} />
        </div>

        {/* Wordmark */}
        <div className="relative z-10 text-center fade-up fade-up-1">
          <div className="orbitron font-black text-6xl md:text-8xl gradient-text tracking-tight leading-none mb-2">
            QVault
          </div>
          <div className="orbitron text-sm md:text-base tracking-[0.5em] text-orange-400/70 uppercase mb-8">
            PQC Command Center
          </div>
          <div className="mono text-xs text-orange-500/50 tracking-[0.3em] mb-10">
            CNSA 2.0 · PQC · ZERO TRUST · ML-KEM-768 · ML-DSA-65
          </div>
        </div>

        {/* CTA buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-4 fade-up fade-up-2 mb-16">
          <button
            onClick={() => setLocation("/dashboard")}
            className="group px-8 py-3 rounded-sm border border-orange-500 bg-orange-500/10 text-orange-300 orbitron text-sm tracking-widest uppercase hover:bg-orange-500/25 transition-all duration-300 relative overflow-hidden"
          >
            <span className="relative z-10">Launch Dashboard</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
          <a
            href="https://github.com/saisravan909/Quantum-Audit-for-Cryptographic-Modernization"
            target="_blank" rel="noopener noreferrer"
            className="px-8 py-3 rounded-sm border border-orange-500/30 text-orange-500/70 orbitron text-sm tracking-widest uppercase hover:border-orange-500/60 hover:text-orange-400 transition-all duration-300"
          >
            GitHub Repository
          </a>
        </div>

        {/* Stat bar */}
        <div className="relative z-10 flex gap-12 text-center fade-up fade-up-3">
          {[
            { label: "Cryptographic Assets Monitored", n: 10000, s: "+" },
            { label: "PQC Algorithms Tracked", n: 12 },
            { label: "Compliance Frameworks", n: 7 },
            { label: "Days to Quantum Threat", n: 2027, s: "*" },
          ].map(({ label, n, s = "" }) => (
            <div key={label} className="group">
              <div className="orbitron text-2xl font-black text-orange-400 group-hover:text-orange-300 transition-colors">
                <Counter target={n} suffix={s} />
              </div>
              <div className="mono text-[9px] text-gray-500 uppercase tracking-widest mt-1 max-w-[100px]">{label}</div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 fade-up fade-up-4">
          <span className="mono text-[9px] tracking-widest text-orange-500">SCROLL TO EXPLORE</span>
          <div className="w-px h-8 bg-gradient-to-b from-orange-500 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── THE PROBLEM ─────────────────────────────────────────── */}
      <Section className="grid-bg border-t border-orange-500/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="mono text-orange-500/60 text-xs tracking-[0.4em] uppercase mb-3">The Threat Landscape</div>
            <h2 className="orbitron font-black text-4xl md:text-5xl text-white mb-6">
              The Quantum Clock<br />
              <span className="gradient-text">Is Already Ticking</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Nation-state adversaries are executing <strong className="text-orange-300">"Harvest Now, Decrypt Later"</strong> (HNDL) attacks today —
              intercepting and archiving encrypted communications to decrypt them once cryptographically-relevant quantum computers arrive.
              Your RSA-2048 and ECC keys are already compromised in transit.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ThreatCard
              icon="⚛️"
              title="Cryptographically Relevant QC"
              body="IBM projects fault-tolerant quantum computers capable of breaking RSA-2048 by 2029–2033. CNSA 2.0 mandates PQC adoption no later than 2030. Every day of inaction is a day of compounding risk."
            />
            <ThreatCard
              icon="🕵️"
              title="Harvest Now, Decrypt Later"
              body="SIGINT agencies collect petabytes of encrypted traffic daily. Once a CRQC exists, historical archives become plaintext. The attack surface is retroactive — threatening data encrypted today, tomorrow, and years ago."
            />
            <ThreatCard
              icon="🏛️"
              title="Regulatory Cliff Edge"
              body="NSM-10, EO 14028, NIST 800-207, and CNSA 2.0 mandate cryptographic inventories, migration plans, and PQC deployment timelines. Non-compliance risks mission failure, contract loss, and FISMA findings."
            />
          </div>
        </div>
      </Section>

      {/* ── WHAT IS THIS TOOL ───────────────────────────────────── */}
      <Section className="border-t border-orange-500/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mono text-orange-500/60 text-xs tracking-[0.4em] uppercase mb-3">The Solution</div>
              <h2 className="orbitron font-black text-4xl text-white mb-6 leading-tight">
                Real-Time PQC<br />
                <span className="gradient-text">Governance at Scale</span>
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                <strong className="text-orange-300">QVault</strong> is an open-source, real-time cryptographic governance
                platform engineered for defense, intelligence, and critical infrastructure organizations navigating the migration to
                Post-Quantum Cryptography under CNSA 2.0.
              </p>
              <p className="text-gray-400 mb-8 leading-relaxed">
                It provides a single unified operational picture across your entire cryptographic estate — from TLS endpoint inventory
                and CBOM (Cryptographic Bill of Materials) generation, to live Zero Trust policy alerts, compliance velocity scoring,
                and ML-KEM/ML-DSA algorithm telemetry — all in a SCIF-grade dark-mode command interface.
              </p>
              <div className="space-y-3">
                {[
                  "Live node cryptographic posture monitoring",
                  "CBOM generation aligned with NIST SP 800-235",
                  "CNSA 2.0 / NIST PQC algorithm compliance scoring",
                  "Zero Trust telemetry with eBPF-level visibility",
                  "NSM-10 & EO 14028 migration timeline tracking",
                  "Real-time HNDL exposure risk quantification",
                ].map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                    <span className="text-gray-300 text-sm">{f}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Feature tiles */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Command Center", desc: "Unified threat & compliance overview", icon: "🎯" },
                { label: "Node Inventory", desc: "Per-node cryptographic posture", icon: "🖥️" },
                { label: "CBOM Explorer", desc: "Cryptographic Bill of Materials", icon: "📋" },
                { label: "Zero Trust Alerts", desc: "Real-time policy violation stream", icon: "🚨" },
                { label: "Compliance Velocity", desc: "CNSA 2.0 migration progress", icon: "📈" },
                { label: "Telemetry Feed", desc: "eBPF & protocol-level events", icon: "📡" },
              ].map(({ label, desc, icon }) => (
                <div key={label} className="rounded-lg border border-orange-500/15 bg-orange-500/5 p-5 hover:border-orange-500/35 hover:bg-orange-500/10 transition-all duration-300 group cursor-default">
                  <div className="text-2xl mb-2">{icon}</div>
                  <div className="orbitron text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">{label}</div>
                  <div className="text-gray-500 text-xs leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── WHO BENEFITS ────────────────────────────────────────── */}
      <Section className="border-t border-orange-500/10 grid-bg">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="mono text-orange-500/60 text-xs tracking-[0.4em] uppercase mb-3">Audience</div>
            <h2 className="orbitron font-black text-4xl text-white mb-4">
              Built For Those Who<br />
              <span className="gradient-text">Secure What Matters</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm">
              From agency CISOs to hands-on cryptographers, this platform accelerates every role in the PQC migration lifecycle.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <BenefitRow icon="🏛️" title="Federal CISOs & Mission Owners"
              body="Gain executive-level visibility into enterprise cryptographic risk, compliance gaps, and CNSA 2.0 migration velocity — all in one dashboard, ready for DepSecDef briefings." />
            <BenefitRow icon="🔐" title="Cryptographers & Security Engineers"
              body="Deep-dive into per-algorithm telemetry, CBOM dependency trees, and protocol-level events. Identify deprecated cipher usage before it becomes an audit finding." />
            <BenefitRow icon="⚖️" title="Compliance & Risk Officers"
              body="Map your cryptographic estate to NIST 800-207, NSM-10, EO 14028, and CNSA 2.0 requirements. Generate evidence packages, track remediation timelines, and reduce audit burden." />
            <BenefitRow icon="🌐" title="Critical Infrastructure Operators"
              body="Protect power grids, water systems, financial rails, and telecom backbones from quantum-era threats. Monitor OT/IT cryptographic convergence in real time." />
            <BenefitRow icon="🎓" title="Researchers & Academic Institutions"
              body="An open, extensible PQC telemetry platform for studying real-world cryptographic migration patterns, algorithm adoption rates, and Zero Trust implementation challenges." />
            <BenefitRow icon="🏢" title="Defense Contractors & SIs"
              body="Demonstrate CMMC, FedRAMP, and STIG cryptographic compliance to DoD primes and customer agencies. Accelerate ATO with automated cryptographic evidence generation." />
          </div>
        </div>
      </Section>

      {/* ── ARCHITECTURE ────────────────────────────────────────── */}
      <Section className="border-t border-orange-500/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="mono text-orange-500/60 text-xs tracking-[0.4em] uppercase mb-3">Technology</div>
            <h2 className="orbitron font-black text-4xl text-white mb-4">
              <span className="gradient-text">Open Architecture</span><br />
              No Vendor Lock-In
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { cat: "Frontend", items: ["React 18", "TypeScript", "Vite", "Recharts", "Framer Motion", "Tailwind CSS"] },
              { cat: "Backend", items: ["Node.js", "Express 5", "REST/OpenAPI", "Drizzle ORM", "Zod Validation", "Orval Codegen"] },
              { cat: "Data", items: ["PostgreSQL", "Real-time polling", "Seed telemetry", "CBOM schema", "Alert engine", "Compliance calc"] },
              { cat: "Standards", items: ["CNSA 2.0", "NIST 800-207", "NSM-10", "EO 14028", "FIPS 205/206", "SP 800-235"] },
            ].map(({ cat, items }) => (
              <div key={cat} className="rounded-lg border border-orange-500/15 bg-black/60 p-5">
                <div className="orbitron text-orange-400 text-xs font-bold uppercase tracking-widest mb-4">{cat}</div>
                <ul className="space-y-2">
                  {items.map(i => <li key={i} className="text-gray-400 text-xs flex items-center gap-2"><span className="text-orange-600">▸</span>{i}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── INNOVATOR ────────────────────────────────────────────── */}
      <Section className="border-t border-orange-900/40 grid-bg">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="mono text-orange-500/60 text-xs tracking-[0.4em] uppercase mb-3">The Innovator</div>
            <h2 className="orbitron font-black text-4xl text-white mb-4">
              Giving Back to the<br />
              <span className="gradient-text">Security Ecosystem</span>
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Avatar / Photo */}
            <div className="shrink-0 flex flex-col items-center gap-5">
              <div className="relative pulse-ring">
                <div className="avatar-glow w-52 h-52 rounded-full border-2 border-orange-500/60 overflow-hidden">
                  <img
                    src="/sai-sravan.png"
                    alt="Sai Sravan Cherukuri"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
              <div className="text-center">
                <div className="orbitron font-black text-xl text-orange-300 mb-1">Sai Sravan Cherukuri</div>
                <div className="mono text-orange-500/60 text-xs tracking-widest uppercase mb-3">Innovator & Open Source Contributor</div>
                <div className="flex gap-3 justify-center">
                  <a href="https://github.com/saisravan909" target="_blank" rel="noopener noreferrer"
                    className="px-4 py-1.5 rounded border border-orange-500/30 text-orange-500/70 mono text-xs hover:border-orange-400 hover:text-orange-300 transition-all">
                    GitHub
                  </a>
                  <a href="https://github.com/saisravan909/Quantum-Audit-for-Cryptographic-Modernization" target="_blank" rel="noopener noreferrer"
                    className="px-4 py-1.5 rounded border border-orange-500/30 text-orange-500/70 mono text-xs hover:border-orange-400 hover:text-orange-300 transition-all">
                    Project
                  </a>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="flex-1 space-y-6">
              <blockquote className="border-l-2 border-orange-500/50 pl-6">
                <p className="text-gray-200 text-xl leading-relaxed italic">
                  "Our critical infrastructure runs on cryptographic assumptions made in the 1970s and 80s.
                  Quantum computing is about to invalidate those assumptions — permanently and irreversibly.
                  I built this tool because visibility precedes action, and action is now urgent."
                </p>
              </blockquote>

              <p className="text-gray-400 leading-relaxed">
                Sai Sravan Cherukuri is a cybersecurity innovator with deep expertise in post-quantum cryptography,
                Zero Trust architecture, and national security infrastructure. Witnessing the accelerating pace of quantum
                hardware development and the slow-motion reality of enterprise cryptographic migration, he identified a
                critical gap: organizations lacked a unified, real-time command surface to understand and act on their
                cryptographic exposure.
              </p>

              <p className="text-gray-400 leading-relaxed">
                Rather than building a proprietary, paywalled solution, Sai made a deliberate choice to release
                QVault as fully open-source software, believing that the national security
                implications of the quantum transition are too important to be locked behind commercial gates.
                The ecosystem needs shared tools, shared visibility, and shared urgency.
              </p>

              <p className="text-gray-400 leading-relaxed">
                His commitment extends beyond code: by open-sourcing the platform, he invites federal agencies,
                defense contractors, academic researchers, and critical infrastructure operators to collaborate,
                extend, and adapt the tool to their unique mission environments — accelerating the collective
                cryptographic readiness of the entire community.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-2">
                {[
                  { label: "Mission", value: "Democratize PQC Readiness" },
                  { label: "License", value: "Open Source (MIT)" },
                  { label: "Community", value: "PRs & Issues Welcome" },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded border border-orange-500/15 bg-orange-500/5 p-3 text-center">
                    <div className="mono text-orange-500/50 text-[9px] uppercase tracking-widest mb-1">{label}</div>
                    <div className="orbitron text-orange-300 text-xs font-bold">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── OPEN SOURCE CALL TO ACTION ───────────────────────────── */}
      <Section className="border-t border-orange-500/10 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="mono text-orange-500/60 text-xs tracking-[0.4em] uppercase mb-4">Open Source</div>
          <h2 className="orbitron font-black text-4xl text-white mb-6">
            The Community Is<br />
            <span className="gradient-text">The Moat</span>
          </h2>
          <p className="text-gray-400 mb-10 leading-relaxed">
            Post-quantum cryptographic modernization is a generational infrastructure challenge.
            No single organization can solve it alone. Star the repo, file issues, submit PRs, fork it for your mission —
            every contribution advances the collective cryptographic readiness of the ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setLocation("/dashboard")}
              className="group px-10 py-4 rounded-sm border border-orange-500 bg-orange-500/15 text-orange-200 orbitron text-sm tracking-widest uppercase hover:bg-orange-500/30 transition-all duration-300 relative overflow-hidden"
            >
              <span className="relative z-10">Enter Command Center</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
            <a
              href="https://github.com/saisravan909/Quantum-Audit-for-Cryptographic-Modernization"
              target="_blank" rel="noopener noreferrer"
              className="px-10 py-4 rounded-sm border border-orange-500/25 text-orange-500/60 orbitron text-sm tracking-widest uppercase hover:border-orange-500/50 hover:text-orange-400 transition-all duration-300"
            >
              ⭐ Star on GitHub
            </a>
          </div>
        </div>
      </Section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t border-orange-900/30 py-8 px-8 grid-bg">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <QuantumKeyLogo width={80} height={48} />
            <div>
              <div className="orbitron text-orange-400 text-xs font-bold tracking-widest">QVault</div>
              <div className="mono text-orange-600/50 text-[9px] tracking-widest">PQC COMMAND CENTER</div>
            </div>
          </div>
          <div className="mono text-gray-600 text-xs text-center">
            Open Source · MIT License · Built to secure the future
          </div>
          <div className="mono text-gray-600 text-xs">
            CNSA 2.0 · NIST 800-207 · NSM-10 · EO 14028
          </div>
        </div>
      </footer>
    </div>
  );
}
