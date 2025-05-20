import Icon from "@mdi/react";
import { mdiCheckCircle } from "@mdi/js";
import { Button } from "@mui/material"
import styles from "./finish.module.scss"

export default function RegisterFinish(){
    return (
        <main className={styles.RegisterFinishStyle}>
            <div className={styles.RegisterFinishContainer}>
                <div className={styles.RegisterFinishContent}>
                    <div className={styles.RegisterFinishTopContent}>
                        <span className={styles.RegisterFinishTitle}>카셀렉트 가입 완료</span>
                    </div>
                    <div className={styles.RegisterFinishMidContent}>
                        <Icon path={mdiCheckCircle} size={6} color="#F7D7C5" />
                    </div>
                    <div className={styles.RegisterFinishBottomContent}>
                        <span className={styles.RegisterFinishSubTitle}>이제 카셀렉트의 서비스를 이용해보세요!</span>
                    </div>
                    <div className={styles.RegisterFinishButtonContent}>
                        <Button className={styles.RegisterFinishButton} variant="contained" href="/customer/auth/signin">로그인으로 이동</Button>
                    </div>
                </div>
            </div>
        </main>
    )
}