// pages/api/socket/io.ts
import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import { NextApiResponseServerIO } from '@/types/socket';

export const config = {
    api: {
        bodyParser: false,
    },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
    if (!res.socket.server.io) {
        console.log('*Starting Socket.io server...');
        const path = '/api/socket/io';
        const httpServer: NetServer = res.socket.server as any;

        const io = new ServerIO(httpServer, {
            path: path,
            addTrailingSlash: false,
            cors: { origin: '*' } // 개발 편의상 모든 출처 허용
        });

        res.socket.server.io = io;

        io.on('connection', (socket) => {
            // 방 입장
            socket.on('join_room', (roomId) => {
                socket.join(roomId);
            });

            // 메시지 중계 (나 빼고 다른 사람에게 전송)
            socket.on('send_message', (data) => {
                socket.to(data.quoteId).emit('receive_message', data);
            });
        });
    }
    res.end();
};

export default ioHandler;