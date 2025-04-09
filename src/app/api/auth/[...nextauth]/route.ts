import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from 'next-auth/providers/kakao';
import NaverProvider from "next-auth/providers/naver";
import CredentialsProvider from "next-auth/providers/credentials";
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import {PrismaClient} from "@prisma/client";
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
                email: {label: "Email", type: "text"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials, _req) {
                try {
                    if (!credentials || !credentials.email || !credentials.password) {
                        throw new Error("이메일과 비밀번호를 입력해주세요.");
                    }

                    const user = await prisma.user.findUnique({
                        where: {email: credentials.email},
                    });

                    if (!user || !user.password) {
                        throw new Error("존재하지 않는 이메일 혹은 비밀번호입니다.");
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password);
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

                    //prisma db 연결 실패 메시지
                    if (err.message.includes("Can't reach database server") || err.message.includes("ECONNREFUSED")) {
                        throw new Error("서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
                    }
                    //위에거 제외한 에러 메시지
                    throw new Error(err.message || "로그인 중 알 수 없는 오류가 발생했습니다.");
                }
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
        async jwt({token, user, account, profile}) {
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

        async session({session, token}) {
            console.log("토따 session(): token.name =", token.name); // 콘솔 확인용
            if (token?.name && session.user) {
                session.user.name = token.name;
            }
            return session;
        },
    },
});

export {handler as GET, handler as POST};