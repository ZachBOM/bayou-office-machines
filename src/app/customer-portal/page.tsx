import Link from "next/link";

export default function CustomerPortal() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 pt-16">
      <div className="max-w-lg w-full text-center">
        <div className="inline-block bg-[#800000]/10 border border-[#800000]/30 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-6">
          Customer Portal
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#800000] mb-4">
          Customer Portal
        </h1>
        <p className="text-[#9ca3af] text-lg mb-2">Coming Soon</p>
        <p className="text-[#4b5563] text-sm mb-10 max-w-sm mx-auto leading-relaxed">
          Full portal launching shortly. Manage your equipment, submit service calls,
          track requests, and view invoices — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-[#800000] hover:bg-[#600000] text-white font-semibold text-sm rounded-lg transition-colors"
          >
            Back to Home
          </Link>
          <a
            href="tel:9856937811"
            className="px-6 py-3 border border-[#1f1f1f] text-[#9ca3af] hover:text-white hover:border-[#800000]/40 font-semibold text-sm rounded-lg transition-colors"
          >
            Call 985-693-7811
          </a>
        </div>
      </div>
    </div>
  );
}
