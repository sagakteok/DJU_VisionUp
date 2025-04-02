'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("/api/register", {
            method: "POST",
            body: JSON.stringify({ email, name, password }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (res.ok) {
            router.push("/auth/signin");
        } else {
            const data = await res.json();
            alert(data.error);
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="이름" required />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="이메일" required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="비밀번호" required />
            <button type="submit">회원가입</button>
        </form>
    );
}
