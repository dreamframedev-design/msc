"use client";

import { motion, useMotionValue, useSpring, PanInfo } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  quote: string;
  attribution: string;
  title: string;
  institution: string;
  institutionShort?: string;
  logo?: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "We've been working with Mighty Spark for a year now, and they've become a true extension of our Agilex team. They are sharp, fast, and easy to work with, and willing to jump in immediately whenever we need something.",
    attribution: "Cameron Smith",
    title: "Chief Business Development Officer",
    institution: "Agilex Biolabs",
    institutionShort: "Agilex",
  },
  {
    quote:
      "Mighty Spark has been an incredibly valuable partner to us at Actym. They are reliable, fast-moving, and truly thoughtful in their approach. The team is exceptionally responsive and easy to work with.",
    attribution: "Tom Smart",
    title: "CEO",
    institution: "Actym Therapeutics",
    institutionShort: "Actym",
  },
  {
    quote:
      "It was a pleasure working with Mighty Spark on our long overdue website and presentation materials re-fresh. Dani and Shannon make a terrific, cohesive team with complementary skills sets.",
    attribution: "James Posada",
    title: "CEO",
    institution: "Resolve Therapeutics",
    institutionShort: "Resolve",
  },
    {
      quote:
        "Mighty Spark&apos;s ability to distill complex scientific and strategic concepts into a cohesive, compelling narrative is unparalleled. They worked on crystallizing our messaging and refining our brand positioning.",
      attribution: "Jarrett Duncan",
    title: "CEO",
    institution: "RS Oncology",
    institutionShort: "RSO",
  },
  {
    quote:
      "Working with Dani and the Mighty Spark team was an absolute pleasure! Their dedication and availability whenever we needed them, combined with their flexibility in accommodating our changes, made the entire process seamless.",
    attribution: "Felipe Duran",
    title: "CFO",
    institution: "iBio",
    institutionShort: "iBio",
  },
  {
    quote:
      "Spectacular combination of scientific insight, storytelling, and vision. Mighty Spark is fantastic!",
    attribution: "Bill Reddick",
    title: "CEO",
    institution: "Paint Therapeutics",
    institutionShort: "Paint",
  },
];

export function TestimonialsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(480);
  const gap = 24;

  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 400, damping: 40 });

  useEffect(() => {
    const updateDimensions = () => {
      if (sliderRef.current) {
        const firstChild = sliderRef.current.firstElementChild as HTMLElement;
        if (firstChild && firstChild.offsetWidth > 0) {
          setCardWidth(firstChild.offsetWidth);
        }
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    const moveDistance = cardWidth + gap;
    const newPosition = -currentIndex * moveDistance;
    x.set(newPosition);
  }, [currentIndex, cardWidth, gap, x]);

  const moveDistance = cardWidth + gap;
  const maxScroll = -(testimonials.length - 1) * moveDistance;
  const dragConstraints = { left: maxScroll, right: 0 };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = cardWidth / 4;
    const draggedDistance = info.offset.x;

    if (draggedDistance < -threshold && currentIndex < testimonials.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (draggedDistance > threshold && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      const currentPosition = -currentIndex * moveDistance;
      x.set(currentPosition);
    }
  };

  const handleNavigation = (direction: "prev" | "next") => {
    if (direction === "next") {
      setCurrentIndex((prev) => Math.min(prev + 1, testimonials.length - 1));
    } else {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  return (
    <div className="relative w-full py-24 bg-gray-50 overflow-hidden">
      {/* Background glow effects for SaaS vibe (Light Version) */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#F0564A]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-sm font-bold tracking-widest text-[#F0564A] uppercase mb-4">Testimonials</h2>
          <h3 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-gray-900">
            Don&apos;t just take our word for it.
          </h3>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => handleNavigation("prev")}
            disabled={currentIndex === 0}
            aria-label="Previous testimonial"
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed ${
              currentIndex > 0
                ? "border-[#F0564A] text-[#F0564A] hover:bg-[#F0564A]/10 hover:scale-105"
                : "border-gray-300 text-gray-400"
            }`}
          >
            <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
          </button>
          <button
            onClick={() => handleNavigation("next")}
            disabled={currentIndex >= testimonials.length - 1}
            aria-label="Next testimonial"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#F0564A] flex items-center justify-center text-[#F0564A] hover:bg-[#F0564A]/10 hover:scale-105 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5 stroke-[2.5]" />
          </button>
          <span className="ml-2 text-xs font-semibold tracking-wider text-gray-500 tabular-nums">
            <span className="text-gray-900">{String(currentIndex + 1).padStart(2, "0")}</span>
            <span className="mx-1.5 text-gray-300">/</span>
            <span>{String(testimonials.length).padStart(2, "0")}</span>
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-x-hidden pb-16 pt-4 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8" ref={containerRef}>
          <motion.div
            ref={sliderRef}
            className="flex gap-6 cursor-grab active:cursor-grabbing will-change-transform select-none"
            drag="x"
            dragConstraints={dragConstraints}
            dragElastic={0.1}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            style={{ 
              width: "max-content",
              x: springX
            }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={`${index}-${testimonial.attribution.slice(0, 20)}`}
                className="flex-shrink-0 w-[calc(100vw-3rem)] sm:w-[calc(100vw-4rem)] md:w-[calc(100vw-6rem)] lg:w-[480px]"
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] }
                }}
              >
                <div className="group relative rounded-2xl border border-gray-200 bg-white hover:shadow-xl transition-all duration-500 ease-[0.32,0.72,0,1] flex flex-col overflow-hidden h-full min-h-[400px] p-10">
                  
                  {/* Top Gradient Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F0564A] to-orange-400 transition-all duration-500 opacity-0 group-hover:opacity-100 z-10" />
                  
                  <div className="flex-grow flex flex-col justify-center mb-8">
                    <h4 className="text-xl font-medium text-gray-700 leading-relaxed">
                      &quot;{testimonial.quote}&quot;
                    </h4>
                  </div>

                  <div className="pt-6 border-t border-gray-100 mt-auto">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
                          <span className="text-sm font-bold text-gray-500 group-hover:text-[#F0564A] transition-colors duration-500">
                            {testimonial.institutionShort || testimonial.institution.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 mb-1">
                            {testimonial.attribution}
                          </p>
                          <p className="text-xs text-gray-500 font-medium">
                            {testimonial.title}, {testimonial.institution}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-8">
          <div className="flex items-center gap-1.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "w-8 bg-[#F0564A]"
                    : "w-1.5 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
