import "./globals.css";
import type { ReactNode } from "react";
import SessionWrapper from "@/components/SessionWrapper";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <body>
        <SessionWrapper>{children}</SessionWrapper>
        </body>
        </html>
    );
}