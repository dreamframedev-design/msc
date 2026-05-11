"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

/* =============================================================
   LIMB VOLUME REDUCTION  ·  scroll-linked time series
   Story: Treatment curve drops further than Standard of Care,
   with shrinking confidence band proving consistency.
   ============================================================= */

const WEEKS = [0, 4, 8, 12, 24, 36, 52];

// Volume reduction % over time (negative = reduction is desired direction)
const TREATMENT = [
  { week: 0, mean: 0, lo: 0, hi: 0 },
  { week: 4, mean: -8, lo: -12, hi: -4 },
  { week: 8, mean: -16, lo: -20, hi: -12 },
  { week: 12, mean: -22, lo: -27, hi: -17 },
  { week: 24, mean: -32, lo: -36, hi: -28 },
  { week: 36, mean: -36, lo: -39, hi: -33 },
  { week: 52, mean: -38, lo: -41, hi: -35 },
];

const STANDARD = [
  { week: 0, mean: 0, lo: 0, hi: 0 },
  { week: 4, mean: -2, lo: -6, hi: 2 },
  { week: 8, mean: -5, lo: -10, hi: 0 },
  { week: 12, mean: -8, lo: -14, hi: -2 },
  { week: 24, mean: -12, lo: -18, hi: -6 },
  { week: 36, mean: -14, lo: -20, hi: -8 },
  { week: 52, mean: -15, lo: -22, hi: -8 },
];

const KPIS = [
  { label: "Mean reduction", value: 38, suffix: "%", color: "#F0564A" },
  { label: "Responders (≥20%)", value: 74, suffix: "%", color: "#5BCBD7" },
  { label: "Significance", value: "p<0.001", suffix: "", color: "#F08435", isText: true },
];

const W = 700;
const H = 380;
const PAD_L = 56;
const PAD_R = 60;
const PAD_T = 36;
const PAD_B = 60;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;
const PLOT_TOP = PAD_T;
const PLOT_BOTTOM = PAD_T + PLOT_H;
const MIN_Y = -50;
const MAX_Y = 5;

const xFor = (week: number) => PAD_L + (week / 52) * PLOT_W;
const yFor = (val: number) => PLOT_TOP + PLOT_H * (1 - (val - MIN_Y) / (MAX_Y - MIN_Y));

function buildLinePath(points: { week: number; mean: number }[]) {
  return points.reduce((acc, p, i) => acc + (i === 0 ? `M ${xFor(p.week)} ${yFor(p.mean)}` : ` L ${xFor(p.week)} ${yFor(p.mean)}`), "");
}

function buildBandPath(points: { week: number; lo: number; hi: number }[]) {
  const top = points.map((p) => `${xFor(p.week)} ${yFor(p.hi)}`).join(" L ");
  const bot = points
    .slice()
    .reverse()
    .map((p) => `${xFor(p.week)} ${yFor(p.lo)}`)
    .join(" L ");
  return `M ${top} L ${bot} Z`;
}

function AnimatedCounter({ to, suffix, enter }: { to: number; suffix: string; enter: MotionValue<number> }) {
  const value = useTransform(enter, (v) => {
    const eased = Math.min(1, v * 1.5);
    return Math.round(to * eased);
  });
  return (
    <span className="inline-flex items-baseline">
      <motion.span>{value}</motion.span>
      <span className="opacity-70 ml-0.5">{suffix}</span>
    </span>
  );
}

function SeriesLine({
  points,
  color,
  enter,
  isWinner,
  delay = 0,
}: {
  points: { week: number; mean: number; lo: number; hi: number }[];
  color: string;
  enter: MotionValue<number>;
  isWinner: boolean;
  delay?: number;
}) {
  const linePath = buildLinePath(points);
  const bandPath = buildBandPath(points);
  const lineProgress = useTransform(enter, [delay, delay + 0.6], [0, 1], { clamp: true });
  const bandOpacity = useTransform(enter, [delay + 0.3, delay + 0.7], [0, isWinner ? 0.22 : 0.13], { clamp: true });

  return (
    <>
      {/* Confidence band */}
      <motion.path d={bandPath} fill={color} style={{ opacity: bandOpacity }} />
      {/* Line */}
      <motion.path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={isWinner ? 3 : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength: lineProgress, filter: isWinner ? `drop-shadow(0 0 6px ${color})` : "none" }}
      />
      {/* End-point dot */}
      <motion.circle
        cx={xFor(points[points.length - 1].week)}
        cy={yFor(points[points.length - 1].mean)}
        r={isWinner ? 6 : 4.5}
        fill={color}
        stroke="#ffffff"
        strokeWidth={2}
        style={{
          opacity: useTransform(enter, [delay + 0.55, delay + 0.7], [0, 1], { clamp: true }),
          filter: isWinner ? `drop-shadow(0 0 8px ${color})` : "none",
        }}
      />
    </>
  );
}

function MilestoneCallout({
  week,
  val,
  label,
  color,
  enter,
  delay,
}: {
  week: number;
  val: number;
  label: string;
  color: string;
  enter: MotionValue<number>;
  delay: number;
}) {
  const opacity = useTransform(enter, [delay, delay + 0.15], [0, 1], { clamp: true });
  const offsetY = useTransform(enter, [delay, delay + 0.2], [-6, 0], { clamp: true });
  const x = xFor(week);
  const y = yFor(val);
  return (
    <motion.g style={{ opacity, y: offsetY }}>
      {/* Vertical leader line */}
      <line x1={x} x2={x} y1={y - 4} y2={y - 28} stroke={color} strokeWidth="1.2" strokeDasharray="2 3" />
      {/* Marker dot */}
      <circle cx={x} cy={y} r={5} fill={color} stroke="#ffffff" strokeWidth={1.5} />
      {/* Callout chip */}
      <rect
        x={x - 56}
        y={y - 48}
        width="112"
        height="22"
        rx="11"
        fill="#ffffff"
        stroke={color}
        strokeWidth={1.5}
        filter={`drop-shadow(0 4px 14px ${color}44)`}
      />
      <text x={x} y={y - 33} fill={color} fontSize="9" fontWeight="900" textAnchor="middle" letterSpacing="0.5">
        {label}
      </text>
    </motion.g>
  );
}

export default function ClinicalDataTable() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Delayed entry so the curve doesn't pre-draw before the user scrolls to it
  const enter = useTransform(scrollYProgress, [0.22, 0.55], [0, 1], { clamp: true });
  const exit = useTransform(scrollYProgress, [0.68, 0.95], [0, 1], { clamp: true });
  const blurAmt = useTransform(exit, [0, 1], [0, 6]);
  const filterStr = useTransform(blurAmt, (v) => `blur(${v}px)`);
  const opacity = useTransform(exit, [0, 1], [1, 0]);

  // Axis labels
  const yAxisOpacity = useTransform(enter, [0.1, 0.3], [0, 1], { clamp: true });

  return (
    <div ref={ref} className="w-full h-full p-5 sm:p-7 md:p-8 bg-white">
      {/* HUD HEADER */}
      <div className="flex items-center justify-between mb-5 sm:mb-7 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F0564A] animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-[#5BCBD7]">
              ▣ LIMB VOLUME REDUCTION · PHASE II
            </span>
          </div>
          <h4 className="text-lg sm:text-xl md:text-2xl font-heading font-bold text-gray-900 tracking-tight">
            52 weeks. One curve below the other.
          </h4>
        </div>
        <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">N = 124</span>
          <span className="w-px h-3 bg-gray-200" />
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Ongoing</span>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-7">
        {KPIS.map((k) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-3 sm:p-4 rounded-2xl border border-gray-100 bg-white overflow-hidden"
            style={{ boxShadow: `0 0 0 1px ${k.color}1A inset` }}
          >
            <div
              className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-25"
              style={{ background: `radial-gradient(circle, ${k.color}, transparent 70%)`, filter: "blur(20px)" }}
            />
            <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              {k.label}
            </p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: k.color }}>
              {k.isText ? <span>{k.value}</span> : <AnimatedCounter to={k.value as number} suffix={k.suffix} enter={enter} />}
            </p>
          </motion.div>
        ))}
      </div>

      {/* CHART */}
      <motion.div className="relative" style={{ filter: filterStr, opacity }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
          {/* Y-axis title */}
          <motion.text
            x={16}
            y={PLOT_TOP + PLOT_H / 2}
            fill="#475569"
            fontSize="10"
            fontWeight="800"
            textAnchor="middle"
            transform={`rotate(-90, 16, ${PLOT_TOP + PLOT_H / 2})`}
            letterSpacing="1.5"
            style={{ opacity: yAxisOpacity }}
          >
            VOLUME CHANGE (%)
          </motion.text>

          {/* Grid + Y labels */}
          {[0, -10, -20, -30, -40].map((v, i) => {
            const y = yFor(v);
            const op = useTransform(enter, [0.1 + i * 0.03, 0.3 + i * 0.03], [0, 1], { clamp: true });
            return (
              <g key={v}>
                <motion.line x1={PAD_L} x2={W - PAD_R} y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="3 5" style={{ opacity: op }} />
                <motion.text x={PAD_L - 8} y={y + 4} fill="#94a3b8" fontSize="10" fontWeight="700" textAnchor="end" fontFamily="ui-monospace, monospace" style={{ opacity: op }}>
                  {v}
                </motion.text>
              </g>
            );
          })}

          {/* Zero baseline */}
          <line x1={PAD_L} x2={W - PAD_R} y1={yFor(0)} y2={yFor(0)} stroke="#94a3b8" strokeWidth={1.5} />

          {/* X-axis week labels */}
          {WEEKS.map((wk) => {
            const x = xFor(wk);
            return (
              <text
                key={wk}
                x={x}
                y={PLOT_BOTTOM + 22}
                fill="#475569"
                fontSize="10"
                fontWeight="800"
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
              >
                {wk === 0 ? "BASELINE" : `W${wk}`}
              </text>
            );
          })}

          {/* Series — Standard of Care (drawn first, behind) */}
          <SeriesLine points={STANDARD} color="#94a3b8" enter={enter} isWinner={false} delay={0.05} />
          {/* Series — Treatment (front, winner) */}
          <SeriesLine points={TREATMENT} color="#F0564A" enter={enter} isWinner={true} delay={0.15} />

          {/* Series end labels */}
          <motion.text
            x={xFor(52) + 8}
            y={yFor(-38) + 4}
            fill="#F0564A"
            fontSize="11"
            fontWeight="900"
            fontFamily="ui-monospace, monospace"
            style={{ opacity: useTransform(enter, [0.7, 0.9], [0, 1], { clamp: true }) }}
          >
            −38%
          </motion.text>
          <motion.text
            x={xFor(52) + 8}
            y={yFor(-15) + 4}
            fill="#94a3b8"
            fontSize="10"
            fontWeight="800"
            fontFamily="ui-monospace, monospace"
            style={{ opacity: useTransform(enter, [0.7, 0.9], [0, 1], { clamp: true }) }}
          >
            −15%
          </motion.text>

          {/* Milestone callouts */}
          <MilestoneCallout
            week={12}
            val={-22}
            label="✓ SIGNIFICANT @ W12"
            color="#F0564A"
            enter={enter}
            delay={0.78}
          />
        </svg>
      </motion.div>

      {/* Legend / footer */}
      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="block w-4 h-[3px] rounded-full bg-[#F0564A]" style={{ boxShadow: "0 0 6px #F0564A" }} />
            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.12em]">Treatment</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="block w-4 h-[2px] rounded-full bg-gray-400" />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.12em]">Standard of Care</span>
          </div>
        </div>
        <p className="text-[10px] italic text-gray-400 font-medium">95% CI bands · investigational data</p>
      </div>
    </div>
  );
}
