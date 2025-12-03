import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const quoteId = searchParams.get('quoteId');

        if (!quoteId) {
            return new NextResponse('Quote ID Missing', { status: 400 });
        }


        const messages = await prisma.message.findMany({
            where: {
                chatRoom: {
                    quoteId: quoteId
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        return NextResponse.json(messages);

    } catch (error) {
        console.log('[CHAT_GET_ERROR]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { quoteId, content, senderId, senderType } = body;

        if (!quoteId || !content || !senderId || !senderType) {
            return new NextResponse('Missing fields', { status: 400 });
        }


        let chatRoom = await prisma.chatRoom.findUnique({
            where: { quoteId },
        });

        // 채팅방이 없으면 새로 생성 (첫 대화일 경우)
        if (!chatRoom) {
            chatRoom = await prisma.chatRoom.create({
                data: { quoteId },
            });
        }

        // 메시지 DB에 저장
        const message = await prisma.message.create({
            data: {
                chatRoomId: chatRoom.id,
                content,
                senderId,
                senderType,
                isRead: false,
            },
        });

        return NextResponse.json(message);

    } catch (error) {
        console.log('[CHAT_POST_ERROR]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}