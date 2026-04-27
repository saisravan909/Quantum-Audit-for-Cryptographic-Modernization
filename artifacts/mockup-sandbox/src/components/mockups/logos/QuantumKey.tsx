export function QuantumKey() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0608" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap');
        @keyframes key-glow { 0%,100%{filter:drop-shadow(0 0 12px #ff660088)} 50%{filter:drop-shadow(0 0 28px #ff6600cc)} }
        @keyframes crystal-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes data-flow { 0%{stroke-dashoffset:60} 100%{stroke-dashoffset:0} }
        @keyframes amber-pulse { 0%,100%{fill-opacity:0.9} 50%{fill-opacity:1} }
      `}</style>
      <div style={{ textAlign: "center" }}>
        <svg width="220" height="200" viewBox="0 0 220 200" style={{ display: "block", margin: "0 auto", animation: "key-glow 2.6s ease-in-out infinite" }}>
          <defs>
            <linearGradient id="keyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff6600" />
              <stop offset="40%" stopColor="#ffaa00" />
              <stop offset="100%" stopColor="#ff3300" />
            </linearGradient>
            <linearGradient id="shaftGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff8800" />
              <stop offset="100%" stopColor="#cc4400" />
            </linearGradient>
            <radialGradient id="bowGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#201000" />
              <stop offset="70%" stopColor="#140800" />
              <stop offset="100%" stopColor="#0a0608" />
            </radialGradient>
            <filter id="keyGlowF">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Key bow (head) - octagonal quantum crystal */}
          <g transform="translate(62, 100)">
            {/* Outer crystal ring - spinning */}
            <g style={{ animation: "crystal-spin 12s linear infinite", transformOrigin: "0px 0px" }}>
              {[0,45,90,135,180,225,270,315].map(angle => {
                const rad = (angle * Math.PI) / 180;
                return <line key={angle} x1={Math.cos(rad)*38} y1={Math.sin(rad)*38}
                  x2={Math.cos(rad)*48} y2={Math.sin(rad)*48}
                  stroke="#ff6600" strokeWidth="2" strokeOpacity="0.5" />;
              })}
            </g>

            {/* Quantum crystal facets */}
            <polygon points="0,-42 29.7,-29.7 42,0 29.7,29.7 0,42 -29.7,29.7 -42,0 -29.7,-29.7"
              fill="url(#bowGrad)" stroke="url(#keyGrad)" strokeWidth="2" />
            <polygon points="0,-30 21.2,-21.2 30,0 21.2,21.2 0,30 -21.2,21.2 -30,0 -21.2,-21.2"
              fill="none" stroke="#ff8800" strokeWidth="1" strokeOpacity="0.5" />

            {/* Inner data flow ring */}
            <circle cx="0" cy="0" r="24" fill="none" stroke="#ff6600" strokeWidth="2"
              strokeDasharray="15 8"
              style={{ animation: "data-flow 2s linear infinite", strokeDashoffset: 60 }} />

            {/* Center diamond */}
            <polygon points="0,-14 10,0 0,14 -10,0"
              fill="url(#keyGrad)" filter="url(#keyGlowF)" style={{ animation: "amber-pulse 1.8s ease-in-out infinite" }} />

            {/* Diagonal cross lines */}
            <line x1="-42" y1="-42" x2="42" y2="42" stroke="#ff660022" strokeWidth="1" />
            <line x1="42" y1="-42" x2="-42" y2="42" stroke="#ff660022" strokeWidth="1" />
          </g>

          {/* Key shaft */}
          <rect x="104" y="94" width="85" height="12" rx="6" fill="url(#shaftGrad)" />

          {/* Key teeth — quantum bit notches */}
          {[128, 143, 158, 170].map((x, i) => (
            <rect key={i} x={x} y="106" width={i % 2 === 0 ? 10 : 7} height={i % 2 === 0 ? 12 : 9}
              rx="2" fill="url(#shaftGrad)" />
          ))}

          {/* Bit labels on shaft */}
          {["ML", "KEM", "768", "PQC"].map((label, i) => (
            <text key={i} x={115 + i * 20} y="101" textAnchor="middle"
              style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "6px", fill: "#ff880099", letterSpacing: "0px" }}>
              {label}
            </text>
          ))}

          {/* Key tip cap */}
          <rect x="183" y="91" width="16" height="18" rx="4" fill="url(#keyGrad)" />
        </svg>

        <div style={{ marginTop: "14px" }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: "19px", color: "#ff8800", letterSpacing: "0.16em" }}>
            QUANTUM
          </div>
          <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: "10px", color: "#ff6600", letterSpacing: "0.5em", marginTop: "4px" }}>
            AUDIT&nbsp;COMMAND
          </div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "8.5px", color: "#ff660033", letterSpacing: "0.3em", marginTop: "8px" }}>
            EO 14028 · NSM-10 · eBPF
          </div>
        </div>
      </div>
    </div>
  );
}
