"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, ShieldCheck, DownloadCloud, Smartphone, Apple } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function OnboardingPage() {
  const [passphrase, setPassphrase] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passphrase === "msc2026") {
      setIsUnlocked(true);
      setError(null);
    } else {
      setError("Incorrect onboarding passphrase.");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: "client",
            company: company.trim() || undefined,
          }
        }
      });

      if (signUpError) throw signUpError;

      setIsSuccess(true);
      
      // Auto-redirect to portal dashboard after 5 seconds
      setTimeout(() => {
        router.push("/portal/dashboard");
      }, 5000);

    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#F0564A]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10 py-12">
        <div className="mb-8">
          <Link href="/">
            <div className="flex items-center gap-3">
              <Image 
                src="/images/MSC LOGO BITTERSWEET VECTOR (1).svg" 
                alt="MSC Logo" 
                width={48} 
                height={48} 
                className="object-contain"
              />
              <div className="flex perspective-[1000px]">
                {["M", "S", "C"].map((letter, i) => (
                  <span key={i} className="font-heading font-light text-3xl tracking-tight text-white">
                    {letter}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </div>

        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <motion.div 
              key="lock"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="w-8 h-8 text-[#F0564A]" />
                </div>
                <h1 className="text-2xl font-heading font-bold mb-2">Secure Onboarding</h1>
                <p className="text-gray-400 text-sm">Enter the passphrase provided by your MSC account manager to create your client account.</p>
              </div>

              <form onSubmit={handleUnlock} className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Input 
                    type="password" 
                    placeholder="Enter Passphrase" 
                    required 
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-[#F0564A] rounded-xl h-12 text-center text-lg"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-xl font-bold transition-all"
                >
                  Unlock Access <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </motion.div>
          ) : !isSuccess ? (
            <motion.div 
              key="signup"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-4xl bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row"
            >
              <div className="lg:w-1/2 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/5">
                <div className="mb-8">
                  <h1 className="text-3xl font-heading font-bold mb-2">Welcome to MSC</h1>
                  <p className="text-gray-400">Let's get your secure portal access configured.</p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-gray-300">Email Address</Label>
                    <Input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-black/50 border-white/10 text-white focus-visible:ring-[#F0564A] rounded-xl h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Company Name</Label>
                    <Input 
                      type="text" 
                      required 
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="bg-black/50 border-white/10 text-white focus-visible:ring-[#F0564A] rounded-xl h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Choose a Password</Label>
                    <Input 
                      type="password" 
                      required 
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-black/50 border-white/10 text-white focus-visible:ring-[#F0564A] rounded-xl h-12"
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum 6 characters.</p>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-12 bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-xl font-bold text-lg transition-all mt-4"
                  >
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Create Account"}
                  </Button>
                </form>
              </div>

              <div className="lg:w-1/2 p-8 lg:p-12 bg-black/20 flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Smartphone className="w-6 h-6 text-[#F0564A]" /> Install the App
                </h3>
                <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                  For the best experience, you should install the MSC Client Portal app directly to your device. It works just like a native app with fast loading, offline support, and push notifications.
                </p>

                <div className="space-y-6">
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <Apple className="w-5 h-5 text-gray-300" />
                      <h4 className="font-semibold text-white">iPhone / iPad</h4>
                    </div>
                    <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside pl-2">
                      <li>Go to <strong>mightysparkcommunications.com/portal</strong> in the <strong>Safari</strong> browser.</li>
                      <li>Tap the <strong>Share</strong> button <span className="inline-flex items-center justify-center w-6 h-6 bg-white/10 rounded ml-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg></span> at the bottom of the screen.</li>
                      <li>Scroll down the list of options and tap <strong>Add to Home Screen</strong>.</li>
                      <li>Tap <strong>Add</strong> in the top right corner. The MSC app is now on your home screen!</li>
                    </ol>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <DownloadCloud className="w-5 h-5 text-gray-300" />
                      <h4 className="font-semibold text-white">Android / Chrome</h4>
                    </div>
                    <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside pl-2">
                      <li>Go to <strong>mightysparkcommunications.com/portal</strong> in the <strong>Chrome</strong> browser.</li>
                      <li>Tap the <strong>Menu</strong> (three vertical dots) at the top right of the browser.</li>
                      <li>Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>
                      <li>Follow the on-screen prompt to install. The MSC app is now on your home screen!</li>
                    </ol>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-12 shadow-2xl text-center flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Account Created!</h2>
              <p className="text-gray-400 mb-8">
                Your MSC portal account is fully set up. You will be redirected to your dashboard securely in a few seconds.
              </p>
              <Loader2 className="w-6 h-6 text-[#F0564A] animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}