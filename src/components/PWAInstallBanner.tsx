'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Share, Plus } from 'lucide-react';

const DISMISS_KEY = 'bom_pwa_dismissed';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallBanner() {
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Don't show if already dismissed or already installed
    if (localStorage.getItem(DISMISS_KEY)) return;
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // Only show on mobile
    const isMobile = window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);
    if (!isMobile) return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window.navigator as unknown as { standalone?: boolean }).standalone;
    setIsIOS(ios);

    if (ios) {
      // iOS: show instructions banner after a short delay
      setTimeout(() => setShow(true), 2000);
    } else {
      // Android/Chrome: wait for the install prompt event
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setTimeout(() => setShow(true), 2000);
      };
      window.addEventListener('beforeinstallprompt', handler);
      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, '1');
    setShow(false);
  }

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') localStorage.setItem(DISMISS_KEY, '1');
    setShow(false);
    setDeferredPrompt(null);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
        {/* Maroon accent bar */}
        <div className="h-1 bg-[#800000]" />

        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* App icon */}
            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-[#2a2a2a]">
              <Image src="/icon-512.png" alt="Bayou OM" width={48} height={48} className="object-cover" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#f5f5f5] text-sm leading-tight">Add to Home Screen</p>
              <p className="text-[#9ca3af] text-xs mt-0.5 leading-relaxed">
                {isIOS
                  ? 'Tap the share button below, then "Add to Home Screen" for quick access.'
                  : 'Install the Bayou OM app for faster access on your phone.'}
              </p>

              {/* iOS share icon hint */}
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

            {/* Dismiss */}
            <button
              onClick={dismiss}
              className="text-[#4b5563] hover:text-[#9ca3af] transition-colors flex-shrink-0 p-1 -mt-0.5"
            >
              <X size={16} />
            </button>
          </div>

          {/* Android install button */}
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
  );
}
