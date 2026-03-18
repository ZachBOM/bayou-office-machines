"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import LoginModal from "./LoginModal";

const navLinks = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#highlights", label: "Equipment" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modalType, setModalType] = useState<"customer" | "staff" | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (href.startsWith("#")) {
        e.preventDefault();
        const id = href.slice(1);
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
        setMobileOpen(false);
      }
    },
    []
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#800000]/40 shadow-lg shadow-black/50"
            : "bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, "#hero")}
              className="flex items-center gap-2 flex-shrink-0"
            >
              <Image
                src="/logo.png"
                alt="Bayou Office Machines"
                height={40}
                width={120}
                className="object-contain h-10 w-auto"
                priority
              />
            </a>

            {/* Center nav links — desktop */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="relative px-4 py-2 text-sm font-medium text-[#f5f5f5] hover:text-white transition-colors group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#800000] group-hover:w-4/5 transition-all duration-300 rounded-full" />
                </a>
              ))}
            </nav>

            {/* Right buttons — desktop */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setModalType("customer")}
                className="px-4 py-2 text-sm font-semibold text-white border border-[#800000] rounded-lg hover:bg-[#800000]/20 transition-all duration-200"
              >
                Customer Login
              </button>
              <button
                onClick={() => setModalType("staff")}
                className="px-4 py-2 text-sm font-semibold text-white bg-[#800000] rounded-lg hover:bg-[#600000] transition-all duration-200"
              >
                Staff Login
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-[#f5f5f5] p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-[#0a0a0a] border-t border-[#1f1f1f] px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block px-4 py-3 text-sm font-medium text-[#f5f5f5] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 pb-1 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setModalType("customer");
                }}
                className="w-full px-4 py-3 text-sm font-semibold text-white border border-[#800000] rounded-lg hover:bg-[#800000]/20 transition-colors"
              >
                Customer Login
              </button>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setModalType("staff");
                }}
                className="w-full px-4 py-3 text-sm font-semibold text-white bg-[#800000] rounded-lg hover:bg-[#600000] transition-colors"
              >
                Staff Login
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Login Modal */}
      <LoginModal type={modalType} onClose={() => setModalType(null)} />
    </>
  );
}
