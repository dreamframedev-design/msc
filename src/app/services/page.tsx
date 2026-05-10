"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";

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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.service-section');
      let currentActive = services[0].id;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        // Check if the section is in the middle of the viewport
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          currentActive = section.id;
        }
      });

      setActiveService(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeImage = services.find(s => s.id === activeService)?.image || services[0].image;
  const activePosition = services.find(s => s.id === activeService)?.objectPosition || "center";

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A]">
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-56 md:pb-32 overflow-hidden bg-[#0A0A0A] text-white min-h-[60vh] flex items-center">
        <div className="absolute inset-0 z-0 opacity-80">
          <Image 
            src="/images/flowsaber_minimal_simple_opening_photorealistic_cinematic_shot__42eeffda-30d1-41a4-8f73-c49a4ac32608.png" 
            alt="Services Background" 
            fill 
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 md:px-12 lg:px-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-8 tracking-tight leading-tight">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F0564A] to-orange-400">Scientific Story</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light max-w-2xl">
              Want to catch the eye of investors, partners and patients? We've got you covered. From powerful pitch decks to unique websites, to scroll-stopping social media and stunning scientific illustrations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Interactive Sticky Scroll Section */}
      <section className="relative bg-[#0A0A0A]" ref={containerRef}>
        {/* Subtle MSC Flame Pattern Background */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.03]"
          style={{
            backgroundImage: 'url("/images/MSC LOGO BITTERSWEET VECTOR (1).svg")',
            backgroundSize: '120px 120px',
            backgroundRepeat: 'repeat',
            backgroundPosition: 'center'
          }}
        />
        {/* Gradient overlays to fade the pattern at the top and bottom */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-12 lg:px-24 relative z-10">
          <div className="flex flex-col lg:flex-row relative">
            
            {/* Left Side: Sticky Image Gallery */}
            <div className="hidden lg:block w-1/2 relative">
              <div className="sticky top-0 h-screen flex items-center justify-center py-24 pr-16">
                <div className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 bg-slate-900">
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
                        className="object-cover transition-all duration-700"
                        style={{ objectPosition: activePosition }}
                      />
                      {/* Subtle overlay for depth */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Right Side: Scrolling Content */}
            <div className="w-full lg:w-1/2 py-20 lg:py-32">
              {services.map((service, index) => (
                <div 
                  key={service.id} 
                  id={service.id}
                  className="service-section min-h-[60vh] flex flex-col justify-center py-16 lg:py-32 border-b border-white/5 last:border-0"
                >
                  {/* Mobile Image (Hidden on Desktop) */}
                  <div className="lg:hidden w-full aspect-video relative rounded-3xl overflow-hidden mb-10 shadow-xl border border-white/10">
                    <Image 
                      src={service.image} 
                      alt={service.title} 
                      fill 
                      className="object-cover"
                      style={{ objectPosition: service.objectPosition || "center" }}
                    />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{ duration: 0.6 }}
                    className={`transition-all duration-500 ${activeService === service.id ? 'opacity-100' : 'lg:opacity-40'}`}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-4xl">{service.icon}</span>
                      <span className="text-[#F0564A] font-bold tracking-widest uppercase text-sm">0{index + 1}</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6 leading-tight">
                      {service.title}
                    </h2>
                    <p className="text-xl text-gray-400 leading-relaxed font-light">
                      {service.description}
                    </p>
                    
                    {/* Optional: Add a subtle 'Learn More' interaction if needed later */}
                    <div className={`mt-10 overflow-hidden transition-all duration-500 ${activeService === service.id ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <Link href="/contact" className="inline-flex items-center gap-2 text-white hover:text-[#F0564A] transition-colors font-medium group">
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

      {/* CTA Section */}
      <section className="py-32 bg-white text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-5">
          <Image 
            src="/images/flowsaber_a_minimal_abstract_translucent_chemical_pattern_desig_a6ae47e5-6f5f-4a06-8865-ca10fd46f28a.png" 
            alt="Pattern" 
            fill 
            className="object-cover"
          />
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-8 text-gray-900">Ready to ignite your brand?</h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Let's craft a narrative that resonates and a digital presence that commands attention.
            </p>
            <Button size="lg" className="bg-[#F0564A] text-white hover:bg-[#D94D42] rounded-full px-12 py-6 text-lg shadow-xl hover:shadow-2xl transition-all">
              Start a Project
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
