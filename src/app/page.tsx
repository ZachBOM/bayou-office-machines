import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Hero ── */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-6 py-24 sm:py-36"
        style={{ backgroundColor: "#6B1F1F" }}
      >
        {/* Subtle diagonal-line texture overlay */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
            backgroundSize: "12px 12px",
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl mx-auto">
          <Image
            src="/logo.png"
            alt="Bayou Office Machines"
            width={120}
            height={120}
            className="object-contain brightness-0 invert mb-2"
            priority
          />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
            Bayou Office Machines
          </h1>
          <p className="text-lg sm:text-xl text-red-100 font-medium max-w-xl">
            Quality Office Equipment. Even Better Service.
          </p>
          <p className="text-red-200 text-sm">
            South Louisiana&apos;s authorized Toshiba &amp; Brother dealer — serving the bayou since 1996.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              href="/contact"
              className="px-8 py-3.5 bg-white font-bold text-sm rounded-md transition-opacity hover:opacity-90"
              style={{ color: "#6B1F1F" }}
            >
              Request a Quote
            </Link>
            <Link
              href="/contact#service"
              className="px-8 py-3.5 border-2 border-white text-white font-bold text-sm rounded-md transition-colors hover:bg-white hover:text-[#6B1F1F]"
            >
              Submit a Service Call
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3 Pillars ── */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              icon: "🏠",
              title: "Locally Owned Since 1996",
              body: "Family owned and operated for nearly 30 years, rooted right here in South Louisiana.",
            },
            {
              icon: "✅",
              title: "Toshiba & Brother Authorized Dealer",
              body: "Authorized sales and service for Toshiba MFPs and Brother printers — genuine parts, factory support.",
            },
            {
              icon: "⚡",
              title: "Fast Response Time",
              body: "When your equipment goes down, so does your business. We prioritize quick, reliable service calls.",
            },
          ].map((pillar) => (
            <div
              key={pillar.title}
              className="flex flex-col items-center text-center p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-5"
                style={{ backgroundColor: "#f9f0f0" }}
              >
                {pillar.icon}
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">{pillar.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{pillar.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services Overview ── */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#6B1F1F" }}>
              What We Do
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Services</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">
              From installation to ongoing maintenance, we keep your office running at full capacity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Equipment Sales",
                desc: "New and certified refurbished copiers, printers, and MFPs sized for any office.",
              },
              {
                title: "Service & Repair",
                desc: "Factory-trained technicians providing on-site repair with fast turnaround.",
              },
              {
                title: "Preventive Maintenance",
                desc: "Scheduled maintenance contracts that keep your machines performing their best.",
              },
              {
                title: "Toner & Supplies",
                desc: "Genuine OEM supplies for Toshiba and Brother equipment delivered direct.",
              },
              {
                title: "Equipment Leasing",
                desc: "Flexible lease options to fit your budget without large capital outlays.",
              },
              {
                title: "Consultation",
                desc: "Not sure what you need? We assess your workflow and recommend the right fit.",
              },
            ].map((service) => (
              <div
                key={service.title}
                className="bg-white rounded-lg p-6 border border-gray-100 hover:border-red-200 hover:shadow-md transition-all"
              >
                <div className="w-2 h-6 rounded-sm mb-4" style={{ backgroundColor: "#6B1F1F" }} />
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/services"
              className="inline-block px-8 py-3 text-sm font-bold text-white rounded-md transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#6B1F1F" }}
            >
              See All Services
            </Link>
          </div>
        </div>
      </section>

      {/* ── Products Overview ── */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#6B1F1F" }}>
              Our Brands
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Products</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">
              We carry the industry&apos;s top office equipment brands — sold and serviced by our local team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Toshiba */}
            <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-3" style={{ backgroundColor: "#6B1F1F" }} />
              <div className="p-8">
                <h3 className="text-2xl font-extrabold text-gray-900 mb-1">Toshiba</h3>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                  Multifunction Printers
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Toshiba MFPs are built for business — fast print speeds, sharp scan quality, and secure document
                  management. As an authorized dealer, we offer the full e-STUDIO lineup with factory support.
                </p>
                <ul className="text-sm text-gray-500 space-y-1.5 mb-6">
                  {[
                    "Color & monochrome MFPs",
                    "Print, copy, scan, fax",
                    "High-volume production models",
                    "Cloud & mobile printing support",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#6B1F1F" }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/products#toshiba"
                  className="text-sm font-bold transition-opacity hover:opacity-75"
                  style={{ color: "#6B1F1F" }}
                >
                  Explore Toshiba →
                </Link>
              </div>
            </div>

            {/* Brother */}
            <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-3" style={{ backgroundColor: "#6B1F1F" }} />
              <div className="p-8">
                <h3 className="text-2xl font-extrabold text-gray-900 mb-1">Brother</h3>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                  Printers &amp; Copiers
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Brother delivers reliable, cost-effective printing for small and mid-size offices. Authorized
                  dealer status means genuine supplies, warranty service, and expert setup.
                </p>
                <ul className="text-sm text-gray-500 space-y-1.5 mb-6">
                  {[
                    "Laser & inkjet printers",
                    "Compact office MFCs",
                    "Label printers & scanners",
                    "Wireless & network ready",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#6B1F1F" }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/products#brother"
                  className="text-sm font-bold transition-opacity hover:opacity-75"
                  style={{ color: "#6B1F1F" }}
                >
                  Explore Brother →
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/products"
              className="inline-block px-8 py-3 text-sm font-bold text-white rounded-md transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#6B1F1F" }}
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </section>

      {/* ── Contact / CTA Strip ── */}
      <section className="py-16 px-6 text-white text-center bg-black">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 text-white">
            Ready to upgrade your office?
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            Call us, email us, or stop by. We&apos;ve been helping South Louisiana businesses run better since 1996.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <a
              href="tel:9856937811"
              className="px-8 py-3.5 font-bold text-sm rounded-md text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#6B1F1F" }}
            >
              Call 985-693-7811
            </a>
            <a
              href="mailto:bayouoffice@bayouoffice.com"
              className="px-8 py-3.5 border border-gray-600 text-gray-300 font-bold text-sm rounded-md hover:border-white hover:text-white transition-colors"
            >
              bayouoffice@bayouoffice.com
            </a>
          </div>
          <p className="text-gray-500 text-xs">13066 W. Main St., Larose, LA 70373</p>
        </div>
      </section>
    </div>
  );
}
