"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default function CookiesPolicy() {
  const [performanceCookies, setPerformanceCookies] = useState(true);
  const [advertisingCookies, setAdvertisingCookies] = useState(false);
  const [unclassifiedCookies, setUnclassifiedCookies] = useState(false);

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
              Last updated: July 23, 2024
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 tracking-tight text-gray-900">
              Cookies <span className="text-[#F0564A]">Policy</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              This Cookie Policy explains how Mighty Spark Communications, LLC uses cookies and similar technologies to recognize you when you visit our website.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid gap-12">
            
            {/* Interactive Cookie Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-gray-200 shadow-lg bg-white overflow-hidden">
                <div className="h-2 w-full bg-gradient-to-r from-[#F0564A] to-orange-400" />
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-heading">Cookie Preferences</CardTitle>
                  <CardDescription className="text-base">
                    Manage your cookie settings below. Essential cookies cannot be disabled as they are required for the site to function properly.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Essential Cookies */}
                  <div className="flex items-start justify-between space-x-4 border-b border-gray-100 pb-6">
                    <div className="space-y-1">
                      <Label className="text-base font-semibold text-gray-900">Strictly Necessary Cookies</Label>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        These cookies are essential for you to browse the website and use its features, such as accessing secure areas of the site.
                      </p>
                    </div>
                    <Switch checked={true} disabled className="data-[state=checked]:bg-gray-300" />
                  </div>

                  {/* Performance Cookies */}
                  <div className="flex items-start justify-between space-x-4 border-b border-gray-100 pb-6">
                    <div className="space-y-1">
                      <Label htmlFor="performance" className="text-base font-semibold text-gray-900 cursor-pointer">Performance & Functionality</Label>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        These cookies are used to enhance the performance and functionality of our Website but are non-essential to their use. Without these cookies, certain functionality may become unavailable.
                      </p>
                    </div>
                    <Switch 
                      id="performance" 
                      checked={performanceCookies} 
                      onCheckedChange={setPerformanceCookies}
                      className="data-[state=checked]:bg-[#F0564A]" 
                    />
                  </div>

                  {/* Advertising Cookies */}
                  <div className="flex items-start justify-between space-x-4 border-b border-gray-100 pb-6">
                    <div className="space-y-1">
                      <Label htmlFor="advertising" className="text-base font-semibold text-gray-900 cursor-pointer">Targeted Advertising</Label>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Third parties may serve cookies on your device to serve advertising through our Website and provide relevant advertisements about goods and services of potential interest to you.
                      </p>
                    </div>
                    <Switch 
                      id="advertising" 
                      checked={advertisingCookies} 
                      onCheckedChange={setAdvertisingCookies}
                      className="data-[state=checked]:bg-[#F0564A]" 
                    />
                  </div>

                  {/* Unclassified Cookies */}
                  <div className="flex items-start justify-between space-x-4">
                    <div className="space-y-1">
                      <Label htmlFor="unclassified" className="text-base font-semibold text-gray-900 cursor-pointer">Unclassified Cookies</Label>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        These are cookies that have not yet been categorized. We are in the process of classifying these cookies with the help of their providers.
                      </p>
                    </div>
                    <Switch 
                      id="unclassified" 
                      checked={unclassifiedCookies} 
                      onCheckedChange={setUnclassifiedCookies}
                      className="data-[state=checked]:bg-[#F0564A]" 
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button className="bg-[#F0564A] hover:bg-[#D94D42] text-white rounded-full px-8">
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Detailed Policy Accordion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-3xl p-8 md:p-12 border border-gray-200 shadow-sm"
            >
              <h2 className="text-3xl font-heading font-bold mb-8 text-gray-900">Detailed Policy Information</h2>
              
              <Accordion className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-semibold hover:text-[#F0564A]">What are cookies?</AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed text-base space-y-4">
                    <p>
                      Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
                    </p>
                    <p>
                      Cookies set by the website owner (in this case, Mighty Spark Communications, LLC) are called "first-party cookies." Cookies set by parties other than the website owner are called "third-party cookies." Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-semibold hover:text-[#F0564A]">Why do we use cookies?</AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed text-base space-y-4">
                    <p>
                      We use first- and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties. Third parties serve cookies through our Website for advertising, analytics, and other purposes.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-semibold hover:text-[#F0564A]">How can I control cookies on my browser?</AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed text-base space-y-4">
                    <p>
                      As the means by which you can refuse cookies through your web browser controls vary from browser to browser, you should visit your browser's help menu for more information. The following is information about how to manage cookies on the most popular browsers: Chrome, Internet Explorer, Firefox, Safari, Edge, Opera.
                    </p>
                    <p>
                      In addition, most advertising networks offer you a way to opt out of targeted advertising. If you would like to find out more information, please visit: Digital Advertising Alliance, Digital Advertising Alliance of Canada, or European Interactive Digital Advertising Alliance.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg font-semibold hover:text-[#F0564A]">What about other tracking technologies, like web beacons?</AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed text-base space-y-4">
                    <p>
                      Cookies are not the only way to recognize or track visitors to a website. We may use other, similar technologies from time to time, like web beacons (sometimes called "tracking pixels" or "clear gifs"). These are tiny graphics files that contain a unique identifier that enables us to recognize when someone has visited our Website or opened an email including them.
                    </p>
                    <p>
                      This allows us, for example, to monitor the traffic patterns of users from one page within a website to another, to deliver or communicate with cookies, to understand whether you have come to the website from an online advertisement displayed on a third-party website, to improve site performance, and to measure the success of email marketing campaigns. In many instances, these technologies are reliant on cookies to function properly, and so declining cookies will impair their functioning.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-lg font-semibold hover:text-[#F0564A]">Do you use Flash cookies or Local Shared Objects?</AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed text-base space-y-4">
                    <p>
                      Websites may also use so-called "Flash Cookies" (also known as Local Shared Objects or "LSOs") to, among other things, collect and store information about your use of our services, fraud prevention, and for other site operations.
                    </p>
                    <p>
                      If you do not want Flash Cookies stored on your computer, you can adjust the settings of your Flash player to block Flash Cookies storage using the tools contained in the Website Storage Settings Panel. Please note that setting the Flash Player to restrict or limit acceptance of Flash Cookies may reduce or impede the functionality of some Flash applications.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Where can I get further information?</h3>
                <p className="text-gray-600 mb-4">
                  If you have any questions about our use of cookies or other technologies, please contact us at:
                </p>
                <a href="mailto:wriedl@mightysparkcommunications.com" className="text-[#F0564A] font-medium hover:underline">
                  wriedl@mightysparkcommunications.com
                </a>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
