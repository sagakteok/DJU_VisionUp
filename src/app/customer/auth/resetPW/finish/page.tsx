import Icon from "@mdi/react";
import { mdiCheckCircle } from "@mdi/js";
import { Button } from "@mui/material"
import styles from "./finish.module.scss"

export default function ResetPWFinish(){
    return (
        <main className={styles.ResetPWFinishStyle}>
            <div className={styles.ResetPWFinishContainer}>
                <div className={styles.ResetPWFinishContent}>
                    <div className={styles.ResetPWFinishTopContent}>
                        <span className={styles.ResetPWFinishTitle}>비밀번호 재설정 완료</span>
                    </div>
                    <div className={styles.ResetPWFinishMidContent}>
                        <Icon path={mdiCheckCircle} size={6} color="#F7D7C5" />
                    </div>
                    <div className={styles.ResetPWFinishBottomContent}>
                        <span className={styles.ResetPWFinishSubTitle}>다시 로그인 후 카셀렉트를 이용해보세요!</span>
                    </div>
                    <div className={styles.ResetPWFinishButtonContent}>
                        <Button className={styles.ResetPWFinishButton} variant="contained" href="/customer/auth/signin">로그인으로 이동</Button>
                    </div>
                </div>
            </div>
        </main>
    )
}