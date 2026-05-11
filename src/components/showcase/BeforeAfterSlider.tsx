"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

/* =============================================================
   Before/After Slider
   Drag the vertical divider to reveal more of "before" or "after".
   Keyboard arrow keys ←/→ also work when the handle is focused.
   ============================================================= */
export function BeforeAfterSlider({
  before,
  after,
  beforeAlt = "Before",
  afterAlt = "After",
  initialPosition = 50,
}: {
  before: string;
  after: string;
  beforeAlt?: string;
  afterAlt?: string;
  initialPosition?: number;
}) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
    setHasInteracted(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      updatePosition(clientX);
    };
    const handleEnd = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, updatePosition]);

  const handleKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPosition((p) => Math.max(0, p - 4));
      setHasInteracted(true);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPosition((p) => Math.min(100, p + 4));
      setHasInteracted(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-gray-200 shadow-xl select-none group"
      onMouseDown={(e) => {
        setIsDragging(true);
        updatePosition(e.clientX);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        updatePosition(e.touches[0].clientX);
      }}
    >
      {/* BEFORE — sits underneath, full width, slightly desaturated */}
      <div className="absolute inset-0">
        <Image
          src={before}
          alt={beforeAlt}
          fill
          className="object-cover opacity-90 grayscale-[55%]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* AFTER — clipped to the position */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={after}
          alt={afterAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Labels — gated on slider position so they don't overlap */}
      <div
        className="absolute top-4 left-4 inline-flex items-center px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white/90 text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] z-20 transition-opacity duration-200"
        style={{ opacity: position < 92 ? 1 : 0, pointerEvents: position < 92 ? "auto" : "none" }}
      >
        Before
      </div>
      <div
        className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0564A] text-white text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] z-20 shadow-lg transition-opacity duration-200"
        style={{ opacity: position > 8 ? 1 : 0, pointerEvents: position > 8 ? "auto" : "none" }}
      >
        <Sparkles className="w-3 h-3" />
        After
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-[2px] pointer-events-none z-20"
        style={{
          left: `${position}%`,
          background: "linear-gradient(to bottom, transparent 0%, #F0564A 15%, #F0564A 85%, transparent 100%)",
          boxShadow: "0 0 16px rgba(240,86,74,0.6)",
        }}
      />

      {/* Handle */}
      <motion.button
        type="button"
        aria-label="Drag to compare before and after"
        onKeyDown={handleKey}
        animate={
          !hasInteracted && !isDragging
            ? { x: ["-50%", "-58%", "-42%", "-50%"] }
            : { x: "-50%" }
        }
        transition={
          !hasInteracted && !isDragging
            ? { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.15 }
        }
        className={`absolute top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.25),0_0_0_3px_rgba(240,86,74,0.95)] flex items-center justify-center cursor-grab ${
          isDragging ? "cursor-grabbing scale-110" : "hover:scale-105"
        } transition-transform`}
        style={{ left: `${position}%` }}
        onMouseDown={(e) => {
          e.stopPropagation();
          setIsDragging(true);
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          setIsDragging(true);
        }}
      >
        <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F0564A]" strokeWidth={3} />
        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F0564A] -ml-1" strokeWidth={3} />
      </motion.button>

      {/* Initial hint — fades out once user interacts */}
      {!hasInteracted && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-full bg-black/65 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] flex items-center gap-1.5 pointer-events-none"
        >
          <ChevronLeft className="w-3 h-3" strokeWidth={3} />
          Drag to compare
          <ChevronRight className="w-3 h-3" strokeWidth={3} />
        </motion.div>
      )}
    </div>
  );
}
