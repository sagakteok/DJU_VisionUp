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
    const [isDeleteMode, setIsDeleteMode] = useState(false) // 삭제 모드 상태

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/dealer/auth/signin")
            return
        }

        const fetchRooms = async () => {
            try {
                const dealerId = (session?.user as any)?.id
                if (!dealerId) return

                const res = await axios.get(`/api/chat/rooms?dealerId=${dealerId}`)
                setRooms(res.data)
            } catch (err) {
                console.error(err)
            }
        }

        if (status === "authenticated") {
            if ((session?.user as any).role !== "DEALER") {
                alert("딜러 권한이 필요합니다.")
                router.replace("/customer")
                return
            }
            fetchRooms()
        }
    }, [status, session, router])

    // 카드 클릭 핸들러 (삭제 모드 분기 처리)
    const handleCardClick = async (room: ChatRoom) => {
        if (isDeleteMode) {
            if (confirm(`'${room.quote.user.name}' 고객님과의 상담 내역을 삭제하시겠습니까?\n(복구할 수 없습니다)`)) {
                try {
                    await axios.delete(`/api/chat/rooms?roomId=${room.id}`)
                    setRooms((prev) => prev.filter((r) => r.id !== room.id))
                } catch (err) {
                    console.error(err)
                    alert('삭제 중 오류가 발생했습니다.')
                }
            }
        } else {
            // 일반 모드: 채팅방 입장
            const dealerId = (session?.user as any).id
            const customerName = room.quote.user.name

            router.push(
                `/customer/websocket?quoteId=${room.quoteId}&userId=${dealerId}&type=DEALER&targetName=${customerName}`
            )
        }
    }

    const getInitials = (name: string) => {
        return name?.substring(0, 1).toUpperCase() || '?'
    }

    if (status === "loading" || !session) return <div className={styles.loading}>로딩 중...</div>

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <div className={styles.leftHeader}>
                    <div className={styles.backButton} onClick={() => router.back()}>
                        &larr; 대시보드로 돌아가기
                    </div>
                    <h2 className={styles.title}>전체 상담 현황</h2>
                </div>

                {/* 삭제 모드 토글 버튼 */}
                <button
                    className={`${styles.deleteButton} ${isDeleteMode ? styles.active : ''}`}
                    onClick={() => setIsDeleteMode(!isDeleteMode)}
                >
                    {isDeleteMode ? '완료' : '내역 삭제'}
                </button>
            </div>

            <div className={styles.list}>
                {rooms.length === 0 ? (
                    <div className={styles.empty}>진행 중인 상담 내역이 없습니다.</div>
                ) : (
                    rooms.map((room) => {
                        const customerName = room.quote.user.name || "알 수 없음"
                        const carName = room.quote.carModel?.car_name ?? '차량 정보 없음'
                        const lastMsg = room.messages[0]?.content ?? '대화 내용이 없습니다.'
                        const lastTime = room.messages[0]
                            ? new Date(room.messages[0].createdAt).toLocaleDateString()
                            : '-'

                        return (
                            <div
                                key={room.id}
                                // shaking 클래스 제거됨
                                className={styles.card}
                                onClick={() => handleCardClick(room)}
                            >
                                <div className={styles.avatar}>{getInitials(customerName)}</div>
                                <div className={styles.infoArea}>
                                    <div className={styles.topRow}>
                                        <span className={styles.name}>{customerName} 고객님</span>
                                        <span className={styles.date}>{lastTime}</span>
                                    </div>
                                    <span className={styles.carInfo}>{carName}</span>
                                    <div className={styles.preview}>{lastMsg}</div>
                                </div>

                                <div className={`${styles.arrowIcon} ${isDeleteMode ? styles.delete : ''}`}>
                                    {isDeleteMode ? (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    ) : (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    )}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}