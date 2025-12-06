import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const config = {
    runtime: "node",
};

const rooms: Record<string, WebSocket[]> = {};

export async function GET(req: NextRequest) {
    const upgrade = req.headers.get("upgrade");

    if (upgrade !== "websocket") {
        return new Response("Not a websocket request", { status: 400 });
    }

    const { socket, response } = (req as any).upgrade();

    let currentRoom = "";

    socket.onmessage = async (event: MessageEvent) => {
        const data = JSON.parse(event.data);

        // 방 입장
        if (data.join) {
            currentRoom = data.join;
            rooms[currentRoom] = rooms[currentRoom] || [];
            rooms[currentRoom].push(socket);
            return;
        }

        // 메시지 저장 + 브로드캐스트
        if (data.message) {
            const msg = await prisma.message.create({
                data: {
                    chatRoomId: currentRoom,
                    senderId: data.senderId,
                    senderType: data.senderType,
                    content: data.message,
                },
            });

            rooms[currentRoom]?.forEach((client) => {
                client.send(JSON.stringify(msg));
            });
        }
    };

    socket.onclose = () => {
        if (currentRoom && rooms[currentRoom]) {
            rooms[currentRoom] = rooms[currentRoom].filter((s) => s !== socket);
        }
    };

    return response;
}
