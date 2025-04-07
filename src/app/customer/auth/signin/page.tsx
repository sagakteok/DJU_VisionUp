'use client';

import { signIn, getProviders } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            alert("로그인 실패: " + res.error);
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
                <button type="submit">로그인</button>
                <button onClick={() => router.push("/customer/auth/register")}>회원가입</button>
            </form>
            <hr/>

            <h3>소셜 로그인</h3>
            {providers &&
                Object.values(providers).map((provider: any) => (
                    provider.id !== "credentials" && (
                        <div key={provider.name}>
                            <button onClick={() => signIn(provider.id, { callbackUrl: "/customer" })}>
                                {provider.name}로 로그인하기
                            </button>
                        </div>
                    )
                ))}
            <br />
        </main>
    );
}
