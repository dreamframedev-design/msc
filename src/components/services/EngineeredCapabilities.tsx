"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Atom, LayoutDashboard, GitBranch, Sparkles } from "lucide-react";

// ============================================================
// HELPERS
// ============================================================
type ShowcaseProps = {
  enter: MotionValue<number>;
  exit: MotionValue<number>;
};

// Combine two motion values into one via a transformer
function useCombined<T>(values: MotionValue<number>[], fn: (latest: number[]) => T) {
  return useTransform(values, fn as (v: number[]) => T);
}

// ============================================================
// 1. DATA PULSE — animated SVG biomarker chart
// ============================================================
const DP_DATA = [12, 18, 15, 32, 28, 48, 42, 65, 58, 78, 72, 92, 88];
const DP_W = 400;
const DP_H = 280;
const DP_PAD_X = 30;
const DP_PAD_Y = 30;

const DP_POINTS = (() => {
  const stepX = (DP_W - DP_PAD_X * 2) / (DP_DATA.length - 1);
  const maxV = Math.max(...DP_DATA);
  return DP_DATA.map((v, i) => {
    const x = DP_PAD_X + i * stepX;
    const y = DP_H - DP_PAD_Y - (v / maxV) * (DP_H - DP_PAD_Y * 2);
    // deterministic scatter direction
    const angle = (i / DP_DATA.length) * Math.PI * 2 + i * 0.7;
    return {
      x,
      y,
      v,
      scatterX: Math.cos(angle) * (80 + (i % 3) * 30),
      scatterY: Math.sin(angle) * (80 + (i % 4) * 30),
    };
  });
})();

const DP_LINE_PATH = DP_POINTS.reduce(
  (acc, p, i) => acc + (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`),
  ""
);
const DP_AREA_PATH = `${DP_LINE_PATH} L ${DP_POINTS[DP_POINTS.length - 1].x} ${DP_H - DP_PAD_Y} L ${DP_POINTS[0].x} ${DP_H - DP_PAD_Y} Z`;

function DPDot({ point, index, enter, exit }: { point: typeof DP_POINTS[number]; index: number } & ShowcaseProps) {
  const t = index / DP_POINTS.length;
  const dotEnter = useTransform(enter, [t * 0.6, t * 0.6 + 0.45], [0, 1], { clamp: true });
  const cx = useTransform(exit, [0, 1], [point.x, point.x + point.scatterX]);
  const cy = useTransform(exit, [0, 1], [point.y, point.y + point.scatterY]);
  const opacity = useCombined([dotEnter, exit], ([e, x]) => e * (1 - x));
  const scale = useCombined([dotEnter, exit], ([e, x]) => e * (1 - x * 0.3));
  const ringR = useTransform(exit, [0, 1], [6, 22]);
  const ringOpacity = useCombined([dotEnter, exit], ([e, x]) => e * 0.3 * (1 - x));

  return (
    <motion.g style={{ opacity, scale } as any}>
      <motion.circle cx={cx} cy={cy} r={ringR} fill="#F0564A" style={{ opacity: ringOpacity }} />
      <motion.circle cx={cx} cy={cy} r={3} fill="#F0564A" stroke="#fff" strokeWidth={1.2} />
    </motion.g>
  );
}

function DataPulseShowcase({ enter, exit }: ShowcaseProps) {
  const areaOpacity = useCombined([enter, exit], ([e, x]) => e * (1 - x));
  const lineOpacity = useCombined([enter, exit], ([e, x]) => Math.min(1, e * 1.2) * (1 - x));
  const headerOpacity = useCombined([enter, exit], ([e, x]) => e * (1 - x));
  const lastDot = DP_POINTS[DP_POINTS.length - 1];
  const labelEnter = useTransform(enter, [0.85, 1], [0, 1], { clamp: true });
  const labelOpacity = useCombined([labelEnter, exit], ([e, x]) => e * (1 - x));
  const labelY = useTransform(labelEnter, [0, 1], [lastDot.y - 22, lastDot.y - 32]);
  const blurAmt = useTransform(exit, [0, 1], [0, 6]);
  const filterStr = useTransform(blurAmt, (v) => `blur(${v}px)`);

  return (
    <motion.svg
      viewBox={`0 0 ${DP_W} ${DP_H}`}
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
      style={{ filter: filterStr }}
    >
      <defs>
        <linearGradient id="dp-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0564A" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#F0564A" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="dp-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5BCBD7" />
          <stop offset="100%" stopColor="#F0564A" />
        </linearGradient>
        <filter id="dp-glow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* grid */}
      {[0.25, 0.5, 0.75].map((t) => (
        <line
          key={t}
          x1={DP_PAD_X}
          x2={DP_W - DP_PAD_X}
          y1={DP_PAD_Y + (DP_H - DP_PAD_Y * 2) * t}
          y2={DP_PAD_Y + (DP_H - DP_PAD_Y * 2) * t}
          stroke="rgba(255,255,255,0.06)"
          strokeDasharray="3 4"
        />
      ))}

      {/* axis labels */}
      <motion.g style={{ opacity: headerOpacity }}>
        {["100", "75", "50", "25"].map((label, i) => (
          <text key={label} x={DP_PAD_X - 8} y={DP_PAD_Y + (DP_H - DP_PAD_Y * 2) * (i * 0.25) + 4} fill="rgba(255,255,255,0.35)" fontSize="11" textAnchor="end" fontFamily="monospace">
            {label}
          </text>
        ))}
        {["D0", "D7", "D14", "D21"].map((label, i) => (
          <text key={label} x={DP_PAD_X + i * ((DP_W - DP_PAD_X * 2) / 3)} y={DP_H - DP_PAD_Y + 16} fill="rgba(255,255,255,0.35)" fontSize="11" textAnchor="middle" fontFamily="monospace">
            {label}
          </text>
        ))}
      </motion.g>

      {/* area */}
      <motion.path d={DP_AREA_PATH} fill="url(#dp-area)" style={{ opacity: areaOpacity }} />

      {/* line — scroll-linked draw */}
      <motion.path
        d={DP_LINE_PATH}
        fill="none"
        stroke="url(#dp-line)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#dp-glow)"
        style={{ pathLength: enter, opacity: lineOpacity }}
      />

      {/* points — scroll-linked stagger + exit scatter */}
      {DP_POINTS.map((p, i) => (
        <DPDot key={i} point={p} index={i} enter={enter} exit={exit} />
      ))}

      {/* floating callout */}
      <motion.g style={{ opacity: labelOpacity }}>
        <motion.rect
          x={lastDot.x - 50}
          width="44"
          height="20"
          rx="10"
          fill="rgba(240,86,74,0.9)"
          y={labelY}
        />
        <motion.text
          x={lastDot.x - 28}
          y={useTransform(labelY, (v) => v + 14)}
          fill="white"
          fontSize="10"
          fontWeight="700"
          textAnchor="middle"
        >
          92 pg/mL
        </motion.text>
      </motion.g>

      {/* title chip */}
      <motion.g style={{ opacity: headerOpacity }}>
        <rect x={DP_PAD_X} y={DP_PAD_Y - 18} width="155" height="14" rx="7" fill="rgba(91,203,215,0.15)" />
        <text x={DP_PAD_X + 10} y={DP_PAD_Y - 8} fill="#5BCBD7" fontSize="11" fontWeight="700" letterSpacing="1.5">
          PLASMA IL-1β · COHORT A
        </text>
      </motion.g>
    </motion.svg>
  );
}

// ============================================================
// 2. PARTICLE NETWORK — canvas, scroll-linked enter + explode-on-exit
// ============================================================
function ParticleNetworkShowcase({ enter, exit }: ShowcaseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const enterRef = useRef(enter.get());
  const exitRef = useRef(exit.get());

  useMotionValueEvent(enter, "change", (v) => { enterRef.current = v; });
  useMotionValueEvent(exit, "change", (v) => { exitRef.current = v; });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let width = 0;
    let height = 0;

    type P = {
      x: number; y: number;
      vx: number; vy: number;
      ox: number; oy: number; // origin for enter staggering
      ex: number; ey: number; // explode direction
      r: number;
      color: string;
      delay: number; // 0..1 stagger
    };
    const colors = ["#F0564A", "#5BCBD7", "#F08435"];
    const count = 32;
    let particles: P[] = [];

    const seed = () => {
      particles = [];
      for (let i = 0; i < count; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const angle = Math.random() * Math.PI * 2;
        const explodeSpeed = 180 + Math.random() * 320;
        particles.push({
          x, y,
          ox: x, oy: y,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          ex: Math.cos(angle) * explodeSpeed,
          ey: Math.sin(angle) * explodeSpeed,
          r: 2 + Math.random() * 2.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 0.5,
        });
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width === 0 || height === 0) return;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (particles.length === 0) seed();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // Pause rAF when canvas is off-screen — perf win when multiple instances are mounted
    let isVisible = true;
    const io = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
        if (isVisible && !rafId) tick();
      },
      { rootMargin: "100px" }
    );
    io.observe(canvas);

    let rafId = 0;
    const linkDist = 110;

    const tick = () => {
      if (!isVisible) {
        rafId = 0;
        return;
      }
      if (width === 0 || height === 0 || particles.length === 0) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      const e = enterRef.current;
      const x_ = exitRef.current;
      const explodeFactor = x_; // 0..1
      const fade = 1 - x_;

      ctx.clearRect(0, 0, width, height);

      // move particles around their origin
      for (const p of particles) {
        // gentle drift
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      // lines (only when somewhat present)
      if (fade > 0.05) {
        for (let i = 0; i < particles.length; i++) {
          const a = particles[i];
          const aVis = Math.max(0, Math.min(1, (e - a.delay) / (1 - a.delay))) * fade;
          if (aVis < 0.05) continue;
          const ax = a.x + a.ex * explodeFactor;
          const ay = a.y + a.ey * explodeFactor;
          for (let j = i + 1; j < particles.length; j++) {
            const b = particles[j];
            const bVis = Math.max(0, Math.min(1, (e - b.delay) / (1 - b.delay))) * fade;
            if (bVis < 0.05) continue;
            const bx = b.x + b.ex * explodeFactor;
            const by = b.y + b.ey * explodeFactor;
            const dx = ax - bx;
            const dy = ay - by;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < linkDist) {
              const alpha = (1 - d / linkDist) * Math.min(aVis, bVis) * 0.18;
              ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(ax, ay);
              ctx.lineTo(bx, by);
              ctx.stroke();
            }
          }
        }
      }

      // dots
      for (const p of particles) {
        const vis = Math.max(0, Math.min(1, (e - p.delay) / (1 - p.delay))) * fade;
        if (vis < 0.02) continue;
        const px = p.x + p.ex * explodeFactor;
        const py = p.y + p.ey * explodeFactor;
        const r = p.r * (1 - explodeFactor * 0.4);

        // glow
        const grd = ctx.createRadialGradient(px, py, 0, px, py, r * 5);
        const alphaHex = Math.round(vis * 0x88).toString(16).padStart(2, "0");
        grd.addColorStop(0, `${p.color}${alphaHex}`);
        grd.addColorStop(1, `${p.color}00`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(px, py, r * 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = p.color;
        ctx.globalAlpha = vis;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const hudOpacity = useCombined([enter, exit], ([e, x]) => e * (1 - x));

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <motion.div
        className="absolute top-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.18em] text-white/40 pointer-events-none"
        style={{ opacity: hudOpacity }}
      >
        <span className="text-[#5BCBD7]/80">▣ MOLECULAR FIELD · LIVE</span>
        <span>32 NODES</span>
      </motion.div>
      <motion.div
        className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.18em] text-white/40 pointer-events-none"
        style={{ opacity: hudOpacity }}
      >
        <span>60 FPS</span>
        <span className="text-[#F0564A]/80">RENDER · CANVAS</span>
      </motion.div>
    </div>
  );
}

// ============================================================
// 3. PIPELINE — scroll-linked bar fills + exit retract
// ============================================================
const PROGRAMS = [
  { name: "MSC-401", indication: "Solid Tumor", phase: 3, color: "#F0564A" },
  { name: "MSC-202", indication: "Autoimmune", phase: 2, color: "#5BCBD7" },
  { name: "MSC-118", indication: "Rare Disease", phase: 4, color: "#F08435" },
  { name: "MSC-051", indication: "Oncology / IO", phase: 1.5, color: "#FAAC40" },
];

function PipelineBar({ p, index, enter, exit }: { p: typeof PROGRAMS[number]; index: number } & ShowcaseProps) {
  const target = (p.phase / 4) * 100;
  const stagger = index * 0.12;
  const fillEnter = useTransform(enter, [stagger, stagger + 0.55], [0, target], { clamp: true });
  const widthPct = useCombined([fillEnter, exit], ([w, x]) => w * (1 - x));
  const width = useTransform(widthPct, (v) => `${v}%`);
  const rowOpacity = useCombined([enter, exit], ([e, x]) => Math.min(1, Math.max(0, (e - stagger * 0.5) / 0.4)) * (1 - x));
  const rowX = useTransform(exit, [0, 1], [0, -40 - index * 10]);
  const rowSkew = useTransform(exit, [0, 1], [0, -4]);

  return (
    <motion.div className="relative" style={{ opacity: rowOpacity, x: rowX, skewX: rowSkew }}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-bold text-white">{p.name}</span>
        <span className="text-[10px] uppercase tracking-wider text-white/40">{p.indication}</span>
      </div>
      <div className="relative h-7 rounded-full bg-white/5 border border-white/10 overflow-hidden">
        <div className="absolute inset-0 flex">
          {[0, 1, 2, 3].map((t) => (
            <div key={t} className="flex-1 border-r border-white/[0.04] last:border-r-0" />
          ))}
        </div>
        <motion.div
          className="absolute top-0 bottom-0 left-0 rounded-full"
          style={{
            width,
            background: `linear-gradient(90deg, ${p.color}DD 0%, ${p.color} 100%)`,
            boxShadow: `0 0 20px ${p.color}66`,
          }}
        >
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <motion.div
              className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-[-20deg]"
              initial={{ x: "-100%" }}
              animate={{ x: "300%" }}
              transition={{ duration: 3, delay: 1.5 + index * 0.3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
            />
          </div>
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        </motion.div>
      </div>
    </motion.div>
  );
}

function PipelineShowcase({ enter, exit }: ShowcaseProps) {
  const headerOpacity = useCombined([enter, exit], ([e, x]) => e * (1 - x));
  return (
    <div className="w-full h-full p-6 flex flex-col justify-center gap-5">
      <motion.div className="flex items-center justify-between mb-2" style={{ opacity: headerOpacity }}>
        <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#5BCBD7]/80">▣ CLINICAL PIPELINE</div>
        <div className="flex gap-3 text-[9px] uppercase tracking-wider text-white/40 font-bold">
          <span>PRECLIN</span><span>I</span><span>II</span><span>III</span><span>APPRV</span>
        </div>
      </motion.div>
      {PROGRAMS.map((p, i) => (
        <PipelineBar key={p.name} p={p} index={i} enter={enter} exit={exit} />
      ))}
    </div>
  );
}

// ============================================================
// 4. DASHBOARD — scroll-linked KPI counters + sparklines + exit scatter
// ============================================================
const KPIS = [
  { label: "MAU", value: 24, suffix: "K", trend: "+18%", color: "#F0564A", spark: [3, 5, 4, 7, 6, 9, 12, 14] },
  { label: "Engagement", value: 87, suffix: "%", trend: "+6%", color: "#5BCBD7", spark: [60, 65, 62, 70, 72, 78, 82, 87] },
  { label: "Deals Closed", value: 12, trend: "+3", color: "#F08435", spark: [2, 3, 4, 5, 7, 8, 10, 12] },
  { label: "Time-to-Close", value: 8.4, suffix: "d", trend: "-14%", color: "#FAAC40", spark: [14, 13, 11, 12, 10, 9, 9, 8.4] },
];

function CountByMotion({ enter, exit, to, suffix = "" }: { enter: MotionValue<number>; exit: MotionValue<number>; to: number; suffix?: string }) {
  const value = useTransform(enter, (e) => {
    const eased = Math.min(1, e * 1.5);
    return Number.isInteger(to)
      ? Math.round(eased * to).toLocaleString()
      : (eased * to).toFixed(1);
  });
  return (
    <span className="inline-flex items-baseline">
      <motion.span>{value}</motion.span>
      {suffix && <span className="opacity-70 ml-0.5">{suffix}</span>}
    </span>
  );
}

function KpiCard({ k, index, enter, exit }: { k: typeof KPIS[number]; index: number } & ShowcaseProps) {
  const stagger = index * 0.08;
  const cardEnter = useTransform(enter, [stagger, stagger + 0.4], [0, 1], { clamp: true });
  const opacity = useCombined([cardEnter, exit], ([e, x]) => e * (1 - x));
  // exit: scatter to a corner
  const dx = (index % 2 === 0 ? -1 : 1) * 80;
  const dy = (index < 2 ? -1 : 1) * 60;
  const x = useTransform(exit, [0, 1], [0, dx]);
  const y = useTransform(exit, [0, 1], [0, dy]);
  const rot = useTransform(exit, [0, 1], [0, (index % 2 === 0 ? -1 : 1) * 8]);
  const scaleEnter = useTransform(cardEnter, [0, 1], [0.92, 1]);
  const scaleExit = useTransform(exit, [0, 1], [1, 0.92]);
  const scale = useCombined([scaleEnter, scaleExit], ([se, sx]) => se * sx);

  const max = Math.max(...k.spark);
  const min = Math.min(...k.spark);
  const range = max - min || 1;
  const W = 100;
  const H = 28;
  const points = k.spark.map((v, j) => `${(j / (k.spark.length - 1)) * W},${H - ((v - min) / range) * H}`).join(" ");
  const sparkEnter = useTransform(enter, [stagger + 0.2, stagger + 0.6], [0, 1], { clamp: true });

  return (
    <motion.div
      style={{ opacity, x, y, rotate: rot, scale }}
      className="relative p-3 rounded-xl border bg-white/[0.03] border-white/[0.08] overflow-hidden"
    >
      <div
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-30"
        style={{ background: `radial-gradient(circle, ${k.color}, transparent 70%)` }}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] font-bold uppercase tracking-wider text-white/40">{k.label}</span>
          <span className="text-[9px] font-bold text-emerald-400">{k.trend}</span>
        </div>
        <div className="text-xl font-bold text-white mb-1.5 leading-none">
          <CountByMotion enter={enter} exit={exit} to={k.value} suffix={k.suffix} />
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-6" preserveAspectRatio="none">
          <motion.polyline
            points={points}
            fill="none"
            stroke={k.color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: sparkEnter }}
          />
        </svg>
      </div>
    </motion.div>
  );
}

function DashboardShowcase({ enter, exit }: ShowcaseProps) {
  const headerOpacity = useCombined([enter, exit], ([e, x]) => e * (1 - x));
  return (
    <div className="w-full h-full p-5 flex flex-col gap-4">
      <motion.div className="flex items-center justify-between" style={{ opacity: headerOpacity }}>
        <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#5BCBD7]/80">▣ IR DASHBOARD · Q3</div>
        <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE
        </div>
      </motion.div>
      <div className="grid grid-cols-2 gap-3 flex-1">
        {KPIS.map((k, i) => (
          <KpiCard key={k.label} k={k} index={i} enter={enter} exit={exit} />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// CAPABILITY DEFINITIONS
// ============================================================
type Capability = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  Icon: typeof BarChart3;
  accent: string;
  Showcase: React.ComponentType<ShowcaseProps>;
};

const CAPABILITIES: Capability[] = [
  {
    id: "cap-data-viz",
    title: "Interactive Data Visualization",
    eyebrow: "01 · Live Data, Live Story",
    description:
      "Turn assay readouts, clinical endpoints, and biomarker traces into beautiful, interactive charts that move with your narrative. Custom-built animations, premium typography, branded color systems — not the generic Highcharts your competitors use.",
    Icon: BarChart3,
    accent: "#F0564A",
    Showcase: DataPulseShowcase,
  },
  {
    id: "cap-simulation",
    title: "WebGL & Scientific Simulation",
    eyebrow: "02 · Visualizations That Move",
    description:
      "From CFD particle simulations of microfluidic devices to animated molecular fields, DNA helices, and orbital ligand-binding scenes — we engineer Canvas and WebGL backdrops that capture the energy of your science. Performant on mobile, rendered in real time.",
    Icon: Atom,
    accent: "#5BCBD7",
    Showcase: ParticleNetworkShowcase,
  },
  {
    id: "cap-pipeline",
    title: "Pipeline & Program Visualization",
    eyebrow: "03 · Your Pipeline, In Motion",
    description:
      "Show stakeholders exactly where each program stands with custom-built, animated pipeline graphics. Continuous-flow liquid metaphors, phase-tracking horizontal bars, and interactive program drill-downs — designed to make complex portfolios click instantly.",
    Icon: GitBranch,
    accent: "#F08435",
    Showcase: PipelineShowcase,
  },
  {
    id: "cap-applications",
    title: "Custom Portals & Dashboards",
    eyebrow: "04 · Software, Not Just Sites",
    description:
      "Client portals, investor-relations dashboards, real-time data widgets, internal admin tools — we ship secure full-stack applications that extend your brand far beyond a static homepage. From file vaults to live ticker integrations, we build it.",
    Icon: LayoutDashboard,
    accent: "#FAAC40",
    Showcase: DashboardShowcase,
  },
];

// ============================================================
// CAPABILITY ROW
// ============================================================
function CapabilityRow({
  cap,
  index,
  total,
  portalTarget,
  onProgressChange,
}: {
  cap: Capability;
  index: number;
  total: number;
  portalTarget: HTMLDivElement | null;
  onProgressChange: (index: number, visibility: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Final tuned thresholds: starts at 12%, peaks at 38%, holds, disintegrates 52→85%
  const enter = useTransform(scrollYProgress, [0.12, 0.38], [0, 1], { clamp: true });
  const exit = useTransform(scrollYProgress, [0.52, 0.85], [0, 1], { clamp: true });
  const visibility = useCombined([enter, exit], ([e, x]) => e * (1 - x));

  useMotionValueEvent(visibility, "change", (v) => onProgressChange(index, v));

  const Showcase = cap.Showcase;
  const textActive = useCombined([enter, exit], ([e, x]) => {
    const v = e * (1 - x);
    return 0.4 + v * 0.6; // 0.4 (inactive) → 1 (peak)
  });

  const stickyContent = (
    <motion.div className="absolute inset-0" style={{ opacity: visibility }}>
      <Showcase enter={enter} exit={exit} />
    </motion.div>
  );

  return (
    <div
      ref={ref}
      id={cap.id}
      className="capability-item min-h-[78vh] lg:min-h-[90vh] flex flex-col justify-center py-12 sm:py-16 lg:py-24 border-b border-white/5 last:border-0"
    >
      {portalTarget && createPortal(stickyContent, portalTarget)}

      {/* Mobile inline showcase */}
      <div className="lg:hidden w-full aspect-[5/4] sm:aspect-[4/5] relative rounded-3xl overflow-hidden mb-8 shadow-xl border border-white/10 bg-[#0A0A14]">
        {/* Accent glow on mobile too */}
        <div
          className="absolute -inset-2 rounded-3xl blur-2xl -z-10 opacity-50"
          style={{ background: `linear-gradient(135deg, ${cap.accent}40 0%, transparent 60%, ${cap.accent}30 100%)` }}
        />
        <Showcase enter={enter} exit={exit} />
        {/* Mobile counter chip */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-xl border border-white/15 z-20">
          <span className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: cap.accent }} />
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/90">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>

      <motion.div style={{ opacity: textActive } as any}>
        <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
          <div
            className="p-2.5 rounded-xl border"
            style={{
              backgroundColor: `${cap.accent}1A`,
              borderColor: `${cap.accent}30`,
              color: cap.accent,
            }}
          >
            <cap.Icon className="w-5 h-5" />
          </div>
          <span className="font-bold tracking-[0.22em] uppercase text-[10px] sm:text-xs" style={{ color: cap.accent }}>
            {cap.eyebrow}
          </span>
        </div>
        <h3 className="text-display text-3xl sm:text-4xl md:text-5xl text-white mb-5 sm:mb-6">
          {cap.title}
        </h3>
        <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed font-light">
          {cap.description}
        </p>
        <div className="mt-8 sm:mt-10">
          <Link
            href="/portfolio"
            className="link-reveal inline-flex items-center gap-2 text-white hover:text-[#F0564A] transition-colors font-medium group"
          >
            See it in the portfolio
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
// MAIN SECTION
// ============================================================
export function EngineeredCapabilities() {
  const stickyAreaRef = useRef<HTMLDivElement>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const visRef = useRef<number[]>([0, 0, 0, 0]);
  const activeRef = useRef(0);

  useEffect(() => {
    setPortalTarget(stickyAreaRef.current);
  }, []);

  const handleProgress = useCallback((index: number, v: number) => {
    visRef.current[index] = v;
    let maxIdx = 0;
    let maxV = visRef.current[0];
    for (let i = 1; i < visRef.current.length; i++) {
      if (visRef.current[i] > maxV) {
        maxV = visRef.current[i];
        maxIdx = i;
      }
    }
    if (maxIdx !== activeRef.current) {
      activeRef.current = maxIdx;
      setActiveIndex(maxIdx);
    }
  }, []);

  const active = CAPABILITIES[activeIndex];

  return (
    // NOTE: no overflow-hidden on the <section> — it would kill position:sticky on descendants.
    // Orbs are clipped via their own overflow-hidden wrapper below.
    <section className="relative bg-[#070710]">
      {/* HEADER */}
      <div className="relative pt-24 sm:pt-32 pb-12 sm:pb-16 text-center">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(91,203,215,0.18) 0%, transparent 70%)", filter: "blur(80px)" }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-5 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs font-bold text-[#5BCBD7] uppercase tracking-[0.2em]">
              <Sparkles className="w-3 h-3" />
              Beyond the Brochure
            </div>
            <h2 className="text-display text-4xl sm:text-5xl md:text-6xl text-white mb-5 sm:mb-6">
              More than a website.<br />
              <span className="text-aurora">A platform.</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed">
              Our team includes full-stack engineers, data-visualization specialists, and motion designers. When the brief calls for it, we ship product — not just pages. Scroll through to see the engineered capabilities behind our portfolio&apos;s most ambitious work.
            </p>
          </motion.div>
        </div>
      </div>

      {/* STICKY-SCROLL BODY */}
      <div className="relative">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-[15%] right-[8%] w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(91,203,215,0.13) 0%, transparent 65%)", filter: "blur(90px)" }}
            animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
            transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[10%] left-[5%] w-[700px] h-[700px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(240,86,74,0.12) 0%, transparent 65%)", filter: "blur(100px)" }}
            animate={{ x: [0, 50, 0], y: [0, -40, 0] }}
            transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          />
          <div
            className="absolute inset-0 opacity-[0.022]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="container mx-auto px-5 sm:px-6 md:px-12 lg:px-24 relative z-10">
          <div className="flex flex-col lg:flex-row relative">

            {/* Sticky Showcase Card (desktop) */}
            <div className="hidden lg:block w-1/2 relative">
              <div className="sticky top-0 h-screen flex items-center justify-center py-24 pr-16">
                <div className="relative w-full aspect-[4/5] rounded-[2.5rem] shadow-2xl border border-white/10 bg-[#0A0A14]">
                  <motion.div
                    key={active.id + "-glow"}
                    initial={false}
                    animate={{ opacity: 0.55 }}
                    transition={{ duration: 0.8 }}
                    className="absolute -inset-2 rounded-[2.5rem] blur-2xl -z-10"
                    style={{
                      background: `linear-gradient(135deg, ${active.accent}40 0%, transparent 50%, ${active.accent}30 100%)`,
                    }}
                  />

                  {/* PORTAL DESTINATION — all showcases mount here */}
                  <div
                    ref={stickyAreaRef}
                    className="absolute inset-0 rounded-[2.5rem] overflow-hidden"
                  />

                  {/* Counter chip */}
                  <div className="absolute top-5 left-5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/15 z-20">
                    <motion.span
                      key={active.id + "-dot"}
                      initial={{ scale: 1.6 }}
                      animate={{ scale: 1 }}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: active.accent }}
                    />
                    <span className="text-eyebrow text-white/90">
                      {String(activeIndex + 1).padStart(2, "0")} / {String(CAPABILITIES.length).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Active label */}
                  <motion.div
                    key={active.id + "-label"}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute bottom-6 left-6 right-6 z-20 flex justify-start"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-xs font-semibold text-white">
                      <active.Icon className="w-3.5 h-3.5" style={{ color: active.accent }} />
                      <span>{active.title}</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Scrolling capability rows */}
            <div className="w-full lg:w-1/2 py-12 sm:py-16 lg:py-32">
              {CAPABILITIES.map((cap, i) => (
                <CapabilityRow
                  key={cap.id}
                  cap={cap}
                  index={i}
                  total={CAPABILITIES.length}
                  portalTarget={portalTarget}
                  onProgressChange={handleProgress}
                />
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* CLOSING CTA */}
      <div className="relative py-20 sm:py-24 text-center">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="container relative z-10 mx-auto px-5 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <p className="text-eyebrow text-[#5BCBD7] mb-4">Got something ambitious in mind?</p>
            <h3 className="text-display text-3xl sm:text-4xl md:text-5xl text-white mb-6">
              Let&apos;s engineer something <span className="text-aurora">remarkable</span>.
            </h3>
            <Link href="/contact">
              <Button
                size="lg"
                className="group bg-[#F0564A] text-white hover:bg-[#D94D42] rounded-full px-8 sm:px-10 py-6 text-base sm:text-lg glow-spark-sm glow-spark-hover"
              >
                Start a Conversation
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
