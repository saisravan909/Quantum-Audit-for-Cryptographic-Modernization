import { useEffect, useRef, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

export function QuantumKey() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => p + 1), 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = 82;
    const cy = H / 2;

    function spawnParticle() {
      const angle = Math.random() * Math.PI * 2;
      const r = 52 + Math.random() * 22;
      particlesRef.current.push({
        id: Math.random(),
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        life: 0,
        maxLife: 90 + Math.random() * 80,
        size: 1 + Math.random() * 2.5,
        hue: 25 + Math.random() * 30,
      });
    }

    function draw() {
      timeRef.current += 0.018;
      const t = timeRef.current;

      ctx.clearRect(0, 0, W, H);

      // Background void — deep space
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 200);
      bg.addColorStop(0, "rgba(18,4,0,1)");
      bg.addColorStop(0.4, "rgba(8,2,0,1)");
      bg.addColorStop(1, "rgba(0,0,0,1)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Nebula wisps
      for (let i = 0; i < 3; i++) {
        const nx = cx + Math.sin(t * 0.3 + i * 2.1) * 30;
        const ny = cy + Math.cos(t * 0.2 + i * 1.7) * 20;
        const ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, 80 + i * 20);
        ng.addColorStop(0, `hsla(${20 + i * 15}, 100%, 50%, 0.04)`);
        ng.addColorStop(1, "transparent");
        ctx.fillStyle = ng;
        ctx.fillRect(0, 0, W, H);
      }

      // --- Expanding corona rings ---
      for (let ring = 0; ring < 3; ring++) {
        const phase = (t * 0.6 + ring * 0.33) % 1;
        const r = 55 + phase * 90;
        const alpha = (1 - phase) * 0.25;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(30, 100%, 60%, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // --- Outer spinning ring (slowest) ---
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.18);
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        const r1 = 58, r2 = 66;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
        ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
        ctx.strokeStyle = `hsla(${20 + i * 3}, 100%, 65%, ${0.4 + Math.sin(t * 2 + i) * 0.2})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.restore();

      // --- Middle spinning ring (medium speed) ---
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-t * 0.35);
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const x1 = Math.cos(a) * 44, y1 = Math.sin(a) * 44;
        const x2 = Math.cos(a) * 53, y2 = Math.sin(a) * 53;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `hsla(35, 100%, 70%, ${0.6 + Math.sin(t * 3 + i * 0.5) * 0.3})`;
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.stroke();
      }
      // Dashed circle
      ctx.beginPath();
      ctx.arc(0, 0, 48, 0, Math.PI * 2);
      ctx.setLineDash([4, 6]);
      ctx.strokeStyle = "hsla(30, 100%, 60%, 0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // --- Inner fast-spinning ring ---
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.72);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const gx = Math.cos(a) * 34, gy = Math.sin(a) * 34;
        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, 8);
        grad.addColorStop(0, "hsla(40, 100%, 85%, 0.9)");
        grad.addColorStop(1, "hsla(25, 100%, 55%, 0)");
        ctx.beginPath();
        ctx.arc(gx, gy, 5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
      ctx.restore();

      // --- Crystal bow polygon ---
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.08);
      // 8-sided crystal
      const pts8 = Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return [Math.cos(a) * 28, Math.sin(a) * 28];
      });
      ctx.beginPath();
      pts8.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
      ctx.closePath();
      const crystalGrad = ctx.createLinearGradient(-28, -28, 28, 28);
      crystalGrad.addColorStop(0, "rgba(255,140,0,0.22)");
      crystalGrad.addColorStop(0.5, "rgba(255,80,0,0.12)");
      crystalGrad.addColorStop(1, "rgba(180,40,0,0.08)");
      ctx.fillStyle = crystalGrad;
      ctx.fill();
      ctx.strokeStyle = "hsla(30, 100%, 65%, 0.9)";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#ff8800";
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Inner diamond
      const pts4 = [[0, -16], [16, 0], [0, 16], [-16, 0]];
      ctx.beginPath();
      pts4.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
      ctx.closePath();
      const diamondGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 18);
      diamondGrad.addColorStop(0, "rgba(255,200,80,1)");
      diamondGrad.addColorStop(0.5, "rgba(255,100,0,0.9)");
      diamondGrad.addColorStop(1, "rgba(200,40,0,0.5)");
      ctx.fillStyle = diamondGrad;
      ctx.shadowColor = "#ffaa00";
      ctx.shadowBlur = 35;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Center core
      const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 7);
      coreGrad.addColorStop(0, "rgba(255,240,180,1)");
      coreGrad.addColorStop(1, "rgba(255,140,0,0)");
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();
      ctx.restore();

      // --- Shaft ---
      const shaftX = cx + 32;
      const shaftW = 118;
      const shaftY = cy - 7;
      const shaftH = 14;

      // Shaft base
      const shaftGrad = ctx.createLinearGradient(shaftX, shaftY, shaftX + shaftW, shaftY + shaftH);
      shaftGrad.addColorStop(0, "rgba(220,80,0,0.95)");
      shaftGrad.addColorStop(0.4, "rgba(255,140,0,1)");
      shaftGrad.addColorStop(1, "rgba(160,40,0,0.85)");
      ctx.beginPath();
      ctx.roundRect(shaftX, shaftY, shaftW, shaftH, 7);
      ctx.fillStyle = shaftGrad;
      ctx.shadowColor = "#ff6600";
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Shaft top highlight
      const highlightGrad = ctx.createLinearGradient(shaftX, shaftY, shaftX, shaftY + 5);
      highlightGrad.addColorStop(0, "rgba(255,220,120,0.5)");
      highlightGrad.addColorStop(1, "rgba(255,120,0,0)");
      ctx.beginPath();
      ctx.roundRect(shaftX + 2, shaftY + 1, shaftW - 4, 5, 4);
      ctx.fillStyle = highlightGrad;
      ctx.fill();

      // Data flow packets along shaft
      for (let p = 0; p < 5; p++) {
        const phase = ((t * 1.4 + p * 0.2) % 1);
        const px = shaftX + phase * shaftW;
        const pg = ctx.createRadialGradient(px, cy, 0, px, cy, 6);
        pg.addColorStop(0, "rgba(255,240,160,0.95)");
        pg.addColorStop(1, "rgba(255,160,0,0)");
        ctx.beginPath();
        ctx.arc(px, cy, 6, 0, Math.PI * 2);
        ctx.fillStyle = pg;
        ctx.fill();
      }

      // Shaft hex labels
      ["ML", "KEM", "768", "PQC"].forEach((label, i) => {
        const lx = shaftX + 12 + i * 28;
        ctx.fillStyle = "rgba(255,220,100,0.55)";
        ctx.font = "bold 6px 'Share Tech Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(label, lx, cy - 10);
      });

      // --- Key teeth ---
      const teethData = [
        { x: shaftX + 24, h: 14 },
        { x: shaftX + 40, h: 10 },
        { x: shaftX + 55, h: 16 },
        { x: shaftX + 70, h: 8 },
      ];
      teethData.forEach(({ x, h }) => {
        const tg = ctx.createLinearGradient(x, cy + 7, x, cy + 7 + h);
        tg.addColorStop(0, "rgba(255,130,0,1)");
        tg.addColorStop(1, "rgba(180,50,0,0.7)");
        ctx.beginPath();
        ctx.roundRect(x, cy + 7, 9, h, 2);
        ctx.fillStyle = tg;
        ctx.shadowColor = "#ff6600";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // --- Key tip cap ---
      const tipGrad = ctx.createLinearGradient(shaftX + shaftW - 2, shaftY - 2, shaftX + shaftW + 18, shaftY + shaftH + 2);
      tipGrad.addColorStop(0, "rgba(255,160,0,1)");
      tipGrad.addColorStop(1, "rgba(200,60,0,0.9)");
      ctx.beginPath();
      ctx.roundRect(shaftX + shaftW - 2, shaftY - 3, 20, shaftH + 6, 5);
      ctx.fillStyle = tipGrad;
      ctx.shadowColor = "#ffaa00";
      ctx.shadowBlur = 22;
      ctx.fill();
      ctx.shadowBlur = 0;

      // --- Particles ---
      if (Math.random() < 0.35) spawnParticle();
      particlesRef.current = particlesRef.current.filter(p => p.life < p.maxLife);
      particlesRef.current.forEach(p => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.005;
        const alpha = Math.sin((p.life / p.maxLife) * Math.PI) * 0.85;
        const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        pg.addColorStop(0, `hsla(${p.hue}, 100%, 80%, ${alpha})`);
        pg.addColorStop(1, `hsla(${p.hue}, 100%, 60%, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = pg;
        ctx.fill();
      });

      // --- Floating orbit particles ---
      for (let i = 0; i < 6; i++) {
        const a = t * (0.4 + i * 0.07) + (i * Math.PI * 2) / 6;
        const r = 70 + Math.sin(t * 1.2 + i) * 8;
        const ox = cx + Math.cos(a) * r;
        const oy = cy + Math.sin(a) * r;
        const og = ctx.createRadialGradient(ox, oy, 0, ox, oy, 5);
        og.addColorStop(0, `hsla(${25 + i * 8}, 100%, 80%, 0.9)`);
        og.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(ox, oy, 4, 0, Math.PI * 2);
        ctx.fillStyle = og;
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(draw);
    }

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const glowIntensity = 0.7 + Math.sin(pulse * 0.15) * 0.3;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: "#000000", position: "relative", overflow: "hidden" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
        @keyframes title-glow {
          0%,100% { text-shadow: 0 0 12px #ff8800, 0 0 30px #ff660066, 0 0 60px #ff440022; }
          50%      { text-shadow: 0 0 20px #ffaa00, 0 0 50px #ff8800aa, 0 0 90px #ff660044; }
        }
        @keyframes sub-flicker {
          0%,90%,100% { opacity: 0.45; }
          92% { opacity: 0.9; }
          95% { opacity: 0.3; }
          97% { opacity: 0.8; }
        }
        @keyframes scan-h {
          0%   { transform: translateY(-200px); opacity: 0; }
          10%  { opacity: 0.06; }
          90%  { opacity: 0.06; }
          100% { transform: translateY(200px); opacity: 0; }
        }
        @keyframes badge-pulse {
          0%,100% { box-shadow: 0 0 0 0 #ff660044; }
          50%     { box-shadow: 0 0 0 6px #ff660000; }
        }
      `}</style>

      {/* Scanline overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)",
      }} />

      {/* Horizontal scan beam */}
      <div style={{
        position: "absolute", left: 0, right: 0, height: "2px",
        background: "linear-gradient(90deg, transparent, rgba(255,140,0,0.35), transparent)",
        animation: "scan-h 4s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={320}
        height={200}
        style={{ display: "block" }}
      />

      {/* Title block */}
      <div style={{ textAlign: "center", marginTop: "6px", position: "relative" }}>
        {/* ML-KEM badge */}
        <div style={{
          display: "inline-block", marginBottom: "10px",
          padding: "2px 10px", border: "1px solid rgba(255,140,0,0.4)",
          borderRadius: "2px", animation: "badge-pulse 2.5s ease-in-out infinite",
        }}>
          <span style={{
            fontFamily: "'Share Tech Mono', monospace", fontSize: "7.5px",
            color: "rgba(255,180,60,0.8)", letterSpacing: "0.35em",
          }}>
            ML-KEM-768 · CNSA 2.0 COMPLIANT
          </span>
        </div>

        <div style={{
          fontFamily: "'Orbitron', monospace", fontWeight: 900,
          fontSize: "22px", color: "#ff9900",
          letterSpacing: "0.22em", lineHeight: 1,
          animation: "title-glow 2.8s ease-in-out infinite",
        }}>
          QUANTUM
        </div>

        <div style={{
          fontFamily: "'Orbitron', monospace", fontWeight: 700,
          fontSize: "10.5px", color: "#cc5500",
          letterSpacing: "0.62em", marginTop: "5px",
        }}>
          AUDIT COMMAND
        </div>

        {/* Divider */}
        <div style={{
          margin: "8px auto",
          width: "180px", height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(255,140,0,0.7), transparent)",
        }} />

        <div style={{
          fontFamily: "'Share Tech Mono', monospace", fontSize: "7.5px",
          color: "rgba(255,120,0,0.45)",
          letterSpacing: "0.28em",
          animation: "sub-flicker 7s ease-in-out infinite",
        }}>
          EO 14028 · NSM-10 · eBPF · HNDL DEFENSE
        </div>
      </div>
    </div>
  );
}
