'use client';

import React, { useState, useRef } from "react";
import Icon from '@mdi/react';
import { mdiCheck } from '@mdi/js';
import { useRouter } from "next/navigation";
import { Button } from "@mui/material"
import styles from "./signupform.module.scss"

export default function RegisterSignUpForm() {
    const router = useRouter();

    return (
        <main className={styles.RegisterSignUpFormStyle}>
            <div className={styles.RegisterSignUpFormContainer}>
                <div className={styles.RegisterSignUpFormContent}>
                    <div className={styles.RegisterSignUpFormTopContent}>
                        <div>
                            <span className={styles.RegisterSignUpFormTitle}>카셀렉트 고객 회원가입</span>
                        </div>
                        <div>
                            <span className={styles.RegisterSignUpFormSubTitle}>휴대폰 본인 인증을 진행해주세요.</span>
                        </div>
                    </div>
                    <div className={styles.ResetPWSetFormSmallTitleTopContent}>
                        <Icon className={styles.ResetPWSetFormSmallTitleIcon} path={mdiCheck}></Icon>
                        <span className={styles.ResetPWSetFormTopSmallTitle}>개인정보 수집 동의</span>
                    </div>
                    <div className={styles.ResetPWSetFormSmallTitleBottomContent}>
                        <span className={styles.ResetPWSetFormSmallTitleNumber}>2</span>
                        <span className={styles.ResetPWSetFormBottomSmallTitle}>인적 정보 입력</span>
                    </div>
                    <form>
                        <div className={styles.RegisterSignUpFormInputContent}>
                            <div>
                                <input className={styles.RegisterSignUpFormTextField} type="email" placeholder="성함을 입력해주세요." required/>
                            </div>
                            <div>
                                <input className={styles.RegisterSignUpFormTextField} type="email" placeholder="전화번호를 입력해주세요." required/>
                            </div>
                            <div className={styles.RegisterSignUpFormCertificateContent}>
                                <input className={styles.RegisterSignUpFormCertificateTextField} type="text" placeholder="인증번호 6자리" required/>
                                <Button className={styles.RegisterSignUpFormCertificateButton} type="submit" variant="contained">발송하기</Button>
                            </div>
                            <div>
                                <input className={styles.RegisterSignUpFormTextField} type="email" placeholder="생년월일 8자리 (ex.19700101)" required/>
                            </div>
                        </div>
                        <div className={styles.RegisterSignUpFormButtonContent}>
                            <div>
                                <span className={styles.RegisterSignUpFormToLoginText} onClick={() => router.push("/customer/auth/signin")}>로그인으로 돌아가기</span>
                            </div>
                            <div>
                                <Button className={styles.RegisterSignUpFormSubmitButton} onClick={() => router.push("/customer/auth/register/userform")} type="submit" variant="contained">다음</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}