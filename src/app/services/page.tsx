"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function Services() {
  const services = [
    {
      title: "Compelling Corporate Messaging",
      description: "Every great company starts with a great story, and at Mighty Spark, we're experts in telling yours. We analyze your science and craft clear, impactful messaging. This differentiation becomes the heart of your communication strategy, ensuring you speak with clarity, confidence, and impact to investors and pharma partners.",
      icon: "💬"
    },
    {
      title: "Biotech Pitch Decks with Punch",
      description: "Let&apos;s be honest - VCs and pharma partners see a lot of pitch decks. You want yours to stand out, and we make sure it does. Using your differentiated corporate narrative as a foundation, we build decks that leave no audience behind. We simplify complex science into visuals that connect, and with our brand expertise, your pitch will be memorable for all the right reasons.",
      icon: "📊"
    },
    {
      title: "Custom Websites",
      description: "Your website is often the first impression investors and partners get of your company. It needs to do more than look good - it needs to tell your story. We create user experiences that are captivating, memorable, and engaging so your audience keeps coming back for more. Think of it as the ultimate stage for your biotech innovation.",
      icon: "💻"
    },
    {
      title: "Scientific Illustration",
      description: "Science is complicated. We make it beautiful. Our skilled illustrators and designers craft visuals that not only captivate but are scientifically precise, ensuring your audience clearly understands even the most complex concepts.",
      icon: "🧬"
    },
    {
      title: "Strategic Biotech Public Relations",
      description: "You've got a powerful story - now let's get it heard. We amplify the voices of pre-clinical and early-clinical biotech companies with tailored public relations strategies. From press releases to media outreach, we engage the right audiences with your vision and keep them inspired.",
      icon: "📢"
    },
    {
      title: "Tactical Social Media Management",
      description: "Your social media is your news channel to the world, and we make it shine. Our social media experts design posts that engage, excite, and drive your vision forward. Stay top-of-mind with your audience and keep them coming back for more.",
      icon: "📱"
    },
    {
      title: "Strategic Marketing for Service Providers",
      description: "Effective campaigns captivate attention and increase revenue. MSC designs end-to-end marketing strategies that build brand loyalty and fuel sustainable growth for results you can measure.",
      icon: "📈"
    },
    {
      title: "Email Marketing Campaigns",
      description: "We craft compelling content, manage campaign execution, and optimize performance to ensure your message reaches the right audience at the right time to drive engagement. Whether you're nurturing investor relationships or generating leads, our strategic approach transforms email into a powerful business development tool.",
      icon: "✉️"
    },
    {
      title: "SEO Strategy & Optimization",
      description: "Our SEO services go beyond keywords, integrating technical expertise with content strategy to boost visibility, and credibility. From foundational optimization to advanced strategies that drive business development, we ensure your site ranks where it matters and attracts the right partners, investors, and customers.",
      icon: "🔍"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-[#0A0A0A] text-white">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image 
            src="/images/projection hero_edited.jpg" 
            alt="Services Background" 
            fill 
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/50 via-[#0A0A0A]/80 to-[#0A0A0A]" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 tracking-tight">
            Our <span className="text-[#F0564A]">Services</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
            Want to catch the eye of investors, partners and patients? We've got you covered. From powerful pitch decks to unique websites, to scroll-stopping social media and stunning scientific illustrations, we make sure your message gets noticed and remembered.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-gray-100 overflow-hidden bg-gray-50/50 hover:bg-white">
                <CardContent className="p-8">
                  <div className="text-4xl mb-6">{service.icon}</div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-[#F0564A] transition-colors">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden border-t border-gray-100">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/flowsaber_minimal_simple_opening_photorealistic_cinematic_shot__42eeffda-30d1-41a4-8f73-c49a4ac32608.png" 
            alt="Explore Bundles Background" 
            fill 
            className="object-cover"
          />
          {/* Slight white overlay on the left fading to transparent on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent" />
        </div>
        <div className="container relative z-10 mx-auto px-4 max-w-3xl ml-0 md:ml-12 lg:ml-24 text-left">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-gray-900">Explore Bundles</h2>
          <p className="text-xl text-gray-800 mb-8 leading-relaxed font-medium">
            Want to maximize your impact? Check out our Bundles page for curated packages that combine our services at special rates, designed to help your biotech brand thrive. More services mean more value!
          </p>
          <Button size="lg" className="bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-full px-8" onClick={() => window.location.href = '/bundles'}>
            View Bundles <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
