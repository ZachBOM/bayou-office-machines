"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { ChevronRight, Award, Users, MapPin, Clock, Heart, Handshake } from "lucide-react";
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

const stats = [
  { value: "30+", label: "Years in Business" },
  { value: "200+", label: "Active Contracts" },
  { value: "2-4 Hr", label: "Response Time" },
  { value: "Family", label: "Owned & Operated" },
];

const values = [
  {
    icon: Heart,
    title: "Honest Service",
    desc: "Straight answers and fair quotes — no runaround, no selling you equipment you don't need.",
  },
  {
    icon: Clock,
    title: "Fast Response",
    desc: "We guarantee 2-4 hour on-site response for service calls because we know downtime costs money.",
  },
  {
    icon: MapPin,
    title: "Local Roots",
    desc: "Born and raised in South Louisiana. We know these parishes and our customers by name.",
  },
  {
    icon: Award,
    title: "Certified Expertise",
    desc: "Factory-trained Toshiba technicians with decades of hands-on experience on your exact equipment.",
  },
  {
    icon: Users,
    title: "Family Business",
    desc: "Family-owned since 1996. You'll always reach a real person who knows your account.",
  },
  {
    icon: Handshake,
    title: "Long-Term Partners",
    desc: "We're not here for one sale — we're here for every service call, every upgrade, every year.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-16 md:pt-[100px] bg-[#141414] overflow-hidden">
        <div className="relative w-full h-[420px] sm:h-[520px]">
          <Image
            src="/building.jpg"
            alt="Bayou Office Machines"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[#141414]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-3">Our Story</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
              About Bayou Office Machines
            </h1>
            <p className="text-[#9ca3af] text-base max-w-xl">
              Family-owned, South Louisiana-based, and serving businesses since 1996.
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats Band ── */}
      <section className="bg-[#800000] py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">{stat.value}</div>
              <div className="text-white/75 text-sm mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Story ── */}
      <Section className="py-24 px-6 bg-[#141414]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-3">
              Who We Are
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f5] leading-tight mb-6">
              Serving South Louisiana <span className="text-[#800000]">Since 1996</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#9ca3af] leading-relaxed mb-5">
              Bayou Office Machines is a family-owned business built on honest work and deep roots
              in South Louisiana. For nearly three decades, we&apos;ve been the go-to partner for
              businesses across Lafourche, Terrebonne, Jefferson, and surrounding parishes.
            </motion.p>
            <motion.p variants={fadeUp} className="text-[#9ca3af] leading-relaxed mb-5">
              We started with a simple idea: local businesses deserve better support than what the
              big national chains offer. They deserve a vendor who shows up when called, knows
              their equipment by heart, and treats them like a neighbor — because that&apos;s exactly
              what we are.
            </motion.p>
            <motion.p variants={fadeUp} className="text-[#9ca3af] leading-relaxed mb-5">
              As an authorized Toshiba dealer and service center, our certified technicians bring
              manufacturer-level expertise right to your office. When equipment fails, we respond
              fast — our service contracts guarantee 2-4 hour response times so your team stays
              productive and your business keeps moving.
            </motion.p>
            <motion.p variants={fadeUp} className="text-[#9ca3af] leading-relaxed">
              We&apos;re not a call center. We&apos;re not a franchise. We&apos;re your neighbors —
              and that means you get a real person on the phone, a technician who knows your
              machines, and service that actually shows up.
            </motion.p>
          </div>

          <div className="flex flex-col gap-4">
            <motion.div variants={fadeUp} className="relative rounded-2xl overflow-hidden h-52">
              <Image src="/showroom.jpg" alt="Bayou Office Machines showroom" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-bold text-sm">Our Showroom Floor</p>
                <p className="text-white/70 text-xs">Full display of Toshiba & office equipment</p>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="relative rounded-2xl overflow-hidden h-44">
              <Image src="/owner-desk.jpg" alt="Chip — Owner" fill className="object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-bold text-sm">Chip — Owner</p>
                <p className="text-white/70 text-xs">Bayou Office Machines, Larose LA</p>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="relative rounded-2xl overflow-hidden h-40">
              <Image src="/staff-office.jpg" alt="Staff at work" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-bold text-sm">Our Team</p>
                <p className="text-white/70 text-xs">Here to help, Monday – Friday</p>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ── Our Values ── */}
      <Section className="py-24 px-6 bg-[#111111]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-3">
              How We Work
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f5]">
              Our Core Values
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#9ca3af] mt-4 max-w-xl mx-auto">
              These six principles guide every customer interaction and every service call we take.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="relative bg-[#141414] border border-[#1f1f1f] rounded-xl p-6 group hover:border-[#c9a84c]/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center mb-5 group-hover:bg-[#c9a84c]/20 transition-colors">
                  <Icon size={20} className="text-[#c9a84c]" />
                </div>
                <h3 className="font-bold text-[#f5f5f5] mb-2 text-base">{title}</h3>
                <p className="text-[#9ca3af] text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Service Area ── */}
      <Section className="py-24 px-6 bg-[#141414]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-3">
                Where We Work
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f5] leading-tight mb-6">
                South Louisiana <span className="text-[#800000]">Coverage</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-[#9ca3af] leading-relaxed mb-6">
                Based in Larose, we serve businesses throughout the bayou country and beyond.
                Our service territory covers the parishes below, with fast on-site response times
                for all contract customers.
              </motion.p>
              <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3 mb-8">
                {["Lafourche Parish", "Terrebonne Parish", "Jefferson Parish", "St. Mary Parish", "Assumption Parish", "St. Charles Parish"].map((parish) => (
                  <div key={parish} className="flex items-center gap-2 text-sm text-[#9ca3af]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#800000] flex-shrink-0" />
                    {parish}
                  </div>
                ))}
              </motion.div>
              <motion.a
                variants={fadeUp}
                href="tel:9856937811"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#800000] hover:bg-[#600000] text-white font-semibold text-sm rounded-lg transition-all duration-200"
              >
                Call Us: 985-693-7811
              </motion.a>
            </div>

            <motion.div variants={fadeUp} className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-8">
              <h3 className="font-bold text-[#f5f5f5] mb-6">Contact Information</h3>
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-1">Address</p>
                  <p className="text-[#9ca3af] text-sm">13066 W. Main St.<br />Larose, LA 70373</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-1">Phone</p>
                  <a href="tel:9856937811" className="text-[#f5f5f5] text-sm hover:text-[#800000] transition-colors">985-693-7811</a>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-1">Email</p>
                  <a href="mailto:sales@bayouoffice.com" className="text-[#f5f5f5] text-sm hover:text-[#800000] transition-colors">sales@bayouoffice.com</a>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-1">Hours</p>
                  <div className="space-y-1 text-sm text-[#9ca3af]">
                    <p>Mon – Fri: 8:00 AM – 4:00 PM</p>
                    <p>Sat: By appointment</p>
                    <p className="text-[#c9a84c] text-xs mt-2">Emergency service for contract customers</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ── CTA ── */}
      <section className="bg-[#800000] py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            Ready to Work With Us?
          </h2>
          <p className="text-white/80 mb-8 text-sm leading-relaxed">
            Whether you need a new machine, a service contract, or just a quote — we&apos;re ready to help.
            Give us a call or send a message and we&apos;ll get back to you the same day.
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
