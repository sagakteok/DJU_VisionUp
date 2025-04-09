'use client';

import { useEffect, useState } from 'react';
import './RefreshOverlay.scss';
import { AppBar, Toolbar } from '@mui/material';
import { usePathname } from "next/navigation";

export default function RefreshOverlay({ children }: { children: React.ReactNode }) {
    const pathname = usePathname(); //현재 경로 감지
    const [fadeOut, setFadeOut] = useState(false);
    const [visible, setVisible] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        //페이지 이동할때마다 상태 초기화
        setVisible(true);
        setFadeOut(false);
        setProgress(0);

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 99) {
                    clearInterval(interval);
                    return 99;
                }
                return prev + 1;
            });
        }, 10);

        const timeout = setTimeout(()=> {
            setFadeOut(true);
        }, 700);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [pathname]); //경로 바뀔때마다 실행

    const handleTransitionEnd = () => {
        if (fadeOut) setVisible(false);
    };

    return (
        <>
            {visible && (
                <div className={`RefreshOverlayStyle ${fadeOut ? 'fade-out' : ''}`} onTransitionEnd={handleTransitionEnd}>
                    <AppBar position="fixed" sx={{ backgroundColor: "#1B1C1E", borderBottom: "1px solid #57595E", boxShadow: "none", height: "60px" }}>
                        <div style={{ width: "100vw", maxWidth: "1100px", margin: "auto"}}>
                            <Toolbar sx={{ display: "flex", alignItems: "center", height: "60px" }}>
                                <a style={{color: "#FFFFFF", textDecoration: "none"}}>카셀렉트</a>
                            </Toolbar>
                        </div>
                    </AppBar>
                    <div style={{flexDirection: "column"}}>
                        <div>
                            <p className="RefreshOverlaySubTitleStyle">페이지 로딩하는 중...</p>
                            <p className="RefreshOverlayBigTitleStyle">잠시 기다려주세요.</p>
                        </div>
                        <div className="ProgressBarWrapper">
                            <div className="ProgressBar" style={{ width: `${progress}%` }} />
                        </div>
                        <div>
                            <p className="ProgressText">{progress}%</p>
                        </div>
                    </div>
                </div>
            )}
            {children}
        </>
    );
}