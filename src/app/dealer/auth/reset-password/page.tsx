'use client';

export default function ResetPasswordPage() {
    return (
        <main style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>비밀번호 재설정</h2>
            <p>계정 확인 후 새 비밀번호를 설정할 수 있습니다.</p>
            <button style={{ marginTop: '1.5rem', padding: '0.8rem 1.5rem' }}>
                휴대폰 본인인증 하기
            </button>
        </main>
    );
}
