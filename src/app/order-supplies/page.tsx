"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Package, CheckCircle, Phone, Mail, ChevronRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const supplyTypes = [
  "Black Toner Cartridge",
  "Cyan Toner Cartridge",
  "Magenta Toner Cartridge",
  "Yellow Toner Cartridge",
  "Drum Unit / Imaging Unit",
  "Fuser / Maintenance Kit",
  "Staple Cartridge",
  "Waste Toner Container",
  "Developer Unit",
  "Other (describe in notes)",
];

export default function OrderSuppliesPage() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    model: "",
    supplyType: "",
    qty: "1",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/supply-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setStatus("sent");
      setForm({ name: "", company: "", phone: "", email: "", model: "", supplyType: "", qty: "1", notes: "" });
    } else {
      setStatus("error");
    }
  }

  const inputCls =
    "w-full bg-[#111111] border border-[#1f1f1f] rounded-lg px-4 py-3 text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000] transition-colors text-sm";
  const labelCls = "block text-sm font-medium text-[#f5f5f5] mb-1.5";

  return (
    <div className="min-h-screen bg-[#141414] pt-16 md:pt-[100px]">
      {/* ── Header ── */}
      <div className="bg-[#800000] py-14 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 mb-5">
            <Package size={28} className="text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Order Supplies</h1>
          <p className="text-white/80 text-sm leading-relaxed max-w-md mx-auto">
            Need toner, drums, or other supplies for your machine? Fill out the form below
            and we&apos;ll get your order processed and delivered.
          </p>
        </div>
      </div>

      {/* ── Form ── */}
      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left — form */}
        <div className="lg:col-span-2">
          {status === "sent" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#111111] border border-[#1f1f1f] rounded-2xl p-12 text-center"
            >
              <CheckCircle size={48} className="text-green-400 mx-auto mb-5" />
              <h2 className="text-2xl font-extrabold text-[#f5f5f5] mb-3">Order Received!</h2>
              <p className="text-[#9ca3af] text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                We&apos;ve got your supply request. Our team will confirm availability and
                arrange delivery — we&apos;ll call or email you shortly.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="px-6 py-3 bg-[#800000] hover:bg-[#600000] text-white font-semibold text-sm rounded-lg transition-all"
              >
                Submit Another Order
              </button>
            </motion.div>
          ) : (
            <motion.form
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Customer info */}
              <motion.div variants={fadeUp} className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#c9a84c] mb-5">Your Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Name <span className="text-[#800000]">*</span></label>
                    <input type="text" required placeholder="Your name" value={form.name} onChange={set("name")} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Company <span className="text-[#800000]">*</span></label>
                    <input type="text" required placeholder="Business name" value={form.company} onChange={set("company")} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Phone <span className="text-[#800000]">*</span></label>
                    <input type="tel" required placeholder="985-000-0000" value={form.phone} onChange={set("phone")} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Email <span className="text-[#4b5563]">(optional)</span></label>
                    <input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} className={inputCls} />
                  </div>
                </div>
              </motion.div>

              {/* Supply details */}
              <motion.div variants={fadeUp} className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#c9a84c] mb-5">Supply Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Machine Model <span className="text-[#4b5563]">(helps us find the right supply)</span></label>
                    <input type="text" placeholder="e.g. Toshiba e-STUDIO4525AC or Brother MFC-L8900CDW" value={form.model} onChange={set("model")} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Supply Needed <span className="text-[#800000]">*</span></label>
                    <select required value={form.supplyType} onChange={set("supplyType")} className={`${inputCls} cursor-pointer`}>
                      <option value="" disabled>Select supply type…</option>
                      {supplyTypes.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Quantity</label>
                    <input type="number" min="1" max="99" value={form.qty} onChange={set("qty")} className={inputCls} />
                  </div>
                </div>
              </motion.div>

              {/* Notes */}
              <motion.div variants={fadeUp}>
                <label className={labelCls}>Additional Notes <span className="text-[#4b5563]">(optional)</span></label>
                <textarea
                  rows={3}
                  placeholder="Ordering for multiple machines? Any delivery instructions? Let us know."
                  value={form.notes}
                  onChange={set("notes")}
                  className={`${inputCls} resize-none`}
                />
              </motion.div>

              {status === "error" && (
                <p className="text-red-400 text-sm">
                  Something went wrong. Please call us at{" "}
                  <a href="tel:9856937811" className="underline">985-693-7811</a>.
                </p>
              )}

              <motion.button
                variants={fadeUp}
                type="submit"
                disabled={status === "sending"}
                className="w-full sm:w-auto px-10 py-3.5 bg-[#800000] hover:bg-[#600000] disabled:opacity-50 text-white font-bold text-sm rounded-lg transition-all duration-200"
              >
                {status === "sending" ? "Submitting..." : "Submit Order Request"}
              </motion.button>
            </motion.form>
          )}
        </div>

        {/* Right — info sidebar */}
        <div className="flex flex-col gap-5">
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-4">Genuine OEM Supplies</p>
            <p className="text-[#9ca3af] text-sm leading-relaxed mb-4">
              We only supply genuine OEM toner and consumables for Toshiba and Brother equipment.
              No third-party cartridges that void warranties or damage machines.
            </p>
            <div className="space-y-2">
              {["Toshiba e-STUDIO toner", "Brother laser toner", "Drum & imaging units", "Fuser kits & maintenance kits", "Waste containers & staples"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-[#9ca3af]">
                  <ChevronRight size={12} className="text-[#800000]" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-4">Questions?</p>
            <p className="text-[#9ca3af] text-sm leading-relaxed mb-5">
              Not sure what supply you need? Call us and we&apos;ll look it up by your machine model.
            </p>
            <div className="space-y-3">
              <a href="tel:9856937811" className="flex items-center gap-3 text-sm text-[#9ca3af] hover:text-[#f5f5f5] transition-colors">
                <Phone size={14} className="text-[#800000]" />
                985-693-7811
              </a>
              <a href="mailto:sales@bayouoffice.com" className="flex items-center gap-3 text-sm text-[#9ca3af] hover:text-[#f5f5f5] transition-colors">
                <Mail size={14} className="text-[#800000]" />
                sales@bayouoffice.com
              </a>
            </div>
          </div>

          <div className="bg-[#111111] border border-[#c9a84c]/30 rounded-xl p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-3">Need to Submit a Meter Read?</p>
            <p className="text-[#9ca3af] text-sm leading-relaxed mb-4">
              Submit your monthly meter reading while you&apos;re here.
            </p>
            <a
              href="/meter-read"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#800000] hover:text-[#c00000] transition-colors"
            >
              Submit Meter Read →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
