
import { Security } from '../utils/security';

export default async function handler(req: any, res: any) {
  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  
  if (req.method !== 'POST') {
    return res.status(200).json({ 
      status: 'Nexus Bot Active',
      version: Security.VERSION,
      info: 'This endpoint must be called via Telegram Webhook'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!body?.message) return res.status(200).send('No payload');

    const chatId = body.message.chat.id;
    const text = (body.message.text || '').toLowerCase();

    if (text.includes('/start') || text.includes('key') || text.includes('kunci')) {
      const accessKey = Security.generateSecureKey();
      
      const responseText = `
<b>🐱 NEKOLEAK FORCE-SYNC v3.2 🐱</b>

<b>Access Key:</b> <code>${accessKey}</code>
<b>Validity:</b> 75 Minutes
<b>Node:</b> ${Security.VERSION}

<i>Jika Anda masih melihat awalan NK-, berarti Anda belum mengupdate URL Webhook Bot ke project baru ini.</i>

<b>Diagnostic Info:</b>
Timestamp: ${new Date().toISOString()}
Protocol: NX-Hyperlink
      `.trim();

      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: responseText,
          parse_mode: 'HTML'
        }),
      });
    }

    return res.status(200).send('OK');
  } catch (error: any) {
    return res.status(200).json({ error: error.message });
  }
}
