"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

/* =============================================================
   FLUIDIC PIPELINE  ·  scroll-linked liquid + flowing particles
   Story: each program's liquid fills toward its target phase as
   the user scrolls. Phase column headers light up when the
   liquid crosses them. Particles drift inside the active fluid.
   ============================================================= */

type Indication = {
  name: string;
  desc: string;
  // 0–4 scale: 0=start, 1=end Pre-clinical, 2=end Phase I, 3=end Phase II, 4=end Phase III
  progress: number;
  color: string;
  status: string;
};

const INDICATIONS: Indication[] = [
  { name: "Lymphedema", desc: "Phase II — enrolling", progress: 2.9, color: "#F0564A", status: "ENROLLING" },
  { name: "Lipedema", desc: "Phase II — dose ranging", progress: 2.5, color: "#F0564A", status: "ONGOING" },
  { name: "Lymphatic Targeting", desc: "Preclinical exploration", progress: 0.75, color: "#5BCBD7", status: "DISCOVERY" },
  { name: "Topical Delivery", desc: "Formulation studies", progress: 0.75, color: "#F08435", status: "DISCOVERY" },
];

const PHASES = ["PRE-CLIN", "PHASE I", "PHASE II", "PHASE III"];

const W = 1000;
const ROW_H = 80;
const HEAD_H = 60;
const LABEL_W = 240;
const TRACK_X = LABEL_W + 24;
const TRACK_W = W - TRACK_X - 24;
const ROWS = INDICATIONS.length;
const H = HEAD_H + ROWS * ROW_H;

const phaseX = (i: number) => TRACK_X + (TRACK_W / 4) * (i + 1);

function FluidicRow({
  ind,
  index,
  enter,
  exit,
}: {
  ind: Indication;
  index: number;
  enter: MotionValue<number>;
  exit: MotionValue<number>;
}) {
  const stagger = index * 0.1;
  const localEnter = useTransform(enter, [stagger, stagger + 0.55], [0, 1], { clamp: true });

  const targetWidth = (ind.progress / 4) * TRACK_W;
  const fillWidth = useTransform(localEnter, (v) => targetWidth * v);
  const fillEnd = useTransform(localEnter, (v) => TRACK_X + targetWidth * v);

  // Exit: fluid recedes
  const recede = useTransform(exit, [0, 1], [1, 0]);
  const finalWidth = useTransform([fillWidth, recede] as MotionValue[], (latest) => {
    const [w, r] = latest as number[];
    return w * r;
  });
  const finalEnd = useTransform([fillEnd, recede] as MotionValue[], (latest) => {
    const [e, r] = latest as number[];
    return TRACK_X + (e - TRACK_X) * r;
  });

  const rowOpacity = useTransform([localEnter, exit] as MotionValue[], (latest) => {
    const [e, x] = latest as number[];
    return Math.min(1, e * 1.5) * (1 - x);
  });

  const rowY = HEAD_H + index * ROW_H + ROW_H / 2;
  const trackY = rowY - 12;

  // 5 particles drifting in the liquid
  const particles = [0, 1, 2, 3, 4];

  return (
    <motion.g style={{ opacity: rowOpacity }}>
      {/* Label */}
      <text x={20} y={rowY - 4} fill="#ffffff" fontSize="15" fontWeight="800" fontFamily="system-ui">
        {ind.name}
      </text>
      <text x={20} y={rowY + 14} fill="#94a3b8" fontSize="10" fontWeight="600" letterSpacing="0.8" fontFamily="ui-monospace, monospace">
        {ind.desc.toUpperCase()}
      </text>

      {/* Track (glass tube background) */}
      <rect
        x={TRACK_X}
        y={trackY}
        width={TRACK_W}
        height={24}
        rx={12}
        fill="#0a0f1e"
        stroke="#1e293b"
        strokeWidth="1"
      />
      {/* Subtle inner depth */}
      <rect
        x={TRACK_X + 1}
        y={trackY + 1}
        width={TRACK_W - 2}
        height={6}
        rx={3}
        fill="#000000"
        opacity="0.4"
      />

      {/* Phase tick lines on the track */}
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1={TRACK_X + (TRACK_W / 4) * (i + 1)}
          x2={TRACK_X + (TRACK_W / 4) * (i + 1)}
          y1={trackY + 4}
          y2={trackY + 20}
          stroke="#1e293b"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
      ))}

      {/* Liquid fill */}
      <defs>
        <linearGradient id={`fluid-${index}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={ind.color} stopOpacity="0.55" />
          <stop offset="50%" stopColor={ind.color} stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
        </linearGradient>
        <clipPath id={`clip-${index}`}>
          <rect x={TRACK_X} y={trackY} width={TRACK_W} height={24} rx={12} />
        </clipPath>
      </defs>

      <g clipPath={`url(#clip-${index})`}>
        <motion.rect
          x={TRACK_X}
          y={trackY}
          width={finalWidth}
          height={24}
          fill={`url(#fluid-${index})`}
          style={{ filter: `drop-shadow(0 0 12px ${ind.color})` }}
        />
        {/* Glass highlight on top of the fluid */}
        <motion.rect
          x={TRACK_X}
          y={trackY + 2}
          width={finalWidth}
          height={5}
          fill="#ffffff"
          style={{ opacity: 0.35 }}
        />
        {/* Drifting particles inside the liquid */}
        {particles.map((p) => (
          <circle key={p} r="2" fill="#ffffff">
            <animate
              attributeName="cx"
              from={TRACK_X}
              to={TRACK_X + targetWidth}
              dur={`${3 + (p % 3) * 0.7}s`}
              repeatCount="indefinite"
              begin={`${p * 0.7}s`}
            />
            <animate
              attributeName="cy"
              values={`${trackY + 8};${trackY + 16};${trackY + 8};${trackY + 16};${trackY + 8}`}
              dur={`${3 + (p % 3) * 0.7}s`}
              repeatCount="indefinite"
              begin={`${p * 0.7}s`}
            />
            <animate
              attributeName="opacity"
              values="0;0.95;0.95;0"
              keyTimes="0;0.1;0.85;1"
              dur={`${3 + (p % 3) * 0.7}s`}
              repeatCount="indefinite"
              begin={`${p * 0.7}s`}
            />
          </circle>
        ))}
      </g>

      {/* Leading edge bubble */}
      <motion.circle
        cx={finalEnd}
        cy={trackY + 12}
        r={9}
        fill={ind.color}
        style={{ opacity: useTransform(localEnter, [0.1, 0.4], [0, 0.85], { clamp: true }), filter: `drop-shadow(0 0 14px ${ind.color})` }}
      />
      <motion.circle
        cx={finalEnd}
        cy={trackY + 12}
        r={3.5}
        fill="#ffffff"
        style={{ opacity: useTransform(localEnter, [0.1, 0.4], [0, 1], { clamp: true }) }}
      />

      {/* Status chip aligned to the end of the fill */}
      <motion.g style={{ opacity: useTransform(localEnter, [0.7, 1], [0, 1], { clamp: true }) }}>
        <rect
          x={TRACK_X + targetWidth + 16}
          y={trackY - 2}
          width={ind.status.length * 6.5 + 18}
          height={20}
          rx={10}
          fill="#0a0f1e"
          stroke={ind.color}
          strokeWidth="1.2"
        />
        <text
          x={TRACK_X + targetWidth + 16 + (ind.status.length * 6.5 + 18) / 2}
          y={trackY + 12}
          fill={ind.color}
          fontSize="9"
          fontWeight="900"
          textAnchor="middle"
          letterSpacing="1.4"
          fontFamily="ui-monospace, monospace"
        >
          {ind.status}
        </text>
      </motion.g>
    </motion.g>
  );
}

function PhaseHeader({
  label,
  index,
  maxProgress,
  enter,
}: {
  label: string;
  index: number;
  maxProgress: number; // 0–4
  enter: MotionValue<number>;
}) {
  const x = TRACK_X + (TRACK_W / 4) * index + TRACK_W / 8;
  // Light up if ANY indication has progressed past this phase boundary
  // index = 0 (Pre-clin), 1 (Phase I), etc — light up if progress > index + 0.3 (i.e. any liquid in this column)
  const isReached = maxProgress > index + 0.05;
  const liteOpacity = useTransform(
    enter,
    [0.4, 0.8],
    isReached ? [0.6, 1] : [0.3, 0.45],
    { clamp: true }
  );
  const liteColor = isReached ? "#F0564A" : "#475569";

  return (
    <motion.g style={{ opacity: liteOpacity }}>
      <rect
        x={x - 50}
        y={20}
        width={100}
        height={26}
        rx={13}
        fill={isReached ? `${liteColor}22` : "transparent"}
        stroke={isReached ? `${liteColor}66` : "#1e293b"}
        strokeWidth="1"
      />
      <text
        x={x}
        y={37}
        fill={isReached ? "#ffffff" : "#94a3b8"}
        fontSize="10"
        fontWeight="900"
        textAnchor="middle"
        letterSpacing="1.6"
        fontFamily="ui-monospace, monospace"
      >
        {label}
      </text>
    </motion.g>
  );
}

export default function CellTaxisPipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const enter = useTransform(scrollYProgress, [0.1, 0.5], [0, 1], { clamp: true });
  const exit = useTransform(scrollYProgress, [0.7, 0.95], [0, 1], { clamp: true });
  const blurAmt = useTransform(exit, [0, 1], [0, 5]);
  const filterStr = useTransform(blurAmt, (v) => `blur(${v}px)`);
  const stageOpacity = useTransform(exit, [0, 1], [1, 0]);

  const maxProgress = Math.max(...INDICATIONS.map((i) => i.progress));

  return (
    <div ref={ref} className="w-full bg-[#070710] rounded-3xl sm:rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden relative">
      {/* Ambient orbs */}
      <motion.div
        className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(240,86,74,0.15) 0%, transparent 65%)", filter: "blur(80px)" }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(91,203,215,0.13) 0%, transparent 65%)", filter: "blur(70px)" }}
        animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0 opacity-[0.022] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 p-5 sm:p-8 md:p-10">
        {/* HUD HEADER */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F0564A] animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-[#5BCBD7]">
                ▣ CLINICAL PIPELINE · LIVE
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-white tracking-tight">
              Programs in motion
            </h3>
          </div>
          <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10">
            <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">4 programs</span>
            <span className="w-px h-3 bg-white/15" />
            <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">2 in Phase II</span>
          </div>
        </div>

        {/* DESKTOP CANVAS */}
        <motion.div className="hidden md:block relative" style={{ filter: filterStr, opacity: stageOpacity }}>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
            {/* Phase column highlights — drawn behind the rows */}
            {PHASES.map((p, i) => (
              <rect
                key={p}
                x={TRACK_X + (TRACK_W / 4) * i}
                y={HEAD_H}
                width={TRACK_W / 4}
                height={ROWS * ROW_H}
                fill={i % 2 === 0 ? "rgba(255,255,255,0.012)" : "transparent"}
              />
            ))}

            {/* Phase column dividers */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1={TRACK_X + (TRACK_W / 4) * i}
                x2={TRACK_X + (TRACK_W / 4) * i}
                y1={HEAD_H}
                y2={HEAD_H + ROWS * ROW_H}
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
              />
            ))}

            {/* Phase headers — light up when reached */}
            {PHASES.map((p, i) => (
              <PhaseHeader key={p} label={p} index={i} maxProgress={maxProgress} enter={enter} />
            ))}

            {/* Pipeline rows */}
            {INDICATIONS.map((ind, i) => (
              <FluidicRow key={ind.name} ind={ind} index={i} enter={enter} exit={exit} />
            ))}
          </svg>
        </motion.div>

        {/* MOBILE — stacked compact cards */}
        <motion.div className="md:hidden space-y-5" style={{ filter: filterStr, opacity: stageOpacity }}>
          <MobilePipeline enter={enter} exit={exit} />
        </motion.div>

        {/* FOOTER LEGEND */}
        <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between flex-wrap gap-2">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {INDICATIONS.map((i) => (
              <div key={i.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: i.color, boxShadow: `0 0 6px ${i.color}` }} />
                <span className="text-[9px] sm:text-[10px] font-bold text-white/60 uppercase tracking-[0.1em]">
                  {i.name}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] italic text-white/35 font-medium">Continuous-flow visualization</p>
        </div>
      </div>
    </div>
  );
}

function MobilePipeline({ enter, exit }: { enter: MotionValue<number>; exit: MotionValue<number> }) {
  return (
    <>
      {INDICATIONS.map((ind, i) => (
        <MobileRow key={ind.name} ind={ind} index={i} enter={enter} exit={exit} />
      ))}
    </>
  );
}

function MobileRow({ ind, index, enter, exit }: { ind: Indication; index: number; enter: MotionValue<number>; exit: MotionValue<number> }) {
  const stagger = index * 0.1;
  const localEnter = useTransform(enter, [stagger, stagger + 0.55], [0, 1], { clamp: true });
  const recede = useTransform(exit, [0, 1], [1, 0]);
  const widthPct = useTransform([localEnter, recede] as MotionValue[], (latest) => {
    const [e, r] = latest as number[];
    return `${(ind.progress / 4) * 100 * e * r}%`;
  });
  const rowOpacity = useTransform([localEnter, exit] as MotionValue[], (latest) => {
    const [e, x] = latest as number[];
    return Math.min(1, e * 1.5) * (1 - x);
  });

  return (
    <motion.div style={{ opacity: rowOpacity }} className="space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-white font-bold text-sm leading-tight">{ind.name}</p>
          <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/50 mt-0.5">{ind.desc}</p>
        </div>
        <span
          className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black tracking-wider border"
          style={{ color: ind.color, borderColor: `${ind.color}66`, background: `${ind.color}1A` }}
        >
          {ind.status}
        </span>
      </div>
      <div className="flex items-center justify-between gap-1 text-[8px] font-mono font-black text-white/40 px-0.5 tracking-wider">
        {PHASES.map((p) => (
          <span key={p}>{p}</span>
        ))}
      </div>
      <div className="relative h-5 bg-[#0a0f1e] rounded-full border border-slate-800 overflow-hidden">
        <div className="absolute inset-0 flex">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex-1 border-r border-slate-800/60 last:border-r-0" />
          ))}
        </div>
        <motion.div
          className="absolute top-0 bottom-0 left-0 rounded-full"
          style={{
            width: widthPct,
            background: `linear-gradient(90deg, ${ind.color}88 0%, ${ind.color} 60%, #ffffff 100%)`,
            boxShadow: `0 0 12px ${ind.color}`,
          }}
        />
      </div>
    </motion.div>
  );
}
