'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

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

        // 메시지 수신
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
            setChatLog((prev) => [...prev, `[나]: ${message}`]);
            setMessage('');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>1:1 채팅 – {me} ↔ {to}</h2>
            <div style={{ marginBottom: '1rem', height: '200px', overflowY: 'auto' }}>
                {chatLog.map((line, idx) => (
                    <div key={idx}>{line}</div>
                ))}
            </div>
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="메시지를 입력하세요"
            />
            <button onClick={sendMessage}>보내기</button>
        </div>
    );
}
