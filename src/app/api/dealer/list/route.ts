//상담 가능한 딜러 리스트를 가져오는 API입니다.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const dealers = await prisma.dealer.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
            },
        });
        return NextResponse.json(dealers);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch dealers" }, { status: 500 });
    }
}