'use client';

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material"
import styles from "./accountagree.module.scss"

export default function RegisterAccountAgree() {
    const router = useRouter();

    return (
        <main className={styles.RegisterAccountAgreeStyle}>
            <div className={styles.RegisterAccountAgreeContainer}>
                <div className={styles.RegisterAccountAgreeContent}>
                    <div className={styles.RegisterAccountAgreeTopContent}>
                        <div>
                            <span className={styles.RegisterAccountAgreeTitle}>카셀렉트 고객 회원가입</span>
                        </div>
                        <div>
                            <span className={styles.RegisterAccountAgreeSubTitle}>회원가입 전 이용약관 및 개인정보 수집 이용에 동의해주세요.</span>
                        </div>
                    </div>
                    <div className={styles.RegisterAccountAgreeButtonContent}>
                        <div>
                            <span className={styles.RegisterAccountAgreeToLoginText} onClick={() => router.push("/customer/auth/signin")}>로그인으로 돌아가기</span>
                        </div>
                        <div>
                            <Button className={styles.RegisterAccountAgreeSubmitButton} onClick={() => router.push("/customer/auth/register/signupform")} type="submit" variant="contained">다음</Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}