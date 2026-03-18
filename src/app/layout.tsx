import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PostHogProvider from "@/components/PostHogProvider";
import PostHogPageView from "@/components/PostHogPageView";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bayou Office Machines | South Louisiana Office Equipment",
  description:
    "Bayou Office Machines — South Louisiana's authorized Toshiba MFP and Brother printer dealer. Quality office equipment, fast service, and support since 1996. Located in Larose, LA.",
  keywords: [
    "Toshiba copier",
    "office equipment Louisiana",
    "copier repair Larose",
    "Brother printer dealer",
    "MFP leasing South Louisiana",
    "Bayou Office Machines",
    "office supplies Larose LA",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-[#0a0a0a] text-[#f5f5f5]">
        <PostHogProvider>
          <Suspense>
            <PostHogPageView />
          </Suspense>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </PostHogProvider>
      </body>
    </html>
  );
}
