"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Gauge, CheckCircle, Phone, Mail } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function MeterReadPage() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    model: "",
    serial: "",
    bwReading: "",
    colorReading: "",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/meter-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setStatus("sent");
      setForm({ name: "", company: "", phone: "", email: "", model: "", serial: "", bwReading: "", colorReading: "", notes: "" });
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
            <Gauge size={28} className="text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Submit a Meter Read</h1>
          <p className="text-white/80 text-sm leading-relaxed max-w-md mx-auto">
            Contract customers — use this form to submit your monthly meter readings.
            We&apos;ll process your billing and reach out if we have any questions.
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
              <h2 className="text-2xl font-extrabold text-[#f5f5f5] mb-3">Meter Read Received!</h2>
              <p className="text-[#9ca3af] text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                Thanks — we&apos;ve got your reading. We&apos;ll process it and reach out if anything looks off.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="px-6 py-3 bg-[#800000] hover:bg-[#600000] text-white font-semibold text-sm rounded-lg transition-all"
              >
                Submit Another
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
                <h3 className="font-bold text-[#f5f5f5] mb-5 text-sm uppercase tracking-widest text-[#c9a84c]">Your Information</h3>
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

              {/* Machine info */}
              <motion.div variants={fadeUp} className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">
                <h3 className="font-bold text-[#f5f5f5] mb-5 text-sm uppercase tracking-widest text-[#c9a84c]">Machine Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Machine Model <span className="text-[#4b5563]">(optional)</span></label>
                    <input type="text" placeholder="e.g. Toshiba e-STUDIO4525AC" value={form.model} onChange={set("model")} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Serial Number <span className="text-[#4b5563]">(optional)</span></label>
                    <input type="text" placeholder="Found on machine label" value={form.serial} onChange={set("serial")} className={inputCls} />
                  </div>
                </div>
              </motion.div>

              {/* Meter readings */}
              <motion.div variants={fadeUp} className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">
                <h3 className="font-bold text-[#f5f5f5] mb-1 text-sm uppercase tracking-widest text-[#c9a84c]">Meter Readings</h3>
                <p className="text-[#4b5563] text-xs mb-5">Enter the numbers shown on your machine&apos;s meter counter screen.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Black &amp; White Reading <span className="text-[#800000]">*</span></label>
                    <input type="number" required placeholder="e.g. 48250" value={form.bwReading} onChange={set("bwReading")} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Color Reading <span className="text-[#4b5563]">(if applicable)</span></label>
                    <input type="number" placeholder="e.g. 12400" value={form.colorReading} onChange={set("colorReading")} className={inputCls} />
                  </div>
                </div>
              </motion.div>

              {/* Notes */}
              <motion.div variants={fadeUp}>
                <label className={labelCls}>Additional Notes <span className="text-[#4b5563]">(optional)</span></label>
                <textarea
                  rows={3}
                  placeholder="Multiple machines? Any issues to report? Let us know here."
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
                {status === "sending" ? "Submitting..." : "Submit Meter Read"}
              </motion.button>
            </motion.form>
          )}
        </div>

        {/* Right — help sidebar */}
        <div className="flex flex-col gap-5">
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-4">How to Find Your Meter</p>
            <div className="space-y-3 text-sm text-[#9ca3af]">
              <div className="flex items-start gap-2.5">
                <span className="text-[#800000] font-bold flex-shrink-0">1.</span>
                On the machine&apos;s touchscreen, press the <strong className="text-[#f5f5f5]">Home</strong> or <strong className="text-[#f5f5f5]">Counter</strong> button.
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-[#800000] font-bold flex-shrink-0">2.</span>
                Look for <strong className="text-[#f5f5f5]">Meter Read</strong> or <strong className="text-[#f5f5f5]">Counter Check</strong> in the menu.
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-[#800000] font-bold flex-shrink-0">3.</span>
                Note your <strong className="text-[#f5f5f5]">Total B&amp;W</strong> and <strong className="text-[#f5f5f5]">Total Color</strong> counts.
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-[#800000] font-bold flex-shrink-0">4.</span>
                Enter those numbers in the form and hit Submit.
              </div>
            </div>
          </div>

          <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-4">Need Help?</p>
            <p className="text-[#9ca3af] text-sm leading-relaxed mb-5">
              Can&apos;t find your meter? Not sure what to enter? Give us a call and we&apos;ll walk you through it.
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
            <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a84c] mb-3">Need Supplies?</p>
            <p className="text-[#9ca3af] text-sm leading-relaxed mb-4">
              Running low on toner or supplies? Submit a supply order while you&apos;re here.
            </p>
            <a
              href="/order-supplies"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#800000] hover:text-[#c00000] transition-colors"
            >
              Order Supplies →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
