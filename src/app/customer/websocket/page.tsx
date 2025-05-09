'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket;

export default function WebSocketPage() {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');

    useEffect(() => {
        socket = io('http://localhost:4000', {
            path: '/socket.io',
        });

        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('message', (msg: string) => {
            console.log('Received from server:', msg);
            setResponse(msg);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const sendMessage = () => {
        socket.emit('message', message);
        setMessage('');
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>WebSocket (Socket.io) 테스트</h1>
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="메시지를 입력하세요"
            />
            <button onClick={sendMessage}>전송</button>
            <p>서버 응답: {response}</p>
        </div>
    );
}
