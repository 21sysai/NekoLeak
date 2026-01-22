
import { Security } from '../utils/security';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { key } = req.body;

  if (!key) {
    return res.status(400).json({ valid: false, message: 'IDENTITAS DIBUTUHKAN' });
  }

  const result = Security.verifySecureKey(key.toUpperCase());

  if (result.isValid) {
    return res.status(200).json({ 
      valid: true, 
      message: 'AKSES DIBERIKAN. NODE TERVERIFIKASI.' 
    });
  }

  return res.status(401).json({ 
    valid: false, 
    message: result.reason || 'AKSES DITOLAK' 
  });
}
