'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@mdi/react";
import { mdiMagnify, mdiAccountCircle, mdiLogout } from "@mdi/js";
import { AppBar, Toolbar, IconButton, Button } from "@mui/material";
import styles from "./Header.module.scss";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

export default function DesktopHeader() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const isLoggedIn = status === "authenticated" && session?.user;
    const [isAccountActive, setIsAccountActive] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const toggleAccountBox = () => {
        setIsAccountActive((prev) => !prev);
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
                    <Link href="/customer/estimate" className={`${styles.DesktopHeader_text} ${pathname === "/estimate" ? styles.active : ""}`}>견적 짜기</Link>
                    <Link href="/Businesses" className={`${styles.DesktopHeader_text} ${pathname === "/Businesses" ? styles.active : ""}`}>나의 견적</Link>
                    <Link href="/TownCommunity" className={`${styles.DesktopHeader_text} ${pathname === "/TownCommunity" ? styles.active : ""}`}>나의 상담</Link>

                    <div ref={wrapperRef} className={styles.DesktopHeader_AccountBoxWrapper}>
                        <IconButton disableTouchRipple component={Link} href="/" className={`${styles.DesktopHeader_icon} ${pathname === "/" ? styles.active : ""}`}><Icon path={mdiMagnify} size={1} /></IconButton>
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
                                    <div className={styles.DesktopHeader_AccountManage}>계정 관리</div>
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