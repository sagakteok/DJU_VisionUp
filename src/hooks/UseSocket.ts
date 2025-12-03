// hooks/useSocket.ts(클라이언트에서 소켓 연결 담당)
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (roomId: string) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!roomId) return;

        // 1. 소켓 서버 깨우기 (API 호출)
        const socketInit = async () => {
            await fetch('/api/socket/io');
        };
        socketInit();

        // 2. 소켓 연결
        const socketInstance = io({
            path: '/api/socket/io', // 경로 중요!
            addTrailingSlash: false,
        });

        socketInstance.on('connect', () => {
            console.log('Socket Connected:', socketInstance.id);
            setIsConnected(true);
            socketInstance.emit('join_room', roomId); // 방 입장
        });

        socketInstance.on('disconnect', () => {
            console.log('Socket Disconnected');
            setIsConnected(false);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [roomId]);

    return { socket, isConnected };
};