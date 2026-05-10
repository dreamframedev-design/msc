import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Mail, MessageSquare } from "lucide-react";

export default function Contact() {
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

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#F0564A]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Email Us</h3>
                    <a href="mailto:info@mightysparkcommunications.com" className="text-gray-600 hover:text-[#F0564A] transition-colors">
                      info@mightysparkcommunications.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#F0564A]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Our Offices</h3>
                    <p className="text-gray-600">
                      San Diego<br/>
                      Los Angeles<br/>
                      Pittsburgh
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="bg-gray-50 p-8 md:p-12 rounded-3xl border border-gray-100">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a message</h2>
                <p className="text-gray-600">Fill out the form below and we'll get back to you shortly.</p>
              </div>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" className="bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" className="bg-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@company.com" className="bg-white" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" placeholder="Biotech Inc." className="bg-white" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us about your project..." 
                    className="min-h-[150px] bg-white"
                  />
                </div>

                <Button size="lg" className="w-full bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
