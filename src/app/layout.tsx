import type {Metadata} from "next";
import "./customer/globals.css";
import RefreshOverlay from "./RefreshOverlay/RefreshOverlay";
import SessionWrapper from "./SessionWrapper";

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
                <RefreshOverlay>
                    {children}
                </RefreshOverlay>
            </SessionWrapper>
        </body>
        </html>
    );
}
