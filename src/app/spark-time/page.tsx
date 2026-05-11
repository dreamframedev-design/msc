"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Headphones, Mic2, Users, ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

// Tiny animated audio waveform — pure SVG with staggered CSS animations
function Waveform({ className = "" }: { className?: string }) {
  const bars = 28;
  return (
    <div className={`flex items-end justify-center gap-[3px] sm:gap-1 h-12 sm:h-16 ${className}`}>
      {Array.from({ length: bars }).map((_, i) => {
        // Deterministic-feeling bar heights based on a sin pattern
        const base = 30 + Math.abs(Math.sin(i * 0.6)) * 50;
        return (
          <motion.span
            key={i}
            className="block w-[3px] sm:w-1 rounded-full"
            style={{
              background:
                i % 3 === 0
                  ? "linear-gradient(to top, #F0564A, #F08435)"
                  : i % 3 === 1
                  ? "linear-gradient(to top, #5BCBD7, #98C2D9)"
                  : "linear-gradient(to top, #F08435, #FAAC40)",
            }}
            animate={{ height: [`${base * 0.4}%`, `${base}%`, `${base * 0.6}%`, `${base}%`, `${base * 0.4}%`] }}
            transition={{
              duration: 1.4 + (i % 5) * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: (i % 7) * 0.1,
            }}
          />
        );
      })}
    </div>
  );
}

const SPOTIFY_SHOW = "https://open.spotify.com/show/2BiYBgRCWFoIPa3DHwowPC";
const EPISODES = [
  "2bzHXONO7OLIBqXJtN2NmZ",
  "146qOhZHI1bQS2KdKzaKqp",
  "6phe7I8bvtZSoNsiyOyGql",
  "3SmIsokIoNSYDNRjuuOiKC",
  "6cgkbkA4dH3OX18fGXs8Mj",
  "2MpKA8IIC0SY5ZRQSMDdxc",
  "5LchNrmzE3Wc4lHBf95HJn",
  "6XDI3D36PdpLK9Uxq1poKP",
  "2qdMxdPJBpJuuTDAyVprT5",
];

const stats = [
  { value: EPISODES.length + "+", label: "Featured Episodes", Icon: Headphones },
  { value: "2", label: "Co-hosts", Icon: Mic2 },
  { value: "∞", label: "Biotech insights", Icon: Sparkles },
  { value: "1", label: "Mission: Make science click", Icon: Users },
];

export default function SparkTime() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-white">
      {/* ============ HERO ============ */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 md:pt-48 md:pb-32 overflow-hidden border-b border-white/10">
        {/* Brand orbs */}
        <motion.div
          className="absolute top-0 right-[10%] w-[600px] h-[600px] rounded-full hidden md:block"
          style={{ background: "radial-gradient(circle, rgba(240,86,74,0.22) 0%, transparent 65%)", filter: "blur(90px)" }}
          animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-[10%] w-[500px] h-[500px] rounded-full hidden md:block"
          style={{ background: "radial-gradient(circle, rgba(91,203,215,0.18) 0%, transparent 65%)", filter: "blur(80px)" }}
          animate={{ x: [0, 25, 0], y: [0, -20, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="container relative z-10 mx-auto px-5 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-6 sm:space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs font-bold text-[#5BCBD7] uppercase tracking-[0.2em]">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-[#F0564A] opacity-75 animate-ping" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-[#F0564A]" />
                </span>
                MSC Podcast
              </div>
              <h1 className="text-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
                It&apos;s{" "}
                <span className="text-aurora whitespace-nowrap">Spark Time!</span>
              </h1>

              {/* Animated waveform */}
              <div className="py-1">
                <Waveform />
              </div>

              <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">
                Spark Time! is an intimate exploration of the importance of good communication in the biotech industry. Dani and Will dive deep into the strategy behind successful communication through engaging interviews with key players in the biotech ecosystem.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-gray-400 leading-relaxed">
                They distill decades of hard-earned knowledge into fundamental tools that others can use to maximize their impact. Dani and Will invite all in the biotech arena to join them in unraveling the secrets of captivating messaging. It&apos;s just one way Mighty Spark Makes Science Click.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  size="lg"
                  className="group bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-full px-7 sm:px-8 py-5 sm:py-6 text-base sm:text-lg glow-spark-sm glow-spark-hover"
                  onClick={() => window.open(SPOTIFY_SHOW, "_blank")}
                >
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  Listen on Spotify
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
                <Link href="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white hover:text-black px-7 sm:px-8 py-5 sm:py-6 text-base sm:text-lg"
                  >
                    Meet the hosts
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* RIGHT — podcast cover with brand glow ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotateY: 15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, type: "spring", bounce: 0.25 }}
              className="relative mx-auto w-full max-w-md lg:max-w-none"
              style={{ perspective: "1000px" }}
            >
              {/* Multi-layer glow */}
              <div className="absolute -inset-6 bg-gradient-to-tr from-[#F0564A]/30 via-[#F08435]/20 to-[#5BCBD7]/30 rounded-[2.5rem] blur-3xl" />
              <div className="absolute -inset-2 bg-gradient-to-br from-[#F0564A]/40 to-[#5BCBD7]/40 rounded-[2.5rem] blur-xl opacity-60" />

              <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-[#111111] shadow-2xl aspect-square group">
                <Image
                  src="/images/sparktime podcast cover image secondary 3kx3k (1).jpg"
                  alt="Spark Time Podcast"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                  sizes="(max-width: 1024px) 90vw, 45vw"
                />
                {/* Hover dim + play overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <button
                  onClick={() => window.open(SPOTIFY_SHOW, "_blank")}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  aria-label="Listen on Spotify"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#F0564A] flex items-center justify-center shadow-[0_0_40px_rgba(240,86,74,0.6)] group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-current ml-1" />
                  </div>
                </button>
                {/* Live indicator badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/15">
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white">New Episodes</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ STATS STRIP ============ */}
      <section className="relative py-14 sm:py-16 bg-[#070710] border-b border-white/[0.06]">
        <div
          className="absolute inset-0 opacity-[0.022] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="container relative z-10 mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 max-w-5xl mx-auto">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative p-4 sm:p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm text-center hover:bg-white/[0.04] hover:border-white/[0.15] transition-all overflow-hidden"
              >
                <div
                  className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "radial-gradient(circle, rgba(240,86,74,0.16), transparent 70%)", filter: "blur(20px)" }}
                />
                <stat.Icon className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-2 sm:mb-3 text-[#F0564A] group-hover:scale-110 transition-transform relative" />
                <div className="text-display text-2xl sm:text-4xl md:text-5xl text-white mb-1 relative">{stat.value}</div>
                <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider relative">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED EPISODES ============ */}
      <section className="relative py-20 sm:py-24 md:py-32 z-10 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/flowsaber_a_beautiful_scientific_biotech_close_up_molecular_mic_231de8ff-e324-440e-9056-b28133c799dc_edited (1).jpg"
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/90 to-[#0A0A0A]" />
          {/* Brand orbs */}
          <motion.div
            className="absolute top-1/3 right-[10%] w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(91,203,215,0.12) 0%, transparent 65%)", filter: "blur(90px)" }}
            animate={{ x: [0, -30, 0], y: [0, 25, 0] }}
            transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="container relative z-10 mx-auto px-5 sm:px-6 max-w-[1600px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          >
            <p className="text-eyebrow text-[#5BCBD7] mb-4">Tune In</p>
            <h2 className="text-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-5 sm:mb-6">
              Featured <span className="text-aurora">Episodes</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed">
              Dive into our latest conversations with biotech leaders and communication experts.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5 sm:gap-7">
            {EPISODES.slice(0, 8).map((id, index) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
                className="group relative"
              >
                {/* Brand glow on hover */}
                <div
                  className="absolute -inset-1 rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"
                  style={{
                    background: index % 2 === 0
                      ? "linear-gradient(135deg, rgba(240,86,74,0.3) 0%, transparent 50%, rgba(91,203,215,0.2) 100%)"
                      : "linear-gradient(135deg, rgba(91,203,215,0.3) 0%, transparent 50%, rgba(240,86,74,0.2) 100%)",
                  }}
                />
                <div className="relative bg-[#111111] rounded-[1.5rem] p-3 border border-white/5 shadow-2xl group-hover:border-white/20 group-hover:bg-[#161616] transition-all duration-500 overflow-hidden">
                  {/* Top accent bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out z-10"
                    style={{
                      background: index % 2 === 0
                        ? "linear-gradient(90deg, transparent, #F0564A, #F08435, transparent)"
                        : "linear-gradient(90deg, transparent, #5BCBD7, #98C2D9, transparent)",
                    }}
                  />
                  {/* Episode number chip */}
                  <div className="absolute top-4 right-4 z-10 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-white/70">
                    EP {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="relative rounded-[1.2rem] overflow-hidden bg-black transition-transform duration-700 group-hover:scale-[1.01]">
                    <iframe
                      style={{ borderRadius: "12px" }}
                      src={`https://open.spotify.com/embed/episode/${id}?utm_source=generator&theme=0`}
                      width="100%"
                      height="152"
                      frameBorder="0"
                      allowFullScreen={true}
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      title={`Spark Time episode ${index + 1}`}
                    ></iframe>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 sm:mt-20 text-center flex flex-col items-center justify-center"
          >
            <p className="text-gray-400 mb-6 sm:mb-8 text-base sm:text-lg">For our full library, head to Spotify.</p>
            <Button
              size="lg"
              className="group bg-white hover:bg-gray-100 text-black rounded-full px-8 sm:px-10 py-5 sm:py-6 text-base sm:text-lg font-bold shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] transition-all duration-300"
              onClick={() => window.open(SPOTIFY_SHOW, "_blank")}
            >
              View All Episodes on Spotify
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
