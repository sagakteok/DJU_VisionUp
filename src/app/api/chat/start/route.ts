//딜러를 선택하면 견적서+채팅방을 동시에 만들고 그 방 정보를 돌려줍니다.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { userId, dealerId } = await req.json();

        if (!userId || !dealerId) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const result = await prisma.$transaction(async (tx) => {
            const quote = await tx.quote.create({
                data: {
                    userId,
                    dealerId,
                    status: "PENDING",
                },
            });

            const chatRoom = await tx.chatRoom.create({
                data: {
                    quoteId: quote.id,
                },
            });

            return { quote, chatRoom };
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}