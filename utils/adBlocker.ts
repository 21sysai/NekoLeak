// ========================================
// FILE BARU: utils/adBlocker.ts
// Ad blocking utility dengan network request interception
// Compatible dengan Vercel deployment
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

  /**
   * Check if URL should be blocked
   */
  static shouldBlock(url: string): boolean {
    try {
      const urlObj = new URL(url);
      
      // Check domain blacklist
      if (AD_DOMAINS.some(domain => urlObj.hostname.includes(domain))) {
        return true;
      }

      // Check pattern blacklist
      if (AD_PATTERNS.some(pattern => pattern.test(url))) {
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * Initialize ad blocker - intercept network requests
   */
  static initialize(): void {
    // Intercept fetch API
    const originalFetch = window.fetch;
    window.fetch = function(...args): Promise<Response> {
      const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || '';
      
      if (AdBlocker.shouldBlock(url)) {
        AdBlocker.blockedCount++;
        console.log(`🚫 [AdBlocker] Blocked fetch request #${AdBlocker.blockedCount}:`, url);
        
        // Return empty response
        return Promise.resolve(new Response('', {
          status: 200,
          statusText: 'Blocked by AdBlocker',
        }));
      }
      
      return originalFetch.apply(this, args);
    };

    // Intercept XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method: string, url: string, ...rest: any[]): void {
      if (AdBlocker.shouldBlock(url)) {
        AdBlocker.blockedCount++;
        console.log(`🚫 [AdBlocker] Blocked XHR request #${AdBlocker.blockedCount}:`, url);
        
        // Abort the request
        this.abort = function() {};
        return;
      }
      
      return originalOpen.apply(this, [method, url, ...rest]);
    };

    // Block script injection
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName: string, ...args: any[]): any {
      const element = originalCreateElement.apply(document, [tagName, ...args]);
      
      if (tagName.toLowerCase() === 'script') {
        const originalSetAttribute = element.setAttribute;
        element.setAttribute = function(name: string, value: string) {
          if (name === 'src' && AdBlocker.shouldBlock(value)) {
            AdBlocker.blockedCount++;
            console.log(`🚫 [AdBlocker] Blocked script injection #${AdBlocker.blockedCount}:`, value);
            return;
          }
          return originalSetAttribute.apply(this, [name, value]);
        };
      }
      
      return element;
    };

    console.log('✅ [AdBlocker] Initialized successfully');
  }

  /**
   * Get statistics
   */
  static getStats(): { blockedCount: number } {
    return { blockedCount: AdBlocker.blockedCount };
  }

  /**
   * Reset statistics
   */
  static resetStats(): void {
    AdBlocker.blockedCount = 0;
  }

  /**
   * Inject CSS to block common ad elements
   */
  static injectCSS(): void {
    const style = document.createElement('style');
    style.id = 'adblocker-css';
    style.textContent = `
      /* Block common ad containers */
      [class*="ad-container"],
      [class*="advertisement"],
      [class*="ad-wrapper"],
      [class*="ad-banner"],
      [class*="ads-"],
      [id*="ad-container"],
      [id*="advertisement"],
      [id*="google_ads"],
      [id*="ads-"],
      .ad, .ads, .adsbygoogle,
      iframe[src*="doubleclick"],
      iframe[src*="googlesyndication"],
      iframe[src*="advertising"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        width: 0 !important;
        position: absolute !important;
        left: -9999px !important;
        pointer-events: none !important;
      }

      /* Block popup overlays */
      div[style*="position: fixed"][style*="z-index: 9999"],
      div[style*="position: fixed"][style*="z-index: 999999"] {
        display: none !important;
      }

      /* Restore body scroll */
      body.noscroll,
      body.modal-open,
      html.noscroll {
        overflow: auto !important;
      }
    `;
    
    document.head.appendChild(style);
    console.log('✅ [AdBlocker] CSS injected');
  }
}