import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, ChevronRight, Shield, AlertTriangle, Lock, Unlock, Key, CheckCircle, XCircle, ArrowDown, Zap } from "lucide-react";

const STEPS = [
  {
    id: 1,
    label: "Client Hello",
    sublabel: "The conversation starts",
    classic: {
      payload: "Supported: RSA-2048, ECDH P-256, AES-256-GCM",
      plain: "Your device announces it wants to connect and lists the encryption methods it supports — some of which are vulnerable to future quantum computers.",
      risk: "HIGH",
      riskNote: "RSA-2048 and ECDH are on CNSA 2.0 deprecated list. Any data agreed here can be harvested today and decrypted later.",
      color: "#ef4444",
    },
    pqc: {
      payload: "Supported: ML-KEM-768, X25519Kyber768, AES-256-GCM",
      plain: "Your device announces it wants to connect and lists quantum-safe encryption methods — including the new NIST-standardized ML-KEM-768 algorithm.",
      risk: "LOW",
      riskNote: "ML-KEM-768 is mathematically secure even against a cryptographically relevant quantum computer (CRQC).",
      color: "#22c55e",
    },
  },
  {
    id: 2,
    label: "Server Hello",
    sublabel: "Server responds with its choice",
    classic: {
      payload: "Selected: TLS_ECDHE_RSA_AES_256_GCM_SHA384",
      plain: "The server picks RSA with elliptic curves — the standard today, but a known vulnerability. Anyone recording this session can decrypt it once quantum computers arrive.",
      risk: "HIGH",
      riskNote: "ECDHE with RSA does not provide post-quantum security. The key agreement is breakable by Shor's algorithm on a CRQC.",
      color: "#ef4444",
    },
    pqc: {
      payload: "Selected: TLS_MLKEM768_X25519_AES256GCM_SHA384",
      plain: "The server selects a hybrid cipher: ML-KEM-768 paired with the classical X25519. Even if one is broken, the other keeps the session secure.",
      risk: "PROTECTED",
      riskNote: "Hybrid approach satisfies both current interoperability requirements and CNSA 2.0 forward-looking mandates simultaneously.",
      color: "#22c55e",
    },
  },
  {
    id: 3,
    label: "Certificate",
    sublabel: "Proving identity",
    classic: {
      payload: "Certificate: RSA-2048, SHA-256, expires 2026-03-01",
      plain: "The server proves who it is using a digital signature based on RSA. If a quantum computer forges this signature, it could impersonate your server and intercept all traffic.",
      risk: "HIGH",
      riskNote: "RSA-based certificates are forged by Shor's algorithm. CNSA 2.0 requires transition to ML-DSA-65 or ML-DSA-87 for certificates by 2030.",
      color: "#f97316",
    },
    pqc: {
      payload: "Certificate: ML-DSA-65 / ECDSA P-384 (hybrid)",
      plain: "The server proves its identity using a quantum-safe digital signature. It cannot be forged even with a quantum computer — your connection is guaranteed to be authentic.",
      risk: "PROTECTED",
      riskNote: "ML-DSA-65 is FIPS-approved under FIPS 204. Hybrid with ECDSA ensures compatibility with systems not yet PQC-capable.",
      color: "#22c55e",
    },
  },
  {
    id: 4,
    label: "Key Exchange",
    sublabel: "Creating the shared secret",
    classic: {
      payload: "ECDH key_share: x25519, 32-byte public key 4a7f...",
      plain: "Both sides perform a mathematical dance to create a shared encryption key — but this dance can be solved by a quantum computer, breaking the secrecy of everything that follows.",
      risk: "CRITICAL",
      riskNote: "This is the exact HNDL attack vector. Encrypted key exchange is recorded today for quantum decryption tomorrow. This is the highest-priority migration target.",
      color: "#ef4444",
    },
    pqc: {
      payload: "ML-KEM-768 encapsulation: ciphertext 1088 bytes, shared secret 32 bytes",
      plain: "The quantum-safe key encapsulation creates a shared secret that is mathematically impossible to extract — even with unlimited quantum computing power.",
      risk: "PROTECTED",
      riskNote: "ML-KEM-768 security is based on the Module Learning With Errors (M-LWE) problem, which has no known quantum speedup.",
      color: "#22c55e",
    },
  },
  {
    id: 5,
    label: "Handshake Complete",
    sublabel: "Secure channel established",
    classic: {
      payload: "Finished: HMAC-SHA384 verified. Session: AES-256-GCM",
      plain: "The encrypted session is open — but the keys that protect it were agreed using vulnerable methods. The session content is safe today, but not from future quantum threats.",
      risk: "HIGH",
      riskNote: "Post-handshake session data is secure against classical attacks but all key material is HNDL-vulnerable. Harvest-now attacks already in progress.",
      color: "#f97316",
    },
    pqc: {
      payload: "Finished: HMAC-SHA384 verified. Session: AES-256-GCM + ML-KEM keys",
      plain: "The encrypted session is open — protected by quantum-safe key material. This session cannot be broken today, tomorrow, or after quantum computers exist.",
      risk: "PROTECTED",
      riskNote: "Full CNSA 2.0 compliance achieved for this session. Keys, certificates, and symmetric cipher all meet NIST post-quantum standards.",
      color: "#22c55e",
    },
  },
];

const RISK_COLOR: Record<string, string> = {
  HIGH: "text-red-400 bg-red-500/10 border-red-500/30",
  CRITICAL: "text-red-300 bg-red-500/20 border-red-400/50",
  PROTECTED: "text-green-400 bg-green-500/10 border-green-500/30",
  LOW: "text-green-400 bg-green-500/10 border-green-500/30",
};

export default function HandshakeInspector() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showPacket, setShowPacket] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setShowPacket(false);
    const t = setTimeout(() => setShowPacket(true), 200);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setStep(s => {
          if (s >= STEPS.length - 1) { setPlaying(false); return s; }
          return s + 1;
        });
      }, 3000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playing]);

  const current = STEPS[step];

  return (
    <div className="min-h-full bg-background p-4 md:p-6 pb-16">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="font-mono text-xs text-cyan-500 uppercase tracking-widest mb-2 flex items-center gap-2">
          <Key className="w-3.5 h-3.5" /> TLS Handshake Inspector
        </div>
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
          Classical vs Quantum-Safe Encryption
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed">
          Every time two computers communicate securely, they perform a handshake. See exactly what is different between a vulnerable connection and a quantum-safe one — step by step.
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <button
          onClick={() => setPlaying(p => !p)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-mono uppercase tracking-wider transition-all ${
            playing ? "border-cyan-500 text-cyan-400 bg-cyan-500/10" : "border-border text-muted-foreground hover:border-cyan-500/40"
          }`}
        >
          {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {playing ? "Pause" : "Auto-Play"}
        </button>
        <button
          onClick={() => { setStep(0); setPlaying(false); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-orange-500/40 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
        <div className="ml-auto text-xs font-mono text-muted-foreground">
          Step {step + 1} of {STEPS.length}
        </div>
      </div>

      {/* Step navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => { setStep(i); setPlaying(false); }}
            className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono uppercase tracking-wider transition-all ${
              i === step
                ? "border-cyan-500 text-cyan-400 bg-cyan-500/10"
                : i < step
                ? "border-green-500/40 text-green-400/60 bg-green-500/5"
                : "border-border text-muted-foreground/50"
            }`}
          >
            {i < step ? <CheckCircle className="w-3 h-3" /> : <span className="w-3 h-3 flex items-center justify-center">{i + 1}</span>}
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Step label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mb-4"
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-sm">
              {step + 1}
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{current.label}</h2>
              <p className="text-xs text-muted-foreground">{current.sublabel}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Two-column comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Classical */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`classic-${step}`}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: "#ef444444" }}
          >
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "#ef444422", background: "#ef44440d" }}>
              <div className="flex items-center gap-2">
                <Unlock className="w-4 h-4 text-red-400" />
                <span className="font-bold text-red-400 text-sm uppercase tracking-wider">Classical — Vulnerable</span>
              </div>
              <div className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${RISK_COLOR[current.classic.risk]}`}>
                {current.classic.risk} RISK
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="font-mono text-xs text-muted-foreground bg-secondary/50 rounded px-3 py-2 border border-border break-all">
                {current.classic.payload}
              </div>
              <p className="text-sm text-foreground leading-relaxed">{current.classic.plain}</p>
              <div className="rounded border border-red-500/20 bg-red-500/5 p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-300/80 leading-relaxed">{current.classic.riskNote}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* PQC */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`pqc-${step}`}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: "#22c55e44" }}
          >
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "#22c55e22", background: "#22c55e0d" }}>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-green-400" />
                <span className="font-bold text-green-400 text-sm uppercase tracking-wider">Quantum-Safe</span>
              </div>
              <div className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${RISK_COLOR[current.pqc.risk]}`}>
                {current.pqc.risk}
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="font-mono text-xs text-muted-foreground bg-secondary/50 rounded px-3 py-2 border border-border break-all">
                {current.pqc.payload}
              </div>
              <p className="text-sm text-foreground leading-relaxed">{current.pqc.plain}</p>
              <div className="rounded border border-green-500/20 bg-green-500/5 p-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-green-300/80 leading-relaxed">{current.pqc.riskNote}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-muted-foreground text-sm font-mono uppercase tracking-wider hover:border-cyan-500/40 hover:text-foreground transition-all disabled:opacity-30"
        >
          ← Previous
        </button>
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-cyan-500 bg-cyan-500/10 text-cyan-300 text-sm font-mono uppercase tracking-wider hover:bg-cyan-500/20 transition-all"
          >
            Next Step <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => { setStep(0); setPlaying(false); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-green-500 bg-green-500/10 text-green-300 text-sm font-mono uppercase tracking-wider hover:bg-green-500/20 transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Restart
          </button>
        )}
      </div>

      {/* Key insight banner */}
      <div className="mt-8 rounded-xl border border-orange-500/30 bg-orange-500/5 p-4 md:p-6">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-orange-400 text-sm mb-1">The Key Difference</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Both handshakes look identical to users. The difference is invisible — until a quantum computer exists. 
              Today, nation-states are recording classical handshakes to decrypt them in 5-15 years. 
              <span className="text-orange-300 font-medium"> Migrating to quantum-safe encryption now protects data that must stay secret for years to come.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
