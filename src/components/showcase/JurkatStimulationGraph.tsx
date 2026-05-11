"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

/* =============================================================
   T-CELL ACTIVATION ASSAY  ·  scroll-linked custom SVG bar chart
   Story: vehicle baseline → monotherapies → dramatic synergy
   ============================================================= */

const BARS = [
  { label: "Vehicle", value: 0, color: "#94a3b8", strokeColor: "#cbd5e1", role: "Control", isWinner: false },
  { label: "Agonist A", value: 240, color: "#5BCBD7", strokeColor: "#5BCBD7", role: "Monotherapy", isWinner: false },
  { label: "Agonist B", value: 5, color: "#F08435", strokeColor: "#F08435", role: "Monotherapy", isWinner: false },
  { label: "Combo", value: 640, color: "#F0564A", strokeColor: "#F0564A", role: "Combination", isWinner: true },
];

const MAX = 700;
const W = 600;
const H = 400;
const PAD_L = 64;
const PAD_R = 24;
const PAD_T = 48;
const PAD_B = 72;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;
const PLOT_TOP = PAD_T;
const PLOT_BOTTOM = PAD_T + PLOT_H;
const BAR_W = 64;
const STEP = (PLOT_W - BAR_W) / (BARS.length - 1);

function BarRenderer({
  bar,
  index,
  enter,
}: {
  bar: (typeof BARS)[number];
  index: number;
  enter: MotionValue<number>;
}) {
  const stagger = index * 0.11;
  const localEnter = useTransform(enter, [stagger, stagger + 0.55], [0, 1], { clamp: true });
  const labelEnter = useTransform(enter, [stagger + 0.2, stagger + 0.7], [0, 1], { clamp: true });

  const targetH = (bar.value / MAX) * PLOT_H;
  const x = PAD_L + index * STEP;
  const barH = useTransform(localEnter, (v) => targetH * v);
  const barY = useTransform(localEnter, (v) => PLOT_BOTTOM - targetH * v);
  const labelY = useTransform(localEnter, (v) => PLOT_BOTTOM - targetH * v - 10);
  const glowOpacity = useTransform(
    localEnter,
    [0.5, 1],
    bar.isWinner ? [0, 0.6] : [0, 0],
    { clamp: true }
  );
  const ringR = useTransform(localEnter, [0.5, 1], bar.isWinner ? [0, 50] : [0, 0]);

  return (
    <g>
      {/* Winner glow halo */}
      {bar.isWinner && (
        <motion.ellipse
          cx={x + BAR_W / 2}
          cy={PLOT_BOTTOM}
          rx={ringR}
          ry={useTransform(ringR, (v) => v * 0.4)}
          fill={`${bar.color}`}
          style={{ opacity: glowOpacity, filter: "blur(20px)" }}
        />
      )}

      {/* Bar — solid fill */}
      <motion.rect
        x={x}
        y={barY}
        width={BAR_W}
        height={barH}
        rx={6}
        fill={bar.color}
        style={{
          filter: bar.isWinner ? "drop-shadow(0 0 16px rgba(240,86,74,0.5))" : "none",
        }}
      />

      {/* Inner gradient highlight */}
      <motion.rect
        x={x}
        y={barY}
        width={BAR_W}
        height={barH}
        rx={6}
        fill={`url(#highlight-${index})`}
      />

      {/* Shimmer for winner */}
      {bar.isWinner && (
        <motion.rect
          x={x + 4}
          y={barY}
          width={6}
          height={barH}
          rx={3}
          fill="#ffffff"
          style={{ opacity: useTransform(localEnter, [0.8, 1], [0, 0.4], { clamp: true }) }}
        />
      )}

      {/* Value label above bar */}
      <motion.text
        x={x + BAR_W / 2}
        y={labelY}
        fill={bar.color}
        fontSize="14"
        fontWeight="900"
        textAnchor="middle"
        fontFamily="ui-monospace, 'SF Mono', monospace"
        style={{ opacity: labelEnter }}
      >
        {bar.value}
      </motion.text>

      {/* Condition label below */}
      <text
        x={x + BAR_W / 2}
        y={H - PAD_B + 24}
        fill="#0f172a"
        fontSize="12"
        fontWeight="800"
        textAnchor="middle"
      >
        {bar.label}
      </text>
      <text
        x={x + BAR_W / 2}
        y={H - PAD_B + 40}
        fill="#94a3b8"
        fontSize="9"
        fontWeight="700"
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        letterSpacing="1.2"
      >
        {bar.role.toUpperCase()}
      </text>
    </g>
  );
}

function GridLine({
  value,
  enter,
  delay = 0,
}: {
  value: number;
  enter: MotionValue<number>;
  delay?: number;
}) {
  const y = PLOT_TOP + PLOT_H * (1 - value / MAX);
  const opacity = useTransform(enter, [delay, delay + 0.2], [0, 1], { clamp: true });
  return (
    <>
      <motion.line
        x1={PAD_L}
        x2={W - PAD_R}
        y1={y}
        y2={y}
        stroke="#e2e8f0"
        strokeDasharray="3 5"
        strokeWidth={1}
        style={{ opacity }}
      />
      <motion.text
        x={PAD_L - 10}
        y={y + 4}
        fill="#94a3b8"
        fontSize="10"
        fontWeight="700"
        textAnchor="end"
        fontFamily="ui-monospace, monospace"
        style={{ opacity }}
      >
        {value}
      </motion.text>
    </>
  );
}

export default function JurkatStimulationGraph() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const enter = useTransform(scrollYProgress, [0.08, 0.4], [0, 1], { clamp: true });
  const exit = useTransform(scrollYProgress, [0.62, 0.92], [0, 1], { clamp: true });
  const blurAmt = useTransform(exit, [0, 1], [0, 6]);
  const filterStr = useTransform(blurAmt, (v) => `blur(${v}px)`);
  const opacity = useTransform(exit, [0, 1], [1, 0]);

  const synergyOpacity = useTransform(enter, [0.7, 1], [0, 1], { clamp: true });
  const synergyY = useTransform(enter, [0.7, 1], [12, 0], { clamp: true });

  // Y-axis label
  const yAxisOpacity = useTransform(enter, [0.1, 0.3], [0, 1], { clamp: true });

  // Threshold reference line (at ~400 MFI = "robust activation")
  const thresholdY = PLOT_TOP + PLOT_H * (1 - 400 / MAX);
  const thresholdProgress = useTransform(enter, [0.4, 0.75], [0, 1], { clamp: true });
  const thresholdX2 = useTransform(thresholdProgress, (v) => PAD_L + (W - PAD_R - PAD_L) * v);

  return (
    <div ref={ref} className="w-full h-full flex flex-col">
      {/* HUD HEADER */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F0564A] animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-[#5BCBD7]">
              ▣ T-CELL ACTIVATION · CD69 MFI
            </span>
          </div>
          <h4 className="text-lg sm:text-xl md:text-2xl font-heading font-bold text-gray-900 tracking-tight">
            Synergy in action
          </h4>
        </div>
        <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            Flow Cytometry
          </span>
          <span className="w-px h-3 bg-gray-200" />
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">n=12</span>
        </div>
      </div>

      <motion.div className="relative flex-1 min-h-[280px]" style={{ filter: filterStr, opacity }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            {BARS.map((b, i) => (
              <linearGradient key={i} id={`highlight-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
              </linearGradient>
            ))}
          </defs>

          {/* Y-axis title */}
          <motion.text
            x={20}
            y={PLOT_TOP + PLOT_H / 2}
            fill="#475569"
            fontSize="11"
            fontWeight="800"
            textAnchor="middle"
            transform={`rotate(-90, 20, ${PLOT_TOP + PLOT_H / 2})`}
            letterSpacing="1.5"
            style={{ opacity: yAxisOpacity }}
          >
            CD69 EXPRESSION (MFI)
          </motion.text>

          {/* Grid lines */}
          {[0, 175, 350, 525, 700].map((v, i) => (
            <GridLine key={v} value={v} enter={enter} delay={0.1 + i * 0.03} />
          ))}

          {/* Baseline axis */}
          <line
            x1={PAD_L}
            x2={W - PAD_R}
            y1={PLOT_BOTTOM}
            y2={PLOT_BOTTOM}
            stroke="#94a3b8"
            strokeWidth={1.5}
          />

          {/* Threshold reference line "Robust activation" */}
          <motion.line
            x1={PAD_L}
            x2={thresholdX2}
            y1={thresholdY}
            y2={thresholdY}
            stroke="#F08435"
            strokeWidth={1.5}
            strokeDasharray="6 4"
            style={{ opacity: thresholdProgress }}
          />
          <motion.g style={{ opacity: thresholdProgress }}>
            <rect
              x={W - PAD_R - 130}
              y={thresholdY - 10}
              width="120"
              height="18"
              rx="9"
              fill="#F08435"
              opacity="0.95"
            />
            <text
              x={W - PAD_R - 70}
              y={thresholdY + 3}
              fill="white"
              fontSize="9"
              fontWeight="900"
              textAnchor="middle"
              letterSpacing="1.2"
            >
              ROBUST ACTIVATION
            </text>
          </motion.g>

          {/* Bars */}
          {BARS.map((b, i) => (
            <BarRenderer key={b.label} bar={b} index={i} enter={enter} />
          ))}

          {/* SYNERGY CALLOUT — pops in over the Combo bar */}
          <motion.g style={{ opacity: synergyOpacity, y: synergyY }}>
            {/* Pointer line from callout to bar top */}
            <line
              x1={PAD_L + 3 * STEP + BAR_W / 2}
              x2={PAD_L + 3 * STEP + BAR_W / 2}
              y1={PLOT_TOP + PLOT_H * (1 - 640 / MAX) - 6}
              y2={PLOT_TOP - 8}
              stroke="#F0564A"
              strokeWidth={1.5}
              strokeDasharray="2 3"
            />
            <rect
              x={PAD_L + 3 * STEP + BAR_W / 2 - 70}
              y={PLOT_TOP - 36}
              width="140"
              height="28"
              rx="14"
              fill="#F0564A"
              filter="drop-shadow(0 6px 20px rgba(240,86,74,0.45))"
            />
            <text
              x={PAD_L + 3 * STEP + BAR_W / 2}
              y={PLOT_TOP - 18}
              fill="white"
              fontSize="11"
              fontWeight="900"
              textAnchor="middle"
              letterSpacing="1"
            >
              ✨ SYNERGY · 2.6× MAX
            </text>
          </motion.g>
        </svg>
      </motion.div>

      {/* Legend / footer */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {BARS.map((b) => (
            <div key={b.label} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: b.color, boxShadow: b.isWinner ? `0 0 8px ${b.color}` : "none" }}
              />
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-[0.1em]">
                {b.label}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[10px] italic text-gray-400 font-medium">Source: Jurkat T-Cells, 48 hr</p>
      </div>
    </div>
  );
}
