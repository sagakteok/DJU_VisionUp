import type {Metadata} from "next";
import "./customer/globals.css";
import Header from "./customer/components/Header/Header";
import RefreshOverlay from "./customer/components/RefreshOverlay/RefreshOverlay";
import type {ReactNode} from "react";
import SessionWrapper from "./customer/SessionWrapper";

export const metadata: Metadata = {
    title: "카셀렉트",
    description: "어서오십샤...",
    icons: {icon: "./customer/favicon.ico"}
};

export default function RootLayout({children,}: { children: React.ReactNode; }) {
    return (
        <html lang="ko">
        <body>
        <SessionWrapper>
            <Header/>
            <RefreshOverlay>
                {children}
            </RefreshOverlay>
        </SessionWrapper>
        </body>
        </html>
    );
}
