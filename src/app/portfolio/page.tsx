"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ArrowUp,
  ArrowRight,
  MousePointerClick,
  BarChart3,
  Atom,
  GitBranch,
  LayoutDashboard,
  Globe,
  Film,
  FileText,
} from "lucide-react";
import { deckTransformations } from "./data";
import ShoppingCart from "@/components/showcase/ShoppingCart";
import JurkatStimulationGraph from "@/components/showcase/JurkatStimulationGraph";
import PlasmaIL1BetaGraph from "@/components/showcase/PlasmaIL1BetaGraph";
import ClinicalDataTable from "@/components/showcase/ClinicalDataTable";
import LytixPipeline from "@/components/showcase/LytixPipeline";
import CellTaxisPipeline from "@/components/showcase/CellTaxisPipeline";
import LiveShareChart from "@/components/showcase/LiveShareChart";
import ClientPortalDashboard from "@/components/showcase/ClientPortalDashboard";
import FluidicMixerVisualizer from "@/components/showcase/FluidicMixerVisualizer";
import CFDVisualizer from "@/components/showcase/CFDVisualizer";
import VennDiagramShowcase from "@/components/showcase/VennDiagramShowcase";
import WebsitesShowcase from "@/components/showcase/WebsitesShowcase";
import VideoShowcase from "@/components/showcase/VideoShowcase";
import ParticleHeroShowcase from "@/components/showcase/ParticleHeroShowcase";
import { BeforeAfterSlider } from "@/components/showcase/BeforeAfterSlider";

// ============================================================
// REUSABLE: Chapter header
// ============================================================
function ChapterHeader({
  number,
  eyebrow,
  title,
  description,
  accent = "#F0564A",
  Icon,
}: {
  number?: string;
  eyebrow: string;
  title: string;
  description: string;
  accent?: string;
  Icon?: typeof BarChart3;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mb-8 sm:mb-12"
    >
      <div className="flex items-center gap-3 mb-4 sm:mb-5">
        {Icon && (
          <div
            className="p-2.5 rounded-xl border"
            style={{
              backgroundColor: `${accent}14`,
              borderColor: `${accent}30`,
              color: accent,
            }}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="flex items-center gap-2">
          {number && (
            <span className="font-mono font-bold text-xs tracking-[0.2em] opacity-60" style={{ color: accent }}>
              {number}
            </span>
          )}
          <span className="text-eyebrow" style={{ color: accent }}>
            {eyebrow}
          </span>
        </div>
      </div>
      <h2 className="text-display text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-4 sm:mb-5 leading-[1.1]">
        {title}
      </h2>
      <p className="text-base sm:text-lg text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}

// ============================================================
// REUSABLE: Showcase frame with optional label
// ============================================================
function ShowcaseBlock({
  label,
  caption,
  accent = "#F0564A",
  children,
  fullBleed = false,
  allowOverflow = false,
}: {
  label?: string;
  caption?: string;
  accent?: string;
  children: ReactNode;
  fullBleed?: boolean;
  allowOverflow?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="space-y-3 sm:space-y-4"
    >
      {label && (
        <div className="flex items-center gap-3 flex-wrap px-1">
          <div className="flex items-center gap-2">
            <span className="w-6 h-px" style={{ background: accent }} />
            <span className="text-eyebrow" style={{ color: accent }}>
              {label}
            </span>
          </div>
          {caption && (
            <>
              <span className="text-gray-300 text-xs">·</span>
              <span className="text-xs sm:text-sm text-gray-500 font-medium">{caption}</span>
            </>
          )}
        </div>
      )}
      {fullBleed ? (
        children
      ) : (
        <div
          className={`rounded-3xl sm:rounded-[2rem] bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${
            allowOverflow ? "" : "overflow-hidden"
          }`}
        >
          {children}
        </div>
      )}
    </motion.div>
  );
}

// ============================================================
// FLOATING BACK-TO-TOP BUTTON
// ============================================================
function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: "spring", stiffness: 380, damping: 25 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#F0564A] text-white shadow-[0_8px_30px_rgba(240,86,74,0.45)] hover:bg-[#D94D42] hover:scale-105 transition-all duration-300 flex items-center justify-center group"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-y-0.5 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// SECTION CONFIG
// ============================================================
const SECTIONS = [
  { id: "ui", label: "Interactive UI", labelLong: "Interactive UI & Code", Icon: MousePointerClick },
  { id: "websites", label: "Websites", labelLong: "Live Websites", Icon: Globe },
  { id: "videos", label: "Showreels", labelLong: "Video Showreels", Icon: Film },
  { id: "decks", label: "Decks", labelLong: "Corporate Decks", Icon: FileText },
] as const;

// ============================================================
// MAIN PAGE
// ============================================================
export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<string>("ui");

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ============ HERO ============ */}
      <section className="relative w-full min-h-[60vh] sm:min-h-[65vh] flex items-start pt-28 sm:pt-32 pb-16 overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/background.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/92 to-white/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />
        </div>
        {/* Ambient orbs */}
        <div className="absolute top-1/3 right-10 w-[360px] h-[360px] orb orb-coral hidden md:block opacity-45" />
        <div className="absolute bottom-0 right-1/3 w-[300px] h-[300px] orb orb-cyan hidden md:block opacity-40" style={{ animationDelay: "-4s" }} />
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none mix-blend-multiply animate-breath">
          <Image
            src="/images/foreground (3) copy.webp"
            alt=""
            fill
            className="object-cover object-center"
          />
        </div>

        <div className="container relative z-20 mx-auto px-5 sm:px-6 md:px-12 lg:px-24 mt-6 md:mt-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-eyebrow text-[#F0564A] mb-3"
          >
            Selected Work · 2020–2026
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-gray-900 mb-5 sm:mb-6"
          >
            <span className="text-aurora">Portfolio</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="inline-block bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg px-5 sm:px-6 py-3.5 sm:py-4 max-w-2xl mb-8"
          >
            <p className="text-base sm:text-lg md:text-xl text-gray-800 font-medium md:font-normal leading-relaxed">
              Live data visualizations, fluid simulations, full-stack portals, polished marketing sites, and the corporate decks behind them. Everything here was designed <span className="text-[#F0564A] font-semibold">and</span> engineered in-house.
            </p>
          </motion.div>

          {/* Section quick-jump preview cards (desktop only — preview of what's below) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden md:grid md:grid-cols-4 gap-3 max-w-3xl"
          >
            {SECTIONS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveTab(s.id);
                  setTimeout(() => {
                    document.getElementById("portfolio-nav")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 50);
                }}
                className="group relative flex items-start gap-3 p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 shadow-sm hover:border-[#F0564A]/40 hover:shadow-[0_8px_24px_rgba(240,86,74,0.12)] hover:bg-white transition-all text-left"
              >
                <div className="p-2 rounded-lg bg-[#F0564A]/10 text-[#F0564A] group-hover:bg-[#F0564A] group-hover:text-white transition-colors">
                  <s.Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Chapter 0{i + 1}</p>
                  <p className="text-sm font-bold text-gray-900 group-hover:text-[#F0564A] transition-colors">{s.label}</p>
                </div>
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ MAIN CONTENT ============ */}
      <section className="relative bg-white">
        <div className="container mx-auto px-4 sm:px-5 max-w-7xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

            {/* ============ STICKY CHAPTER NAV ============ */}
            <div
              id="portfolio-nav"
              className="sticky top-[88px] sm:top-[96px] z-30 -mx-4 sm:mx-0 px-4 sm:px-0 pt-3 pb-2 sm:pt-5 sm:pb-4 bg-gradient-to-b from-white via-white to-white/0"
            >
              <div className="bg-white/90 backdrop-blur-2xl rounded-2xl md:rounded-full border border-gray-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.08)] p-1.5">
                <TabsList className="!h-auto !p-0 !bg-transparent w-full flex md:grid md:grid-cols-4 gap-1 md:gap-0 overflow-x-auto md:overflow-visible snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
                  {SECTIONS.map((s, i) => (
                    <TabsTrigger
                      key={s.id}
                      value={s.id}
                      className="snap-start flex-shrink-0 md:flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl md:rounded-full px-3.5 sm:px-5 md:px-4 lg:px-7 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base font-semibold data-[state=active]:bg-[#F0564A] data-[state=active]:text-white data-[state=active]:shadow-[0_4px_14px_rgba(240,86,74,0.4)] transition-all hover:text-[#F0564A] data-[state=active]:hover:text-white text-gray-600 whitespace-nowrap"
                    >
                      <s.Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                      <span className="hidden md:inline">{s.labelLong}</span>
                      <span className="md:hidden">{s.label}</span>
                      <span className="hidden sm:inline md:hidden text-[10px] opacity-60 font-mono">0{i + 1}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>

            {/* ============ INTERACTIVE UI / CODE ============ */}
            <TabsContent value="ui" className="animate-in fade-in-50 duration-500 mt-10 sm:mt-14 md:mt-20 space-y-24 sm:space-y-28 md:space-y-36">

              {/* SECTION INTRO */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7 }}
                  className="max-w-3xl"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full bg-[#F0564A]/10 border border-[#F0564A]/20 text-xs font-bold text-[#F0564A] uppercase tracking-[0.18em]">
                    <Sparkles className="w-3 h-3" />
                    Chapter 01 · Interactive UI &amp; Code
                  </div>
                  <h2 className="text-display text-4xl sm:text-5xl md:text-6xl text-gray-900 mb-5 sm:mb-6 leading-[1.05]">
                    The work, <span className="text-aurora">working</span>.
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
                    Every chart, simulation, and dashboard below is the real thing. Live, interactive, and built by us. Hover, click, and scroll through. This is what we ship for biotech clients.
                  </p>
                </motion.div>
              </div>

              {/* ===== Chapter 1.1: DATA, BROUGHT TO LIFE ===== */}
              <div className="space-y-10 sm:space-y-12">
                <ChapterHeader
                  number="01.1"
                  eyebrow="Data, brought to life"
                  title="High-end data visualizations"
                  description="Transform complex assay data into beautiful, interactive charts. We build custom data visualizations that highlight key findings with premium styling, brand color systems, and motion that makes the numbers feel inevitable."
                  accent="#F0564A"
                  Icon={BarChart3}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-7 items-stretch">
                  <ShowcaseBlock label="01.1a" caption="T-Cell activation · dose-response" accent="#F0564A" allowOverflow>
                    <div className="min-h-[460px] sm:min-h-[500px] p-4 sm:p-6 flex items-center justify-center">
                      <div className="w-full h-full"><JurkatStimulationGraph /></div>
                    </div>
                  </ShowcaseBlock>
                  <ShowcaseBlock label="01.1b" caption="Plasma IL-1β biomarker · cohort variance" accent="#5BCBD7" allowOverflow>
                    <div className="min-h-[460px] sm:min-h-[500px] p-4 sm:p-6 flex items-center justify-center">
                      <div className="w-full h-full"><PlasmaIL1BetaGraph /></div>
                    </div>
                  </ShowcaseBlock>
                </div>

                <ShowcaseBlock label="01.1c" caption="Clinical efficacy + QoL table · animated reveal" accent="#F08435">
                  <div className="p-3 sm:p-4 md:p-8">
                    <ClinicalDataTable />
                  </div>
                </ShowcaseBlock>
              </div>

              {/* ===== Chapter 1.2: WORLDS, ENGINEERED ===== */}
              <div className="space-y-10 sm:space-y-12">
                <ChapterHeader
                  number="01.2"
                  eyebrow="Worlds, engineered"
                  title="WebGL, particles, and scientific simulation"
                  description="When the brief calls for it, we build Canvas and WebGL backdrops that capture the physical energy of your science: molecular fields, CFD particle simulations of microfluidic devices, fluidic mixers, and convergence diagrams that move in real time."
                  accent="#5BCBD7"
                  Icon={Atom}
                />

                <ShowcaseBlock label="01.2a" caption="Particle-driven hero scene" accent="#5BCBD7" fullBleed>
                  <ParticleHeroShowcase />
                </ShowcaseBlock>

                <ShowcaseBlock label="01.2b" caption="Convergence model · scroll-linked Venn diagram" accent="#F0564A" fullBleed>
                  <VennDiagramShowcase />
                </ShowcaseBlock>

                <ShowcaseBlock label="01.2c" caption="Fluidic mixer · live simulation" accent="#F08435" fullBleed>
                  <FluidicMixerVisualizer />
                </ShowcaseBlock>

                <ShowcaseBlock label="01.2d" caption="CFD particle field · drug-delivery dynamics" accent="#5BCBD7" fullBleed>
                  <CFDVisualizer />
                </ShowcaseBlock>
              </div>

              {/* ===== Chapter 1.3: PIPELINES, MADE VISIBLE ===== */}
              <div className="space-y-10 sm:space-y-12">
                <ChapterHeader
                  number="01.3"
                  eyebrow="Pipelines, made visible"
                  title="Animated clinical pipeline interfaces"
                  description="Show stakeholders exactly where each program stands. Continuous-flow liquid metaphors, phase-tracking horizontal bars, and interactive program drill-downs, designed to make complex portfolios click instantly."
                  accent="#F08435"
                  Icon={GitBranch}
                />

                <ShowcaseBlock label="01.3a" caption="Continuous-flow pipeline · CellTaxis" accent="#F08435" fullBleed>
                  <CellTaxisPipeline />
                </ShowcaseBlock>

                <ShowcaseBlock label="01.3b" caption="Structured horizontal pipeline · Lytix" accent="#F0564A">
                  <LytixPipeline />
                </ShowcaseBlock>
              </div>

              {/* ===== Chapter 1.4: APPLICATIONS THAT SHIP ===== */}
              <div className="space-y-10 sm:space-y-12">
                <ChapterHeader
                  number="01.4"
                  eyebrow="Applications that ship"
                  title="Full-stack portals, dashboards, and commerce"
                  description="We don't stop at marketing sites. Investor-relations widgets with live tickers, secure client portals for trial management, e-commerce flows tailored for cold-chain biotech logistics. Production software, designed and engineered end-to-end."
                  accent="#5BCBD7"
                  Icon={LayoutDashboard}
                />

                <ShowcaseBlock label="01.4a" caption="Live share-price widget · investor relations" accent="#5BCBD7" fullBleed>
                  <LiveShareChart />
                </ShowcaseBlock>

                <ShowcaseBlock label="01.4b" caption="Client portal · file vault, tickets, billing" accent="#F0564A" fullBleed>
                  <ClientPortalDashboard />
                </ShowcaseBlock>

                <ShowcaseBlock label="01.4c" caption="Biotech e-commerce · variant + cold-chain logic" accent="#F08435" fullBleed>
                  <div className="rounded-3xl sm:rounded-[2rem] p-3 sm:p-4 md:p-8 bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F0564A]/10 rounded-full blur-[100px] pointer-events-none" />
                    <ShoppingCart />
                  </div>
                </ShowcaseBlock>
              </div>

            </TabsContent>

            {/* ============ WEBSITES ============ */}
            <TabsContent value="websites" className="animate-in fade-in-50 duration-500 mt-10 sm:mt-14 md:mt-20">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="max-w-3xl mb-12 sm:mb-16"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full bg-[#F0564A]/10 border border-[#F0564A]/20 text-xs font-bold text-[#F0564A] uppercase tracking-[0.18em]">
                  <Globe className="w-3 h-3" />
                  Chapter 02 · Live Websites
                </div>
                <h2 className="text-display text-4xl sm:text-5xl md:text-6xl text-gray-900 mb-5 sm:mb-6 leading-[1.05]">
                  Sites that <span className="text-aurora">close rounds</span>.
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
                  Full marketing sites we&apos;ve designed, written, and engineered for biotech and life-sciences clients. Each one launched in production, hand-crafted from messaging through to motion.
                </p>
              </motion.div>

              <WebsitesShowcase />
            </TabsContent>

            {/* ============ VIDEOS ============ */}
            <TabsContent value="videos" className="animate-in fade-in-50 duration-500 mt-10 sm:mt-14 md:mt-20">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="max-w-3xl mb-12 sm:mb-16"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full bg-[#F0564A]/10 border border-[#F0564A]/20 text-xs font-bold text-[#F0564A] uppercase tracking-[0.18em]">
                  <Film className="w-3 h-3" />
                  Chapter 03 · Video Showreels
                </div>
                <h2 className="text-display text-4xl sm:text-5xl md:text-6xl text-gray-900 mb-5 sm:mb-6 leading-[1.05]">
                  Sites in <span className="text-aurora">motion</span>.
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
                  A flythrough is worth a thousand screenshots. Full-site walkthroughs of recent launches. Pause, scrub, go fullscreen.
                </p>
              </motion.div>

              <VideoShowcase />
            </TabsContent>

            {/* ============ DECKS ============ */}
            <TabsContent value="decks" className="animate-in fade-in-50 duration-500 mt-10 sm:mt-14 md:mt-20 space-y-16 sm:space-y-20 md:space-y-24">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="max-w-3xl"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full bg-[#F0564A]/10 border border-[#F0564A]/20 text-xs font-bold text-[#F0564A] uppercase tracking-[0.18em]">
                  <FileText className="w-3 h-3" />
                  Chapter 04 · Corporate Decks
                </div>
                <h2 className="text-display text-4xl sm:text-5xl md:text-6xl text-gray-900 mb-5 sm:mb-6 leading-[1.05]">
                  Before. <span className="text-aurora">After.</span>
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
                  Investor decks that walked in tired and walked out commanding the room. Same science, refined narrative, refined visuals.
                </p>
              </motion.div>

              {deckTransformations.map((project, index) => (
                <motion.article
                  key={project.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-12 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_50px_rgb(0,0,0,0.08)] transition-shadow duration-500"
                >
                  <div className="flex items-center justify-between flex-wrap gap-3 mb-6 sm:mb-8">
                    <div>
                      <p className="text-eyebrow text-[#F0564A] mb-2">Case Study · 0{index + 1}</p>
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-gray-900 tracking-tight">{project.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-[10px] sm:text-xs font-bold text-gray-600 uppercase tracking-[0.15em]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F0564A]" />
                        Deck Transformation
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#5BCBD7]/10 border border-[#5BCBD7]/25 text-[10px] sm:text-xs font-bold text-[#5BCBD7] uppercase tracking-[0.15em]">
                        Drag to compare →
                      </span>
                    </div>
                  </div>

                  <BeforeAfterSlider
                    before={project.before}
                    after={project.after}
                    beforeAlt={`${project.name} before`}
                    afterAlt={`${project.name} after`}
                  />
                </motion.article>
              ))}
            </TabsContent>

          </Tabs>
        </div>

        {/* ============ CLOSING CTA ============ */}
        <div className="relative py-24 sm:py-32 mt-12 sm:mt-20 overflow-hidden bg-gradient-to-b from-white to-gray-50/60">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#F0564A]/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#5BCBD7]/12 rounded-full blur-[120px] pointer-events-none" />
          <div className="container relative z-10 mx-auto px-5 sm:px-6 max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-eyebrow text-[#F0564A] mb-4">Want this for your science?</p>
              <h3 className="text-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-5 sm:mb-6">
                Let&apos;s engineer your<br />
                <span className="text-aurora">next launch</span>.
              </h3>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 leading-relaxed">
                Every piece of work above started with a 30-minute conversation. Yours can too.
              </p>
              <Link href="/contact">
                <Button
                  size="lg"
                  className="group bg-[#F0564A] text-white hover:bg-[#D94D42] rounded-full px-8 sm:px-10 py-6 text-base sm:text-lg glow-spark-sm glow-spark-hover"
                >
                  Start a Conversation
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Floating back-to-top */}
      <BackToTop />
    </div>
  );
}
