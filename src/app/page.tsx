"use client";

import { useRef, useState, FormEvent } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import {
  Printer,
  Wrench,
  Shield,
  Package,
  FileText,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import LoginModal from "@/components/LoginModal";

/* ─── animation variants ─── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      id={id}
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ─── data ─── */
const services = [
  {
    icon: Printer,
    title: "Equipment Sales",
    desc: "New and certified refurbished Toshiba MFPs and Brother printers sized for any office workflow.",
  },
  {
    icon: Wrench,
    title: "Service & Repair",
    desc: "Factory-trained technicians on-site fast. We diagnose and fix right the first time.",
  },
  {
    icon: Shield,
    title: "Preventive Maintenance",
    desc: "Scheduled PM contracts keep your machines running at peak performance year-round.",
  },
  {
    icon: Package,
    title: "Toner & Supplies",
    desc: "Genuine OEM toner and supplies for Toshiba and Brother delivered directly to you.",
  },
  {
    icon: FileText,
    title: "Leasing & Rentals",
    desc: "Flexible lease options to modernize your office without large capital outlays.",
  },
  {
    icon: Lightbulb,
    title: "Tech Consultation",
    desc: "Not sure what you need? We assess your workflow and recommend the perfect fit.",
  },
];

const toshibaProducts = [
  {
    model: 'e-STUDIO4525AC',
    tag: 'Color MFP',
    desc: 'Mid-volume color A3 multifunction — print, copy, scan, fax. Built for busy offices.',
    img: '/products/toshiba-eSTUDIO4525AC.jpg',
  },
  {
    model: 'e-STUDIO6525AC',
    tag: 'High-Volume Color',
    desc: 'High-speed color output with advanced finishing options for large workgroups.',
    img: '/products/toshiba-eSTUDIO6525AC.jpg',
  },
  {
    model: 'e-STUDIO5528A',
    tag: 'Monochrome MFP',
    desc: 'Fast, reliable monochrome for document-heavy environments. Low cost per page.',
    img: '/products/toshiba-eSTUDIO5528A.jpg',
  },
  {
    model: 'e-STUDIO2829A',
    tag: 'Compact Desktop',
    desc: 'Space-saving desktop MFP perfect for small offices and personal workspaces.',
    img: '/products/toshiba-eSTUDIO2829A.jpg',
  },
];

const highlights = [
  {
    tag: "New Arrival",
    title: "New Toshiba e-STUDIO Models",
    desc: "The latest multifunction lineup is here — faster speeds, sharper output, smarter security.",
  },
  {
    tag: "Service Promise",
    title: "Fast Response Service",
    desc: "Our 2-4 hour response guarantee means less downtime and more productivity for your team.",
  },
  {
    tag: "Brother Solutions",
    title: "Brother Printer Solutions",
    desc: "Full Brother lineup in stock — laser, inkjet, label printers, and compact MFCs for every office.",
  },
  {
    tag: "Maintenance",
    title: "Preventive Maintenance Plans",
    desc: "Proactive care contracts tailored to your equipment volume keep costly repairs off your calendar.",
  },
  {
    tag: "Success Story",
    title: "Customer Win: Local Law Firm",
    desc: "A Houma law firm cut print costs 30% after switching to our managed print solution.",
  },
  {
    tag: "Tech Tip",
    title: "Save on Toner Costs",
    desc: "Simple workflow changes and OEM supplies can slash your supply spend by up to 25%.",
  },
];

const stats = [
  { value: "30+", label: "Years in Business" },
  { value: "200+", label: "Active Contracts" },
  { value: "2-4 Hr", label: "Response Time" },
  { value: "Family", label: "Owned & Operated" },
];

/* ─── Page ─── */
export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [modalType, setModalType] = useState<"customer" | "staff" | null>(null);
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleContactSubmit(e: FormEvent) {
    e.preventDefault();
    setContactStatus("sending");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactForm),
    });
    setContactStatus(res.ok ? "sent" : "error");
    if (res.ok) setContactForm({ name: "", email: "", phone: "", message: "" });
  }

  const scrollCards = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 340 : -340, behavior: "smooth" });
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════ */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden pt-16"
      >
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="orb-1 absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#800000]/20 blur-3xl" />
          <div className="orb-2 absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[#800000]/15 blur-3xl" />
          <div className="orb-3 absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-[#c9a84c]/8 blur-3xl" />
          {/* radial gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#1a0000_0%,#0a0a0a_70%)]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c]"
          >
            Larose, Louisiana · Since 1996
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight"
          >
            Family-Owned Office Solutions{" "}
            <span className="text-[#800000]">You Can Trust</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#9ca3af] max-w-xl leading-relaxed"
          >
            Sales, service, and support for Toshiba copiers, printers, and office equipment.
            Fast local response. Certified technicians.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mt-2"
          >
            <button
              onClick={() => scrollToSection("highlights")}
              className="px-8 py-3.5 bg-[#800000] hover:bg-[#600000] text-white font-bold text-sm rounded-lg transition-all duration-200 shadow-lg shadow-[#800000]/30"
            >
              Browse Equipment
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="px-8 py-3.5 border border-[#800000] text-white hover:bg-[#800000]/20 font-bold text-sm rounded-lg transition-all duration-200"
            >
              Get a Quote
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer"
          onClick={() => scrollToSection("about")}
        >
          <span className="text-[#9ca3af] text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown size={18} className="text-[#800000] bounce-down" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════
          ABOUT
      ═══════════════════════════════════════════════ */}
      <Section id="about" className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left text */}
            <div>
              <motion.p
                variants={fadeUp}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-3"
              >
                Our Story
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f5] leading-tight mb-6"
              >
                Serving South Louisiana{" "}
                <span className="text-[#800000]">Since 1996</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-[#9ca3af] leading-relaxed mb-4">
                Bayou Office Machines is a family-owned business built on honest work and deep
                roots in South Louisiana. For nearly three decades, we&apos;ve been the go-to
                partner for businesses across Lafourche, Terrebonne, and surrounding parishes.
              </motion.p>
              <motion.p variants={fadeUp} className="text-[#9ca3af] leading-relaxed mb-4">
                As a Toshiba-authorized dealer and service center, our certified technicians
                bring manufacturer-level expertise right to your office. When equipment fails,
                we respond — fast. Our service contracts guarantee 2-4 hour response times so
                your team stays productive.
              </motion.p>
              <motion.p variants={fadeUp} className="text-[#9ca3af] leading-relaxed">
                We&apos;re not a national chain. We&apos;re your neighbors — and that means
                you get a real person on the phone, a tech who knows your equipment, and
                service that actually shows up.
              </motion.p>
            </div>

            {/* Right stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={fadeUp}
                  className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6 text-center hover:border-[#800000]/40 transition-colors duration-300"
                >
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#800000] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#9ca3af] font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════
          HIGHLIGHTS — Horizontal Scroll
      ═══════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════
          TOSHIBA PRODUCTS
      ═══════════════════════════════════════════════ */}
      <Section id="products" className="py-24 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-3">
            Authorized Toshiba Dealer
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f5] mb-2">
            Toshiba e-STUDIO Lineup
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#9ca3af] text-base mb-12 max-w-xl">
            We sell, install, and service the full Toshiba MFP lineup across South Louisiana. Contact us for pricing.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {toshibaProducts.map((p, i) => (
              <motion.div
                key={p.model}
                variants={fadeUp}
                custom={i}
                className="bg-[#111111] border border-[#1f1f1f] rounded-2xl overflow-hidden group hover:border-[#800000]/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="bg-white p-6 flex items-center justify-center h-48">
                  <Image
                    src={p.img}
                    alt={`Toshiba ${p.model}`}
                    width={200}
                    height={160}
                    className="object-contain h-full w-full"
                  />
                </div>
                <div className="p-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#c9a84c] bg-[#c9a84c]/10 px-2.5 py-1 rounded-full">
                    {p.tag}
                  </span>
                  <h3 className="font-bold text-[#f5f5f5] mt-3 mb-2">{p.model}</h3>
                  <p className="text-[#9ca3af] text-sm leading-relaxed">{p.desc}</p>
                  <a
                    href="tel:9856937811"
                    className="mt-4 flex items-center gap-1 text-[#800000] text-xs font-semibold group-hover:gap-2 transition-all"
                  >
                    Get a quote <ChevronRight size={13} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="highlights" className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between px-6 mb-8">
            <div>
              <motion.p
                variants={fadeUp}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-3"
              >
                What&apos;s New
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f5]"
              >
                Latest News & Highlights
              </motion.h2>
            </div>
            <motion.div variants={fadeUp} className="hidden sm:flex gap-2">
              <button
                onClick={() => scrollCards("left")}
                className="p-2.5 rounded-lg bg-[#111111] border border-[#1f1f1f] text-[#9ca3af] hover:text-white hover:border-[#800000] transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scrollCards("right")}
                className="p-2.5 rounded-lg bg-[#111111] border border-[#1f1f1f] text-[#9ca3af] hover:text-white hover:border-[#800000] transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight size={18} />
              </button>
            </motion.div>
          </div>

          {/* Horizontal scroll container */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide px-6 pb-4 scroll-smooth snap-x snap-mandatory"
          >
            {highlights.map((card, i) => (
              <motion.div
                key={card.title}
                variants={fadeUp}
                custom={i}
                className="flex-shrink-0 w-[300px] snap-start bg-[#111111] border-t-2 border-[#800000] border-x border-b border-x-[#1f1f1f] border-b-[#1f1f1f] rounded-xl p-6 group hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 transition-all duration-300 cursor-pointer"
              >
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#c9a84c] mb-4 bg-[#c9a84c]/10 px-2.5 py-1 rounded-full">
                  {card.tag}
                </span>
                <h3 className="font-bold text-[#f5f5f5] mb-3 text-base leading-snug group-hover:text-white transition-colors">
                  {card.title}
                </h3>
                <p className="text-[#9ca3af] text-sm leading-relaxed">{card.desc}</p>
                <div className="mt-6 flex items-center gap-1 text-[#800000] text-xs font-semibold group-hover:gap-2 transition-all">
                  Learn more <ChevronRight size={13} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════
          SERVICES
      ═══════════════════════════════════════════════ */}
      <Section
        id="services"
        className="py-24 px-6 bg-[#0a0a0a]"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-3"
            >
              What We Do
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f5]"
            >
              Full-Service Office Equipment Support
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#9ca3af] mt-4 max-w-xl mx-auto">
              From the day you buy to every service call after — we cover it all.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6 group hover:border-[#800000]/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-[#800000]/15 flex items-center justify-center mb-5 group-hover:bg-[#800000]/25 transition-colors">
                  <Icon size={20} className="text-[#800000]" />
                </div>
                <h3 className="font-bold text-[#f5f5f5] mb-2 text-base">{title}</h3>
                <p className="text-[#9ca3af] text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════
          PORTALS
      ═══════════════════════════════════════════════ */}
      <Section id="portals" className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-3"
            >
              Online Access
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f5]"
            >
              Your Portals
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Portal */}
            <motion.div
              variants={fadeUp}
              className="relative bg-[#111111] rounded-xl overflow-hidden border border-[#1f1f1f] p-8 group"
              style={{
                background:
                  "linear-gradient(135deg, #111111 0%, #150a0a 100%)",
              }}
            >
              {/* gradient border top */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#800000] via-[#c9a84c] to-[#800000]" />
              <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-4">
                Customers
              </p>
              <h3 className="text-2xl font-extrabold text-[#f5f5f5] mb-3">
                Customer Portal
              </h3>
              <p className="text-[#9ca3af] text-sm leading-relaxed mb-8">
                Manage your equipment, submit service calls, track repair status, view invoices,
                and manage your supply orders — all in one place.
              </p>
              <button
                onClick={() => setModalType("customer")}
                className="px-6 py-3 bg-[#800000] hover:bg-[#600000] text-white font-semibold text-sm rounded-lg transition-all duration-200 shadow-lg shadow-[#800000]/20"
              >
                Customer Login
              </button>
            </motion.div>

          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════
          CONTACT
      ═══════════════════════════════════════════════ */}
      <Section id="contact" className="py-24 px-6 bg-[#0a0a0a] border-t border-[#1f1f1f]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left — contact info + form */}
            <div>
              <motion.p
                variants={fadeUp}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-3"
              >
                Reach Out
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f5] mb-8"
              >
                Get In Touch
              </motion.h2>

              <motion.div variants={fadeUp} className="space-y-4 mb-10">
                <a
                  href="tel:9856937811"
                  className="flex items-center gap-4 text-[#9ca3af] hover:text-[#800000] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#111111] border border-[#1f1f1f] flex items-center justify-center group-hover:border-[#800000]/40 transition-colors">
                    <Phone size={16} className="text-[#800000]" />
                  </div>
                  <span className="font-medium">985-693-7811</span>
                </a>
                <a
                  href="mailto:sales@bayouoffice.com"
                  className="flex items-center gap-4 text-[#9ca3af] hover:text-[#800000] transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#111111] border border-[#1f1f1f] flex items-center justify-center group-hover:border-[#800000]/40 transition-colors">
                    <Mail size={16} className="text-[#800000]" />
                  </div>
                  <span className="font-medium">sales@bayouoffice.com</span>
                </a>
                <div className="flex items-center gap-4 text-[#9ca3af]">
                  <div className="w-10 h-10 rounded-lg bg-[#111111] border border-[#1f1f1f] flex items-center justify-center">
                    <MapPin size={16} className="text-[#800000]" />
                  </div>
                  <span className="font-medium">13066 W. Main St., Larose, LA 70373</span>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.form
                variants={fadeUp}
                onSubmit={handleContactSubmit}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#f5f5f5] mb-1.5">Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full bg-[#111111] border border-[#1f1f1f] rounded-lg px-4 py-3 text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000] transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#f5f5f5] mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full bg-[#111111] border border-[#1f1f1f] rounded-lg px-4 py-3 text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000] transition-colors text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#f5f5f5] mb-1.5">Phone (optional)</label>
                  <input
                    type="tel"
                    placeholder="985-000-0000"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full bg-[#111111] border border-[#1f1f1f] rounded-lg px-4 py-3 text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000] transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#f5f5f5] mb-1.5">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we help you?"
                    value={contactForm.message}
                    onChange={(e) => setContactForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full bg-[#111111] border border-[#1f1f1f] rounded-lg px-4 py-3 text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000] transition-colors text-sm resize-none"
                  />
                </div>
                {contactStatus === "sent" && (
                  <p className="text-green-400 text-sm">Message sent! We'll be in touch soon.</p>
                )}
                {contactStatus === "error" && (
                  <p className="text-red-400 text-sm">Something went wrong. Please call us at 985-693-7811.</p>
                )}
                <button
                  type="submit"
                  disabled={contactStatus === "sending"}
                  className="px-8 py-3 bg-[#800000] hover:bg-[#600000] disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-all duration-200"
                >
                  {contactStatus === "sending" ? "Sending..." : "Send Message"}
                </button>
              </motion.form>
            </div>

            {/* Right — Login help */}
            <div className="flex flex-col gap-6">
              <motion.div
                variants={fadeUp}
                className="bg-[#111111] border border-[#c9a84c]/30 rounded-xl p-8"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-4">
                  Portal Support
                </p>
                <h3 className="text-xl font-bold text-[#f5f5f5] mb-3">
                  Having Trouble Logging In?
                </h3>
                <p className="text-[#9ca3af] text-sm leading-relaxed mb-6">
                  We can reset your password or set up a new account. Contact us or use
                  the links below.
                </p>

                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => setModalType("customer")}
                    className="w-full flex items-center justify-between px-4 py-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg hover:border-[#800000]/40 transition-colors group"
                  >
                    <span className="text-sm font-medium text-[#f5f5f5]">
                      Customer Login Help
                    </span>
                    <ChevronRight
                      size={16}
                      className="text-[#9ca3af] group-hover:text-[#800000] transition-colors"
                    />
                  </button>
                </div>

                <div className="flex flex-col gap-2 text-sm text-[#9ca3af]">
                  <button className="text-left hover:text-[#c9a84c] transition-colors">
                    Forgot password? →
                  </button>
                  <a href="tel:9856937811" className="hover:text-[#f5f5f5] transition-colors">
                    Call us: 985-693-7811
                  </a>
                </div>
              </motion.div>

              {/* Quick info card */}
              <motion.div
                variants={fadeUp}
                className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-8"
              >
                <h3 className="font-bold text-[#f5f5f5] mb-4">Business Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-[#9ca3af]">
                    <span>Monday – Friday</span>
                    <span className="text-[#f5f5f5]">8:00 AM – 4:00 PM</span>
                  </div>
                  <div className="flex justify-between text-[#9ca3af]">
                    <span>Saturday</span>
                    <span className="text-[#f5f5f5]">By Appointment</span>
                  </div>
                  <div className="flex justify-between text-[#9ca3af]">
                    <span>Sunday</span>
                    <span className="text-[#4b5563]">Closed</span>
                  </div>
                  <div className="pt-3 border-t border-[#1f1f1f]">
                    <span className="text-xs text-[#c9a84c]">
                      Emergency service available for contract customers
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </Section>

      {/* Login Modal */}
      <LoginModal type={modalType} onClose={() => setModalType(null)} />
    </>
  );
}
