'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        let recaptchaToken = "";

        if (typeof grecaptcha !== "undefined") {
            try {
                await new Promise<void>((resolve) => {
                    grecaptcha.ready(async () => {
                        recaptchaToken = await grecaptcha.execute(
                            process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string,
                            { action: "signup" }
                        );
                        resolve();
                    });
                });
            } catch (err) {
                alert("reCAPTCHA 실행 중 오류가 발생했습니다.");
                return;
            }
        } else {
            alert("reCAPTCHA를 불러올 수 없습니다.");
            return;
        }

        // 서버에서 토큰 검증
        const verifyRes = await fetch("/api/recaptcha", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: recaptchaToken }),
        });

        const { success, score } = await verifyRes.json();
        console.log("reCAPTCHA score:", score);


        if (!success) {
            alert("로봇으로 판단되어 회원가입할 수 없습니다.");
            return;
        }

        // 검증 통과한 경우에만 회원가입 요청
        const res = await fetch("/api/register", {
            method: "POST",
            body: JSON.stringify({ email, name, password }),
            headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
            router.push("/dealer/auth/signin");
        } else {
            const data = await res.json();
            alert(data.error);
        }
    };

    return (
        <>
            <Script
                src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
                strategy="afterInteractive"
            />

            <div style={{ paddingTop: '60px', display: 'flex', justifyContent: 'center' }}>
                <form
                    onSubmit={handleRegister}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        width: '300px',
                        padding: '2rem',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }}
                >
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="이름"
                        required
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="이메일"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="비밀번호"
                        required
                    />
                    <button type="submit">회원가입</button>

                    <p style={{ fontSize: '12px', color: '#666', marginTop: '1rem' }}>
                        이 사이트는 Google reCAPTCHA로 보호되며, 다음의 정책이 적용됩니다.<br />
                        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                            개인정보처리방침
                        </a> 및{' '}
                        <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">
                            서비스 약관
                        </a>
                    </p>

                    <button
                        type="button"
                        onClick={() => router.push("/dealer/auth/find-id")}
                    >아이디 찾기
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push("/dealer/auth/reset-password")}
                    >비밀번호 찾기
                    </button>
                </form>
            </div>
        </>
    );
}
