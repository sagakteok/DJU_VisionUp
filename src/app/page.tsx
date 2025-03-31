"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
      <main>
        {session ? (
            <>
              <p>안녕하세요, {session.user?.name}님!</p>
              <button onClick={() => signOut()}>로그아웃</button>
            </>
        ) : (
            <>
                <p>로그인 해주세요.</p>
                <button onClick={() => signIn("google")}>구글 로그인</button>
                <button onClick={() => signIn('kakao')}>카카오 로그인</button>
            </>
        )}
      </main>
  );
}
