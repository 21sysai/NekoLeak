
/**
 * NEKOLEAK Nexus-6 Security Protocol (v3.5)
 * Architecture: Quantum-Sync Atomic Sum
 * Version: 2026.03.14-QUANTUM
 */

const SESSION_WINDOW = 75; 
const EPOCH = new Date('2024-01-01T00:00:00Z').getTime();

export const Security = {
  /**
   * Versi Protokol untuk Verifikasi
   */
  VERSION: 'v3.5-QUANTUM',

  calculateChecksum: (base: string): string => {
    const sum = base.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (sum % 36).toString(36).toUpperCase();
  },

  generateSecureKey: (): string => {
    const cryptoChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let salt = '';
    for (let i = 0; i < 3; i++) {
      salt += cryptoChars.charAt(Math.floor(Math.random() * cryptoChars.length));
    }

    const minutes = Math.floor((Date.now() - EPOCH) / 60000);
    const timeCode = (minutes % 1296).toString(36).toUpperCase().padStart(2, '0');

    const base = salt + timeCode;
    const checksum = Security.calculateChecksum(base);

    // KUNCI MATI: Hanya NX- yang diperbolehkan keluar dari sistem ini.
    return `NX-${base}${checksum}`;
  },

  verifySecureKey: (key: string): { isValid: boolean; reason?: string } => {
    const k = (key || '').toUpperCase().trim();
    
    if (!k.startsWith('NX-')) {
      return { 
        isValid: false, 
        reason: k.startsWith('NK-') ? 'PROTOCOL OUTDATED (EXPECTING NX-)' : 'TERMINAL ID INVALID' 
      };
    }

    if (k.length !== 9) {
      return { isValid: false, reason: 'PAYLOAD LENGTH MISMATCH' };
    }

    const body = k.substring(3);
    const base = body.substring(0, 5);
    const providedCheck = body.substring(5);
    
    const expectedCheck = Security.calculateChecksum(base);
    if (expectedCheck !== providedCheck) {
      return { isValid: false, reason: 'CHECKSUM CORRUPTION' };
    }

    const timePart = base.substring(3);
    const keyMinutes = parseInt(timePart, 36);
    const currentMinutes = Math.floor((Date.now() - EPOCH) / 60000) % 1296;

    let diff = currentMinutes - keyMinutes;
    if (diff < 0) diff += 1296; 

    if (diff > SESSION_WINDOW) {
      return { isValid: false, reason: 'SESSION TIMED OUT' };
    }

    return { isValid: true };
  }
};
