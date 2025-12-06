'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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

interface Dealer {
    id: string
    name: string
}

export default function ConsultationsPage() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const userId = searchParams.get('userId') ?? 'user-1'
    const userType = searchParams.get('type') ?? 'USER'

    const [rooms, setRooms] = useState<ChatRoom[]>([])
    const [dealers, setDealers] = useState<Dealer[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteMode, setIsDeleteMode] = useState(false)

    useEffect(() => {
        fetchRooms()
    }, [userId, userType])

    const fetchRooms = async () => {
        try {
            const paramKey = userType === 'DEALER' ? 'dealerId' : 'userId'
            const res = await axios.get(`/api/chat/rooms?${paramKey}=${userId}`)
            setRooms(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    const openNewConsultation = async () => {
        try {
            const res = await axios.get('/api/dealer')
            setDealers(res.data)
            setIsModalOpen(true)
        } catch (err) {
            console.error(err)
        }
    }

    const startChat = async (dealerId: string) => {
        try {
            const res = await axios.post('/api/chat/start', {
                userId,
                dealerId
            })
            const { quote, chatRoom } = res.data

            router.push(
                `/customer/websocket?quoteId=${quote.id}&userId=${userId}&type=USER&targetName=${dealers.find(d => d.id === dealerId)?.name}`
            )
        } catch (err) {
            console.error(err)
            alert('상담 시작 중 오류가 발생했습니다.')
        }
    }

    const handleCardClick = async (room: ChatRoom) => {
        if (isDeleteMode) {
            if (confirm('정말 이 채팅 내역을 삭제하시겠습니까? (복구할 수 없습니다)')) {
                try {
                    await axios.delete(`/api/chat/rooms?roomId=${room.id}`)
                    setRooms((prev) => prev.filter((r) => r.id !== room.id))
                } catch (err) {
                    console.error(err)
                    alert('삭제 실패')
                }
            }
        } else {
            const targetName = userType === 'USER' ? room.quote.dealer.name : room.quote.user.name
            router.push(
                `/customer/websocket?quoteId=${room.quoteId}&userId=${userId}&type=${userType}&targetName=${targetName}`
            )
        }
    }

    const getInitials = (name: string) => {
        return name.substring(0, 1).toUpperCase()
    }

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <h2 className={styles.title}>나의 상담 내역</h2>

                {userType === 'USER' && (
                    <div className={styles.buttonGroup}>
                        {/* 1. 새 상담 요청 버튼 (왼쪽) */}
                        <button className={styles.addButton} onClick={openNewConsultation}>
                            + 새 상담 요청
                        </button>

                        {/* 2. 내역 삭제 버튼 (오른쪽) */}
                        <button
                            className={`${styles.deleteButton} ${isDeleteMode ? styles.active : ''}`}
                            onClick={() => setIsDeleteMode(!isDeleteMode)}
                        >
                            {isDeleteMode ? '완료' : '내역 삭제'}
                        </button>
                    </div>
                )}
            </div>

            <div className={styles.list}>
                {rooms.length === 0 ? (
                    <div className={styles.empty}>진행 중인 상담이 없습니다.</div>
                ) : (
                    rooms.map((room) => {
                        const opponentName = userType === 'USER' ? room.quote.dealer.name : room.quote.user.name
                        const carName = room.quote.carModel?.car_name ?? '차량 정보 없음'
                        const lastMsg = room.messages[0]?.content ?? '대화 내용이 없습니다.'
                        const lastTime = room.messages[0]
                            ? new Date(room.messages[0].createdAt).toLocaleDateString()
                            : '-'

                        return (
                            <div
                                key={room.id}
                                className={`${styles.card} ${isDeleteMode ? styles.shaking : ''}`}
                                onClick={() => handleCardClick(room)}
                            >
                                <div className={styles.avatar}>{getInitials(opponentName)}</div>
                                <div className={styles.infoArea}>
                                    <div className={styles.topRow}>
                                        <span className={styles.opponent}>{opponentName}</span>
                                        <span className={styles.date}>{lastTime}</span>
                                    </div>
                                    <span className={styles.carName}>{carName}</span>
                                    <div className={styles.preview}>{lastMsg}</div>
                                </div>

                                <div className={`${styles.actionIcon} ${isDeleteMode ? styles.delete : ''}`}>
                                    {isDeleteMode ? (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    ) : (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    )}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3 className={styles.modalTitle}>상담할 딜러 선택</h3>
                        <div className={styles.dealerList}>
                            {dealers.map((dealer) => (
                                <div key={dealer.id} className={styles.dealerItem} onClick={() => startChat(dealer.id)}>
                                    <div className={styles.avatar} style={{ width: '40px', height: '40px', fontSize: '14px' }}>
                                        {getInitials(dealer.name)}
                                    </div>
                                    <span className={styles.dealerName}>{dealer.name}</span>
                                </div>
                            ))}
                        </div>
                        <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}