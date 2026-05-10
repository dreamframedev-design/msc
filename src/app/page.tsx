"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TestimonialsSlider } from "@/components/ui/testimonials/TestimonialsSlider";

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
      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-start pt-32 md:pt-40 overflow-hidden bg-white">
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

        {/* Foreground Floating Elements Layer */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none mix-blend-multiply animate-breath">
          <Image 
            src="/images/foreground (3) copy.webp" 
            alt="Foreground elements" 
            fill 
            className="object-cover object-center"
          />
        </div>

        {/* Content */}
        <motion.div 
          style={{ y: yHeroText, opacity: opacityHeroText }}
          className="container relative z-20 mx-auto px-4 mt-12 md:mt-24"
        >
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-heading font-normal mb-4 tracking-tight text-[#F0564A]">
              Mighty Spark Communications
            </h1>
            <p className="text-3xl md:text-4xl text-gray-700 font-light mb-10">
              Making Science Click
            </p>
            <Button size="lg" className="text-lg px-8 py-6 rounded-full bg-[#F0564A] hover:bg-[#D94D42] text-white shadow-lg hover:shadow-xl transition-all">
              Book A Free Consultation
            </Button>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity: opacityHeroText }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center hover:opacity-100 transition-opacity cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <div className="w-[32px] h-[50px] rounded-full border-2 border-gray-900 flex justify-center p-2">
            <div className="w-1.5 h-2.5 bg-[#F0564A] rounded-full animate-bounce" />
          </div>
        </motion.div>
      </section>

      {/* Vision Section */}
      <section className="py-24 bg-white overflow-hidden relative">
        <div className="container mx-auto px-4 space-y-32">
          {/* Top Part */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="grid md:grid-cols-2 gap-16 items-center"
          >
            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-widest text-[#F0564A] uppercase">VISION</h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                At Mighty Spark Communications, we amplify the voices of pre-clinical and clinical biotech companies, showcasing your potential to advance therapeutic solutions and spark real connections with investors and partners.
              </p>
            </div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="relative h-[400px] md:h-[500px] w-full rounded-tl-[100px] rounded-br-[100px] overflow-hidden shadow-2xl"
            >
              <Image 
                src="/images/dani and will hero final web_edited.jpg" 
                alt="Dani and Will of Mighty Spark Communications in a professional meeting" 
                fill 
                className="object-cover"
              />
            </motion.div>
          </motion.div>

          {/* Middle decorative video */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="flex justify-start -my-16 relative z-10"
          >
             <div className="w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden shadow-2xl border-8 border-white">
               <video autoPlay loop muted playsInline className="object-cover w-full h-full">
                 <source src="/images/hero-video-1.mp4" type="video/mp4" />
               </video>
             </div>
          </motion.div>

          {/* Bottom Part */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="grid md:grid-cols-2 gap-16 items-center"
          >
            <div className="space-y-6 md:order-2">
              <h3 className="text-4xl md:text-5xl font-heading font-bold leading-tight text-gray-900">
                Your science deserves to be heard.<br/>
                <span className="text-[#F0564A]">We make sure it clicks.</span>
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                We&apos;re not just storytellers—we&apos;re catalysts for your success. We transform complex science into compelling corporate messaging that leave investors wanting more. Whether it&apos;s a corporate deck that commands attention, a custom website that draws viewers into your scientific story, or scientific illustrations that make your message crystal clear, we deliver clarity, precision, and impact. And we don&apos;t stop there—we make sure your message resonates across social and media channels with consistent, powerful communication.
              </p>
            </div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
              className="relative h-[400px] md:h-[500px] w-full rounded-tr-[100px] rounded-bl-[100px] overflow-hidden shadow-2xl md:order-1"
            >
               <video autoPlay loop muted playsInline className="object-cover w-full h-full">
                 <source src="/images/hero-video-2.mp4" type="video/mp4" />
               </video>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/flowsaber_a_beautiful_scientific_biotech_close_up_molecular_mic_231de8ff-e324-440e-9056-b28133c799dc_edited (1).jpg" 
            alt="Services Background" 
            fill 
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-16 space-y-6 text-white"
          >
            <h2 className="text-4xl md:text-6xl font-heading font-bold">Services</h2>
            <p className="text-xl text-gray-200">
              Want to catch the eye of investors, partners and patients? We&apos;ve got you covered. From powerful pitch decks to unique websites, to scroll-stopping social media and stunning scientific illustrations, we make sure your message gets noticed and remembered.
            </p>
            <Button size="lg" variant="outline" className="mt-4 border-white text-white hover:bg-white hover:text-black">
              View Services
            </Button>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Service Cards */}
            {[
              { title: "Corporate Messaging", desc: "Transform complex science into compelling narratives." },
              { title: "Biotech Pitch Decks", desc: "Command attention and leave investors wanting more." },
              { title: "Custom Websites", desc: "Draw viewers into your scientific story with modern design." },
              { title: "Scientific Illustration", desc: "Make your message crystal clear with stunning visuals." },
              { title: "Public Relations", desc: "Amplify your voice across media channels." },
              { title: "Social Media", desc: "Scroll-stopping content that resonates with your audience." }
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white shadow-2xl hover:bg-white/20 transition-all h-full">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                    <p className="text-gray-200">{service.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Podcast Section - Stripe SaaS Vibe (Light Version) */}
      <section className="py-40 md:py-48 bg-gray-50 text-gray-900 relative overflow-hidden border-t border-gray-200">
        {/* Glowing Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F0564A]/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-10 max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-600 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#F0564A] animate-pulse" />
                New Episodes Available
              </div>
              <h2 className="text-6xl md:text-8xl font-heading font-bold tracking-tight">
                Listen to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F0564A] to-orange-400">Spark Time!</span>
              </h2>
              <p className="text-2xl text-gray-600 leading-relaxed">
                Join Dani and Will as they unpack the secrets to biotech communication success in interviews with industry leaders. Tune in for insights, strategies, and tools to elevate your impact.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="bg-[#F0564A] text-white hover:bg-[#D94D42] rounded-full px-10 py-6 text-lg shadow-md hover:shadow-lg transition-all">
                  Check Out Our Guest List
                </Button>
                <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full px-10 py-6 text-lg">
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
              <div className="absolute inset-0 bg-gradient-to-tr from-[#F0564A]/20 to-transparent rounded-3xl blur-2xl" />
              <div className="relative rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-2xl aspect-square transform-gpu">
                <Image 
                  src="/images/sparktime podcast cover image secondary 3kx3k (1).jpg" 
                  alt="Spark Time Podcast" 
                  fill 
                  className="object-cover opacity-90 hover:opacity-100 transition-opacity duration-500 hover:scale-105"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSlider />

    </div>
  );
}
