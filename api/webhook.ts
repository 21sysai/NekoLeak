
import { Security } from '../utils/security';

export default async function handler(req: any, res: any) {
  const token = process.env.TELEGRAM_TOKEN;
  
  // Respon cepat untuk GET (Diagnostik Browser)
  if (req.method !== 'POST') {
    return res.status(200).json({ 
      node: 'NEKOLEAK NEXUS',
      status: 'OPERATIONAL',
      version: Security.VERSION,
      env_check: token ? 'TOKEN_LOADED' : 'TOKEN_MISSING'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    if (!body || !body.message) {
      return res.status(200).send('Empty Payload');
    }

    const chatId = body.message.chat.id;
    const text = (body.message.text || '').toLowerCase();

    // Diagnostik Ping
    if (text === '/ping') {
      await sendResponse(chatId, `<b>PONG!</b>\nNode: <code>${Security.VERSION}</code>\nStatus: 🟢 Clear`, token);
      return res.status(200).send('OK');
    }

    if (text.includes('/start') || text.includes('key') || text.includes('kunci')) {
      const accessKey = Security.generateSecureKey();
      
      const responseText = `
<b>🐱 NEKOLEAK NEXUS v3.5 🐱</b>

<b>Access Key:</b> <code>${accessKey}</code>
<b>Berlaku:</b> 75 Menit
<b>Protocol:</b> ${Security.VERSION}

<i>Jika Anda masih melihat NK-, hubungi admin untuk sinkronisasi webhook ulang.</i>

<b>Diagnostic Info:</b>
ID: ${chatId}
Node: Quantum-Sync
      `.trim();

      await sendResponse(chatId, responseText, token);
    }

    return res.status(200).send('OK');
  } catch (error: any) {
    console.error('Webhook Failure:', error.message);
    return res.status(200).json({ error: 'Internal logic crash' });
  }
}

async function sendResponse(chatId: number, text: string, token: string | undefined) {
  if (!token) {
    console.error('CRITICAL: TELEGRAM_TOKEN IS NOT SET');
    return;
  }

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
      }),
    });
  } catch (e) {
    console.error('Failed to send telegram message', e);
  }
}
