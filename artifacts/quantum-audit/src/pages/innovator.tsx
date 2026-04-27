import { useEffect, useState } from "react";
import { Lock, Building2, Globe, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { QuantumKeyLogo } from "@/components/QuantumKeyLogo";

export default function InnovatorPage() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 80);
    return () => clearInterval(id);
  }, []);
  const glow = 0.5 + Math.sin(tick * 0.1) * 0.3;

  return (
    <div className="min-h-full bg-black text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
        .orbitron { font-family: 'Orbitron', monospace; }
        .mono { font-family: 'Share Tech Mono', monospace; }
        @keyframes gradient-x {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        .gradient-text {
          background: linear-gradient(135deg, #ff8800, #ffcc44, #ff6600, #ffaa00);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-x 4s ease infinite;
        }
        @keyframes avatar-glow {
          0%,100% { box-shadow: 0 0 30px rgba(255,136,0,0.35), 0 0 70px rgba(255,136,0,0.12); }
          50%      { box-shadow: 0 0 55px rgba(255,136,0,0.65), 0 0 120px rgba(255,136,0,0.22); }
        }
        .avatar-glow { animation: avatar-glow 3s ease-in-out infinite; }
        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.65); opacity: 0; }
        }
        .pulse-ring::before {
          content: '';
          position: absolute; inset: -10px;
          border-radius: 50%;
          border: 1px solid rgba(255,136,0,0.45);
          animation: pulse-ring 2.2s ease-out infinite;
        }
        @keyframes badge-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(255,102,0,0.4); }
          50%      { box-shadow: 0 0 0 8px rgba(255,102,0,0); }
        }
        .badge-pulse { animation: badge-pulse 2.5s ease-in-out infinite; }
        .grid-bg {
          background-image:
            linear-gradient(rgba(255,136,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,136,0,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        @keyframes scan-h {
          0%   { transform: translateY(-300px); opacity: 0; }
          15%  { opacity: 0.07; }
          85%  { opacity: 0.07; }
          100% { transform: translateY(600px); opacity: 0; }
        }
        .scan-beam {
          position: absolute; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,136,0,0.5), transparent);
          animation: scan-h 5s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .fade-up-1 { animation-delay: 0.05s; opacity: 0; }
        .fade-up-2 { animation-delay: 0.2s; opacity: 0; }
        .fade-up-3 { animation-delay: 0.35s; opacity: 0; }
        .fade-up-4 { animation-delay: 0.5s; opacity: 0; }
      `}</style>

      {/* Hero banner */}
      <div className="relative grid-bg border-b border-orange-900/40 overflow-hidden py-16 px-6">
        <div className="scan-beam" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(255,136,0,${glow * 0.1}) 0%, transparent 65%)` }}
        />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="mono text-orange-500/60 text-xs tracking-[0.45em] uppercase mb-4 fade-up fade-up-1">
            The Innovator Behind QVault
          </div>
          <h1 className="orbitron font-black text-4xl md:text-5xl text-white mb-3 fade-up fade-up-2">
            Sai Sravan<br />
            <span className="gradient-text">Cherukuri</span>
          </h1>
          <p className="mono text-orange-500/50 text-xs tracking-[0.3em] fade-up fade-up-3">
            CYBERSECURITY INNOVATOR · OPEN SOURCE CONTRIBUTOR · PQC ADVOCATE
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-16 items-start">

          {/* Left: photo + identity card */}
          <div className="shrink-0 flex flex-col items-center gap-6 fade-up fade-up-1">
            <div className="relative pulse-ring">
              <div className="avatar-glow w-56 h-56 rounded-full border-2 border-orange-500/60 overflow-hidden">
                <img
                  src="/sai-sravan.png"
                  alt="Sai Sravan Cherukuri"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Identity card */}
            <div className="w-56 rounded-lg border border-orange-500/20 bg-orange-500/5 p-5 space-y-3 text-center">
              <div className="orbitron font-black text-orange-300 text-base">Sai Sravan Cherukuri</div>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
              {[
                { label: "Focus", value: "Post-Quantum Crypto" },
                { label: "Domain", value: "Zero Trust & NSS" },
                { label: "Mission", value: "Open Source Infra" },
                { label: "License", value: "MIT / Free Forever" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="mono text-[9px] text-orange-500/50 uppercase tracking-widest">{label}</span>
                  <span className="mono text-[10px] text-orange-300">{value}</span>
                </div>
              ))}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
              <a
                href="https://github.com/saisravan909"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 rounded border border-orange-500/30 text-orange-400 mono text-xs hover:border-orange-400 hover:bg-orange-500/10 transition-all duration-200"
              >
                github.com/saisravan909
              </a>
            </div>
          </div>

          {/* Right: bio */}
          <div className="flex-1 space-y-10 fade-up fade-up-2">

            {/* Pull quote */}
            <blockquote className="relative pl-6 border-l-2 border-orange-500/60">
              <div
                className="absolute -left-px top-0 bottom-0 w-0.5"
                style={{ background: "linear-gradient(180deg, #ff8800, #ff4400, transparent)" }}
              />
              <p className="text-white text-xl md:text-2xl font-light leading-relaxed italic">
                "Visibility precedes action. And action is now urgent."
              </p>
              <footer className="mono text-orange-500/50 text-xs mt-3 tracking-widest">
                SAI SRAVAN CHERUKURI, CREATOR OF QVAULT
              </footer>
            </blockquote>

            {/* Origin story */}
            <div className="space-y-4">
              <div className="mono text-orange-500/60 text-xs tracking-[0.4em] uppercase">The Origin</div>
              <p className="text-gray-300 leading-relaxed">
                Sai Sravan Cherukuri built QVault because he kept running into the same gap across organizations: security teams
                knew the quantum threat was real, but they had no practical way to measure their actual exposure or track
                their progress toward fixing it. Strategy documents were everywhere. Real-time operational visibility was not.
              </p>
              <p className="text-gray-400 leading-relaxed">
                With deep roots in post-quantum cryptography, Zero Trust architecture, and national security systems, Sai
                understood both the technical depth of the problem and the operational urgency it carries. The regulatory
                clock is running. NSM-10, CNSA 2.0, and EO 14028 have set timelines. Organizations without a live picture
                of their cryptographic estate are flying blind.
              </p>
            </div>

            {/* Why open source */}
            <div className="space-y-4">
              <div className="mono text-orange-500/60 text-xs tracking-[0.4em] uppercase">Why Open Source</div>
              <p className="text-gray-300 leading-relaxed">
                The decision to build QVault as open-source software was deliberate and principled. Cryptographic
                modernization is not a competitive advantage to be licensed. It is a shared infrastructure challenge
                with national security implications. Locking the tooling behind a paywall would slow the very migration
                it is designed to accelerate.
              </p>
              <p className="text-gray-400 leading-relaxed">
                By releasing QVault freely, Sai invites federal agencies, defense contractors, academic researchers,
                and critical infrastructure operators to use, extend, and adapt the platform to their mission environments.
                Every contribution advances the collective cryptographic readiness of the ecosystem.
              </p>
            </div>

            {/* Giving back */}
            <div className="space-y-4">
              <div className="mono text-orange-500/60 text-xs tracking-[0.4em] uppercase">Giving Back to the Community</div>
              <p className="text-gray-300 leading-relaxed">
                QVault is part of a broader commitment to contributing practical, open infrastructure that helps the
                people responsible for protecting critical systems do their jobs better, without requiring enterprise
                budgets to get started. The security ecosystem is only as strong as its weakest link. Raising the
                baseline for everyone raises it for everyone.
              </p>
            </div>

            {/* Contribution cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {([
                { icon: Lock, label: "PQC Research", desc: "ML-KEM, ML-DSA algorithm adoption tracking" },
                { icon: Building2, label: "Federal Focus", desc: "NSS, CMMC, FedRAMP compliance tooling" },
                { icon: Globe, label: "Open Infra", desc: "MIT licensed, fork-friendly architecture" },
                { icon: Users, label: "Community", desc: "PRs, issues, and discussions always welcome" },
              ] as { icon: LucideIcon; label: string; desc: string }[]).map(({ icon: Icon, label, desc }) => (
                <div key={label} className="rounded-lg border border-orange-500/15 bg-orange-500/5 p-4 text-center hover:border-orange-500/35 transition-colors">
                  <div className="flex justify-center mb-2">
                    <Icon className="w-6 h-6 text-orange-400" />
                  </div>
                  <div className="orbitron text-orange-400 text-[10px] font-bold uppercase tracking-wider mb-1">{label}</div>
                  <div className="text-gray-500 text-[10px] leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>

            {/* Call to action */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="https://github.com/saisravan909/Quantum-Audit-for-Cryptographic-Modernization"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden px-6 py-3 rounded-sm border border-orange-500 bg-orange-500/10 text-orange-300 orbitron text-xs tracking-widest uppercase hover:bg-orange-500/25 transition-all duration-300 text-center"
              >
                <span className="relative z-10">View on GitHub</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </a>
              <a
                href="https://github.com/saisravan909/Quantum-Audit-for-Cryptographic-Modernization/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-sm border border-orange-500/25 text-orange-500/60 orbitron text-xs tracking-widest uppercase hover:border-orange-500/50 hover:text-orange-400 transition-all duration-300 text-center"
              >
                Contribute or Collaborate
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
