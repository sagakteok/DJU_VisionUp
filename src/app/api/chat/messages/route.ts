//특정 채팅방 메시지 조회 + 메시지 전송 API

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const chatRoomId = searchParams.get("chatRoomId");

    if (!chatRoomId)
        return NextResponse.json({ error: "chatRoomId required" }, { status: 400 });

    const messages = await prisma.message.findMany({
        where: { chatRoomId },
        orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
}

export async function POST(req: Request) {
    const { chatRoomId, senderId, senderType, content } = await req.json();

    if (!chatRoomId || !senderId || !senderType || !content)
        return NextResponse.json({ error: "missing fields" }, { status: 400 });

    const message = await prisma.message.create({
        data: {
            chatRoomId,
            senderId,
            senderType,
            content,
        },
    });

    return NextResponse.json(message);
}
