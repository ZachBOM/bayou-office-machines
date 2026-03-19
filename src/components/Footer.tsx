"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Facebook, Phone, Mail, MapPin } from "lucide-react";

const navLinks = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#highlights", label: "Equipment" },
  { href: "#contact", label: "Contact" },
];

export default function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.getElementById(href.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer
      ref={ref}
      className="bg-[#050505] border-t-2 border-[#800000]"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
      >
        {/* Top — centered logo */}
        <div className="flex flex-col items-center py-12 border-b border-[#1f1f1f] px-6">
          <span className="bg-white rounded-2xl px-5 py-3 inline-flex items-center mb-4">
            <Image
              src="/logo.png"
              alt="Bayou Office Machines"
              width={160}
              height={60}
              className="object-contain h-16 w-auto"
            />
          </span>
          <p className="text-[#9ca3af] text-sm text-center max-w-sm">
            South Louisiana&apos;s trusted office equipment partner since 1996.
            Authorized Toshiba &amp; Brother dealer.
          </p>
        </div>

        {/* Middle */}
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-4">
              Contact
            </h4>
            <div className="space-y-3">
              <a
                href="tel:9856937811"
                className="flex items-center gap-2.5 text-[#9ca3af] hover:text-[#f5f5f5] transition-colors text-sm"
              >
                <Phone size={14} className="text-[#800000] flex-shrink-0" />
                985-693-7811
              </a>
              <a
                href="mailto:sales@bayouoffice.com"
                className="flex items-center gap-2.5 text-[#9ca3af] hover:text-[#f5f5f5] transition-colors text-sm"
              >
                <Mail size={14} className="text-[#800000] flex-shrink-0" />
                sales@bayouoffice.com
              </a>
              <div className="flex items-start gap-2.5 text-[#9ca3af] text-sm">
                <MapPin size={14} className="text-[#800000] flex-shrink-0 mt-0.5" />
                <span>13066 W. Main St.<br />Larose, LA 70373</span>
              </div>
            </div>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-[#9ca3af] hover:text-[#f5f5f5] transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social + portals */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-4">
              Connect
            </h4>
            <a
              href="https://www.facebook.com/bayouofficemachines/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#9ca3af] hover:text-[#f5f5f5] transition-colors text-sm mb-4"
            >
              <Facebook size={16} className="text-[#800000]" />
              Facebook
            </a>
            <p className="text-[#4b5563] text-xs mt-2 leading-relaxed">
              Mon–Fri: 8:00 AM – 5:00 PM<br />
              Sat: By appointment<br />
              Emergency service for contract customers
            </p>
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-[#1f1f1f] px-6 py-5">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-[#4b5563]">
            <span>13066 W. Main St., Larose, LA 70373</span>
            <span>&copy; {new Date().getFullYear()} Bayou Office Machines, LLC. All rights reserved.</span>
            <button className="hover:text-[#9ca3af] transition-colors">Privacy Policy</button>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
