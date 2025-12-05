'use client';

import Link from "next/link";
import { AppBar, Toolbar} from "@mui/material";
import styles from "./Header.module.scss";

export default function AdminHeader() {

    return (
        <AppBar position="fixed" className={styles.AdminHeader_AppBarStyle}>
            <div className={styles.AdminHeader_Container}>
                <Toolbar className={styles.AdminHeader_ToolbarStyle}>
                    <Link href="/admin" style={{color: "#FFFFFF", textDecoration: "none"}}>카셀렉트</Link>
                    <div className={styles.AdminHeader_divider}/>
                    <span className={`${styles.AdminHeader_text}`}>관리자 페이지</span>
                </Toolbar>
            </div>
        </AppBar>
    );
}