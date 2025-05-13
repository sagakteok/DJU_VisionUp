import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const { name, email, password, phone } = await request.json();

    if (!email || !password || !phone) {
        return NextResponse.json({ error: "입력 항목이 누락되었습니다" }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
        where: {
           OR: [
               {email},
               {phone}
           ]
        }
    });

    if (existingUser) {
        return NextResponse.json({ error: "이미 등록된 사용자입니다" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            phone,
        },
    });

    return NextResponse.json({ message: "회원가입이 완료되었습니다", user });
}