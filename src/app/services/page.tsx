"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { EngineeredCapabilities } from "@/components/services/EngineeredCapabilities";

const services = [
  {
    id: "messaging",
    title: "Compelling Corporate Messaging",
    description: "Every great company starts with a great story, and at Mighty Spark, we're experts in telling yours. We analyze your science and craft clear, impactful messaging. This differentiation becomes the heart of your communication strategy, ensuring you speak with clarity, confidence, and impact to investors and pharma partners.",
    image: "/images/storyboard hero_edited.jpg",
    icon: "💬",
    objectPosition: "right"
  },
  {
    id: "pitch-decks",
    title: "Biotech Pitch Decks with Punch",
    description: "Let's be honest - VCs and pharma partners see a lot of pitch decks. You want yours to stand out, and we make sure it does. Using your differentiated corporate narrative as a foundation, we build decks that leave no audience behind. We simplify complex science into visuals that connect, and with our brand expertise, your pitch will be memorable for all the right reasons.",
    image: "/images/projection hero_edited.jpg",
    icon: "📊"
  },
  {
    id: "websites",
    title: "Custom Websites",
    description: "Your website is often the first impression investors and partners get of your company. It needs to do more than look good - it needs to tell your story. We create user experiences that are captivating, memorable, and engaging so your audience keeps coming back for more. Think of it as the ultimate stage for your biotech innovation.",
    image: "/images/laptop mockup hero_edited.jpg",
    icon: "💻",
    objectPosition: "right"
  },
  {
    id: "illustration",
    title: "Scientific Illustration",
    description: "Science is complicated. We make it beautiful. Our skilled illustrators and designers craft visuals that not only captivate but are scientifically precise, ensuring your audience clearly understands even the most complex concepts.",
    image: "/images/flowsaber_a_beautiful_scientific_biotech_close_up_molecular_mic_231de8ff-e324-440e-9056-b28133c799dc_edited (1).jpg",
    icon: "🧬",
    objectPosition: "right"
  },
  {
    id: "pr",
    title: "Strategic Biotech Public Relations",
    description: "You've got a powerful story - now let's get it heard. We amplify the voices of pre-clinical and early-clinical biotech companies with tailored public relations strategies. From press releases to media outreach, we engage the right audiences with your vision and keep them inspired.",
    image: "/images/tactical team desk hero.avif",
    icon: "📢"
  },
  {
    id: "social",
    title: "Tactical Social Media Management",
    description: "Your social media is your news channel to the world, and we make it shine. Our social media experts design posts that engage, excite, and drive your vision forward. Stay top-of-mind with your audience and keep them coming back for more.",
    image: "/images/nice new storyboard web hero_edited.jpg",
    icon: "📱"
  },
  {
    id: "marketing",
    title: "Strategic Marketing for Service Providers",
    description: "Effective campaigns captivate attention and increase revenue. MSC designs end-to-end marketing strategies that build brand loyalty and fuel sustainable growth for results you can measure.",
    image: "/images/hero girl at desk white_edited.jpg",
    icon: "📈"
  },
  {
    id: "email",
    title: "Email Marketing Campaigns",
    description: "We craft compelling content, manage campaign execution, and optimize performance to ensure your message reaches the right audience at the right time to drive engagement. Whether you're nurturing investor relationships or generating leads, our strategic approach transforms email into a powerful business development tool.",
    image: "/images/email campaign hero.jpg",
    icon: "✉️"
  },
  {
    id: "seo",
    title: "SEO Strategy & Optimization",
    description: "Our SEO services go beyond keywords, integrating technical expertise with content strategy to boost visibility, and credibility. From foundational optimization to advanced strategies that drive business development, we ensure your site ranks where it matters and attracts the right partners, investors, and customers.",
    image: "/images/seo hero new.avif",
    icon: "🔍",
    objectPosition: "right"
  }
];

export default function Services() {
  const [activeService, setActiveService] = useState(services[0].id);
  const [railVisible, setRailVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.service-section');
      let currentActive = services[0].id;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          currentActive = section.id;
        }
      });

      setActiveService(currentActive);

      // Show rail only while the first sticky-scroll section is in viewport
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const inView = rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5;
        setRailVisible(inView);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeImage = services.find(s => s.id === activeService)?.image || services[0].image;
  const activePosition = services.find(s => s.id === activeService)?.objectPosition || "center";

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 md:pt-56 md:pb-32 overflow-hidden bg-[#0A0A0A] text-white min-h-[55vh] sm:min-h-[60vh] flex items-center">
        <div className="absolute inset-0 z-0 opacity-80">
          <Image
            src="/images/flowsaber_minimal_simple_opening_photorealistic_cinematic_shot__42eeffda-30d1-41a4-8f73-c49a4ac32608.png"
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
        </div>

        {/* Ambient brand orbs */}
        <div className="absolute top-1/4 right-10 w-[500px] h-[500px] orb orb-coral opacity-25 hidden md:block" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] orb orb-cyan opacity-20 hidden md:block" style={{ animationDelay: "-5s" }} />

        <div className="container relative z-10 mx-auto px-5 sm:px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <p className="text-eyebrow text-[#5BCBD7] mb-4">What We Offer</p>
            <h1 className="text-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl mb-6 sm:mb-8">
              Elevate your<br />
              <span className="text-aurora">scientific story</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed font-light max-w-2xl">
              Want to catch the eye of investors, partners and patients? We&apos;ve got you covered. From powerful pitch decks to unique websites, to scroll-stopping social media and stunning scientific illustrations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Interactive Sticky Scroll Section */}
      <section className="relative bg-[#0A0A0A]" ref={containerRef}>
        {/* Drifting gradient mesh — replaces the old pattern */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-[8%] left-[5%] w-[700px] h-[700px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(240,86,74,0.14) 0%, transparent 65%)", filter: "blur(80px)" }}
            animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-[45%] right-[-5%] w-[800px] h-[800px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(91,203,215,0.12) 0%, transparent 65%)", filter: "blur(100px)" }}
            animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
            transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[5%] left-[20%] w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(240,132,53,0.10) 0%, transparent 65%)", filter: "blur(90px)" }}
            animate={{ x: [0, 30, 0], y: [0, 30, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Subtle grid for depth (no logo wallpaper) */}
          <div
            className="absolute inset-0 opacity-[0.022]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          {/* Soft vignette top + bottom */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0A0A0A] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
        </div>

        {/* Sticky scroll-progress rail — fixed to viewport, desktop only */}
        <div
          className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-3 transition-opacity duration-500"
          style={{
            opacity: railVisible ? 1 : 0,
            pointerEvents: railVisible ? "auto" : "none",
          }}
          aria-hidden={!railVisible}
        >
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          {services.map((service, idx) => {
            const isActive = activeService === service.id;
            return (
              <button
                key={service.id}
                onClick={() => {
                  document.getElementById(service.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                className="group relative w-9 h-9 flex items-center justify-center"
                aria-label={`Jump to ${service.title}`}
              >
                <span
                  className={`relative z-10 flex items-center justify-center rounded-full font-bold text-[10px] tracking-wider transition-all duration-500 ${
                    isActive
                      ? "w-8 h-8 bg-[#F0564A] text-white shadow-[0_0_20px_rgba(240,86,74,0.6)]"
                      : "w-2.5 h-2.5 bg-white/25 group-hover:bg-white/60 group-hover:scale-150 text-transparent"
                  }`}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="absolute left-full ml-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
                  {service.title}
                </span>
              </button>
            );
          })}
        </div>

        <div className="container mx-auto px-5 sm:px-6 md:px-12 lg:px-24 relative z-10">
          <div className="flex flex-col lg:flex-row relative">

            {/* Left Side: Sticky Image Gallery */}
            <div className="hidden lg:block w-1/2 relative">
              <div className="sticky top-0 h-screen flex items-center justify-center py-24 pr-16">
                <div className="relative w-full aspect-[4/5] rounded-[2.5rem] shadow-2xl border border-white/10 bg-slate-900">
                  {/* Brand glow ring (sits behind, outside overflow clip) */}
                  <div className="absolute -inset-2 rounded-[2.5rem] bg-gradient-to-tr from-[#F0564A]/25 via-transparent to-[#5BCBD7]/25 opacity-60 blur-2xl -z-10" />

                  {/* Image clip wrapper */}
                  <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeImage}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.7, ease: "easeInOut" }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={activeImage}
                          alt="Service Visualization"
                          fill
                          className="object-cover"
                          style={{ objectPosition: activePosition }}
                          sizes="(max-width: 1024px) 0vw, 40vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Floating count chip */}
                  <div className="absolute top-5 left-5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-xl border border-white/15 z-20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F0564A] animate-pulse" />
                    <span className="text-eyebrow text-white/90">
                      {String(Math.max(0, services.findIndex(s => s.id === activeService)) + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Floating active service label */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeService}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                      className="absolute bottom-6 left-6 right-6 z-20"
                    >
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/12 backdrop-blur-xl border border-white/20 text-xs font-semibold text-white">
                        <span>{services.find(s => s.id === activeService)?.icon}</span>
                        <span>{services.find(s => s.id === activeService)?.title}</span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Right Side: Scrolling Content */}
            <div className="w-full lg:w-1/2 py-12 sm:py-16 lg:py-32">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  id={service.id}
                  className="service-section min-h-[50vh] lg:min-h-[60vh] flex flex-col justify-center py-10 sm:py-14 lg:py-32 border-b border-white/5 last:border-0"
                >
                  {/* Mobile Image (Hidden on Desktop) */}
                  <div className="lg:hidden w-full aspect-video relative rounded-3xl overflow-hidden mb-8 shadow-xl border border-white/10">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                      style={{ objectPosition: service.objectPosition || "center" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{ duration: 0.6 }}
                    className={`transition-all duration-500 ${activeService === service.id ? 'opacity-100' : 'lg:opacity-40'}`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                      <span className="text-3xl sm:text-4xl">{service.icon}</span>
                      <span className="font-bold tracking-[0.25em] uppercase text-xs sm:text-sm" style={{ color: index % 2 === 0 ? '#F0564A' : '#5BCBD7' }}>
                        0{index + 1}
                      </span>
                    </div>
                    <h2 className="text-display text-3xl sm:text-4xl md:text-5xl text-white mb-5 sm:mb-6">
                      {service.title}
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed font-light">
                      {service.description}
                    </p>

                    <div className={`mt-8 sm:mt-10 overflow-hidden transition-all duration-500 ${activeService === service.id ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <Link href="/contact" className="link-reveal inline-flex items-center gap-2 text-white hover:text-[#F0564A] transition-colors font-medium group">
                        Discuss this service
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Engineered Capabilities — animated showcase section */}
      <EngineeredCapabilities />

      {/* CTA Section */}
      <section className="py-24 sm:py-32 bg-white text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.04]">
          <Image
            src="/images/flowsaber_a_minimal_abstract_translucent_chemical_pattern_desig_a6ae47e5-6f5f-4a06-8865-ca10fd46f28a.png"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        {/* Brand glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#F0564A]/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#5BCBD7]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container relative z-10 mx-auto px-5 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <p className="text-eyebrow text-[#F0564A] mb-4">Let&apos;s Talk</p>
            <h2 className="text-display text-4xl sm:text-5xl md:text-6xl mb-6 sm:mb-8 text-gray-900">
              Ready to <span className="text-aurora">ignite</span> your brand?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 leading-relaxed">
              Let&apos;s craft a narrative that resonates and a digital presence that commands attention.
            </p>
            <Link href="/contact">
              <Button size="lg" className="group bg-[#F0564A] text-white hover:bg-[#D94D42] rounded-full px-8 sm:px-12 py-6 text-base sm:text-lg glow-spark-sm glow-spark-hover">
                Start a Project
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
