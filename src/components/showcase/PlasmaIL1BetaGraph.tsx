'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine, Cell
} from 'recharts';

/**
 * MASTER MAPPING FUNCTION
 * Replicates the "Broken Axis" look from the screenshot.
 * Maps values 0-1 to 0-60% of chart height.
 * Maps values 1-3 to 60-100% of chart height.
 */
const mapY = (val: number) => {
  if (val <= 1) return val * 0.75; // Zoom in on the 0-1 range
  return 0.75 + (val - 1) * 0.125; // Compress the 1-3 range
};

// Randomized data to not match client
const PLASMA_DATA = [
  // Matrix Alpha (Target Mean: 0.20)
  { realVal: 0.08, x: 0.94 }, { realVal: 0.15, x: 0.97 }, 
  { realVal: 0.22, x: 1.00 }, { realVal: 0.24, x: 1.03 }, 
  { realVal: 0.62, x: 1.00 }, 

  // Matrix Beta (Target Mean: 0.09)
  { realVal: 0.06, x: 1.96 }, { realVal: 0.12, x: 2.00 }, { realVal: 0.14, x: 2.04 },
  { realVal: 1.95, x: 2.00 }, { realVal: 2.65, x: 2.00 }, 

  // Matrix Gamma (Target Mean: 0.07)
  { realVal: 0.05, x: 2.95 }, { realVal: 0.09, x: 2.98 }, { realVal: 0.11, x: 3.02 }, 
  { realVal: 0.14, x: 3.05 }, { realVal: 0.18, x: 3.00 },
].map(d => ({ ...d, value: mapY(d.realVal) }));

const MEANS = [
  { x: 1, realVal: 0.23 },
  { x: 2, realVal: 0.12 },
  { x: 3, realVal: 0.11 },
].map(m => ({ ...m, value: mapY(m.realVal) }));

const CUSTOM_TOOLTIP = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const matrixName = data.x < 1.5 ? 'Matrix Alpha' : data.x < 2.5 ? 'Matrix Beta' : 'Matrix Gamma';
    return (
      <div className="bg-white p-4 md:p-5 border border-slate-100 shadow-2xl rounded-2xl min-w-[200px] max-w-[85vw] md:min-w-[280px] md:max-w-[320px] relative overflow-hidden whitespace-normal z-50">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#F0564A]"></div>
        <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{matrixName}</p>
        <div className="flex justify-between items-baseline mb-1 gap-4">
          <span className="text-xs md:text-sm font-bold text-slate-600">Concentration:</span>
          <span className="text-xl md:text-2xl font-black text-[#F0564A]">{data.realVal.toFixed(3)} <span className="text-[10px] md:text-xs text-slate-400 font-bold">pg/mL</span></span>
        </div>
        <div className="flex justify-between items-baseline mb-3 gap-4">
          <span className="text-xs md:text-sm font-bold text-slate-600">Variance:</span>
          <span className="text-xs md:text-sm font-bold text-slate-400">±{(data.realVal * 0.05).toFixed(3)}</span>
        </div>
        <div className="bg-slate-50 p-3 md:p-4 rounded-xl border border-slate-100">
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
            {data.realVal > 1.5 
              ? "🎯 Outlier detected. We highlight these data points to show investors the broad dynamic range of the assay." 
              : "Consistent baseline clustering demonstrates the high precision and reproducibility of the platform."}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function PlasmaIL1BetaGraph() {
  const [isVisible, setIsVisible] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          // Animate the reference lines sliding up over 1.5 seconds
          let start = performance.now();
          const duration = 1500;
          
          const animate = (time: number) => {
            const elapsed = time - start;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutCubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            setAnimationProgress(easeProgress);
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          
          requestAnimationFrame(animate);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
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
    <div ref={containerRef} className="w-full h-full flex flex-col p-4 md:p-8 bg-white rounded-[2.5rem] shadow-inner border border-slate-100/50 relative group">
      
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6 md:mb-8 gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <h4 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">Multiplex Cytokine Expression</h4>
            {/* "Hover Me" Indicator */}
            <div className="flex items-center gap-1.5 bg-[#F0564A]/10 text-[#F0564A] px-2 py-1 md:px-3 md:py-1.5 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <svg className="w-3 h-3 md:w-4 md:h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Tap Insights</span>
            </div>
          </div>
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#F0564A] mt-1 md:mt-2">Biomarker Profile Variance</p>
        </div>
        <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 hidden sm:block">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Platform</span>
          <div className="text-[10px] font-bold text-slate-900">High-Sensitivity Array</div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[250px] md:min-h-[300px] pb-4">
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 30, left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            
            <XAxis 
              type="number" 
              dataKey="x" 
              ticks={[1, 2, 3]}
              tickFormatter={(v) => v === 1 ? 'Matrix Alpha' : v === 2 ? 'Matrix Beta' : 'Matrix Gamma'}
              domain={[0.5, 3.5]}
              axisLine={{ stroke: '#cbd5e1', strokeWidth: 2 }}
              tickLine={false}
              fontSize={10}
              fontWeight={900}
              stroke="#94a3b8"
              label={{ value: 'Matrix Type', position: 'bottom', offset: 20, fill: '#64748b', fontSize: 10, fontWeight: 900, letterSpacing: '0.1em' }}
            />

            <YAxis 
              type="number" 
              dataKey="value" 
              domain={[0, 1.1]} // Boundary of our mapped space
              ticks={[0, mapY(0.25), mapY(0.5), mapY(0.75), mapY(2), mapY(3)]}
              tickFormatter={(v) => {
                 if (v === 0) return '0.00';
                 if (v === mapY(0.25)) return '0.25';
                 if (v === mapY(0.5)) return '0.50';
                 if (v === mapY(0.75)) return '0.75';
                 if (v === mapY(2)) return '2';
                 if (v === mapY(3)) return '3';
                 return '';
              }}
              axisLine={{ stroke: '#cbd5e1', strokeWidth: 2 }}
              tickLine={false}
              fontSize={10}
              fontWeight={900}
              stroke="#94a3b8"
              label={{ value: 'Analyte Concentration (pg/mL)', angle: -90, position: 'insideLeft', offset: -20, fill: '#64748b', fontSize: 10, fontWeight: 900 }}
            />
            
            <Tooltip 
              content={<CUSTOM_TOOLTIP />} 
              cursor={{ strokeDasharray: '3 3', stroke: '#e2e8f0' }} 
              allowEscapeViewBox={{ x: false, y: true }}
              wrapperStyle={{ zIndex: 100 }}
            />
            
            {/* FIXED MEAN LINES: Animated sliding up */}
            {MEANS.map((mean, idx) => (
              <ReferenceLine 
                key={idx}
                y={mean.value * animationProgress} 
                stroke="#F0564A" 
                strokeWidth={3}
                segment={[{ x: mean.x - 0.25, y: mean.value * animationProgress }, { x: mean.x + 0.25, y: mean.value * animationProgress }]}
              />
            ))}

            {isVisible && (
              <Scatter data={PLASMA_DATA} isAnimationActive={true} animationDuration={1500}>
                {PLASMA_DATA.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill="#0f172a" 
                    stroke="#fff" 
                    strokeWidth={2} 
                    r={6} 
                    className="drop-shadow-sm hover:fill-[#F0564A] transition-colors duration-300 cursor-pointer"
                  />
                ))}
              </Scatter>
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="w-4 h-1 bg-[#F0564A]"></div>
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mean Value</span>
        </div>
        <p className="text-[10px] italic text-slate-400 font-medium">Comparison of detection levels across matrices</p>
      </div>
    </div>
  );
}
