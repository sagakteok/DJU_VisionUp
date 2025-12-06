'use client'

import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { supabase } from '@/lib/supabase'
import styles from './ChatPage.module.scss'
import { useRouter } from 'next/navigation' // 나가기 버튼용

type SenderType = 'USER' | 'DEALER' | 'SYSTEM'

interface Message {
    id: string
    chatRoomId: string
    senderId: string
    senderType: SenderType
    content: string
    createdAt: string
}

interface ChatRoomProps {
    quoteId: string
    userId: string
    userType: SenderType
    targetName: string
}

export default function ChatRoom({ quoteId, userId, userType, targetName }: ChatRoomProps) {
    const router = useRouter()
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [roomId, setRoomId] = useState<string | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    // 시간 포맷팅 (UTC 보정 포함)
    const formatTime = (dateString: string) => {
        try {
            let safeDateString = dateString
            if (dateString && !dateString.endsWith('Z') && !dateString.includes('+')) {
                safeDateString += 'Z'
            }
            const date = new Date(safeDateString)
            if (isNaN(date.getTime())) return ''
            return date.toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            })
        } catch (e) {
            return ''
        }
    }

    // 1. 초기 데이터 로드
    useEffect(() => {
        const fetchRoomAndMessages = async () => {
            try {
                const roomRes = await axios.post('/api/chat/rooms', { quoteId })
                const room = roomRes.data
                if (room?.id) {
                    setRoomId(room.id)
                    const msgRes = await axios.get(`/api/chat/messages?chatRoomId=${room.id}`)
                    setMessages(msgRes.data)
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchRoomAndMessages()
    }, [quoteId])

    // 2. 실시간 구독
    useEffect(() => {
        if (!roomId) return

        const channel = supabase
            .channel(`room-listener`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'Message',
                    // 필터 없이 수신 후 JS로 처리 (대소문자 이슈 방지)
                },
                (payload) => {
                    const newMsg = payload.new as Message
                    if (newMsg.chatRoomId !== roomId) return;

                    setMessages((prev) => {
                        if (newMsg.createdAt && !newMsg.createdAt.endsWith('Z')) {
                            newMsg.createdAt += 'Z'
                        }
                        if (prev.some((msg) => msg.id === newMsg.id)) {
                            return prev
                        }
                        return [...prev, newMsg]
                    })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [roomId])

    // 자동 스크롤
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // 메시지 전송
    const sendMessage = async () => {
        if (!newMessage.trim() || !roomId) return

        try {
            await axios.post('/api/chat/messages', {
                chatRoomId: roomId,
                senderId: userId,
                senderType: userType,
                content: newMessage,
            })
            setNewMessage('')
        } catch (error) {
            console.error(error)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
            sendMessage()
        }
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.chatWindow}>
                {/* 헤더 */}
                <div className={styles.header}>
                    <div className={styles.headerTitle}>
                        <div className={styles.statusIndicator}></div>
                        {targetName}
                    </div>
                    <div className={styles.headerActions} onClick={() => router.back()}>
                        나가기
                    </div>
                </div>

                {/* 메시지 리스트 */}
                <div className={styles.messageList}>
                    {messages.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#6b7280', marginTop: '50px' }}>
                            상담을 시작해보세요.
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMine = msg.senderType === userType
                            return (
                                <div
                                    key={msg.id}
                                    className={`${styles.messageRow} ${isMine ? styles.myRow : styles.otherRow}`}
                                >
                                    {/* 내가 보낸 건 시간 먼저, 말풍선 나중 */}
                                    {isMine ? (
                                        <div className={styles.bubbleWrapper}>
                                            <span className={styles.time}>{formatTime(msg.createdAt)}</span>
                                            <div className={styles.bubble}>{msg.content}</div>
                                        </div>
                                    ) : (
                                        <div className={styles.bubbleWrapper}>
                                            <div className={styles.bubble}>{msg.content}</div>
                                            <span className={styles.time}>{formatTime(msg.createdAt)}</span>
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    )}
                    <div ref={scrollRef} />
                </div>

                {/* 입력창 */}
                <div className={styles.inputArea}>
                    <div className={styles.inputWrapper}>
                        <input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="메시지를 입력하세요..."
                            autoFocus
                        />
                    </div>
                    <button className={styles.sendBtn} onClick={sendMessage}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}