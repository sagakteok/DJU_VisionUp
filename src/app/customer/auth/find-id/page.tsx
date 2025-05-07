'use client';

import { useEffect, useState } from 'react';

declare global {
    interface Window {
        IMP: any;
    }
}

export default function FindIdPage() {
    const [isImpReady, setIsImpReady] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.iamport.kr/js/iamport.js';
        script.async = true;
        script.onload = () => {
            console.log('Iamport SDK 로딩 완료');
            if (window.IMP) {
                window.IMP.init(process.env.NEXT_PUBLIC_IAMPORT_CODE!);
                setIsImpReady(true);
            } else {
                console.error('window.IMP 없음');
            }
        };
        document.body.appendChild(script);
    }, []);

    const handleCertification = () => {
        console.log('인증 버튼 클릭됨');
        const { IMP } = window;
        if (!IMP || !isImpReady) {
            alert('인증 모듈 로딩 실패');
            return;
        }

        IMP.certification(
            {
                pg: 'inicis',
                merchant_uid: `mid_${new Date().getTime()}`,
                m_redirect_url: 'http://localhost:3000/customer/auth/find-id/result',
            },
            (rsp: any) => {
                if (!rsp.success) {
                    alert(`인증 실패: ${rsp.error_msg}`);
                }
            }
        );
    };

    return (
        <main style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>계정 ID 찾기</h2>
            <p>휴대폰 인증을 통해 본인 확인 후 아이디를 찾아드립니다.</p>
            <button
                onClick={handleCertification}
                style={{ marginTop: '1.5rem', padding: '0.8rem 1.5rem' }}
            >
                휴대폰 본인인증 하기
            </button>
        </main>
    );
}
