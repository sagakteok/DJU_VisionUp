// authOptions.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

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

    try {
        const res = await fetch(
            "https://www.google.com/recaptcha/api/siteverify",
            {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `secret=${secret}&response=${token}`,
            }
        );

        const data = await res.json();
        return data.success === true;
    } catch (e) {
        return false;
    }
}

export const authOptions: NextAuthOptions = {
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
                    name:
                        profile.response.name ||
                        profile.response.nickname ||
                        null,
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

            async authorize(credentials) {
                const { email, password, recaptchaToken } =
                (credentials as Record<string, string>) ?? {};

                if (!email || !password) {
                    throw new Error("이메일과 비밀번호를 모두 입력해주세요.");
                }

                if (recaptchaToken) {
                    const isHuman = await verifyRecaptcha(recaptchaToken);
                    if (!isHuman) {
                        throw new Error("reCAPTCHA 인증에 실패했습니다.");
                    }
                }

                // Dealer login
                const dealer = await prisma.dealer.findUnique({
                    where: { email },
                });

                if (dealer && dealer.password === password) {
                    return {
                        id: dealer.id,
                        email: dealer.email,
                        name: dealer.name,
                        role: "DEALER",
                    };
                }

                // User login
                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (user && user.password === password) {
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: "USER",
                    };
                }

                throw new Error("이메일 혹은 비밀번호가 일치하지 않습니다.");
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
            // 일반 로그인(role 포함)
            if (user) {
                token.id = (user as any).id;
                token.role = (user as any).role;
                token.name = user.name;
            }

            // kakao profile 반영
            if (account?.provider === "kakao" && profile) {
                const kakao = profile as unknown as KakaoProfile;
                token.name =
                    kakao.kakao_account?.profile?.nickname ?? "카카오 유저";
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.name = token.name as string;
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
            }
            return session;
        },
    },
};
