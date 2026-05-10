import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { articles } from "./data";

export default function News() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <section className="relative py-32 md:py-48 overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/news hero.avif" 
            alt="News Hero Background" 
            fill 
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        </div>
        <div className="container relative z-10 mx-auto px-4 md:px-12 lg:px-24 text-left">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 tracking-tight text-gray-900">
              News & <span className="text-[#F0564A]">Insights</span>
            </h1>
            <p className="text-xl text-gray-600">
              Making Science Click: Insightful Articles for the Biotech Community
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid gap-8">
            {articles.map((article, index) => (
              <Link key={index} href={`/news/${article.slug}`} className="group block">
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
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
