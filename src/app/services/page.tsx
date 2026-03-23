"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import {
  Printer,
  Wrench,
  Shield,
  Package,
  FileText,
  Lightbulb,
  ChevronRight,
  Phone,
  CheckCircle,
} from "lucide-react";

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

const services = [
  {
    icon: Printer,
    title: "Equipment Sales",
    shortDesc: "New and certified refurbished Toshiba MFPs and Brother printers sized for any office workflow.",
    bullets: [
      "Full Toshiba e-STUDIO MFP lineup",
      "Brother laser, inkjet, and label printers",
      "Certified refurbished options available",
      "Equipment sizing and workflow consultation included",
      "Professional delivery and installation",
    ],
  },
  {
    icon: Wrench,
    title: "Service & Repair",
    shortDesc: "Factory-trained technicians on-site fast. We diagnose and fix right the first time.",
    bullets: [
      "2-4 hour on-site response for contract customers",
      "Factory-trained, Toshiba-certified technicians",
      "Genuine OEM parts used on all repairs",
      "Loaner equipment available when needed",
      "All brands serviced — not just what we sell",
    ],
  },
  {
    icon: Shield,
    title: "Preventive Maintenance",
    shortDesc: "Scheduled PM contracts keep your machines running at peak performance year-round.",
    bullets: [
      "Customized PM schedules based on your print volume",
      "Cleaning, calibration, and parts replacement",
      "Reduces emergency breakdowns significantly",
      "Detailed service reports after every visit",
      "Priority scheduling over non-contract customers",
    ],
  },
  {
    icon: Package,
    title: "Toner & Supplies",
    shortDesc: "Genuine OEM toner and supplies for Toshiba and Brother delivered directly to you.",
    bullets: [
      "Genuine OEM toner — no third-party risk",
      "Toshiba and Brother supplies in stock",
      "Auto-replenishment for contract customers",
      "Drum units, fuser kits, and maintenance kits",
      "Direct delivery to your office",
    ],
  },
  {
    icon: FileText,
    title: "Leasing & Rentals",
    shortDesc: "Flexible lease options to modernize your office without large capital outlays.",
    bullets: [
      "Month-to-month and multi-year lease options",
      "Lease includes service and supplies in one payment",
      "Upgrade path built into most agreements",
      "No large upfront equipment costs",
      "Tax advantages vs. outright purchase",
    ],
  },
  {
    icon: Lightbulb,
    title: "Tech Consultation",
    shortDesc: "Not sure what you need? We assess your workflow and recommend the perfect fit.",
    bullets: [
      "Free on-site workflow assessment",
      "Print volume analysis and cost review",
      "Equipment recommendations with no pressure",
      "Help transitioning from old equipment",
      "Ongoing advice as your business grows",
    ],
  },
];

const contractBenefits = [
  "Priority 2-4 hour on-site response",
  "Discounted labor rates",
  "Included preventive maintenance visits",
  "Auto-replenishment for toner and supplies",
  "After-hours emergency support",
  "Dedicated account representative",
  "Online portal access",
  "Annual equipment review",
];

export default function ServicesPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-16 md:pt-[100px] pb-20 bg-[#141414] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1a0000_0%,#141414_60%)] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center pt-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-4">What We Offer</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-5">
            Complete Office Equipment <span className="text-[#800000]">Services</span>
          </h1>
          <p className="text-[#9ca3af] text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-8">
            From equipment sales and leasing to service contracts and supplies — we handle everything
            so you can focus on running your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:9856937811"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#800000] hover:bg-[#600000] text-white font-bold text-sm rounded-lg transition-all duration-200 shadow-lg shadow-[#800000]/30"
            >
              <Phone size={15} />
              Call 985-693-7811
            </a>
            <a
              href="/#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-[#800000] text-white hover:bg-[#800000]/20 font-bold text-sm rounded-lg transition-all duration-200"
            >
              Request a Quote
            </a>
          </div>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <Section className="py-24 px-6 bg-[#111111]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-3">
              Our Services
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f5]">
              Everything Your Office Needs
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {services.map(({ icon: Icon, title, shortDesc, bullets }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="bg-[#141414] border border-[#1f1f1f] rounded-xl p-7 group hover:border-[#800000]/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-11 h-11 rounded-lg bg-[#800000]/15 flex items-center justify-center flex-shrink-0 group-hover:bg-[#800000]/25 transition-colors mt-0.5">
                    <Icon size={22} className="text-[#800000]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#f5f5f5] text-lg mb-1">{title}</h3>
                    <p className="text-[#9ca3af] text-sm leading-relaxed">{shortDesc}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-[#9ca3af]">
                      <ChevronRight size={14} className="text-[#800000] flex-shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Service Contracts ── */}
      <Section className="py-24 px-6 bg-[#141414]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-3">
                Best Value
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f5] leading-tight mb-6">
                Service Contracts <span className="text-[#800000]">Save You Money</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-[#9ca3af] leading-relaxed mb-5">
                Most of our customers are on service contracts — and for good reason. A contract
                bundles your service, supplies, and preventive maintenance into one predictable
                monthly cost, while getting you to the front of the line when something goes wrong.
              </motion.p>
              <motion.p variants={fadeUp} className="text-[#9ca3af] leading-relaxed mb-8">
                Contract pricing is based on your equipment and print volume. Call us for a
                no-pressure quote — we&apos;ll tell you if it makes sense for your situation.
              </motion.p>
              <motion.a
                variants={fadeUp}
                href="tel:9856937811"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#800000] hover:bg-[#600000] text-white font-semibold text-sm rounded-lg transition-all duration-200"
              >
                <Phone size={15} />
                Call for Contract Pricing
              </motion.a>
            </div>

            <motion.div variants={fadeUp} className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-5">Contract Benefits</p>
              <div className="space-y-3">
                {contractBenefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3 text-sm text-[#9ca3af]">
                    <CheckCircle size={15} className="text-[#800000] flex-shrink-0" />
                    {benefit}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ── CTA Band ── */}
      <section className="bg-[#800000] py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            Not Sure What You Need?
          </h2>
          <p className="text-white/80 mb-8 text-sm leading-relaxed">
            Give us a call and we&apos;ll walk you through your options. No pressure, no obligation —
            just honest advice from people who know this equipment inside and out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:9856937811"
              className="px-8 py-3.5 bg-white text-[#800000] font-bold text-sm rounded-lg hover:bg-white/90 transition-all duration-200"
            >
              Call 985-693-7811
            </a>
            <a
              href="/#contact"
              className="px-8 py-3.5 border border-white/50 text-white font-bold text-sm rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              Send a Message
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
