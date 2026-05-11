'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const STIMULATION_DATA = [
  { condition: 'Vehicle', value: 0, error: 0 },
  { condition: 'Agonist A', value: 240, error: 15 },
  { condition: 'Agonist B', value: 5, error: 5 },
  { condition: 'Combo', value: 640, error: 40 },
];

const CUSTOM_TOOLTIP = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 md:p-5 border border-slate-100 shadow-2xl rounded-2xl min-w-[200px] max-w-[85vw] md:min-w-[280px] md:max-w-[320px] relative overflow-hidden whitespace-normal z-50">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#F0564A]"></div>
        <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{data.condition}</p>
        <div className="flex justify-between items-baseline mb-3 gap-4">
          <span className="text-xs md:text-sm font-bold text-slate-600">Expression:</span>
          <span className="text-xl md:text-2xl font-black text-[#F0564A]">{data.value} <span className="text-[10px] md:text-xs text-slate-400 font-bold">MFI</span></span>
        </div>
        <div className="bg-slate-50 p-3 md:p-4 rounded-xl border border-slate-100">
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
            {data.condition === 'Combo' 
              ? "✨ Notice the synergistic amplification. This demonstrates the powerful combined effect of the dual-agonist approach." 
              : data.condition === 'Vehicle'
              ? "Baseline measurement established. Hover over the other columns to see the treatment effect."
              : "Monotherapy shows a clear activation signal, which is synergistically amplified in the combination condition."}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function JurkatStimulationGraph() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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
            <h4 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">T-Cell Activation Assay</h4>
            {/* "Hover Me" Indicator */}
            <div className="flex items-center gap-1.5 bg-[#F0564A]/10 text-[#F0564A] px-2 py-1 md:px-3 md:py-1.5 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <svg className="w-3 h-3 md:w-4 md:h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Tap Data</span>
            </div>
          </div>
          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#F0564A] mt-1 md:mt-2">Receptor Engagement Profile</p>
        </div>
        <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 hidden sm:block">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Technique</span>
          <div className="text-[10px] font-bold text-slate-900">Flow Cytometry</div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[250px] md:min-h-[300px] pb-4">
        {isVisible && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={STIMULATION_DATA} margin={{ top: 20, right: 20, bottom: 30, left: 20 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff7a6e" />
                  <stop offset="100%" stopColor="#F0564A" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              
              <XAxis 
                dataKey="condition" 
                stroke="#94a3b8"
                fontSize={10}
                fontWeight={700}
                axisLine={false}
                tickLine={false}
                label={{ value: 'T-Cell Activation Condition', position: 'bottom', offset: 20, fill: '#64748b', fontSize: 10, fontWeight: 900, textAnchor: 'middle', letterSpacing: '0.1em' }}
              />

              <YAxis 
                stroke="#94a3b8"
                fontSize={10}
                fontWeight={700}
                domain={[0, 700]}
                axisLine={false}
                tickLine={false}
                label={{ value: 'CD69 Expression (MFI)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10, fontWeight: 900, textAnchor: 'middle', letterSpacing: '0.1em' }}
              />
              
              <Tooltip 
                content={<CUSTOM_TOOLTIP />}
                cursor={{ fill: '#f8fafc' }}
                allowEscapeViewBox={{ x: false, y: true }}
                wrapperStyle={{ zIndex: 100 }}
              />

              <Bar 
                dataKey="value" 
                radius={[8, 8, 0, 0]}
                barSize={45}
                isAnimationActive={true}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {STIMULATION_DATA.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.condition === 'Vehicle' ? '#e2e8f0' : 'url(#barGradient)'}
                    className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
        <div className="flex gap-4">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#F0564A]"></div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Stimulated</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-200"></div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Basal</span>
           </div>
        </div>
        <p className="text-[10px] italic text-slate-400">Validated: Flow Cytometry Data</p>
      </div>
    </div>
  );
}
