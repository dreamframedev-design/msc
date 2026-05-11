"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (pathname?.startsWith('/portal/dashboard')) {
    return null;
  }

  const isActive = isScrolled || isHovered || isMobileMenuOpen;

  // Determine if we are on a page with a dark hero section and haven't scrolled yet
  const isDarkHero = pathname === '/services' || pathname === '/bundles' || pathname === '/spark-time' || pathname === '/portal' || pathname === '/about' || pathname === '/news' || pathname?.startsWith('/news/');
  const isDarkTheme = isDarkHero && !isActive;

  const linkColor = isDarkTheme ? "text-white/85 hover:text-white" : "text-gray-600 hover:text-[#F0564A]";
  const logoColor = isDarkTheme ? "text-white" : "text-gray-900";
  const portalBtnClass = isDarkTheme
    ? "bg-white/5 backdrop-blur-md border-white/25 text-white hover:bg-white hover:text-gray-900 hover:border-white"
    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900";

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
        "mx-auto flex items-center justify-between transition-all duration-500 relative",
        isActive
          ? "container max-w-6xl h-16 px-5 sm:px-6 bg-white/85 backdrop-blur-2xl border border-gray-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full"
          : "container h-20 sm:h-24 px-4 sm:px-6 bg-transparent border-transparent"
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
        <nav className="hidden md:flex gap-7 text-sm font-medium">
          {[
            { href: "/", label: "Home" },
            { href: "/services", label: "Services" },
            { href: "/about", label: "About" },
            { href: "/bundles", label: "Bundles" },
            { href: "/spark-time", label: "Spark Time!" },
            { href: "/news", label: "News" },
            { href: "/portfolio", label: "Portfolio" },
          ].map(({ href, label }) => {
            const isCurrent = pathname === href || (href !== "/" && pathname?.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "link-reveal transition-colors relative",
                  linkColor,
                  isCurrent && !isDarkTheme && "text-[#F0564A]",
                  isCurrent && isDarkTheme && "text-white"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/portal" className={buttonVariants({ variant: "outline", className: cn("hidden md:inline-flex rounded-full transition-colors border", portalBtnClass) })}>Client Portal</Link>
          <Link href="/contact" className={buttonVariants({ className: "rounded-full bg-gray-900 hover:bg-black text-white shadow-sm hover:shadow-md transition-all hidden sm:inline-flex" })}>Contact Us</Link>
          
          {/* Mobile Menu Toggle */}
          <button 
            className={cn("md:hidden p-2 -mr-2 transition-colors", linkColor)}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-[calc(100%+1rem)] left-0 right-0 bg-white border border-gray-200 shadow-xl rounded-2xl md:hidden overflow-hidden mx-4"
            >
              <nav className="flex flex-col p-2">
                <Link href="/" className="text-gray-600 hover:text-[#F0564A] font-medium px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">Home</Link>
                <Link href="/services" className="text-gray-600 hover:text-[#F0564A] font-medium px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">Services</Link>
                <Link href="/about" className="text-gray-600 hover:text-[#F0564A] font-medium px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">About</Link>
                <Link href="/bundles" className="text-gray-600 hover:text-[#F0564A] font-medium px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">Bundles</Link>
                <Link href="/spark-time" className="text-gray-600 hover:text-[#F0564A] font-medium px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">Spark Time!</Link>
                <Link href="/news" className="text-gray-600 hover:text-[#F0564A] font-medium px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">News</Link>
                <Link href="/portfolio" className="text-gray-600 hover:text-[#F0564A] font-medium px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">Portfolio</Link>
                <div className="h-px bg-gray-100 my-2 mx-4" />
                <Link href="/portal" className="text-gray-600 hover:text-[#F0564A] font-medium px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">Client Portal</Link>
                <Link href="/contact" className="text-[#F0564A] font-semibold px-4 py-3 rounded-xl hover:bg-red-50 transition-colors sm:hidden">Contact Us</Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
