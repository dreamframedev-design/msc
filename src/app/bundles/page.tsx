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
      description: "Your science has been in stealth mode, but now it's time to step into the spotlight. We'll craft your brand from the ground up, build a polished presence, and ensure your debut commands attention—with the option of keeping your message going strong long after launch.",
      features: ["Brand Kit", "Website Design", "SEO Optimization", "Messaging Strategy", "Corporate Deck", "Launch PR", "Social Media Setup"],
      popular: false
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <section className="relative py-32 overflow-hidden bg-[#0A0A0A] text-white">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/female ceo hero.avif" 
            alt="Female CEO" 
            fill 
            className="object-cover object-top opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/50 via-[#0A0A0A]/80 to-[#0A0A0A]" />
        </div>
        <div className="container relative z-10 mx-auto px-4 max-w-3xl text-center">
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 tracking-tight">
            Service <span className="text-[#F0564A]">Bundles</span>
          </h1>
          <p className="text-xl text-gray-300 mb-4 leading-relaxed">
            Who doesn't love a good deal! Choose from one of our bundles of services or create your own custom package.
          </p>
          <p className="text-lg font-bold text-[#F0564A] tracking-wider uppercase">
            More Services = Better Deals
          </p>
        </div>
      </section>

      {/* Pricing/Bundles Grid */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bundles.map((bundle, index) => (
              <Card key={index} className={`relative flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl ${bundle.popular ? 'border-[#F0564A] shadow-lg scale-105 z-10' : 'border-gray-200'}`}>
                {bundle.popular && (
                  <div className="bg-[#F0564A] text-white text-xs font-bold uppercase tracking-wider text-center py-2">
                    Our Most Popular Package
                  </div>
                )}
                <CardContent className="p-8 flex-grow flex flex-col">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{bundle.title}</h3>
                  <p className="text-sm font-medium text-[#F0564A] mb-6 min-h-[40px]">{bundle.subtitle}</p>
                  <p className="text-gray-600 mb-8 text-sm leading-relaxed flex-grow">
                    {bundle.description}
                  </p>
                  <div className="space-y-3 mb-8">
                    {bundle.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#F0564A] shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className={`w-full ${bundle.popular ? 'bg-[#F0564A] hover:bg-[#D94D42] text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'}`}>
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}

            {/* Custom Quote Card */}
            <Card className="relative flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl border-gray-200 bg-gray-900 text-white">
              <CardContent className="p-8 flex-grow flex flex-col justify-center text-center">
                <h3 className="text-3xl font-bold mb-4">Custom Quotes</h3>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  We recognize that companies within the biotech ecosystem have wildly different needs when it comes to communication, and we are here to help. Contact us for a custom quote.
                </p>
                <Button variant="outline" className="w-full border-white text-gray-900 hover:bg-gray-100">
                  Contact Us
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>
    </div>
  );
}
