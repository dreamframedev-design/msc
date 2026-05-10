"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Mail, ShieldCheck } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image 
            src="/images/flowsaber_a_minimal_abstract_translucent_chemical_pattern_desig_a6ae47e5-6f5f-4a06-8865-ca10fd46f28a.png" 
            alt="Background Pattern" 
            fill 
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/80 to-white" />
        </div>
        <div className="container relative z-10 mx-auto px-4 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-sm font-medium text-gray-600 mb-6">
              <ShieldCheck className="w-4 h-4 text-[#F0564A]" />
              Last updated: July 23, 2024
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 tracking-tight text-gray-900">
              Privacy <span className="text-[#F0564A]">Policy</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              This privacy notice describes how and why we might collect, store, use, and/or share your information when you use our services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Quick Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-lg mb-12 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-[#F0564A]" />
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Summary of Key Points</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What personal information do we process?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Do we process sensitive info?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">We do not process sensitive personal information.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Do we collect info from third parties?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">We do not collect any information from third parties.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How do we process your information?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.</p>
              </div>
            </div>
          </motion.div>

          {/* Detailed Policy Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 md:p-12 border border-gray-200 shadow-sm"
          >
            <h2 className="text-3xl font-heading font-bold mb-8 text-gray-900">Detailed Privacy Notice</h2>
            
            <Accordion className="w-full">
              
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-semibold hover:text-[#F0564A] text-left">1. What information do we collect?</AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-base space-y-4">
                  <p><strong>Personal information you disclose to us</strong></p>
                  <p>We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Names</li>
                    <li>Phone numbers</li>
                    <li>Email addresses</li>
                  </ul>
                  <p><strong>Information automatically collected</strong></p>
                  <p>We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, and other technical information.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg font-semibold hover:text-[#F0564A] text-left">2. How do we process your information?</AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-base space-y-4">
                  <p>We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>To send you marketing and promotional communications.</strong> You can opt out of our marketing emails at any time.</li>
                    <li><strong>To identify usage trends.</strong> We may process information about how you use our Services to better understand how they are being used so we can improve them.</li>
                    <li><strong>To determine the effectiveness of our marketing and promotional campaigns.</strong></li>
                    <li><strong>To save or protect an individual's vital interest.</strong> We may process your information when necessary to save or protect an individual's vital interest, such as to prevent harm.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg font-semibold hover:text-[#F0564A] text-left">3. What legal bases do we rely on?</AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-base space-y-4">
                  <p>We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e., legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfill our contractual obligations, to protect your rights, or to fulfill our legitimate business interests.</p>
                  <p>If you are located in the EU or UK, we rely on Consent, Legitimate Interests, Legal Obligations, and Vital Interests.</p>
                  <p>If you are located in Canada, we may process your information if you have given us specific permission (express consent) or in situations where your permission can be inferred (implied consent).</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg font-semibold hover:text-[#F0564A] text-left">4. When and with whom do we share your personal information?</AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-base space-y-4">
                  <p>We may need to share your personal information in the following situations:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Business Transfers.</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-lg font-semibold hover:text-[#F0564A] text-left">5. Do we use cookies and other tracking technologies?</AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-base space-y-4">
                  <p>We may use cookies and similar tracking technologies (like web beacons and pixels) to gather information when you interact with our Services. Some online tracking technologies help us maintain the security of our Services, prevent crashes, fix bugs, save your preferences, and assist with basic site functions.</p>
                  <p>Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-lg font-semibold hover:text-[#F0564A] text-left">6. How long do we keep your information?</AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-base space-y-4">
                  <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements).</p>
                  <p>When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger className="text-lg font-semibold hover:text-[#F0564A] text-left">7. Do we collect information from minors?</AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-base space-y-4">
                  <p>We do not knowingly collect, solicit data from, or market to children under 18 years of age, nor do we knowingly sell such personal information. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent's use of the Services.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger className="text-lg font-semibold hover:text-[#F0564A] text-left">8. What are your privacy rights?</AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-base space-y-4">
                  <p>Depending on your state of residence in the US or in some regions, such as the European Economic Area (EEA), United Kingdom (UK), Switzerland, and Canada, you have rights that allow you greater access to and control over your personal information.</p>
                  <p>You may review, change, or terminate your account at any time, depending on your country, province, or state of residence.</p>
                  <p>If we are relying on your consent to process your personal information, you have the right to withdraw your consent at any time.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-9">
                <AccordionTrigger className="text-lg font-semibold hover:text-[#F0564A] text-left">9. Controls for Do-Not-Track features</AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-base space-y-4">
                  <p>Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-10">
                <AccordionTrigger className="text-lg font-semibold hover:text-[#F0564A] text-left">10. Do United States residents have specific privacy rights?</AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-base space-y-4">
                  <p>If you are a resident of certain US states, you may have the right to request access to and receive details about the personal information we maintain about you and how we have processed it, correct inaccuracies, get a copy of, or delete your personal information.</p>
                  <p>We have not disclosed, sold, or shared any personal information to third parties for a business or commercial purpose in the preceding twelve (12) months.</p>
                </AccordionContent>
              </AccordionItem>

            </Accordion>

            <div className="mt-12 p-8 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Have questions or concerns?</h3>
                <p className="text-gray-600">
                  If you have questions or comments about this notice, you may email us or contact us by post.
                </p>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <a href="mailto:wriedl@mightysparkcommunications.com" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-full font-medium transition-colors">
                  <Mail className="w-4 h-4" />
                  Email Us
                </a>
                <div className="text-sm text-gray-500 text-center md:text-right">
                  Mighty Spark Communications, LLC<br/>
                  449 Old Farm Road<br/>
                  Pittsburgh, PA 15228
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
