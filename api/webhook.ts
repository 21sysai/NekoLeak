
export default async function handler(req: any, res: any) {
  // Gunakan Token dari Env atau Fallback ke token yang Anda berikan
  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '8567142923:AAGKrnBvf5Xp2hthiZd5HeQFLgK0bYlaZMI';
  
  // Telegram hanya mengirim via POST
  if (req.method !== 'POST') {
    return res.status(200).json({ status: 'Webhook Active', timestamp: new Date().toISOString() });
  }

  try {
    // Pastikan body terurai. Beberapa environment mengirimkan body sebagai string.
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    console.log('--- Incoming Telegram Update ---');
    console.log(JSON.stringify(body, null, 2));

    if (!body || !body.message) {
      return res.status(200).send('No message payload');
    }

    const chatId = body.message.chat.id;
    const text = (body.message.text || '').trim().toLowerCase();

    // Logika pengecekan perintah (Start, Request, Key, Kunci)
    if (text.includes('/start') || text.includes('/request') || text.includes('key') || text.includes('kunci')) {
      
      // Generate Key Baru (NK-XXXXXX)
      const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
      const generatedKey = `NK-${randomStr}`;

      // Menggunakan HTML agar tidak error jika ada karakter khusus seperti simbol minus atau titik
      const replyHTML = `
<b>🐱 ACCESS GRANTED 🐱</b>

<b>Protocol:</b> Identity Verification
<b>Your Access Key:</b> <code>${generatedKey}</code> (Tap to copy)

Gunakan kunci di atas pada portal <b>NEKOLEAK</b> untuk membuka akses database.

<i>NEKOLEAK OPS - Nexus 2026</i>
      `.trim();

      const tgUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
      
      console.log(`Sending reply to ChatID: ${chatId}`);
      
      const tgRes = await fetch(tgUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: replyHTML,
          parse_mode: 'HTML'
        }),
      });
      
      const tgData = await tgRes.json();
      console.log('Telegram Response:', JSON.stringify(tgData));
      
      if (!tgData.ok) {
        throw new Error(`Telegram API Error: ${tgData.description}`);
      }
    } else if (text) {
      // Opsi: Berikan respon jika perintah tidak dikenal agar user tahu bot aktif
      const helpUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
      await fetch(helpUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: 'Unknown Command. Kirim <b>/start</b> atau <b>/request</b> untuk mendapatkan kunci akses.',
          parse_mode: 'HTML'
        }),
      });
    }

    return res.status(200).send('OK');

  } catch (error: any) {
    console.error('CRITICAL WEBHOOK ERROR:', error.message);
    // Tetap kirim 200 ke Telegram agar mereka tidak mencoba mengirim ulang pesan error yang sama terus menerus
    return res.status(200).json({ error: error.message });
  }
}
