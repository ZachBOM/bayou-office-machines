"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface LoginModalProps {
  type: "customer" | "staff" | null;
  onClose: () => void;
}

export default function LoginModal({ type, onClose }: LoginModalProps) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (type) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [type]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!type) return null;

  const isCustomer = type === "customer";
  const title = isCustomer ? "Customer Portal Login" : "Staff Portal Login";
  const destination = isCustomer ? "/customer-portal" : "/staff-portal";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    router.push(destination);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
    >
      <div className="relative w-full max-w-md bg-[#111111] rounded-xl overflow-hidden shadow-2xl border border-[#1f1f1f]">
        {/* Maroon top border */}
        <div className="h-1 w-full bg-[#800000]" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#f5f5f5]">{title}</h2>
            <p className="text-[#9ca3af] text-sm mt-0.5">
              {isCustomer
                ? "Access your equipment and service requests"
                : "Access internal tools and service dispatch"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#9ca3af] hover:text-white transition-colors ml-4 flex-shrink-0 p-1 rounded-lg hover:bg-white/10"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <div>
            <label
              htmlFor="modal-email"
              className="block text-sm font-medium text-[#f5f5f5] mb-1.5"
            >
              Email Address
            </label>
            <input
              id="modal-email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-3 text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000] transition-colors text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="modal-password"
              className="block text-sm font-medium text-[#f5f5f5] mb-1.5"
            >
              Password
            </label>
            <input
              id="modal-password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-[#141414] border border-[#1f1f1f] rounded-lg px-4 py-3 text-[#f5f5f5] placeholder-[#4b5563] focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000] transition-colors text-sm"
            />
          </div>

          <div className="flex items-center justify-between text-sm pt-1">
            <button
              type="button"
              className="text-[#c9a84c] hover:text-[#e0c06e] transition-colors"
            >
              Forgot Password?
            </button>
            {isCustomer && (
              <button
                type="button"
                className="text-[#9ca3af] hover:text-[#f5f5f5] transition-colors"
              >
                Request Access
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#800000] hover:bg-[#600000] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mt-2"
          >
            Sign In
          </button>

          <p className="text-center text-xs text-[#4b5563] pt-1">
            Need help?{" "}
            <a
              href="tel:9856937811"
              className="text-[#9ca3af] hover:text-[#f5f5f5] transition-colors"
            >
              Call 985-693-7811
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
