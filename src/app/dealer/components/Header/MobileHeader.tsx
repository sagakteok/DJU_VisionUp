'use client';

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@mdi/react";
import {mdiAccountCircle, mdiMenu, mdiChevronRight, mdiLogout} from "@mdi/js";
import { AppBar, Toolbar, IconButton, Drawer, List, InputBase, ListItemButton } from "@mui/material";
import "./Header.scss";
import {signOut, useSession} from "next-auth/react";

export default function MobileHeader() {
    const pathname = usePathname();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const toggleDrawer = (open: boolean) => setIsDrawerOpen(open);
    const { data: session, status } = useSession();

    return (
        <>
            <AppBar position="fixed" className="MobileHeader_AppBarStyle">
                <Toolbar className="MobileHeader_ToolbarStyle">
                    <Link href="/dealer" style={{color: "#FFFFFF", textDecoration: "none"}}>카셀렉트</Link>
                    {/* 헤더 아이콘 버튼 2개 */}
                    <div>
                        <IconButton disableTouchRipple component={Link} href="/dealer/auth/signin" className={`MobileHeader_icon ${pathname === "/dealer/auth/signin" ? "active" : ""}`}>
                            <Icon path={mdiAccountCircle} size={1} />
                        </IconButton>
                        {/*로그인시, oo님*/}
                        {status === "authenticated" && session?.user?.name && (
                            <span style={{ color: "#FFFFFF", fontSize: "0.7rem" }}>
                                {session.user.name}님
                            </span>
                        )}
                        {status === "authenticated" && (
                            <IconButton disableTouchRipple onClick={() => signOut({callbackUrl: "/dealer"})} className= "DesktopHeader_icon" title= "로그아웃"><Icon path={mdiLogout} size={1} /></IconButton>
                        )}
                        <IconButton onClick={() => toggleDrawer(!isDrawerOpen)} className={`MobileHeader_icon ${isDrawerOpen ? "active" : ""}`}>
                            <Icon path={mdiMenu} size={1} />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            {/* 서랍 */}
            <Drawer anchor="top" open={isDrawerOpen} onClose={() => toggleDrawer(false)} PaperProps={{ style: { boxShadow: "none", top: "60px" } }} ModalProps={{ keepMounted: true, BackdropProps: { style: { backgroundColor: "transparent" } } }} sx={{ position: "relative", zIndex: "3" }}>
                <List className="MobileHeader_DrawerListStyle">
                    {/* 버튼 1 */}
                    <ListItemButton className="MobileHeader_ListItemButtonStyle" disableTouchRipple component={Link} href="/AllDocuments" onClick={() => toggleDrawer(false)} selected={pathname === "/AllDocuments"} style={{marginTop: "30px"}}>
                        <div className="MobileHeader_ListItemButtonOutterContainer">
                            <div className="MobileHeader_ListItemButtonInnerContainer">
                                <p className={`MobileHeader_text ${pathname === "/AllDocuments" ? "active" : ""}`}>견적 관리</p>
                                <Icon className="MobileHeader_ListItemButtonChevronIconStyle" path={mdiChevronRight} size={1}/>
                            </div>
                            <div className="MobileHeader_ListItemButtonUnderlineStyle"/>
                        </div>
                    </ListItemButton>
                    {/* 버튼 2 */}
                    <ListItemButton className="MobileHeader_ListItemButtonStyle" disableTouchRipple component={Link} href="/Businesses" onClick={() => toggleDrawer(false)} selected={pathname === "/Businesses"}>
                        <div className="MobileHeader_ListItemButtonOutterContainer">
                            <div className="MobileHeader_ListItemButtonInnerContainer">
                                <p className={`MobileHeader_text ${pathname === "/Businesses" ? "active" : ""}`}>상담 관리</p>
                                <Icon className="MobileHeader_ListItemButtonChevronIconStyle" path={mdiChevronRight} size={1}/>
                            </div>
                            <div className="MobileHeader_ListItemButtonUnderlineStyle"/>
                        </div>
                    </ListItemButton>
                    {/* 버튼 3 */}
                    <ListItemButton className="MobileHeader_ListItemButtonStyle" disableTouchRipple component={Link} href="/TownCommunity" onClick={() => toggleDrawer(false)} selected={pathname === "/TownCommunity"}>
                        <div className="MobileHeader_ListItemButtonOutterContainer">
                            <div className="MobileHeader_ListItemButtonInnerContainer">
                                <p className={`MobileHeader_text ${pathname === "/TownCommunity" ? "active" : ""}`}>고객 채팅</p>
                                <Icon className="MobileHeader_ListItemButtonChevronIconStyle" path={mdiChevronRight} size={1}/>
                            </div>
                            <div className="MobileHeader_ListItemButtonUnderlineStyle"/>
                        </div>
                    </ListItemButton>
                </List>
            </Drawer>
        </>
    );
}