
import { Security } from '../utils/security';

export default async function handler(req: any, res: any) {
  // Always log the start of a request for debugging in Vercel logs
  console.log(`[Webhook] Incoming ${req.method} request`);

  const token = process.env.TELEGRAM_TOKEN;

  // 1. Handle non-POST requests (Health checks / Diagnostics)
  if (req.method !== 'POST') {
    return res.status(200).json({
      status: 'Nexus Node Active',
      protocol: Security.VERSION,
      configured: !!token,
      timestamp: new Date().toISOString()
    });
  }

  // 2. Main Logic with Global Protection
  try {
    if (!token) {
      console.error('[Critical] TELEGRAM_TOKEN is missing');
      return res.status(200).send('Config Missing');
    }

    // Vercel usually parses req.body automatically if it's application/json
    const body = req.body;
    
    if (!body || (!body.message && !body.callback_query)) {
      console.warn('[Webhook] No valid message/callback detected');
      return res.status(200).send('No data');
    }

    const message = body.message || body.callback_query?.message;
    const chatId = message?.chat?.id;
    const text = (body.message?.text || '').toLowerCase();

    if (!chatId) {
      return res.status(200).send('No chat ID');
    }

    // Ping check
    if (text === '/ping') {
      await sendTelegram(chatId, `<b>PONG!</b>\nNode: <code>${Security.VERSION}</code>\nStatus: 🟢 Clear`, token);
      return res.status(200).send('OK');
    }

    // Start / Key logic
    if (text.includes('/start') || text.includes('key') || text.includes('kunci')) {
      const accessKey = Security.generateSecureKey();
      const responseText = `
<b>🐱 NEKOLEAK NEXUS v3.6</b>

<b>Access Key:</b> <code>${accessKey}</code>
<b>Berlaku:</b> 75 Menit
<b>Protocol:</b> ${Security.VERSION}

<i>Gunakan key di atas untuk menginisialisasi terminal login.</i>

<b>Diagnostic Info:</b>
Node: Quantum-Sync
Region: Global
      `.trim();

      await sendTelegram(chatId, responseText, token);
    }

    return res.status(200).send('OK');
  } catch (error: any) {
    // CRITICAL: We catch EVERYTHING and still return 200.
    // This prevents Vercel 500 errors from triggering Telegram's retry policy
    // which usually leads to "Function Invocation Failed" due to rate limiting/cascading failures.
    console.error('[Webhook Crash]', error.message);
    return res.status(200).json({ 
      error: true, 
      message: 'Internal processing error handled' 
    });
  }
}

/**
 * Robust Telegram Sender
 */
async function sendTelegram(chatId: number, text: string, token: string) {
  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      console.error('[Telegram API Error]', details);
    }
  } catch (e: any) {
    console.error('[Fetch Error]', e.message);
  }
}
