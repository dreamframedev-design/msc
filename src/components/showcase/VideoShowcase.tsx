"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Maximize2, Volume2, VolumeX } from 'lucide-react';
import Image from 'next/image';

const videos = [
  {
    id: 'medicenna',
    client: 'Medicenna',
    title: 'Full Site Overview',
    description: 'A comprehensive walkthrough of the Medicenna digital experience, highlighting key interactions and fluid animations.',
    src: '/portfolio client videos/medicenna/fulloverview.mp4',
    poster: '/images/portfolio/medicenna/Screenshot 2026-05-10 142956.png',
    logo: '/images/portfolio/medicenna/medicenna new logo.svg'
  },
  {
    id: 'lytix',
    client: 'Lytix Biopharma',
    title: 'Digital Experience',
    description: 'Showcasing the dynamic pipeline and interactive data visualizations built for Lytix Biopharma.',
    src: '/portfolio client videos/lytix/fullsiteoverview.mp4',
    poster: '/images/portfolio/lytix/Screenshot 2026-05-10 142731.png',
    logo: '/images/portfolio/lytix/Lytix_logo-01.svg'
  },
  {
    id: 'leon',
    client: 'Leon',
    title: 'Platform Overview',
    description: 'An immersive look at the Leon platform, featuring advanced 3D simulations and fluidic dynamics.',
    src: '/portfolio client videos/leon/whole site overview.mp4',
    poster: '/images/portfolio/leon/Screenshot 2026-05-10 141605.png',
    logo: '/images/portfolio/leon/Leon Master Logo1.svg'
  },
  {
    id: 'leon-fluidic',
    client: 'Leon',
    title: 'Fluidic Dynamics Simulation',
    description: 'Deep dive into the custom-engineered fluidic dynamics simulation created for Leon.',
    src: '/portfolio client videos/leon/fluidic dynamics.mp4',
    poster: '/images/portfolio/leon/Screenshot 2026-05-10 141749.png',
    logo: '/images/portfolio/leon/Leon Master Logo1.svg'
  },
  {
    id: 'pbl',
    client: 'PBL Assay Science',
    title: 'Site Walkthrough',
    description: 'Exploring the comprehensive product catalog and scientific resources of PBL Assay Science.',
    src: '/portfolio client videos/pbl/pblfullsiteoverview.mp4',
    poster: '/images/portfolio/pbl/Screenshot 2026-05-10 142358.png',
    logo: '/images/portfolio/pbl/pbl icon_pbl logo.svg'
  }
];

export default function VideoShowcase() {
  const [activeVideo, setActiveVideo] = useState(videos[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = activeVideo.src;
      videoRef.current.play().catch(e => console.log("Autoplay prevented", e));
      setIsPlaying(true);
    }
  }, [activeVideo]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="w-full mx-auto flex flex-col lg:flex-row gap-8 min-h-[700px] bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm">
      {/* Main Video Player */}
      <div className="flex-1 flex flex-col">
        <div className="mb-8">
          <h3 className="text-3xl font-bold text-gray-900">Client Showreels</h3>
          <p className="text-[#F0564A] font-medium mt-2">Immersive Digital Experiences</p>
        </div>

        <div 
          ref={containerRef}
          className="relative w-full aspect-video bg-slate-900 rounded-[2rem] overflow-hidden shadow-xl group border border-slate-800/50"
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            loop
            muted={isMuted}
            playsInline
            poster={activeVideo.poster}
            onClick={togglePlay}
          />
          
          {/* Video Controls Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 md:p-8 pointer-events-none">
            <div className="flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-4">
                <button 
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                </button>
                <button 
                  onClick={toggleMute}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>
              
              <button 
                onClick={toggleFullscreen}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Video Info */}
        <div className="mt-8 px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-8 w-auto relative flex items-center">
               <img src={activeVideo.logo} alt={activeVideo.client} className="h-full object-contain" />
            </div>
            <div className="h-4 w-[1px] bg-slate-200"></div>
            <span className="text-[#F0564A] font-medium tracking-wide uppercase text-sm">{activeVideo.title}</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{activeVideo.client}</h3>
          <p className="text-slate-600 text-lg leading-relaxed max-w-3xl">
            {activeVideo.description}
          </p>
        </div>
      </div>

      {/* Playlist Sidebar */}
      <div className="w-full lg:w-96 flex flex-col gap-4 lg:pt-[104px]">
        <div className="flex flex-col gap-3 overflow-y-auto pr-2 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {videos.map((video) => (
            <button
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className={`relative flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 text-left group ${
                activeVideo.id === video.id 
                  ? 'bg-white shadow-md border border-slate-100' 
                  : 'hover:bg-slate-50 border border-transparent'
              }`}
            >
              {/* Thumbnail */}
              <div className="relative w-32 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                <video 
                  src={video.src} 
                  poster={video.poster}
                  preload="none"
                  className="w-full h-full object-cover"
                  muted 
                  playsInline
                  onMouseEnter={(e) => e.currentTarget.play().catch(()=>{})}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
                {activeVideo.id === video.id && (
                  <div className="absolute inset-0 bg-[#F0564A]/20 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="w-8 h-8 rounded-full bg-[#F0564A] flex items-center justify-center shadow-lg">
                      {isPlaying ? (
                        <div className="flex gap-1">
                          <div className="w-1 h-3 bg-white animate-pulse" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-1 h-3 bg-white animate-pulse" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-1 h-3 bg-white animate-pulse" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      ) : (
                        <Play className="w-4 h-4 text-white ml-0.5" />
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h5 className={`font-bold truncate ${activeVideo.id === video.id ? 'text-[#F0564A]' : 'text-slate-900 group-hover:text-[#F0564A] transition-colors'}`}>
                  {video.client}
                </h5>
                <p className="text-sm text-slate-500 truncate mt-1">{video.title}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
