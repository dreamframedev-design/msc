import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function Bundles() {
  const bundles = [
    {
      title: "Upgrade from the 90's",
      subtitle: "Messaging + Website Refresh",
      description: "Does your website have that 'built by my brother-in-law feel'? If so, this package is for you. Razor sharp messaging combined with stunning visuals will leave no visitor unimpressed.",
      features: ["Messaging Strategy", "Website Refresh", "Visual Overhaul"],
      popular: false
    },
    {
      title: "Ready to Impress",
      subtitle: "Messaging + Deck Refresh",
      description: "Are investors looking at your deck and going 'Meh'. Time to test drive our ready to impress package. Laser focused messaging rolled out into a memorable deck.",
      features: ["Messaging Strategy", "Corporate Deck Refresh", "Visual Overhaul"],
      popular: false
    },
    {
      title: "Get Deals Done",
      subtitle: "Messaging + Website Refresh + Deck Refresh",
      description: "Ready to get deals done? Then do it right with this package. We will make sure your fresh message is rolled into both your deck and your website. MSC will help you seal the deal.",
      features: ["Messaging Strategy", "Website Refresh", "Corporate Deck Refresh"],
      popular: false
    },
    {
      title: "Sell More Services",
      subtitle: "Email campaigns + Social + Advertising",
      description: "Want to speak to your target audience? Let's start with the basics and get your message amplified. Warning! Your BD team may be inundated with calls.",
      features: ["Email Campaigns", "Social Media Management", "Advertising Strategy"],
      popular: false
    },
    {
      title: "Stop Shouting into the Void",
      subtitle: "Messaging + Website Refresh + Deck Refresh + PR",
      description: "Tired of feeling like the world doesn't care? Let's fix that with our PR package. It's not just splashy headlines, we are your strategic partner in getting PR done right.",
      features: ["Messaging Strategy", "Website Refresh", "Corporate Deck Refresh", "Public Relations"],
      popular: false
    },
    {
      title: "The Ultimate Experience",
      subtitle: "Messaging + Website Refresh + Deck Refresh + PR + Social",
      description: "Are you the type of person who wants it all? Stay focused on what matters most and let us handle all your comms needs. Most PR agencies can't dive deep on the science like we can. Get the MSC advantage.",
      features: ["Messaging Strategy", "Website Refresh", "Corporate Deck Refresh", "Public Relations", "Social Media"],
      popular: true
    },
    {
      title: "Grab More Market Share",
      subtitle: "Email campaigns + Social + Advertising + Website Management + SEO",
      description: "Make sure you are front of mind when consumers shop for your services. Build your brand recognition with this ultimate bundle, and get the revenue increases you dream about. Add a website upgrade to this bundle and receive an additional discount!",
      features: ["Email Campaigns", "Social Media", "Advertising", "Website Management", "SEO Strategy"],
      popular: false
    },
    {
      title: "From Stealth to Spotlight",
      subtitle: "Brand Kit + Website + SEO + Messaging + Deck + PR + Social",
      description: "Your science has been in stealth mode, but now it's time to step into the spotlight. We'll craft your brand from the ground up, build a polished presence, and ensure your debut commands attention - with the option of keeping your message going strong long after launch.",
      features: ["Brand Kit", "Website Design", "SEO Optimization", "Messaging Strategy", "Corporate Deck", "Launch PR", "Social Media Setup"],
      popular: false
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <section className="relative pt-40 pb-24 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/female ceo hero.avif" 
            alt="Female CEO" 
            fill 
            className="object-cover object-top opacity-30 mix-blend-luminosity"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/50 via-[#0A0A0A]/80 to-[#0A0A0A]" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#F0564A]/10 rounded-full blur-[150px] pointer-events-none" />
        </div>
        <div className="container relative z-10 mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#F0564A] animate-pulse" />
            Strategic Packages
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-8 tracking-tight">
            Service <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F0564A] to-orange-400">Bundles</span>
          </h1>
          <p className="text-2xl text-gray-400 mb-8 leading-relaxed font-light">
            Who doesn't love a good deal! Choose from one of our bundles of services or create your own custom package.
          </p>
          <div className="inline-block bg-[#111111] border border-white/10 rounded-2xl px-8 py-4 shadow-2xl">
            <p className="text-xl font-bold text-white tracking-wide">
              More Services = <span className="text-[#F0564A]">Better Deals</span>
            </p>
          </div>
        </div>
      </section>

      {/* Pricing/Bundles List */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 max-w-5xl space-y-8">
          {bundles.map((bundle, index) => (
            <div 
              key={index} 
              className={`group relative bg-[#111111] rounded-[2rem] p-8 md:p-12 overflow-hidden transition-all duration-500 ${
                bundle.popular 
                  ? 'border border-[#F0564A]/50 shadow-[0_0_40px_rgba(240,86,74,0.1)] hover:shadow-[0_0_60px_rgba(240,86,74,0.2)]' 
                  : 'border border-white/5 hover:border-white/20 shadow-2xl hover:bg-[#151515]'
              }`}
            >
              {/* Hover Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${bundle.popular ? 'from-[#F0564A]/10' : 'from-white/5'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10 grid md:grid-cols-12 gap-12 items-center">
                
                {/* Left Column: Content */}
                <div className="md:col-span-7 space-y-6">
                  {bundle.popular && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0564A]/10 border border-[#F0564A]/20 text-xs font-bold text-[#F0564A] uppercase tracking-wider">
                      ★ Our Most Popular Package
                    </div>
                  )}
                  <div>
                    <h3 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3 group-hover:text-[#F0564A] transition-colors">
                      {bundle.title}
                    </h3>
                    <p className="text-lg font-medium text-gray-400">
                      {bundle.subtitle}
                    </p>
                  </div>
                  <p className="text-lg text-gray-400 leading-relaxed">
                    {bundle.description}
                  </p>
                </div>

                {/* Right Column: Features & CTA */}
                <div className="md:col-span-5 flex flex-col h-full justify-between space-y-8 bg-black/20 p-6 md:p-8 rounded-3xl border border-white/5">
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">What's Included</h4>
                    {bundle.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className={`w-5 h-5 shrink-0 ${bundle.popular ? 'text-[#F0564A]' : 'text-gray-500 group-hover:text-white transition-colors'}`} />
                        <span className="text-base text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    size="lg" 
                    className={`w-full rounded-full text-lg font-bold py-6 transition-all duration-300 ${
                      bundle.popular 
                        ? 'bg-[#F0564A] hover:bg-[#D94D42] text-white shadow-[0_0_20px_rgba(240,86,74,0.3)] hover:shadow-[0_0_30px_rgba(240,86,74,0.5)]' 
                        : 'bg-white text-black hover:bg-gray-200'
                    }`}
                  >
                    Get Started
                  </Button>
                </div>

              </div>
            </div>
          ))}

          {/* Custom Quote Card */}
          <div className="relative bg-gradient-to-br from-[#F0564A] to-orange-600 rounded-[2rem] p-1 md:p-1 overflow-hidden transition-all duration-500 hover:scale-[1.01] shadow-[0_0_40px_rgba(240,86,74,0.2)] mt-16">
            <div className="bg-[#0A0A0A] rounded-[1.8rem] p-12 md:p-16 text-center relative overflow-hidden h-full flex flex-col items-center justify-center">
              <div className="absolute inset-0 bg-[url('/images/MSC%20LOGO%20BITTERSWEET%20VECTOR%20(1).svg')] opacity-[0.03] bg-repeat bg-[length:100px_100px]" />
              <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                <h3 className="text-4xl md:text-5xl font-heading font-bold text-white">Need Something Custom?</h3>
                <p className="text-xl text-gray-400 leading-relaxed font-light">
                  We recognize that companies within the biotech ecosystem have wildly different needs when it comes to communication, and we are here to help. Contact us to build a package tailored specifically to your goals.
                </p>
                <Button size="lg" className="bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-full px-12 py-6 text-lg font-bold shadow-[0_0_30px_rgba(240,86,74,0.3)]">
                  Request a Custom Quote
                </Button>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
