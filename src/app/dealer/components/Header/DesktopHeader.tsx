'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@mdi/react";
import { mdiAccountCircle, mdiLogout } from "@mdi/js";
import { AppBar, Toolbar, IconButton } from "@mui/material";
import styles from "./Header.module.scss";
import { signOut, useSession } from "next-auth/react";

export default function DesktopHeader() {
    const pathname = usePathname();
    const { data: session, status } = useSession();

    return (
        <AppBar position="fixed" className={styles.DesktopHeader_AppBarStyle}>
            <div className={styles.DesktopHeader_Container}>
                <Toolbar className={styles.DesktopHeader_ToolbarStyle}>
                    {/* [수정 포인트] href를 "/dealer"로 명확히 지정 */}
                    <Link href="/dealer" style={{color: "#FFFFFF", textDecoration: "none"}}>
                        카셀렉트
                    </Link>

                    <Link href="/dealer/EstimateManagement" className={`${styles.DesktopHeader_text} ${pathname === "/dealer/EstimateManagement" ? "active" : ""}`}>
                        견적 관리
                    </Link>
                    <Link href="/dealer/ConsultManagement" className={`${styles.DesktopHeader_text} ${pathname === "/dealer/ConsultManagement" ? "active" : ""}`}>
                        상담 관리
                    </Link>
                    <Link href="/dealer/chat" className={`${styles.DesktopHeader_text} ${pathname === "/dealer/chat" ? "active" : ""}`}>
                        고객 채팅
                    </Link>

                    <div style={{ marginLeft: "auto" }}>
                        <IconButton
                            disableTouchRipple
                            component={Link}
                            href="/dealer"
                            className={`${styles.DesktopHeader_icon} ${pathname === "/dealer" ? "active" : ""}`}
                        >
                            <Icon path={mdiAccountCircle} size={1} />
                        </IconButton>

                        {/* 로그인 시, oo님 표시 */}
                        {status === "authenticated" && session?.user?.name && (
                            <span style={{ color: "#FFFFFF", fontSize: "0.9rem" }}>
                                {session.user.name}님
                            </span>
                        )}

                        {status === "authenticated" && (
                            <IconButton
                                disableTouchRipple
                                onClick={() => signOut({callbackUrl: "/dealer"})}
                                className={styles.DesktopHeader_icon}
                                title="로그아웃"
                            >
                                <Icon path={mdiLogout} size={1} />
                            </IconButton>
                        )}
                    </div>
                </Toolbar>
            </div>
        </AppBar>
    );
}