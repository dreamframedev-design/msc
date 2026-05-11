"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Maximize2, Volume2, VolumeX } from "lucide-react";

const videos = [
  {
    id: "medicenna",
    client: "Medicenna",
    title: "Full Site Overview",
    description: "A comprehensive walkthrough of the Medicenna digital experience, highlighting key interactions and fluid animations.",
    src: "/portfolio client videos/medicenna/fulloverview.mp4",
    poster: "/images/portfolio/medicenna/Screenshot 2026-05-10 142956.png",
    logo: "/images/portfolio/medicenna/medicenna new logo.svg",
  },
  {
    id: "lytix",
    client: "Lytix Biopharma",
    title: "Digital Experience",
    description: "Showcasing the dynamic pipeline and interactive data visualizations built for Lytix Biopharma.",
    src: "/portfolio client videos/lytix/fullsiteoverview.mp4",
    poster: "/images/portfolio/lytix/Screenshot 2026-05-10 142731.png",
    logo: "/images/portfolio/lytix/Lytix_logo-01.svg",
  },
  {
    id: "leon",
    client: "Leon",
    title: "Platform Overview",
    description: "An immersive look at the Leon platform, featuring advanced 3D simulations and fluidic dynamics.",
    src: "/portfolio client videos/leon/whole site overview.mp4",
    poster: "/images/portfolio/leon/Screenshot 2026-05-10 141605.png",
    logo: "/images/portfolio/leon/Leon Master Logo1.svg",
  },
];

export default function VideoShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeVideo = videos[activeIndex];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = activeVideo.src;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [activeVideo]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play().catch(() => {});
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* ============ FULL-WIDTH PLAYER ============ */}
      <div
        ref={containerRef}
        className="relative w-full aspect-video bg-[#0A0A14] rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-2xl group border border-slate-800/50"
      >
        {/* Brand glow */}
        <div className="absolute -inset-2 bg-gradient-to-tr from-[#F0564A]/25 via-transparent to-[#5BCBD7]/20 blur-2xl -z-10 opacity-60" />

        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          loop
          muted={isMuted}
          playsInline
          autoPlay
          poster={activeVideo.poster}
          onClick={togglePlay}
        />

        {/* Top metadata strip — always visible */}
        <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-black/70 via-black/40 to-transparent pointer-events-none">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-6 sm:h-8 flex items-center bg-white/95 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 shadow-md">
              <img
                src={activeVideo.logo}
                alt={activeVideo.client}
                className="h-full object-contain max-h-5 sm:max-h-6"
              />
            </div>
            <span className="hidden sm:inline text-[#5BCBD7] font-bold uppercase tracking-[0.18em] text-xs">
              {activeVideo.title}
            </span>
            <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-[10px] sm:text-xs font-mono font-bold text-white/90">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F0564A] animate-pulse" />
              {String(activeIndex + 1).padStart(2, "0")} / {String(videos.length).padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* Controls overlay — visible on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-6 md:p-8 pointer-events-none">
          <div className="flex items-center justify-between pointer-events-auto">
            <button
              onClick={togglePlay}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#F0564A] hover:bg-[#D94D42] flex items-center justify-center text-white transition-all shadow-[0_0_20px_rgba(240,86,74,0.5)] hover:scale-105"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-5 h-5 sm:w-6 sm:h-6" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5 fill-current" />}
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              <button
                onClick={toggleFullscreen}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-colors"
                aria-label="Fullscreen"
              >
                <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============ ACTIVE VIDEO INFO ============ */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeVideo.id + "-info"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl px-1 sm:px-2"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-[#F0564A]" />
            <span className="text-[#F0564A] font-bold uppercase tracking-[0.18em] text-xs">
              {activeVideo.title}
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-3 tracking-tight">
            {activeVideo.client}
          </h3>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
            {activeVideo.description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* ============ THUMBNAIL STRIP ============ */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 px-1 sm:px-2">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
            More Showreels
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 via-gray-100 to-transparent" />
        </div>
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {videos.map((video, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={video.id}
                onClick={() => setActiveIndex(idx)}
                className={`snap-start flex-shrink-0 w-[220px] sm:w-[280px] md:w-[320px] group relative rounded-2xl overflow-hidden border transition-all duration-500 ${
                  isActive
                    ? "border-[#F0564A] shadow-[0_8px_30px_rgba(240,86,74,0.25)]"
                    : "border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
                }`}
              >
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  <video
                    src={video.src}
                    poster={video.poster}
                    preload="none"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    muted
                    playsInline
                    loop
                    onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />
                  {/* Active overlay */}
                  {isActive && (
                    <div className="absolute inset-0 bg-[#F0564A]/15 flex items-center justify-center backdrop-blur-[1px]">
                      <div className="w-10 h-10 rounded-full bg-[#F0564A] flex items-center justify-center shadow-[0_4px_14px_rgba(240,86,74,0.5)]">
                        {isPlaying ? (
                          <div className="flex gap-1 items-center">
                            <span className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                            <span className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                            <span className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                          </div>
                        ) : (
                          <Play className="w-4 h-4 text-white ml-0.5 fill-current" />
                        )}
                      </div>
                    </div>
                  )}
                  {/* Index chip */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono font-bold text-white/90">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                </div>
                <div className="bg-white p-3 sm:p-4 text-left">
                  <p
                    className={`font-bold text-sm sm:text-base truncate transition-colors ${
                      isActive ? "text-[#F0564A]" : "text-gray-900 group-hover:text-[#F0564A]"
                    }`}
                  >
                    {video.client}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{video.title}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
