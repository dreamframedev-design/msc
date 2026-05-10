"use client";

import React, { useEffect, useState } from 'react';

export default function FluidicMixerVisualizer() {
  const [flowRate, setFlowRate] = useState(50);
  const [lipidRatio, setLipidRatio] = useState(3);
  const [temperature, setTemperature] = useState(25);
  const [isMixing, setIsMixing] = useState(true);

  // Calculate animation speeds based on flow rate
  const speed = 101 - flowRate; // 1 to 100
  const animationDuration = `${speed * 0.02}s`;
  
  // Calculate visual properties
  const reynolds = Math.round(flowRate * 142 * (lipidRatio * 0.5));
  const mixingTime = (100 / flowRate * (lipidRatio * 0.8)).toFixed(1);
  const particleSize = Math.round(60 + (100 - flowRate) * 0.5 + (temperature - 25) * 0.8);
  
  // Determine glow color based on temperature
  const getGlowColor = () => {
    if (temperature < 30) return "#3b82f6"; // Blue
    if (temperature < 50) return "#a855f7"; // Purple
    return "#ef4444"; // Red
  };
  
  const glowColor = getGlowColor();

  return (
    <div className="w-full bg-slate-950 rounded-[2.5rem] p-8 md:p-12 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-12">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      {/* Controls Panel */}
      <div className="relative z-10 w-full md:w-1/3 flex flex-col justify-center">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">Microfluidic Mixer</h3>
          <p className="text-sm text-slate-400">Interactive simulation of nanoparticle formulation dynamics.</p>
        </div>

        <div className="space-y-6 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
          {/* Flow Rate */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">Total Flow Rate</label>
              <span className="text-sm font-mono text-[#F0564A]">{flowRate} mL/min</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={flowRate}
              onChange={(e) => setFlowRate(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#F0564A]"
            />
          </div>

          {/* Flow Ratio */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">Aqueous:Lipid Ratio</label>
              <span className="text-sm font-mono text-cyan-400">{lipidRatio}:1</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="5" 
              step="0.5"
              value={lipidRatio}
              onChange={(e) => setLipidRatio(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Temperature */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">Temperature</label>
              <span className="text-sm font-mono text-orange-400">{temperature}°C</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="80" 
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-400"
            />
          </div>

          <div className="pt-6 border-t border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Reynolds Number</span>
              <span className="text-sm font-mono text-white">{reynolds.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Mixing Time</span>
              <span className="text-sm font-mono text-white">{mixingTime} ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Est. Particle Size</span>
              <span className="text-sm font-mono text-emerald-400">{particleSize} nm</span>
            </div>
          </div>

          <button 
            onClick={() => setIsMixing(!isMixing)}
            className={`w-full py-3 mt-4 rounded-xl text-sm font-bold transition-all ${isMixing ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-[#F0564A] text-white hover:bg-[#D94D42] shadow-lg shadow-[#F0564A]/20'}`}
          >
            {isMixing ? 'Pause Simulation' : 'Resume Simulation'}
          </button>
        </div>
      </div>

      {/* Visualizer Stage */}
      <div className="relative z-10 w-full md:w-2/3 flex items-center justify-center min-h-[400px]">
        <svg viewBox="0 0 400 400" className="w-full h-full max-w-md drop-shadow-2xl">
          <defs>
            {/* Gradients */}
            <linearGradient id="inletLeft" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="inletRight" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#F0564A" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#F0564A" stopOpacity="0.8" />
            </linearGradient>
            <radialGradient id="chamberGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={glowColor} stopOpacity="0.5" />
              <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
            </radialGradient>

            {/* Animations */}
            <style>
              {`
                @keyframes flowLeft {
                  0% { stroke-dashoffset: 20; }
                  100% { stroke-dashoffset: 0; }
                }
                @keyframes flowRight {
                  0% { stroke-dashoffset: 20; }
                  100% { stroke-dashoffset: 0; }
                }
                @keyframes swirl {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
                @keyframes pulseGlow {
                  0%, 100% { opacity: 0.5; transform: scale(1); }
                  50% { opacity: 1; transform: scale(1.05); }
                }
                .flow-line-l {
                  stroke-dasharray: 10 10;
                  animation: flowLeft ${animationDuration} linear infinite;
                  animation-play-state: ${isMixing ? 'running' : 'paused'};
                }
                .flow-line-r {
                  stroke-dasharray: 10 10;
                  animation: flowRight ${animationDuration} linear infinite;
                  animation-play-state: ${isMixing ? 'running' : 'paused'};
                }
                .mixer-core {
                  transform-origin: 200px 200px;
                  animation: swirl ${animationDuration} linear infinite;
                  animation-play-state: ${isMixing ? 'running' : 'paused'};
                }
                .chamber-pulse {
                  transform-origin: 200px 200px;
                  animation: pulseGlow 2s ease-in-out infinite;
                  animation-play-state: ${isMixing ? 'running' : 'paused'};
                }
              `}
            </style>
          </defs>

          {/* Hardware Outline */}
          <g stroke="#334155" strokeWidth="2" fill="none" strokeLinejoin="round">
            {/* Left Pipe */}
            <path d="M 20 180 L 140 180 L 160 190 L 160 210 L 140 220 L 20 220 Z" fill="#0f172a" />
            {/* Right Pipe */}
            <path d="M 380 180 L 260 180 L 240 190 L 240 210 L 260 220 L 380 220 Z" fill="#0f172a" />
            {/* Bottom Pipe */}
            <path d="M 180 260 L 180 380 L 220 380 L 220 260 Z" fill="#0f172a" />
            {/* Chamber */}
            <circle cx="200" cy="200" r="60" fill="#0f172a" />
            <circle cx="200" cy="200" r="70" stroke="#1e293b" strokeWidth="4" />
          </g>

          {/* Fluid Streams */}
          <g>
            {/* Left Stream (Aqueous) */}
            <path d="M 20 190 L 140 190 L 155 195" stroke="url(#inletLeft)" strokeWidth="6" fill="none" />
            <path d="M 20 200 L 140 200 L 155 200" stroke="url(#inletLeft)" strokeWidth="6" fill="none" />
            <path d="M 20 210 L 140 210 L 155 205" stroke="url(#inletLeft)" strokeWidth="6" fill="none" />
            
            {/* Right Stream (Lipid) - Width changes based on ratio */}
            <path d="M 380 190 L 260 190 L 245 195" stroke="url(#inletRight)" strokeWidth={lipidRatio * 2 + 2} fill="none" />
            <path d="M 380 200 L 260 200 L 245 200" stroke="url(#inletRight)" strokeWidth={lipidRatio * 2 + 2} fill="none" />
            <path d="M 380 210 L 260 210 L 245 205" stroke="url(#inletRight)" strokeWidth={lipidRatio * 2 + 2} fill="none" />
          </g>

          {/* Animated Flow Lines */}
          <g strokeWidth="2" fill="none" opacity="0.8">
            <line x1="20" y1="195" x2="150" y2="195" stroke="#fff" className="flow-line-l" />
            <line x1="20" y1="205" x2="150" y2="205" stroke="#fff" className="flow-line-l" />
            
            <line x1="380" y1="195" x2="250" y2="195" stroke="#fff" className="flow-line-r" />
            <line x1="380" y1="205" x2="250" y2="205" stroke="#fff" className="flow-line-r" />
          </g>

          {/* Mixing Chamber */}
          <g>
            <circle cx="200" cy="200" r="55" fill="url(#chamberGlow)" className="chamber-pulse" />
            
            {/* Swirling Core */}
            <g className="mixer-core">
              <path d="M 200 150 Q 230 150 240 180 T 200 250 Q 170 250 160 220 T 200 150" fill="none" stroke="#a855f7" strokeWidth="4" opacity="0.6" />
              <path d="M 200 160 Q 220 160 230 180 T 200 240 Q 180 240 170 220 T 200 160" fill="none" stroke="#d8b4fe" strokeWidth="2" opacity="0.8" />
              
              {/* Particles in vortex */}
              <circle cx="200" cy="165" r="3" fill="#fff" />
              <circle cx="225" cy="200" r="2" fill="#fff" />
              <circle cx="175" cy="200" r="4" fill="#fff" />
              <circle cx="200" cy="235" r="2.5" fill="#fff" />
            </g>
          </g>

          {/* Outlet Stream (Nanoparticles) */}
          <g>
            <path d="M 190 255 L 190 380" stroke="#a855f7" strokeWidth="8" fill="none" opacity="0.6" />
            <path d="M 200 255 L 200 380" stroke="#d8b4fe" strokeWidth="8" fill="none" opacity="0.8" />
            <path d="M 210 255 L 210 380" stroke="#a855f7" strokeWidth="8" fill="none" opacity="0.6" />
            
            {/* Outlet Flow Lines */}
            <line x1="195" y1="260" x2="195" y2="380" stroke="#fff" strokeWidth="2" className="flow-line-r" style={{ animationDirection: 'normal', transformOrigin: 'center', transform: 'rotate(90deg)' }} />
            <line x1="205" y1="260" x2="205" y2="380" stroke="#fff" strokeWidth="2" className="flow-line-l" style={{ animationDirection: 'normal', transformOrigin: 'center', transform: 'rotate(90deg)' }} />
          </g>

          {/* Labels */}
          <g fill="#94a3b8" fontSize="10" fontFamily="monospace" fontWeight="bold" letterSpacing="1">
            <text x="30" y="170">AQUEOUS INLET</text>
            <text x="370" y="170" textAnchor="end">LIPID INLET</text>
            <text x="230" y="370">LNP OUTLET</text>
          </g>
        </svg>
      </div>
    </div>
  );
}
