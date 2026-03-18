import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bayou Office Machines | South Louisiana Office Equipment",
  description:
    "Bayou Office Machines — South Louisiana's authorized Toshiba MFP and Brother printer dealer. Quality office equipment and service since 1996. Located in Larose, LA.",
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="text-white" style={{ backgroundColor: "#6B1F1F" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="Bayou Office Machines"
                width={44}
                height={44}
                className="object-contain brightness-0 invert"
              />
              <div>
                <div className="font-bold text-white text-base leading-tight">Bayou Office Machines</div>
                <div className="text-red-200 text-xs leading-tight">LLC</div>
              </div>
            </div>
            <p className="text-red-100 text-sm leading-relaxed">
              Quality Office Equipment. Even Better Service.
            </p>
            <p className="text-red-200 text-xs mt-3">In business since 1996 · Family owned</p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-red-100">
              <li>13066 W. Main St.</li>
              <li>Larose, LA 70373</li>
              <li className="pt-1">
                <a href="tel:9856937811" className="hover:text-white transition-colors">
                  985-693-7811
                </a>
              </li>
              <li>
                <a href="mailto:bayouoffice@bayouoffice.com" className="hover:text-white transition-colors">
                  bayouoffice@bayouoffice.com
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-red-100">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-red-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-red-300">
          <p>&copy; {currentYear} Bayou Office Machines, LLC. All rights reserved.</p>
          <p>South Louisiana&apos;s Toshiba &amp; Brother Authorized Dealer</p>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
