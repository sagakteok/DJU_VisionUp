'use client';

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from 'axios';
import styles from './MainHome.module.scss';

interface QuoteRequest {
    quoteId: string;
    customerId: string;
    customerName: string;
    status: string;
}

export default function MainHomeDesktop() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [latestRequest, setLatestRequest] = useState<QuoteRequest | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/dealer/auth/signin");
        }
        if (status === "authenticated" && (session?.user as any).role !== "DEALER") {
            alert("딜러 전용 페이지입니다.");
            router.push("/customer");
        }

        const fetchLatestRequest = async () => {
            try {
                const res = await axios.get('/api/chat/list', {
                    withCredentials: true
                });


                if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                    const firstItem = res.data[0];

                    setLatestRequest({
                        quoteId: firstItem.id,
                        customerId: firstItem.userId,
                        customerName: firstItem.user?.name || "알 수 없음",
                        status: firstItem.status
                    });
                }
            } catch (error) {
                console.error(error);
            }
        };

        if (status === "authenticated") {
            fetchLatestRequest();
        }

    }, [status, session, router]);

    if (status === "loading") {
        return <div style={{ height: '100vh', background: '#3B3735', color: '#EAEAEA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>인증 정보를 불러오는 중...</div>;
    }

    if (!session) return null;

    return (
        <div className={styles.MainHomeStyle}>
            <div className={styles.MainHomeContainer}>
                <div className={styles.MainHomeTopContent}>
                    <div className={styles.MainHomeFirstTitle}>
                        Dealer Partners
                    </div>
                    <div className={styles.MainHomeSecondTitle}>
                        {session.user?.name} 님
                    </div>
                    <div className={styles.MainHomeThirdTitle}>
                        환영합니다. 오늘도 성공적인 계약을 응원합니다.
                    </div>
                    <div
                        className={styles.MainHomeForthTitle}
                        style={{ cursor: 'pointer', display: 'inline-block', borderBottom: '1px solid #C5CAD5' }}
                        onClick={() => signOut({ callbackUrl: '/dealer/auth/signin' })}
                    >
                        로그아웃 &rarr;
                    </div>
                </div>

                <div className={styles.MainHomeBottomContent}>
                    <div style={{
                        marginLeft: '55px',
                        marginTop: '40px',
                        display: 'flex',
                        gap: '20px',
                        flexWrap: 'wrap',
                        paddingRight: '20px'
                    }}>
                        <div
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                padding: '30px',
                                borderRadius: '15px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                cursor: 'pointer',
                                minWidth: '280px',
                                flex: '1'
                            }}
                            onClick={() => {
                                if (!latestRequest) {
                                    alert("진행 중인 상담이 없습니다.");
                                    return;
                                }
                                const dealerId = (session.user as any).id;
                                router.push(`/customer/websocket?quoteId=${latestRequest.quoteId}&userId=${dealerId}&type=DEALER&targetName=${latestRequest.customerName}`);
                            }}
                        >
                            <div className={styles.MainHomeCarHrefContainer} style={{ marginLeft: 0 }}>
                                <span className={styles.MainHomeCarHrefText} style={{ color: '#60a5fa', fontSize: '20px' }}>💬 실시간 상담하기</span>
                            </div>
                            <p style={{ color: '#ccc', marginTop: '10px', fontSize: '14px', fontFamily: 'SpoqaHanSansNeo-Light' }}>
                                {latestRequest
                                    ? `${latestRequest.customerName}님과 대화가 가능합니다.`
                                    : "현재 진행 중인 상담이 없습니다."}
                                <br/>터치하여 채팅방으로 이동하세요.
                            </p>
                        </div>

                        <div
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                padding: '30px',
                                borderRadius: '15px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                minWidth: '280px',
                                flex: '1'
                            }}
                        >
                            <div className={styles.MainHomeCarHrefContainer} style={{ marginLeft: 0 }}>
                                <span className={styles.MainHomeCarHrefText} style={{ color: '#a78bfa', fontSize: '20px' }}>📄 견적 요청함</span>
                            </div>
                            <p style={{ color: '#888', marginTop: '10px', fontSize: '14px', fontFamily: 'SpoqaHanSansNeo-Light' }}>
                                {latestRequest
                                    ? `신규 요청: 1건 (${latestRequest.customerName})`
                                    : "현재 대기 중인 요청이 없습니다."}
                            </p>
                        </div>
                    </div>

                    <div className={styles.MainHomePaginationContainer}>
                        <span className={styles.MainHomePaginationText}>Vision Up Dealer System</span>
                    </div>
                </div>
            </div>
        </div>
    );
}