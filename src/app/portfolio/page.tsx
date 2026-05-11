"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { websites, deckTransformations } from "./data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function Portfolio() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full min-h-[45vh] md:min-h-[55vh] flex items-start pt-28 sm:pt-32 pb-12 justify-start overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/background.jpg"
            alt="Portfolio Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/92 to-transparent" />
        </div>
        {/* Ambient orbs */}
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] orb orb-coral hidden md:block opacity-40" />
        <div className="absolute bottom-0 right-1/3 w-[260px] h-[260px] orb orb-cyan hidden md:block opacity-35" style={{ animationDelay: "-4s" }} />
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none mix-blend-multiply animate-breath">
          <Image
            src="/images/foreground (3) copy.webp"
            alt=""
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="container relative z-20 mx-auto px-5 sm:px-6 md:px-12 lg:px-24 mt-8 md:mt-20 text-left">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-eyebrow text-[#F0564A] mb-3"
          >
            Selected Work
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-gray-900 mb-6"
          >
            Portfolio
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="inline-block bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg px-5 sm:px-6 py-3.5 sm:py-4 max-w-2xl"
          >
            <p className="text-base sm:text-lg md:text-xl text-gray-800 font-medium md:font-normal">
              A showcase of our high-end biotech web development, presentation design, and interactive UI engineering.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content with Tabs */}
      <section className="py-12 sm:py-16 md:py-24 relative z-20 bg-white min-h-screen">
        <div className="container mx-auto px-4 sm:px-5 max-w-7xl">
          <Tabs defaultValue="ui" className="w-full overflow-hidden">
            <div className="flex justify-center mb-10 sm:mb-12 md:mb-16 sticky top-20 z-30 -mx-4 sm:mx-0 px-4 sm:px-0">
              <TabsList className="bg-white/80 backdrop-blur-xl p-1.5 rounded-2xl md:rounded-full border border-gray-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] grid grid-cols-2 md:inline-flex !h-auto gap-1 md:gap-0 w-full sm:w-auto max-w-full">
                <TabsTrigger value="ui" className="rounded-xl md:rounded-full px-3 md:px-7 py-2.5 md:py-3 text-xs md:text-base font-semibold data-[state=active]:bg-[#F0564A] data-[state=active]:text-white data-[state=active]:shadow-[0_4px_14px_rgba(240,86,74,0.35)] transition-all hover:text-[#F0564A] text-gray-600 whitespace-normal md:whitespace-nowrap text-center h-full w-full">
                  <span className="md:hidden">UI / Code</span>
                  <span className="hidden md:inline">Interactive UI &amp; Components</span>
                </TabsTrigger>
                <TabsTrigger value="websites" className="rounded-xl md:rounded-full px-3 md:px-7 py-2.5 md:py-3 text-xs md:text-base font-semibold data-[state=active]:bg-[#F0564A] data-[state=active]:text-white data-[state=active]:shadow-[0_4px_14px_rgba(240,86,74,0.35)] transition-all hover:text-[#F0564A] text-gray-600 whitespace-normal md:whitespace-nowrap text-center h-full w-full">
                  Websites
                </TabsTrigger>
                <TabsTrigger value="videos" className="rounded-xl md:rounded-full px-3 md:px-7 py-2.5 md:py-3 text-xs md:text-base font-semibold data-[state=active]:bg-[#F0564A] data-[state=active]:text-white data-[state=active]:shadow-[0_4px_14px_rgba(240,86,74,0.35)] transition-all hover:text-[#F0564A] text-gray-600 whitespace-normal md:whitespace-nowrap text-center h-full w-full">
                  Showreels
                </TabsTrigger>
                <TabsTrigger value="decks" className="rounded-xl md:rounded-full px-3 md:px-7 py-2.5 md:py-3 text-xs md:text-base font-semibold data-[state=active]:bg-[#F0564A] data-[state=active]:text-white data-[state=active]:shadow-[0_4px_14px_rgba(240,86,74,0.35)] transition-all hover:text-[#F0564A] text-gray-600 whitespace-normal md:whitespace-nowrap text-center h-full w-full">
                  <span className="md:hidden">Decks</span>
                  <span className="hidden md:inline">Corporate Decks</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Interactive UI Tab */}
            <TabsContent value="ui" className="space-y-16 sm:space-y-20 md:space-y-24 animate-in fade-in-50 duration-500">
              


              <div className="space-y-8">
                <div className="max-w-3xl">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">High-End Data Visualizations</h2>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    Transform complex assay data into beautiful, interactive charts. We build custom data visualizations that highlight key findings with premium styling and animations.
                  </p>
                  <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F0564A]/10 text-[#F0564A] text-sm font-semibold border border-[#F0564A]/20">
                    <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    Hover over the charts, nodes, and pipes below to interact
                  </div>
                </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="rounded-3xl sm:rounded-[2.5rem] bg-white border border-gray-100 shadow-sm flex items-center justify-center min-h-[300px] sm:min-h-[350px] overflow-hidden">
              <div className="w-full h-full">
                <JurkatStimulationGraph />
              </div>
            </div>
            <div className="rounded-3xl sm:rounded-[2.5rem] bg-white border border-gray-100 shadow-sm flex items-center justify-center min-h-[300px] sm:min-h-[350px] overflow-hidden">
              <div className="w-full h-full">
                <PlasmaIL1BetaGraph />
              </div>
            </div>
          </div>
              </div>

              <div className="space-y-8">
                <div className="max-w-3xl">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">Animated Clinical Data Tables</h2>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    We turn dry clinical trial data into engaging, animated tables that draw the user's eye to key efficacy metrics and quality of life improvements.
                  </p>
                </div>
                <div className="rounded-3xl sm:rounded-[2.5rem] p-3 sm:p-4 md:p-8 bg-white border border-gray-100 shadow-sm overflow-hidden">
                  <ClinicalDataTable />
                </div>
              </div>

              <div className="space-y-8">
                <div className="max-w-3xl">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">Immersive Hero Experiences</h2>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    We combine high-end imagery with custom WebGL particle systems to create dynamic, living backgrounds that immediately establish your scientific credibility.
                  </p>
                </div>
                <div className="w-full">
                  <ParticleHeroShowcase />
                </div>
              </div>

              <div className="space-y-8">
                <div className="w-full">
                  <VennDiagramShowcase />
                </div>
              </div>

                <div className="space-y-8">
                  <div className="w-full">
                    <FluidicMixerVisualizer />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="w-full">
                    <CFDVisualizer />
                  </div>
                </div>

              <div className="space-y-8">
                <div className="max-w-3xl">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">Continuous Flow Pipeline Visualizations</h2>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    A premium, continuous-flow pipeline design. The "liquid" animates in to represent clinical progress, complete with glass-tube highlights and shimmer effects.
                  </p>
                </div>
                <CellTaxisPipeline />
              </div>

              <div className="space-y-8">
                <div className="max-w-3xl">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">Interactive Pipeline Interfaces</h2>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    A more structured, horizontal pipeline design typical of top-tier biotech companies. Hover over rows to see detailed popouts.
                  </p>
                </div>
                <div className="rounded-[2.5rem] bg-white border border-gray-100 overflow-hidden shadow-sm">
                  <LytixPipeline />
                </div>
              </div>

              <div className="space-y-8">
                <div className="max-w-3xl">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">Investor Relations Widgets</h2>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    We build premium, real-time data widgets for your investor relations pages. Keep your stakeholders informed with beautiful, responsive charts and live ticker data.
                  </p>
                </div>
                <div className="w-full">
                  <LiveShareChart />
                </div>
              </div>

              <div className="space-y-8">
                <div className="max-w-3xl">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">Custom Client Portals & Dashboards</h2>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    We design and develop secure, robust portals for clinical trial management, patient tracking, and internal data administration.
                  </p>
                </div>
                <div className="w-full">
                  <ClientPortalDashboard />
                </div>
              </div>

              <div className="space-y-8">
                <div className="max-w-3xl">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">High-Performance E-Commerce</h2>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    We design and build custom, conversion-optimized checkout experiences tailored for biotech and life sciences products, complete with cold-chain shipping logic and complex variant handling.
                  </p>
                </div>
                <div className="w-full">
                  <div className="rounded-[2.5rem] p-4 md:p-8 bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F0564A]/10 rounded-full blur-[100px] pointer-events-none"></div>
                    <ShoppingCart />
                  </div>
                </div>
              </div>

            </TabsContent>

              {/* Websites Tab */}
                <TabsContent value="websites" className="animate-in fade-in-50 duration-500">
                  <WebsitesShowcase />
                </TabsContent>

                {/* Videos Tab */}
                <TabsContent value="videos" className="animate-in fade-in-50 duration-500">
                  <VideoShowcase />
                </TabsContent>
  
                {/* Corporate Decks Tab */}
            <TabsContent value="decks" className="space-y-16 sm:space-y-20 md:space-y-24 animate-in fade-in-50 duration-500">
              {deckTransformations.map((project, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  key={index}
                  className="bg-white rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-12 border border-gray-100 shadow-sm"
                >
                  <div className="mb-8 sm:mb-10">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{project.name}</h3>
                    <p className="text-[#F0564A] font-medium mt-2">Before &amp; After Transformation</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Before */}
                    <div className="space-y-4">
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-bold uppercase tracking-wider">
                        Before
                      </div>
                      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-gray-200 shadow-sm opacity-80 grayscale-[50%]">
                        <Image 
                          src={project.before} 
                          alt={`${project.name} Before`} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* After */}
                    <div className="space-y-4">
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#F0564A]/10 text-[#F0564A] text-sm font-bold uppercase tracking-wider">
                        After
                      </div>
                      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-gray-200 shadow-xl group">
                        <Image 
                          src={project.after} 
                          alt={`${project.name} After`} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </TabsContent>

          </Tabs>
        </div>
        
        {/* Back to top button (Mobile only) */}
        <div className="md:hidden flex justify-center mt-12 mb-8">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
            Back to Top
          </button>
        </div>
      </section>
    </div>
  );
}
