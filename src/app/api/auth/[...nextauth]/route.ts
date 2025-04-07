import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from 'next-auth/providers/kakao';
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
            },
            async authorize(credentials, _req) {
                if (!credentials || !credentials.email || !credentials.password) {
                    throw new Error("Missing credentials");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) {
                    throw new Error("Invalid email or password");
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) {
                    throw new Error("Invalid email or password");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                };
            }
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
                // credentials 로그인
                token.name = user.name;
            }

            if (account?.provider === "kakao" && profile) {
                const kakaoProfile = profile as KakaoProfile;
                token.name = kakaoProfile.kakao_account?.profile?.nickname ?? "카카오 유저";
            }

            return token;
        },

        async session({ session, token }) {
            console.log("토따 session(): token.name =", token.name); // 콘솔 확인용
            if (token?.name && session.user) {
                session.user.name = token.name;
            }
            return session;
        },
    },
});

export { handler as GET, handler as POST };