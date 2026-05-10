"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = isScrolled || isHovered;

    // Determine if we are on a page with a dark hero section and haven't scrolled yet
    const isDarkHero = pathname === '/services' || pathname === '/bundles';
    const isDarkTheme = isDarkHero && !isActive;

  const linkColor = isDarkTheme ? "text-white/90 hover:text-white" : "text-gray-600 hover:text-[#F0564A]";
  const logoColor = isDarkTheme ? "text-white" : "text-gray-900";
  const portalBtnClass = isDarkTheme 
    ? "border-white/30 text-white hover:bg-white hover:text-gray-900" 
    : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <header 
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isActive ? "py-4" : "py-0"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn(
        "mx-auto flex items-center justify-between transition-all duration-300",
        isActive 
          ? "container max-w-6xl h-16 px-6 bg-white/80 backdrop-blur-md border border-gray-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full" 
          : "container h-24 px-4 bg-transparent border-transparent"
      )}>
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible" 
            className="flex items-center gap-2"
          >
            <motion.div variants={itemVariants}>
              <Image 
                src="/images/MSC LOGO BITTERSWEET VECTOR (1).svg" 
                alt="Mighty Spark Communications" 
                width={32} 
                height={32} 
                className="object-contain group-hover:scale-105 transition-transform"
              />
            </motion.div>
            <motion.div className="flex perspective-[1000px]">
              {["M", "S", "C"].map((letter, i) => (
                <motion.span 
                  key={i} 
                  variants={itemVariants} 
                  className={cn("font-heading font-light text-xl tracking-tight transition-colors group-hover:text-[#F0564A]", logoColor)}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </Link>
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="/" className={cn("transition-colors", linkColor)}>Home</Link>
          <Link href="/services" className={cn("transition-colors", linkColor)}>Services</Link>
          <Link href="/about" className={cn("transition-colors", linkColor)}>About</Link>
          <Link href="/bundles" className={cn("transition-colors", linkColor)}>Bundles</Link>
          <Link href="/spark-time" className={cn("transition-colors", linkColor)}>Spark Time!</Link>
          <Link href="/news" className={cn("transition-colors", linkColor)}>News</Link>
          <Link href="/portfolio" className={cn("transition-colors", linkColor)}>Portfolio</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/portal" className={buttonVariants({ variant: "outline", className: cn("hidden md:inline-flex rounded-full transition-colors", portalBtnClass) })}>Client Portal</Link>
          <Link href="/contact" className={buttonVariants({ className: "rounded-full bg-[#F0564A] hover:bg-[#D94D42] text-white shadow-sm hover:shadow-md transition-all" })}>Contact Us</Link>
        </div>
      </div>
    </header>
  );
}
