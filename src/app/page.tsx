"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p>로딩 중...</p>;

  return (
      <main style={{ padding: "2rem" }}>
        {session ? (
            <>
              <h1>홈화면</h1>
              <p>안녕하세요, {session.user?.name ?? "사용자"}님!</p>
              <button onClick={() => signOut()}>로그아웃</button>
            </>
        ) : (
            <>
              <h1>홈화면</h1>
              <p>로그인이 필요합니다</p>
              <button onClick={() => router.push("/auth/signin")}>로그인</button>
              <button onClick={() => router.push("/auth/register")}>계정 만들기</button>
            </>
        )}
      </main>
  );
}
