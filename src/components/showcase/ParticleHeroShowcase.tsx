"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

export default function ParticleHeroShowcase() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      radius: number;
      baseVx: number;
      baseVy: number;
      vx: number;
      vy: number;
      alpha: number;
    }> = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        initParticles();
      }
    };

    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 10000); // Increased density slightly
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2.5 + 1.0, // Slightly larger
          baseVx: (Math.random() - 0.5) * 0.5,
          baseVy: Math.random() * -0.8 - 0.2, // Float upwards a bit faster
          vx: 0,
          vy: 0,
          alpha: Math.random() * 0.6 + 0.4, // Much brighter
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        // Mouse interaction
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          const force = (150 - dist) / 150;
          p.vx -= (dx / dist) * force * 0.4; // repel
          p.vy -= (dy / dist) * force * 0.4;
        }

        // Return to base velocity smoothly
        p.vx += (p.baseVx - p.vx) * 0.05;
        p.vy += (p.baseVy - p.vy) * 0.05;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 86, 74, ${p.alpha})`; // MSC Brand Color
        ctx.fill();
        
        // Add a subtle glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(240, 86, 74, 0.8)';
      });
      
      // Reset shadow for lines
      ctx.shadowBlur = 0;

      // Draw connecting lines
      ctx.lineWidth = 0.8;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(240, 86, 74, ${0.3 * (1 - dist / 120)})`; // Brighter lines
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -1000, y: -1000 };
  };

  return (
    <div 
      className="w-full h-[500px] rounded-[2.5rem] overflow-hidden relative group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/22.webp" 
          alt="Scientific Background" 
          fill 
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-slate-900/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent"></div>
      </div>

      {/* Canvas for Particles */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-16 max-w-3xl pointer-events-none">
        <div className="pointer-events-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#F0564A]/20 border border-[#F0564A]/30 text-[#F0564A] text-[10px] font-black uppercase tracking-widest mb-6 w-fit backdrop-blur-md">
            Immersive Hero Sections
          </span>
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            First impressions <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F0564A] to-orange-400">engineered to captivate.</span>
          </h3>
          <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-8 max-w-2xl">
            We combine high-end 3D renders with custom WebGL particle systems to create dynamic, living backgrounds that immediately establish your scientific credibility.
          </p>
          <button className="w-fit px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-sm hover:bg-[#F0564A] hover:text-white transition-colors shadow-xl">
            See Live Example
          </button>
        </div>
      </div>
    </div>
  );
}
