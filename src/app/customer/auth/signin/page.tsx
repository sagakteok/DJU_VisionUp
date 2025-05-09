'use client';

import {signIn, getProviders} from "next-auth/react";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Script from "next/script";

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
            router.push("/customer/");
        }
    };


    return (
        <main>
            <Script
                src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
                strategy="beforeInteractive"
            />

            <h2>자체 로그인</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="이메일을 입력해주세요"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력해주세요"
                    required
                />
                <button type="submit">로그인</button>
                <button type="button" onClick={() => router.push("/customer/auth/register")}>회원가입</button>
                <button
                    type="button"
                    onClick={() => router.push("/customer/auth/find-id")}
                >아이디 찾기
                </button>

                <button
                    type="button"
                    onClick={() => router.push("/customer/auth/reset-password")}
                >비밀번호 찾기
                </button>


                <p style={{fontSize: '12px', color: '#666', marginTop: '1rem'}}>
                    이 사이트는 Google reCAPTCHA로 보호되며, 다음의 정책이 적용됩니다.<br/>
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                        개인정보처리방침
                    </a> 및{' '}
                    <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">
                        서비스 약관
                    </a>
                </p>
            </form>

            <hr/>

            <h3>소셜 로그인</h3>
            {providers &&
                Object.values(providers).map((provider: any) => (
                    provider.id !== "credentials" && (
                        <div key={provider.name}>
                            <button onClick={() => signIn(provider.id, {callbackUrl: "/customer"})}>
                                {provider.name}로 로그인하기
                            </button>
                        </div>
                    )
                ))}
            <br/>
        </main>
    );
}
