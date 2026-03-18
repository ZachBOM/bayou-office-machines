"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Bayou Office Machines"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
            <div className="hidden sm:block">
              <div className="text-sm font-bold leading-tight" style={{ color: "#6B1F1F" }}>
                Bayou Office Machines
              </div>
              <div className="text-xs text-gray-500 leading-tight">LLC</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md transition-colors hover:bg-[#6B1F1F] hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="ml-3 px-5 py-2 text-sm font-semibold text-white rounded-md transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#6B1F1F" }}
            >
              Get a Quote
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-md"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-200 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-gray-700 transition-opacity duration-200 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-200 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#6B1F1F] hover:text-white rounded-md transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 px-4">
              <Link
                href="/contact"
                className="block text-center px-5 py-2.5 text-sm font-semibold text-white rounded-md"
                style={{ backgroundColor: "#6B1F1F" }}
                onClick={() => setMenuOpen(false)}
              >
                Get a Quote
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
