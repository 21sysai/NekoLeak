
/**
 * NEKOLEAK Nexus-6 Security Protocol (v3.7)
 */

const SESSION_WINDOW = 75; 
const EPOCH = new Date('2024-01-01T00:00:00Z').getTime();

export const Security = {
  VERSION: 'v3.7-NATIVE',

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
    return `NX-${base}${checksum}`;
  },

  verifySecureKey: (key: string): { isValid: boolean; reason?: string } => {
    const k = (key || '').toUpperCase().trim();
    if (!k.startsWith('NX-')) {
      return { isValid: false, reason: 'INVALID PROTOCOL PREFIX' };
    }
    if (k.length !== 9) {
      return { isValid: false, reason: 'INVALID PAYLOAD STRUCTURE' };
    }
    const body = k.substring(3);
    const base = body.substring(0, 5);
    const providedCheck = body.substring(5);
    const expectedCheck = Security.calculateChecksum(base);
    if (expectedCheck !== providedCheck) {
      return { isValid: false, reason: 'CHECKSUM CORRUPTED' };
    }
    const timePart = base.substring(3);
    const keyMinutes = parseInt(timePart, 36);
    const currentMinutes = Math.floor((Date.now() - EPOCH) / 60000) % 1296;
    let diff = currentMinutes - keyMinutes;
    if (diff < 0) diff += 1296; 
    if (diff > SESSION_WINDOW) {
      return { isValid: false, reason: 'SESSION EXPIRED' };
    }
    return { isValid: true };
  }
};
