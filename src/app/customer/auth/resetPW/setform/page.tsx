'use client';

import React, { useState, useRef } from "react";
import Icon from '@mdi/react';
import { mdiCheck } from '@mdi/js';
import { useRouter } from "next/navigation";
import { Button } from "@mui/material"
import styles from "./setform.module.scss"

export default function ResetPWSetForm() {
    const router = useRouter();

    return (
        <main className={styles.ResetPWSetFormStyle}>
            <div className={styles.ResetPWSetFormContainer}>
                <div className={styles.ResetPWSetFormContent}>
                    <div className={styles.ResetPWSetFormTopContent}>
                        <div>
                            <span className={styles.ResetPWSetFormTitle}>계정 비밀번호 재설정</span>
                        </div>
                        <div>
                            <span className={styles.ResetPWSetFormSubTitle}>새로운 비밀번호를 입력해주세요.</span>
                        </div>
                    </div>
                    <div className={styles.ResetPWSetFormSmallTitleTopContent}>
                        <Icon className={styles.ResetPWSetFormSmallTitleIcon} path={mdiCheck}></Icon>
                        <span className={styles.ResetPWSetFormTopSmallTitle}>이메일 인증</span>
                    </div>
                    <div className={styles.ResetPWSetFormSmallTitleBottomContent}>
                        <span className={styles.ResetPWSetFormSmallTitleNumber}>2</span>
                        <span className={styles.ResetPWSetFormBottomSmallTitle}>비밀번호 재설정</span>
                    </div>
                    <form>
                        <div className={styles.ResetPWSetFormInputContent}>
                            <div>
                                <input className={styles.ResetPWSetFormTextField} type="password" placeholder="비밀번호를 입력해주세요." required/>
                            </div>
                            <div>
                                <input className={styles.ResetPWSetFormTextField} type="password" placeholder="비밀번호 재입력" required/>
                            </div>
                        </div>
                        <div className={styles.ResetPWSetFormButtonContent}>
                            <div>
                                <span className={styles.ResetPWSetFormToLoginText} onClick={() => router.push("/customer/auth/signin")}>로그인으로 돌아가기</span>
                            </div>
                            <div>
                                <Button className={styles.ResetPWSetFormSubmitButton} onClick={() => router.push("/customer/auth/resetPW/finish")} type="submit" variant="contained">다음</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}