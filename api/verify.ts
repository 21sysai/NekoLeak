
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { key } = req.body;

  if (!key) {
    return res.status(400).json({ valid: false, message: 'KEY REQUIRED' });
  }

  const keyPattern = /^NK-[A-Z0-9]{6}$/;
  const isValid = keyPattern.test(key);

  if (isValid) {
    return res.status(200).json({ 
      valid: true, 
      message: 'IDENTITY VERIFIED. ACCESS GRANTED.' 
    });
  }

  return res.status(401).json({ 
    valid: false, 
    message: 'KEY NOT RECOGNIZED BY CENTRAL NODE.' 
  });
}
