'use client';

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@mdi/react";
import { mdiMagnify, mdiAccountCircle, mdiMenu, mdiChevronRight, mdiLogout } from "@mdi/js";
import { Button, AppBar, Toolbar, IconButton, Drawer, List, InputBase, ListItemButton } from "@mui/material";
import styles from "./Header.module.scss";
import { signOut, useSession } from "next-auth/react";

export default function MobileHeader() {
    const pathname = usePathname();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const toggleDrawer = (open: boolean) => setIsDrawerOpen(open);
    const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);
    const toggleAccountDrawer = (open: boolean) => setIsAccountDrawerOpen(open);
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
        <>
            <AppBar position="fixed" className={styles.MobileHeader_AppBarStyle}>
                <Toolbar className={styles.MobileHeader_ToolbarStyle}>
                    <Link href="/" style={{ color: "#FFFFFF", textDecoration: "none" }}>카셀렉트</Link>
                    {/* 헤더 아이콘 버튼 2개 */}
                    <div ref={wrapperRef} className={styles.MobileHeader_AccountBoxWrapper}>
                        {isLoggedIn ? (
                            <div onClick={() => {toggleAccountBox(); toggleAccountDrawer(!isAccountDrawerOpen); }} className={`${styles.MobileHeader_AccountInfo} ${isAccountDrawerOpen ? styles.active : ""}`}>
                                <Icon path={mdiAccountCircle} size={1} color={isAccountDrawerOpen ? "#F7D7C5" : "#7A8499"}/>
                            </div>
                        ) : (
                            <IconButton disableTouchRipple component={Link} href="/customer/auth/signin" className={`${styles.MobileHeader_icon} ${pathname === "/customer/auth/signin" ? styles.active : ""}`} title="로그인">
                                <Icon path={mdiAccountCircle} size={1} />
                            </IconButton>
                        )}
                        <IconButton onClick={() => toggleDrawer(!isDrawerOpen)} className={`${styles.MobileHeader_icon} ${isDrawerOpen ? styles.active : ""}`}>
                            <Icon path={mdiMenu} size={1} />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            {/* 서랍 */}
            <Drawer anchor="top" open={isDrawerOpen} onClose={() => toggleDrawer(false)} PaperProps={{ style: { boxShadow: "none", top: "60px" } }} ModalProps={{ keepMounted: true, BackdropProps: { style: { backgroundColor: "transparent" } } }} sx={{ position: "relative", zIndex: "3" }}>
                <List className={styles.MobileHeader_DrawerListStyle}>
                    {/* 검색 창 */}
                    <div className={styles.MobileHeader_DrawerSearchContainer}>
                        <InputBase placeholder="검색어를 입력하세요." inputProps={{ 'aria-label': 'search' }} sx={{ ml: 1, flex: 1, fontSize: "18px", fontFamily: "SpoqaHanSansNeo-Thin", color: "#FFFFFF", "& input::placeholder": { color: "#7A8499", opacity: 1 }, "& input:focus": { color: "#FFFFFF" } }} />
                        <Icon className={styles.MobileHeader_DrawerSearchIconStyle} path={mdiMagnify} size={1} />
                    </div>
                    {/* 버튼 1 */}
                    <ListItemButton className={styles.MobileHeader_ListItemButtonStyle} disableTouchRipple component={Link} href="/AllDocuments" onClick={() => toggleDrawer(false)} selected={pathname === "/AllDocuments"}>
                        <div className={styles.MobileHeader_ListItemButtonOutterContainer}>
                            <div className={styles.MobileHeader_ListItemButtonInnerContainer}>
                                <p className={`${styles.MobileHeader_text} ${pathname === "/AllDocuments" ? styles.active : ""}`}>견적 짜기</p>
                                <Icon className={styles.MobileHeader_ListItemButtonChevronIconStyle} path={mdiChevronRight} size={1} />
                            </div>
                            <div className={styles.MobileHeader_ListItemButtonUnderlineStyle} />
                        </div>
                    </ListItemButton>
                    {/* 버튼 2 */}
                    <ListItemButton className={styles.MobileHeader_ListItemButtonStyle} disableTouchRipple component={Link} href="/Businesses" onClick={() => toggleDrawer(false)} selected={pathname === "/Businesses"}>
                        <div className={styles.MobileHeader_ListItemButtonOutterContainer}>
                            <div className={styles.MobileHeader_ListItemButtonInnerContainer}>
                                <p className={`${styles.MobileHeader_text} ${pathname === "/Businesses" ? styles.active : ""}`}>나의 상담</p>
                                <Icon className={styles.MobileHeader_ListItemButtonChevronIconStyle} path={mdiChevronRight} size={1} />
                            </div>
                            <div className={styles.MobileHeader_ListItemButtonUnderlineStyle} />
                        </div>
                    </ListItemButton>
                    {/* 버튼 3 */}
                    <ListItemButton className={styles.MobileHeader_ListItemButtonStyle} disableTouchRipple component={Link} href="/TownCommunity" onClick={() => toggleDrawer(false)} selected={pathname === "/TownCommunity"}>
                        <div className={styles.MobileHeader_ListItemButtonOutterContainer}>
                            <div className={styles.MobileHeader_ListItemButtonInnerContainer}>
                                <p className={`${styles.MobileHeader_text} ${pathname === "/TownCommunity" ? styles.active : ""}`}>나의 견적</p>
                                <Icon className={styles.MobileHeader_ListItemButtonChevronIconStyle} path={mdiChevronRight} size={1} />
                            </div>
                            <div className={styles.MobileHeader_ListItemButtonUnderlineStyle} />
                        </div>
                    </ListItemButton>
                </List>
            </Drawer>
            <Drawer anchor="top" open={isAccountDrawerOpen} onClose={() => toggleAccountDrawer(false)} PaperProps={{style: {boxShadow: "none", top: "60px", borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px"} }} ModalProps={{keepMounted: true, BackdropProps: {style: {backgroundColor: "transparent"} } }} sx={{ position: "relative", zIndex: "3" }}>
                <List className={styles.MobileHeader_AccountDrawerListStyle}>
                    <div className={styles.MobileHeaer_AccountOutterContainer}>
                        <div className={styles.MobileHeader_AccountInnerContainer}>
                            {/* 왼쪽 */}
                            <div className={styles.MobileHeader_AccountNameContainer}>
                                <span className={styles.MobileHeader_AccountName}>{session?.user?.name || '이름 없음'}</span>
                                <span className={styles.MobileHeader_AccountRole}>고객</span>
                            </div>
                            {/* 오른쪽 */}
                            <div className={styles.MobileHeader_AccountButtonContainer}>
                                <span className={styles.MobileHeader_AccountManage}>계정 관리</span>
                                <Button className={styles.MobileHeader_LogoutButton} variant="contained" onClick={() => signOut({ callbackUrl: "/customer" })}>
                                    <Icon path={mdiLogout} size={0.8} color="#FFFFFF" />로그아웃
                                </Button>
                            </div>
                        </div>
                    </div>
                </List>
            </Drawer>
        </>
    );
}