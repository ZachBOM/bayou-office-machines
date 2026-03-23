"use client";

import { useRef, useState, FormEvent } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import {
  Printer, Wrench, Shield, Package, FileText, Lightbulb,
  ChevronLeft, ChevronRight, ChevronDown,
  Phone, Mail, MapPin,
  Heart, Clock, Award, Users, Handshake, Star,
} from "lucide-react";
import Image from "next/image";
import LoginModal from "@/components/LoginModal";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section id={id} ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"} className={className}>
      {children}
    </motion.section>
  );
}

/* ─── data ─── */
const services = [
  { icon: Printer,  title: "Equipment Sales",        desc: "New and certified refurbished Toshiba MFPs and Brother printers sized for any office workflow." },
  { icon: Wrench,   title: "Service & Repair",        desc: "Factory-trained technicians on-site fast. We diagnose and fix right the first time." },
  { icon: Shield,   title: "Preventive Maintenance",  desc: "Scheduled PM contracts keep your machines running at peak performance year-round." },
  { icon: Package,  title: "Toner & Supplies",        desc: "Genuine OEM toner and supplies for Toshiba and Brother delivered directly to you." },
  { icon: FileText, title: "Leasing & Rentals",       desc: "Flexible lease options to modernize your office without large capital outlays." },
  { icon: Lightbulb,title: "Tech Consultation",       desc: "Not sure what you need? We assess your workflow and recommend the perfect fit." },
];

const toshibaProducts = [
  { model: "e-STUDIO4525AC", tag: "Color MFP",         desc: "Mid-volume color A3 multifunction — print, copy, scan, fax. Built for busy offices.", img: "/products/toshiba-eSTUDIO4525AC.jpg" },
  { model: "e-STUDIO6525AC", tag: "High-Volume Color", desc: "High-speed color output with advanced finishing options for large workgroups.",       img: "/products/toshiba-eSTUDIO6525AC.jpg" },
  { model: "e-STUDIO5528A",  tag: "Monochrome MFP",    desc: "Fast, reliable monochrome for document-heavy environments. Low cost per page.",       img: "/products/toshiba-eSTUDIO5528A.jpg" },
  { model: "e-STUDIO2829A",  tag: "Compact Desktop",   desc: "Space-saving desktop MFP perfect for small offices and personal workspaces.",          img: "/products/toshiba-eSTUDIO2829A.jpg" },
];

const highlights = [
  { tag: "New Arrival",    title: "New Toshiba e-STUDIO Models",      desc: "The latest multifunction lineup is here — faster speeds, sharper output, smarter security." },
  { tag: "Service Promise",title: "Fast Response Service",             desc: "Our 2-4 hour response guarantee means less downtime and more productivity for your team." },
  { tag: "Brother Solutions",title:"Brother Printer Solutions",        desc: "Full Brother lineup in stock — laser, inkjet, label printers, and compact MFCs for every office." },
  { tag: "Maintenance",    title: "Preventive Maintenance Plans",      desc: "Proactive care contracts tailored to your equipment volume keep costly repairs off your calendar." },
  { tag: "Success Story",  title: "Customer Win: Local Law Firm",      desc: "A Houma law firm cut print costs 30% after switching to our managed print solution." },
  { tag: "Tech Tip",       title: "Save on Toner Costs",               desc: "Simple workflow changes and OEM supplies can slash your supply spend by up to 25%." },
];

const stats = [
  { value: "30+",    label: "Years in Business" },
  { value: "200+",   label: "Active Contracts" },
  { value: "2-4 Hr", label: "Response Time" },
  { value: "Family", label: "Owned & Operated" },
];

const coreValues = [
  { icon: Heart,     title: "Honest Service",      desc: "Straight answers and fair quotes — no runaround, no selling you equipment you don't need." },
  { icon: Clock,     title: "Fast Response",        desc: "We guarantee 2-4 hour on-site response for service calls because we know downtime costs money." },
  { icon: MapPin,    title: "Local Roots",          desc: "Born and raised in South Louisiana. We know these parishes and our customers by name." },
  { icon: Award,     title: "Certified Expertise",  desc: "Factory-trained Toshiba technicians with decades of hands-on experience on your exact equipment." },
  { icon: Users,     title: "Family Business",      desc: "Family-owned since 1996. You'll always reach a real person who knows your account." },
  { icon: Handshake, title: "Long-Term Partners",   desc: "We're not here for one sale — we're here for every service call, every upgrade, every year." },
];

// ⚠️ Placeholder reviews — replace with real Yelp text when Zach pastes them
const testimonials = [
  { quote: "Chip and the team at Bayou Office Machines have been taking care of us for years. Fast service, honest pricing, and they always show up when they say they will.", name: "Julie T.", business: "Local Business — South Louisiana" },
  { quote: "Our copier went down on a Monday morning right before a major filing deadline. They had a tech on-site within two hours and had us back up before lunch. Incredible.", name: "Reviewer 2", business: "Paste real Yelp review here" },
  { quote: "Family-owned and it shows. They actually care about the equipment they sell you. The preventive maintenance plan has saved us from at least three expensive breakdowns.", name: "Reviewer 3", business: "Paste real Yelp review here" },
];

/* ─── Page ─── */
export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [modalType, setModalType] = useState<"customer" | "staff" | null>(null);
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [contactStatus, setContactStatus] = useState<"idle"|"sending"|"sent"|"error">("idle");

  async function handleContactSubmit(e: FormEvent) {
    e.preventDefault();
    setContactStatus("sending");
    const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(contactForm) });
    setContactStatus(res.ok ? "sent" : "error");
    if (res.ok) setContactForm({ name: "", email: "", phone: "", message: "" });
  }

  const scrollCards = (dir: "left"|"right") => {
    scrollRef.current?.scrollBy({ left: dir === "right" ? 340 : -340, behavior: "smooth" });
  };
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden pt-16 md:pt-[100px]">
        {/* Family photo background */}
        <div className="absolute inset-0">
          <Image
            src="/family.jpg"
            alt="Bayou Office Machines family"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Dark overlay so text stays readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/40" />
          {/* Fade into the next section's background — no hard cut */}
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-b from-transparent to-[#0d0d0d]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c9a84c]/30 bg-[#c9a84c]/5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] pulse-ring" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c]">Larose, Louisiana · Since 1996</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight"
          >
            Family-Owned Office<br />
            Solutions{" "}
            <span className="text-gradient-maroon-gold">You Can Trust</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#9ca3af] max-w-xl leading-relaxed"
          >
            Sales, service, and support for Toshiba copiers and office equipment.
            Fast local response. Certified technicians. Your South Louisiana neighbors since 1996.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mt-2"
          >
            <button
              onClick={() => scrollTo("products")}
              className="px-8 py-3.5 bg-[#800000] hover:bg-[#900000] text-white font-bold text-sm rounded-lg transition-all duration-200 glow-btn"
            >
              Browse Equipment
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="px-8 py-3.5 border border-[#800000]/60 text-white hover:bg-[#800000]/20 hover:border-[#800000] font-bold text-sm rounded-lg transition-all duration-200"
            >
              Get a Quote
            </button>
          </motion.div>

          {/* Mini trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-6 mt-4 pt-6 border-t border-white/10"
          >
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-xl font-extrabold text-white">{s.value}</div>
                <div className="text-[10px] uppercase tracking-widest text-[#9ca3af]">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer"
          onClick={() => scrollTo("about")}
        >
          <span className="text-[#9ca3af] text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown size={18} className="text-[#800000] bounce-down" />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════
          ABOUT — real photos
      ══════════════════════════════════════ */}
      <Section id="about" className="bg-[#0d0d0d] overflow-hidden">
        {/* Full-width photo banner */}
        <div className="relative w-full h-[420px] sm:h-[520px]">
          <Image src="/reception.jpg" alt="Bayou Office Machines — reception and showroom" fill className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-[#0d0d0d]" />
          <div className="absolute bottom-6 left-6 sm:left-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c]">Family Owned &amp; Operated</span>
            <p className="text-white font-bold text-xl sm:text-2xl mt-1 drop-shadow-lg">Bayou Office Machines — Larose, LA</p>
          </div>
        </div>

        {/* Story + showroom photo */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-3">Our Story</motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f5] leading-tight mb-6">
                Serving South Louisiana{" "}
                <span className="text-gradient-maroon-gold">Since 1996</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-[#9ca3af] leading-relaxed mb-4">
                Bayou Office Machines is a family-owned business built on honest work and deep roots in South Louisiana. For nearly three decades, we&apos;ve been the go-to partner for businesses across Lafourche, Terrebonne, and surrounding parishes.
              </motion.p>
              <motion.p variants={fadeUp} className="text-[#9ca3af] leading-relaxed mb-4">
                As a Toshiba-authorized dealer and service center, our certified technicians bring manufacturer-level expertise right to your office. When equipment fails, we respond fast — our service contracts guarantee 2-4 hour response times.
              </motion.p>
              <motion.p variants={fadeUp} className="text-[#9ca3af] leading-relaxed mb-8">
                We&apos;re not a national chain. We&apos;re your neighbors — and that means you get a real person on the phone, a tech who knows your equipment, and service that actually shows up.
              </motion.p>
              <motion.a variants={fadeUp} href="/about" className="inline-flex items-center gap-2 px-6 py-3 bg-[#800000] hover:bg-[#900000] text-white font-semibold text-sm rounded-lg transition-all duration-200 glow-btn">
                Learn More About Us <ChevronRight size={15} />
              </motion.a>
            </div>

            {/* Showroom photo + office photo stacked */}
            <div className="flex flex-col gap-4">
              <motion.div variants={fadeUp} className="relative rounded-2xl overflow-hidden h-56">
                <Image src="/showroom.jpg" alt="Bayou Office Machines showroom" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-bold text-sm">Our Showroom</p>
                  <p className="text-white/70 text-xs">Full display of Toshiba & office equipment</p>
                </div>
              </motion.div>
              <motion.div variants={fadeUp} className="relative rounded-2xl overflow-hidden h-48">
                <Image src="/owner-desk.jpg" alt="Owner at his desk" fill className="object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-bold text-sm">Chip — Owner</p>
                  <p className="text-white/70 text-xs">Bayou Office Machines, Larose LA</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════
          SERVICES
      ══════════════════════════════════════ */}
      <Section id="services" className="py-24 px-6 bg-[#141414] bg-dots">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-3">What We Do</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f5]">
              Full-Service Office Equipment <span className="text-gradient-maroon-gold">Support</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#9ca3af] mt-4 max-w-xl mx-auto">From the day you buy to every service call after — we cover it all.</motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="gradient-border rounded-xl p-6 group glow-card transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#800000]/30 to-[#800000]/10 flex items-center justify-center mb-5 group-hover:from-[#800000]/50 group-hover:to-[#800000]/20 transition-all duration-300">
                  <Icon size={22} className="text-[#800000]" />
                </div>
                <h3 className="font-bold text-[#f5f5f5] mb-2 text-base">{title}</h3>
                <p className="text-[#9ca3af] text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} className="text-center mt-12">
            <a href="/services" className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#800000]/50 text-white hover:bg-[#800000]/15 hover:border-[#800000] font-bold text-sm rounded-lg transition-all duration-200">
              View All Services <ChevronRight size={15} />
            </a>
          </motion.div>
        </div>
      </Section>

      {/* ══════════════════════════════════════
          MANAGED PRINT SERVICES
      ══════════════════════════════════════ */}
      <section className="relative py-24 px-6 bg-[#800000] overflow-hidden">
        <div className="absolute inset-0 bg-grid-maroon pointer-events-none opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,#600000_0%,transparent_60%)] pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 mb-3">Cost Control</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-6">
                Managed Print Services
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Most businesses have no idea what they&apos;re actually spending on printing. Ink, toner, paper, repairs, wasted pages — it adds up fast. Managed Print Services puts us in charge of optimizing your entire print environment.
              </p>
              <p className="text-white/80 leading-relaxed mb-8">
                We monitor your fleet, keep supplies stocked automatically, schedule preventive maintenance before problems start, and give you one predictable monthly cost. Most customers see 20–30% savings in their first year.
              </p>
              <a href="tel:9856937811" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-[#800000] font-bold text-sm rounded-lg hover:bg-white/90 transition-all duration-200 shadow-lg">
                Ask About MPS
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { stat: "20–30%", label: "Average savings on print costs" },
                { stat: "Auto",   label: "Toner & supply replenishment" },
                { stat: "Zero",   label: "Surprise repair bills" },
                { stat: "1 Bill", label: "Predictable monthly cost" },
              ].map((item) => (
                <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-colors">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white mb-2 stat-glow">{item.stat}</div>
                  <div className="text-white/70 text-xs leading-snug">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CORE VALUES
      ══════════════════════════════════════ */}
      <Section id="values" className="py-24 px-6 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-3">How We Work</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f5]">
              What Sets Us <span className="text-gradient-maroon-gold">Apart</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#9ca3af] mt-4 max-w-xl mx-auto">
              Six principles that guide every customer interaction — every single time.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {coreValues.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="relative bg-[#111111] border border-[#1f1f1f] rounded-xl p-6 group glow-card-gold transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl" />
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#c9a84c]/20 to-[#c9a84c]/5 flex items-center justify-center mb-5 group-hover:from-[#c9a84c]/35 group-hover:to-[#c9a84c]/10 transition-all">
                  <Icon size={20} className="text-[#c9a84c]" />
                </div>
                <h3 className="font-bold text-[#f5f5f5] mb-2 text-base">{title}</h3>
                <p className="text-[#9ca3af] text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════
          TOSHIBA PRODUCTS
      ══════════════════════════════════════ */}
      <Section id="products" className="py-24 bg-[#141414] bg-grid">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-start gap-4 mb-3">
            <div className="w-1 h-10 bg-gradient-to-b from-[#800000] to-[#c9a84c] rounded-full" />
            <div>
              <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-1">Authorized Toshiba Dealer</motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f5]">Toshiba e-STUDIO Lineup</motion.h2>
            </div>
          </div>
          <motion.p variants={fadeUp} className="text-[#9ca3af] text-base mb-12 max-w-xl pl-5">
            We sell, install, and service the full Toshiba MFP lineup across South Louisiana. Contact us for pricing.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {toshibaProducts.map((p, i) => (
              <motion.div
                key={p.model}
                variants={fadeUp}
                custom={i}
                className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-2xl overflow-hidden group glow-card transition-all duration-300 hover:-translate-y-2"
              >
                <div className="bg-white p-6 flex items-center justify-center h-48 relative overflow-hidden">
                  <Image src={p.img} alt={`Toshiba ${p.model}`} width={200} height={160} className="object-contain h-full w-full relative z-10" />
                  <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white/80 to-transparent" />
                </div>
                <div className="p-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#c9a84c] bg-[#c9a84c]/10 px-2.5 py-1 rounded-full border border-[#c9a84c]/20">
                    {p.tag}
                  </span>
                  <h3 className="font-bold text-[#f5f5f5] mt-3 mb-2">{p.model}</h3>
                  <p className="text-[#9ca3af] text-sm leading-relaxed">{p.desc}</p>
                  <a href="tel:9856937811" className="mt-4 flex items-center gap-1 text-[#800000] text-xs font-semibold group-hover:gap-2 transition-all">
                    Get a quote <ChevronRight size={13} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} className="text-center mt-12">
            <a href="/products" className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#800000]/50 text-white hover:bg-[#800000]/15 hover:border-[#800000] font-bold text-sm rounded-lg transition-all duration-200">
              See Full Product Catalog <ChevronRight size={15} />
            </a>
          </motion.div>
        </div>
      </Section>

      {/* ══════════════════════════════════════
          TESTIMONIALS — real photos as accents
      ══════════════════════════════════════ */}
      <Section id="testimonials" className="py-24 px-6 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-3">Customer Reviews</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f5]">
              What Our Customers <span className="text-gradient-maroon-gold">Say</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="relative bg-[#111111] border border-[#1f1f1f] rounded-xl p-7 flex flex-col glow-card transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {/* Big decorative quote mark */}
                <div className="absolute top-3 right-5 text-[80px] font-serif leading-none text-[#800000]/15 select-none pointer-events-none">&ldquo;</div>
                {/* Gold top accent */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#800000] via-[#c9a84c] to-transparent" />

                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={14} className="text-[#c9a84c] fill-[#c9a84c]" />
                  ))}
                </div>
                <p className="text-[#9ca3af] text-sm leading-relaxed flex-1 mb-6 relative z-10">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="border-t border-[#1f1f1f] pt-5">
                  <p className="font-bold text-[#f5f5f5] text-sm">{t.name}</p>
                  <p className="text-[#4b5563] text-xs mt-0.5">{t.business}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════
          BRAND PARTNERS
      ══════════════════════════════════════ */}
      <Section id="partners" className="py-16 px-6 bg-[#141414] border-y border-[#1f1f1f]">
        <div className="max-w-4xl mx-auto">
          <motion.p variants={fadeUp} className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#4b5563] mb-10">
            Authorized Dealer &amp; Service Center
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {[
              { brand: "TOSHIBA", sub: "e-STUDIO Series MFPs", desc: "Authorized dealer and factory-certified service center for the complete Toshiba MFP lineup." },
              { brand: "Brother",  sub: "Printers & MFCs",     desc: "Authorized Brother dealer for laser printers, inkjet, label printers, and compact devices." },
            ].map(({ brand, sub, desc }) => (
              <motion.div
                key={brand}
                variants={fadeUp}
                className="gradient-border rounded-xl p-8 text-center glow-card-gold transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-2xl font-extrabold text-[#f5f5f5] tracking-tight mb-1">{brand}</div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[#800000] mb-3">{sub}</div>
                <p className="text-[#9ca3af] text-xs leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════
          HIGHLIGHTS — Horizontal scroll
      ══════════════════════════════════════ */}
      <Section id="highlights" className="py-24 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between px-6 mb-8">
            <div>
              <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-3">What&apos;s New</motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f5]">
                Latest News &amp; <span className="text-gradient-maroon-gold">Highlights</span>
              </motion.h2>
            </div>
            <motion.div variants={fadeUp} className="hidden sm:flex gap-2">
              <button onClick={() => scrollCards("left")} className="p-2.5 rounded-lg bg-[#111111] border border-[#1f1f1f] text-[#9ca3af] hover:text-white hover:border-[#800000] transition-colors" aria-label="Scroll left">
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => scrollCards("right")} className="p-2.5 rounded-lg bg-[#111111] border border-[#1f1f1f] text-[#9ca3af] hover:text-white hover:border-[#800000] transition-colors" aria-label="Scroll right">
                <ChevronRight size={18} />
              </button>
            </motion.div>
          </div>

          <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide px-6 pb-4 scroll-smooth snap-x snap-mandatory">
            {highlights.map((card, i) => (
              <motion.div
                key={card.title}
                variants={fadeUp}
                custom={i}
                className="flex-shrink-0 w-[300px] snap-start bg-[#111111] rounded-xl p-6 group glow-card transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-[#1f1f1f] overflow-hidden relative"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#800000] to-[#c9a84c]" />
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#c9a84c] mb-4 bg-[#c9a84c]/10 border border-[#c9a84c]/20 px-2.5 py-1 rounded-full">
                  {card.tag}
                </span>
                <h3 className="font-bold text-[#f5f5f5] mb-3 text-base leading-snug">{card.title}</h3>
                <p className="text-[#9ca3af] text-sm leading-relaxed">{card.desc}</p>
                <div className="mt-6 flex items-center gap-1 text-[#800000] text-xs font-semibold group-hover:gap-2 transition-all">
                  Learn more <ChevronRight size={13} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════
          PORTALS
      ══════════════════════════════════════ */}
      <Section id="portals" className="py-24 px-6 bg-[#141414]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-3">Online Access</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f5]">Your Portals</motion.h2>
            <motion.p variants={fadeUp} className="text-[#9ca3af] mt-4 max-w-md mx-auto">Manage your account, submit service requests, and track equipment — all online.</motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              variants={fadeUp}
              className="relative rounded-xl overflow-hidden border border-[#1f1f1f] p-8 group glow-card transition-all duration-300"
              style={{ background: "linear-gradient(135deg, #0f0f0f 0%, #1a0505 100%)" }}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#800000] via-[#c9a84c] to-[#800000]" />
              <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-4">Customers</p>
              <h3 className="text-2xl font-extrabold text-[#f5f5f5] mb-3">Customer Portal</h3>
              <p className="text-[#9ca3af] text-sm leading-relaxed mb-8">
                Manage your equipment, submit service calls, track repair status, view invoices, and manage your supply orders — all in one place.
              </p>
              <button
                onClick={() => setModalType("customer")}
                className="px-6 py-3 bg-[#800000] hover:bg-[#900000] text-white font-semibold text-sm rounded-lg transition-all duration-200 glow-btn"
              >
                Customer Login
              </button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="relative rounded-xl overflow-hidden border border-[#1f1f1f] p-8"
              style={{ background: "linear-gradient(135deg, #0f0f0f 0%, #0a0a0f 100%)" }}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#c9a84c]/60 to-transparent" />
              <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-4">Not a customer yet?</p>
              <h3 className="text-2xl font-extrabold text-[#f5f5f5] mb-3">Request Access</h3>
              <p className="text-[#9ca3af] text-sm leading-relaxed mb-8">
                Contact us to set up a contract and get access to the customer portal. We&apos;ll get your account created and walk you through everything.
              </p>
              <button
                onClick={() => scrollTo("contact")}
                className="px-6 py-3 border border-[#800000]/60 hover:bg-[#800000]/20 hover:border-[#800000] text-white font-semibold text-sm rounded-lg transition-all duration-200"
              >
                Contact Us
              </button>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════════════
          CONTACT
      ══════════════════════════════════════ */}
      <Section id="contact" className="py-24 px-6 bg-[#0d0d0d] border-t border-[#1f1f1f]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-3">Reach Out</motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f5] mb-8">
                Get In <span className="text-gradient-maroon-gold">Touch</span>
              </motion.h2>

              <motion.div variants={fadeUp} className="space-y-4 mb-10">
                {[
                  { href: "tel:9856937811", icon: Phone, label: "985-693-7811" },
                  { href: "mailto:sales@bayouoffice.com", icon: Mail, label: "sales@bayouoffice.com" },
                ].map(({ href, icon: Icon, label }) => (
                  <a key={href} href={href} className="flex items-center gap-4 text-[#9ca3af] hover:text-[#f5f5f5] transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-[#800000]/10 border border-[#800000]/20 flex items-center justify-center group-hover:bg-[#800000]/25 group-hover:border-[#800000]/50 transition-all">
                      <Icon size={16} className="text-[#800000]" />
                    </div>
                    <span className="font-medium">{label}</span>
                  </a>
                ))}
                <div className="flex items-center gap-4 text-[#9ca3af]">
                  <div className="w-10 h-10 rounded-lg bg-[#800000]/10 border border-[#800000]/20 flex items-center justify-center">
                    <MapPin size={16} className="text-[#800000]" />
                  </div>
                  <span className="font-medium">13066 W. Main St., Larose, LA 70373</span>
                </div>
              </motion.div>

              <motion.form variants={fadeUp} onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Name", field: "name", type: "text", placeholder: "Your name", required: true },
                    { label: "Email", field: "email", type: "email", placeholder: "you@example.com", required: true },
                  ].map(({ label, field, type, placeholder, required }) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-[#f5f5f5] mb-1.5">{label}</label>
                      <input
                        type={type}
                        required={required}
                        placeholder={placeholder}
                        value={contactForm[field as keyof typeof contactForm]}
                        onChange={(e) => setContactForm(f => ({ ...f, [field]: e.target.value }))}
                        className="w-full bg-[#111111] border border-[#1f1f1f] rounded-lg px-4 py-3 text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000] transition-colors text-sm"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#f5f5f5] mb-1.5">Phone <span className="text-[#4b5563]">(optional)</span></label>
                  <input
                    type="tel" placeholder="985-000-0000" value={contactForm.phone}
                    onChange={(e) => setContactForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full bg-[#111111] border border-[#1f1f1f] rounded-lg px-4 py-3 text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000] transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#f5f5f5] mb-1.5">Message</label>
                  <textarea
                    rows={4} required placeholder="How can we help you?" value={contactForm.message}
                    onChange={(e) => setContactForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full bg-[#111111] border border-[#1f1f1f] rounded-lg px-4 py-3 text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000] transition-colors text-sm resize-none"
                  />
                </div>
                {contactStatus === "sent"  && <p className="text-green-400 text-sm">Message sent! We&apos;ll be in touch soon.</p>}
                {contactStatus === "error" && <p className="text-red-400 text-sm">Something went wrong. Please call us at 985-693-7811.</p>}
                <button
                  type="submit" disabled={contactStatus === "sending"}
                  className="px-8 py-3 bg-[#800000] hover:bg-[#900000] disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-all duration-200 glow-btn"
                >
                  {contactStatus === "sending" ? "Sending..." : "Send Message"}
                </button>
              </motion.form>
            </div>

            {/* Right — hours + building photo */}
            <div className="flex flex-col gap-6">
              {/* Building photo */}
              <motion.div variants={fadeUp} className="relative rounded-xl overflow-hidden h-52">
                <Image src="/building.jpg" alt="Bayou Office Machines building" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-bold text-sm">13066 W. Main St.</p>
                  <p className="text-white/70 text-xs">Larose, LA 70373</p>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-8">
                <h3 className="font-bold text-[#f5f5f5] mb-4">Business Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-[#9ca3af]">
                    <span>Monday – Friday</span><span className="text-[#f5f5f5]">8:00 AM – 4:00 PM</span>
                  </div>
                  <div className="flex justify-between text-[#9ca3af]">
                    <span>Saturday</span><span className="text-[#f5f5f5]">By Appointment</span>
                  </div>
                  <div className="flex justify-between text-[#9ca3af]">
                    <span>Sunday</span><span className="text-[#4b5563]">Closed</span>
                  </div>
                  <div className="pt-3 border-t border-[#1f1f1f]">
                    <span className="text-xs text-[#c9a84c]">Emergency service available for contract customers</span>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="bg-[#111111] border border-[#c9a84c]/30 rounded-xl p-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-4">Portal Support</p>
                <h3 className="text-xl font-bold text-[#f5f5f5] mb-3">Having Trouble Logging In?</h3>
                <p className="text-[#9ca3af] text-sm leading-relaxed mb-5">We can reset your password or set up a new account. Contact us directly.</p>
                <div className="flex flex-col gap-2 text-sm text-[#9ca3af]">
                  <button onClick={() => setModalType("customer")} className="text-left hover:text-[#c9a84c] transition-colors">Customer login help →</button>
                  <a href="tel:9856937811" className="hover:text-[#f5f5f5] transition-colors">Call us: 985-693-7811</a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </Section>

      <LoginModal type={modalType} onClose={() => setModalType(null)} />
    </>
  );
}
