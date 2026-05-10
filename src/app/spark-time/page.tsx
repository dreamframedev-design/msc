"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

export default function SparkTime() {
  const episodes = [
    {
      title: "How to use comms beyond the big financing and clinical milestones",
      guest: "Colin Sanford",
      ep: "Ep 6"
    },
    {
      title: "When connections matter in getting snagging top media coverage",
      guest: "Colin Sanford",
      ep: "Ep 6"
    },
    {
      title: "Use this fundamental body hack when raising funds in biotech",
      guest: "David Lucchino",
      ep: "Ep 8"
    },
    {
      title: "What forms the foundation of trust between investor and leadership",
      guest: "Josh Schimmer",
      ep: "Ep 6"
    },
    {
      title: "This is the single most important quality in a corporate deck.",
      guest: "Josh Schimmer",
      ep: "Ep 6"
    },
    {
      title: "Here's the recipe for success in science communication",
      guest: "Melissa Moore",
      ep: "Ep 5"
    }
  ];

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
                It's <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F0564A] to-orange-400">Spark Time!</span>
              </h1>
              <p className="text-xl text-gray-400 leading-relaxed">
                Spark Time! is an intimate exploration of the importance of good communication in the biotech industry. Dani and Will dive deep into the strategy behind successful communication through engaging interviews with key players in the biotech ecosystem.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                They then distill decades of hard-earned knowledge and experience into fundamental tools that others can use to maximize their impact. Dani and Will invite all in the biotech arena to join them in unraveling the secrets of captivating messaging. It's just one way Mighty Spark Makes Science Click.
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

      {/* Highlights Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">Spark Time! Highlights</h2>
            <p className="text-xl text-gray-400">
              Get a taste of our latest insights with these quick podcast clips.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {episodes.map((ep, index) => (
              <a key={index} href="https://open.spotify.com/show/2BiYBgRCWFoIPa3DHwowPC" target="_blank" rel="noopener noreferrer" className="group block">
                <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 h-full hover:bg-[#151515] transition-all duration-300 hover:border-white/20 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F0564A] to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-xs font-bold text-[#F0564A] uppercase tracking-wider">{ep.ep}</span>
                    <PlayCircle className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#F0564A] transition-colors line-clamp-3">
                    {ep.title}
                  </h3>
                  
                  <p className="text-sm text-gray-500 mt-auto pt-4">
                    Guest: <span className="text-gray-300">{ep.guest}</span>
                  </p>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-400 mb-6">For more episodes, you can find us on Spotify</p>
            <Button variant="outline" size="lg" className="border-white/20 text-black hover:bg-white/10 rounded-full px-8" onClick={() => window.open('https://open.spotify.com/show/2BiYBgRCWFoIPa3DHwowPC', '_blank')}>
              View All Episodes
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
