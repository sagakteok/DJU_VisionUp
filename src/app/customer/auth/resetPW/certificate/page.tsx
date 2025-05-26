'use client';

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material"
import styles from "./certificate.module.scss"

export default function ResetPWCertificate() {
    const router = useRouter();

    return (
        <main className={styles.ResetPWCertificateStyle}>
            <div className={styles.ResetPWCertificateContainer}>
                <div className={styles.ResetPWCertificateContent}>
                    <div className={styles.ResetPWCertificateTopContent}>
                        <div>
                            <span className={styles.ResetPWCertificateTitle}>계정 비밀번호 재설정</span>
                        </div>
                        <div>
                            <span className={styles.ResetPWCertificateSubTitle}>본인의 이메일 인증을 진행해주세요.</span>
                        </div>
                    </div>
                    <div className={styles.ResetPWCertificateSmallTitleTopContent}>
                        <span className={styles.ResetPWCertificateSmallTitleTopNumber}>1</span>
                        <span className={styles.ResetPWCertificateTopSmallTitle}>이메일 인증</span>
                    </div>
                    <form>
                        <div className={styles.ResetPWCertificateInputContent}>
                            <div>
                                <input className={styles.ResetPWCertificateTextField} type="email" placeholder="이메일을 입력해주세요." required/>
                            </div>
                            <div className={styles.ResetPWCertificateCertificateContent}>
                                <input className={styles.ResetPWCertificateCertificateTextField} type="text" placeholder="인증번호 6자리" required/>
                                <Button className={styles.ResetPWCertificateCertificateButton} type="submit" variant="contained">발송하기</Button>
                            </div>
                        </div>
                        <div className={styles.ResetPWCertificateSmallTitleBottomContent}>
                            <span className={styles.ResetPWCertificateSmallTitleBottomNumber}>2</span>
                            <span className={styles.ResetPWCertificateBottomSmallTitle}>비밀번호 재설정</span>
                        </div>
                        <div className={styles.ResetPWCertificateButtonContent}>
                            <div>
                                <span className={styles.ResetPWCertificateToLoginText} onClick={() => router.push("/customer/auth/signin")}>로그인으로 돌아가기</span>
                            </div>
                            <div>
                                <Button className={styles.ResetPWCertificateSubmitButton} onClick={() => router.push("/customer/auth/resetPW/setform")} type="submit" variant="contained">다음</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}