'use client';

import Icon from "@mdi/react";
import { mdiCheckCircle } from "@mdi/js";
import { Button } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import styles from "./finish.module.scss";

function FindIDFinishContent() {
    const searchParams = useSearchParams();

    // [수정 포인트] searchParams 뒤에 ?. 를 붙여서 안전하게 가져옵니다.
    const name = searchParams?.get('name') || '고객';
    const email = searchParams?.get('email') || '이메일 정보 없음';

    return (
        <div className={styles.FindIDFinishContainer}>
            <div className={styles.FindIDFinishContent}>
                <div className={styles.FindIDFinishTopContent}>
                    <span className={styles.FindIDFinishTitle}>계정 ID 찾기 완료</span>
                </div>
                <div className={styles.FindIDFinishMidContent}>
                    <Icon path={mdiCheckCircle} size={6} color="#F7D7C5" />
                </div>
                <div className={styles.FindIDFinishBottomContent}>
                    <span className={styles.FindIDFinishTopSubTitleName}>{name}</span>
                    <span className={styles.FindIDFinishTopSubTitle}>님의 ID는</span>
                </div>
                <div className={styles.FindIDFinishBottomContent}>
                    <span className={styles.FindIDFinishTopSubTitleName}>{email}</span>
                    <span className={styles.FindIDFinishBottomSubTitle}>입니다.</span>
                </div>
                <div className={styles.FindIDFinishButtonContent}>
                    <Button className={styles.FindIDFinishButton} variant="contained" href="/customer/auth/signin">
                        로그인으로 이동
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function FindIDFinish() {
    return (
        <main className={styles.FindIDFinishStyle}>
            {/* useSearchParams를 사용할 때는 Suspense가 필수입니다 */}
            <Suspense fallback={<div>로딩 중...</div>}>
                <FindIDFinishContent />
            </Suspense>
        </main>
    );
}