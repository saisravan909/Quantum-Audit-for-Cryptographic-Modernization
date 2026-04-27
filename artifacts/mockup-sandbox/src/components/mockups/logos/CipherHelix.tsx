export function CipherHelix() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#030b0a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap');
        @keyframes helix-glow { 0%,100%{filter:drop-shadow(0 0 10px #00ff9988)} 50%{filter:drop-shadow(0 0 22px #00ff99cc)} }
        @keyframes bit-stream { 0%{transform:translateY(-8px);opacity:0} 20%{opacity:1} 80%{opacity:1} 100%{transform:translateY(8px);opacity:0} }
        @keyframes strand-pulse { 0%,100%{stroke-opacity:.6} 50%{stroke-opacity:1} }
      `}</style>
      <div style={{ textAlign: "center" }}>
        <svg width="180" height="220" viewBox="0 0 180 220" style={{ display: "block", margin: "0 auto", animation: "helix-glow 2.4s ease-in-out infinite" }}>
          <defs>
            <linearGradient id="strandA" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00ff99" />
              <stop offset="50%" stopColor="#00cc77" />
              <stop offset="100%" stopColor="#009955" />
            </linearGradient>
            <linearGradient id="strandB" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00ccff" />
              <stop offset="50%" stopColor="#0099dd" />
              <stop offset="100%" stopColor="#0066bb" />
            </linearGradient>
            <filter id="glowF">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Double helix strands */}
          {Array.from({ length: 12 }, (_, i) => {
            const y = 20 + i * 15;
            const phase = (i / 12) * Math.PI * 2;
            const x1 = 90 + Math.sin(phase) * 48;
            const x2 = 90 + Math.sin(phase + Math.PI) * 48;
            return (
              <g key={i}>
                {/* Cross bridge */}
                <line x1={x1} y1={y} x2={x2} y2={y}
                  stroke={i % 2 === 0 ? "#00ff99" : "#00ccff"} strokeWidth="1.5" strokeOpacity="0.4" />
                {/* Strand A node */}
                <circle cx={x1} cy={y} r="5" fill="url(#strandA)" filter="url(#glowF)" />
                {/* Strand B node */}
                <circle cx={x2} cy={y} r="5" fill="url(#strandB)" filter="url(#glowF)" />
                {/* Hex chars on bridges */}
                <text x="90" y={y + 4} textAnchor="middle"
                  style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "7px", fill: "#00ff9955", letterSpacing: "1px" }}>
                  {["6399", "020F", "0202", "001D", "ML-K", "KEM7", "DSA6", "NSM1", "PQC!", "0017", "ZT/0", "CBOM"][i]}
                </text>
              </g>
            );
          })}

          {/* Strand A curve (left) */}
          <path d={`M ${90 + Math.sin(0) * 48} 20 ` + Array.from({ length: 12 }, (_, i) => {
            const y = 20 + i * 15;
            const phase = (i / 12) * Math.PI * 2;
            return `L ${90 + Math.sin(phase) * 48} ${y}`;
          }).join(" ")}
            fill="none" stroke="url(#strandA)" strokeWidth="2.5" strokeLinecap="round"
            style={{ animation: "strand-pulse 2s ease-in-out infinite", opacity: 0.7 }} />

          {/* Strand B curve (right) */}
          <path d={`M ${90 + Math.sin(Math.PI) * 48} 20 ` + Array.from({ length: 12 }, (_, i) => {
            const y = 20 + i * 15;
            const phase = (i / 12) * Math.PI * 2;
            return `L ${90 + Math.sin(phase + Math.PI) * 48} ${y}`;
          }).join(" ")}
            fill="none" stroke="url(#strandB)" strokeWidth="2.5" strokeLinecap="round"
            style={{ animation: "strand-pulse 2s ease-in-out infinite 1s", opacity: 0.7 }} />
        </svg>

        <div style={{ marginTop: "8px" }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: "18px", color: "#00ff99", letterSpacing: "0.18em" }}>
            QUANTUM
          </div>
          <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: "9.5px", color: "#00ccff", letterSpacing: "0.52em", marginTop: "4px" }}>
            AUDIT&nbsp;COMMAND
          </div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "8px", color: "#00ff9933", letterSpacing: "0.3em", marginTop: "7px" }}>
            HNDL · CBOM · CNSA 2.0
          </div>
        </div>
      </div>
    </div>
  );
}
