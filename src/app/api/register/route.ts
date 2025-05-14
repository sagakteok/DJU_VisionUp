import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function verifyRecaptcha(token: string): Promise<boolean> {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) return false;

    const response = await fetch(
        `https://www.google.com/recaptcha/api/siteverify`,
        {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `secret=${secret}&response=${token}`,
        }
    );

    const data = await response.json();

    console.log("reCAPTCHA 검증 결과:", data);
    return data.success === true;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, recaptchaToken } = body;

        console.log("받은 reCAPTCHA token:", recaptchaToken);



        if (!name || !email || !password || !recaptchaToken) {
            return NextResponse.json(
                { error: "입력 항목이 누락되었습니다" },
                { status: 400 }
            );
        }

        // 이메일 형식 검사
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "유효한 이메일 주소를 입력해주세요." },
                { status: 400 }
            );
        }


        if (password.length < 6) {
            return NextResponse.json(
                { error: "비밀번호는 최소 6자 이상이어야 합니다." },
                { status: 400 }
            );
        }

        // reCAPTCHA 검증
        const isHuman = await verifyRecaptcha(recaptchaToken);
        if (!isHuman) {
            return NextResponse.json(
                { error: "reCAPTCHA 인증에 실패했습니다" },
                { status: 403 }
            );
        }


        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json(
                { error: "이미 등록된 사용자입니다" },
                { status: 400 }
            );
        }


        const hashedPassword = await bcrypt.hash(password, 10);


        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.json(
            { message: "회원가입이 완료되었습니다", user },
            { status: 201 }
        );
    } catch (err) {
        console.error("회원가입 오류:", err);
        return NextResponse.json(
            { error: "서버 오류가 발생했습니다" },
            { status: 500 }
        );
    }
}
