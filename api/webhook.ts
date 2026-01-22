
import { IncomingMessage, ServerResponse } from 'http';
import https from 'https';

// --- SECURITY PROTOCOL v3.8 (SYNCED) ---
const SESSION_WINDOW = 10; // Expire in 10 minutes
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
    const payload = {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    };

    const data = JSON.stringify(payload);

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${token}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
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

  if (req.method !== 'POST') {
    return res.status(200).json({
      status: "ONLINE",
      node: "NEKOLEAK-NEXUS-3.8",
      diagnostics: {
        token_present: !!TELEGRAM_TOKEN,
        node_version: (process as any).version
      }
    });
  }

  try {
    const body = req.body;
    if (!body || !body.message) {
      return res.status(200).send('No payload');
    }

    const chatId = body.message.chat.id;
    const incomingText = (body.message.text || '').toLowerCase();

    if (!TELEGRAM_TOKEN) {
      return res.status(200).send('Config error');
    }

    if (incomingText === '/ping') {
      await sendTelegramMessage(TELEGRAM_TOKEN, chatId, '<b>PONG!</b>\nNexus Node v3.8 Operational.');
      return res.status(200).send('OK');
    }

    if (incomingText.includes('/start') || incomingText.includes('key') || incomingText.includes('kunci') || incomingText.includes('akses')) {
      const key = SecurityCore.generateSecureKey();
      const msg = `
<b>━━━━━━━━━━━━━━━</b>
<b>🐱 NEKOLEAK ACCESS GRANTED</b>
<b>━━━━━━━━━━━━━━━</b>

<b>🔑 ACCESS KEY:</b>
<code>${key}</code>

<b>⏳ VALIDITY:</b> 10 MINUTES
<b>🌐 PROTOCOL:</b> v3.8-NATIVE

<i>Click the key above to copy it automatically. This key will expire in 10 minutes. Enter it into the terminal to synchronize.</i>
      `.trim();
      
      await sendTelegramMessage(TELEGRAM_TOKEN, chatId, msg);
    }

    return res.status(200).send('OK');
  } catch (error: any) {
    console.error('WEBHOOK_CRASH:', error.message);
    return res.status(200).json({ status: "error_handled", detail: error.message });
  }
}
