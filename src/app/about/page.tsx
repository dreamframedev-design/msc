"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, GraduationCap, Award, Target, Sparkles } from "lucide-react";

const team = [
  {
    name: "Dani Stoltzfus",
    role: "Founder + CEO",
    bio: "Dani is a former biotech leader turned master storyteller. With over 15 years of experience in scientific research, she's a pro at breaking down complex science into messaging that inspires and influences. Her mission is to help companies inspire and influence audiences for transformative change. She holds a PhD, BSc (Hons), and BTech (Forensic & Analytical Chemistry) from Flinders University, Australia.",
    image: "/images/dani new headshot final web (1).jpg",
  },
  {
    name: "Shannon McCarthy",
    role: "Chief Business Officer",
    bio: "Shannon is a dynamic business strategist with a passion for turning biotech breakthroughs into conversations that matter. With decades of experience leading companies and teams, she thrives on bridging the gap between groundbreaking science and the connections that fuel its success. Known for her sharp insights and bold approach, she's on a mission to redefine how biotech companies communicate in a world where every word counts.",
    image: "/images/shannon mccarthy.png",
  },
  {
    name: "Will Riedl",
    role: "Co-Founder + Scientific Director",
    bio: "Will passionately believes that the data is only half the story - and how you tell it is the other half. With a background in both academia and industry, he knows how to connect science with its audience. His mission is to help biotech companies communicate their value with confidence and clarity, making sure their message lands every time. Will earned his PhD from The University of Chicago and his BS from The University of Illinois.",
    image: "/images/will new headshot web.jpg",
  },
  {
    name: "Zel Stoltzfus",
    role: "Director of Scientific Illustration",
    bio: "Zel Stoltzfus is a master illustrator with a gift for bringing complex science to life. With a Bachelor of Science in Biology and a graduate degree in Science Illustration from UCSC Extension, his work has graced institutions like the Smithsonian National Museum of Natural History and the Carnegie Museum of Natural History. From medical illustration to museum exhibits, Zel's mission is clear: to draw the stories of Planet Earth in ways that educate and inspire.",
    image: "/images/zel headshot.jpg",
  },
  {
    name: "Taylor Patoni",
    role: "Social Media Maven",
    bio: "Taylor is a digital media wizard who transforms posts into platforms and cultivates devoted audiences with bold and creative strategies. Known for her innovative campaigns, she specializes in crafting messaging that makes biotech brands stand out. She thrives on helping companies connect with their audience in authentic, impactful ways. Her mission is to redefine how science meets social, one scroll-stopping moment at a time.",
    image: "/images/Taylor Patoni social media manager.jpg",
  },
  {
    name: "Conner McCarthy",
    role: "Creative Director",
    bio: "Conner is a design alchemist with 15+ years of experience crafting breathtaking websites that fuse science, art, and imagination. Known for his creativity with images and visual storytelling, he transforms complex ideas into stunning, immersive experiences. Whether designing for biotech or crafting iconic creations like his globally best-selling stunt lightsaber, Conner's work blends innovation with artistry, making the impossible feel magical.",
    image: "/images/conner msc headshot web final.jpg",
  },
  {
    name: "Keith Bowermaster, APR",
    role: "Head of Media Relations",
    bio: "Since 1993 Keith has been at the forefront of healthcare communications, turning scientific breakthroughs into compelling stories. As a seasoned media relations expert, he crafts strategic PR campaigns, secures impactful coverage in top-tier publications, and builds narratives that connect innovations with key audiences. From elevating thought leadership to helping companies emerge from stealth, Keith ensures our biotech clients make their mark with messages that inspire trust and action.",
    image: "/images/keith final headshot.jpg",
  },
  {
    name: "Ron Sarkar, PhD, MBA",
    role: "BD Advisor",
    bio: "Ranajoy Sarkar brings more than two decades of experience across biopharma structured finance, private capital markets, and investment strategy. He supports MSC clients with sharp insights into business development, helping them navigate complex markets, identify growth opportunities, and build the right relationships. Known for his clarity, calm, and deep knowledge of financial systems, Ron is a trusted thought partner to founders, funders, and innovators working to expand their reach and impact.",
    image: "/images/ron msc (1).jpg",
  },
  {
    name: "John Thomas, PhD",
    role: "Analytical Development Consultant",
    bio: "John is an analytical development expert with experience at Genzyme, ImmunoGen, Synageva, Alexion, Synlogic, and NeuBase Therapeutics. He advises biotech teams on CMC strategy, analytical design, and IND readiness, bringing a precision-driven approach to advancing complex biologics from discovery to development.",
    image: "/images/john thomas.jpg",
  },
];

const leaders = team.slice(0, 3);
const specialists = team.slice(3);

const stats = [
  { value: "10", label: "Specialists", Icon: Users },
  { value: "45+", label: "Years experience", Icon: Award },
  { value: "4", label: "PhDs on staff", Icon: GraduationCap },
  { value: "100%", label: "Biotech focused", Icon: Target },
];

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* ============ HERO ============ */}
      <section className="relative bg-[#0A0A0A] text-white pt-32 pb-20 sm:pt-40 sm:pb-28 md:pt-48 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/flowsaber_minimal_simple_opening_photorealistic_cinematic_shot__42eeffda-30d1-41a4-8f73-c49a4ac32608.png"
            alt=""
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/40 via-[#0A0A0A]/70 to-[#0A0A0A]" />
        </div>

        {/* Brand orbs */}
        <motion.div
          className="absolute top-1/4 left-[8%] w-[500px] h-[500px] rounded-full hidden md:block"
          style={{ background: "radial-gradient(circle, rgba(240,86,74,0.2) 0%, transparent 65%)", filter: "blur(80px)" }}
          animate={{ x: [0, 35, 0], y: [0, -25, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-[8%] w-[600px] h-[600px] rounded-full hidden md:block"
          style={{ background: "radial-gradient(circle, rgba(91,203,215,0.17) 0%, transparent 65%)", filter: "blur(90px)" }}
          animate={{ x: [0, -35, 0], y: [0, 25, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="container relative z-10 mx-auto px-5 sm:px-6 max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 sm:mb-8 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs font-bold text-[#5BCBD7] uppercase tracking-[0.2em]">
              <Sparkles className="w-3 h-3" />
              About MSC
            </div>
            <h1 className="text-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-5 sm:mb-8">
              Meet the minds<br />
              behind the <span className="text-aurora">spark</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-3 sm:mb-4">
              We know that big ideas need bold messaging. MSC is the bridge between your groundbreaking science and powerful communication that drives results.
            </p>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
              Our mission is to transform your complex science into compelling corporate messaging that inspires, resonates, and never gets forgotten.
            </p>
          </motion.div>

          {/* Floating headshot cluster */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 sm:mt-16 flex flex-col items-center gap-4"
          >
            <div className="flex -space-x-3 sm:-space-x-4">
              {team.slice(0, 6).map((member, i) => (
                <motion.div
                  key={member.name}
                  whileHover={{ y: -10, scale: 1.12, zIndex: 20 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-[#0A0A0A] overflow-hidden shadow-xl group cursor-pointer"
                  style={{ zIndex: 6 - i }}
                  title={member.name}
                >
                  <Image src={member.image} alt={member.name} fill className="object-cover" sizes="64px" />
                </motion.div>
              ))}
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-[#0A0A0A] bg-white/8 backdrop-blur-md flex items-center justify-center text-xs sm:text-sm font-bold text-white shadow-xl">
                +{team.length - 6}
              </div>
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-bold">A family of {team.length}</p>
          </motion.div>
        </div>
      </section>

      {/* ============ STATS STRIP ============ */}
      <section className="relative py-12 sm:py-16 bg-[#070710] text-white border-t border-white/[0.06]">
        {/* Faint grid */}
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
                className="relative p-4 sm:p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm text-center hover:bg-white/[0.05] hover:border-white/[0.15] transition-all group overflow-hidden"
              >
                <div
                  className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "radial-gradient(circle, rgba(240,86,74,0.18), transparent 70%)", filter: "blur(20px)" }}
                />
                <stat.Icon className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-2 sm:mb-3 text-[#F0564A] group-hover:scale-110 transition-transform relative" />
                <div className="text-display text-2xl sm:text-4xl md:text-5xl text-white mb-1 relative">{stat.value}</div>
                <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider relative">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHO WE ARE ============ */}
      <section className="py-20 sm:py-24 md:py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-5 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="text-eyebrow text-[#F0564A] mb-4">Who we are</p>
            <h2 className="text-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6 sm:mb-8">
              A collaborative family of scientists, strategists, and <span className="text-aurora">storytellers</span>.
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
              At MSC, our team is the heart of our success. We&apos;re more than just experts. We combine scientific rigor with creative flair to deliver communication solutions that make the complex world of biotech accessible, engaging, and unforgettable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============ LEADERSHIP ============ */}
      <section className="pb-20 sm:pb-24 md:pb-32 bg-white">
        <div className="container mx-auto px-5 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12"
          >
            <p className="text-eyebrow text-[#5BCBD7]">Leadership</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {leaders.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative"
              >
                {/* Brand glow ring */}
                <div
                  className="absolute -inset-1 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"
                  style={{
                    background: i === 1
                      ? "linear-gradient(135deg, rgba(91,203,215,0.3) 0%, transparent 50%, rgba(240,86,74,0.2) 100%)"
                      : "linear-gradient(135deg, rgba(240,86,74,0.3) 0%, transparent 50%, rgba(91,203,215,0.2) 100%)",
                  }}
                />
                <div className="relative bg-white rounded-[2rem] p-5 sm:p-6 border border-gray-100 shadow-[0_10px_40px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.1)] transition-all duration-500 lift">
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-5 sm:mb-6 bg-gray-100">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 768px) 90vw, 30vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    {/* Hover gradient overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `linear-gradient(135deg, transparent 50%, ${i === 1 ? "rgba(91,203,215,0.25)" : "rgba(240,86,74,0.25)"} 100%)` }}
                    />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-2 group-hover:text-[#F0564A] transition-colors duration-300">
                    {member.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="w-6 h-px transition-all duration-500 group-hover:w-12"
                      style={{ background: i === 1 ? "#5BCBD7" : "#F0564A" }}
                    />
                    <p
                      className="font-bold text-xs sm:text-sm uppercase tracking-[0.15em]"
                      style={{ color: i === 1 ? "#5BCBD7" : "#F0564A" }}
                    >
                      {member.role}
                    </p>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SPECIALISTS ============ */}
      <section className="py-20 sm:py-24 md:py-32 bg-gray-50/70 relative overflow-hidden">
        {/* Subtle brand orbs */}
        <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-[#F0564A]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-[#5BCBD7]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-5 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto"
          >
            <p className="text-eyebrow text-[#F0564A] mb-4">The full team</p>
            <h3 className="text-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900">
              Specialists who make it <span className="text-aurora">click</span>
            </h3>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7 max-w-7xl mx-auto">
            {specialists.map((member, i) => {
              const accents = ["#F0564A", "#5BCBD7", "#F08435"];
              const accent = accents[i % accents.length];
              return (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="group relative"
                >
                  <div className="relative bg-white rounded-[1.75rem] overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_18px_50px_rgb(0,0,0,0.1)] transition-all duration-500 lift-sm h-full flex flex-col">
                    {/* Top accent bar */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out z-10"
                      style={{ background: accent }}
                    />

                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {/* Accent corner gradient on hover */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background: `linear-gradient(135deg, transparent 55%, ${accent}33 100%)` }}
                      />
                    </div>

                    <div className="p-5 sm:p-6 flex-1 flex flex-col">
                      <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 group-hover:translate-x-0.5 transition-transform duration-300">
                        {member.name}
                      </h4>
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-5 h-px transition-all duration-500 group-hover:w-10"
                          style={{ background: accent }}
                        />
                        <p
                          className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em]"
                          style={{ color: accent }}
                        >
                          {member.role}
                        </p>
                      </div>
                      <p className="text-gray-600 leading-relaxed text-sm flex-1">
                        {member.bio}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ CLOSING CTA ============ */}
      <section className="py-20 sm:py-24 md:py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#F0564A]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#5BCBD7]/12 rounded-full blur-[120px] pointer-events-none" />

        <div className="container relative z-10 mx-auto px-5 sm:px-6 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-eyebrow text-[#F0564A] mb-4">Let&apos;s connect</p>
            <h3 className="text-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-5 sm:mb-6">
              Ready to dream big and <span className="text-aurora">shine brightly</span>?
            </h3>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 leading-relaxed">
              We&apos;re here to help you communicate with clarity in the world of scientific innovation.
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
      </section>
    </div>
  );
}
