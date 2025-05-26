'use client';

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material"
import styles from "./account_manage.module.scss"
import ReCAPTCHA from "react-google-recaptcha";

export default function AccountManage() {
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
            router.push("/customer/auth/register/finish");
        } else {
            setErrorMsg(data.error || "회원가입에 실패했습니다.");
            recaptchaRef.current?.reset();
            setRecaptchaToken(null);
        }
    };

    return (
        <main className={styles.AccountManageStyle}>
            <div className={styles.AccountManageContainer}>
                <div className={styles.AccountManageContent}>
                    <div className={styles.AccountManageTopContent}>
                        <div>
                            <span className={styles.AccountManageTitle}>카셀렉트 고객 계정 관리</span>
                        </div>
                        <div>
                            <span className={styles.AccountManageSubTitle}>계정에 관한 사항을 수정할 수 있어요.</span>
                        </div>
                    </div>
                    <div className={styles.AccountManageSmallTitleContent}>
                        <span className={styles.AccountManageSmallTitle}>나의 정보</span>
                    </div>
                    <form onSubmit={handleRegister}>
                        {errorMsg && (
                            <p style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>{errorMsg}</p>
                        )}
                        <div className={styles.AccountManageMidContent}>
                            <span className={styles.AccountManageMidContentTitleText}>성함</span>
                            <span className={styles.AccountManageMidContentTextLine}>|</span>
                            <span className={styles.AccountManageMidContentDatabaseText}>성함</span>
                        </div>
                        <div className={styles.AccountManageMidContent}>
                            <span className={styles.AccountManageMidContentTitleText}>생년월일</span>
                            <span className={styles.AccountManageMidContentTextLine}>|</span>
                            <span className={styles.AccountManageMidContentDatabaseText}>YYYY.MM.DD</span>
                        </div>
                        <div className={styles.AccountManageMidContent}>
                            <span className={styles.AccountManageMidContentTitleText}>전화번호</span>
                            <span className={styles.AccountManageMidContentTextLine}>|</span>
                            <span className={styles.AccountManageMidContentDatabaseText}>000-0000-0000</span>
                        </div>
                        <div className={styles.AccountManageMidContent}>
                            <span className={styles.AccountManageMidContentTitleText}>이메일</span>
                            <span className={styles.AccountManageMidContentTextLine}>|</span>
                            <span className={styles.AccountManageMidContentDatabaseText}>이메일 주소</span>
                        </div>
                        <div className={styles.AccountManageMidContent}>
                            <span className={styles.AccountManageMidContentTitleText}>비밀번호</span>
                        </div>
                        <div className={styles.AccountManageButtonContent}>
                            <div>
                                <span className={styles.AccountManageToLoginText} onClick={() => router.push("/customer/auth/signin")}>카셀렉트 탈퇴하기</span>
                            </div>
                            <div>
                                <Button className={styles.AccountManageSubmitButton} type="submit" disabled={loading} variant="contained">{loading ? "저장 중..." : "저장하기"}</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}