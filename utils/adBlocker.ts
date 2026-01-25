// utils/adBlocker.ts

// --- Konfigurasi Pemblokiran Agresif v2026 ---

// Daftar domain yang diperluas
const AD_DOMAINS = [
  'doubleclick.net', 'googlesyndication.com', 'googleadservices.com',
  'google-analytics.com', 'googletagmanager.com', 'adnxs.com', 'advertising.com',
  'exoclick.com', 'popcash.net', 'popads.net', 'propellerads.com',
  'adsterra.com', 'clickadu.com', 'hilltopads.net', 'juicyads.com',
  'trafficjunky.com', 'tubecorporate.com', 'ad-maven.com', 'ero-advertising.com',
  'trafficforce.com', 'adform.net', 'criteo.com', 'outbrain.com', 'taboola.com'
];

// Pola URL yang diperluas
const AD_PATTERNS = [
  /\/ads?\//i, /\/banner/i, /\/popup/i, /-ad[sx]?-/i, /advertisement/i,
  /promo\./i, /tracking\./i, /analytic/i, /delivery/i, /syndication/i,
  /adserver/i, /track\.js/i
];

// Selektor CSS untuk injeksi dan pengamatan DOM
const AD_SELECTORS = [
  '[class*="ad-container"]', '[class*="advertisement"]', '[class*="ad-wrapper"]',
  '[class*="ad-banner"]', '[class*="ads-"]', '[id*="ad-container"]',
  '[id*="advertisement"]', '[id*="google_ads"]', '[id*="ads-"]',
  '.ad', '.ads', '.adsbygoogle', 'iframe[src*="doubleclick"]',
  'iframe[src*="googlesyndication"]', 'iframe[src*="advertising"]',
  'div[style*="z-index: 9999"]', 'div[style*="z-index: 999999"]',
  '[class*="overlay-ad"]', '[id*="pop-ad"]', '[class*="sticky-ad"]'
];

// --- Kelas Utama AdBlocker ---

export class AdBlocker {
  private static blockedCount = 0;
  private static initialized = false;

  private static shouldBlock(url: string): boolean {
    if (!url) return false;
    try {
      const urlString = String(url);
      const isBlocked = AD_DOMAINS.some(domain => urlString.includes(domain)) ||
                       AD_PATTERNS.some(pattern => pattern.test(urlString));
      return isBlocked;
    } catch {
      return false;
    }
  }

  /**
   * Inisialisasi utama untuk semua modul pemblokiran.
   */
  static initialize(): void {
    if (this.initialized) return;
    this.initialized = true;

    this.interceptNetworkRequests();
    this.interceptScriptInjection();
    this.overrideWindowOpen();
    this.initializeDOMObserver();

    console.log('🛡️ [AdBlocker v2026] Protokol pertahanan agresif telah diaktifkan.');
  }
  
  /**
   * Mencegat permintaan jaringan (Fetch & XHR).
   */
  private static interceptNetworkRequests(): void {
    try {
      const originalFetch = window.fetch;
      Object.defineProperty(window, 'fetch', {
        writable: true, configurable: true,
        value: function(...args: any[]): Promise<Response> {
          const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request)?.url || '';
          if (AdBlocker.shouldBlock(url)) {
            AdBlocker.blockedCount++;
            return Promise.resolve(new Response(null, { status: 204, statusText: 'Blocked by NEKOLEAK Shield' }));
          }
          return originalFetch.apply(this, args);
        }
      });
    } catch (e) { console.warn('[AdBlocker] Gagal mencegat Fetch:', e); }

    try {
      const originalOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method: string, url: string | URL, ...rest: any[]): void {
        if (AdBlocker.shouldBlock(url.toString())) {
          (this as any)._blocked = true;
        } else {
          originalOpen.apply(this, [method, url, ...rest]);
        }
      };
      const originalSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.send = function(...args: any[]): void {
        if (!(this as any)._blocked) {
          originalSend.apply(this, args);
        } else {
            AdBlocker.blockedCount++;
        }
      };
    } catch (e) { console.warn('[AdBlocker] Gagal mencegat XHR:', e); }
  }

  /**
   * Mencegat pembuatan elemen <script>.
   */
  private static interceptScriptInjection(): void {
    try {
      const originalCreate = document.createElement;
      document.createElement = function(tagName: string, ...options: any[]): HTMLElement {
        const element = originalCreate.call(this, tagName, ...options);
        if (tagName.toLowerCase() === 'script') {
          Object.defineProperty(element, 'src', {
            set: (value: string) => {
              if (AdBlocker.shouldBlock(value)) {
                AdBlocker.blockedCount++;
              } else {
                element.setAttribute('src', value);
              }
            },
            configurable: true
          });
        }
        return element;
      };
    } catch (e) { console.warn('[AdBlocker] Gagal mencegat createElement:', e); }
  }

  /**
   * Mengganti window.open untuk memblokir pop-up/pop-under.
   */
  private static overrideWindowOpen(): void {
    try {
      const originalOpen = window.open;
      window.open = function(...args: any[]): Window | null {
        const url = args[0] || '';
        // Logika pemblokiran yang lebih longgar untuk memungkinkan fungsionalitas pemutar
        if (url && AdBlocker.shouldBlock(url.toString())) {
          console.log('🚫 [AdBlocker] Pop-up diblokir:', url);
          AdBlocker.blockedCount++;
          return null;
        }
        return originalOpen.apply(this, args);
      };
    } catch (e) { console.warn('[AdBlocker] Gagal menimpa window.open:', e); }
  }

  /**
   * Menginisialisasi MutationObserver untuk secara proaktif menghapus elemen iklan
   * yang ditambahkan ke DOM secara dinamis.
   */
  private static initializeDOMObserver(): void {
    try {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Hanya elemen
              const element = node as HTMLElement;
              const adSelectors = AD_SELECTORS.join(',');
              
              // Cek elemen itu sendiri dan turunannya
              const elementsToCheck = [element, ...Array.from(element.querySelectorAll(adSelectors))];

              elementsToCheck.forEach(el => {
                if (el instanceof HTMLElement && el.matches(adSelectors)) {
                  console.log('🚫 [AdBlocker] Elemen iklan dinamis dihapus:', el.tagName, el.id, el.className);
                  el.style.setProperty('display', 'none', 'important');
                  el.style.setProperty('visibility', 'hidden', 'important');
                  el.remove();
                  AdBlocker.blockedCount++;
                }
              });
            }
          });
        });
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    } catch (e) { console.warn('[AdBlocker] Gagal menginisialisasi DOM Observer:', e); }
  }

  static getStats(): { blockedCount: number } {
    return { blockedCount: AdBlocker.blockedCount };
  }

  /**
   * Menyuntikkan CSS untuk menyembunyikan elemen iklan sebelum skrip berjalan.
   */
  static injectCSS(): void {
    try {
      if (document.getElementById('adblocker-css')) return;
      const style = document.createElement('style');
      style.id = 'adblocker-css';
      style.textContent = `
        ${AD_SELECTORS.join(',\n')} {
          display: none !important;
          visibility: hidden !important;
          pointer-events: none !important;
          width: 0 !important;
          height: 0 !important;
          opacity: 0 !important;
        }
        body.noscroll, body.modal-open, html.noscroll {
          overflow: auto !important;
        }
      `;
      document.head.appendChild(style);
    } catch (e) { console.warn('[AdBlocker] Gagal menyuntikkan CSS:', e); }
  }
}
