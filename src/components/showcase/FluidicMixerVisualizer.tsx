"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play, Settings2, Zap } from "lucide-react";

/* =============================================================
   Microfluidic Mixer — premium redesign
   Visual takes center stage, controls dock as an elegant overlay,
   real particles flow through the pipes and out the LNP outlet.
   ============================================================= */
export default function FluidicMixerVisualizer() {
  const [flowRate, setFlowRate] = useState(50); // mL/min
  const [lipidRatio, setLipidRatio] = useState(3); // X:1
  const [temperature, setTemperature] = useState(25); // °C
  const [isMixing, setIsMixing] = useState(true);
  const [controlsOpen, setControlsOpen] = useState(true);

  // Derived metrics
  const reynolds = Math.round(flowRate * 142 * (lipidRatio * 0.5));
  const mixingTime = (100 / flowRate * (lipidRatio * 0.8)).toFixed(1);
  const particleSize = Math.round(60 + (100 - flowRate) * 0.5 + (temperature - 25) * 0.8);

  // Animation cadence (faster when flow rate is higher)
  const cycleSec = useMemo(() => Math.max(0.6, 3.5 - flowRate * 0.03), [flowRate]);

  // Chamber color shifts with temperature
  const chamberColor =
    temperature < 30 ? "#5BCBD7" : temperature < 50 ? "#a855f7" : "#F0564A";

  // Stream particles — deterministic seeded array, animated via CSS
  const aqueousParticles = useMemo(
    () => Array.from({ length: 7 }, (_, i) => i),
    []
  );
  const lipidParticles = useMemo(
    () => Array.from({ length: 7 }, (_, i) => i),
    []
  );
  const outletParticles = useMemo(
    () => Array.from({ length: 10 }, (_, i) => i),
    []
  );

  return (
    <div className="w-full bg-[#070710] rounded-3xl sm:rounded-[2rem] border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Ambient background */}
      <div
        className="absolute inset-0 opacity-[0.18] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(120,140,200,0.5) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <motion.div
        className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(91,203,215,0.18) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(240,86,74,0.16) 0%, transparent 65%)",
          filter: "blur(85px)",
        }}
        animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ============ HEADER STRIP ============ */}
      <div className="relative z-10 flex items-center justify-between gap-4 px-5 sm:px-8 pt-5 sm:pt-7 pb-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F0564A] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.22em] text-[#5BCBD7]/90">
              ▣ MICROFLUIDIC MIXER · LIVE
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-white tracking-tight">
            Nanoparticle formulation dynamics
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMixing((m) => !m)}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#F0564A] hover:bg-[#D94D42] text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(240,86,74,0.4)] hover:shadow-[0_0_30px_rgba(240,86,74,0.6)]"
          >
            {isMixing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            {isMixing ? "Pause" : "Resume"}
          </button>
        </div>
      </div>

      {/* ============ MAIN STAGE ============ */}
      <div className="relative z-10 px-3 sm:px-6 md:px-8 pb-3 sm:pb-6">
        <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-black/30 to-[#0A0A14]/60 border border-white/[0.06] overflow-hidden">
          {/* SVG visualization — full bleed */}
          <div className="relative w-full aspect-[3/2] sm:aspect-[2/1]">
            <svg
              viewBox="0 0 800 400"
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Stream gradients */}
                <linearGradient id="aqGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="#5BCBD7" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#5BCBD7" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="liGrad" x1="1" y1="0" x2="0" y2="0">
                  <stop offset="0%" stopColor="#F08435" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="#F0564A" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#F0564A" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="outGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chamberColor} stopOpacity="0.95" />
                  <stop offset="100%" stopColor={chamberColor} stopOpacity="0.3" />
                </linearGradient>
                <radialGradient id="chamberGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={chamberColor} stopOpacity="0.65" />
                  <stop offset="60%" stopColor={chamberColor} stopOpacity="0.15" />
                  <stop offset="100%" stopColor={chamberColor} stopOpacity="0" />
                </radialGradient>
                <radialGradient id="chamberCore" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="40%" stopColor={chamberColor} stopOpacity="0.7" />
                  <stop offset="100%" stopColor={chamberColor} stopOpacity="0" />
                </radialGradient>
                <filter id="particleGlow">
                  <feGaussianBlur stdDeviation="2" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <style>
                  {`
                  @keyframes flowAQ {
                    0% { offset-distance: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    85% { opacity: 1; }
                    100% { offset-distance: 100%; opacity: 0; }
                  }
                  @keyframes flowLI {
                    0% { offset-distance: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    85% { opacity: 1; }
                    100% { offset-distance: 100%; opacity: 0; }
                  }
                  @keyframes flowOUT {
                    0% { offset-distance: 0%; opacity: 0; }
                    8% { opacity: 1; }
                    92% { opacity: 1; }
                    100% { offset-distance: 100%; opacity: 0; }
                  }
                  @keyframes swirl {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                  }
                  @keyframes pulseChamber {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.06); opacity: 0.85; }
                  }
                  .stream-aq {
                    offset-path: path('M 0 200 L 360 200');
                    animation: flowAQ ${cycleSec}s linear infinite;
                    animation-play-state: ${isMixing ? "running" : "paused"};
                  }
                  .stream-li {
                    offset-path: path('M 800 200 L 440 200');
                    animation: flowLI ${cycleSec}s linear infinite;
                    animation-play-state: ${isMixing ? "running" : "paused"};
                  }
                  .stream-out {
                    offset-path: path('M 400 280 L 400 400');
                    animation: flowOUT ${(cycleSec * 0.7).toFixed(2)}s linear infinite;
                    animation-play-state: ${isMixing ? "running" : "paused"};
                  }
                  .chamber-swirl {
                    transform-origin: 400px 200px;
                    animation: swirl ${(cycleSec * 1.4).toFixed(2)}s linear infinite;
                    animation-play-state: ${isMixing ? "running" : "paused"};
                  }
                  .chamber-pulse {
                    transform-origin: 400px 200px;
                    animation: pulseChamber 2.4s ease-in-out infinite;
                    animation-play-state: ${isMixing ? "running" : "paused"};
                  }
                  `}
                </style>
              </defs>

              {/* === Pipe outlines === */}
              <g fill="#0A0A14" stroke="#1e293b" strokeWidth="1.5">
                {/* Left pipe (aqueous) */}
                <rect x="0" y="178" width="370" height="44" rx="3" />
                {/* Right pipe (lipid) */}
                <rect x="430" y="178" width="370" height="44" rx="3" />
                {/* Bottom pipe (outlet) */}
                <rect x="378" y="270" width="44" height="130" rx="3" />
                {/* Chamber outer ring */}
                <circle cx="400" cy="200" r="85" fill="#0A0A14" />
              </g>

              {/* === Stream fills === */}
              <rect x="0" y="186" width="370" height="28" fill="url(#aqGrad)" opacity="0.55" />
              <rect x="430" y={200 - 14 * Math.min(1.5, lipidRatio / 3)} width="370" height={28 * Math.min(1.5, lipidRatio / 3)} fill="url(#liGrad)" opacity="0.55" />
              <rect x="386" y="270" width="28" height="130" fill="url(#outGrad)" opacity="0.65" />

              {/* === Chamber glow halo === */}
              <circle cx="400" cy="200" r="120" fill="url(#chamberGlow)" className="chamber-pulse" />

              {/* === Inlet labels === */}
              <g fontFamily="ui-monospace, 'SF Mono', monospace" fontWeight="700" letterSpacing="2">
                <text x="20" y="168" fill="#5BCBD7" fontSize="11">AQUEOUS INLET</text>
                <rect x="14" y="173" width="100" height="1" fill="#5BCBD7" opacity="0.4" />
                <text x="780" y="168" fill="#F0564A" fontSize="11" textAnchor="end">LIPID INLET</text>
                <rect x="690" y="173" width="100" height="1" fill="#F0564A" opacity="0.4" />
                <text x="380" y="395" fill={chamberColor} fontSize="11" textAnchor="end">LNP OUTLET</text>
              </g>

              {/* === Flowing particles (aqueous) === */}
              {aqueousParticles.map((i) => (
                <circle
                  key={`aq-${i}`}
                  r="3.5"
                  fill="#FFFFFF"
                  filter="url(#particleGlow)"
                  className="stream-aq"
                  style={{ animationDelay: `${(i * cycleSec) / aqueousParticles.length}s` }}
                />
              ))}

              {/* === Flowing particles (lipid) === */}
              {lipidParticles.map((i) => (
                <circle
                  key={`li-${i}`}
                  r="3.5"
                  fill="#FFE6D6"
                  filter="url(#particleGlow)"
                  className="stream-li"
                  style={{ animationDelay: `${(i * cycleSec) / lipidParticles.length}s` }}
                />
              ))}

              {/* === Mixing chamber === */}
              <g>
                {/* Outer chamber ring */}
                <circle cx="400" cy="200" r="72" fill="none" stroke="#334155" strokeWidth="2" />
                <circle cx="400" cy="200" r="66" fill="url(#chamberCore)" opacity="0.5" className="chamber-pulse" />

                {/* Inner swirl */}
                <g className="chamber-swirl">
                  <path
                    d="M 400 138 Q 460 138 470 200 Q 470 262 400 262 Q 330 262 330 200 Q 330 138 400 138"
                    fill="none"
                    stroke={chamberColor}
                    strokeWidth="2.5"
                    opacity="0.55"
                    strokeDasharray="3 5"
                  />
                  <path
                    d="M 400 154 Q 446 154 454 200 Q 454 246 400 246 Q 346 246 346 200 Q 346 154 400 154"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    opacity="0.5"
                    strokeDasharray="2 4"
                  />
                  {/* Particles dancing inside */}
                  <circle cx="400" cy="148" r="3" fill="#ffffff" filter="url(#particleGlow)" />
                  <circle cx="455" cy="200" r="2.5" fill="#ffffff" filter="url(#particleGlow)" />
                  <circle cx="345" cy="200" r="3.5" fill="#ffffff" filter="url(#particleGlow)" />
                  <circle cx="400" cy="252" r="2.5" fill="#ffffff" filter="url(#particleGlow)" />
                  <circle cx="430" cy="170" r="2" fill={chamberColor} filter="url(#particleGlow)" opacity="0.8" />
                  <circle cx="370" cy="230" r="2" fill={chamberColor} filter="url(#particleGlow)" opacity="0.8" />
                </g>

                {/* Center hot-spot */}
                <circle cx="400" cy="200" r="14" fill="#ffffff" opacity="0.92" className="chamber-pulse" />
                <text x="400" y="204" fill={chamberColor} fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="ui-monospace, monospace">
                  LNP
                </text>
              </g>

              {/* === Outlet particles (formed nanoparticles) === */}
              {outletParticles.map((i) => (
                <circle
                  key={`out-${i}`}
                  r={2 + (particleSize / 80)}
                  fill={chamberColor}
                  filter="url(#particleGlow)"
                  className="stream-out"
                  style={{ animationDelay: `${(i * cycleSec * 0.7) / outletParticles.length}s` }}
                />
              ))}
            </svg>

            {/* ============ FLOATING CONTROL PANEL (desktop overlay only) ============ */}
            <div
              className={`hidden sm:block absolute top-5 left-5 w-[260px] md:w-[280px] rounded-2xl border bg-black/55 backdrop-blur-2xl shadow-2xl transition-all ${
                controlsOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
            >
              <div className="p-5 space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
                  <Settings2 className="w-3.5 h-3.5 text-[#5BCBD7]" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-white/80">
                    Parameters
                  </span>
                </div>
                <Slider label="Flow Rate" unit="mL/min" accent="#F0564A" min={10} max={100} value={flowRate} onChange={setFlowRate} />
                <Slider label="Aqueous : Lipid" unit=":1" accent="#5BCBD7" min={1} max={5} step={0.5} value={lipidRatio} onChange={setLipidRatio} />
                <Slider label="Temperature" unit="°C" accent="#F08435" min={10} max={80} value={temperature} onChange={setTemperature} />
              </div>
            </div>

            {/* ============ DESKTOP STATS BAR (bottom-right) ============ */}
            <div className="absolute bottom-3 sm:bottom-5 right-3 sm:right-5 hidden sm:flex flex-col gap-2 rounded-2xl bg-black/55 backdrop-blur-2xl border border-white/[0.08] p-4 shadow-2xl">
              <Stat label="Reynolds" value={reynolds.toLocaleString()} color="text-white" />
              <Stat label="Mixing time" value={`${mixingTime} ms`} color="text-white" />
              <Stat label="Particle size" value={`${particleSize} nm`} color="text-emerald-400" highlight />
            </div>
          </div>

          {/* ============ MOBILE: inline controls + stats BELOW the canvas ============ */}
          <div className="sm:hidden border-t border-white/[0.06]">
            {/* Mobile controls — inline, never overlap viz */}
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
                <Settings2 className="w-3.5 h-3.5 text-[#5BCBD7]" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-white/80">
                  Parameters
                </span>
              </div>
              <Slider label="Flow Rate" unit="mL/min" accent="#F0564A" min={10} max={100} value={flowRate} onChange={setFlowRate} />
              <Slider label="Aqueous : Lipid" unit=":1" accent="#5BCBD7" min={1} max={5} step={0.5} value={lipidRatio} onChange={setLipidRatio} />
              <Slider label="Temperature" unit="°C" accent="#F08435" min={10} max={80} value={temperature} onChange={setTemperature} />
            </div>
            {/* Mobile stats strip */}
            <div className="grid grid-cols-3 gap-2 p-3 border-t border-white/[0.06]">
              <MobileStat label="Reynolds" value={reynolds.toLocaleString()} color="#FFFFFF" />
              <MobileStat label="Mix Time" value={`${mixingTime}ms`} color="#FFFFFF" />
              <MobileStat label="Particle" value={`${particleSize}nm`} color="#34d399" />
            </div>
          </div>
        </div>

        {/* Auto-derived insight chip below the stage */}
        <div className="mt-3 sm:mt-4 flex items-center gap-2 flex-wrap text-[10px] sm:text-xs text-white/55 px-1">
          <Zap className="w-3 h-3 text-[#F0564A]" />
          <span className="font-mono font-bold text-[#F0564A]/90 uppercase tracking-wider">Live insight</span>
          <span className="text-white/40">·</span>
          <span>
            Higher flow rate &amp; lower temp ={" "}
            <span className="text-emerald-400 font-bold">smaller LNPs</span>. Try adjusting flow rate to see particle size respond.
          </span>
        </div>
      </div>
    </div>
  );
}

/* ============ SUB-COMPONENTS ============ */
function Slider({
  label,
  unit,
  accent,
  min,
  max,
  step = 1,
  value,
  onChange,
}: {
  label: string;
  unit: string;
  accent: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-[10px] font-bold text-white/60 uppercase tracking-[0.16em]">
          {label}
        </label>
        <span className="text-xs font-mono font-bold" style={{ color: accent }}>
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-white/[0.06] rounded-lg appearance-none cursor-pointer"
        style={{ accentColor: accent }}
      />
    </div>
  );
}

function Stat({ label, value, color, highlight }: { label: string; value: string; color: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-6 min-w-[180px]">
      <span className="text-[10px] uppercase tracking-[0.18em] text-white/45 font-bold">{label}</span>
      <span className={`text-sm font-mono font-bold ${color} ${highlight ? "drop-shadow-[0_0_10px_currentColor]" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function MobileStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="text-center px-2">
      <div className="text-[9px] uppercase tracking-wider text-white/45 font-bold mb-1">{label}</div>
      <div className="text-sm font-mono font-bold" style={{ color }}>{value}</div>
    </div>
  );
}
