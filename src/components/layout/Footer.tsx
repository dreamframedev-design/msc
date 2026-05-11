"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const mscText = "MSC";
  
  if (pathname?.startsWith('/portal')) {
    return null;
  }
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -90,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <footer className="relative bg-gray-50 text-gray-600 border-t border-gray-200 pt-20 pb-10 overflow-hidden z-20">
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/flowsaber_a_minimal_abstract_translucent_chemical_pattern_desig_a6ae47e5-6f5f-4a06-8865-ca10fd46f28a.png" 
          alt="Footer Background" 
          fill 
          className="object-cover opacity-10"
        />
      </div>
      <div className="container relative z-10 mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <Image 
                src="/images/MSC LOGO BITTERSWEET VECTOR (1).svg" 
                alt="Mighty Spark Communications" 
                width={50} 
                height={50} 
                className="object-contain group-hover:scale-105 transition-transform"
              />
              <motion.div
                className="flex perspective-[1000px]"
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                {mscText.split("").map((letter, index) => (
                  <motion.span
                    key={index}
                    variants={child}
                    className="font-heading font-light text-3xl tracking-tight text-gray-900 group-hover:text-[#F0564A] transition-colors inline-block origin-bottom"
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.div>
            </Link>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              Making Science Click. We amplify the voices of pre-clinical and clinical biotech companies, transforming complex science into compelling corporate messaging.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-[#F0564A] hover:text-white transition-colors text-gray-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="space-y-6">
            <h3 className="text-gray-900 font-semibold tracking-wide">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-[#F0564A] transition-colors">About Us</Link></li>
              <li><Link href="/portfolio" className="hover:text-[#F0564A] transition-colors">Portfolio</Link></li>
              <li><Link href="/news" className="hover:text-[#F0564A] transition-colors">News & Insights</Link></li>
              <li><Link href="/contact" className="hover:text-[#F0564A] transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-gray-900 font-semibold tracking-wide">Services</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/services" className="hover:text-[#F0564A] transition-colors">Corporate Messaging</Link></li>
              <li><Link href="/services" className="hover:text-[#F0564A] transition-colors">Biotech Pitch Decks</Link></li>
              <li><Link href="/services" className="hover:text-[#F0564A] transition-colors">Custom Websites</Link></li>
              <li><Link href="/services" className="hover:text-[#F0564A] transition-colors">Scientific Illustration</Link></li>
              <li><Link href="/services" className="hover:text-[#F0564A] transition-colors">Public Relations</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-gray-900 font-semibold tracking-wide">Products</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/bundles" className="hover:text-[#F0564A] transition-colors">Service Bundles</Link></li>
              <li><Link href="/spark-time" className="hover:text-[#F0564A] transition-colors">Spark Time! Podcast</Link></li>
              <li><Link href="/portal" className="text-[#F0564A] hover:text-[#D94D42] transition-colors font-medium">Client Portal</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-gray-900 font-semibold tracking-wide">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="mailto:info@mightysparkcommunications.com" className="hover:text-[#F0564A] transition-colors">info@mightysparkcommunications.com</a></li>
              <li className="text-gray-500">San Diego</li>
              <li className="text-gray-500">Los Angeles</li>
              <li className="text-gray-500">Pittsburgh</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Mighty Spark Communications. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
            <Link href="/cookies-policy" className="hover:text-gray-900 transition-colors">Cookies Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
