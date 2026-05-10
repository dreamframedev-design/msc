"use client";

import { useEffect, useState, useRef } from "react";

interface DataPoint {
  timepoint: string;
  baseline: number;
  week12: number;
  week24: number;
  week52?: number;
}

const volumeData: DataPoint[] = [
  { timepoint: "Mean Volume Reduction (%)", baseline: 0, week12: 18, week24: 32, week52: 38 },
  { timepoint: "Patients with ≥20% Reduction", baseline: 0, week12: 42, week24: 68, week52: 74 },
  { timepoint: "Patients with ≥30% Reduction", baseline: 0, week12: 18, week24: 45, week52: 58 },
];

const qualityOfLifeData = [
  { metric: "Limb Function Score", improvement: "+28%", change: "positive", value: 28 },
  { metric: "Daily Activity Score", improvement: "+35%", change: "positive", value: 35 },
  { metric: "Pain Reduction", improvement: "-42%", change: "positive", value: 42 },
  { metric: "Skin Thickness (mm)", improvement: "-15%", change: "positive", value: 15 },
];

// Animated number counter component
function AnimatedNumber({ value, duration = 2500, delay = 0, trigger = false }: { value: number; duration?: number; delay?: number; trigger?: boolean }) {
  const [count, setCount] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset count when trigger changes to false
    if (!trigger) {
      setCount(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    // Start animation when triggered
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(value * easeOutQuart);
      
      setCount(current);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    const timeoutId = setTimeout(() => {
      animationRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration, delay, trigger]);

  return <span>{count}</span>;
}

export default function ClinicalDataTable() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Trigger animations when entering viewport
          setIsVisible(true);
        } else {
          // Reset when leaving viewport so animations can re-trigger
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);
  return (
    <div ref={containerRef} className="space-y-6">
      {/* Volume Reduction Chart */}
      <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl p-6 border border-cyan-100">
        <h5 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#F0564A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Limb Volume Reduction Over Time
        </h5>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cyan-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Timepoint</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-700">Baseline</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-700">Week 12</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-700">Week 24</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-700">Week 52</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-100">
              {volumeData.map((row, idx) => (
                <tr key={idx} className="hover:bg-cyan-50/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-700">{row.timepoint}</td>
                  <td className="py-3 px-4 text-center text-slate-600">{row.baseline}%</td>
                  <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-semibold text-[#F0564A]">
                      <AnimatedNumber value={row.week12} duration={2000} delay={idx * 250 + 400} trigger={isVisible} />%
                      <svg className={`w-4 h-4 ${isVisible ? 'animate-bounce-arrow' : ''}`} fill="currentColor" viewBox="0 0 20 20" style={{ animationDelay: `${idx * 200 + 800}ms` }}>
                        <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-900">
                      <AnimatedNumber value={row.week24} duration={2000} delay={idx * 250 + 600} trigger={isVisible} />%
                      <svg className={`w-4 h-4 ${isVisible ? 'animate-bounce-arrow' : ''}`} fill="currentColor" viewBox="0 0 20 20" style={{ animationDelay: `${idx * 200 + 1000}ms` }}>
                        <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-900">
                      <AnimatedNumber value={row.week52 || 0} duration={2000} delay={idx * 250 + 800} trigger={isVisible} />%
                      <svg className={`w-4 h-4 ${isVisible ? 'animate-bounce-arrow' : ''}`} fill="currentColor" viewBox="0 0 20 20" style={{ animationDelay: `${idx * 200 + 1200}ms` }}>
                        <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual Progress Bar */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
            <span>Mean Volume Reduction</span>
            <span className="font-semibold text-slate-900">
              <AnimatedNumber value={38} duration={2500} delay={1200} trigger={isVisible} />% at Week 52
            </span>
          </div>
          <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="absolute inset-0 bg-gradient-to-r from-[#F0564A] via-orange-400 to-yellow-400 rounded-full transition-all duration-[3000ms] ease-in-out"
              style={{ 
                width: isVisible ? "38%" : "0%",
                transitionDelay: "800ms"
              }}
            ></div>
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white"></div>
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>0%</span>
            <span>20%</span>
            <span>40%</span>
            <span>60%</span>
            <span>80%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Quality of Life Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {qualityOfLifeData.map((item, idx) => (
          <div 
            key={idx} 
            className="glass-card p-5 rounded-xl border-l-4 border-l-[#F0564A] hover-glow"
            style={{
              animation: isVisible ? `fadeInUp 0.6s ease-out ${idx * 100 + 1500}ms both` : "none"
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <h6 className="font-semibold text-slate-800 text-sm">{item.metric}</h6>
                <span className={`text-lg font-bold ${
                  item.change === "positive" ? "text-slate-900" : "text-slate-600"
                }`}>
                  {item.improvement.startsWith("+") ? "+" : "-"}
                  <AnimatedNumber value={item.value} duration={2200} delay={1200} trigger={isVisible} />%
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-3">
                <div 
                  className={`h-full rounded-full transition-all duration-[2500ms] ease-in-out ${
                    item.change === "positive" 
                      ? "bg-gradient-to-r from-[#F0564A] to-orange-400" 
                      : "bg-[#F0564A]"
                  }`}
                  style={{ 
                    width: isVisible ? `${item.value}%` : "0%",
                    transitionDelay: "800ms"
                  }}
                ></div>
              </div>
          </div>
        ))}
      </div>

      {/* Study Information Footer */}
      <div 
        className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-4 mt-4"
        style={{
          animation: isVisible ? `fadeInUp 0.6s ease-out 2500ms both` : "none"
        }}
      >
        <p className="text-xs text-slate-600 leading-relaxed">
          <strong className="text-slate-800">Note:</strong> Data shown are from ongoing Phase II clinical studies. 
          Results are preliminary and continue to be evaluated. N = 124 patients enrolled. 
          All data presented are investigational and have not been approved by regulatory authorities.
        </p>
      </div>
    </div>
  );
}

