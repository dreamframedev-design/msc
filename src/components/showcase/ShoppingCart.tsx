"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useMotionValueEvent, type MotionValue, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  ArrowRight,
  Snowflake,
  Package,
  AlertCircle,
  TestTube,
  FlaskConical,
  Beaker,
} from "lucide-react";

interface CartItem {
  id: number;
  catalogId: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  storage: string;
  size: string;
  Icon: typeof TestTube;
  accent: string;
}

const initialCartItems: CartItem[] = [
  {
    id: 1,
    catalogId: "11100-1",
    name: "Human IFN Alpha A (2a)",
    category: "Interferon Proteins",
    price: 455.0,
    quantity: 1,
    storage: "-70°C",
    size: "100 µg",
    Icon: TestTube,
    accent: "#F0564A",
  },
  {
    id: 2,
    catalogId: "41100-1",
    name: "Human IFN Alpha ELISA Kit",
    category: "Assay Kits",
    price: 625.0,
    quantity: 2,
    storage: "2-8°C",
    size: "96 wells",
    Icon: FlaskConical,
    accent: "#5BCBD7",
  },
  {
    id: 3,
    catalogId: "21100-2",
    name: "Anti-Human IFN Alpha Antibody",
    category: "Monoclonal Antibodies",
    price: 385.0,
    quantity: 1,
    storage: "-20°C",
    size: "100 µg",
    Icon: Beaker,
    accent: "#F08435",
  },
];

export default function ShoppingCart() {
  const ref = useRef<HTMLDivElement>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  // Scroll-linked storytelling: items populate progressively, total ticks up, checkout glows
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const enter = useTransform(scrollYProgress, [0.08, 0.5], [0, 1], { clamp: true });

  // How many items are "visible" (populated) based on scroll progress.
  // 0–0.25 → 1 item, 0.25–0.5 → 2 items, 0.5–0.75 → 3 items, etc.
  const visibleCount = useMotionValue(0);
  const [vc, setVc] = useState(0);
  useMotionValueEvent(enter, "change", (v) => {
    const step = 1 / initialCartItems.length;
    const count = Math.min(initialCartItems.length, Math.floor(v / step) + 1);
    const clamped = v < 0.02 ? 0 : count;
    visibleCount.set(clamped);
    setVc(clamped);
  });

  // Visible items based on scroll progress
  const visibleItems = cartItems.slice(0, vc);
  const subtotal = visibleItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const coldChainShipping = vc > 0 ? 45.0 : 0;
  const total = subtotal + coldChainShipping;
  const totalQty = visibleItems.reduce((a, i) => a + i.quantity, 0);

  // Smooth animated total
  const animatedTotal = useTransform(enter, (v) => {
    const allVisibleTotal = cartItems.reduce((a, i) => a + i.price * i.quantity, 0) + 45;
    const eased = Math.min(1, v * 1.3);
    return (allVisibleTotal * eased).toFixed(2);
  });
  const animatedSubtotal = useTransform(enter, (v) => {
    const allSubtotal = cartItems.reduce((a, i) => a + i.price * i.quantity, 0);
    const eased = Math.min(1, v * 1.3);
    return (allSubtotal * eased).toFixed(2);
  });
  const animatedShipping = useTransform<number, string>(enter, (v) => (v > 0.05 ? "45.00" : "0.00"));

  // Checkout button glow ramps up at the end of the scroll
  const checkoutGlow = useTransform(enter, [0.75, 1], [0, 1], { clamp: true });

  const updateQty = (id: number, delta: number) => {
    setCartItems((items) =>
      items.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i))
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((i) => i.id !== id));
  };

  // Only show empty-state when the user manually removed everything (not at scroll-start)
  if (cartItems.length === 0 && vc > 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gray-50 flex items-center justify-center">
          <Package className="w-7 h-7 text-gray-300" />
        </div>
        <p className="text-eyebrow text-[#F0564A] mb-2">Your Cart</p>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Cart is empty</h3>
        <button
          onClick={() => setCartItems(initialCartItems)}
          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-[#F0564A] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-[0.15em] transition-colors"
        >
          Reset Demo
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div ref={ref} className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      {/* ============ HEADER STRIP ============ */}
      <div className="px-5 sm:px-7 py-4 sm:py-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F0564A] animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-[#5BCBD7]">
              ▣ PRECISION ORDER · LIVE
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-heading font-bold text-gray-900 tracking-tight">
            Cart <span className="text-gray-400 font-light">/ {totalQty} items</span>
          </h3>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Secure Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-px bg-gray-100/60">
        {/* ============ ITEMS COLUMN ============ */}
        <div className="lg:col-span-7 bg-white">
          <AnimatePresence initial={false}>
            {visibleItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30, height: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative flex items-center gap-3 sm:gap-4 px-5 sm:px-7 py-4 sm:py-5 ${
                  idx !== visibleItems.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                {/* Icon tile */}
                <div
                  className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center"
                  style={{
                    background: `${item.accent}12`,
                    color: item.accent,
                    boxShadow: `inset 0 0 0 1px ${item.accent}28`,
                  }}
                >
                  <item.Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.14em]"
                      style={{ color: item.accent }}
                    >
                      {item.category}
                    </span>
                    <span className="text-gray-300 text-[10px]">·</span>
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                      #{item.catalogId}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-gray-900 leading-tight truncate group-hover:text-[#F0564A] transition-colors">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                      <Snowflake className="w-3 h-3 text-cyan-500" /> {item.storage}
                    </span>
                    <span className="text-gray-300 text-[10px]">·</span>
                    <span className="text-[10px] text-gray-500 font-medium">{item.size}</span>
                    <span className="text-gray-300 text-[10px]">·</span>
                    <span className="text-[10px] font-mono text-gray-400">${item.price.toFixed(2)}/unit</span>
                  </div>
                </div>

                {/* Stepper */}
                <div className="hidden sm:flex items-center gap-0 bg-gray-50 rounded-full border border-gray-100 px-1 py-1">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    disabled={item.quantity <= 1}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-white hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Decrease"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-7 text-center text-xs font-bold font-mono text-gray-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-white hover:text-gray-900 transition-colors"
                    aria-label="Increase"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Price */}
                <div className="text-right shrink-0">
                  <p className="text-sm sm:text-base font-bold text-gray-900 font-mono tabular-nums">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="mt-0.5 inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-gray-300 hover:text-red-500 uppercase tracking-wider transition-colors"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>

                {/* Mobile stepper row */}
                <div className="sm:hidden absolute right-5 -bottom-3 flex items-center gap-0 bg-white rounded-full border border-gray-200 shadow-sm px-1 py-1">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    disabled={item.quantity <= 1}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 disabled:opacity-30"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-[11px] font-bold font-mono text-gray-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ============ SUMMARY COLUMN ============ */}
        <div className="lg:col-span-5 bg-gradient-to-b from-gray-50/60 to-white p-5 sm:p-7">
          <div className="text-eyebrow text-[#F0564A] mb-4">Order Summary</div>

          <div className="space-y-3 mb-5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-bold text-gray-900 font-mono tabular-nums">
                $<motion.span>{animatedSubtotal}</motion.span>
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 inline-flex items-center gap-1.5">
                Cold Chain <Truck className="w-3.5 h-3.5 text-cyan-500" />
              </span>
              <span className="font-bold text-gray-900 font-mono tabular-nums">
                $<motion.span>{animatedShipping}</motion.span>
              </span>
            </div>
          </div>

          {/* Cold chain note (compact) */}
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-amber-50/60 border border-amber-100 mb-5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-700 leading-snug">
              Temperature-sensitive products ship via specialized cold-chain logistics.
            </p>
          </div>

          {/* Total — ticks up with scroll */}
          <div className="flex items-baseline justify-between pt-4 border-t border-gray-200">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-[0.15em]">Estimated total</span>
            <span className="text-2xl sm:text-3xl font-bold text-gray-900 font-mono tabular-nums">
              $<motion.span>{animatedTotal}</motion.span>
            </span>
          </div>

          {/* Checkout button — glows when scroll completes */}
          <motion.button
            className="group relative mt-5 w-full inline-flex items-center justify-center gap-2 bg-[#F0564A] hover:bg-[#D94D42] text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] transition-colors overflow-hidden"
            style={{
              boxShadow: useTransform(
                checkoutGlow,
                [0, 1],
                ["0 4px 14px rgba(240,86,74,0.35)", "0 0 0 3px rgba(240,86,74,0.4), 0 8px 32px rgba(240,86,74,0.65)"]
              ),
              scale: useTransform(checkoutGlow, [0, 1], [1, 1.02]),
            }}
          >
            {/* Shimmer pass when fully highlighted */}
            <motion.span
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-[-20deg]"
              style={{
                opacity: checkoutGlow,
              }}
              animate={{ x: ["-150%", "350%"] }}
              transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
            />
            <span className="relative">Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 relative" />
          </motion.button>
          <button className="mt-2 w-full text-center text-[11px] font-bold text-gray-500 hover:text-gray-900 uppercase tracking-[0.12em] py-2 transition-colors">
            Request a Quote Instead
          </button>

          {/* Need help — inline, compact */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-[#F0564A] shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-500 leading-relaxed">
              <span className="font-bold text-gray-900">Need help?</span> Our scientists can advise on product selection.{" "}
              <span className="font-bold text-[#F0564A] hover:text-[#D94D42] cursor-pointer transition-colors">
                Contact us →
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
