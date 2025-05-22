'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import styles from './ChatPage.module.scss';

export default function ChatPage() {
    const searchParams = useSearchParams();
    const me = searchParams.get('me') || 'me';
    const to = searchParams.get('to') || 'target';

    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState<string[]>([]);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const socket = io('http://localhost:4000', { path: '/socket.io' });
        socketRef.current = socket;
        socket.emit('register', me);

        socket.on('private_message', ({ from, content }) => {
            setChatLog((prev) => [...prev, `[${from}]: ${content}`]);
        });

        return () => {
            socket.disconnect();
        };
    }, [me]);

    const sendMessage = () => {
        if (socketRef.current && message.trim() !== '') {
            socketRef.current.emit('private_message', {
                from: me,
                to,
                content: message.trim()
            });
            setChatLog((prev) => [...prev, `[나]: ${message.trim()}`]);
            setMessage('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') sendMessage();
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.chatContainer}>
                <h2 className={styles.title}>1:1 채팅 – <span>{me}</span> ↔ <span>{to}</span></h2>

                <div className={styles.chatBox}>
                    {chatLog.map((line, idx) => (
                        <div key={idx} className={line.startsWith('[나]') ? styles.myMessage : styles.otherMessage}>
                            {line}
                        </div>
                    ))}
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
