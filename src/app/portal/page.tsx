"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function PortalLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push("/portal/dashboard");
      router.refresh(); // Force a refresh to update auth state across the app
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#F0564A]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/images/MSC%20LOGO%20BITTERSWEET%20VECTOR%20(1).svg')] opacity-[0.02] bg-repeat bg-[length:100px_100px] pointer-events-none" />

      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <div className="mb-12">
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
                  <span 
                    key={i} 
                    className="font-heading font-light text-3xl tracking-tight text-white"
                  >
                    {letter}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </div>

        <div className="w-full max-w-md bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold mb-2">Client Portal</h1>
            <p className="text-gray-400">Sign in to manage your projects, tickets, and files.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="client@company.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-[#F0564A] rounded-xl h-12"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Link href="#" className="text-sm text-[#F0564A] hover:text-[#D94D42] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black/50 border-white/10 text-white focus-visible:ring-[#F0564A] rounded-xl h-12"
              />
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(240,86,74,0.2)] hover:shadow-[0_0_30px_rgba(240,86,74,0.4)]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>
        
        <p className="mt-8 text-gray-500 text-sm">
          Need access? <Link href="/contact" className="text-white hover:text-[#F0564A] transition-colors">Contact your account manager.</Link>
        </p>
      </div>
    </div>
  );
}