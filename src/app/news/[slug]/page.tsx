import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { articles } from "../data";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);
  console.log("Requested slug:", decodedSlug);
  console.log("Available slugs:", articles.map(a => a.slug));
  const article = articles.find((a) => a.slug === decodedSlug);

  if (!article) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] flex items-end pb-12 overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        </div>
        <div className="container relative z-10 mx-auto px-4 md:px-12 lg:px-24">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 text-sm text-white/70 mb-6">
              <span className="font-medium text-[#F0564A]">{article.date}</span>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-white leading-tight">
              {article.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-12 lg:px-24">
          <div className="max-w-3xl mx-auto">
            <article className="prose prose-lg md:prose-xl prose-gray max-w-none">
              {article.content.map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
