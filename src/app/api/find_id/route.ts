import { PrismaClient} from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request){
    const { phone } = await req.json();

    if (!phone){
        return NextResponse.json({error: "등록된 전화번호가 없습니다."}, {status: 400});
    }

    const user = await prisma.user.findFirst({
        where: { phone },
        select: { email: true },
    });

    if (!user) {
        return NextResponse.json({error: "해당 번호로 가입된 이메일이 없습니다."}, {status: 404});
    }

    return NextResponse.json({ email: user.email });
}