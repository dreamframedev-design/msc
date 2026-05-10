'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface Testimonial {
  quote: string;
  attribution: string;
  title: string;
  institution: string;
  institutionShort?: string; // For logo/identifier text
  logo?: string; // Optional logo path
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Reliable quantification of IFN subtypes revolutionized our donor screening. PBL's high-sensitivity ELISAs allowed our team to detect baseline levels previously lost in the noise. The technical support from their scientists was second to none.",
    attribution: 'Senior Scientist & Program Lead',
    title: 'Principal Investigator',
    institution: 'Large U.S. Pharma',
    institutionShort: 'Pharma',
  },
  {
    quote:
      "I appreciate your care in reliably producing high-quality data. The depth of scientific knowledge and project design expertise that PBL brings to the table has greatly benefitted our research workflow.",
    attribution: 'Director of Biology',
    title: 'Research Director',
    institution: 'Midsize U.S. Biotech',
    institutionShort: 'Biotech',
  },
  {
    quote:
      "The moment we hear that you've qualified a difficult assay, we breathe a sigh of relief because we know our samples are in good hands. PBL is superfast and always very helpful and knowledgeable.",
    attribution: 'Senior Scientist & Program Lead',
    title: 'Assay Development Lead',
    institution: 'Large U.S. Pharma',
    institutionShort: 'Pharma',
  },
  {
    quote:
      "I appreciate your team's support, expertise, and thoughtfulness. It's been a delight working together, and I look forward to future collaborations with PBL.",
    attribution: 'Research Scientist',
    title: 'Senior Research Scientist',
    institution: 'Large U.S. Pharma',
    institutionShort: 'Pharma',
  },
  {
    quote:
      "Thank you, PBL, for producing fantastic data, your quick turnaround time, and your responsiveness to my needs. We've greatly benefitted from PBL's strong support and flexibility.",
    attribution: 'Senior Scientist',
    title: 'Principal Investigator',
    institution: 'Small U.S. Biotech',
    institutionShort: 'Biotech',
  },
  {
    quote:
      "I appreciate PBL's strong support and flexibility and look forward to your continued support on additional high-priority projects. Having the opportunity to work with you has been a real pleasure.",
    attribution: 'Associate Director',
    title: 'Senior Director',
    institution: 'Large U.S. Pharma',
    institutionShort: 'Pharma',
  },
  {
    quote:
      "There is no match for the support you provide. The PBL team is always very clear, thorough, and prompt with its responses. We very much enjoy working with the PBL team.",
    attribution: 'Postdoctoral Fellow',
    title: 'Research Fellow',
    institution: 'Large U.S. University',
    institutionShort: 'University',
  },
];

export default function TestimonialsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(480); // Default to lg width
  const [gap, setGap] = useState(24);

  // High-fidelity spring for that "viscous" Stripe feel
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 400, damping: 40 });

  // Calculate card width and gap on mount and resize
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
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Update position when index changes (for arrow navigation)
  useEffect(() => {
    const moveDistance = cardWidth + gap;
    const newPosition = -currentIndex * moveDistance;
    x.set(newPosition);
  }, [currentIndex, cardWidth, gap, x]);

  // Calculate drag constraints
  const moveDistance = cardWidth + gap;
  const maxScroll = -(testimonials.length - 1) * moveDistance;
  const dragConstraints = { left: maxScroll, right: 0 };

  const handleDragEnd = (event: any, info: any) => {
    const threshold = cardWidth / 4; // 25% of card must be moved to trigger slide
    const draggedDistance = info.offset.x;

    if (draggedDistance < -threshold && currentIndex < testimonials.length - 1) {
      // Dragged left (negative) = move to next card (increase index)
      setCurrentIndex(prev => prev + 1);
    } else if (draggedDistance > threshold && currentIndex > 0) {
      // Dragged right (positive) = move to previous card (decrease index)
      setCurrentIndex(prev => prev - 1);
    } else {
      // Snap back to current index
      const currentPosition = -currentIndex * moveDistance;
      x.set(currentPosition);
    }
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      setCurrentIndex(prev => Math.min(prev + 1, testimonials.length - 1));
    } else {
      setCurrentIndex(prev => Math.max(prev - 1, 0));
    }
  };

  return (
    <div className="relative w-full py-16" style={{ backgroundColor: '#FAFAFD' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Stripe-Style Section Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-8 md:mb-12">
          <div className="flex-1 max-w-2xl">
            <h2 className="text-5xl font-bold mb-6 tracking-tight text-[#002776]">
              Don’t Take Our Word For It
            </h2>
          </div>
          
          {/* Navigation Arrows - Desktop Only (lg and up) */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => handleNavigation('prev')}
              disabled={currentIndex === 0}
              aria-label="Previous testimonial"
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed ${
                currentIndex > 0
                  ? 'border-cyan-400 text-cyan-500 bg-cyan-50/50 hover:bg-cyan-50'
                  : 'border-slate-200 text-slate-400 hover:border-cyan-400 hover:text-cyan-500 hover:bg-cyan-50/50'
              }`}
            >
              <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
            </button>
            <button
              onClick={() => handleNavigation('next')}
              disabled={currentIndex >= testimonials.length - 1}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full border border-cyan-400 flex items-center justify-center text-cyan-500 bg-cyan-50/50 hover:bg-cyan-50 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Slider Container - Aligned with page padding */}
      <div className="relative w-full overflow-x-hidden" style={{ paddingBottom: '64px', paddingTop: '16px' }}>
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
              width: 'max-content',
              x: springX
            }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={`${index}-${testimonial.attribution.slice(0, 20)}`}
                className="flex-shrink-0 w-[calc(100vw-3rem)] sm:w-[calc(100vw-4rem)] md:w-[calc(100vw-6rem)] lg:w-[480px]"
                style={{ paddingBottom: '16px' }}
                whileHover={{ 
                  y: -12,
                  scale: 1.02,
                  transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] }
                }}
              >
                {/* Stripe-Style Testimonial Card */}
                <div className="group relative rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_8px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.16),_0_12px_32px_rgba(0,0,0,0.22)] transition-all duration-500 ease-[0.32,0.72,0,1] flex flex-col overflow-hidden h-full select-none" style={{ 
                  backgroundColor: '#FFFFFF', 
                  padding: '40px', 
                  minHeight: '450px',
                  userSelect: 'none',
                  WebkitUserSelect: 'none'
                }}>
                  
                  {/* 1. The Thicker Gradient Accent Bar - Clipped to card's rounded corners */}
                  <div className="absolute top-0 left-0 right-0 h-[7px] bg-gradient-to-r from-[#058A9F] via-[#00B8C0] to-[#00F0F3] transition-all duration-500 group-hover:opacity-100 z-10 rounded-t-2xl"></div>
                  
                  <div className="flex-grow flex flex-col justify-between">
                    {/* 2. Content Hierarchy */}
                    <div className="flex-grow flex flex-col justify-center">
                      <h3 className="text-lg font-normal text-slate-700 leading-relaxed">
                        "{testimonial.quote}"
                      </h3>
                    </div>
                  </div>

                  {/* 3. The Footer Lockup (Stripe Style with Logo) */}
                  <div className="pt-6 border-t border-slate-50 mt-auto">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Institution Logo/Identifier (Grayscale to Color on Hover - Stripe Exact) */}
                        <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center transition-all duration-500 overflow-hidden">
                          {testimonial.logo ? (
                            <Image
                              src={testimonial.logo}
                              alt={testimonial.institution}
                              width={40}
                              height={40}
                              draggable={false}
                              className="object-contain transition-all duration-500 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 pointer-events-none"
                              style={{ filter: 'grayscale(100%)', userSelect: 'none' }}
                            />
                          ) : (
                            <span className="text-xs font-black text-slate-300 group-hover:text-cyan-600 transition-colors duration-500">
                              {testimonial.institutionShort || testimonial.institution.slice(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#002776] mb-1">
                            {testimonial.attribution}
                          </p>
                          <p className="text-xs text-slate-400 font-medium">
                            {testimonial.institution}
                          </p>
                        </div>
                      </div>
                      {/* Minimalist Arrow Link */}
                      <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-300 group-hover:border-cyan-400 group-hover:text-cyan-500 group-hover:bg-cyan-50/50 transition-all duration-300">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
