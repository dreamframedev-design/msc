"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles, Clock, Calendar } from "lucide-react";
import { articles } from "./data";

export default function News() {
  const [featured, ...rest] = articles;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ============ HERO ============ */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 md:pt-48 md:pb-32 overflow-hidden bg-[#0A0A0A] text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/news hero.avif"
            alt=""
            fill
            className="object-cover object-center opacity-35"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/30 via-[#0A0A0A]/70 to-[#0A0A0A]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-[#0A0A0A]/80" />
        </div>

        {/* Brand orbs */}
        <motion.div
          className="absolute top-1/4 left-[10%] w-[500px] h-[500px] rounded-full hidden md:block"
          style={{ background: "radial-gradient(circle, rgba(240,86,74,0.22) 0%, transparent 65%)", filter: "blur(85px)" }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-[10%] w-[500px] h-[500px] rounded-full hidden md:block"
          style={{ background: "radial-gradient(circle, rgba(91,203,215,0.18) 0%, transparent 65%)", filter: "blur(85px)" }}
          animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="container relative z-10 mx-auto px-5 sm:px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 sm:mb-8 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs font-bold text-[#5BCBD7] uppercase tracking-[0.2em]">
              <Sparkles className="w-3 h-3" />
              MSC Editorial
            </div>
            <h1 className="text-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-5 sm:mb-6">
              News &amp; <span className="text-aurora">Insights</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">
              Making science click. Articles, perspectives, and field notes for the biotech community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============ ARTICLES ============ */}
      <section className="relative py-20 sm:py-24 md:py-32 bg-gray-50 overflow-hidden">
        {/* Subtle brand ambience */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F0564A]/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#5BCBD7]/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="container relative z-10 mx-auto px-5 sm:px-6 max-w-6xl">

          {/* FEATURED ARTICLE */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className="mb-16 sm:mb-20"
            >
              <div className="flex items-center gap-3 mb-6">
                <p className="text-eyebrow text-[#F0564A]">Latest</p>
                <div className="flex-1 h-px bg-gradient-to-r from-[#F0564A]/30 via-gray-200 to-transparent" />
              </div>

              <Link href={`/news/${featured.slug}`} className="group block">
                <article className="relative bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-[0_10px_50px_rgb(0,0,0,0.05)] hover:shadow-[0_20px_70px_rgb(240,86,74,0.12)] transition-all duration-500 lift">
                  <div className="grid lg:grid-cols-5 gap-0">
                    {/* Image side */}
                    <div className="relative lg:col-span-2 aspect-[16/10] lg:aspect-auto lg:min-h-[420px] overflow-hidden bg-gray-100">
                      <Image
                        src={featured.imageUrl || "/images/news hero.avif"}
                        alt={featured.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/30 to-transparent" />
                      <div className="absolute top-5 left-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0564A] text-white text-[10px] font-bold uppercase tracking-[0.18em] shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        Featured
                      </div>
                    </div>

                    {/* Content side */}
                    <div className="lg:col-span-3 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500 mb-5">
                        <span className="inline-flex items-center gap-1.5 font-medium text-[#F0564A]">
                          <Calendar className="w-3.5 h-3.5" />
                          {featured.date}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="inline-flex items-center gap-1.5 text-gray-500">
                          <Clock className="w-3.5 h-3.5" />
                          {featured.readTime}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4 sm:mb-5 leading-tight group-hover:text-[#F0564A] transition-colors duration-300">
                        {featured.title}
                      </h2>
                      <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8">
                        {featured.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-2 text-[#F0564A] font-semibold text-sm sm:text-base">
                        Read the full article
                        <span className="w-9 h-9 rounded-full bg-[#F0564A]/10 group-hover:bg-[#F0564A] flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_8px_24px_rgba(240,86,74,0.35)]">
                          <ArrowUpRight className="w-4 h-4 group-hover:text-white transition-colors" />
                        </span>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          )}

          {/* REST */}
          {rest.length > 0 && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-8 sm:mb-10"
              >
                <p className="text-eyebrow text-[#5BCBD7]">More from the journal</p>
                <div className="flex-1 h-px bg-gradient-to-r from-[#5BCBD7]/30 via-gray-200 to-transparent" />
              </motion.div>

              <div className="grid md:grid-cols-2 gap-5 sm:gap-7">
                {rest.map((article, index) => {
                  const accent = index % 2 === 0 ? "#F0564A" : "#5BCBD7";
                  return (
                    <motion.div
                      key={article.slug}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
                    >
                      <Link href={`/news/${article.slug}`} className="group block h-full">
                        <article className="relative bg-white rounded-[1.75rem] overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_50px_rgb(0,0,0,0.08)] transition-all duration-500 lift-sm h-full flex flex-col">
                          {/* Top accent bar */}
                          <div
                            className="absolute top-0 left-0 right-0 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out z-10"
                            style={{ background: accent }}
                          />

                          <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                            <Image
                              src={article.imageUrl || "/images/news hero.avif"}
                              alt={article.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            <div
                              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                              style={{ background: `linear-gradient(135deg, transparent 55%, ${accent}33 100%)` }}
                            />
                          </div>

                          <div className="p-6 sm:p-8 flex-1 flex flex-col">
                            <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                              <span
                                className="inline-flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider"
                                style={{ color: accent }}
                              >
                                <Calendar className="w-3 h-3" />
                                {article.date}
                              </span>
                              <span className="text-gray-300">•</span>
                              <span className="inline-flex items-center gap-1.5">
                                <Clock className="w-3 h-3" />
                                {article.readTime}
                              </span>
                            </div>

                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-[#F0564A] transition-colors duration-300">
                              {article.title}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-5 flex-1">
                              {article.excerpt}
                            </p>

                            <span className="inline-flex items-center gap-2 text-sm font-semibold mt-auto" style={{ color: accent }}>
                              Read article
                              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </span>
                          </div>
                        </article>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}

        </div>
      </section>
    </div>
  );
}
