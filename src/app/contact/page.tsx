"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Mail, MessageSquare, Loader2, CheckCircle2 } from "lucide-react";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsError(false);

    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch("https://formspree.io/f/mkoyknpv", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setIsSuccess(true);
        (e.target as HTMLFormElement).reset();
      } else {
        setIsError(true);
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <section className="relative w-full min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/background.jpg" 
            alt="Contact Background" 
            fill 
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none mix-blend-multiply animate-breath">
          <Image 
            src="/images/foreground (3) copy.webp" 
            alt="Foreground elements" 
            fill 
            className="object-cover object-center"
          />
        </div>
        <div className="container relative z-20 mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Left Column - Contact Info */}
            <div className="space-y-12">
              <div>
                <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 tracking-tight text-gray-900">
                  Let's <span className="text-[#F0564A]">Connect</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Ready to amplify your biotech story? Reach out to us for a free consultation. We'd love to hear about your science and how we can help make it click.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-5 bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#F0564A]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Email Us</h3>
                    <a href="mailto:info@mightysparkcommunications.com" className="text-gray-600 hover:text-[#F0564A] transition-colors text-lg">
                      info@mightysparkcommunications.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-5 bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#F0564A]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Our Offices</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      San Diego • Los Angeles • Pittsburgh
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="bg-white/80 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] border border-white/50 shadow-[0_8px_40px_rgb(0,0,0,0.08)]">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Send us a message</h2>
                <p className="text-gray-600 text-lg">Fill out the form below and we'll get back to you shortly.</p>
              </div>

              {isSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-500">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">Thank you for reaching out. We will get back to you as soon as possible.</p>
                  <Button 
                    variant="outline" 
                    className="mt-6 rounded-full"
                    onClick={() => setIsSuccess(false)}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
                      <Input id="firstName" name="firstName" required placeholder="John" className="bg-white/50 border-gray-200 focus:border-[#F0564A] focus:ring-[#F0564A] rounded-xl px-4 py-6" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
                      <Input id="lastName" name="lastName" required placeholder="Doe" className="bg-white/50 border-gray-200 focus:border-[#F0564A] focus:ring-[#F0564A] rounded-xl px-4 py-6" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                    <Input id="email" name="email" type="email" required placeholder="john@company.com" className="bg-white/50 border-gray-200 focus:border-[#F0564A] focus:ring-[#F0564A] rounded-xl px-4 py-6" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-gray-700 font-medium">Company Name</Label>
                    <Input id="company" name="company" placeholder="Biotech Inc." className="bg-white/50 border-gray-200 focus:border-[#F0564A] focus:ring-[#F0564A] rounded-xl px-4 py-6" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-700 font-medium">Message</Label>
                    <Textarea 
                      id="message" 
                      name="message"
                      required
                      placeholder="Tell us about your project..." 
                      className="min-h-[150px] bg-white/50 border-gray-200 focus:border-[#F0564A] focus:ring-[#F0564A] rounded-xl px-4 py-4 resize-none"
                    />
                  </div>

                  {isError && (
                    <div className="text-red-500 text-sm font-medium">
                      Something went wrong. Please try again later.
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={isSubmitting}
                    className="w-full bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-full py-6 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <MessageSquare className="w-5 h-5 mr-2" />
                    )}
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
