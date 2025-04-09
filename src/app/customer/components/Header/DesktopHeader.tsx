'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@mdi/react";
import {mdiMagnify, mdiAccountCircle, mdiLogout} from "@mdi/js";
import { AppBar, Toolbar, IconButton } from "@mui/material";
import "./Header.scss";
import {signOut, useSession} from "next-auth/react";

export default function DesktopHeader() {
    const pathname = usePathname();
    const { data: session, status } = useSession();

    return (
        <AppBar position="fixed" className="DesktopHeader_AppBarStyle">
            <div className="DesktopHeader_Container">
                <Toolbar className="DesktopHeader_ToolbarStyle">
                    <Link href="/" style={{color: "#FFFFFF", textDecoration: "none"}}>카셀렉트</Link>
                    <Link href="/AllDocuments" className={`DesktopHeader_text ${pathname === "/AllDocuments" ? "active" : ""}`}>견적 짜기</Link>
                    <Link href="/Businesses" className={`DesktopHeader_text ${pathname === "/Businesses" ? "active" : ""}`}>나의 견적</Link>
                    <Link href="/TownCommunity" className={`DesktopHeader_text ${pathname === "/TownCommunity" ? "active" : ""}`}>나의 상담</Link>
                    <div style={{ marginLeft: "auto" }}>
                        <IconButton disableTouchRipple component={Link} href="/" className={`DesktopHeader_icon ${pathname === "/" ? "active" : ""}`}><Icon path={mdiMagnify} size={1} /></IconButton>
                        <IconButton disableTouchRipple component={Link} href="/customer/auth/signin" className={`DesktopHeader_icon ${pathname === "/customer/auth/signin" ? "active" : ""}`}><Icon path={mdiAccountCircle} size={1} /></IconButton>
                        {/*로그인시, oo님*/}
                        {status === "authenticated" && session?.user?.name && (
                            <span style={{ color: "#FFFFFF", fontSize: "0.9rem" }}>
                                {session.user.name}님
                            </span>
                        )}
                        {status === "authenticated" && (
                            <IconButton disableTouchRipple onClick={() => signOut({callbackUrl: "/customer"})} className= "DesktopHeader_icon" title= "로그아웃"><Icon path={mdiLogout} size={1} /></IconButton>
                        )}
                        </div>
                </Toolbar>
            </div>
        </AppBar>
    );
}