export function OrbitalLock() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#05080f" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap');
        @keyframes orbit-1 { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes orbit-2 { from{transform:rotate(90deg)} to{transform:rotate(450deg)} }
        @keyframes orbit-3 { from{transform:rotate(200deg)} to{transform:rotate(560deg)} }
        @keyframes lock-glow { 0%,100%{filter:drop-shadow(0 0 12px #b060ff88)} 50%{filter:drop-shadow(0 0 28px #b060ffcc)} }
        @keyframes electron-pulse { 0%,100%{r:4;fill-opacity:1} 50%{r:6;fill-opacity:0.7} }
      `}</style>
      <div style={{ textAlign: "center", position: "relative" }}>
        <svg width="200" height="200" viewBox="0 0 200 200" style={{ display: "block", margin: "0 auto", animation: "lock-glow 2.5s ease-in-out infinite" }}>
          <defs>
            <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2a0050" />
              <stop offset="100%" stopColor="#0d0020" />
            </radialGradient>
            <radialGradient id="lockBodyGrad" cx="50%" cy="55%" r="50%">
              <stop offset="0%" stopColor="#c080ff" />
              <stop offset="60%" stopColor="#8020e0" />
              <stop offset="100%" stopColor="#4a00a0" />
            </radialGradient>
          </defs>

          {/* Background circle */}
          <circle cx="100" cy="100" r="90" fill="url(#centerGrad)" stroke="#b060ff" strokeWidth="1" strokeOpacity="0.3" />

          {/* Orbit 1 — 72px radius, tilted 20deg */}
          <g transform="translate(100,100) rotate(20)">
            <ellipse cx="0" cy="0" rx="72" ry="26" fill="none" stroke="#b060ff" strokeWidth="1.2" strokeOpacity="0.5"
              style={{ transform: "rotate3d(1,0,0,70deg)" }} />
            <g style={{ animation: "orbit-1 5s linear infinite", transformOrigin: "0 0" }}>
              <circle cx="72" cy="0" r="5" fill="#b060ff">
                <animate attributeName="r" values="4;6;4" dur="2.5s" repeatCount="indefinite" />
              </circle>
            </g>
          </g>

          {/* Orbit 2 — 72px radius, tilted 80deg */}
          <g transform="translate(100,100) rotate(80)">
            <ellipse cx="0" cy="0" rx="72" ry="22" fill="none" stroke="#7040ff" strokeWidth="1.2" strokeOpacity="0.45" />
            <g style={{ animation: "orbit-2 7s linear infinite", transformOrigin: "0 0" }}>
              <circle cx="72" cy="0" r="4.5" fill="#7040ff">
                <animate attributeName="r" values="3.5;5.5;3.5" dur="3.5s" repeatCount="indefinite" />
              </circle>
            </g>
          </g>

          {/* Orbit 3 — 72px radius, tilted -30deg */}
          <g transform="translate(100,100) rotate(-30)">
            <ellipse cx="0" cy="0" rx="72" ry="30" fill="none" stroke="#d080ff" strokeWidth="1" strokeOpacity="0.35" />
            <g style={{ animation: "orbit-3 9s linear infinite", transformOrigin: "0 0" }}>
              <circle cx="-72" cy="0" r="4" fill="#d080ff">
                <animate attributeName="r" values="3;5;3" dur="4.5s" repeatCount="indefinite" />
              </circle>
            </g>
          </g>

          {/* Lock body - shackle */}
          <path d="M 84 94 L 84 82 Q 84 68 100 68 Q 116 68 116 82 L 116 94"
            fill="none" stroke="url(#lockBodyGrad)" strokeWidth="8" strokeLinecap="round" />

          {/* Lock body - rectangle */}
          <rect x="78" y="92" width="44" height="36" rx="6" fill="url(#lockBodyGrad)" />

          {/* Keyhole */}
          <circle cx="100" cy="106" r="7" fill="#0d0020" />
          <rect x="97" y="109" width="6" height="10" rx="2" fill="#0d0020" />

          {/* Center dot */}
          <circle cx="100" cy="100" r="3" fill="#b060ff" fillOpacity="0.6" />
        </svg>

        <div style={{ marginTop: "16px" }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: "19px", color: "#b060ff", letterSpacing: "0.15em" }}>
            QUANTUM
          </div>
          <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: "10px", color: "#7040ff", letterSpacing: "0.5em", marginTop: "4px" }}>
            AUDIT&nbsp;COMMAND
          </div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "8.5px", color: "#b060ff44", letterSpacing: "0.3em", marginTop: "8px" }}>
            ML-KEM · ML-DSA · ZTA
          </div>
        </div>
      </div>
    </div>
  );
}
