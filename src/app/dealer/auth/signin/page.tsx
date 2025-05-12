'use client';

import {CardContent, Button} from '@mui/material'
import {signIn, getProviders} from "next-auth/react";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Script from "next/script";
import styles from './signin.module.scss'

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [providers, setProviders] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        getProviders().then((res) => {
            setProviders(res);
        });
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        let recaptchaToken = "";

        if (typeof grecaptcha !== "undefined") {
            try {
                await new Promise<void>((resolve) => {
                    grecaptcha.ready(async () => {
                        recaptchaToken = await grecaptcha.execute(
                            process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string,
                            {action: "login"}
                        );
                        resolve();
                    });
                });
            } catch (err) {
                alert("reCAPTCHA 실행 중 오류가 발생했습니다.");
                return;
            }
        }


        // 서버에서 토큰 검증
        const verifyRes = await fetch('/api/recaptcha', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({token: recaptchaToken}),
        });

        const {success, score} = await verifyRes.json();
        console.log("reCAPTCHA score:", score);

        if (!success) {
            alert("로봇으로 판단되어 로그인할 수 없습니다.");
            return;
        }

        // 검증 성공 시 로그인 시도
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            alert(res.error);
        } else {
            router.push("/dealer");
        }
    };

return (
    <main>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="beforeInteractive"
      />

      <div className={styles.DealerSigninStyle}>
        <div className={styles.DealerSigninCard}>
          <CardContent>
            <span className={styles.DealerSigninLogoStyle}>LOGO in Here</span>
            <form onSubmit={handleLogin}>
              <div className={styles.DealerSigninTopContent}>
                <input className={styles.DealerSigninTextField} style={{marginTop: '40px'}} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일을 입력해주세요" required/>
                <input className={styles.DealerSigninTextField} style={{marginTop: '8px'}} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력해주세요" required/>
              </div>
              <div className={styles.DealerSigninMidContent}>
                <span className={styles.DealerSigninMidContentTextStyle} onClick={() => router.push("/dealer/auth/find-id")}>ID 찾기</span>
                <span className={styles.DealerSigninMidContentLineStyle}>|</span>
                <span className={styles.DealerSigninMidContentTextStyle} onClick={() => router.push("/dealerauth/reset-password")}>비밀번호 재설정</span>
              </div>
              <div className={styles.DealerSigninBottomContent}>
                <Button className={styles.DealerSigninLoginButton} type="submit">로그인</Button>
                <Button className={styles.DealerSigninRegisterButton} style={{marginTop: '8px'}} onClick={() => router.push("/dealer/auth/register")}>계정 만들기</Button>
              </div>
            </form>
          </CardContent>
        </div>
      </div>
    </main>
  );
}