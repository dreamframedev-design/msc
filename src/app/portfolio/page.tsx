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
      <section className="relative w-full h-[40vh] md:h-[50vh] flex items-start pt-32 justify-start overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/background.jpg" 
            alt="Portfolio Background" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
        </div>
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none mix-blend-multiply animate-breath">
          <Image 
            src="/images/foreground (3) copy.webp" 
            alt="Foreground elements" 
            fill 
            className="object-cover object-center"
          />
        </div>
        <div className="container relative z-20 mx-auto px-4 md:px-12 lg:px-24 mt-12 md:mt-24 text-left">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-heading font-bold tracking-tight text-gray-900"
          >
            Portfolio
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 mt-4 max-w-2xl"
          >
            A showcase of our high-end biotech web development, presentation design, and interactive UI engineering.
          </motion.p>
        </div>
      </section>

      {/* Main Content with Tabs */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <Tabs defaultValue="ui" className="w-full">
            <div className="flex justify-center mb-16">
              <TabsList className="bg-gray-100/50 p-1 rounded-full border border-gray-200">
                <TabsTrigger value="ui" className="rounded-full px-6 py-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-[#F0564A] data-[state=active]:shadow-sm transition-all">
                  Interactive UI & Components
                </TabsTrigger>
                <TabsTrigger value="websites" className="rounded-full px-6 py-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-[#F0564A] data-[state=active]:shadow-sm transition-all">
                  Websites
                </TabsTrigger>
                <TabsTrigger value="videos" className="rounded-full px-6 py-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-[#F0564A] data-[state=active]:shadow-sm transition-all">
                  Showreels
                </TabsTrigger>
                <TabsTrigger value="decks" className="rounded-full px-6 py-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-[#F0564A] data-[state=active]:shadow-sm transition-all">
                  Corporate Decks
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Interactive UI Tab */}
            <TabsContent value="ui" className="space-y-24 animate-in fade-in-50 duration-500">
              


              <div className="space-y-8">
                <div className="max-w-3xl">
                  <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">High-End Data Visualizations</h2>
                  <p className="text-gray-600 text-lg">
                    Transform complex assay data into beautiful, interactive charts. We build custom data visualizations that highlight key findings with premium styling and animations.
                  </p>
                </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="rounded-[2.5rem] bg-white border border-gray-100 shadow-sm flex items-center justify-center min-h-[400px]">
                      <div className="w-full h-full">
                        <JurkatStimulationGraph />
                      </div>
                    </div>
                    <div className="rounded-[2.5rem] bg-white border border-gray-100 shadow-sm flex items-center justify-center min-h-[400px]">
                      <div className="w-full h-full">
                        <PlasmaIL1BetaGraph />
                      </div>
                    </div>
                  </div>
              </div>

              <div className="space-y-8">
                <div className="max-w-3xl">
                  <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Animated Clinical Data Tables</h2>
                  <p className="text-gray-600 text-lg">
                    We turn dry clinical trial data into engaging, animated tables that draw the user's eye to key efficacy metrics and quality of life improvements.
                  </p>
                </div>
                <div className="rounded-[2.5rem] p-4 md:p-8 bg-white border border-gray-100 shadow-sm">
                  <ClinicalDataTable />
                </div>
              </div>

              <div className="space-y-8">
                <div className="max-w-3xl">
                  <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Immersive Hero Experiences</h2>
                  <p className="text-gray-600 text-lg">
                    We combine high-end imagery with custom WebGL particle systems to create dynamic, living backgrounds that immediately establish your scientific credibility.
                  </p>
                </div>
                <div className="w-full">
                  <ParticleHeroShowcase />
                </div>
              </div>

              <div className="space-y-8">
                <div className="max-w-3xl">
                  <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Strategic Platform Diagrams</h2>
                  <p className="text-gray-600 text-lg">
                    We build interactive diagrams that clearly communicate your proprietary platforms, mechanisms of action, and strategic advantages to investors and partners.
                  </p>
                </div>
                <div className="w-full">
                  <VennDiagramShowcase />
                </div>
              </div>

                <div className="space-y-8">
                  <div className="max-w-3xl">
                    <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Fluidic Dynamics & Mechanism Visualizers</h2>
                    <p className="text-gray-600 text-lg">
                      We build bespoke interactive simulations to demonstrate complex scientific mechanisms, such as microfluidic mixing, nanoparticle formulation, and cellular interactions.
                    </p>
                  </div>
                  <div className="w-full">
                    <FluidicMixerVisualizer />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="max-w-3xl">
                    <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Advanced Computational Fluid Dynamics</h2>
                    <p className="text-gray-600 text-lg">
                      High-performance WebGL-style particle rendering using optimized Canvas 2D math. Perfect for hero sections and technical visualizers.
                    </p>
                  </div>
                  <div className="w-full">
                    <CFDVisualizer />
                  </div>
                </div>

              <div className="space-y-8">
                <div className="max-w-3xl">
                  <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Continuous Flow Pipeline Visualizations</h2>
                  <p className="text-gray-600 text-lg">
                    A premium, continuous-flow pipeline design. The "liquid" animates in to represent clinical progress, complete with glass-tube highlights and shimmer effects.
                  </p>
                </div>
                <CellTaxisPipeline />
              </div>

              <div className="space-y-8">
                <div className="max-w-3xl">
                  <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Interactive Pipeline Interfaces</h2>
                  <p className="text-gray-600 text-lg">
                    A more structured, horizontal pipeline design typical of top-tier biotech companies. Hover over rows to see detailed popouts.
                  </p>
                </div>
                <div className="rounded-[2.5rem] bg-white border border-gray-100 overflow-hidden shadow-sm">
                  <LytixPipeline />
                </div>
              </div>

              <div className="space-y-8">
                <div className="max-w-3xl">
                  <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Investor Relations Widgets</h2>
                  <p className="text-gray-600 text-lg">
                    We build premium, real-time data widgets for your investor relations pages. Keep your stakeholders informed with beautiful, responsive charts and live ticker data.
                  </p>
                </div>
                <div className="w-full">
                  <LiveShareChart />
                </div>
              </div>

              <div className="space-y-8">
                <div className="max-w-3xl">
                  <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Custom Client Portals & Dashboards</h2>
                  <p className="text-gray-600 text-lg">
                    We design and develop secure, robust portals for clinical trial management, patient tracking, and internal data administration.
                  </p>
                </div>
                <div className="w-full">
                  <ClientPortalDashboard />
                </div>
              </div>

              <div className="space-y-8">
                <div className="max-w-3xl">
                  <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">High-Performance E-Commerce</h2>
                  <p className="text-gray-600 text-lg">
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
            <TabsContent value="decks" className="space-y-24 animate-in fade-in-50 duration-500">
              {deckTransformations.map((project, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  key={index} 
                  className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm"
                >
                  <div className="mb-10">
                    <h3 className="text-3xl font-bold text-gray-900">{project.name}</h3>
                    <p className="text-[#F0564A] font-medium mt-2">Before & After Transformation</p>
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
      </section>
    </div>
  );
}
