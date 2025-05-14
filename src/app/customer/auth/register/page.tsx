'use client';

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const recaptchaRef = useRef<ReCAPTCHA | null>(null);
    const router = useRouter();

    const validateForm = (): boolean => {
        if (!name || !email || !password) {
            setErrorMsg("모든 항목을 입력해주세요.");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMsg("올바른 이메일 형식을 입력해주세요.");
            return false;
        }

        if (password.length < 6) {
            setErrorMsg("비밀번호는 최소 6자 이상이어야 합니다.");
            return false;
        }

        if (!recaptchaToken) {
            setErrorMsg("reCAPTCHA 인증을 완료해주세요.");
            return false;
        }

        return true;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        if (!validateForm()) return;

        setLoading(true);

        const res = await fetch("/api/register", {
            method: "POST",
            body: JSON.stringify({
                email,
                name,
                password,
                phone,
                recaptchaToken,
            }),
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        setLoading(false);

        if (res.ok) {
            router.push("/customer/auth/signin");
        } else {
            setErrorMsg(data.error || "회원가입에 실패했습니다.");
            recaptchaRef.current?.reset();
            setRecaptchaToken(null);
        }
    };

    return (
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
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                }}
            >
                <h2 style={{ textAlign: 'center' }}>회원가입</h2>

                {errorMsg && (
                    <p style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>{errorMsg}</p>
                )}

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
                    placeholder="비밀번호 (6자 이상)"
                    required
                />


                <div style={{ display: "flex", justifyContent: "center" }}>
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                        onChange={(token) => setRecaptchaToken(token)}
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "가입 중..." : "회원가입"}
                </button>

                <p style={{ fontSize: '12px', color: '#666', marginTop: '1rem' }}>
                    이 사이트는 Google reCAPTCHA로 보호되며, 다음의 정책이 적용됩니다.<br />
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                        개인정보처리방침
                    </a> 및{' '}
                    <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">
                        서비스 약관
                    </a>
                </p>

                <button type="button" onClick={() => router.push("/customer/auth/find-id")}>
                    아이디 찾기
                </button>
                <button type="button" onClick={() => router.push("/customer/auth/reset-password")}>
                    비밀번호 찾기
                </button>
            </form>
        </div>
    );
}
