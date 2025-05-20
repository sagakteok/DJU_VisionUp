import Icon from "@mdi/react";
import { mdiCheckCircle } from "@mdi/js";
import { Button } from "@mui/material"
import styles from "./finish.module.scss"

export default function ResetPasswordFinish(){
    return (
        <main className={styles.ResetPasswordFinishStyle}>
            <div className={styles.ResetPasswordFinishContainer}>
                <div className={styles.ResetPasswordFinishContent}>
                    <div className={styles.ResetPasswordFinishTopContent}>
                        <span className={styles.ResetPasswordFinishTitle}>비밀번호 재설정 완료</span>
                    </div>
                    <div className={styles.ResetPasswordFinishMidContent}>
                        <Icon path={mdiCheckCircle} size={6} color="#F7D7C5" />
                    </div>
                    <div className={styles.ResetPasswordFinishBottomContent}>
                        <span className={styles.ResetPasswordFinishSubTitle}>다시 로그인 후 카셀렉트를 이용해보세요!</span>
                    </div>
                    <div className={styles.ResetPasswordFinishButtonContent}>
                        <Button className={styles.ResetPasswordFinishButton} variant="contained" href="/customer/auth/signin">로그인으로 이동</Button>
                    </div>
                </div>
            </div>
        </main>
    )
}