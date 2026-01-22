
import { IncomingMessage, ServerResponse } from 'http';
import https from 'https';

// --- SECURITY PROTOCOL v3.7 (SYNCED) ---
const SESSION_WINDOW = 75;
const EPOCH = new Date('2024-01-01T00:00:00Z').getTime();

const SecurityCore = {
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
    const checksum = SecurityCore.calculateChecksum(base);
    return `NX-${base}${checksum}`;
  }
};

// --- TELEGRAM SENDER (NATIVE HTTPS) ---
function sendTelegramMessage(token: string, chatId: number, text: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML'
    });

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${token}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => resolve(JSON.parse(responseBody)));
    });

    req.on('error', (error) => reject(error));
    req.write(data);
    req.end();
  });
}

// --- MAIN HANDLER ---
export default async function handler(req: any, res: any) {
  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

  // 1. Diagnostics (GET Request)
  if (req.method !== 'POST') {
    return res.status(200).json({
      status: "ONLINE",
      node: "NEKOLEAK-NEXUS-3.7",
      diagnostics: {
        token_present: !!TELEGRAM_TOKEN,
        token_length: TELEGRAM_TOKEN ? TELEGRAM_TOKEN.length : 0,
        // Fix: Use type assertion to access Node version in restricted environments
        env_node_version: (process as any).version || 'unknown'
      }
    });
  }

  try {
    const body = req.body;
    if (!body || !body.message) {
      return res.status(200).send('No payload');
    }

    const chatId = body.message.chat.id;
    const text = (body.message.text || '').toLowerCase();

    if (!TELEGRAM_TOKEN) {
      console.error('CRITICAL: TELEGRAM_TOKEN is missing');
      return res.status(200).send('Config error');
    }

    // Command: /ping
    if (text === '/ping') {
      await sendTelegramMessage(TELEGRAM_TOKEN, chatId, '<b>PONG!</b>\nNexus Node v3.7 Operational.');
      return res.status(200).send('OK');
    }

    // Command: /start or key
    if (text.includes('/start') || text.includes('key') || text.includes('kunci')) {
      const key = SecurityCore.generateSecureKey();
      const msg = `
<b>🐱 NEKOLEAK ACCESS GRANTED</b>

<b>Access Key:</b> <code>${key}</code>
<b>Validity:</b> 75 Minutes
<b>Protocol:</b> v3.7-NATIVE

<i>Gunakan key di atas untuk masuk ke database.</i>
      `.trim();
      
      await sendTelegramMessage(TELEGRAM_TOKEN, chatId, msg);
    }

    return res.status(200).send('OK');
  } catch (error: any) {
    console.error('WEBHOOK_CRASH:', error.message);
    // Selalu kirim 200 agar Telegram berhenti mencoba ulang request yang error
    return res.status(200).json({ status: "error_handled", detail: error.message });
  }
}
