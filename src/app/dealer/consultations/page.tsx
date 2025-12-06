'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import styles from './Consultations.module.scss'

interface ChatRoom {
    id: string
    quoteId: string
    updatedAt: string
    quote: {
        user: { id: string; name: string }
        dealer: { id: string; name: string }
        carModel: { car_name: string } | null
    }
    messages: { content: string; createdAt: string }[]
}

export default function DealerConsultationsPage() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [rooms, setRooms] = useState<ChatRoom[]>([])

    useEffect(() => {
        // 비로그인 처리
        if (status === "unauthenticated") {
            router.replace("/dealer/auth/signin")
            return
        }

        // 딜러 권한 확인 및 데이터 로드
        const fetchRooms = async () => {
            try {
                const dealerId = (session?.user as any)?.id
                if (!dealerId) return

                // ★ 핵심: dealerId로 내 상담 목록 조회
                const res = await axios.get(`/api/chat/rooms?dealerId=${dealerId}`)
                setRooms(res.data)
            } catch (err) {
                console.error(err)
            }
        }

        if (status === "authenticated") {
            // 권한 체크
            if ((session?.user as any).role !== "DEALER") {
                alert("딜러 권한이 필요합니다.")
                router.replace("/customer")
                return
            }
            fetchRooms()
        }
    }, [status, session, router])

    const goChat = (room: ChatRoom) => {
        const dealerId = (session?.user as any).id
        const customerName = room.quote.user.name

        // 딜러 입장에서의 채팅방 URL
        router.push(
            `/customer/websocket?quoteId=${room.quoteId}&userId=${dealerId}&type=DEALER&targetName=${customerName}`
        )
    }

    const getInitials = (name: string) => {
        return name?.substring(0, 1).toUpperCase() || '?'
    }

    if (status === "loading" || !session) return <div className={styles.loading}>로딩 중...</div>

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <div className={styles.backButton} onClick={() => router.back()}>
                    &larr; 대시보드로 돌아가기
                </div>
                <h2 className={styles.title}>전체 상담 현황</h2>
            </div>

            <div className={styles.list}>
                {rooms.length === 0 ? (
                    <div className={styles.empty}>진행 중인 상담 내역이 없습니다.</div>
                ) : (
                    rooms.map((room) => {
                        // 딜러 페이지이므로 '고객(User)' 정보를 표시
                        const customerName = room.quote.user.name || "알 수 없음"
                        const carName = room.quote.carModel?.car_name ?? '차량 정보 없음'
                        const lastMsg = room.messages[0]?.content ?? '대화 내용이 없습니다.'
                        const lastTime = room.messages[0]
                            ? new Date(room.messages[0].createdAt).toLocaleDateString()
                            : '-'

                        return (
                            <div key={room.id} className={styles.card} onClick={() => goChat(room)}>
                                <div className={styles.avatar}>{getInitials(customerName)}</div>
                                <div className={styles.infoArea}>
                                    <div className={styles.topRow}>
                                        <span className={styles.name}>{customerName} 고객님</span>
                                        <span className={styles.date}>{lastTime}</span>
                                    </div>
                                    <span className={styles.carInfo}>{carName}</span>
                                    <div className={styles.preview}>{lastMsg}</div>
                                </div>
                                <div className={styles.arrowIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}