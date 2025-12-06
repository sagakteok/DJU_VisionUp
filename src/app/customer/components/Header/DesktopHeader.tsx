'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Icon from "@mdi/react";
import { mdiMagnify, mdiAccountCircle, mdiLogout } from "@mdi/js";
import { AppBar, Toolbar, IconButton, Button, InputBase, Paper } from "@mui/material";
import styles from "./Header.module.scss";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

export default function DesktopHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();
    const isLoggedIn = status === "authenticated" && session?.user;
    const [isAccountActive, setIsAccountActive] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);

    // 세션에서 사용자 ID 가져오기 (타입 단언 사용)
    const userId = (session?.user as any)?.id;

    const toggleAccountBox = () => {
        setIsAccountActive((prev) => !prev);
    };

    const handleSearch = (e: React.FormEvent)=>{
        e.preventDefault();
        if (!searchKeyword.trim()) return;
        router.push(`/customer/cars?model=${encodeURIComponent(searchKeyword)}`);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsAccountActive(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <AppBar position="fixed" className={styles.DesktopHeader_AppBarStyle}>
            <div className={styles.DesktopHeader_Container}>
                <Toolbar className={styles.DesktopHeader_ToolbarStyle}>
                    <Link href="/" className={styles.DesktopHeader_Brand}>카셀렉트</Link>
                    <Link href="/customer/estimate" className={`${styles.DesktopHeader_text} ${pathname === "/customer/estimate" ? styles.active : ""}`}>견적 짜기</Link>
                    <Link href="/Businesses" className={`${styles.DesktopHeader_text} ${pathname === "/Businesses" ? styles.active : ""}`}>나의 견적</Link>

                    <Link
                        href={isLoggedIn && userId ? `/customer/consultations?userId=${userId}&type=USER` : '/customer/auth/signin'}
                        className={`${styles.DesktopHeader_text} ${pathname.includes("/customer/consultations") || pathname.includes("/customer/websocket") ? styles.active : ""}`}
                    >
                        나의 상담
                    </Link>

                    <div ref={wrapperRef} className={styles.DesktopHeader_AccountBoxWrapper}>
                        <Paper
                            component="form"
                            onSubmit={handleSearch}
                            sx={{
                                p: '2px 4px',
                                display: 'flex',
                                alignItems: 'center',
                                width: 200, // 너비 조절
                                height: 30,
                                borderRadius: '20px', // 둥근 모서리
                                border: '1px solid #ddd',
                                boxShadow: 'none',
                                marginRight: '15px', // 계정 아이콘과의 간격
                                backgroundColor: '#fff'
                            }}
                        >
                            <InputBase
                                sx={{ml: 1, flex: 1, fontSize: '0.9rem'}}
                                placeholder="차종 검색"
                                inputProps={{'aria-label': '차종 검색'}}
                                value={searchKeyword}
                                onChange={(e)=> setSearchKeyword(e.target.value)}/>

                            <IconButton
                                type="submit"
                                sx={{p: '8px'}}
                                aria-label="search"
                                className={styles.DesktopHeader_icon}>

                                <Icon path={mdiMagnify} size={0.9}/>
                            </IconButton>
                        </Paper>

                        {isLoggedIn ? (
                            <div className={`${styles.DesktopHeader_AccountInfo} ${isAccountActive ? styles.active : ""}`} onClick={toggleAccountBox}>
                                <Icon path={mdiAccountCircle} size={1} color={isAccountActive ? "#F7D7C5" : "#7A8499"} />
                                <span className={styles.DesktopHeader_AccountInfoUsername}>{session?.user?.name || '이름 없음'}
                                    <span className={styles.DesktopHeader_AccountInfoCustomerDefault}> 고객님</span>
                                </span>
                            </div>
                        ) : (
                            <IconButton disableTouchRipple component={Link} href="/customer/auth/signin" className={`${styles.DesktopHeader_icon} ${pathname === "/customer/auth/signin" ? styles.active : ""}`} title="로그인">
                                <Icon path={mdiAccountCircle} size={1} />
                            </IconButton>
                        )}

                        {isLoggedIn && isAccountActive && (
                            <div className={styles.DesktopHeader_AccountInfoForm}>
                                <div className={styles.DesktopHeader_AccountNameContainer}>
                                    <div className={styles.DesktopHeader_AccountName}>{session?.user?.name || '이름 없음'}</div>
                                    <div className={styles.DesktopHeader_AccountRole}>고객</div>
                                </div>
                                <div className={styles.DesktopHeader_AccountButtons}>
                                    <div className={styles.DesktopHeader_AccountManage} onClick={() => router.push("/customer/auth/account_manage")}>계정 관리</div>
                                    <Button className={styles.DesktopHeader_LogoutButton} variant="contained" onClick={() => signOut({ callbackUrl: "/customer" })}>
                                        <Icon path={mdiLogout} size={0.8} color="#FFFFFF" />로그아웃
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </Toolbar>
            </div>
        </AppBar>
    );
}