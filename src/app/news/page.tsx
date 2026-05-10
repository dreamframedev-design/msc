import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function News() {
  const articles = [
    {
      title: "Why Biotech Companies Need Professional Communications Services in 2025",
      excerpt: "In 2025, the biotech industry will be more competitive and more communicative than ever before. Scientific innovation is thriving, but...",
      date: "Mar 22, 2025",
      readTime: "2 min read"
    },
    {
      title: "Top Biotech Communication Pitfalls (and How Our Services Prevent Them)",
      excerpt: "The biotech industry is complex, fast-moving, and highly competitive. Yet, many companies struggle with ineffective communication that...",
      date: "Feb 5, 2025",
      readTime: "3 min read"
    },
    {
      title: "Key Themes and Trends from JP Morgan Healthcare Conference 2025",
      excerpt: "This year's conference highlighted several significant themes shaping the healthcare landscape: Artificial Intelligence (AI) Integration...",
      date: "Feb 5, 2025",
      readTime: "2 min read"
    },
    {
      title: "Why Biotech CEOs Can't Afford to Ignore LinkedIn Anymore",
      excerpt: "Let's face it: biotech hasn't exactly been the early adopter when it comes to LinkedIn. While tech founders and business leaders have...",
      date: "Nov 19, 2024",
      readTime: "3 min read"
    },
    {
      title: "The Power of Precision: Why Excellent Scientific Illustrations Matter in Biotech Communications",
      excerpt: "In the fast-paced world of biotech, where innovation happens at the intersection of science and technology, clear communication is...",
      date: "Oct 14, 2024",
      readTime: "3 min read"
    },
    {
      title: "Step-By-Step Guide: The Secrets to Nailing Your Biotech Corporate Deck",
      excerpt: "One thing I hear all the time from CEOs is that they know they need to invest the time to make a really compelling corporate deck, but...",
      date: "Oct 3, 2024",
      readTime: "3 min read"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <section className="relative py-32 md:py-48 overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image 
            src="/images/news hero.avif" 
            alt="News Hero Background" 
            fill 
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/80 to-white" />
        </div>
        <div className="container relative z-10 mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 tracking-tight text-gray-900">
            News & <span className="text-[#F0564A]">Insights</span>
          </h1>
          <p className="text-xl text-gray-600">
            Making Science Click: Insightful Articles for the Biotech Community
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid gap-8">
            {articles.map((article, index) => (
              <a key={index} href="#" className="group block">
                <Card className="border-gray-200 hover:border-[#F0564A]/30 hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
                  <CardContent className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                    <div className="flex-grow">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span className="font-medium text-[#F0564A]">{article.date}</span>
                        <span>•</span>
                        <span>{article.readTime}</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-[#F0564A] transition-colors">
                        {article.title}
                      </h2>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {article.excerpt}
                      </p>
                    </div>
                    <div className="hidden md:flex flex-shrink-0 w-12 h-12 rounded-full border border-gray-200 items-center justify-center text-gray-400 group-hover:bg-[#F0564A] group-hover:text-white group-hover:border-[#F0564A] transition-all duration-300">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
