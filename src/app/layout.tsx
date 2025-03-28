import type { Metadata } from "next";
import Header from "./components/Header/Header";

export const metadata: Metadata = {
  title: "카셀렉트",
  description: "어서오십샤...",
  icons: 
    {icon: "../../../public/favicon.ico"}
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Header/>
        {children}
      </body>
    </html>
  );
}
