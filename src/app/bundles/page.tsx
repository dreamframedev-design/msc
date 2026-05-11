"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  MonitorUp,
  Presentation,
  Handshake,
  Megaphone,
  Mic,
  Crown,
  PieChart,
  Rocket,
  Sparkles,
  PiggyBank,
  Target,
  Zap,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Bundles() {
  const bundles = [
    {
      title: "Upgrade from the 90's",
      subtitle: "Messaging + Website Refresh",
      description: "Does your website have that 'built by my brother-in-law feel'? If so, this package is for you. Razor sharp messaging combined with stunning visuals will leave no visitor unimpressed.",
      features: ["Messaging Strategy", "Website Refresh", "Visual Overhaul"],
      popular: false,
      icon: MonitorUp,
    },
    {
      title: "Ready to Impress",
      subtitle: "Messaging + Deck Refresh",
      description: "Are investors looking at your deck and going 'Meh'. Time to test drive our ready to impress package. Laser focused messaging rolled out into a memorable deck.",
      features: ["Messaging Strategy", "Corporate Deck Refresh", "Visual Overhaul"],
      popular: false,
      icon: Presentation,
    },
    {
      title: "Get Deals Done",
      subtitle: "Messaging + Website Refresh + Deck Refresh",
      description: "Ready to get deals done? Then do it right with this package. We will make sure your fresh message is rolled into both your deck and your website. MSC will help you seal the deal.",
      features: ["Messaging Strategy", "Website Refresh", "Corporate Deck Refresh"],
      popular: false,
      icon: Handshake,
    },
    {
      title: "Sell More Services",
      subtitle: "Email campaigns + Social + Advertising",
      description: "Want to speak to your target audience? Let's start with the basics and get your message amplified. Warning! Your BD team may be inundated with calls.",
      features: ["Email Campaigns", "Social Media Management", "Advertising Strategy"],
      popular: false,
      icon: Megaphone,
    },
    {
      title: "Stop Shouting into the Void",
      subtitle: "Messaging + Website Refresh + Deck Refresh + PR",
      description: "Tired of feeling like the world doesn't care? Let's fix that with our PR package. It's not just splashy headlines, we are your strategic partner in getting PR done right.",
      features: ["Messaging Strategy", "Website Refresh", "Corporate Deck Refresh", "Public Relations"],
      popular: false,
      icon: Mic,
    },
    {
      title: "The Ultimate Experience",
      subtitle: "Messaging + Website Refresh + Deck Refresh + PR + Social",
      description: "Are you the type of person who wants it all? Stay focused on what matters most and let us handle all your comms needs. Most PR agencies can't dive deep on the science like we can. Get the MSC advantage.",
      features: ["Messaging Strategy", "Website Refresh", "Corporate Deck Refresh", "Public Relations", "Social Media"],
      popular: true,
      icon: Crown,
    },
    {
      title: "Grab More Market Share",
      subtitle: "Email campaigns + Social + Advertising + Website Management + SEO",
      description: "Make sure you are front of mind when consumers shop for your services. Build your brand recognition with this ultimate bundle, and get the revenue increases you dream about. Add a website upgrade to this bundle and receive an additional discount!",
      features: ["Email Campaigns", "Social Media", "Advertising", "Website Management", "SEO Strategy"],
      popular: false,
      icon: PieChart,
    },
    {
      title: "From Stealth to Spotlight",
      subtitle: "Brand Kit + Website + SEO + Messaging + Deck + PR + Social",
      description: "Your science has been in stealth mode, but now it's time to step into the spotlight. We'll craft your brand from the ground up, build a polished presence, and ensure your debut commands attention - with the option of keeping your message going strong long after launch.",
      features: ["Brand Kit", "Website Design", "SEO Optimization", "Messaging Strategy", "Corporate Deck", "Launch PR", "Social Media Setup"],
      popular: false,
      icon: Rocket,
    },
  ];

  const valueProps = [
    { Icon: PiggyBank, title: "Better Value", desc: "Bundle pricing saves up to 25% vs. à la carte services." },
    { Icon: Target, title: "Cohesive Strategy", desc: "Every deliverable aligned to one messaging foundation." },
    { Icon: Zap, title: "Faster Launch", desc: "One team, one timeline. No agency coordination chaos." },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-white">
      {/* ============ HERO ============ */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden border-b border-white/10 z-20 bg-[#0A0A0A]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/female ceo hero.avif"
            alt=""
            fill
            className="object-cover object-top opacity-30 mix-blend-luminosity"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/50 via-[#0A0A0A]/80 to-[#0A0A0A]" />
        </div>

        {/* Brand orbs */}
        <motion.div
          className="absolute top-1/4 right-[5%] w-[600px] h-[600px] rounded-full hidden md:block"
          style={{ background: "radial-gradient(circle, rgba(240,86,74,0.22) 0%, transparent 65%)", filter: "blur(90px)" }}
          animate={{ x: [0, -30, 0], y: [0, 25, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-[5%] w-[500px] h-[500px] rounded-full hidden md:block"
          style={{ background: "radial-gradient(circle, rgba(91,203,215,0.15) 0%, transparent 65%)", filter: "blur(80px)" }}
          animate={{ x: [0, 30, 0], y: [0, -25, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="container relative z-10 mx-auto px-5 sm:px-6 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 sm:mb-8 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs font-bold text-[#5BCBD7] uppercase tracking-[0.2em]"
          >
            <Sparkles className="w-3 h-3" />
            Strategic Packages
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6 sm:mb-8"
          >
            Service <span className="text-aurora">Bundles</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-8 sm:mb-10 leading-relaxed font-light"
          >
            Who doesn&apos;t love a good deal? Choose from one of our bundles of services or create your own custom package.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/15 shadow-2xl"
          >
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full bg-[#F0564A] opacity-75 animate-ping" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-[#F0564A]" />
            </span>
            <p className="text-base sm:text-lg font-bold text-white tracking-wide">
              More Services <span className="text-white/40">=</span> <span className="text-aurora">Better Deals</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============ VALUE PROPS STRIP ============ */}
      <section className="relative py-14 sm:py-20 bg-[#070710] border-b border-white/[0.06]">
        <div
          className="absolute inset-0 opacity-[0.022] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="container relative z-10 mx-auto px-5 sm:px-6">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-eyebrow text-[#5BCBD7] mb-6 sm:mb-8 text-center"
          >
            Why bundle?
          </motion.p>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {valueProps.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative p-5 sm:p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.04] hover:border-white/[0.15] transition-all overflow-hidden"
              >
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "radial-gradient(circle, rgba(240,86,74,0.16), transparent 70%)", filter: "blur(20px)" }} />
                <v.Icon className="w-5 h-5 mb-3 text-[#F0564A] group-hover:scale-110 transition-transform relative" />
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 relative">{v.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed relative">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BUNDLES LIST ============ */}
      <section className="relative py-24 sm:py-32 z-10">
        {/* Parallax molecular background */}
        <div className="absolute inset-0 z-0">
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            <Image
              src="/images/flowsaber_a_beautiful_scientific_biotech_close_up_molecular_mic_231de8ff-e324-440e-9056-b28133c799dc_edited (1).jpg"
              alt=""
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/90 to-transparent w-full lg:w-3/4 z-10" />
            <div className="absolute inset-0 bg-black/40 z-10" />
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-5 max-w-5xl space-y-10 sm:space-y-12 relative z-20">
          {bundles.map((bundle, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className={`group relative rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 md:p-12 overflow-hidden transition-all duration-500 ${
                bundle.popular
                  ? 'bg-black/45 backdrop-blur-xl border border-[#F0564A]/50 shadow-[0_0_40px_rgba(240,86,74,0.15)] hover:shadow-[0_0_70px_rgba(240,86,74,0.3)]'
                  : 'bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/25 shadow-2xl hover:bg-black/55'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${bundle.popular ? 'from-[#F0564A]/12' : 'from-white/[0.04]'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative z-10 grid md:grid-cols-12 gap-8 md:gap-12 items-center">

                {/* Left: Content */}
                <div className="md:col-span-7 space-y-5 sm:space-y-6">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {bundle.popular && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0564A]/15 border border-[#F0564A]/30 text-[10px] sm:text-xs font-bold text-[#F0564A] uppercase tracking-[0.15em]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F0564A] animate-pulse" />
                        Most Popular
                      </div>
                    )}
                    {/* Service-count chip with dots */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] sm:text-xs font-bold text-white/80 uppercase tracking-[0.12em]">
                      <span className="flex gap-0.5">
                        {Array.from({ length: bundle.features.length }).map((_, i) => (
                          <span
                            key={i}
                            className="w-1 h-1 rounded-full"
                            style={{ background: bundle.popular ? "#F0564A" : i % 2 === 0 ? "#F0564A" : "#5BCBD7" }}
                          />
                        ))}
                      </span>
                      {bundle.features.length} services
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl shrink-0 transition-all duration-300 group-hover:scale-110 ${bundle.popular ? 'bg-[#F0564A]/20 text-[#F0564A]' : 'bg-white/10 text-white group-hover:bg-[#F0564A]/20 group-hover:text-[#F0564A]'}`}>
                      <bundle.icon className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white group-hover:text-[#F0564A] transition-colors leading-tight">
                      {bundle.title}
                    </h3>
                  </div>

                  <p className="text-base sm:text-lg md:text-xl font-medium text-gray-300">
                    {bundle.subtitle}
                  </p>

                  <p className="text-sm sm:text-base md:text-lg text-gray-400 leading-relaxed">
                    {bundle.description}
                  </p>
                </div>

                {/* Right: Features & CTA */}
                <div className="md:col-span-5 flex flex-col h-full justify-between space-y-6 sm:space-y-8 bg-black/55 backdrop-blur-2xl p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-white/10 shadow-inner">
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="text-eyebrow text-white/60 mb-4 sm:mb-6">What&apos;s Included</h4>
                    {bundle.features.map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + i * 0.06 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5 ${bundle.popular ? 'text-[#F0564A]' : 'text-[#5BCBD7]/80 group-hover:text-[#F0564A] transition-colors'}`} />
                        <span className="text-sm sm:text-base text-gray-300">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                  <Link href="/contact">
                    <Button
                      size="lg"
                      className={`w-full group/btn rounded-full text-base sm:text-lg font-bold py-5 sm:py-6 transition-all duration-300 ${
                        bundle.popular
                          ? 'bg-[#F0564A] hover:bg-[#D94D42] text-white glow-spark-sm glow-spark-hover'
                          : 'bg-white text-black hover:bg-gray-100'
                      }`}
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </div>

              </div>
            </motion.div>
          ))}

          {/* Custom Quote Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl sm:rounded-[2rem] p-[1px] overflow-hidden transition-all duration-500 hover:scale-[1.01] mt-16 sm:mt-24"
            style={{
              background: "linear-gradient(135deg, #F0564A 0%, #F08435 35%, #5BCBD7 100%)",
              boxShadow: "0 0 60px rgba(240,86,74,0.25), 0 0 60px rgba(91,203,215,0.15)",
            }}
          >
            <div className="bg-[#0A0A0A] rounded-3xl sm:rounded-[2rem] p-8 sm:p-12 md:p-16 text-center relative overflow-hidden h-full flex flex-col items-center justify-center">
              {/* Drifting brand orbs (replaces DNA wallpaper) */}
              <motion.div
                className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(240,86,74,0.15) 0%, transparent 65%)", filter: "blur(80px)" }}
                animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-0 right-1/4 w-[350px] h-[350px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(91,203,215,0.18) 0%, transparent 65%)", filter: "blur(70px)" }}
                animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative z-10 max-w-3xl mx-auto space-y-6 sm:space-y-8">
                <p className="text-eyebrow text-[#5BCBD7]">Tailored to you</p>
                <h3 className="text-display text-3xl sm:text-4xl md:text-5xl text-white">
                  Need something <span className="text-aurora">custom?</span>
                </h3>
                <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed font-light">
                  We recognize that companies within the biotech ecosystem have wildly different needs when it comes to communication. Contact us to build a package tailored specifically to your goals.
                </p>
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="group bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-full px-8 sm:px-12 py-5 sm:py-6 text-base sm:text-lg font-bold glow-spark-sm glow-spark-hover"
                  >
                    Request a Custom Quote
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
