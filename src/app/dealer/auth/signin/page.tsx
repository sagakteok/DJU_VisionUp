'use client';

import {CardContent, Button} from '@mui/material'
import {signIn} from "next-auth/react";
import {useState, useRef} from "react";
import {useRouter} from "next/navigation";
import styles from './signin.module.scss'
import ReCAPTCHA from "react-google-recaptcha";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        //리캡차 체크 여부 확인
        if (!recaptchaToken) {
            alert("로봇이 아님을 인증해주세요. (체크박스 클릭)");
            return;
        }

        setLoading(true);

        try {
            // NextAuth signIn 호출

            const res = await signIn("credentials", {
                email,
                password,
                recaptchaToken, // [중요] 백엔드로 토큰 전달
                redirect: false,
            });

            setLoading(false);

            if (res?.error) {
                alert("로그인 실패: 이메일/비밀번호를 확인하거나 잠시 후 다시 시도해주세요.");
                // 실패 시 리캡차 초기화
                recaptchaRef.current?.reset();
                setRecaptchaToken(null);
            } else {
                // 성공 시 딜러 메인으로 이동
                router.push("/dealer");
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
            alert("로그인 중 시스템 오류가 발생했습니다.");
        }
    };

    return (
        <main>
            <div className={styles.DealerSigninStyle}>
                <div className={styles.DealerSigninCard}>
                    <CardContent>
                        <span className={styles.DealerSigninLogoStyle}>LOGO in Here</span>
                        <form onSubmit={handleLogin}>
                            <div className={styles.DealerSigninTopContent}>
                                <input
                                    className={styles.DealerSigninTextField}
                                    style={{marginTop: '40px'}}
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="이메일을 입력해주세요"
                                    required
                                />
                                <input
                                    className={styles.DealerSigninTextField}
                                    style={{marginTop: '8px'}}
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="비밀번호를 입력해주세요"
                                    required
                                />
                            </div>

                            {/* [핵심] v2 리캡차 체크박스 추가 */}
                            <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                                <ReCAPTCHA
                                    ref={recaptchaRef}
                                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                                    onChange={(token) => setRecaptchaToken(token)}
                                    // theme="dark" // 배경이 어두우면 추가
                                />
                            </div>

                            <div className={styles.DealerSigninMidContent}>
                                <span className={styles.DealerSigninMidContentTextStyle}
                                      onClick={() => router.push("/dealer/auth/find-id")}>ID 찾기</span>
                                <span className={styles.DealerSigninMidContentLineStyle}>|</span>
                                <span className={styles.DealerSigninMidContentTextStyle}
                                      onClick={() => router.push("/dealer/auth/reset-password")}>비밀번호 재설정</span>
                            </div>

                            <div className={styles.DealerSigninBottomContent}>
                                <Button
                                    className={styles.DealerSigninLoginButton}
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? "로그인 중..." : "로그인"}
                                </Button>
                                <Button
                                    className={styles.DealerSigninRegisterButton}
                                    style={{marginTop: '8px'}}
                                    onClick={() => router.push("/dealer/auth/register")}
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