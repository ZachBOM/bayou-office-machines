import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PostHogProvider from "@/components/PostHogProvider";
import PostHogPageView from "@/components/PostHogPageView";
import PWAInstallBanner from "@/components/PWAInstallBanner";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bayou Office Machines | Copier & Printer Sales and Service — Larose, LA",
  description:
    "Bayou Office Machines LLC — authorized Toshiba dealer in Larose, LA. Sales, service, and repair of copiers, fax machines, printers, and computers. Family-owned since 1996. Serving Lafourche Parish and surrounding areas.",
  keywords: [
    "Toshiba copier Larose",
    "copier dealer Larose LA",
    "copier repair Lafourche Parish",
    "printer sales Larose Louisiana",
    "fax machine service Louisiana",
    "Toshiba dealer Louisiana",
    "copier leasing Larose",
    "office equipment Larose LA",
    "copier service Houma",
    "multifunction printer Lafourche Parish",
    "Bayou Office Machines",
    "copier repair Larose LA",
    "printer repair Lafourche",
    "Toshiba e-STUDIO dealer",
    "office machine service Louisiana",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bayou OM",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Bayou Office Machines LLC",
  "description": "Authorized Toshiba dealer providing sales and service of copiers, fax machines, printers, and computers in Larose, LA since 1996. Family-owned and operated.",
  "telephone": "(985) 693-7811",
  "email": "bayouoffice@bayouoffice.com",
  "foundingDate": "1996",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "13066 W. Main Street",
    "addressLocality": "Larose",
    "addressRegion": "LA",
    "postalCode": "70373",
    "addressCountry": "US"
  },
  "areaServed": [
    { "@type": "City", "name": "Larose" },
    { "@type": "City", "name": "Houma" },
    { "@type": "City", "name": "Thibodaux" },
    { "@type": "County", "name": "Lafourche Parish" }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Office Equipment Sales and Service",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Copier Sales" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Copier Repair and Service" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Printer Sales" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Fax Machine Sales and Service" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Equipment Leasing and Rental" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Toner and Supply Sales" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Preventive Maintenance Contracts" } }
    ]
  },
  "brand": [
    { "@type": "Brand", "name": "Toshiba" },
    { "@type": "Brand", "name": "Brother" },
    { "@type": "Brand", "name": "HP" }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="antialiased bg-[#141414] text-[#f5f5f5]">
        <PostHogProvider>
          <Suspense>
            <PostHogPageView />
          </Suspense>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <PWAInstallBanner />
          <ServiceWorkerRegister />
        </PostHogProvider>
      </body>
    </html>
  );
}
