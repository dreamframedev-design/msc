'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Truck, 
  Info,
  ArrowRight,
  Snowflake,
  Package,
  AlertCircle
} from 'lucide-react';

// Type definitions
interface CartItem {
  id: number;
  catalogId: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  storage: string;
  size: string;
  image: string;
}

// Mock data for the scientific cart items
const initialCartItems: CartItem[] = [
  {
    id: 1,
    catalogId: '11100-1',
    name: 'Human IFN Alpha A (2a)',
    category: 'Interferon Proteins',
    price: 455.00,
    quantity: 1,
    storage: '-70°C or below',
    size: '100 µg',
    image: '/images/macromolecule.webp'
  },
  {
    id: 2,
    catalogId: '41100-1',
    name: 'Human IFN Alpha ELISA Kit',
    category: 'Assay Kits',
    price: 625.00,
    quantity: 2,
    storage: '2-8°C',
    size: '96 wells',
    image: '/images/macromolecule.webp'
  },
  {
    id: 3,
    catalogId: '21100-2',
    name: 'Anti-Human IFN Alpha Antibody',
    category: 'Monoclonal Antibodies',
    price: 385.00,
    quantity: 1,
    storage: '-20°C',
    size: '100 µg',
    image: '/images/macromolecule.webp'
  }
];

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [removingId, setRemovingId] = useState<number | null>(null);

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const coldChainShipping = 45.00;
  const estimatedTotal = subtotal + coldChainShipping;

  // Update quantity
  const updateQuantity = (id: number, delta: number) => {
    setCartItems(items => 
      items.map(item => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  // Remove item with animation
  const removeItem = (id: number) => {
    setRemovingId(id);
    setTimeout(() => {
      setCartItems(items => items.filter(item => item.id !== id));
      setRemovingId(null);
    }, 300);
  };

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="bg-white py-12 rounded-3xl border border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-8 bg-slate-50 rounded-3xl flex items-center justify-center">
              <Package className="w-12 h-12 text-slate-300" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F0564A] mb-3">Your Cart</p>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">Your cart is empty</h1>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Explore our catalog of high-precision scientific reagents and add products to your cart.
            </p>
            <button 
              onClick={() => setCartItems(initialCartItems)}
              className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.15em] hover:bg-[#F0564A] transition-all shadow-lg shadow-slate-900/20 group"
            >
              Reset Demo
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-12 rounded-3xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F0564A] mb-3">Your Selection</p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Shopping Cart</h1>
          <p className="text-slate-500 mt-3">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your precision order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Cart Items (7/12) */}
          <div className="lg:col-span-7 space-y-6">
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className={`group relative flex flex-col sm:flex-row gap-6 lg:gap-8 p-6 lg:p-8 rounded-3xl border border-slate-100 bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 ${
                  removingId === item.id ? 'opacity-0 scale-95 -translate-x-4' : ''
                }`}
              >
                {/* Product Image Box */}
                <div className="w-full sm:w-32 lg:w-40 h-32 lg:h-40 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-[1.02] flex-shrink-0">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-slate-200 rounded-full animate-pulse" /> {/* Placeholder for image */}
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                        {item.category} <span className="text-[#F0564A]">• CAT #{item.catalogId}</span>
                      </p>
                      <h3 className="text-lg lg:text-xl font-bold text-slate-900 leading-tight group-hover:text-[#F0564A] transition-colors">
                        {item.name}
                      </h3>
                    </div>
                    <p className="text-xl lg:text-2xl font-bold text-slate-900 whitespace-nowrap">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Product Meta Tags */}
                  <div className="flex flex-wrap items-center gap-2 mb-4 lg:mb-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-[10px] font-bold text-slate-500 border border-slate-100">
                      <Snowflake className="w-3 h-3 text-cyan-500" />
                      {item.storage}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-[10px] font-bold text-slate-500 border border-slate-100">
                      <Package className="w-3 h-3 text-slate-400" />
                      {item.size}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      ${item.price.toFixed(2)} / unit
                    </span>
                  </div>

                  {/* Controls Row */}
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
                    {/* Quantity Stepper */}
                    <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-2.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-400 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-5 text-sm font-black text-slate-900 min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-2.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-400 hover:text-slate-900"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Remove Button */}
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-300 hover:text-red-500 transition-colors py-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT COLUMN: Summary Card (5/12) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 lg:p-8 shadow-2xl shadow-slate-200/50">
              <h2 className="text-xl font-bold text-slate-900 mb-6 lg:mb-8">Order Summary</h2>
              
              {/* Line Items */}
              <div className="space-y-4 mb-6 lg:mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal ({cartItems.reduce((a, i) => a + i.quantity, 0)} items)</span>
                  <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Cold Chain Shipping</span>
                    <Truck className="w-3.5 h-3.5 text-cyan-500" />
                  </div>
                  <span className="font-bold text-slate-900">${coldChainShipping.toFixed(2)}</span>
                </div>

                {/* Shipping Note */}
                <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50/50 border border-amber-100">
                  <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-700 leading-relaxed">
                    Temperature-sensitive materials require specialized cold chain logistics for safe transport.
                  </p>
                </div>

                {/* Divider & Total */}
                <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="text-lg font-bold text-slate-900">Estimated Total</span>
                  <span className="text-2xl lg:text-3xl font-black text-slate-900">${estimatedTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-4 lg:py-5 rounded-2xl text-xs font-black uppercase tracking-[0.15em] hover:bg-[#F0564A] transition-all shadow-lg shadow-slate-900/20 mb-4 lg:mb-6 group"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              {/* Request Quote Alternative */}
              <button className="w-full flex items-center justify-center gap-2 bg-slate-50 text-slate-900 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.1em] hover:bg-slate-100 transition-all border border-slate-100 mb-6">
                Request a Quote Instead
              </button>

              {/* Trust Indicators */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <ShieldCheck className="w-5 h-5 text-cyan-600 flex-shrink-0" />
                  <p className="text-[10px] font-bold text-slate-500 leading-snug uppercase tracking-tight">
                    Secure encrypted checkout via Stripe
                  </p>
                </div>
                
                <p className="text-[9px] text-center text-slate-400 leading-relaxed uppercase tracking-[0.1em] px-4">
                  Tax and final shipping calculated at checkout based on delivery laboratory location.
                </p>
              </div>
            </div>

            {/* Need Help Card */}
            <div className="mt-6 p-5 rounded-2xl border border-slate-100 bg-slate-50/50">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#F0564A] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-900 mb-1">Need assistance?</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-2">
                    Our scientists can help with product selection and technical questions.
                  </p>
                  <span className="text-[10px] font-bold text-[#F0564A] hover:text-[#D94D42] uppercase tracking-[0.1em] transition-colors cursor-pointer">
                    Contact Us →
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
