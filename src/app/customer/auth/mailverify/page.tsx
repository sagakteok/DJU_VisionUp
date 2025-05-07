'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ 리디렉션용
// ...

export default function EmailTestPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const router = useRouter(); // ✅ 추가

  const handleSend = async () => {
    const res = await fetch('/api/sendmail', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    if (res.ok) {
      alert(`인증코드가 전송되었습니다.`);
      setCode(data.code); // 서버에서 받은 코드 저장
    } else {
      alert(`에러: ${data.error}`);
    }
  };

  const handleVerify = () => {
    if (inputCode === code) {
      alert('인증 성공!');
      router.push('/customer'); // 원하는 경로로 이동
    } else {
      alert('인증 실패. 코드가 일치하지 않습니다.');
    }
  };

  return (
    <div style={{ paddingTop: 100 }}>
      <input
        type="email"
        placeholder="이메일 입력"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button onClick={handleSend}>인증 코드 보내기</button>

      {code && (
        <>
          <input
            type="text"
            placeholder="인증 코드 입력"
            value={inputCode}
            onChange={e => setInputCode(e.target.value)}
          />
          <button onClick={handleVerify}>인증 확인</button>
        </>
      )}
    </div>
  );
}