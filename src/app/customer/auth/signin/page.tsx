'use client';

import {CardContent, Button} from '@mui/material'
import {signIn, getProviders} from "next-auth/react";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Script from "next/script";
import styles from "./signin.module.scss"

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
            router.push("/customer");
        }
    };


    return (
        <main>
            <Script
                src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
                strategy="beforeInteractive"
            />

            <div className={styles.CustomerSigninStyle}>
                <div className={styles.CustomerSigninCard}>
                <CardContent>
                    <span className={styles.CustomerSigninLogoStyle}>LOGO in Here</span>
                    <form onSubmit={handleLogin}>
                        <div className={styles.CustomerSigninTopContent}>
                            <input className={styles.CustomerSigninTextField} style={{marginTop: '40px'}} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일을 입력해주세요"/>
                            <input className={styles.CustomerSigninTextField} style={{marginTop: '8px'}} type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력해주세요"/>
                        </div>
                        <div className={styles.CustomerSigninMidContent}>
                            <span className={styles.CustomerSigninMidContentTextStyle} onClick={() => router.push("/customer/auth/phone_auth")}>ID 찾기</span>
                            <span className={styles.CustomerSigninMidContentLineStyle}>|</span>
                            <span className={styles.CustomerSigninMidContentTextStyle} onClick={() => router.push("/customer/auth/reset-password")}>비밀번호 재설정</span>
                        </div>
                        <div className={styles.CustomerSigninBottomContent}>
                            <Button className={styles.CustomerSigninLoginButton} type="submit">로그인</Button>
                            {providers?.naver && (
                                <Button className={styles.CustomerSigninNaverLoginButton} style={{marginTop: '8px'}}  onClick={() => signIn("naver", { callbackUrl: "/customer" })}>네이버로 로그인하기</Button>)}
                            {providers?.kakao && (
                                <Button className={styles.CustomerSigninKakaoLoginButton} style={{marginTop: '8px'}}  onClick={() => signIn("kakao", { callbackUrl: "/customer" })}>카카오로 로그인하기</Button>)}
                            <Button className={styles.CustomerSigninRegisterButton} style={{marginTop: '8px'}} onClick={() => router.push("/customer/auth/register")}>계정 만들기</Button>
                        </div>
                    </form>
                </CardContent>
                </div>
            </div>
        </main>
    );
}
