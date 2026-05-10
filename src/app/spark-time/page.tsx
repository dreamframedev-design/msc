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

      {/* Featured Episodes Section */}
      <section className="py-24 relative z-10 bg-[#0A0A0A]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">Featured Episodes</h2>
            <p className="text-xl text-gray-400">
              Dive into our latest conversations with biotech leaders and communication experts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {[
              "2bzHXONO7OLIBqXJtN2NmZ",
              "146qOhZHI1bQS2KdKzaKqp",
              "6phe7I8bvtZSoNsiyOyGql",
              "3SmIsokIoNSYDNRjuuOiKC",
              "6cgkbkA4dH3OX18fGXs8Mj",
              "2MpKA8IIC0SY5ZRQSMDdxc",
              "5LchNrmzE3Wc4lHBf95HJn",
              "6XDI3D36PdpLK9Uxq1poKP",
              "2qdMxdPJBpJuuTDAyVprT5"
            ].slice(0, 8).map((id, index) => (
              <div key={id} className="bg-[#111111] rounded-[1.5rem] p-3 border border-white/5 shadow-2xl hover:border-white/20 hover:bg-[#151515] transition-all duration-500 group relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F0564A] to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 rounded-[1.2rem] overflow-hidden bg-black transition-transform duration-700 group-hover:scale-[1.02]">
                  <iframe 
                    style={{ borderRadius: '12px' }} 
                    src={`https://open.spotify.com/embed/episode/${id}?utm_source=generator&theme=0`} 
                    width="100%" 
                    height="152" 
                    frameBorder="0" 
                    allowFullScreen={true} 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center flex flex-col items-center justify-center">
            <p className="text-gray-400 mb-8 text-lg">For more episodes, you can find our entire library on Spotify.</p>
            <Button size="lg" className="bg-white hover:bg-gray-200 text-black rounded-full px-10 py-6 text-lg font-bold shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] transition-all duration-300" onClick={() => window.open('https://open.spotify.com/show/2BiYBgRCWFoIPa3DHwowPC', '_blank')}>
              View All Episodes on Spotify
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
