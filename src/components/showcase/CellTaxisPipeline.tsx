"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const indications = [
  {
    name: "Lymphedema",
    progress: {
      "Pre-clinical": 100,
      "Phase I": 100,
      "Phase II": 90,
      "Phase III": 0,
    },
    description: "Investigational therapy for lower and upper limb lymphedema, now enrolling in Phase II studies.",
  },
  {
    name: "Lipedema",
    progress: {
      "Pre-clinical": 100,
      "Phase I": 100,
      "Phase II": 50,
      "Phase III": 0,
    },
    description: "Ongoing Phase II studies evaluating our investigational therapy for lipedema.",
  },
  {
    name: "Lymphatic Targeting",
    progress: {
      "Pre-clinical": 75,
      "Phase I": 0,
      "Phase II": 0,
      "Phase III": 0,
    },
    description: "Exploring applications across broader lymphatic disorders and indications.",
  },
  {
    name: "Topical Delivery",
    progress: {
      "Pre-clinical": 75,
      "Phase I": 0,
      "Phase II": 0,
      "Phase III": 0,
    },
    description: "Developing topical delivery options for localized treatment approaches.",
  },
];

function ContinuousPipelineBar({ 
  progress,
  delay = 0
}: { 
  progress: { "Pre-clinical": number; "Phase I": number; "Phase II": number; "Phase III": number };
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (barRef.current) {
      observer.observe(barRef.current);
    }

    return () => {
      if (barRef.current) {
        observer.unobserve(barRef.current);
      }
    };
  }, [delay]);

  const totalProgress = (
    (progress["Pre-clinical"] * 0.25) +
    (progress["Phase I"] * 0.25) +
    (progress["Phase II"] * 0.25) +
    (progress["Phase III"] * 0.25)
  );

  return (
    <div 
      ref={barRef} 
      className="relative w-full h-10 bg-slate-900 overflow-hidden border border-slate-700 rounded-full shadow-inner isolate"
      style={{
        WebkitMaskImage: '-webkit-radial-gradient(white, black)',
        clipPath: 'inset(0 round 9999px)',
        contain: 'paint',
      }}
    >
      {/* Phase divider lines */}
      <div className="absolute inset-0 flex pointer-events-none z-10">
        <div className="absolute left-[25%] top-0 bottom-0 w-px bg-slate-700/50"></div>
        <div className="absolute left-[50%] top-0 bottom-0 w-px bg-slate-700/50"></div>
        <div className="absolute left-[75%] top-0 bottom-0 w-px bg-slate-700/50"></div>
      </div>
      
      {/* Continuous gradient bar (The "Liquid") */}
      {totalProgress > 0 && (
        <div
          className="absolute left-0 top-0 h-full overflow-hidden rounded-full shadow-[0_0_15px_rgba(240,86,74,0.5)]"
          style={{
            width: isVisible ? `${totalProgress}%` : "0%",
            transition: `width 2800ms cubic-bezier(0.4, 0, 0.2, 1)`,
            transitionDelay: `${delay}ms`,
            backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent), linear-gradient(to right, #D94D42, #F0564A, #ff7a6e, #ff7a6e)',
            backgroundSize: '200% 100%, 100% 100%',
            animation: 'shimmer 2.5s linear infinite',
            animationDelay: `${delay + 500}ms`,
          }}
        >
          {/* Subtle inner highlights to make it look like a glass pipe */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/20"></div>
          <div className="absolute top-1 left-2 right-2 h-2 bg-gradient-to-b from-white/40 to-transparent rounded-full blur-[1px]"></div>
        </div>
      )}
    </div>
  );
}

export default function CellTaxisPipeline() {
  return (
    <div className="w-full bg-slate-950 rounded-[2.5rem] p-8 md:p-12 border border-slate-800 shadow-xl overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#F0564A]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10">
        <div className="mb-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Fluidic Pipeline Visualization</h3>
          <p className="text-slate-400 max-w-2xl mx-auto">
            A premium, continuous-flow pipeline design. The "liquid" animates in to represent clinical progress, complete with glass-tube highlights and shimmer effects.
          </p>
        </div>

        {/* Desktop Pipeline Chart */}
        <div className="hidden lg:block">
          {/* Pipeline Header */}
          <div className="grid grid-cols-12 gap-6 mb-8">
            <div className="col-span-3"></div>
            <div className="col-span-9">
              <div className="flex gap-2">
                {["Pre-clinical", "Phase I", "Phase II", "Phase III"].map((stage, idx) => (
                  <div key={idx} className="flex-1 text-center">
                    <div className="px-3 py-3 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
                      <div className="text-xs font-bold text-slate-300 uppercase tracking-widest">{stage}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pipeline Rows */}
          <div className="space-y-6">
            {indications.map((indication, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-6 items-center group hover:bg-slate-900/50 rounded-2xl p-3 -m-3 transition-colors duration-300">
                <div className="col-span-3 flex flex-col justify-center pl-2">
                  <span className="text-lg font-bold text-white tracking-wide">{indication.name}</span>
                  <span className="text-xs text-slate-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{indication.description}</span>
                </div>
                <div className="col-span-9">
                  <ContinuousPipelineBar
                    progress={indication.progress}
                    delay={0}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Pipeline Chart */}
        <div className="lg:hidden space-y-8">
          {indications.map((indication, idx) => (
            <div key={idx} className="border-b border-slate-800 pb-8 last:border-b-0 last:pb-0">
              <div className="mb-4">
                <span className="text-xl font-bold text-white">{indication.name}</span>
                <p className="text-sm text-slate-400 mt-2">{indication.description}</p>
              </div>
              <div className="mt-6">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                  <span>Pre</span>
                  <span>Ph1</span>
                  <span>Ph2</span>
                  <span>Ph3</span>
                </div>
                <ContinuousPipelineBar
                  progress={indication.progress}
                  delay={0}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
