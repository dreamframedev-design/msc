"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { TrendingUp } from "lucide-react";

/* Scroll-linked counter — ticks up from 0 to `to` as `enter` motion value moves 0→1.
   Format function lets caller control decimal places, currency, etc. */
function ScrollNumber({
  to,
  enter,
  format = (v) => v.toFixed(0),
}: {
  to: number;
  enter: MotionValue<number>;
  format?: (v: number) => string;
}) {
  const display = useTransform(enter, (v) => format(to * Math.min(1, v * 1.3)));
  return <motion.span>{display}</motion.span>;
}

/* KPI cell with staggered fade-in + scroll-linked content via render prop */
function KpiCell({
  label,
  enter,
  color,
  stagger,
  children,
}: {
  label: string;
  enter: MotionValue<number>;
  color: string;
  stagger: number;
  children: (cellEnter: MotionValue<number>) => React.ReactNode;
}) {
  const cellEnter = useTransform(enter, [stagger, stagger + 0.55], [0, 1], { clamp: true });
  const opacity = useTransform(cellEnter, [0, 0.3], [0, 1], { clamp: true });
  const y = useTransform(cellEnter, [0, 0.3], [6, 0], { clamp: true });
  return (
    <motion.div style={{ opacity, y }}>
      <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-sm font-bold tabular-nums font-mono ${color}`}>{children(cellEnter)}</p>
    </motion.div>
  );
}

const MOCK_DATA = [
  { date: "Jun", price: 8.2 }, { date: "", price: 8.5 },
  { date: "Jul", price: 9.1 }, { date: "", price: 8.8 },
  { date: "Aug", price: 8.9 }, { date: "", price: 8.7 },
  { date: "Sep", price: 8.2 }, { date: "", price: 7.9 },
  { date: "Oct", price: 7.8 }, { date: "", price: 8.1 },
  { date: "Nov", price: 8.5 }, { date: "", price: 10.2 },
  { date: "Dec", price: 10.8 }, { date: "", price: 9.5 },
  { date: "Jan", price: 9.7 }, { date: "", price: 9.4 },
  { date: "Feb", price: 9.2 }, { date: "", price: 9.1 },
  { date: "Mar", price: 9.3 }, { date: "", price: 9.2 },
  { date: "Apr", price: 10.1 }, { date: "", price: 9.9 },
  { date: "May", price: 10.3 }, { date: "", price: 10.85 },
];

const W = 800;
const H = 280;
const PAD_L = 32;
const PAD_R = 56;
const PAD_T = 16;
const PAD_B = 28;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;
const PLOT_TOP = PAD_T;
const PLOT_BOTTOM = PAD_T + PLOT_H;

const MIN_Y = 7.5;
const MAX_Y = 11.2;
const yFor = (v: number) => PLOT_TOP + PLOT_H * (1 - (v - MIN_Y) / (MAX_Y - MIN_Y));
const xFor = (i: number) => PAD_L + (i / (MOCK_DATA.length - 1)) * PLOT_W;

const linePath = MOCK_DATA.reduce(
  (acc, p, i) => acc + (i === 0 ? `M ${xFor(i)} ${yFor(p.price)}` : ` L ${xFor(i)} ${yFor(p.price)}`),
  ""
);
const areaPath = `${linePath} L ${xFor(MOCK_DATA.length - 1)} ${PLOT_BOTTOM} L ${xFor(0)} ${PLOT_BOTTOM} Z`;

const STATS = [
  { label: "Ticker", value: "BIOTX" },
  { label: "ISIN", value: "US0010405780" },
  { label: "Market", value: "NASDAQ" },
  { label: "Sector", value: "Biotech" },
  { label: "Shares", value: "76.9M" },
  { label: "Mkt Cap", value: "$834.4M" },
];

function GridLine({ value, enter, delay = 0 }: { value: number; enter: MotionValue<number>; delay?: number }) {
  const y = yFor(value);
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
        x={W - PAD_R + 8}
        y={y + 4}
        fill="#94a3b8"
        fontSize="11"
        fontWeight="700"
        fontFamily="ui-monospace, monospace"
        style={{ opacity }}
      >
        {value.toFixed(1)}
      </motion.text>
    </>
  );
}

export default function LiveShareChart() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const enter = useTransform(scrollYProgress, [0.08, 0.45], [0, 1], { clamp: true });
  const lineProgress = useTransform(enter, [0.2, 0.9], [0, 1], { clamp: true });
  const areaOpacity = useTransform(enter, [0.4, 0.85], [0, 1], { clamp: true });

  const lastPoint = MOCK_DATA[MOCK_DATA.length - 1];
  const dotOpacity = useTransform(enter, [0.8, 1], [0, 1], { clamp: true });

  return (
    <div ref={ref} className="w-full bg-white rounded-3xl sm:rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      {/* ============ HEADER STRIP ============ */}
      <div className="px-5 sm:px-7 py-4 sm:py-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-[#5BCBD7]">
              ▣ NASDAQ · LIVE
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-heading font-bold text-gray-900 tracking-tight">
            BIOTX Therapeutics Inc
          </h3>
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.18em]">Powered by INFRONT</span>
      </div>

      {/* ============ PRICE + KPI STRIP — all numbers tick up with scroll ============ */}
      <div className="px-5 sm:px-7 py-5 sm:py-6 border-b border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-7 items-baseline">
          {/* Price */}
          <div className="md:col-span-5">
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">USD</span>
              <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight tabular-nums">
                <ScrollNumber to={10.85} enter={enter} format={(v) => v.toFixed(2)} />
              </span>
              <motion.span
                className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600 ml-1"
                style={{ opacity: useTransform(enter, [0.55, 0.85], [0, 1], { clamp: true }) }}
              >
                <TrendingUp className="w-4 h-4" /> +<ScrollNumber to={2.36} enter={useTransform(enter, [0.55, 1], [0, 1], { clamp: true })} format={(v) => v.toFixed(2)} />%
              </motion.span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider">
              2026-05-10 · 09:30 ET
            </p>
          </div>

          {/* Mini KPIs — staggered scroll-linked counters */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <KpiCell label="Change" enter={enter} color="text-emerald-600" stagger={0.1}>
              {(e) => <>+$<ScrollNumber to={0.25} enter={e} format={(v) => v.toFixed(2)} /></>}
            </KpiCell>
            <KpiCell label="High / Low" enter={enter} color="text-gray-900" stagger={0.2}>
              {(e) => (
                <>
                  <ScrollNumber to={10.95} enter={e} format={(v) => v.toFixed(2)} /> / <ScrollNumber to={10.6} enter={e} format={(v) => v.toFixed(2)} />
                </>
              )}
            </KpiCell>
            <KpiCell label="Volume" enter={enter} color="text-gray-900" stagger={0.3}>
              {(e) => <ScrollNumber to={16984} enter={e} format={(v) => Math.round(v).toLocaleString()} />}
            </KpiCell>
            <KpiCell label="Turnover" enter={enter} color="text-gray-900" stagger={0.4}>
              {(e) => <>$<ScrollNumber to={183} enter={e} format={(v) => Math.round(v).toString()} />K</>}
            </KpiCell>
          </div>
        </div>
      </div>

      {/* ============ CHART ============ */}
      <div className="relative px-3 sm:px-5 py-4 sm:py-6">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F0564A" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#F0564A" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F08435" />
              <stop offset="100%" stopColor="#F0564A" />
            </linearGradient>
          </defs>

          {/* Y axis grid */}
          {[8, 9, 10, 11].map((v, i) => (
            <GridLine key={v} value={v} enter={enter} delay={0.1 + i * 0.03} />
          ))}

          {/* X axis tick labels */}
          {MOCK_DATA.map((p, i) =>
            p.date ? (
              <text
                key={i}
                x={xFor(i)}
                y={H - 8}
                fill="#94a3b8"
                fontSize="10"
                fontWeight="700"
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
              >
                {p.date}
              </text>
            ) : null
          )}

          {/* Area fill */}
          <motion.path d={areaPath} fill="url(#areaGrad)" style={{ opacity: areaOpacity }} />

          {/* Line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              pathLength: lineProgress,
              filter: "drop-shadow(0 2px 6px rgba(240,86,74,0.35))",
            }}
          />

          {/* End dot + label */}
          <motion.g style={{ opacity: dotOpacity }}>
            <circle cx={xFor(MOCK_DATA.length - 1)} cy={yFor(lastPoint.price)} r={11} fill="#F0564A" opacity="0.18">
              <animate attributeName="r" values="9;14;9" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.18;0;0.18" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle
              cx={xFor(MOCK_DATA.length - 1)}
              cy={yFor(lastPoint.price)}
              r={4.5}
              fill="#F0564A"
              stroke="#ffffff"
              strokeWidth={2}
              style={{ filter: "drop-shadow(0 0 8px #F0564A)" }}
            />
            {/* Floating callout */}
            <rect
              x={xFor(MOCK_DATA.length - 1) - 60}
              y={yFor(lastPoint.price) - 36}
              width="52"
              height="22"
              rx="11"
              fill="#F0564A"
              filter="drop-shadow(0 6px 16px rgba(240,86,74,0.4))"
            />
            <text
              x={xFor(MOCK_DATA.length - 1) - 34}
              y={yFor(lastPoint.price) - 21}
              fill="white"
              fontSize="10"
              fontWeight="900"
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
            >
              $10.85
            </text>
          </motion.g>
        </svg>
      </div>

      {/* ============ FOOTER STATS STRIP ============ */}
      <div className="px-5 sm:px-7 py-3 sm:py-4 border-t border-gray-100 grid grid-cols-3 sm:grid-cols-6 gap-3 bg-gray-50/40">
        {STATS.map((s) => (
          <div key={s.label}>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{s.label}</p>
            <p className="text-xs font-bold text-gray-900 tabular-nums truncate">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
