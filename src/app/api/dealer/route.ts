import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 리캡차 검증 함수
async function verifyRecaptcha(token: string): Promise<boolean> {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) return false;

    try {
        const response = await fetch(
            `https://www.google.com/recaptcha/api/siteverify`,
            {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `secret=${secret}&response=${token}`,
            }
        );
        const data = await response.json();
        return data.success === true;
    } catch (error) {
        return false;
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, phone, recaptchaToken } = body;

        // 1. 입력값 검증
        if (!name || !email || !password || !phone || !recaptchaToken) {
            return NextResponse.json(
                { error: "모든 항목을 입력해주세요." },
                { status: 400 }
            );
        }

        // 2. 리캡차 검증
        const isHuman = await verifyRecaptcha(recaptchaToken);
        if (!isHuman) {
            return NextResponse.json(
                { error: "보안 검증에 실패했습니다." },
                { status: 403 }
            );
        }

        // 3. Dealer 테이블에서 중복 확인
        const existingDealer = await prisma.dealer.findUnique({
            where: { email }
        });

        if (existingDealer) {
            return NextResponse.json(
                { error: "이미 가입된 딜러 이메일입니다." },
                { status: 409 }
            );
        }

        // 4. Dealer 테이블에 저장
        const newDealer = await prisma.dealer.create({
            data: {
                name,
                email,
                password, // (실무에선 bcrypt 필수)
                phone,
            },
        });

        return NextResponse.json(
            { message: "딜러 가입이 완료되었습니다.", dealer: newDealer },
            { status: 201 }
        );
    } catch (err) {
        console.error("딜러 가입 오류:", err);
        return NextResponse.json(
            { error: "서버 오류가 발생했습니다" },
            { status: 500 }
        );
    }
}