import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    console.log('API HIT: /api/iamport/find-user');

    const { imp_uid } = await req.json();
    console.log('imp_uid:', imp_uid);

    const tokenRes = await fetch('https://api.iamport.kr/users/getToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            imp_key: process.env.IAMPORT_API_KEY,
            imp_secret: process.env.IAMPORT_API_SECRET,
        }),
    });

    const tokenJson = await tokenRes.json();
    if (!tokenRes.ok || !tokenJson.response?.access_token) {
        return NextResponse.json({ message: '토큰 발급 실패' }, { status: 500 });
    }
    const access_token = tokenJson.response.access_token;

    // 인증 결과 조회
    const certRes = await fetch(`https://api.iamport.kr/certifications/${imp_uid}`, {
        headers: {
            Authorization: access_token,
        },
    });

    const { response } = await certRes.json();
    if (!response) {
        return NextResponse.json({ message: '본인인증 실패' }, { status: 400 });
    }

    const { name, phone, birth } = response;

    //  가짜 DB 조회 (테스트)
    if (name === '홍길동' && phone.includes('010')) {
        return NextResponse.json({ email: 'testuser@example.com' });
    }

    return NextResponse.json({ message: '해당 정보로 등록된 사용자가 없습니다.' }, { status: 404 });
}
