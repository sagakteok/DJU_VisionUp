'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import toast, {Toaster} from 'react-hot-toast';

let socket: Socket;

export default function WebSocketPage() {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');

    useEffect(() => {
        //알림 권한 요청
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }

        socket = io('http://localhost:4000', {
            path: '/socket.io',
        });

        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('message', (msg: string) => {
            console.log('Received from server:', msg);
            setResponse(msg);

            //브라우저 알림
            if (Notification.permission === 'granted') {
                new Notification('새로운 알림이 있습니다.', {
                    body: msg,
                });
            }

            //화면 보고 있으면 토스트 알림도 전송
            if (!document.hidden) {
                toast.success(`새로운 메시지: ${msg}`);
            }
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

            <Toaster position="top-right"/>
        </div>
    );
}
