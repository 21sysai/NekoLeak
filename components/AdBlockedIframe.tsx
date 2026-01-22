// ========================================
// FILE BARU: components/AdBlockedIframe.tsx
// Komponen wrapper iframe dengan ad-blocking untuk Vercel deployment
// ========================================

import React, { useEffect, useRef } from 'react';

interface Props {
  src: string;
  className?: string;
}

export const AdBlockedIframe: React.FC<Props> = ({ src, className = '' }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    const container = containerRef.current;
    if (!iframe || !container) return;

    // Monitor dan hapus overlay ads yang muncul di luar iframe
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const element = node as HTMLElement;
            
            // Deteksi suspicious overlay patterns
            const style = window.getComputedStyle(element);
            const isSuspicious = 
              (style.position === 'fixed' || style.position === 'absolute') &&
              (parseInt(style.zIndex) > 1000) &&
              (element.innerHTML.includes('ad') || 
               element.className.includes('ad') ||
               element.id.includes('ad'));

            if (isSuspicious) {
              console.log('🚫 Blocked overlay ad element');
              element.remove();
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Block popup attempts
    const originalWindowOpen = window.open;
    window.open = function(...args) {
      const url = args[0]?.toString() || '';
      // Allow legitimate fullscreen/player popups, block ads
      if (url.includes('ad') || url.includes('pop') || url.includes('banner')) {
        console.log('🚫 Blocked popup:', url);
        return null;
      }
      return originalWindowOpen.apply(this, args);
    };

    // Cleanup click events on suspicious elements
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isAd = 
        target.className?.includes('ad') ||
        target.id?.includes('ad') ||
        target.getAttribute('data-ad') !== null;

      if (isAd) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🚫 Blocked ad click');
      }
    };

    container.addEventListener('click', handleClick, true);

    return () => {
      observer.disconnect();
      container.removeEventListener('click', handleClick, true);
    };
  }, [src]);

  // Inject CSS untuk block common ad patterns
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Block common ad containers in parent document */
      [class*="ad-overlay"],
      [class*="popup-ad"],
      [id*="ad-overlay"],
      [id*="popup-ad"],
      div[style*="position: fixed"][style*="z-index: 999"],
      div[style*="position: fixed"][style*="z-index: 9999"] {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }

      /* Prevent body scroll lock from ads */
      body.modal-open,
      body.no-scroll {
        overflow: auto !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <iframe
        ref={iframeRef}
        src={src}
        className={className}
        allowFullScreen
        frameBorder="0"
        sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
        referrerPolicy="no-referrer"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
};