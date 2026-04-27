import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number; hue: number;
}

interface Props { width?: number; height?: number; scale?: number; }

export function QuantumKeyLogo({ width = 220, height = 130, scale = 1 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    const cx = W * 0.26, cy = H / 2;

    function spawn() {
      const a = Math.random() * Math.PI * 2;
      const r = 28 + Math.random() * 12;
      particlesRef.current.push({
        x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r,
        vx: (Math.random() - 0.5) * 0.7, vy: (Math.random() - 0.5) * 0.7,
        life: 0, maxLife: 70 + Math.random() * 60, size: 1 + Math.random() * 1.8, hue: 25 + Math.random() * 25,
      });
    }

    function draw() {
      timeRef.current += 0.02;
      const t = timeRef.current;
      ctx.clearRect(0, 0, W, H);

      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 140);
      bg.addColorStop(0, "rgba(15,4,0,1)");
      bg.addColorStop(1, "rgba(0,0,0,1)");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // Corona rings
      for (let i = 0; i < 3; i++) {
        const ph = ((t * 0.55 + i * 0.33) % 1);
        const r = 34 + ph * 55, a = (1 - ph) * 0.22;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(28, 100%, 60%, ${a})`; ctx.lineWidth = 1; ctx.stroke();
      }

      // Outer ring ticks
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 0.16);
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        ctx.beginPath(); ctx.moveTo(Math.cos(a) * 35, Math.sin(a) * 35);
        ctx.lineTo(Math.cos(a) * 40, Math.sin(a) * 40);
        ctx.strokeStyle = `hsla(28, 100%, 65%, ${0.5 + Math.sin(t * 2.2 + i) * 0.2})`; ctx.lineWidth = 1.5; ctx.stroke();
      }
      ctx.restore();

      // Middle ring
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(-t * 0.32);
      ctx.beginPath(); ctx.arc(0, 0, 29, 0, Math.PI * 2);
      ctx.setLineDash([3, 5]); ctx.strokeStyle = "hsla(30,100%,60%,0.3)"; ctx.lineWidth = 1; ctx.stroke();
      ctx.setLineDash([]); ctx.restore();

      // Orbital beads
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 0.68);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const g = ctx.createRadialGradient(Math.cos(a) * 21, Math.sin(a) * 21, 0, Math.cos(a) * 21, Math.sin(a) * 21, 4);
        g.addColorStop(0, "hsla(40,100%,85%,0.9)"); g.addColorStop(1, "transparent");
        ctx.beginPath(); ctx.arc(Math.cos(a) * 21, Math.sin(a) * 21, 3, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
      }
      ctx.restore();

      // Crystal
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 0.07);
      const pts = Array.from({ length: 8 }, (_, i) => [Math.cos((i / 8) * Math.PI * 2) * 17, Math.sin((i / 8) * Math.PI * 2) * 17]);
      ctx.beginPath(); pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)); ctx.closePath();
      const cg = ctx.createLinearGradient(-17, -17, 17, 17);
      cg.addColorStop(0, "rgba(255,140,0,0.2)"); cg.addColorStop(1, "rgba(180,40,0,0.08)");
      ctx.fillStyle = cg; ctx.fill();
      ctx.strokeStyle = "hsla(30,100%,65%,0.9)"; ctx.lineWidth = 1.5;
      ctx.shadowColor = "#ff8800"; ctx.shadowBlur = 14; ctx.stroke(); ctx.shadowBlur = 0;
      // Diamond
      ctx.beginPath(); [[0,-10],[10,0],[0,10],[-10,0]].forEach(([x,y],i)=>i===0?ctx.moveTo(x,y):ctx.lineTo(x,y)); ctx.closePath();
      const dg = ctx.createRadialGradient(0,0,0,0,0,11);
      dg.addColorStop(0,"rgba(255,200,80,1)"); dg.addColorStop(1,"rgba(200,40,0,0.5)");
      ctx.fillStyle = dg; ctx.shadowColor = "#ffaa00"; ctx.shadowBlur = 22; ctx.fill(); ctx.shadowBlur = 0;
      const core = ctx.createRadialGradient(0,0,0,0,0,4);
      core.addColorStop(0,"rgba(255,240,180,1)"); core.addColorStop(1,"transparent");
      ctx.beginPath(); ctx.arc(0,0,4,0,Math.PI*2); ctx.fillStyle=core; ctx.fill();
      ctx.restore();

      // Shaft
      const sx = cx + 20, sw = 82, sy = cy - 5, sh = 10;
      const sg = ctx.createLinearGradient(sx, 0, sx + sw, 0);
      sg.addColorStop(0,"rgba(220,80,0,0.95)"); sg.addColorStop(0.5,"rgba(255,140,0,1)"); sg.addColorStop(1,"rgba(160,40,0,0.85)");
      ctx.beginPath(); ctx.roundRect(sx,sy,sw,sh,5); ctx.fillStyle=sg;
      ctx.shadowColor="#ff6600"; ctx.shadowBlur=12; ctx.fill(); ctx.shadowBlur=0;
      // Data packets
      for(let i=0;i<3;i++){
        const ph=((t*1.4+i*0.33)%1); const px=sx+ph*sw;
        const pg=ctx.createRadialGradient(px,cy,0,px,cy,5);
        pg.addColorStop(0,"rgba(255,240,160,0.9)"); pg.addColorStop(1,"transparent");
        ctx.beginPath(); ctx.arc(px,cy,5,0,Math.PI*2); ctx.fillStyle=pg; ctx.fill();
      }
      // Teeth
      [{x:sx+16,h:9},{x:sx+28,h:6},{x:sx+40,h:11},{x:sx+50,h:5}].forEach(({x,h})=>{
        const tg=ctx.createLinearGradient(x,cy+5,x,cy+5+h);
        tg.addColorStop(0,"rgba(255,130,0,1)"); tg.addColorStop(1,"rgba(180,50,0,0.7)");
        ctx.beginPath(); ctx.roundRect(x,cy+5,6,h,2); ctx.fillStyle=tg;
        ctx.shadowColor="#ff6600"; ctx.shadowBlur=6; ctx.fill(); ctx.shadowBlur=0;
      });
      // Tip cap
      ctx.beginPath(); ctx.roundRect(sx+sw-1,sy-2,14,sh+4,4);
      const tg=ctx.createLinearGradient(sx+sw,0,sx+sw+14,0);
      tg.addColorStop(0,"rgba(255,160,0,1)"); tg.addColorStop(1,"rgba(200,60,0,0.9)");
      ctx.fillStyle=tg; ctx.shadowColor="#ffaa00"; ctx.shadowBlur=16; ctx.fill(); ctx.shadowBlur=0;

      // Particles
      if(Math.random()<0.3) spawn();
      particlesRef.current = particlesRef.current.filter(p=>p.life<p.maxLife);
      particlesRef.current.forEach(p=>{
        p.life++; p.x+=p.vx; p.y+=p.vy;
        const a=Math.sin((p.life/p.maxLife)*Math.PI)*0.75;
        const pg=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size*2);
        pg.addColorStop(0,`hsla(${p.hue},100%,80%,${a})`); pg.addColorStop(1,"transparent");
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size*2,0,Math.PI*2); ctx.fillStyle=pg; ctx.fill();
      });

      frameRef.current = requestAnimationFrame(draw);
    }
    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ display: "block", transform: `scale(${scale})`, transformOrigin: "top left" }}
    />
  );
}
