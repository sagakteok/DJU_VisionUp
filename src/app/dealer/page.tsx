'use client';

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from 'axios';
import styles from './MainHome.module.scss';

// 채팅방 데이터 타입 정의
interface ChatRoom {
    id: string;
    quoteId: string;
    quote: {
        user: { name: string };
    };
    messages: { content: string; createdAt: string }[];
}

export default function MainHomeDesktop() {
    // required: true 옵션을 쓰면, 비로그인 시 자동으로 signin 페이지로 보내지 않고
    // 우리가 직접 status 체크로 제어할 수 있습니다.
    const { data: session, status } = useSession();
    const router = useRouter();
    const [latestRoom, setLatestRoom] = useState<ChatRoom | null>(null);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        // 1. 로딩이 끝났는데 비로그인 상태라면 -> 로그인 페이지로
        if (status === "unauthenticated") {
            router.replace("/dealer/auth/signin"); // push 대신 replace 사용 (뒤로가기 방지)
            return;
        }

        // 2. 딜러 권한 체크 (로그인 된 상태에서만)
        if (status === "authenticated") {
            if ((session?.user as any).role !== "DEALER") {
                alert("딜러 전용 페이지입니다.");
                router.replace("/customer");
                return;
            }

            // 3. 데이터 로딩
            fetchRooms((session.user as any).id);
        }
    }, [status, session, router]);

    const fetchRooms = async (dealerId: string) => {
        try {
            const res = await axios.get(`/api/chat/rooms?dealerId=${dealerId}`);

            if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                setLatestRoom(res.data[0]);
                setTotalCount(res.data.length);
            } else {
                setLatestRoom(null);
                setTotalCount(0);
            }
        } catch (error) {
            console.error("채팅 목록 로딩 실패:", error);
        }
    };

    // 로딩 중이거나 세션이 없을 때는 로딩 화면 유지 (깜빡임 방지)
    if (status === "loading" || !session) {
        return (
            <div className={styles.loadingScreen} style={{ height: '100vh', background: '#3B3735', color: '#EAEAEA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Dealer System 접속 중...
            </div>
        );
    }

    return (
        <div className={styles.MainHomeStyle}>
            <div className={styles.MainHomeContainer}>
                {/* 상단 헤더 영역 */}
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

                {/* 하단 콘텐츠 영역 */}
                <div className={styles.MainHomeBottomContent}>
                    <div style={{
                        marginLeft: '55px',
                        marginTop: '40px',
                        display: 'flex',
                        gap: '20px',
                        flexWrap: 'wrap',
                        paddingRight: '20px'
                    }}>
                        {/* 1. 실시간 상담하기 카드 */}
                        <div
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                padding: '30px',
                                borderRadius: '15px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                cursor: 'pointer',
                                minWidth: '280px',
                                flex: '1',
                                transition: 'transform 0.2s',
                                marginBottom: '50px',
                            }}
                            onClick={() => {
                                if (!latestRoom) {
                                    alert("현재 진행 중인 상담이 없습니다.");
                                    return;
                                }
                                const dealerId = (session.user as any).id;
                                const customerName = latestRoom.quote.user.name;

                                router.push(`/customer/websocket?quoteId=${latestRoom.quoteId}&userId=${dealerId}&type=DEALER&targetName=${customerName}`);
                            }}
                        >
                            <div className={styles.MainHomeCarHrefContainer} style={{ marginLeft: 0 }}>
                                <span className={styles.MainHomeCarHrefText} style={{ color: '#60a5fa', fontSize: '20px' }}>💬 실시간 상담하기</span>
                            </div>

                            <p style={{ color: '#ccc', marginTop: '10px', fontSize: '15px', fontFamily: 'SpoqaHanSansNeo-Light', lineHeight: '1.6' }}>
                                {latestRoom ? (
                                    <>
                                        <strong style={{ color: '#fff', fontWeight: 'bold' }}>{latestRoom.quote.user.name}</strong> 님이 상담을 요청했습니다.
                                        <br />
                                        <span style={{ fontSize: '13px', color: '#888' }}>터치하여 채팅방으로 입장하세요 &rarr;</span>
                                    </>
                                ) : (
                                    "현재 대기 중인 상담 요청이 없습니다."
                                )}
                            </p>
                        </div>

                        {/* 2. 견적 요청 현황 카드 (수정됨: onClick 추가) */}
                        <div
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                padding: '30px',
                                borderRadius: '15px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                minWidth: '280px',
                                flex: '1',
                                marginBottom: '50px',
                                cursor: 'pointer', // 마우스 올렸을 때 손가락 모양
                                transition: 'transform 0.2s', // 클릭 효과용 트랜지션
                            }}
                            // 클릭 시 상담 목록 페이지로 이동
                            onClick={() => router.push('/dealer/consultations')}
                        >
                            <div className={styles.MainHomeCarHrefContainer} style={{ marginLeft: 0 }}>
                                <span className={styles.MainHomeCarHrefText} style={{ color: '#a78bfa', fontSize: '20px' }}>📄 전체 상담 현황</span>
                            </div>
                            <p style={{ color: '#888', marginTop: '10px', fontSize: '14px', fontFamily: 'SpoqaHanSansNeo-Light' }}>
                                {totalCount > 0
                                    ? `총 ${totalCount}건의 상담이 진행 중입니다.`
                                    : "현재 진행 중인 요청이 없습니다."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}