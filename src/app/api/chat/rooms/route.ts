import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: 채팅방 목록 조회
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const dealerId = searchParams.get("dealerId");

    const whereCondition: any = {};

    if (userId) {
        whereCondition.quote = { userId };
    } else if (dealerId) {
        whereCondition.quote = { dealerId };
    }

    try {
        const rooms = await prisma.chatRoom.findMany({
            where: whereCondition,
            include: {
                quote: {
                    include: {
                        user: true,
                        dealer: true,
                        carModel: true,
                    },
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
            orderBy: { updatedAt: 'desc' },
        });
        return NextResponse.json(rooms);
    } catch (error) {
        console.error("채팅 목록 조회 에러:", error);
        return NextResponse.json({ error: "목록 조회 실패" }, { status: 500 });
    }
}

// POST: 채팅방 생성 (또는 조회)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { quoteId } = body;

        if (!quoteId) {
            return NextResponse.json({ error: "quoteId required" }, { status: 400 });
        }

        // 1. 이미 존재하는 방인지 확인
        const existing = await prisma.chatRoom.findUnique({
            where: { quoteId },
        });
        if (existing) return NextResponse.json(existing);

        // 2. 견적서가 진짜 있는지 먼저 확인 (안전장치 추가!)
        const quoteExists = await prisma.quote.findUnique({
            where: { id: quoteId }
        });

        if (!quoteExists) {
            // 견적서가 없으면 404 에러를 반환해서 프론트엔드에게 알림
            return NextResponse.json(
                { error: "해당 견적서(Quote)가 존재하지 않습니다." },
                { status: 404 }
            );
        }

        // 3. 방 생성
        const room = await prisma.chatRoom.create({
            data: { quoteId },
        });
        return NextResponse.json(room);

    } catch (error) {
        console.error("채팅방 생성 에러:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

// DELETE: 채팅방 삭제
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const roomId = searchParams.get("roomId");

        if (!roomId) {
            return NextResponse.json({ error: "Room ID required" }, { status: 400 });
        }

        await prisma.chatRoom.delete({
            where: { id: roomId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}