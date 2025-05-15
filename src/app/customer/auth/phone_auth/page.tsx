"use client";

import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber} from "firebase/auth";
import { useEffect, useState } from "react";
import {json} from "express";

export default function PhoneAuth() {
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");
    const [confirmation, setConfirmation] = useState<any>(null);
    const [email, setEmail] = useState("");

    //reCAPTCHA는 페이지가 로드되면 한 번만 초기화
    useEffect(() => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                auth,
                'recaptcha-container',
                {
                    size: 'invisible',
                    callback: (response: any) => {
                        console.log('reCAPTCHA 해결', response);
                    },
                    'expired-callback': () => {
                        console.warn('reCAPTCHA 만료. 다시 시도해주세요.');
                    },
                }
            );
            // reCAPTCHA를 명시적으로 렌더링 (때때로 필요)
            window.recaptchaVerifier.render().then((widgetId: number) => {
                console.log('reCAPTCHA 랜더링됨:', widgetId);
            });
        }
    }, []);

   const sendCode = async () => {
       if (!window.recaptchaVerifier) {
           alert('recaptcha가 초기화되지 않았습니다.');
           return;
           }

       //01012345678 → +821012345678로 바꿈
       const internationalPhone = `+82${phone.startsWith('0') ? phone.slice(1) : phone}`;

       try {
           const result = await signInWithPhoneNumber(auth, internationalPhone, window.recaptchaVerifier);
           setConfirmation(result);
           alert('인증번호가 전송되었습니다.');
           
           //정보
           console.log('전화번호:', internationalPhone);
           console.log('서버에서 보낸 인증번호:', result.verificationId);
           
       } catch (err) {
           console.error('인증번호 전송 실패:', err);
           alert('인증번호 전송 실패');
       }
   };

    const verifyCode = async () => {
        try {
            
            //확인
            console.log('사용자가 입력한 인증번호:',code);
            if (confirmation){
                console.log('서버에서 받은 인증번호:', confirmation.verificationId);
            }
            
            await confirmation.confirm(code);

            const res = await fetch('/api/find_id', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone }),
        });

        let data;
        try {
            data = await res.json();
        } catch (e) {
            console.error('JSON 파싱 실패:', e);
            alert('서버 응답이 올바르지 않습니다.');
            return;
        }

        if (data.email) {
          setEmail(data.email);
        } else {
          alert(data.error || '가입된 이메일이 없습니다.');
        }
       } catch (err) {
            console.error('인증 실패:', err);
            alert("인증번호가 올바르지 않습니다.");
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            paddingTop: '100px', // 헤더에 가려지지 않도록 충분한 여백
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start', // 필요에 따라 'center'로 중앙 정렬도 가능
            backgroundColor: '#f9f9f9',}}
        >
            <div
                style={{
                    width: '320px',
                    backgroundColor: '#ffffff',
                    padding: '2rem',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }}
            >
                <h1 className="text-xl font-bold mb-4">전화번호 인증</h1>
                <div id="recaptcha-container"></div>

            <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="전화번호 (-없이 숫자만 입력)"
                className="border p-2 w-full"
            />
            <button onClick={sendCode} className="bg-blue-500 text-white p-2 rounded w-full">
                인증번호 전송
            </button>

            <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="인증번호 입력"
                className="border p-2 w-full"
            />
            <button onClick={verifyCode} className="bg-green-500 text-white p-2 rounded w-full">
                인증하기
            </button>

            {email && (
                <div className="mt-4 text-center text-green-700 font-semibold">
                    가입된 이메일: {email}
                </div>
            )}
            </div>
        </div>
    );
}