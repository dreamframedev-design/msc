"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TestimonialsSlider } from "@/components/ui/testimonials/TestimonialsSlider";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yHeroBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yHeroText = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacityHeroText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen">
      {/* ============ HERO ============ */}
      <section className="relative w-full min-h-[100svh] flex items-start pt-28 sm:pt-32 md:pt-40 overflow-hidden bg-white">
        {/* Background Layer */}
        <motion.div style={{ y: yHeroBg }} className="absolute inset-0 z-0">
          <Image
            src="/images/background.jpg"
            alt="Scientific background"
            fill
            className="object-cover object-right"
            priority
          />
        </motion.div>

        {/* Ambient orbs */}
        <div className="absolute top-1/4 -left-20 w-[420px] h-[420px] orb orb-coral hidden md:block" />
        <div className="absolute bottom-10 right-10 w-[320px] h-[320px] orb orb-cyan hidden md:block" style={{ animationDelay: "-3s" }} />

        {/* Foreground Floating Elements Layer */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none mix-blend-multiply animate-breath">
          <Image
            src="/images/foreground (3) copy.webp"
            alt=""
            fill
            className="object-cover object-center"
          />
        </div>

        {/* Content */}
        <motion.div
          style={{ y: yHeroText, opacity: opacityHeroText }}
          className="container relative z-20 mx-auto px-5 sm:px-6 mt-8 md:mt-24"
        >
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-white/70 backdrop-blur-md border border-[#F0564A]/20 text-xs sm:text-sm font-semibold text-[#F0564A] shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Biotech communications, refined.
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-display text-[2.75rem] sm:text-6xl md:text-7xl lg:text-8xl mb-4 text-[#F0564A]"
            >
              Mighty Spark<br className="hidden sm:block" /> Communications
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-2xl sm:text-3xl md:text-4xl text-gray-700 font-light mb-10 tracking-tight"
            >
              Making Science Click
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="flex flex-wrap gap-3"
            >
              <Link href="/contact">
                <Button size="lg" className="group text-base sm:text-lg px-7 sm:px-8 py-6 rounded-full bg-[#F0564A] hover:bg-[#D94D42] text-white glow-spark-sm glow-spark-hover">
                  Book A Free Consultation
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button size="lg" variant="outline" className="text-base sm:text-lg px-7 sm:px-8 py-6 rounded-full border-gray-300 bg-white/60 backdrop-blur-md text-gray-800 hover:bg-white hover:border-gray-400 transition-all">
                  View Our Work
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity: opacityHeroText }}
          className="absolute bottom-8 sm:bottom-10 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center hover:opacity-100 transition-opacity cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <div className="w-[28px] h-[44px] sm:w-[32px] sm:h-[50px] rounded-full border-2 border-gray-900/80 flex justify-center p-2 bg-white/40 backdrop-blur-sm">
            <div className="w-1.5 h-2.5 bg-[#F0564A] rounded-full animate-bounce" />
          </div>
        </motion.div>
      </section>

      {/* ============ VISION ============ */}
      <section className="py-20 sm:py-24 md:py-32 bg-white overflow-hidden relative">
        <div className="container mx-auto px-5 sm:px-6 space-y-24 md:space-y-32">
          {/* Top Part */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="grid md:grid-cols-2 gap-10 md:gap-16 items-center"
          >
            <div className="space-y-6">
              <p className="text-eyebrow text-[#F0564A]">Vision</p>
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                At Mighty Spark Communications, we amplify the voices of pre-clinical and clinical biotech companies, showcasing your potential to advance therapeutic solutions and spark real connections with investors and partners.
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="relative h-[320px] sm:h-[400px] md:h-[500px] w-full rounded-tl-[60px] rounded-br-[60px] sm:rounded-tl-[100px] sm:rounded-br-[100px] overflow-hidden shadow-2xl"
            >
              <Image
                src="/images/dani and will hero final web_edited.jpg"
                alt="Dani and Will of Mighty Spark Communications in a professional meeting"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#F0564A]/10 to-transparent pointer-events-none" />
            </motion.div>
          </motion.div>

          {/* Middle decorative video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="flex justify-center md:justify-start -my-12 md:-my-16 relative z-10"
          >
            <div className="relative">
              {/* Cyan halo */}
              <div className="absolute inset-0 rounded-full bg-[#5BCBD7]/40 blur-3xl scale-110" />
              <div className="relative w-52 h-52 sm:w-64 sm:h-64 md:w-96 md:h-96 rounded-full overflow-hidden shadow-2xl border-[6px] sm:border-8 border-white">
                <video autoPlay loop muted playsInline className="object-cover w-full h-full">
                  <source src="/images/hero-video-1.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </motion.div>

          {/* Bottom Part */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="grid md:grid-cols-2 gap-10 md:gap-16 items-center"
          >
            <div className="space-y-6 md:order-2">
              <h3 className="text-display text-3xl sm:text-4xl md:text-5xl text-gray-900">
                Your science deserves to be heard.<br className="hidden md:block"/>{" "}
                <span className="text-aurora">We make sure it clicks.</span>
              </h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                We&apos;re not just storytellers - we&apos;re catalysts for your success. We transform complex science into compelling corporate messaging that leaves investors wanting more. Whether it&apos;s a corporate deck that commands attention, a custom website that draws viewers into your scientific story, or scientific illustrations that make your message crystal clear, we deliver clarity, precision, and impact. And we don&apos;t stop there - we make sure your message resonates across social and media channels with consistent, powerful communication.
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="relative h-[320px] sm:h-[400px] md:h-[500px] w-full rounded-tr-[60px] rounded-bl-[60px] sm:rounded-tr-[100px] sm:rounded-bl-[100px] overflow-hidden shadow-2xl md:order-1"
            >
              <video autoPlay loop muted playsInline className="object-cover w-full h-full">
                <source src="/images/hero-video-2.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-[#5BCBD7]/15 to-transparent pointer-events-none" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 1, -1, 0],
              x: ["0%", "-1%", "1%", "0%"],
              y: ["0%", "1%", "-1%", "0%"]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 w-[105%] h-[105%] -left-[2.5%] -top-[2.5%]"
          >
            <Image
              src="/images/flowsaber_a_beautiful_scientific_biotech_close_up_molecular_mic_231de8ff-e324-440e-9056-b28133c799dc_edited (1).jpg"
              alt=""
              fill
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-black/40 md:to-transparent" />
          {/* Cyan accent orb in distance */}
          <div className="absolute right-10 top-1/3 w-[400px] h-[400px] orb orb-cyan opacity-30 hidden lg:block" />
        </div>

        <div className="container mx-auto px-5 sm:px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-left space-y-6 text-white mb-12"
            >
              <p className="text-eyebrow text-[#5BCBD7]">What We Do</p>
              <h2 className="text-display text-4xl sm:text-5xl md:text-6xl">Services that <span className="text-aurora">spark connection</span>.</h2>
              <p className="text-lg sm:text-xl text-gray-200 leading-relaxed max-w-2xl">
                Want to catch the eye of investors, partners and patients? We&apos;ve got you covered. From powerful pitch decks to unique websites, to scroll-stopping social media and stunning scientific illustrations, we make sure your message gets noticed and remembered.
              </p>
              <Link href="/services">
                <Button size="lg" variant="outline" className="group mt-2 border-white/40 bg-white/10 text-white backdrop-blur-md hover:bg-white hover:text-black hover:border-white transition-all rounded-full">
                  View All Services
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {[
                { title: "Corporate Messaging", desc: "Transform complex science into compelling narratives.", accent: "#F0564A" },
                { title: "Biotech Pitch Decks", desc: "Command attention and leave investors wanting more.", accent: "#5BCBD7" },
                { title: "Custom Websites", desc: "Draw viewers into your scientific story with modern design.", accent: "#F08435" },
                { title: "Scientific Illustration", desc: "Make your message crystal clear with stunning visuals.", accent: "#5BCBD7" },
                { title: "Public Relations", desc: "Amplify your voice across media channels.", accent: "#F0564A" },
                { title: "Social Media", desc: "Scroll-stopping content that resonates with your audience.", accent: "#F08435" }
              ].map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Card
                    className="group relative bg-white/5 backdrop-blur-md border-white/10 text-white shadow-xl hover:bg-white/[0.09] hover:border-white/20 transition-all duration-500 h-full overflow-hidden lift-sm"
                  >
                    {/* Accent line */}
                    <div
                      className="absolute top-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 ease-out"
                      style={{ background: `linear-gradient(90deg, transparent, ${service.accent}, transparent)` }}
                    />
                    {/* Hover glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: `radial-gradient(circle at top left, ${service.accent}22, transparent 60%)` }}
                    />
                    <CardContent className="p-5 relative">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold">{service.title}</h3>
                        <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-0.5 -translate-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">{service.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ PODCAST (refined: cyan + coral) ============ */}
      <section className="py-32 sm:py-40 md:py-48 bg-gray-50 text-gray-900 relative overflow-hidden border-t border-gray-200">
        {/* Glowing Background Elements — coral + brand cyan */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F0564A]/12 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#5BCBD7]/15 rounded-full blur-[150px] pointer-events-none" />

        <div className="container relative z-10 mx-auto px-5 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8 sm:space-y-10 max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-600 shadow-sm">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-[#F0564A] opacity-75 animate-ping" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-[#F0564A]" />
                </span>
                New Episodes Available
              </div>
              <h2 className="text-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
                Listen to{" "}
                <span className="text-aurora whitespace-nowrap">Spark Time!</span>
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed">
                Join Dani and Will as they unpack the secrets to biotech communication success in interviews with industry leaders. Tune in for insights, strategies, and tools to elevate your impact.
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
                <Link href="/spark-time">
                  <Button size="lg" className="group bg-[#F0564A] text-white hover:bg-[#D94D42] rounded-full px-7 sm:px-10 py-6 text-base sm:text-lg glow-spark-sm glow-spark-hover">
                    Check Out Our Guest List
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full px-7 sm:px-10 py-6 text-base sm:text-lg">
                  Listen on Spotify
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: 20 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, type: "spring", bounce: 0.3 }}
              className="relative perspective-[1000px]"
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#F0564A]/25 via-[#F08435]/15 to-[#5BCBD7]/20 rounded-[2rem] blur-2xl" />
              <div className="relative rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-2xl aspect-square transform-gpu group">
                <Image
                  src="/images/sparktime podcast cover image secondary 3kx3k (1).jpg"
                  alt="Spark Time Podcast"
                  fill
                  className="object-cover opacity-95 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
                />
                {/* Subtle play overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <TestimonialsSlider />

    </div>
  );
}
