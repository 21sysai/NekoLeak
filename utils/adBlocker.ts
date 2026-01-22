
// ========================================
// FILE: utils/adBlocker.ts
// Ad blocking utility with robust network request interception
// Compatible with Vercel and restrictive browser environments
// ========================================

const AD_DOMAINS = [
  'doubleclick.net',
  'googlesyndication.com',
  'googleadservices.com',
  'google-analytics.com',
  'googletagmanager.com',
  'adnxs.com',
  'advertising.com',
  'exoclick.com',
  'popcash.net',
  'popads.net',
  'propellerads.com',
  'adsterra.com',
  'clickadu.com',
  'hilltopads.net',
  'juicyads.com',
  'trafficjunky.com',
  'tubecorporate.com',
];

const AD_PATTERNS = [
  /\/ads\//i,
  /\/ad\//i,
  /\/banner/i,
  /\/popup/i,
  /-ad-/i,
  /-ads-/i,
  /advertisement/i,
  /promo\./i,
  /tracking\./i,
  /analytic/i,
];

export class AdBlocker {
  private static blockedCount = 0;
  private static initialized = false;

  /**
   * Check if URL should be blocked
   */
  static shouldBlock(url: string): boolean {
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
   * Initialize ad blocker - intercept network requests safely
   */
  static initialize(): void {
    if (this.initialized) return;
    this.initialized = true;

    // Intercept fetch API using Object.defineProperty to bypass "getter-only" restrictions
    try {
      const originalFetch = window.fetch;
      if (typeof originalFetch === 'function') {
        Object.defineProperty(window, 'fetch', {
          configurable: true,
          enumerable: true,
          writable: true,
          value: function(...args: any[]): Promise<Response> {
            const input = args[0];
            const url = typeof input === 'string' ? input : (input && (input as Request).url) ? (input as Request).url : '';
            
            if (AdBlocker.shouldBlock(url)) {
              AdBlocker.blockedCount++;
              console.debug(`🚫 [AdBlocker] Blocked fetch:`, url);
              return Promise.resolve(new Response('', {
                status: 200,
                statusText: 'Blocked by AdBlocker',
              }));
            }
            return originalFetch.apply(this, args);
          }
        });
      }
    } catch (e) {
      console.warn('⚠️ [AdBlocker] Failed to intercept fetch:', e);
    }

    // Intercept XMLHttpRequest safely
    try {
      const originalOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method: string, url: string | URL, ...rest: any[]): void {
        const urlString = url.toString();
        if (AdBlocker.shouldBlock(urlString)) {
          AdBlocker.blockedCount++;
          console.debug(`🚫 [AdBlocker] Blocked XHR:`, urlString);
          // Set a flag to ignore subsequent calls on this instance
          (this as any)._blockedByAdBlocker = true;
          return;
        }
        return originalOpen.apply(this, [method, url, ...rest]);
      };

      const originalSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.send = function(body?: Document | XMLHttpRequestBodyInit | null): void {
        if ((this as any)._blockedByAdBlocker) {
          return;
        }
        return originalSend.apply(this, [body]);
      };
    } catch (e) {
      console.warn('⚠️ [AdBlocker] Failed to intercept XHR:', e);
    }

    // Block script injection safely
    try {
      const originalCreateElement = document.createElement;
      document.createElement = function(tagName: string, ...args: any[]): any {
        const element = originalCreateElement.apply(document, [tagName, ...args]);
        
        if (tagName.toLowerCase() === 'script') {
          const originalSetAttribute = element.setAttribute;
          element.setAttribute = function(name: string, value: string) {
            if (name === 'src' && AdBlocker.shouldBlock(value)) {
              AdBlocker.blockedCount++;
              console.debug(`🚫 [AdBlocker] Blocked script injection:`, value);
              return;
            }
            return originalSetAttribute.apply(this, [name, value]);
          };
          
          // Also catch direct .src assignment
          Object.defineProperty(element, 'src', {
            set: function(value: string) {
              if (AdBlocker.shouldBlock(value)) {
                AdBlocker.blockedCount++;
                console.debug(`🚫 [AdBlocker] Blocked script .src:`, value);
                return;
              }
              this.setAttribute('src', value);
            },
            configurable: true
          });
        }
        return element;
      };
    } catch (e) {
      console.warn('⚠️ [AdBlocker] Failed to intercept createElement:', e);
    }

    console.log('🛡️ [AdBlocker] Initialization attempt finished');
  }

  static getStats(): { blockedCount: number } {
    return { blockedCount: AdBlocker.blockedCount };
  }

  static injectCSS(): void {
    try {
      if (document.getElementById('adblocker-css')) return;
      const style = document.createElement('style');
      style.id = 'adblocker-css';
      style.textContent = `
        [class*="ad-container"], [class*="advertisement"], [class*="ad-wrapper"],
        [class*="ad-banner"], [class*="ads-"], [id*="ad-container"],
        [id*="advertisement"], [id*="google_ads"], [id*="ads-"],
        .ad, .ads, .adsbygoogle, iframe[src*="doubleclick"],
        iframe[src*="googlesyndication"], iframe[src*="advertising"] {
          display: none !important;
          visibility: hidden !important;
          pointer-events: none !important;
          height: 0 !important;
          width: 0 !important;
        }
        div[style*="z-index: 9999"], div[style*="z-index: 999999"] {
          display: none !important;
        }
        body.noscroll, body.modal-open, html.noscroll {
          overflow: auto !important;
        }
      `;
      document.head.appendChild(style);
    } catch (e) {
      console.warn('⚠️ [AdBlocker] Failed to inject CSS:', e);
    }
  }
}
