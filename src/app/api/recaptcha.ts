import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ success: false, message: 'No token provided' });
    }

    try {
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify`;

        const response = await fetch(googleVerifyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${secretKey}&response=${token}`
        });

        const data = await response.json();

        if (data.success && data.score >= 0.5) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(403).json({ success: false, score: data.score });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Verification failed', error: err });
    }
}
