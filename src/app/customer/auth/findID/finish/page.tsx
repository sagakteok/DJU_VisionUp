'use client';

import Icon from "@mdi/react";
import { mdiCheckCircle } from "@mdi/js";
import { Button } from "@mui/material"
import styles from "./finish.module.scss"

type FindIDFinishProps = {
    name?: string;
    email?: string;
};

export default function FindIDFinish({ name, email }: FindIDFinishProps) {
    return (
        <main className={styles.FindIDFinishStyle}>
            <div className={styles.FindIDFinishContainer}>
                <div className={styles.FindIDFinishContent}>
                    <div className={styles.FindIDFinishTopContent}>
                        <span className={styles.FindIDFinishTitle}>계정 ID 찾기 완료</span>
                    </div>
                    <div className={styles.FindIDFinishMidContent}>
                        <Icon path={mdiCheckCircle} size={6} color="#F7D7C5" />
                    </div>
                    <div className={styles.FindIDFinishBottomContent}>
                        <span className={styles.FindIDFinishTopSubTitleName}>{name || '고객'}</span>
                        <span className={styles.FindIDFinishTopSubTitle}>님의 ID는</span>
                    </div>
                    <div className={styles.FindIDFinishBottomContent}>
                        <span className={styles.FindIDFinishTopSubTitleName}>{email || '이메일 주소'}</span>
                        <span className={styles.FindIDFinishBottomSubTitle}>입니다.</span>
                    </div>
                    <div className={styles.FindIDFinishButtonContent}>
                        <Button className={styles.FindIDFinishButton} variant="contained" href="/customer/auth/signin">로그인으로 이동</Button>
                    </div>
                </div>
            </div>
        </main>
    )
}