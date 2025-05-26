'use client';

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material"
import styles from "./findID.module.scss"

export default function FindID() {
    const router = useRouter();

    return (
        <main className={styles.FindIDStyle}>
            <div className={styles.FindIDContainer}>
                <div className={styles.FindIDContent}>
                    <div className={styles.FindIDTopContent}>
                        <div>
                            <span className={styles.FindIDTitle}>계정 ID 찾기</span>
                        </div>
                        <div>
                            <span className={styles.FindIDSubTitle}>카셀렉트 ID를 찾기 위해서 휴대폰 인증을 해주세요.</span>
                        </div>
                    </div>
                    <div className={styles.FindIDSmallTitleTopContent}>
                        <span className={styles.FindIDSmallTitleTopNumber}>1</span>
                        <span className={styles.FindIDTopSmallTitle}>전화번호 인증</span>
                    </div>
                    <form>
                        <div className={styles.FindIDInputContent}>
                            <div>
                                <input className={styles.FindIDTextField} type="text" placeholder="전화번호를 입력해주세요." required/>
                            </div>
                            <div className={styles.FindIDCertificateContent}>
                                <input className={styles.FindIDCertificateTextField} type="text" placeholder="인증번호 6자리" required/>
                                <Button className={styles.FindIDCertificateButton} type="submit" variant="contained">발송하기</Button>
                            </div>
                        </div>
                        <div className={styles.FindIDSmallTitleBottomContent}>
                            <span className={styles.FindIDSmallTitleBottomNumber}>2</span>
                            <span className={styles.FindIDBottomSmallTitle}>인증 완료 및 ID 확인</span>
                        </div>
                        <div className={styles.FindIDButtonContent}>
                            <div>
                                <span className={styles.FindIDToLoginText} onClick={() => router.push("/customer/auth/signin")}>로그인으로 돌아가기</span>
                            </div>
                            <div>
                                <Button className={styles.FindIDSubmitButton} onClick={() => router.push("/customer/auth/findID/finish")} type="submit" variant="contained">다음</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}