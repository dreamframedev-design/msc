"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { websites } from "@/app/portfolio/data";

export default function WebsitesShowcase() {
  const filteredWebsites = websites.filter(w => w.name !== 'PBL Assay Science');
  
  // Find Lytix index in filtered array, default to 0 if not found
  const lytixIndex = filteredWebsites.findIndex(w => w.name === 'Lytix');
  const initialIndex = lytixIndex !== -1 ? lytixIndex : 0;

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const activeProject = filteredWebsites[activeIndex];
  const IMAGES_PER_PAGE = 4;
  
  // Reset page when project changes
  useEffect(() => {
    setCurrentPage(0);
  }, [activeIndex]);

  const totalPages = Math.ceil(activeProject.images.length / IMAGES_PER_PAGE);
  const currentImages = activeProject.images.slice(
    currentPage * IMAGES_PER_PAGE, 
    (currentPage + 1) * IMAGES_PER_PAGE
  );

  const getSidebarLogoClasses = (name: string) => {
    if (name === 'KeifeRx') return 'h-14 scale-110 origin-left -ml-6';
    if (name === 'Actym') return 'h-10 scale-100 origin-left';
    if (name === 'Paint Therapeutics') return 'h-10 scale-100 origin-left';
    if (name === 'Frenelle') return 'h-6 scale-95 origin-left';
    if (name === 'Medicenna') return 'h-8 scale-110 origin-left';
    if (name === 'Leon') return 'h-8 scale-105 origin-left';
    if (name === 'Lytix') return 'h-8 scale-110 origin-left';
    if (name === 'PBL Assay Science') return 'h-10 scale-105 origin-left';
    if (name === 'CellTaxis') return 'h-8 scale-105 origin-left';
    return 'h-8';
  };

  const getHeaderLogoClasses = (name: string) => {
    if (name === 'KeifeRx') return 'h-20 scale-110 origin-left -ml-8';
    if (name === 'Actym') return 'h-14 scale-100 origin-left';
    if (name === 'Paint Therapeutics') return 'h-16 scale-100 origin-left';
    if (name === 'Frenelle') return 'h-10 scale-95 origin-left';
    if (name === 'Medicenna') return 'h-12 scale-110 origin-left';
    if (name === 'Leon') return 'h-12 scale-105 origin-left';
    if (name === 'Lytix') return 'h-12 scale-110 origin-left';
    if (name === 'PBL Assay Science') return 'h-16 scale-105 origin-left';
    if (name === 'CellTaxis') return 'h-12 scale-105 origin-left';
    return 'h-12';
  };

  return (
    <>
      <div className="w-full bg-slate-50 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row h-[900px]">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-6 md:p-8 flex flex-col relative z-20 shrink-0">
          <div className="mb-8">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F0564A] mb-3 block">Digital Experiences</span>
            <h3 className="text-2xl font-bold text-slate-900">Featured Websites</h3>
            <p className="text-sm text-slate-500 mt-2">Select a client to view their digital transformation.</p>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {filteredWebsites.map((project, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-full text-left px-4 py-4 rounded-2xl transition-all duration-300 flex items-center justify-between group ${
                  activeIndex === idx 
                    ? "bg-slate-50 border border-slate-200 shadow-sm" 
                    : "hover:bg-slate-50 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3 w-full pr-4">
                  {project.logo ? (
                    <div className={`relative w-full transition-all duration-300 ${getSidebarLogoClasses(project.name)} ${activeIndex === idx ? "opacity-100" : "opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100"}`}>
                      <Image src={project.logo} alt={project.name} fill className="object-contain object-left" />
                    </div>
                  ) : (
                    <span className={`font-semibold transition-colors duration-300 ${activeIndex === idx ? "text-[#F0564A]" : "text-slate-600 group-hover:text-slate-900"}`}>
                      {project.name}
                    </span>
                  )}
                </div>
                
                {/* Active Indicator */}
                {activeIndex === idx && (
                  <motion.div layoutId="active-indicator" className="w-1.5 h-1.5 rounded-full bg-[#F0564A] shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area - Image Gallery */}
        <div className="w-full md:w-2/3 lg:w-3/4 bg-slate-100 relative overflow-hidden flex flex-col h-full">
          
          {/* Top Bar for active project */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-slate-900/10 to-transparent z-10 pointer-events-none" />
          
          <div className="flex-1 flex flex-col p-6 md:p-10 relative z-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-sm shrink-0">
              <div className="flex items-center gap-6">
                {activeProject.logo ? (
                  <div className={`relative w-48 ${getHeaderLogoClasses(activeProject.name)}`}>
                    <Image src={activeProject.logo} alt={activeProject.name} fill className="object-contain object-left" />
                  </div>
                ) : (
                  <h2 className="text-3xl font-bold text-slate-900">{activeProject.name}</h2>
                )}
              </div>
              <div className="px-4 py-1.5 bg-slate-100 rounded-full text-xs font-bold text-slate-500 uppercase tracking-widest">
                {activeProject.images.length} Views
              </div>
            </div>

            {/* Grid Container (No Scroll) */}
            <div className="flex-1 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage + "-" + activeIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 gap-6 content-start"
                >
                  {currentImages.map((img, imgIndex) => (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: imgIndex * 0.05 }}
                      key={imgIndex} 
                      onClick={() => setSelectedImage(img)}
                      className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group border border-slate-200/50 bg-white cursor-zoom-in aspect-[4/3] md:aspect-[16/10]"
                    >
                      <Image 
                        src={img} 
                        alt={`${activeProject.name} screenshot ${imgIndex + 1}`} 
                        fill
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex justify-between items-end">
                          <div>
                            <span className="text-white font-bold text-lg">{activeProject.name}</span>
                            <p className="text-slate-300 text-sm">Click to expand</p>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pagination Dots */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-3 shrink-0">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx)}
                    className={`transition-all duration-300 rounded-full ${
                      currentPage === idx 
                        ? "w-8 h-2.5 bg-[#F0564A]" 
                        : "w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400"
                    }`}
                    aria-label={`Go to page ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-slate-900/40 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 w-12 h-12 bg-slate-900/50 hover:bg-slate-900/80 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-md border border-white/10 shadow-xl"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full h-full max-w-4xl max-h-[70vh] rounded-[2rem] overflow-hidden shadow-2xl border border-white/20 bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <Image 
                src={selectedImage} 
                alt="Expanded view" 
                fill 
                className="object-contain p-2 rounded-[2rem]"
                quality={100}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
