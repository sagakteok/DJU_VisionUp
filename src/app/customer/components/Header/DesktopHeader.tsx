'use client';

import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import Icon from "@mdi/react";
import {mdiMagnify, mdiAccountCircle, mdiLogout} from "@mdi/js";
import {
    AppBar,
    Toolbar,
    IconButton,
    Button,
    InputBase,
    Paper,
    List,
    ListItem,
    ListItemButton,
    ListItemText
} from "@mui/material";
import styles from "./Header.module.scss";
import {signOut, useSession} from "next-auth/react";
import {useEffect, useRef, useState} from "react";

const AUTOCOMPLETE_DATA = [
    "현대 더 뉴 아이오닉 6", "현대 디 올 뉴 넥쏘", "현대 아이오닉5", "현대 코나 Electric", "현대 아이오닉 9", "현대 ST1", "현대 포터 II Electric", "현대 포터 II Electric 특장차", "2026 캐스퍼 일렉트릭", "현대 아이오닉 6 N", "현대 아이오닉 5 N", "현대 아반떼 N", "현대 쏘나타 디 엣지", "현대 쏘나타 디 엣지 Hybrid", "현대 그랜저", "현대 그랜저 Hybrid", "현대 아반떼", "현대 아반떼 Hybrid", "현대 싼타페", "현대 싼타페 Hybrid", "현대 투싼", "현대 투싼 Hybrid", "현대 코나", "현대 코나 Hybrid", "현대 베뉴", "현대 디 올 뉴 팰리세이드", "현대 디 올 뉴 팰리세이드 Hybrid", "현대 2026 캐스퍼", "현대 스타리아 라운지", "현대 스타리아 라운지 Hybrid", "현대 스타리아", "현대 스타리아 Hybrid", "현대 스타리아 킨더", "현대 스타리아 라운지 캠퍼 Hybrid", "현대 스타리아 라운지 리무진 Hybrid", "현대 그랜저 택시", "현대 쏘나타 택시", "현대 스타리아 라운지 모빌리티", "현대 스타리아 라운지 모빌리티 Hybrid", "현대 포터 II", "현대 포터 II 특장차", "현대 더 뉴 마이티", "현대 더 뉴 파비스", "현대 뉴파워트럭", "현대 더 뉴 엑시언트", "현대 엑시언트 수소전기트럭", "현대 쏠라티", "현대 카운티", "현대 카운티 일렉트릭", "현대 일렉시티 타운", "현대 뉴 슈퍼에어로시티", "현대 일렉시티", "현대 일렉시티 수소전기버스", "현대 일렉시티 이층버스", "현대 유니버스", "현대 유니버스 수소전기버스", "현대 유니버스 모바일 오피스",
    "BMW E92M3"
];

export default function DesktopHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const {data: session, status} = useSession();
    const isLoggedIn = status === "authenticated" && session?.user;
    const [isAccountActive, setIsAccountActive] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const searchWrapperRef = useRef<HTMLDivElement>(null);

    // 세션에서 사용자 ID 및 권한 가져오기
    const userId = (session?.user as any)?.id;
    const userRole = (session?.user as any)?.role; // ★ role 추가

    const toggleAccountBox = () => {
        setIsAccountActive((prev) => !prev);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchKeyword.trim()) return;

        setShowSuggestions(false);
        router.push(`/customer/cars?model=${encodeURIComponent(searchKeyword)}`);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchKeyword(value);

        if (value.trim().length > 0) {
            const query = value.replace(/\s+/g, '').toLowerCase();
            const filtered = AUTOCOMPLETE_DATA.filter(car =>
                car.replace(/\s+/g, '').toLowerCase().includes(query));
            setFilteredSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (carName: string) => {
        setSearchKeyword(carName);
        setShowSuggestions(false);
        router.push(`/customer/cars?model=${encodeURIComponent(carName)}`);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            if (wrapperRef.current && !wrapperRef.current.contains(target)) {
                setIsAccountActive(false);
            }

            if (searchWrapperRef.current && !searchWrapperRef.current.contains(target)) {
                setShowSuggestions(false);
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
                <Toolbar
                    className={styles.DesktopHeader_ToolbarStyle}
                    sx={{justifyContent: 'space-between'}}
                >
                    <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                        <Link href="/" className={styles.DesktopHeader_Brand}>카셀렉트</Link>
                        <Link href="/customer/estimate"
                              className={`${styles.DesktopHeader_text} ${pathname === "/customer/estimate" ? styles.active : ""}`}>견적
                            짜기</Link>
                        <Link href="/Businesses"
                              className={`${styles.DesktopHeader_text} ${pathname === "/Businesses" ? styles.active : ""}`}>나의
                            견적</Link>

                        <Link
                            // ★ 딜러면 딜러 페이지로, 고객이면 고객 상담 페이지로 분기 처리
                            href={isLoggedIn
                                ? (userRole === 'DEALER' ? '/dealer/consultations' : `/customer/consultations?userId=${userId}&type=USER`)
                                : '/customer/auth/signin'}
                            className={`${styles.DesktopHeader_text} ${pathname.includes("/customer/consultations") || pathname.includes("/customer/websocket") ? styles.active : ""}`}
                        >
                            나의 상담
                        </Link>
                    </div>

                    <div
                        ref={wrapperRef}
                        className={styles.DesktopHeader_AccountBoxWrapper}
                        style={{display: 'flex', alignItems: 'center'}}
                    >

                        <div
                            ref={searchWrapperRef}
                            style={{position: 'relative', marginRight: '15px'}}
                        >
                            <Paper
                                component="form"
                                onSubmit={handleSearch}
                                sx={{
                                    p: '2px 4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: 200,
                                    height: 30,
                                    borderRadius: '20px',
                                    border: '1px solid #ddd',
                                    boxShadow: 'none',
                                    backgroundColor: '#fff',
                                    borderBottomLeftRadius: showSuggestions && filteredSuggestions.length > 0 ? 0 : '20px',
                                    borderBottomRightRadius: showSuggestions && filteredSuggestions.length > 0 ? 0 : '20px',
                                }}
                            >
                                <InputBase
                                    sx={{ml: 1, flex: 1, fontSize: '0.9rem'}}
                                    placeholder="차종 검색"
                                    inputProps={{'aria-label': '차종 검색'}}
                                    value={searchKeyword}
                                    onChange={handleInputChange}
                                    onFocus={() => {
                                        if (searchKeyword && filteredSuggestions.length > 0) setShowSuggestions(true);
                                    }}
                                />

                                <IconButton
                                    type="submit"
                                    sx={{p: '8px'}}
                                    aria-label="search"
                                    className={styles.DesktopHeader_icon}
                                >
                                    <Icon path={mdiMagnify} size={0.9}/>
                                </IconButton>
                            </Paper>

                            {showSuggestions && filteredSuggestions.length > 0 && (
                                <Paper
                                    sx={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        zIndex: 1300,
                                        maxHeight: '300px',
                                        overflowY: 'auto',
                                        borderRadius: '0 0 10px 10px',
                                        border: '1px solid #ddd',
                                        borderTop: 'none',
                                        boxShadow: '0px 4px 6px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <List disablePadding dense>
                                        {filteredSuggestions.map((car, index) => (
                                            <ListItem key={index} disablePadding>
                                                <ListItemButton
                                                    onClick={() => handleSuggestionClick(car)}
                                                    sx={{
                                                        py: 1,
                                                        '&:hover': {backgroundColor: '#f5f5f5'}
                                                    }}
                                                >
                                                    <Icon path={mdiMagnify} size={0.7}
                                                          style={{marginRight: 8, color: '#aaa'}}/>
                                                    <ListItemText
                                                        primary={car}
                                                        primaryTypographyProps={{fontSize: '0.9rem'}}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            )}
                        </div>

                        {isLoggedIn ? (
                            <div
                                className={`${styles.DesktopHeader_AccountInfo} ${isAccountActive ? styles.active : ""}`}
                                onClick={toggleAccountBox}>
                                <Icon path={mdiAccountCircle} size={1} color={isAccountActive ? "#F7D7C5" : "#7A8499"}/>
                                <span className={styles.DesktopHeader_AccountInfoUsername}>
                                    {session?.user?.name || '이름 없음'}

                                    <span
                                        className={styles.DesktopHeader_AccountInfoCustomerDefault}
                                        style={{ color: userRole === 'DEALER' ? '#FFFFFF' : 'inherit' }}
                                    >
                                         {userRole === 'DEALER' ? ' 딜러님' : ' 고객님'}
                                    </span>
                                </span>
                            </div>
                        ) : (
                            <IconButton disableTouchRipple component={Link} href="/customer/auth/signin"
                                        className={`${styles.DesktopHeader_icon} ${pathname === "/customer/auth/signin" ? styles.active : ""}`}
                                        title="로그인">
                                <Icon path={mdiAccountCircle} size={1}/>
                            </IconButton>
                        )}

                        {isLoggedIn && isAccountActive && (
                            <div className={styles.DesktopHeader_AccountInfoForm}>
                                <div className={styles.DesktopHeader_AccountNameContainer}>
                                    <div className={styles.DesktopHeader_AccountName}>{session?.user?.name || '이름 없음'}</div>
                                    <div className={styles.DesktopHeader_AccountRole}>

                                        {userRole === 'DEALER' ? '딜러' : '고객'}
                                    </div>
                                </div>
                                <div className={styles.DesktopHeader_AccountButtons}>
                                    <div
                                        className={styles.DesktopHeader_AccountManage}
                                        onClick={() => router.push(userRole === 'DEALER' ? "/dealer" : "/customer/auth/account_manage")}
                                    >
                                        {userRole === 'DEALER' ? '대시보드' : '계정 관리'}
                                    </div>
                                    <Button className={styles.DesktopHeader_LogoutButton} variant="contained"
                                            onClick={() => signOut({callbackUrl: "/customer"})}>
                                        <Icon path={mdiLogout} size={0.8} color="#FFFFFF"/>로그아웃
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