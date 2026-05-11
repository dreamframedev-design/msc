"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

// Labels are positioned INSIDE each sphere, offset away from the MSC center node.
const NODES = [
  { id: 0, label: "Discovery", cx: 150, cy: 160, color: "#F0564A", labelX: 132, labelY: 132 },
  { id: 1, label: "Clinical", cx: 290, cy: 160, color: "#5BCBD7", labelX: 308, labelY: 132 },
  { id: 2, label: "Commercial", cx: 220, cy: 280, color: "#F08435", labelX: 220, labelY: 318 },
];

const CHAPTERS = [
  {
    title: "Discovery Phase Integration",
    desc: "Highlighting early-stage pipeline assets, proprietary screening platforms, and the science that started the story.",
  },
  {
    title: "Clinical Translation",
    desc: "Mapping the journey from bench to bedside with clear milestone tracking, biomarker dashboards, and clean trial visuals.",
  },
  {
    title: "Commercial Readiness",
    desc: "Demonstrating market potential, partnerships, and go-to-market. The moment your science meets its audience.",
  },
];

export default function VennDiagramShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });
  const activeIndexFloat = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0, 1, 2]);
  useMotionValueEvent(activeIndexFloat, "change", (latest) => {
    setActiveIndex(Math.min(2, Math.max(0, Math.round(latest))));
  });

  // Scroll-linked drama
  const haloScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.05, 0.95]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.12, 0.22, 0.14]);
  const orbX = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <div
      ref={containerRef}
      className="w-full bg-[#070710] rounded-3xl sm:rounded-[2rem] p-5 sm:p-8 md:p-12 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-stretch gap-8 md:gap-12 min-h-[560px]"
    >
      {/* === BACKGROUND === */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: gridOpacity,
          backgroundImage: "radial-gradient(#475569 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${NODES[activeIndex].color}26 0%, transparent 65%)`,
          filter: "blur(110px)",
          x: orbX,
        }}
      />

      {/* === DIAGRAM === */}
      <div className="relative z-10 w-full md:w-1/2 flex flex-col items-center justify-center order-2 md:order-1 mt-4 md:mt-0 md:sticky md:top-24 self-start">
        <motion.svg
          viewBox="0 0 440 440"
          className="w-full h-auto max-w-[460px] sm:max-w-[520px] drop-shadow-2xl"
          style={{ scale: haloScale }}
        >
          <defs>
            {/* Per-node fills */}
            {NODES.map((n) => (
              <radialGradient key={`fill-${n.id}`} id={`fill-${n.id}`} cx="40%" cy="35%" r="80%">
                <stop offset="0%" stopColor={n.color} stopOpacity="0.95" />
                <stop offset="55%" stopColor={n.color} stopOpacity="0.75" />
                <stop offset="100%" stopColor={n.color} stopOpacity="0.25" />
              </radialGradient>
            ))}
            {NODES.map((n) => (
              <radialGradient key={`rim-${n.id}`} id={`rim-${n.id}`} cx="26%" cy="18%" r="90%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
                <stop offset="35%" stopColor="rgba(255,255,255,0.15)" />
                <stop offset="70%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            ))}
            {NODES.map((n) => (
              <radialGradient key={`dim-${n.id}`} id={`dim-${n.id}`} cx="50%" cy="42%" r="80%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                <stop offset="40%" stopColor={n.color} stopOpacity="0.1" />
                <stop offset="80%" stopColor={n.color} stopOpacity="0.25" />
                <stop offset="100%" stopColor={n.color} stopOpacity="0.4" />
              </radialGradient>
            ))}

            <filter id="vennGlow">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <radialGradient id="centerCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor={NODES[activeIndex].color} stopOpacity="0" />
            </radialGradient>

            <style>
              {`
              @keyframes pulse-msc {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.18); opacity: 0.85; }
              }
              @keyframes flow-conn {
                0% { offset-distance: 0%; opacity: 0; }
                15% { opacity: 1; }
                85% { opacity: 1; }
                100% { offset-distance: 100%; opacity: 0; }
              }
              .msc-pulse {
                transform-origin: 220px 200px;
                animation: pulse-msc 2.4s ease-in-out infinite;
              }
              .conn-01 { offset-path: path('M 150 160 Q 220 100 290 160'); animation: flow-conn 2.6s linear infinite; }
              .conn-12 { offset-path: path('M 290 160 Q 290 240 220 280'); animation: flow-conn 2.6s linear infinite; }
              .conn-20 { offset-path: path('M 220 280 Q 150 240 150 160'); animation: flow-conn 2.6s linear infinite; }
              `}
            </style>
          </defs>

          {/* Connection arcs between all three nodes */}
          <g fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeDasharray="2 5">
            <path d="M 150 160 Q 220 100 290 160" />
            <path d="M 290 160 Q 290 240 220 280" />
            <path d="M 220 280 Q 150 240 150 160" />
          </g>

          {/* Active arc highlight */}
          {activeIndex === 0 && (
            <path d="M 150 160 Q 220 100 290 160" fill="none" stroke="#F0564A" strokeWidth="2" opacity="0.6" />
          )}
          {activeIndex === 1 && (
            <path d="M 290 160 Q 290 240 220 280" fill="none" stroke="#5BCBD7" strokeWidth="2" opacity="0.6" />
          )}
          {activeIndex === 2 && (
            <path d="M 220 280 Q 150 240 150 160" fill="none" stroke="#F08435" strokeWidth="2" opacity="0.6" />
          )}

          {/* Particles flowing along connections */}
          {[0, 1, 2, 3].map((i) => (
            <circle
              key={`conn-01-${i}`}
              r="2.5"
              fill="#ffffff"
              filter="url(#vennGlow)"
              className="conn-01"
              style={{ animationDelay: `${i * 0.65}s`, opacity: activeIndex === 0 ? 1 : 0.25 }}
            />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <circle
              key={`conn-12-${i}`}
              r="2.5"
              fill="#ffffff"
              filter="url(#vennGlow)"
              className="conn-12"
              style={{ animationDelay: `${i * 0.65 + 0.3}s`, opacity: activeIndex === 1 ? 1 : 0.25 }}
            />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <circle
              key={`conn-20-${i}`}
              r="2.5"
              fill="#ffffff"
              filter="url(#vennGlow)"
              className="conn-20"
              style={{ animationDelay: `${i * 0.65 + 0.6}s`, opacity: activeIndex === 2 ? 1 : 0.25 }}
            />
          ))}

          {/* Nodes */}
          {NODES.map((n) => {
            const isActive = activeIndex === n.id;
            return (
              <g key={n.id}>
                {/* Outer glow ring (only active) */}
                <circle
                  cx={n.cx}
                  cy={n.cy}
                  r="115"
                  fill="none"
                  stroke={n.color}
                  strokeWidth="1"
                  opacity={isActive ? 0.25 : 0}
                  style={{ transition: "opacity 600ms ease" }}
                />
                <circle
                  cx={n.cx}
                  cy={n.cy}
                  r="105"
                  fill="none"
                  stroke={n.color}
                  strokeWidth="1.5"
                  opacity={isActive ? 0.4 : 0}
                  style={{ transition: "opacity 600ms ease" }}
                />

                {/* Active fill */}
                <circle
                  cx={n.cx}
                  cy={n.cy}
                  r="95"
                  fill={`url(#fill-${n.id})`}
                  style={{
                    opacity: isActive ? 1 : 0,
                    transition: "opacity 600ms ease, r 600ms cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
                <circle
                  cx={n.cx}
                  cy={n.cy}
                  r="95"
                  fill="none"
                  stroke={`url(#rim-${n.id})`}
                  strokeWidth="2"
                  style={{ opacity: isActive ? 1 : 0, transition: "opacity 600ms ease" }}
                />

                {/* Inactive fill */}
                <circle
                  cx={n.cx}
                  cy={n.cy}
                  r="95"
                  fill={`url(#dim-${n.id})`}
                  style={{ opacity: isActive ? 0 : 1, transition: "opacity 600ms ease" }}
                />
                <circle
                  cx={n.cx}
                  cy={n.cy}
                  r="95"
                  fill="none"
                  stroke={n.color}
                  strokeOpacity="0.45"
                  strokeWidth="1.5"
                  style={{ opacity: isActive ? 0 : 1, transition: "opacity 600ms ease" }}
                />

                {/* Label */}
                <text
                  x={n.labelX}
                  y={n.labelY}
                  fill="white"
                  fontFamily="sans-serif"
                  fontWeight="800"
                  fontSize="16"
                  letterSpacing="0.5"
                  textAnchor="middle"
                  style={{
                    opacity: isActive ? 1 : 0.55,
                    transition: "opacity 500ms ease",
                  }}
                >
                  {n.label}
                </text>
                {/* Label underline */}
                <line
                  x1={n.labelX - 26}
                  x2={n.labelX + 26}
                  y1={n.labelY + 7}
                  y2={n.labelY + 7}
                  stroke={n.color}
                  strokeWidth="1.5"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transition: "opacity 500ms ease",
                  }}
                />
              </g>
            );
          })}

          {/* Center MSC ring + node */}
          <g className="msc-pulse">
            <circle cx="220" cy="200" r="36" fill="url(#centerCore)" opacity="0.7" />
            <circle cx="220" cy="200" r="22" fill="#ffffff" opacity="0.95" />
            <circle cx="220" cy="200" r="22" fill="none" stroke={NODES[activeIndex].color} strokeWidth="1.5" />
          </g>
          <text
            x="220"
            y="205"
            fill="#0A0A0A"
            fontFamily="sans-serif"
            fontWeight="900"
            fontSize="11"
            letterSpacing="1.5"
            textAnchor="middle"
          >
            MSC
          </text>
        </motion.svg>
      </div>

      {/* === CONTENT === */}
      <div className="relative z-10 w-full md:w-1/2 flex flex-col justify-center order-1 md:order-2">
        <div className="mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/10 text-[10px] font-bold text-[#5BCBD7] uppercase tracking-[0.22em]">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex w-full h-full rounded-full bg-[#F0564A] opacity-75 animate-ping" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-[#F0564A]" />
            </span>
            Scroll-Linked Animation
          </div>
          <h3 className="text-display text-3xl sm:text-4xl md:text-5xl text-white mb-4 sm:mb-5">
            The <span className="text-aurora">Convergence</span> Model
          </h3>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Scroll the page. The diagram tracks your position, highlights the relevant chapter, and animates particles along the connection that matches, keeping your narrative perfectly synced to the visual.
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {CHAPTERS.map((c, i) => {
            const isActive = activeIndex === i;
            return (
              <motion.div
                key={i}
                animate={{
                  scale: isActive ? 1.02 : 1,
                  opacity: isActive ? 1 : 0.45,
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={`relative p-4 sm:p-5 rounded-2xl border transition-colors duration-500 ${
                  isActive
                    ? "bg-white/[0.05] border-white/15"
                    : "bg-white/[0.02] border-white/[0.06]"
                }`}
                style={{
                  boxShadow: isActive ? `0 0 30px ${NODES[i].color}28` : "none",
                }}
              >
                {/* Side accent bar */}
                <div
                  className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full transition-all duration-500"
                  style={{
                    background: NODES[i].color,
                    opacity: isActive ? 1 : 0.2,
                    transform: isActive ? "scaleY(1)" : "scaleY(0.4)",
                  }}
                />
                <div className="flex items-center gap-2 mb-1.5 pl-3">
                  <span
                    className="text-[10px] font-mono font-bold tracking-[0.22em] uppercase"
                    style={{ color: NODES[i].color }}
                  >
                    0{i + 1}
                  </span>
                  <h4 className={`font-bold text-base sm:text-lg ${isActive ? "text-white" : "text-slate-400"}`}>
                    {c.title}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pl-3">{c.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
