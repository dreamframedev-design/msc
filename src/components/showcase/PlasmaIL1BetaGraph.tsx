"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

/* =============================================================
   PLASMA IL-1β BIOMARKER  ·  scroll-linked custom SVG scatter
   Story: Placebo → Low Dose → High Dose
   High variance collapses to tight, low-mean cluster.
   ============================================================= */

type Point = { cohort: number; value: number; isOutlier?: boolean };

const COHORTS = [
  { id: 0, label: "Placebo", color: "#94a3b8", mean: 0.78, x: 1 },
  { id: 1, label: "Low Dose", color: "#5BCBD7", mean: 0.32, x: 2 },
  { id: 2, label: "High Dose", color: "#F0564A", mean: 0.18, x: 3 },
];

// Tight, story-friendly data: placebo scattered & high, doses tighter & lower
const POINTS: Point[] = [
  // Placebo — wide spread, high mean
  { cohort: 0, value: 0.55 }, { cohort: 0, value: 0.62 }, { cohort: 0, value: 0.78 },
  { cohort: 0, value: 0.85 }, { cohort: 0, value: 0.91 }, { cohort: 0, value: 1.42, isOutlier: true },
  { cohort: 0, value: 0.74 }, { cohort: 0, value: 0.69 },
  // Low Dose — moderate, tighter
  { cohort: 1, value: 0.22 }, { cohort: 1, value: 0.31 }, { cohort: 1, value: 0.35 },
  { cohort: 1, value: 0.38 }, { cohort: 1, value: 0.28 }, { cohort: 1, value: 0.42 },
  { cohort: 1, value: 0.26 }, { cohort: 1, value: 0.34 },
  // High Dose — tight cluster, low values
  { cohort: 2, value: 0.12 }, { cohort: 2, value: 0.16 }, { cohort: 2, value: 0.21 },
  { cohort: 2, value: 0.19 }, { cohort: 2, value: 0.14 }, { cohort: 2, value: 0.22 },
  { cohort: 2, value: 0.17 }, { cohort: 2, value: 0.20 },
];

const W = 600;
const H = 400;
const PAD_L = 64;
const PAD_R = 32;
const PAD_T = 56;
const PAD_B = 80;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;
const PLOT_TOP = PAD_T;
const PLOT_BOTTOM = PAD_T + PLOT_H;
const MAX_Y = 1.5;

// Center X for each cohort column
const cohortX = (i: number) => PAD_L + (PLOT_W / (COHORTS.length * 2)) * (2 * i + 1);

// Deterministic horizontal jitter per point so they don't overlap perfectly
function jitterFor(i: number) {
  return (Math.sin(i * 12.9898) * 43758.5453) % 1 * 30 - 15;
}

function ScatterDot({
  point,
  index,
  enter,
  exit,
}: {
  point: Point & { i: number };
  index: number;
  enter: MotionValue<number>;
  exit: MotionValue<number>;
}) {
  const stagger = (point.cohort * 0.15) + (index % 8) * 0.03;
  const localEnter = useTransform(enter, [stagger, stagger + 0.4], [0, 1], { clamp: true });

  const cohort = COHORTS[point.cohort];
  const cx = cohortX(point.cohort) + jitterFor(point.i);
  const targetY = PLOT_TOP + PLOT_H * (1 - point.value / MAX_Y);

  // Dots fall in from above
  const cy = useTransform(localEnter, (v) => PLOT_TOP - 20 + (targetY - (PLOT_TOP - 20)) * v);
  const opacity = useTransform([localEnter, exit] as MotionValue[], (latest) => {
    const [e, x] = latest as number[];
    return e * (1 - x);
  });

  // Exit scatter — dots fly outward
  const ang = (point.i * 137.5) % 360;
  const rad = (ang * Math.PI) / 180;
  const dx = Math.cos(rad) * 50;
  const dy = Math.sin(rad) * 50;
  const exitX = useTransform(exit, [0, 1], [0, dx]);
  const exitY = useTransform(exit, [0, 1], [0, dy]);

  return (
    <motion.g style={{ opacity, x: exitX, y: exitY }}>
      {/* Outer halo for outliers */}
      {point.isOutlier && (
        <motion.circle
          cx={cx}
          cy={cy}
          r={10}
          fill={cohort.color}
          style={{ opacity: useTransform(localEnter, [0.5, 1], [0, 0.25], { clamp: true }) }}
        />
      )}
      <motion.circle
        cx={cx}
        cy={cy}
        r={point.isOutlier ? 5.5 : 4.5}
        fill={cohort.color}
        stroke="#ffffff"
        strokeWidth={1.5}
        style={{ filter: point.isOutlier ? `drop-shadow(0 0 6px ${cohort.color})` : "none" }}
      />
    </motion.g>
  );
}

function MeanLine({
  cohort,
  enter,
}: {
  cohort: (typeof COHORTS)[number];
  enter: MotionValue<number>;
}) {
  const stagger = 0.4 + cohort.id * 0.1;
  const localEnter = useTransform(enter, [stagger, stagger + 0.3], [0, 1], { clamp: true });
  const cx = cohortX(cohort.id);
  const meanY = PLOT_TOP + PLOT_H * (1 - cohort.mean / MAX_Y);
  const halfW = 36;
  const left = useTransform(localEnter, (v) => cx - halfW * v);
  const right = useTransform(localEnter, (v) => cx + halfW * v);

  return (
    <>
      <motion.line
        x1={left}
        x2={right}
        y1={meanY}
        y2={meanY}
        stroke={cohort.color}
        strokeWidth={3}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${cohort.color})` }}
      />
      {/* Mean value label */}
      <motion.text
        x={cx + 50}
        y={meanY + 4}
        fill={cohort.color}
        fontSize="10"
        fontWeight="900"
        fontFamily="ui-monospace, monospace"
        style={{ opacity: useTransform(localEnter, [0.6, 1], [0, 1], { clamp: true }) }}
      >
        x̄ {cohort.mean.toFixed(2)}
      </motion.text>
    </>
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
  const y = PLOT_TOP + PLOT_H * (1 - value / MAX_Y);
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
        {value.toFixed(1)}
      </motion.text>
    </>
  );
}

export default function PlasmaIL1BetaGraph() {
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

  // P-value callout pops in late
  const pValueOpacity = useTransform(enter, [0.75, 1], [0, 1], { clamp: true });
  const pValueY = useTransform(enter, [0.75, 1], [10, 0], { clamp: true });

  // Y axis title
  const yAxisOpacity = useTransform(enter, [0.1, 0.3], [0, 1], { clamp: true });

  // Normal range zone (0 to 0.25)
  const normalRangeY = PLOT_TOP + PLOT_H * (1 - 0.25 / MAX_Y);
  const normalRangeH = PLOT_BOTTOM - normalRangeY;
  const zoneOpacity = useTransform(enter, [0.2, 0.45], [0, 0.5], { clamp: true });

  // Indexed points (with stable index for jitter calc)
  const indexedPoints = POINTS.map((p, i) => ({ ...p, i }));

  return (
    <div ref={ref} className="w-full h-full flex flex-col">
      {/* HUD HEADER */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5BCBD7] animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-[#F0564A]">
              ▣ PLASMA IL-1β · DAY 28
            </span>
          </div>
          <h4 className="text-lg sm:text-xl md:text-2xl font-heading font-bold text-gray-900 tracking-tight">
            Variance collapses
          </h4>
        </div>
        <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            HS Array
          </span>
          <span className="w-px h-3 bg-gray-200" />
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">n=24</span>
        </div>
      </div>

      <motion.div className="relative flex-1 min-h-[280px]" style={{ filter: filterStr, opacity }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Y axis title */}
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
            IL-1β (pg/mL)
          </motion.text>

          {/* Normal-range zone */}
          <motion.rect
            x={PAD_L}
            y={normalRangeY}
            width={PLOT_W}
            height={normalRangeH}
            fill="#5BCBD7"
            style={{ opacity: useTransform(zoneOpacity, (v) => v * 0.18) }}
          />
          <motion.text
            x={W - PAD_R - 8}
            y={normalRangeY + 14}
            fill="#5BCBD7"
            fontSize="9"
            fontWeight="900"
            textAnchor="end"
            letterSpacing="1.2"
            style={{ opacity: zoneOpacity }}
          >
            NORMAL RANGE
          </motion.text>

          {/* Grid */}
          {[0, 0.5, 1.0, 1.5].map((v, i) => (
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

          {/* Scatter points */}
          {indexedPoints.map((p) => (
            <ScatterDot key={p.i} point={p} index={p.i} enter={enter} exit={exit} />
          ))}

          {/* Mean lines */}
          {COHORTS.map((c) => (
            <MeanLine key={c.id} cohort={c} enter={enter} />
          ))}

          {/* X-axis labels — cohorts */}
          {COHORTS.map((c) => {
            const x = cohortX(c.id);
            return (
              <g key={c.id}>
                <text
                  x={x}
                  y={H - PAD_B + 24}
                  fill="#0f172a"
                  fontSize="12"
                  fontWeight="800"
                  textAnchor="middle"
                >
                  {c.label}
                </text>
                <line
                  x1={x - 18}
                  x2={x + 18}
                  y1={H - PAD_B + 32}
                  y2={H - PAD_B + 32}
                  stroke={c.color}
                  strokeWidth={2}
                />
              </g>
            );
          })}

          {/* P-VALUE CALLOUT */}
          <motion.g style={{ opacity: pValueOpacity, y: pValueY }}>
            <rect
              x={cohortX(2) - 64}
              y={PLOT_TOP + 8}
              width="128"
              height="28"
              rx="14"
              fill="#F0564A"
              filter="drop-shadow(0 6px 20px rgba(240,86,74,0.4))"
            />
            <text
              x={cohortX(2)}
              y={PLOT_TOP + 26}
              fill="white"
              fontSize="11"
              fontWeight="900"
              textAnchor="middle"
              letterSpacing="1"
            >
              ★ p &lt; 0.001
            </text>
          </motion.g>

          {/* Comparison arrow Placebo → High Dose */}
          <motion.g style={{ opacity: useTransform(enter, [0.6, 0.85], [0, 1], { clamp: true }) }}>
            <path
              d={`M ${cohortX(0)} ${PLOT_TOP + 24} Q ${(cohortX(0) + cohortX(2)) / 2} ${PLOT_TOP - 6} ${cohortX(2) - 60} ${PLOT_TOP + 24}`}
              fill="none"
              stroke="#0f172a"
              strokeWidth="1.2"
              strokeDasharray="3 4"
              opacity="0.4"
            />
          </motion.g>
        </svg>
      </motion.div>

      {/* Footer / legend */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
        <div className="flex flex-wrap items-center gap-3">
          {COHORTS.map((c) => (
            <div key={c.id} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-[0.1em]">
                {c.label}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[10px] italic text-gray-400 font-medium">High-Sensitivity Multiplex Array</p>
      </div>
    </div>
  );
}
