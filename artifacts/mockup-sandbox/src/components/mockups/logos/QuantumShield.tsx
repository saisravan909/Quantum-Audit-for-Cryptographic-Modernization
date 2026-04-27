export function QuantumShield() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#080d14" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap');
        @keyframes pulse-ring { 0%,100%{opacity:.25;transform:scale(1)} 50%{opacity:.6;transform:scale(1.04)} }
        @keyframes scan-line { 0%{transform:translateY(-60px);opacity:0} 20%{opacity:.7} 80%{opacity:.7} 100%{transform:translateY(60px);opacity:0} }
        @keyframes glyph-flicker { 0%,100%{opacity:.15} 50%{opacity:.45} }
        @keyframes hex-pulse { 0%,100%{filter:drop-shadow(0 0 8px #00d4ff88)} 50%{filter:drop-shadow(0 0 24px #00d4ffcc)} }
      `}</style>
      <div style={{ textAlign: "center", position: "relative" }}>
        <svg width="220" height="220" viewBox="0 0 220 220" style={{ animation: "hex-pulse 2.8s ease-in-out infinite", display: "block", margin: "0 auto" }}>
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#001a2e" />
              <stop offset="100%" stopColor="#00293f" />
            </linearGradient>
            <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff" />
              <stop offset="50%" stopColor="#0066ff" />
              <stop offset="100%" stopColor="#00d4ff" />
            </linearGradient>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0" />
              <stop offset="30%" stopColor="#00d4ff" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#0066ff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
            </linearGradient>
            <clipPath id="hexClip">
              <polygon points="110,15 195,60 195,160 110,205 25,160 25,60" />
            </clipPath>
          </defs>

          {/* Outer glow ring */}
          <polygon points="110,8 202,55 202,165 110,212 18,165 18,55"
            fill="none" stroke="#00d4ff" strokeWidth="1" strokeOpacity="0.25"
            style={{ animation: "pulse-ring 3s ease-in-out infinite" }} />

          {/* Main hexagon body */}
          <polygon points="110,15 195,60 195,160 110,205 25,160 25,60"
            fill="url(#shieldGrad)" stroke="url(#edgeGrad)" strokeWidth="2.5" />

          {/* Inner hex border */}
          <polygon points="110,28 183,68 183,152 110,192 37,152 37,68"
            fill="none" stroke="#00d4ff" strokeWidth="0.8" strokeOpacity="0.4" />

          {/* Scan line */}
          <rect x="25" y="110" width="170" height="2" fill="url(#waveGrad)" clipPath="url(#hexClip)"
            style={{ animation: "scan-line 3.5s ease-in-out infinite" }} />

          {/* Quantum wave paths */}
          {[-18, -6, 6, 18].map((offset, i) => (
            <path key={i}
              d={`M 48 ${110 + offset} Q 70 ${100 + offset} 90 ${110 + offset} Q 110 ${120 + offset} 130 ${110 + offset} Q 150 ${100 + offset} 170 ${110 + offset}`}
              fill="none" stroke="#00d4ff" strokeWidth="1" strokeOpacity={0.5 - i * 0.08}
              clipPath="url(#hexClip)" />
          ))}

          {/* Center Q mark */}
          <text x="110" y="128" textAnchor="middle"
            style={{ fontFamily: "'Orbitron', monospace", fontSize: "62px", fontWeight: 900, fill: "none", stroke: "#00d4ff", strokeWidth: "1.5", strokeOpacity: 0.9 }}>Q</text>
          <text x="110" y="128" textAnchor="middle"
            style={{ fontFamily: "'Orbitron', monospace", fontSize: "62px", fontWeight: 900, fill: "#00d4ff", fillOpacity: 0.15 }}>Q</text>

          {/* Corner accent dots */}
          {[[110, 18], [193, 62], [193, 158], [110, 202], [27, 158], [27, 62]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="3.5" fill="#00d4ff" fillOpacity="0.8"
              style={{ animation: `glyph-flicker ${1.5 + i * 0.3}s ease-in-out infinite` }} />
          ))}
        </svg>

        <div style={{ marginTop: "18px" }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: "20px", color: "#00d4ff", letterSpacing: "0.18em", lineHeight: 1 }}>
            QUANTUM
          </div>
          <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: "10px", color: "#0066ff", letterSpacing: "0.55em", marginTop: "4px" }}>
            AUDIT&nbsp;COMMAND
          </div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", color: "#00d4ff55", letterSpacing: "0.35em", marginTop: "8px" }}>
            CNSA 2.0 · PQC · ZERO TRUST
          </div>
        </div>
      </div>
    </div>
  );
}
