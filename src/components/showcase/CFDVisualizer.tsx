"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function CFDVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [inletVelocity, setInletVelocity] = useState(2.5);
  const [fluidViscosity, setFluidViscosity] = useState(1.0);
  const [particleDensity, setParticleDensity] = useState(800);
  const [activeTab, setActiveTab] = useState('particles'); // particles, streamlines, vectors

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    window.addEventListener('resize', resize);
    resize();

    // Particle system
    const numParticles = 2000;
    let particles: any[] = [];

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: 0,
          vy: 0,
          life: Math.random() * 100,
          maxLife: 50 + Math.random() * 100,
          color: Math.random() > 0.5 ? '#F0564A' : '#38bdf8'
        });
      }
    };

    initParticles();

    // Pseudo-random noise for turbulence
    const noise = (x: number, y: number, t: number) => {
      return Math.sin(x * 0.01 + t) * Math.cos(y * 0.01 + t) + Math.sin(y * 0.02 - t * 0.5);
    };

    const draw = () => {
      // Fade effect for trails
      ctx.fillStyle = 'rgba(2, 6, 23, 0.15)'; // slate-950 with opacity
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      time += 0.02 * (inletVelocity / 2);

      const obstacleX = canvas.width * 0.3;
      const obstacleY = canvas.height * 0.5;
      const obstacleRadius = Math.min(canvas.width, canvas.height) * 0.15;

      // Draw obstacle (CAD representation)
      ctx.beginPath();
      ctx.arc(obstacleX, obstacleY, obstacleRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(30, 41, 59, 0.8)'; // slate-800
      ctx.fill();
      ctx.strokeStyle = '#F0564A';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw CAD wireframe on obstacle
      ctx.beginPath();
      for(let i=0; i<8; i++) {
        const angle = (i/8) * Math.PI * 2 + time * 0.2;
        ctx.moveTo(obstacleX, obstacleY);
        ctx.lineTo(obstacleX + Math.cos(angle) * obstacleRadius, obstacleY + Math.sin(angle) * obstacleRadius);
      }
      ctx.strokeStyle = 'rgba(240, 86, 74, 0.3)';
      ctx.stroke();

      const activeParticles = Math.floor((particleDensity / 1000) * numParticles);

      for (let i = 0; i < activeParticles; i++) {
        const p = particles[i];
        
        // Base flow (left to right)
        let dx = inletVelocity;
        let dy = 0;

        // Obstacle avoidance (ideal flow approximation)
        const distToObstacle = Math.hypot(p.x - obstacleX, p.y - obstacleY);
        if (distToObstacle < obstacleRadius * 3) {
          const angle = Math.atan2(p.y - obstacleY, p.x - obstacleX);
          const influence = Math.pow(obstacleRadius / Math.max(distToObstacle, obstacleRadius), 2);
          
          // Deflect flow around cylinder
          dx -= inletVelocity * influence * Math.cos(2 * angle);
          dy -= inletVelocity * influence * Math.sin(2 * angle);
          
          // Add turbulence behind the obstacle (wake)
          if (p.x > obstacleX) {
            const wakeIntensity = Math.max(0, 1 - (p.x - obstacleX) / (obstacleRadius * 5));
            const turb = noise(p.x, p.y, time) * wakeIntensity * (2.0 / fluidViscosity);
            dy += turb * 5;
            dx -= Math.abs(turb) * 2;
          }
        }

        // Add general turbulence based on viscosity (lower viscosity = more turbulence)
        const generalTurbulence = noise(p.x, p.y, time * 0.5) * (0.5 / fluidViscosity);
        dy += generalTurbulence;

        // Update position
        p.x += dx;
        p.y += dy;
        p.life++;

        // Reset particles that go off screen or die
        if (p.x > canvas.width || p.y < 0 || p.y > canvas.height || p.life > p.maxLife) {
          p.x = 0;
          p.y = Math.random() * canvas.height;
          p.life = 0;
        }

        // Draw particle
        if (activeTab === 'particles' || activeTab === 'streamlines') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, activeTab === 'streamlines' ? 1 : 1.5, 0, Math.PI * 2);
          
          // Color based on velocity
          const vel = Math.hypot(dx, dy);
          const normalizedVel = Math.min(1, vel / (inletVelocity * 1.5));
          
          if (activeTab === 'streamlines') {
            ctx.fillStyle = `hsla(${200 - normalizedVel * 200}, 100%, 60%, ${1 - p.life/p.maxLife})`;
          } else {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = 1 - p.life/p.maxLife;
          }
          
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      }

      // Draw vector field
      if (activeTab === 'vectors') {
        ctx.fillStyle = 'rgba(2, 6, 23, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const step = 30;
        for (let x = step/2; x < canvas.width; x += step) {
          for (let y = step/2; y < canvas.height; y += step) {
            let dx = inletVelocity;
            let dy = 0;

            const distToObstacle = Math.hypot(x - obstacleX, y - obstacleY);
            if (distToObstacle < obstacleRadius) continue; // Inside obstacle

            if (distToObstacle < obstacleRadius * 3) {
              const angle = Math.atan2(y - obstacleY, x - obstacleX);
              const influence = Math.pow(obstacleRadius / Math.max(distToObstacle, obstacleRadius), 2);
              dx -= inletVelocity * influence * Math.cos(2 * angle);
              dy -= inletVelocity * influence * Math.sin(2 * angle);
              
              if (x > obstacleX) {
                const wakeIntensity = Math.max(0, 1 - (x - obstacleX) / (obstacleRadius * 5));
                const turb = noise(x, y, time) * wakeIntensity * (2.0 / fluidViscosity);
                dy += turb * 5;
                dx -= Math.abs(turb) * 2;
              }
            }

            const vel = Math.hypot(dx, dy);
            const normalizedVel = Math.min(1, vel / (inletVelocity * 1.5));
            const color = `hsl(${200 - normalizedVel * 200}, 100%, 60%)`;

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + dx * 3, y + dy * 3);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Arrow head
            ctx.beginPath();
            ctx.arc(x + dx * 3, y + dy * 3, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [inletVelocity, fluidViscosity, particleDensity, activeTab]);

  return (
    <div className="w-full bg-slate-950 rounded-[2.5rem] p-6 md:p-12 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col gap-8 min-h-[600px]">
      
      {/* Title Section (Always on top) */}
      <div className="relative z-10 w-full">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F0564A] mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#F0564A] animate-pulse"></span>
          Live CFD Engine
        </span>
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Computational Fluid Dynamics</h3>
        <p className="text-sm text-slate-400 font-light leading-relaxed max-w-2xl">
          Real-time Navier-Stokes approximation visualizing flow around parametric CAD geometries. Used for microfluidic device optimization and nanoparticle formulation scaling.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-12 relative z-10 w-full">
        {/* Control Panel */}
        <div className="w-full md:w-1/3 flex flex-col justify-center order-2 md:order-1">
          <div className="space-y-6 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
          
          {/* Data Sources */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
              <span className="flex items-center gap-2"><svg className="w-3 h-3 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> CAD Source</span>
              <span className="text-cyan-400">FR-JET_parametric.step</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
              <span className="flex items-center gap-2"><svg className="w-3 h-3 text-[#F0564A]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg> Velocity Field</span>
              <span className="text-[#F0564A]">flow_field_v2.vtk</span>
            </div>
          </div>

          {/* "Drag me" hint */}
          <div className="flex items-center justify-between -mt-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-white/60">Live Parameters</span>
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-400 inline-flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
              Drag me
            </span>
          </div>

          {/* Inlet Velocity */}
          <div>
            <div className="flex justify-between items-baseline mb-2.5">
              <label className="text-[11px] font-bold text-white/80 uppercase tracking-[0.18em] flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-cyan-400" />
                Inlet Velocity
              </label>
              <span className="text-base font-mono font-black tabular-nums text-cyan-400" style={{ textShadow: "0 0 14px rgba(34,211,238,0.4)" }}>
                {inletVelocity.toFixed(1)}<span className="text-[10px] opacity-70 ml-0.5">m/s</span>
              </span>
            </div>
            <div className="px-1 py-1">
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.1"
                value={inletVelocity}
                onChange={(e) => setInletVelocity(Number(e.target.value))}
                className="fancy-slider"
                aria-label="Inlet Velocity"
                style={{
                  "--slider-accent": "#22d3ee",
                  "--slider-fill": `${((inletVelocity - 0.5) / (5.0 - 0.5)) * 100}%`,
                } as React.CSSProperties}
              />
            </div>
          </div>

          {/* Fluid Viscosity */}
          <div>
            <div className="flex justify-between items-baseline mb-2.5">
              <label className="text-[11px] font-bold text-white/80 uppercase tracking-[0.18em] flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#F0564A]" />
                Fluid Viscosity
              </label>
              <span className="text-base font-mono font-black tabular-nums text-[#F0564A]" style={{ textShadow: "0 0 14px rgba(240,86,74,0.4)" }}>
                {fluidViscosity.toFixed(2)}<span className="text-[10px] opacity-70 ml-0.5">cP</span>
              </span>
            </div>
            <div className="px-1 py-1">
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={fluidViscosity}
                onChange={(e) => setFluidViscosity(Number(e.target.value))}
                className="fancy-slider"
                aria-label="Fluid Viscosity"
                style={{
                  "--slider-accent": "#F0564A",
                  "--slider-fill": `${((fluidViscosity - 0.1) / (3.0 - 0.1)) * 100}%`,
                } as React.CSSProperties}
              />
            </div>
          </div>
          
          {/* Render Mode Tabs */}
          <div className="pt-4 border-t border-slate-800">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Visualization Mode</label>
            <div className="flex gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
              {['particles', 'streamlines', 'vectors'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setActiveTab(mode)}
                  className={`flex-1 text-[10px] uppercase tracking-wider font-bold py-2 rounded-md transition-all ${
                    activeTab === mode 
                      ? 'bg-slate-800 text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visualizer Stage (Moved above on mobile) */}
      <div className="relative z-10 w-full md:w-2/3 h-[400px] md:h-full min-h-[500px] flex items-center justify-center rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/50 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] order-1 md:order-2">
        
        {/* Coordinate Grid Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full"
        />
        
        {/* Overlay Metrics */}
        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-3 rounded-lg pointer-events-none">
          <div className="flex flex-col gap-1 text-[9px] font-mono uppercase tracking-wider">
            <div className="flex justify-between gap-4 text-slate-400"><span>Reynolds No.</span> <span className="text-cyan-400">{Math.round((inletVelocity * 1000) / fluidViscosity)}</span></div>
            <div className="flex justify-between gap-4 text-slate-400"><span>Pressure Drop</span> <span className="text-[#F0564A]">{(inletVelocity * 1.5 * fluidViscosity).toFixed(2)} kPa</span></div>
            <div className="flex justify-between gap-4 text-slate-400"><span>Active Nodes</span> <span className="text-white">{Math.floor((particleDensity / 1000) * 2000)}</span></div>
          </div>
        </div>
      </div>
      
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F0564A]/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      </div>
    </div>
  );
}
