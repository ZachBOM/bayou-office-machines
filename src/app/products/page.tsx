"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { ChevronRight, Phone, Printer } from "lucide-react";
import Image from "next/image";

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

const toshibaProducts = [
  {
    model: "e-STUDIO4525AC",
    tag: "Color MFP",
    speed: "45 ppm",
    type: "A3 Color Multifunction",
    desc: "Mid-volume color A3 multifunction — print, copy, scan, fax. Built for busy offices that need reliable color output day after day.",
    features: [
      "45 pages per minute (color & B/W)",
      "Print, copy, scan, fax",
      "A3 and A4 media support",
      "Built-in security features",
      "Touchscreen control panel",
    ],
    bestFor: "Law offices, real estate, mid-size businesses",
    img: "/products/toshiba-eSTUDIO4525AC.jpg",
  },
  {
    model: "e-STUDIO6525AC",
    tag: "High-Volume Color",
    speed: "65 ppm",
    type: "A3 Color Multifunction",
    desc: "High-speed color output with advanced finishing options for large workgroups and print-heavy environments.",
    features: [
      "65 pages per minute (color & B/W)",
      "Advanced finishing options",
      "High-capacity paper trays",
      "Multi-user workgroup ready",
      "Enhanced security suite",
    ],
    bestFor: "Large offices, print rooms, corporate departments",
    img: "/products/toshiba-eSTUDIO6525AC.jpg",
  },
  {
    model: "e-STUDIO5528A",
    tag: "Monochrome MFP",
    speed: "55 ppm",
    type: "A3 Monochrome Multifunction",
    desc: "Fast, reliable monochrome for document-heavy environments. Low cost per page makes it ideal for high-volume black-and-white printing.",
    features: [
      "55 pages per minute",
      "Exceptionally low cost per page",
      "Large paper capacity",
      "Robust duty cycle",
      "Network ready",
    ],
    bestFor: "Government, legal, medical, accounting firms",
    img: "/products/toshiba-eSTUDIO5528A.jpg",
  },
  {
    model: "e-STUDIO2829A",
    tag: "Compact Desktop",
    speed: "28 ppm",
    type: "Desktop Monochrome MFP",
    desc: "Space-saving desktop MFP perfect for small offices, reception areas, and personal workspaces that need reliable everyday printing.",
    features: [
      "28 pages per minute",
      "Compact desktop footprint",
      "Print, copy, scan functions",
      "Wireless connectivity",
      "Easy to use and maintain",
    ],
    bestFor: "Small offices, home offices, individual workstations",
    img: "/products/toshiba-eSTUDIO2829A.jpg",
  },
];

const brotherCategories = [
  {
    title: "Laser Printers",
    desc: "Reliable monochrome and color laser printers for everyday office printing. From compact desktops to high-volume workgroup models.",
    examples: ["HL Series (Monochrome)", "HL-L Series (Color)", "MFC-L Series (Multifunction)"],
  },
  {
    title: "Inkjet Printers",
    desc: "High-quality inkjet printers and all-in-ones for offices needing photo-quality output or lower upfront hardware cost.",
    examples: ["MFC-J Series (All-in-One)", "INKvestment Tank models", "Wide-format options"],
  },
  {
    title: "Label Printers",
    desc: "Professional label printers for barcodes, shipping, filing, and organization. Desktop and industrial options available.",
    examples: ["PT Series (Desktop)", "QL Series (Shipping Labels)", "TD Series (Industrial)"],
  },
  {
    title: "Compact MFCs",
    desc: "Space-saving multifunction centers that print, copy, scan, and fax — perfect for small offices with limited desk space.",
    examples: ["MFC-L2 Series", "DCP Series", "MFC-J Small Office"],
  },
];

export default function ProductsPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-16 md:pt-[100px] pb-20 bg-[#141414] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1a0000_0%,#141414_60%)] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center pt-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-4">Our Brands</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-5">
            Toshiba &amp; Brother <span className="text-[#800000]">Products</span>
          </h1>
          <p className="text-[#9ca3af] text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-8">
            We carry the full Toshiba e-STUDIO MFP lineup and the complete Brother product line.
            No prices listed — we quote based on your needs. Call us or send a message.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:9856937811"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#800000] hover:bg-[#600000] text-white font-bold text-sm rounded-lg transition-all duration-200 shadow-lg shadow-[#800000]/30"
            >
              <Phone size={15} />
              Call for Pricing
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

      {/* ── Toshiba Section ── */}
      <Section className="py-24 bg-[#111111]" id="toshiba">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-start justify-between flex-wrap gap-6 mb-12">
            <div>
              <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-3">
                Authorized Toshiba Dealer
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f5]">
                Toshiba e-STUDIO Lineup
              </motion.h2>
              <motion.p variants={fadeUp} className="text-[#9ca3af] text-base mt-3 max-w-xl">
                We sell, install, and service the full Toshiba MFP lineup. All models include
                professional installation, network setup, and staff training.
              </motion.p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {toshibaProducts.map((p, i) => (
              <motion.div
                key={p.model}
                variants={fadeUp}
                custom={i}
                className="bg-[#141414] border border-[#1f1f1f] rounded-2xl overflow-hidden group hover:border-[#800000]/40 transition-all duration-300 flex flex-col sm:flex-row"
              >
                {/* Image */}
                <div className="bg-white sm:w-44 flex-shrink-0 flex items-center justify-center p-6 sm:p-4">
                  <Image
                    src={p.img}
                    alt={`Toshiba ${p.model}`}
                    width={160}
                    height={160}
                    className="object-contain w-full h-32 sm:h-full"
                  />
                </div>
                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#c9a84c] bg-[#c9a84c]/10 px-2.5 py-1 rounded-full">
                        {p.tag}
                      </span>
                      <h3 className="font-extrabold text-[#f5f5f5] text-xl mt-2">{p.model}</h3>
                      <p className="text-[#4b5563] text-xs mt-0.5">{p.type}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold text-[#800000]">{p.speed}</div>
                      <div className="text-[#4b5563] text-xs">Print Speed</div>
                    </div>
                  </div>
                  <p className="text-[#9ca3af] text-sm leading-relaxed mb-4">{p.desc}</p>
                  <ul className="space-y-1.5 mb-4">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-[#9ca3af]">
                        <ChevronRight size={12} className="text-[#800000] flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-4 border-t border-[#1f1f1f] flex items-center justify-between">
                    <p className="text-xs text-[#4b5563]">Best for: {p.bestFor}</p>
                    <a
                      href="tel:9856937811"
                      className="flex items-center gap-1 text-[#800000] text-xs font-semibold hover:gap-2 transition-all"
                    >
                      Get a quote <ChevronRight size={12} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Brother Section ── */}
      <Section className="py-24 px-6 bg-[#141414]" id="brother">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-3">
              Authorized Brother Dealer
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f5] mb-3">
              Brother Printers &amp; MFCs
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#9ca3af] text-base max-w-xl">
              Full Brother lineup for every office size. We stock, sell, service, and supply
              consumables for all Brother products we carry.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {brotherCategories.map(({ title, desc, examples }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-7 group hover:border-[#800000]/40 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-[#800000]/15 flex items-center justify-center group-hover:bg-[#800000]/25 transition-colors">
                    <Printer size={17} className="text-[#800000]" />
                  </div>
                  <h3 className="font-bold text-[#f5f5f5]">{title}</h3>
                </div>
                <p className="text-[#9ca3af] text-sm leading-relaxed mb-5">{desc}</p>
                <div className="space-y-1.5">
                  {examples.map((ex) => (
                    <div key={ex} className="flex items-center gap-2 text-xs text-[#9ca3af]">
                      <ChevronRight size={12} className="text-[#800000] flex-shrink-0" />
                      {ex}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} className="mt-10 text-center">
            <p className="text-[#9ca3af] text-sm mb-5">
              Not sure which Brother model fits your office? We&apos;ll help you find the right match.
            </p>
            <a
              href="tel:9856937811"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#800000] hover:bg-[#600000] text-white font-bold text-sm rounded-lg transition-all duration-200"
            >
              <Phone size={15} />
              Talk to Us: 985-693-7811
            </a>
          </motion.div>
        </div>
      </Section>

      {/* ── Why Buy From Us ── */}
      <Section className="py-24 px-6 bg-[#111111]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-3">
              Why Bayou Office Machines
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f5]">
              More Than Just Equipment
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: "Professional Installation",
                desc: "Every machine we sell includes delivery, full installation, network setup, and staff training at your office.",
              },
              {
                title: "Ongoing Service & Support",
                desc: "We don't disappear after the sale. Our team is available for service, supplies, and support as long as you own the machine.",
              },
              {
                title: "No-Pressure Consultation",
                desc: "Tell us about your office and print volume. We'll recommend the right equipment for your needs — not the most expensive one.",
              },
            ].map(({ title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="bg-[#141414] border border-[#1f1f1f] rounded-xl p-6 text-center hover:border-[#800000]/40 transition-colors"
              >
                <h3 className="font-bold text-[#f5f5f5] mb-3">{title}</h3>
                <p className="text-[#9ca3af] text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── CTA Band ── */}
      <section className="bg-[#800000] py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            Ready to Upgrade Your Office?
          </h2>
          <p className="text-white/80 mb-8 text-sm leading-relaxed">
            Call us or send a message and we&apos;ll put together a no-obligation quote.
            We sell, lease, and finance equipment — whatever works best for your budget.
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
              Request a Quote
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
