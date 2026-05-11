"use client";

import { useRef, useState } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";

export default function VennDiagramShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Tie the active index to the scroll progress of the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Map scroll progress (0 to 1) to an index (0, 1, or 2)
  // We use a wider range so it changes as you scroll past it
  const activeIndexFloat = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0, 1, 2]);

  useMotionValueEvent(activeIndexFloat, "change", (latest) => {
    setActiveIndex(Math.min(2, Math.max(0, Math.round(latest))));
  });

  return (
    <div ref={containerRef} className="w-full bg-slate-950 rounded-[2.5rem] p-6 md:p-12 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-12 min-h-[500px]">
      {/* Background Grid & Glow */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F0564A]/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Interactive Diagram */}
      <div className="relative z-10 w-full md:w-1/2 flex flex-col items-center justify-center order-2 md:order-1 mt-8 md:mt-0 sticky top-24 md:static">
        <svg viewBox="0 0 400 400" className="w-full h-auto max-w-md drop-shadow-2xl">
          <defs>
            {/* Active State Gradients (MSC Brand Colors) */}
            <radialGradient id="gradBrightBase" cx="50%" cy="40%" r="80%">
              <stop offset="0%" stopColor="#ff8a80" />
              <stop offset="55%" stopColor="#F0564A" />
              <stop offset="100%" stopColor="#991b1b" />
            </radialGradient>

            <radialGradient id="gradBrightRim" cx="26%" cy="18%" r="90%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.40)" />
              <stop offset="35%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="70%" stopColor="rgba(255,255,255,0.00)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.00)" />
            </radialGradient>

            {/* Inactive State Gradients */}
            <radialGradient id="gradDimBase" cx="50%" cy="42%" r="80%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="40%" stopColor="#fca5a5" stopOpacity="0.15" />
              <stop offset="75%" stopColor="#ef4444" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.6" />
            </radialGradient>

            <radialGradient id="gradDimRim" cx="22%" cy="18%" r="90%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="30%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="65%" stopColor="rgba(255,255,255,0)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>

          {/* Node 1 (Top Left) */}
          <g className={`transition-all duration-500 ${activeIndex === 0 ? 'scale-105 origin-[140px_140px]' : ''}`}>
            <circle cx="140" cy="140" r="100" fill="url(#gradBrightBase)" style={{ opacity: activeIndex === 0 ? 1 : 0, transition: 'opacity 500ms ease' }} />
            <circle cx="140" cy="140" r="98" fill="none" stroke="url(#gradBrightRim)" strokeWidth="2" style={{ opacity: activeIndex === 0 ? 1 : 0, transition: 'opacity 500ms ease' }} />
            <circle cx="140" cy="140" r="100" fill="url(#gradDimBase)" style={{ opacity: activeIndex === 0 ? 0 : 1, transition: 'opacity 500ms ease' }} />
            <circle cx="140" cy="140" r="98" fill="none" stroke="url(#gradDimRim)" strokeWidth="1.5" style={{ opacity: activeIndex === 0 ? 0 : 1, transition: 'opacity 500ms ease' }} />
            <text x="110" y="130" fill="white" style={{ fontFamily: 'sans-serif', fontWeight: 800, fontSize: '16px', textAnchor: 'middle', opacity: activeIndex === 0 ? 1 : 0.5, transition: 'opacity 500ms ease' }}>Discovery</text>
          </g>

          {/* Node 2 (Top Right) */}
          <g className={`transition-all duration-500 ${activeIndex === 1 ? 'scale-105 origin-[260px_140px]' : ''}`}>
            <circle cx="260" cy="140" r="100" fill="url(#gradBrightBase)" style={{ opacity: activeIndex === 1 ? 1 : 0, transition: 'opacity 500ms ease' }} />
            <circle cx="260" cy="140" r="98" fill="none" stroke="url(#gradBrightRim)" strokeWidth="2" style={{ opacity: activeIndex === 1 ? 1 : 0, transition: 'opacity 500ms ease' }} />
            <circle cx="260" cy="140" r="100" fill="url(#gradDimBase)" style={{ opacity: activeIndex === 1 ? 0 : 1, transition: 'opacity 500ms ease' }} />
            <circle cx="260" cy="140" r="98" fill="none" stroke="url(#gradDimRim)" strokeWidth="1.5" style={{ opacity: activeIndex === 1 ? 0 : 1, transition: 'opacity 500ms ease' }} />
            <text x="290" y="130" fill="white" style={{ fontFamily: 'sans-serif', fontWeight: 800, fontSize: '16px', textAnchor: 'middle', opacity: activeIndex === 1 ? 1 : 0.5, transition: 'opacity 500ms ease' }}>Clinical</text>
          </g>

          {/* Node 3 (Bottom Center) */}
          <g className={`transition-all duration-500 ${activeIndex === 2 ? 'scale-105 origin-[200px_240px]' : ''}`}>
            <circle cx="200" cy="240" r="100" fill="url(#gradBrightBase)" style={{ opacity: activeIndex === 2 ? 1 : 0, transition: 'opacity 500ms ease' }} />
            <circle cx="200" cy="240" r="98" fill="none" stroke="url(#gradBrightRim)" strokeWidth="2" style={{ opacity: activeIndex === 2 ? 1 : 0, transition: 'opacity 500ms ease' }} />
            <circle cx="200" cy="240" r="100" fill="url(#gradDimBase)" style={{ opacity: activeIndex === 2 ? 0 : 1, transition: 'opacity 500ms ease' }} />
            <circle cx="200" cy="240" r="98" fill="none" stroke="url(#gradDimRim)" strokeWidth="1.5" style={{ opacity: activeIndex === 2 ? 0 : 1, transition: 'opacity 500ms ease' }} />
            <text x="200" y="280" fill="white" style={{ fontFamily: 'sans-serif', fontWeight: 800, fontSize: '16px', textAnchor: 'middle', opacity: activeIndex === 2 ? 1 : 0.5, transition: 'opacity 500ms ease' }}>Commercial</text>
          </g>

          {/* Center Intersection */}
          <circle cx="200" cy="170" r="20" fill="white" className="animate-pulse" style={{ opacity: 0.8 }} />
          <text x="200" y="175" fill="#991b1b" style={{ fontFamily: 'sans-serif', fontWeight: 900, fontSize: '12px', textAnchor: 'middle' }}>MSC</text>
        </svg>
      </div>

      {/* Content Pane */}
      <div className="relative z-10 w-full md:w-1/2 flex flex-col justify-center order-1 md:order-2">
        <div className="mb-8">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F0564A] mb-3 block">Scroll-Linked Animation</span>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">The Convergence Model</h3>
          <p className="text-lg text-slate-400 font-light leading-relaxed">
            As you scroll down the page, this diagram automatically highlights the relevant section, keeping the user's attention perfectly synced with your narrative.
          </p>
        </div>

        <div className="space-y-4">
          <div className={`p-4 md:p-5 rounded-2xl border transition-all duration-500 ${activeIndex === 0 ? 'bg-slate-800 border-[#F0564A]/50 shadow-[0_0_20px_rgba(240,86,74,0.15)] scale-[1.02] md:scale-105' : 'bg-slate-900/50 border-slate-800 opacity-50'}`}>
            <h4 className={`font-bold mb-1 ${activeIndex === 0 ? 'text-white' : 'text-slate-400'}`}>Discovery Phase Integration</h4>
            <p className="text-xs md:text-sm text-slate-500">Highlighting early-stage pipeline assets and proprietary screening technologies.</p>
          </div>
          <div className={`p-4 md:p-5 rounded-2xl border transition-all duration-500 ${activeIndex === 1 ? 'bg-slate-800 border-[#F0564A]/50 shadow-[0_0_20px_rgba(240,86,74,0.15)] scale-[1.02] md:scale-105' : 'bg-slate-900/50 border-slate-800 opacity-50'}`}>
            <h4 className={`font-bold mb-1 ${activeIndex === 1 ? 'text-white' : 'text-slate-400'}`}>Clinical Translation</h4>
            <p className="text-xs md:text-sm text-slate-500">Mapping the journey from bench to bedside with clear milestone tracking.</p>
          </div>
          <div className={`p-4 md:p-5 rounded-2xl border transition-all duration-500 ${activeIndex === 2 ? 'bg-slate-800 border-[#F0564A]/50 shadow-[0_0_20px_rgba(240,86,74,0.15)] scale-[1.02] md:scale-105' : 'bg-slate-900/50 border-slate-800 opacity-50'}`}>
            <h4 className={`font-bold mb-1 ${activeIndex === 2 ? 'text-white' : 'text-slate-400'}`}>Commercial Readiness</h4>
            <p className="text-xs md:text-sm text-slate-500">Demonstrating market potential, partnerships, and go-to-market strategies.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
