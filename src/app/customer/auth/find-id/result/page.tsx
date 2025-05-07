'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FindIdResultPage() {
    const searchParams = useSearchParams();
    const imp_uid = searchParams.get('imp_uid');
    const [email, setEmail] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log('imp_uid:', imp_uid);
        if (!imp_uid) return;

        const fetchEmail = async () => {
            const res = await fetch('/api/iamport/find-user', {
                method: 'POST',
                body: JSON.stringify({ imp_uid }),
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await res.json();
            if (res.ok) {
                setEmail(data.email);
            } else {
                setError(data.message || '인증 실패');
            }
        };

        fetchEmail();
    }, [imp_uid]);

    return (
        <main style={{ textAlign: 'center', padding: '2rem' }}>
            {email ? (
                <>
                    <h2>아이디 찾기 결과</h2>
                    <p>회원님의 이메일(ID):</p>
                    <strong>{email}</strong>
                </>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <p>인증 확인 중...</p>
            )}
        </main>
    );
}
