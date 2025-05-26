'use client';

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material"
import styles from "./userform.module.scss"
import ReCAPTCHA from "react-google-recaptcha";

export default function RegisterUserForm() {
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
            router.push("/customer/auth/register/serviceagree");
        } else {
            setErrorMsg(data.error || "회원가입에 실패했습니다.");
            recaptchaRef.current?.reset();
            setRecaptchaToken(null);
        }
    };

    return (
        <main className={styles.RegisterUserFormStyle}>
            <div className={styles.RegisterUserFormContainer}>
                <div className={styles.RegisterUserFormContent}>
                    <div className={styles.RegisterUserFormTopContent}>
                        <div>
                            <span className={styles.RegisterUserFormTitle}>카셀렉트 고객 회원가입</span>
                        </div>
                        <div>
                            <span className={styles.RegisterUserFormSubTitle}>회원 정보를 입력하고 가입을 완료하세요.</span>
                        </div>
                    </div>
                    <div className={styles.RegisterUserFormSmallTitleContent}>
                        <span className={styles.RegisterUserFormSmallTitleNumber}>3</span>
                        <span className={styles.RegisterUserFormSmallTitle}>회원 정보 입력</span>
                    </div>
                    <form>
                        <div className={styles.RegisterUserFormMidContent}>
                            <span className={styles.RegisterUserFormMidContentTitleText}>성함</span>
                            <span className={styles.RegisterUserFormMidContentTextLine}>|</span>
                            <span className={styles.RegisterUserFormMidContentDatabaseText}>성함</span>
                        </div>
                        <div className={styles.RegisterUserFormMidContent}>
                            <span className={styles.RegisterUserFormMidContentTitleText}>생년월일</span>
                            <span className={styles.RegisterUserFormMidContentTextLine}>|</span>
                            <span className={styles.RegisterUserFormMidContentDatabaseText}>YYYY.MM.DD</span>
                        </div>
                        <div className={styles.RegisterUserFormMidContent}>
                            <span className={styles.RegisterUserFormMidContentTitleText}>전화번호</span>
                            <span className={styles.RegisterUserFormMidContentTextLine}>|</span>
                            <span className={styles.RegisterUserFormMidContentDatabaseText}>000-0000-0000</span>
                        </div>
                        <div className={styles.RegisterUserFormInputContent}>
                            <div>
                                <input className={styles.RegisterUserFormTextField} type="email" placeholder="이메일을 입력해주세요." required/>
                            </div>
                            <div className={styles.RegisterUserFormCertificateContent}>
                                <input className={styles.RegisterUserFormCertificateTextField} type="text" placeholder="인증번호 6자리" required/>
                                <Button className={styles.RegisterUserFormCertificateButton} type="submit" variant="contained">발송하기</Button>
                            </div>
                            <div>
                                <input className={styles.RegisterUserFormTextField} type="email" placeholder="비밀번호를 입력해주세요." required/>
                            </div>
                            <div>
                                <input className={styles.RegisterUserFormTextField} type="email" placeholder="비밀번호 재입력" required/>
                            </div>
                        </div>
                        <div className={styles.RegisterUserFormButtonContent}>
                            <div>
                                <span className={styles.RegisterUserFormToLoginText} onClick={() => router.push("/customer/auth/signin")}>로그인으로 돌아가기</span>
                            </div>
                            <div>
                                <Button className={styles.RegisterUserFormSubmitButton} onClick={() => router.push("/customer/auth/register/serviceagree")} type="submit" disabled={loading} variant="contained">다음</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}