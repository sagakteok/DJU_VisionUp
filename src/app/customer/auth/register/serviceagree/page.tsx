'use client';

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material"
import styles from "./serviceagree.module.scss"

export default function RegisterServiceAgree() {
    const router = useRouter();

    return (
        <main className={styles.RegisterServiceAgreeStyle}>
            <div className={styles.RegisterServiceAgreeContainer}>
                <div className={styles.RegisterServiceAgreeContent}>
                    <div className={styles.RegisterServiceAgreeTopContent}>
                        <div>
                            <span className={styles.RegisterServiceAgreeTitle}>카셀렉트 서비스 약관 동의</span>
                        </div>
                        <div>
                            <span className={styles.RegisterServiceAgreeSubTitle}>카셀렉트 서비스 사용을 위하여, 동의를 해주세요.</span>
                        </div>
                    </div>
                    <div className={styles.RegisterServiceAgreeButtonContent}>
                        <div>
                            <span className={styles.RegisterServiceAgreeToLoginText} onClick={() => router.push("/customer/auth/signin")}>로그인으로 돌아가기</span>
                        </div>
                        <div>
                            <Button className={styles.RegisterServiceAgreeSubmitButton} onClick={() => router.push("/customer/auth/register/finish")} type="submit" variant="contained">가입 완료</Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}