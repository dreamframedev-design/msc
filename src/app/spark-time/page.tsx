"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

export default function SparkTime() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-white">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden border-b border-white/10">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F0564A]/20 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-300">
                <span className="w-2 h-2 rounded-full bg-[#F0564A] animate-pulse" />
                MSC Podcast
              </div>
              <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight">
                It&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F0564A] to-orange-400 whitespace-nowrap">Spark Time!</span>
              </h1>
              <p className="text-xl text-gray-400 leading-relaxed">
                Spark Time! is an intimate exploration of the importance of good communication in the biotech industry. Dani and Will dive deep into the strategy behind successful communication through engaging interviews with key players in the biotech ecosystem.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                They then distill decades of hard-earned knowledge and experience into fundamental tools that others can use to maximize their impact. Dani and Will invite all in the biotech arena to join them in unraveling the secrets of captivating messaging. It&apos;s just one way Mighty Spark Makes Science Click.
              </p>
              <div className="pt-4">
                <Button size="lg" className="bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-full px-8" onClick={() => window.open('https://open.spotify.com/show/2BiYBgRCWFoIPa3DHwowPC', '_blank')}>
                  Listen on Spotify
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#F0564A]/20 to-transparent rounded-3xl blur-2xl" />
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#111111] shadow-2xl aspect-square md:aspect-[4/3]">
                <Image 
                  src="/images/sparktime podcast cover image secondary 3kx3k (1).jpg" 
                  alt="Spark Time Podcast" 
                  fill 
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spotify Embed Section */}
      <section className="py-24 relative z-10 bg-[#0A0A0A]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-[#111111] rounded-3xl p-4 md:p-8 border border-white/10 shadow-2xl">
            <h2 className="text-3xl font-heading font-bold mb-8 text-center">All Episodes</h2>
            <iframe 
              style={{ borderRadius: '12px' }} 
              src="https://open.spotify.com/embed/show/2BiYBgRCWFoIPa3DHwowPC?utm_source=generator&theme=0" 
              width="100%" 
              height="600" 
              frameBorder="0" 
              allowFullScreen={true} 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
