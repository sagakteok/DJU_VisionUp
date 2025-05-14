import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface KakaoProfile {
    id: number;
    kakao_account?: {
        profile?: {
            nickname?: string;
            profile_image_url?: string;
        };
        email?: string;
    };
}

async function verifyRecaptcha(token: string): Promise<boolean> {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!token || !secret) return false;

    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${secret}&response=${token}`,
    });

    const data = await res.json();
    return data.success === true;
}

const handler = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
        KakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID!,
            clientSecret: process.env.KAKAO_CLIENT_SECRET!,
        }),
        NaverProvider({
            clientId: process.env.NAVER_CLIENT_ID!,
            clientSecret: process.env.NAVER_CLIENT_SECRET!,
            profile(profile) {
                return {
                    id: profile.response.id,
                    name: profile.response.name || profile.response.nickname || null,
                    email: profile.response.email,
                    image: profile.response.profile_image,
                };
            },
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
                recaptchaToken: { label: "reCAPTCHA", type: "text" },
            },
            async authorize(credentials, _req) {
                try {
                    const { email, password, recaptchaToken } = credentials ?? {};

                    if (!email || !password) {
                        throw new Error("이메일과 비밀번호를 모두 입력해주세요.");
                    }

                    if (recaptchaToken) {
                        const isHuman = await verifyRecaptcha(recaptchaToken);
                        if (!isHuman) {
                            throw new Error("reCAPTCHA 인증에 실패했습니다.");
                        }
                    }



                    const user = await prisma.user.findUnique({
                        where: { email },
                    });

                    if (!user || !user.password) {
                        throw new Error("존재하지 않는 이메일 혹은 비밀번호입니다.");
                    }

                    const isValid = await bcrypt.compare(password, user.password);
                    if (!isValid) {
                        throw new Error("이메일 혹은 비밀번호가 일치하지 않습니다.");
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                    };
                } catch (err: any) {
                    console.log("로그인 중 에러:", err);

                    if (
                        err.message.includes("Can't reach database server") ||
                        err.message.includes("ECONNREFUSED")
                    ) {
                        throw new Error(
                            "서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
                        );
                    }

                    throw new Error(err.message || "로그인 중 알 수 없는 오류가 발생했습니다.");
                }
            },
        }),
    ],

    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/customer/auth/signin",
    },

    callbacks: {
        async jwt({ token, user, account, profile }) {
            if (user) {
                token.name = user.name;
            }

            if (account?.provider === "kakao" && profile) {
                const kakaoProfile = profile as KakaoProfile;
                token.name = kakaoProfile.kakao_account?.profile?.nickname ?? "카카오 유저";
            }

            return token;
        },

        async session({ session, token }) {
            console.log("토따 session(): token.name =", token.name);
            if (token?.name && session.user) {
                session.user.name = token.name;
            }
            return session;
        },
    },
});

export { handler as GET, handler as POST };
