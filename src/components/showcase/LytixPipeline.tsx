"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Pipeline data with popout content
const PIPELINE_DATA = [
  {
    id: "ruxo-registrational",
    asset: "Ruxotemitide (LTX-315)",
    assetType: "Oncolytic Peptide",
    study: "Registrational Study",
    indication: "Neoadjuvant resectable melanoma patients",
    combination: "Combination with pembrolizumab",
    progress: 3.0, // 0-4 scale (preclinical=0-1, phase1=1-2, phase2=2-3, phase3=3-4)
    status: null,
    statusType: null,
    partner: null,
    popout: {
      title: "Ruxotemitide (LTX-315)",
      subtitle: "Registrational Study - Neoadjuvant Melanoma",
      copy: `<p>Ruxotemitide is an oncolytic peptide that has consistently delivered strong tumor activity, excellent tolerability and clear systemic immune engagement in Phase 2 trials. As a monotherapy, ruxotemitide enables rapid tumor destruction, robust immune cell infiltration and complete regression in injected tumors. Ruxotemitide also delivers abscopal effects in distant metastases, demonstrating clear systemic immune activation.</p>
<p>In combination with immune checkpoint inhibitors, ruxotemitide affords disease control in patients who had previously failed immune checkpoint inhibitor therapy, indicating the impact ruxotemitide can have on the current standard of care for many cancers in the neoadjuvant setting.</p>`
    }
  },
  {
    id: "ruxo-mono",
    asset: "Ruxotemitide (LTX-315)",
    assetType: "Oncolytic Peptide",
    study: "Monotherapy",
    indication: "Basal cell carcinoma",
    combination: null,
    progress: 2.90,
    status: null,
    statusType: null,
    partner: { name: "Verrica Pharmaceuticals", logo: "/images/verrica-logo.png" },
    popout: {
      title: "Ruxotemitide (LTX-315)",
      subtitle: "Monotherapy - Basal Cell Carcinoma",
      copy: `<p>Verrica Pharmaceuticals has generated impressive Phase 2 data in basal cell carcinoma with ruxotemitide as a monotherapy. They have reported a <strong>51% complete response rate</strong>, and clinical responses in <strong>97% of the patients</strong> with significant reduction of tumor size.</p>
<p>Additionally, Verrica has demonstrated that ruxotemitide reprograms the tumor microenvironment, with patient biopsies showing significant increases in CD4+, CD8+ T cells, and B-cells, indicating strong recruitment of effector immune populations into the tumor.</p>`
    }
  },
  {
    id: "ruxo-neolipa",
    asset: "Ruxotemitide (LTX-315)",
    assetType: "Oncolytic Peptide",
    study: "NeoLIPA",
    indication: "Neoadjuvant resectable melanoma patients",
    combination: "Investigator-initiated study",
    progress: 2.5,
    status: "Currently Recruiting",
    statusType: "recruiting",
    partner: null,
    popout: {
      title: "Ruxotemitide (LTX-315)",
      subtitle: "NeoLIPA Study",
      copy: `<p>Ruxotemitide is currently being evaluated in an investigator-initiated Phase 2 study 'NeoLIPA' in patients with resectable melanoma prior to surgery. This study is exploring neo-adjuvant ruxotemitide (administered before surgery) in combination with standard of care pembrolizumab (KEYTRUDA®).</p>
<p>The objective of this study is to demonstrate that ruxotemitide improves outcomes in these patients and prevents disease recurrence.</p>`
    }
  },
  {
    id: "ltx401",
    asset: "LTX-401",
    assetType: "Oncolytic Molecule",
    study: "Mono-and combination therapy",
    indication: "Solid tumors (deep seated lesions)",
    combination: null,
    progress: 0.85,
    status: "Actively Seeking Partnerships",
    statusType: "seeking",
    partner: null,
    popout: {
      title: "LTX-401",
      subtitle: "Deep-Seated Solid Tumors",
      copy: `<p>LTX-401 is an oncolytic molecule designed for deep-seated tumors.</p>
<p>LTX-401 expands our oncolytic molecule platform into deep-seated tumors through image-guided intratumoral delivery. This opens access to the liver and other internal tumors where intratumoral treatment has historically not been feasible.</p>
<p>LTX-401 has demonstrated strong proof-of-concept in multiple difficult-to-treat cancer models, including curing animals of liver cancer, and is currently in last-stage pre-clinical development.</p>`
    }
  }
];

export default function LytixPipeline() {
  const [selectedItem, setSelectedItem] = useState(PIPELINE_DATA[0]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getProgressWidth = (progress: number) => {
    return Math.max(0, Math.min(4, progress)) / 4 * 100;
  };

  return (
    <div className="bg-slate-50 w-full h-full">
      <div className="relative z-[2]">
        
        {/* Pipeline Interactive Section */}
        <section className="py-12 bg-slate-50">
          <div className="px-4 lg:px-8">
            <div className="grid lg:grid-cols-[320px_1fr] gap-6 items-start">

              {/* Sidebar Detail Pane - Desktop Only */}
              <aside className="hidden lg:block sticky top-24 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl min-h-[480px]">
                {/* Asset Badge */}
                <div className="mb-8">
                  <span className={cn(
                    "badge-shine inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide border",
                    selectedItem.asset.includes("LTX-315")
                      ? "bg-[#F0564A]/10 border-[#F0564A]/30 text-[#F0564A]"
                      : "bg-slate-900/10 border-slate-900/30 text-slate-900"
                  )}>
                    <span className="relative z-10">{selectedItem.assetType}</span>
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-slate-900 mb-3 mt-1 leading-tight">
                  {selectedItem.popout.title}
                </h2>
                <p className="text-sm text-[#F0564A] font-medium mb-8">
                  {selectedItem.popout.subtitle}
                </p>

                {/* Copy */}
                <div
                  className="text-slate-700 text-sm leading-relaxed space-y-4 [&_p]:mb-3 [&_strong]:text-[#F0564A] [&_strong]:font-semibold"
                  dangerouslySetInnerHTML={{ __html: selectedItem.popout.copy }}
                />

                {/* CTA */}
                {selectedItem.id === "ruxo-neolipa" && (
                  <a
                    href="https://clinicaltrials.gov/study/NCT06651151?term=NEOLIPA&rank=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#F0564A] hover:text-[#D94D42] transition-colors"
                  >
                    View on ClinicalTrials.gov
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {selectedItem.id === "ruxo-mono" && (
                  <a
                    href="https://clinicaltrials.gov/study/NCT05188729?term=VP-315&rank=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#F0564A] hover:text-[#D94D42] transition-colors"
                  >
                    View Verrica Study
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </aside>

              {/* Pipeline Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-[minmax(0,1.2fr)_minmax(0,1.5fr)_minmax(0,3.5fr)_minmax(0,1fr)] gap-4 px-5 pt-6 pb-5 bg-slate-900 text-white text-[10px] lg:text-xs font-bold uppercase tracking-wider items-end">
                  <div className="pb-1">Study</div>
                  <div className="pb-1">Indication</div>
                  <div className="grid grid-cols-4 text-center w-full gap-x-1 pt-4 min-h-[3rem] items-end">
                    <span className="pb-1">Pre-clinical</span>
                    <span className="pb-1">Phase I</span>
                    <span className="pb-1">Phase II</span>
                    <span className="pb-1">Phase III</span>
                  </div>
                  <div className="text-center pb-1">Partner / Status</div>
                </div>

                {/* Ruxotemitide Section Header */}
                <div className="px-5 py-4 bg-gradient-to-r from-[#F0564A]/10 to-orange-400/5 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#F0564A] relative">
                      <span className="absolute inset-0 rounded-full bg-[#F0564A] animate-ping opacity-40" />
                    </div>
                    <span className="font-bold text-lg text-[#F0564A]">Ruxotemitide (LTX-315)</span>
                    <span className="text-sm text-slate-600">- Oncolytic peptide for superficial tumors</span>
                  </div>
                </div>

                {/* Ruxotemitide Rows */}
                {PIPELINE_DATA.filter(d => d.asset.includes("LTX-315")).map((item, index) => (
                  <PipelineRow
                    key={item.id}
                    item={item}
                    isSelected={selectedItem.id === item.id}
                    isHovered={hoveredId === item.id}
                    animationIndex={index}
                    onHover={() => {
                      setHoveredId(item.id);
                      setSelectedItem(item);
                    }}
                    onLeave={() => setHoveredId(null)}
                    onClick={() => setSelectedItem(item)}
                    getProgressWidth={getProgressWidth}
                  />
                ))}

                {/* LTX-401 Section Header */}
                <div className="px-5 py-4 bg-gradient-to-r from-slate-900/10 to-slate-800/5 border-b border-t border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-slate-900 relative">
                      <span className="absolute inset-0 rounded-full bg-slate-900 animate-ping opacity-40" />
                    </div>
                    <span className="font-bold text-lg text-slate-900">LTX-401</span>
                    <span className="text-sm text-slate-600">- Oncolytic molecule for deep-seated tumors</span>
                  </div>
                </div>

                {/* LTX-401 Rows */}
                {PIPELINE_DATA.filter(d => d.asset === "LTX-401").map((item, index) => (
                  <PipelineRow
                    key={item.id}
                    item={item}
                    isSelected={selectedItem.id === item.id}
                    isHovered={hoveredId === item.id}
                    animationIndex={index + 3}
                    onHover={() => {
                      setHoveredId(item.id);
                      setSelectedItem(item);
                    }}
                    onLeave={() => setHoveredId(null)}
                    onClick={() => setSelectedItem(item)}
                    getProgressWidth={getProgressWidth}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// Pipeline Row Component
function PipelineRow({
  item,
  isSelected,
  isHovered,
  onHover,
  onLeave,
  onClick,
  getProgressWidth,
  animationIndex = 0,
}: {
  item: typeof PIPELINE_DATA[0];
  isSelected: boolean;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  getProgressWidth: (p: number) => number;
  animationIndex?: number;
}) {
  return (
    <div className="border-b border-slate-200">
      {/* Main Row Content */}
      <div
        className={cn(
          "grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.5fr)_minmax(0,3.5fr)_minmax(0,1fr)] gap-4 p-5 cursor-pointer transition-all duration-200 relative",
          isSelected && "bg-[#F0564A]/5",
          isHovered && "bg-slate-50",
          isSelected && "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#F0564A]"
        )}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onClick={onClick}
      >
        {/* Asset - Mobile shows full, desktop shows study */}
        <div className="md:hidden mb-2 flex items-center justify-between">
          <span className={cn(
            "badge-shine inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase border",
            item.asset.includes("LTX-315")
              ? "bg-[#F0564A]/10 border-[#F0564A]/20 text-[#F0564A]"
              : "bg-slate-900/10 border-slate-900/20 text-slate-900"
          )}>
            {item.assetType}
          </span>
          {/* Expand indicator for mobile */}
          <ChevronDown className={cn(
            "w-5 h-5 text-slate-500 transition-transform duration-300 lg:hidden",
            isSelected && "rotate-180 text-[#F0564A]"
          )} />
        </div>

        {/* Study Name */}
        <div>
          <p className="font-semibold text-slate-900">{item.study}</p>
          {item.combination && (
            <p className="text-xs text-slate-600 mt-0.5">{item.combination}</p>
          )}
        </div>

        {/* Indication */}
        <div>
          <p className="text-sm text-slate-700">{item.indication}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full">
          {/* Mobile phase labels */}
          <div className="md:hidden flex justify-between text-xs text-slate-500 font-semibold uppercase mb-1">
            <span>Pre</span>
            <span>Ph1</span>
            <span>Ph2</span>
            <span>Ph3</span>
          </div>
          <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden">
            {/* Grid lines */}
            <div className="absolute inset-0 grid grid-cols-4 z-10 pointer-events-none">
              <span className="border-r-2 border-white" />
              <span className="border-r-2 border-white" />
              <span className="border-r-2 border-white" />
              <span />
            </div>
            {/* Progress fill with shine */}
            <div
              className="pipeline-bar-fill absolute left-0 top-0 bottom-0 rounded-full bg-gradient-to-r from-[#F0564A] via-[#F0564A] to-orange-400 z-0 overflow-hidden"
              style={{
                width: `${getProgressWidth(item.progress)}%`,
                animationDelay: `${animationIndex * 0.2}s`
              }}
            >
              <span className="pipeline-shine" style={{ animationDelay: `${1.5 + animationIndex * 0.2}s` }} />
            </div>
          </div>
        </div>

        {/* Partner / Status */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {item.partner && (
            <span className="badge-shine inline-flex items-center justify-center px-4 py-2.5 rounded-full bg-slate-100 text-slate-900 text-xs font-bold border border-slate-200 text-center min-h-[2.75rem]">
              {item.partner.logo ? (
                <img 
                  src={item.partner.logo} 
                  alt={item.partner.name} 
                  className="h-7 sm:h-8 w-auto max-w-[140px] object-contain object-center"
                  title={item.partner.name}
                />
              ) : (
                item.partner.name
              )}
            </span>
          )}
          {item.status && (
            <span className={cn(
              "badge-shine inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-semibold border text-center",
              item.statusType === "seeking" && "bg-red-500/10 text-red-600 border-red-500/20",
              item.statusType === "recruiting" && "bg-orange-400/10 text-slate-900 border-orange-400/30",
              item.statusType === "preparing" && "bg-amber-500/10 text-slate-900 border-amber-500/30"
            )}>
              {item.statusType === "recruiting" && (
                <span className="inline-block w-2 h-2 rounded-full bg-orange-400 mr-1.5 animate-pulse" />
              )}
              {item.status}
            </span>
          )}
        </div>
      </div>

      {/* Mobile/Tablet Accordion Expansion */}
      <div className={cn(
        "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
        isSelected ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-5 pb-5">
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border border-[#F0564A]/20 p-5">
            <h4 className="text-lg font-bold text-slate-900 mb-1">{item.popout.title}</h4>
            <p className="text-sm text-[#F0564A] font-medium mb-3">{item.popout.subtitle}</p>
            <div
              className="text-slate-700 text-sm leading-relaxed [&_p]:mb-2 [&_strong]:text-[#F0564A]"
              dangerouslySetInnerHTML={{ __html: item.popout.copy }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
