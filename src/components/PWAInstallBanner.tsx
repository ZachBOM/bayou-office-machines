'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Share, Plus, Download } from 'lucide-react';

const BANNER_KEY = 'bom_pwa_dismissed';
const BAR_KEY = 'bom_pwa_bar_dismissed';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Already installed as PWA — hide everything
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // Only on mobile
    const isMobile = window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);
    if (!isMobile) return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window.navigator as unknown as { standalone?: boolean }).standalone;
    setIsIOS(ios);

    // Show sticky bar if not dismissed
    if (!localStorage.getItem(BAR_KEY)) {
      setShowBar(true);
    }

    if (ios) {
      // Show popup banner after delay if not dismissed
      if (!localStorage.getItem(BANNER_KEY)) {
        setTimeout(() => setShowBanner(true), 2000);
      }
    } else {
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        if (!localStorage.getItem(BANNER_KEY)) {
          setTimeout(() => setShowBanner(true), 2000);
        }
      };
      window.addEventListener('beforeinstallprompt', handler);
      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  function dismissBanner() {
    localStorage.setItem(BANNER_KEY, '1');
    setShowBanner(false);
  }

  function dismissBar() {
    localStorage.setItem(BAR_KEY, '1');
    setShowBar(false);
  }

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      localStorage.setItem(BANNER_KEY, '1');
      localStorage.setItem(BAR_KEY, '1');
      setShowBanner(false);
      setShowBar(false);
    }
    setDeferredPrompt(null);
  }

  function handleBarTap() {
    if (isIOS) {
      setShowIOSHint((v) => !v);
    } else if (deferredPrompt) {
      install();
    }
  }

  return (
    <>
      {/* ── Popup banner ──────────────────────────────────────────── */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-16 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
            <div className="h-1 bg-[#800000]" />
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-[#2a2a2a]">
                  <Image src="/icon-512.png" alt="Bayou OM" width={48} height={48} className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#f5f5f5] text-sm leading-tight">Add to Home Screen</p>
                  <p className="text-[#9ca3af] text-xs mt-0.5 leading-relaxed">
                    {isIOS
                      ? 'Tap the share button below, then "Add to Home Screen" for quick access.'
                      : 'Install the Bayou OM app for faster access on your phone.'}
                  </p>
                  {isIOS && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="flex items-center gap-1 bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg px-2 py-1">
                        <Share size={12} className="text-[#c9a84c]" />
                        <span className="text-xs text-[#9ca3af]">Share</span>
                      </div>
                      <span className="text-xs text-[#4b5563]">then</span>
                      <div className="flex items-center gap-1 bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg px-2 py-1">
                        <Plus size={12} className="text-[#c9a84c]" />
                        <span className="text-xs text-[#9ca3af]">Add to Home Screen</span>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={dismissBanner}
                  className="text-[#4b5563] hover:text-[#9ca3af] transition-colors flex-shrink-0 p-1 -mt-0.5"
                >
                  <X size={16} />
                </button>
              </div>
              {!isIOS && deferredPrompt && (
                <button
                  onClick={install}
                  className="w-full mt-3 py-2.5 bg-[#800000] hover:bg-[#600000] text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  Install App
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Sticky bottom download bar ─────────────────────────────── */}
      {showBar && (
        <div className="fixed bottom-0 left-0 right-0 z-40">
          {/* iOS hint tooltip */}
          {showIOSHint && (
            <div className="mx-4 mb-2 bg-[#111111] border border-[#2a2a2a] rounded-2xl shadow-2xl overflow-hidden">
              <div className="h-1 bg-[#800000]" />
              <div className="p-4">
                <p className="text-[#f5f5f5] text-sm font-semibold mb-1">Add to Home Screen</p>
                <p className="text-[#9ca3af] text-xs mb-3">Tap the share button in your browser, then choose "Add to Home Screen".</p>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1 bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg px-2 py-1">
                    <Share size={12} className="text-[#c9a84c]" />
                    <span className="text-xs text-[#9ca3af]">Share</span>
                  </div>
                  <span className="text-xs text-[#4b5563]">→</span>
                  <div className="flex items-center gap-1 bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg px-2 py-1">
                    <Plus size={12} className="text-[#c9a84c]" />
                    <span className="text-xs text-[#9ca3af]">Add to Home Screen</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-[#111111] border-t border-[#2a2a2a] flex items-center px-4 py-3 gap-3">
            <button
              onClick={handleBarTap}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#800000] hover:bg-[#600000] active:bg-[#500000] text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <Download size={16} />
              Download Our App
            </button>
            <button
              onClick={dismissBar}
              className="text-[#4b5563] hover:text-[#9ca3af] transition-colors p-2"
              aria-label="Dismiss"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
