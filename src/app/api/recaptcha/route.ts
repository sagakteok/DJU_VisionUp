import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { token } = await req.json();

    if (!token) {
        return NextResponse.json({ success: false, message: 'No token provided' }, { status: 400 });
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
        return NextResponse.json({ success: false, message: 'Secret key not configured' }, { status: 500 });
    }

    try {
        const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `secret=${secretKey}&response=${token}`
        });

        const data = await response.json();

    } catch (err: any) {
        return NextResponse.json({
            success: false,
            message: 'Verification request failed',
            error: err?.message || 'Unknown error'
        }, { status: 500 });
    }
}
