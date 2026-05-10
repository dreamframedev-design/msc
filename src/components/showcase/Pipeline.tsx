"use client";

import { useEffect, useState, useRef } from "react";

interface PipelineStage {
  stage: string;
  status: "completed" | "active" | "upcoming";
  description: string;
}

const stages: PipelineStage[] = [
  {
    stage: "Discovery",
    status: "completed",
    description: "Target identification and compound screening",
  },
  {
    stage: "Pre-Clinical",
    status: "completed",
    description: "In vitro and animal model validation",
  },
  {
    stage: "Phase I",
    status: "completed",
    description: "Safety and tolerability studies",
  },
  {
    stage: "Phase II",
    status: "active",
    description: "Efficacy and dose optimization (Now Enrolling)",
  },
  {
    stage: "Phase III",
    status: "upcoming",
    description: "Large-scale efficacy trials",
  },
  {
    stage: "Regulatory",
    status: "upcoming",
    description: "FDA submission and approval",
  },
];

// Typewriter effect component
function TypewriterText({ text, delay = 0, trigger = false }: { text: string; delay?: number; trigger?: boolean }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!trigger) {
      setDisplayedText("");
      setIsTyping(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsTyping(true);
      let currentIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
        }
      }, 90); // Typing speed - 90ms per character (slightly slower to sync with checkmarks)

      return () => clearInterval(typeInterval);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [text, delay, trigger]);

  return (
    <span className="inline-block">
      {displayedText}
      {isTyping && <span className="inline-block w-0.5 h-6 bg-[#F0564A] ml-1 animate-pulse align-middle">|</span>}
    </span>
  );
}

export default function Pipeline() {
  const [isVisible, setIsVisible] = useState(false);
  const [checkedStages, setCheckedStages] = useState<number[]>([]);
  const [typingStages, setTypingStages] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          // Animate checkmarks sequentially, then trigger typing
          const completedStages = stages
            .map((stage, idx) => (stage.status === "completed" ? idx : -1))
            .filter(idx => idx !== -1);

          completedStages.forEach((stageIndex, idx) => {
            // Checkmark appears first, typing starts shortly after so checkmark can complete
            setTimeout(() => {
              setCheckedStages(prev => [...prev, stageIndex]);
              // Start typing after checkmark has time to appear and start drawing
              setTimeout(() => {
                setTypingStages(prev => [...prev, stageIndex]);
              }, 150); // Give checkmark 150ms to appear before typing starts
            }, idx * 400 + 200); // 400ms between each stage (much faster)
          });

          // For active and upcoming stages, show them after completed ones
          const activeAndUpcoming = stages
            .map((stage, idx) => (stage.status === "active" || stage.status === "upcoming" ? idx : -1))
            .filter(idx => idx !== -1);

          activeAndUpcoming.forEach((stageIndex, idx) => {
            setTimeout(() => {
              setTypingStages(prev => [...prev, stageIndex]);
            }, completedStages.length * 400 + 200 + (idx * 400));
          });
        } else {
          setIsVisible(false);
          setCheckedStages([]);
          setTypingStages([]);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 hidden lg:block"></div>

      <div className="space-y-8 lg:space-y-12">
        {stages.map((item, index) => {
          const isChecked = checkedStages.includes(index);
          const showCheckmark = item.status === "completed" && isChecked;
          const shouldType = typingStages.includes(index);
          
          // Calculate timing based on stage order
          const checkmarkDelay = item.status === "completed" 
            ? stages.slice(0, index).filter(s => s.status === "completed").length * 400 + 200
            : 0;
          
          const typingDelay = item.status === "completed"
            ? checkmarkDelay + 150 // Start typing 150ms after checkmark appears
            : stages.filter(s => s.status === "completed").length * 400 + 200 + 
              stages.slice(0, index).filter(s => s.status !== "completed").length * 400;
          
          return (
            <div 
              key={index} 
              className="relative flex items-start gap-6 lg:gap-12"
              style={{
                opacity: isVisible ? 1 : 0.3,
                transition: "opacity 0.3s ease-out"
              }}
            >
              {/* Timeline Dot */}
              <div className="relative z-10 flex-shrink-0">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-150 ease-out ${
                    item.status === "completed"
                      ? showCheckmark
                        ? "bg-[#F0564A] border-[#F0564A] text-white shadow-lg shadow-[#F0564A]/30 scale-100"
                        : "bg-white border-slate-300 text-slate-400 scale-90"
                      : item.status === "active"
                      ? shouldType
                        ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/30 scale-100"
                        : "bg-white border-slate-300 text-slate-400 scale-90"
                      : shouldType
                      ? "bg-white border-slate-300 text-slate-400 scale-100"
                      : "bg-white border-slate-300 text-slate-400 scale-90"
                  }`}
                  style={{
                    transitionDelay: `${checkmarkDelay}ms`
                  }}
                >
                  {item.status === "completed" ? (
                    <>
                      {/* Checkmark - only renders when blue circle is active, always white */}
                      {showCheckmark ? (
                        <svg 
                          className="w-8 h-8"
                          fill="none" 
                          stroke="white"
                          viewBox="0 0 24 24"
                          style={{
                            opacity: 1,
                            transform: "scale(1)",
                            transition: "transform 0.15s ease-out",
                            transitionDelay: `${checkmarkDelay + 80}ms`
                          }}
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={3} 
                            stroke="white"
                            d="M5 13l4 4L19 7"
                            style={{
                              strokeDasharray: "20",
                              strokeDashoffset: "0",
                              transition: "stroke-dashoffset 0.2s ease-out",
                              transitionDelay: `${checkmarkDelay + 100}ms`
                            }}
                          />
                        </svg>
                      ) : (
                        <span className="text-lg font-bold text-slate-400">
                          {index + 1}
                        </span>
                      )}
                    </>
                  ) : (
                    <span 
                      className="text-lg font-bold transition-all duration-300"
                      style={{
                        opacity: shouldType ? 1 : 0.5,
                        color: item.status === "active" ? "white" : "#94a3b8"
                      }}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>
                
                {/* Connecting line animation for completed stages */}
                {item.status === "completed" && index < stages.length - 1 && (
                  <div 
                    className="absolute left-1/2 top-16 w-0.5 bg-gradient-to-b from-cool-blue to-slate-200 transition-all duration-500 ease-out"
                    style={{
                      height: showCheckmark ? "3rem" : "0",
                      transitionDelay: `${checkmarkDelay + 500}ms`
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-2">
                <div className="flex items-center gap-3 mb-2 min-h-[2rem]">
                  <h3 className="text-2xl font-bold text-slate-800">
                    {shouldType ? (
                      <TypewriterText 
                        text={item.stage} 
                        delay={0}
                        trigger={shouldType}
                      />
                    ) : (
                      <span className="opacity-30">{item.stage}</span>
                    )}
                  </h3>
                  {item.status === "active" && shouldType && (
                    <span 
                      className="px-3 py-1 rounded-full bg-slate-900/10 text-slate-900 text-xs font-semibold uppercase tracking-wide animate-fadeIn"
                      style={{
                        animation: "fadeInUp 0.5s ease-out 0.3s both"
                      }}
                    >
                      Active
                    </span>
                  )}
                </div>
                <p 
                  className={`text-slate-600 leading-relaxed transition-all duration-500 ${
                    shouldType ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  }`}
                  style={{
                    transitionDelay: shouldType ? `${typingDelay + item.stage.length * 70 + 200}ms` : "0ms"
                  }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

