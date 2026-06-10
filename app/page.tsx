"use client";

import { motion, Variants } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { 
  Wand2, Zap, Palette, Shield, ChevronRight, CheckCircle2, 
  Star, Quote, MonitorSmartphone, LayoutTemplate 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

import heroBanner from "@/src/assets/images/signature_hero_banner_1781101053072.png";
import avatar1 from "@/src/assets/images/avatar_1_1781101073967.png";
import avatar2 from "@/src/assets/images/avatar_2_1781101091838.png";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden font-sans selection:bg-indigo-500/30">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[150px]" />
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full bg-blue-600/10 blur-[120px]" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* NAVBAR */}
      <header className="relative z-50 fixed top-0 w-full border-b border-white/10 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="font-bold text-white leading-none">S</span>
            </div>
            <span className="font-bold text-xl tracking-tight">SigGen</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#testimonials" className="hover:text-white transition-colors">Testimonials</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="#faq" className="hover:text-white transition-colors">FAQ</Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="hidden sm:flex text-slate-300 hover:text-white">Sign In</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-white text-slate-950 hover:bg-slate-200">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-20">
        
        {/* HERO SECTION */}
        <section className="px-6 mb-32 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-2xl text-center lg:text-left"
            >
              <motion.div variants={fadeInUp}>
                <Badge variant="outline" className="mb-6 border-indigo-500/30 bg-indigo-500/10 text-indigo-300 px-4 py-1.5 rounded-full text-sm">
                  <Star className="w-4 h-4 mr-2 inline-block text-amber-400" /> Rated #1 AI Signature Tool
                </Badge>
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp}
                className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent"
              >
                Craft Your Perfect <br className="hidden md:block"/>
                Signature in Seconds.
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-lg md:text-xl text-slate-400 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0"
              >
                Leverage generative AI to design stunning, professional email signatures that leave a lasting impression. Zero coding required.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 h-14 text-base">
                    Start Generating — Free
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 h-14 border-slate-700 text-slate-700 bg-transparent hover:bg-slate-800 hover:text-white">
                   View Templates
                </Button>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="mt-10 flex items-center justify-center lg:justify-start gap-3 text-sm text-slate-500">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-700"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-600"></div>
                </div>
                <span>Trusted by 10,000+ professionals</span>
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="relative relative rounded-3xl p-1 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 shadow-[0_0_80px_-20px_rgba(79,70,229,0.3)]"
            >
              <div className="rounded-[22px] overflow-hidden bg-slate-900 aspect-[4/3] relative">
                <Image 
                  src={heroBanner} 
                  alt="AI Signature Demo" 
                  fill 
                  className="object-cover opacity-90 mix-blend-screen"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                />
                
                {/* Floating UI Elements */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-10 -left-6 bg-slate-900/80 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-4 shadow-xl"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600" />
                  <div>
                    <div className="h-2 w-24 bg-white/20 rounded-full mb-2" />
                    <div className="h-2 w-16 bg-white/10 rounded-full" />
                  </div>
                </motion.div>
                
                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-10 -right-6 bg-slate-900/80 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-3 shadow-xl"
                >
                  <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <Wand2 className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-white">AI Enhanced</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* BRANDS / LOGOS */}
        <section className="border-y border-white/5 bg-slate-900/20 py-10 mb-32">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-8">Integrated with your favorite clients</p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-50 grayscale">
               <div className="text-xl font-bold flex items-center gap-2"><svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.728L12 16.64l-6.545-4.912v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg> Gmail</div>
               <div className="text-xl font-bold flex items-center gap-2"><svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M22.955 8.12c-.114-.523-.39-.99-.8-1.353L12.98.665a1.594 1.594 0 0 0-1.96 0L1.845 6.767c-.41.363-.686.83-.8 1.353a1.597 1.597 0 0 0 .193 1.15l2.427 4.148 2.426 4.148a1.595 1.595 0 0 0 1.378.795h9.062a1.596 1.596 0 0 0 1.378-.795l2.426-4.148 2.427-4.148a1.596 1.596 0 0 0 .194-1.151z" fillRule="evenodd" clipRule="evenodd"/></svg> Outlook</div>
               <div className="text-xl font-bold flex items-center gap-2"><svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M4.697 3.518a2.536 2.536 0 1 1-3.587 3.587l.951.95 2.636-2.636-.95-1.901zM23.364 8.783L15.352.771c-.771-.772-2.023-.772-2.795 0L2.179 11.15c-.772.771-.772 2.023 0 2.795l8.012 8.01c.772.773 2.024.773 2.795 0l10.378-10.377c.773-.772.773-2.023 0-2.795z"/></svg> Apple Mail</div>
               <div className="text-xl font-bold flex items-center gap-2 border-2 rounded px-2">Yahoo!</div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="px-6 mb-32 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Powerful Features for Professionals</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Everything you need to create and manage signatures that convert, beautifully packaged in one intelligent platform.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Wand2 className="w-6 h-6 text-indigo-400" />,
                title: "AI Layout Generation",
                desc: "Describe your brand vibe, and our Gemini AI generates a custom, pixel-perfect HTML signature instantly."
              },
              {
                icon: <LayoutTemplate className="w-6 h-6 text-purple-400" />,
                title: "Premium Templates",
                desc: "Start with hand-crafted, conversion-optimized templates that look great in every single email client."
              },
              {
                icon: <MonitorSmartphone className="w-6 h-6 text-blue-400" />,
                title: "Fully Responsive",
                desc: "Your signature will automatically adapt to look flawless on both desktop and mobile devices."
              },
              {
                icon: <Palette className="w-6 h-6 text-pink-400" />,
                title: "Brand Consistency",
                desc: "Enforce brand colors, fonts, and logos across your entire organization with centralized controls."
              },
              {
                icon: <Zap className="w-6 h-6 text-yellow-400" />,
                title: "1-Click Installation",
                desc: "Copy and paste directly into Gmail, Apple Mail, Outlook, or Yahoo without breaking the styling."
              },
              {
                icon: <Shield className="w-6 h-6 text-emerald-400" />,
                title: "Dark Mode Safe",
                desc: "Our intelligent CSS ensures your logos and text remain perfectly readable when the recipient uses dark mode."
              }
            ].map((feature, i) => (
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                key={i}
                className="h-full"
              >
                <Card className="bg-slate-900/50 border-white/5 hover:border-indigo-500/30 transition-all hover:bg-slate-900 h-full hover:shadow-[0_0_30px_-5px_rgba(79,70,229,0.15)]">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="px-6 mb-32 max-w-7xl mx-auto relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="text-center mb-16 relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Loved by Teams Worldwide</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Don&apos;t just take our word for it. See how we&apos;re upgrading communications.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {[
              {
                name: "Sarah Jenkins",
                role: "Marketing Director at TechFlow",
                image: avatar1,
                text: "The AI generation feature is mind-blowing. It took my vague description of 'corporate but modern' and spit out the exact signature I wanted in 5 seconds."
              },
              {
                name: "Marcus Cole",
                role: "Founder at NovaStart",
                image: avatar2,
                text: "We used to struggle with getting our 50+ employees to update their signatures. Now we manage it all centrally. Flawless execution and zero broken HTML."
              },
              {
                name: "Emily Rodriguez",
                role: "Freelance Designer",
                image: "https://picsum.photos/seed/emily/100/100", // Placeholder for third
                text: "As a designer, I'm picky about aesthetics. SigGen is the only tool that actually outputs clean code and handles dark-mode typography correctly."
              }
            ].map((review, i) => (
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                key={i}
                className="h-full"
              >
                <Card className="bg-slate-900/60 backdrop-blur border-white/10 h-full flex flex-col hover:bg-slate-900/80 hover:border-indigo-500/30 transition-all hover:shadow-[0_0_30px_-5px_rgba(79,70,229,0.15)] group">
                  <CardHeader>
                    <Quote className="w-8 h-8 text-indigo-500/50 mb-2 group-hover:text-indigo-400 group-hover:scale-110 transition-all" />
                    <CardDescription className="text-slate-300 text-base italic leading-relaxed">
                      &quot;{review.text}&quot;
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto pt-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0">
                      <Image 
                        src={review.image} 
                        alt={review.name} 
                        width={48} 
                        height={48} 
                        className="object-cover w-full h-full"
                        unoptimized={typeof review.image === 'string'}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{review.name}</h4>
                      <p className="text-sm text-slate-500">{review.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="px-6 mb-32 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Start for free, upgrade when you need more power.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Tier */}
            <Card className="bg-slate-900 border-white/10 relative">
              <CardHeader className="pb-8">
                <CardTitle className="text-xl text-slate-300 font-medium">Starter</CardTitle>
                <div className="mt-4 flex items-baseline text-5xl font-extrabold text-white">
                  $0
                  <span className="ml-1 text-xl font-medium text-slate-500">/mo</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {["1 Signature", "Standard Templates", "Watermarked", "Basic HTML export"].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-slate-600" />
                    <span className="text-slate-400">{feature}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="pt-8">
                <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl">Get Started Free</Button>
              </CardFooter>
            </Card>

            {/* Pro Tier */}
            <Card className="bg-gradient-to-b from-indigo-900/50 to-slate-900 border-indigo-500/50 relative transform md:-translate-y-4 shadow-2xl shadow-indigo-500/20">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Badge className="bg-indigo-500 hover:bg-indigo-500 text-white border-0 px-3 py-1">Most Popular</Badge>
              </div>
              <CardHeader className="pb-8">
                <CardTitle className="text-xl text-indigo-300 font-medium">Professional</CardTitle>
                <div className="mt-4 flex items-baseline text-5xl font-extrabold text-white">
                  $9
                  <span className="ml-1 text-xl font-medium text-slate-500">/mo</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {["Unlimited Signatures", "AI Layout Generation", "No Watermark", "Analytics Setup", "Dark Mode safe exports"].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-200">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                    <span>{feature}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="pt-8">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">Upgrade to Pro</Button>
              </CardFooter>
            </Card>

            {/* Teams Tier */}
            <Card className="bg-slate-900 border-white/10 relative">
              <CardHeader className="pb-8">
                <CardTitle className="text-xl text-slate-300 font-medium">Workspace</CardTitle>
                <div className="mt-4 flex items-baseline text-5xl font-extrabold text-white">
                  $29
                  <span className="ml-1 text-xl font-medium text-slate-500">/mo</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {["Everything in Pro", "Up to 50 team members", "Centralized Management", "Brand Kits", "Priority Support"].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-slate-600" />
                    <span className="text-slate-400">{feature}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="pt-8">
                <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl">Contact Sales</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="px-6 mb-32 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
          </div>
          
          <Accordion className="w-full space-y-4">
            {[
              { q: "Do I need coding skills to use this?", a: "Not at all! Our intuitive interface and AI generator handle all the complex HTML/CSS behind the scenes." },
              { q: "Will it work with my email client?", a: "Yes, our signatures are rigorously tested to render perfectly in Gmail, Outlook, Apple Mail, Yahoo, and mobile clients." },
              { q: "How does the AI generation work?", a: "We use Google's advanced Gemini models. You simply describe the look you want (e.g., 'Modern, minimal, dark colors') and our AI structures the HTML accordingly." },
              { q: "Can I use it for my whole team?", a: "Absolutely. Our Workspace plan allows you to create a master template and invite team members to simply fill in their details while locking your brand styles." },
              { q: "What happens if I cancel my subscription?", a: "Any signatures you have already exported and installed in your email client will continue to work forever. You just won't be able to edit them or generate new ones." }
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border border-white/10 bg-slate-900/50 rounded-lg px-6">
                <AccordionTrigger className="text-left font-medium text-slate-200 hover:text-white py-4">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-slate-400 pb-4 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* BOTTOM CTA */}
        <section className="px-6 relative">
          <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600" />
            <div className="absolute inset-0 bg-[url('https://picsum.photos/id/1020/1920/1080')] opacity-10 mix-blend-overlay bg-cover bg-center" />
            
            <div className="relative z-10 px-6 py-20 md:py-24 text-center">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white">Ready to upgrade your emails?</h2>
              <p className="text-indigo-100 max-w-2xl mx-auto mb-10 text-lg">Join thousands of professionals making a better impression with every message sent.</p>
              <Link href="/dashboard">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-slate-100 rounded-full px-10 h-14 text-lg font-medium shadow-xl">
                  Get Started For Free
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-slate-950 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="font-bold text-white text-xs">S</span>
              </div>
              <span className="font-bold text-lg">SigGen</span>
            </div>
            <p className="text-slate-400 text-sm max-w-xs mb-6">
              Empowering professionals to make a lasting impression with AI-driven, pixel-perfect email signatures.
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-800" />
              <div className="w-8 h-8 rounded-full bg-slate-800" />
              <div className="w-8 h-8 rounded-full bg-slate-800" />
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-indigo-400">Features</Link></li>
              <li><Link href="#" className="hover:text-indigo-400">Templates</Link></li>
              <li><Link href="#" className="hover:text-indigo-400">Pricing</Link></li>
              <li><Link href="#" className="hover:text-indigo-400">Changelog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-indigo-400">Help Center</Link></li>
              <li><Link href="#" className="hover:text-indigo-400">Blog</Link></li>
              <li><Link href="#" className="hover:text-indigo-400">API Documentation</Link></li>
              <li><Link href="#" className="hover:text-indigo-400">Community</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-indigo-400">About Us</Link></li>
              <li><Link href="#" className="hover:text-indigo-400">Careers</Link></li>
              <li><Link href="#" className="hover:text-indigo-400">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-indigo-400">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} SigGen Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white">Status</Link>
            <Link href="#" className="hover:text-white">Security</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
