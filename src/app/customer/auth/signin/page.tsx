'use client';

import { CardContent, Button } from '@mui/material';
import { signIn, getProviders } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import styles from "./signin.module.scss";
import ReCAPTCHA from "react-google-recaptcha";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const [providers, setProviders] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const recaptchaRef = useRef<ReCAPTCHA | null>(null);
    const router = useRouter();

    useEffect(() => {
        getProviders().then((res) => setProviders(res));
    }, []);

    const validateForm = (): boolean => {
        if (!email || !password) {
            setErrorMsg("이메일과 비밀번호를 모두 입력해주세요.");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMsg("올바른 이메일 형식을 입력해주세요.");
            return false;
        }

        if (password.length < 6) {
            setErrorMsg("비밀번호는 최소 6자 이상이어야 합니다.");
            return false;
        }

        if (!recaptchaToken) {
            setErrorMsg("reCAPTCHA 인증을 완료해주세요.");
            return false;
        }

        return true;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        if (!validateForm()) return;

        setLoading(true);

        const result = await signIn("credentials", {
            email,
            password,
            recaptchaToken,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setErrorMsg(result.error);
            recaptchaRef.current?.reset();
            setRecaptchaToken(null);
        } else {
            router.push("/customer/");
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
                                <input
                                    className={styles.CustomerSigninTextField}
                                    style={{ marginTop: '40px' }}
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="이메일을 입력해주세요"
                                />
                                <input
                                    className={styles.CustomerSigninTextField}
                                    style={{ marginTop: '8px' }}
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="비밀번호를 입력해주세요"
                                />
                            </div>

                            <div className={styles.CustomerSigninMidContent}>
                                <span
                                    className={styles.CustomerSigninMidContentTextStyle}
                                    onClick={() => router.push("/customer/auth/find-id")}
                                >
                                    ID 찾기
                                </span>
                                <span className={styles.CustomerSigninMidContentLineStyle}>|</span>
                                <span
                                    className={styles.CustomerSigninMidContentTextStyle}
                                    onClick={() => router.push("/customer/auth/reset-password")}
                                >
                                    비밀번호 재설정
                                </span>
                            </div>

                            {errorMsg && (
                                <p className={styles.CustomerSigninErrorMsg}>{errorMsg}</p>
                            )}

                            <div className={styles.CustomerSigninRecaptchaWrapper}>
                                <ReCAPTCHA
                                    ref={recaptchaRef}
                                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                                    onChange={(token) => setRecaptchaToken(token)}
                                />
                            </div>

                            <div className={styles.CustomerSigninBottomContent}>
                                <Button
                                    className={styles.CustomerSigninLoginButton}
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? "로그인 중..." : "로그인"}
                                </Button>

                                {providers?.naver && (
                                    <Button
                                        className={styles.CustomerSigninNaverLoginButton}
                                        style={{ marginTop: '8px' }}
                                        onClick={() => signIn("naver", { callbackUrl: "/customer" })}
                                    >
                                        네이버로 로그인하기
                                    </Button>
                                )}

                                {providers?.kakao && (
                                    <Button
                                        className={styles.CustomerSigninKakaoLoginButton}
                                        style={{ marginTop: '8px' }}
                                        onClick={() => signIn("kakao", { callbackUrl: "/customer" })}
                                    >
                                        카카오로 로그인하기
                                    </Button>
                                )}

                                <Button
                                    className={styles.CustomerSigninRegisterButton}
                                    style={{ marginTop: '8px' }}
                                    onClick={() => router.push("/customer/auth/register")}
                                >
                                    계정 만들기
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </div>
            </div>
        </main>
    );
}
