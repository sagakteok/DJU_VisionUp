'use client';

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material"
import styles from "./register.module.scss"
import ReCAPTCHA from "react-google-recaptcha";

export default function DealerRegisterPage() {
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
        if (!name || !email || !password || !phone) {
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
            setErrorMsg("reCAPTCHA 인증(로봇이 아닙니다)을 완료해주세요.");
            return false;
        }

        return true;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        if (!validateForm()) return;

        setLoading(true);

        try {
            // 딜러용 API로 요청
            const res = await fetch("/api/dealer", {
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
                alert("딜러 가입이 완료되었습니다. 로그인해주세요.");
                // 가입 성공 시 딜러 로그인 페이지로 이동
                router.push("/dealer/auth/signin")
            } else {
                setErrorMsg(data.error || "회원가입에 실패했습니다.");
                recaptchaRef.current?.reset();
                setRecaptchaToken(null);
            }
        } catch (err) {
            setLoading(false);
            setErrorMsg("서버 통신 중 오류가 발생했습니다.");
        }
    };

    return (
        <main className={styles.RegisterUserFormStyle}>
            <div className={styles.RegisterUserFormContainer}>
                <div className={styles.RegisterUserFormContent}>
                    <div className={styles.RegisterUserFormTopContent}>
                        <div>
                            <span className={styles.RegisterUserFormTitle}>딜러 파트너 가입</span>
                        </div>
                        <div>
                            <span className={styles.RegisterUserFormSubTitle}>파트너 정보를 입력하고 가입을 완료하세요.</span>
                        </div>
                    </div>

                    <form onSubmit={handleRegister}>
                        {errorMsg && (
                            <p style={{ color: '#ef4444', fontSize: '14px', textAlign: 'center', marginBottom: '10px' }}>{errorMsg}</p>
                        )}
                        <div className={styles.RegisterUserFormInputContent}>
                            <div>
                                <input className={styles.RegisterUserFormTextField} type="text" value={name} onChange={e => setName(e.target.value)} placeholder="이름 (또는 상호명)" required/>
                            </div>
                            <div>
                                <input className={styles.RegisterUserFormTextField} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="이메일을 입력해주세요." required/>
                            </div>
                            <div>
                                <input className={styles.RegisterUserFormTextField} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="비밀번호를 입력해주세요." required/>
                            </div>
                            <div>
                                <input className={styles.RegisterUserFormTextField} type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="전화번호를 입력해주세요." required/>
                            </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "center", marginTop: '20px' }}>
                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                                onChange={(token) => setRecaptchaToken(token)}

                            />
                        </div>

                        <div className={styles.RegisterUserFormButtonContent}>
                            <div>
                                <span className={styles.RegisterUserFormToLoginText} onClick={() => router.push("/dealer/auth/signin")}>
                                    이미 계정이 있으신가요? 로그인
                                </span>
                            </div>
                            <div>
                                <Button className={styles.RegisterUserFormSubmitButton} type="submit" disabled={loading} variant="contained">
                                    {loading ? "가입 중..." : "가입 완료"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}