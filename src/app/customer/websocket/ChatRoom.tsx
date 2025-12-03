'use client';

import { useEffect, useState, useRef } from 'react';
import { useSocket } from '@/hooks/UseSocket';
import styles from './ChatPage.module.scss';
import axios from 'axios';

interface Message {
    id?: string;
    content: string;
    senderId: string;
    senderType: 'USER' | 'DEALER';
    createdAt: string;
}

interface ChatRoomProps {
    quoteId: string;
    userId: string;
    userType: 'USER' | 'DEALER';
    targetName: string;
}

export default function ChatRoom({ quoteId, userId, userType, targetName }: ChatRoomProps) {
    const { socket, isConnected } = useSocket(quoteId);
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState<Message[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`/api/chat?quoteId=${quoteId}`);
                if (res.data && Array.isArray(res.data)) {
                    setChatLog(res.data);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchHistory();
    }, [quoteId]);

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (newMsg: Message) => {
            setChatLog((prev) => [...prev, newMsg]);
        };

        socket.on('receive_message', handleReceiveMessage);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [socket]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatLog]);

    const sendMessage = async () => {
        if (!message.trim()) return;

        const tempMsg: Message = {
            content: message,
            senderId: userId,
            senderType: userType,
            createdAt: new Date().toISOString(),
        };

        try {
            await axios.post('/api/chat', {
                quoteId,
                content: message,
                senderId: userId,
                senderType: userType,
            });

            socket?.emit('send_message', {
                ...tempMsg,
                quoteId,
            });

            setChatLog((prev) => [...prev, tempMsg]);
            setMessage('');
        } catch (error) {
            console.error(error);
            alert('메시지 전송에 실패했습니다.');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
            sendMessage();
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.chatContainer}>
                <h2 className={styles.title}>
                    1:1 상담 – <span>{targetName}</span>
                    <span style={{ fontSize: '0.8rem', marginLeft: '10px', color: isConnected ? '#4ade80' : '#f87171' }}>
                        {isConnected ? ' ●' : ' ○'}
                    </span>
                </h2>

                <div className={styles.chatBox}>
                    {chatLog.length === 0 ? (
                        <div style={{textAlign: 'center', color: '#aaa', marginTop: '20px'}}>
                            대화 내역이 없습니다.
                        </div>
                    ) : (
                        chatLog.map((msg, idx) => {
                            const isMe = msg.senderType === userType;
                            return (
                                <div key={idx} className={isMe ? styles.myMessage : styles.otherMessage}>
                                    <div>
                                        [{isMe ? '나' : targetName}]: {msg.content}
                                    </div>
                                    <div className={styles.meta}>
                                        <span>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={scrollRef} />
                </div>

                <div className={styles.inputGroup}>
                    <input
                        className={styles.input}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="메시지를 입력하세요"
                        autoFocus
                    />
                    <button className={styles.sendButton} onClick={sendMessage}>보내기</button>
                </div>
            </div>
        </div>
    );
}