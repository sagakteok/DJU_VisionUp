'use client';

import { signIn, getProviders } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const [providers, setProviders] = useState<any>(null);
    const recaptchaRef = useRef<ReCAPTCHA | null>(null);
    const router = useRouter();

    useEffect(() => {
        getProviders().then((res) => setProviders(res));
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!recaptchaToken) {
            alert("reCAPTCHA 인증을 완료해주세요.");
            return;
        }

        const result = await signIn("credentials", {
            email,
            password,
            recaptchaToken,
            redirect: false,
        });

        if (result?.error) {
            alert(result.error);
            recaptchaRef.current?.reset();
            setRecaptchaToken(null);
        } else {
            router.push("/customer/");
        }
    };

    return (
        <main>
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

                <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                    onChange={(token) => setRecaptchaToken(token)}
                />

                <button type="submit">로그인</button>
                <button type="button" onClick={() => router.push("/customer/auth/register")}>회원가입</button>
                <button type="button" onClick={() => router.push("/customer/auth/find-id")}>아이디 찾기</button>
                <button type="button" onClick={() => router.push("/customer/auth/reset-password")}>비밀번호 찾기</button>

                <p style={{ fontSize: '12px', color: '#666', marginTop: '1rem' }}>
                    이 사이트는 Google reCAPTCHA로 보호되며, 다음의 정책이 적용됩니다.<br />
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                        개인정보처리방침
                    </a> 및{' '}
                    <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">
                        서비스 약관
                    </a>
                </p>
            </form>

            <hr />

            <h3>소셜 로그인</h3>
            {providers &&
                Object.values(providers).map((provider: any) =>
                    provider.id !== "credentials" ? (
                        <div key={provider.name}>
                            <button onClick={() => signIn(provider.id, { callbackUrl: "/customer" })}>
                                {provider.name}로 로그인하기
                            </button>
                        </div>
                    ) : null
                )}
        </main>
    );
}
