import './customer/globals.css';

export const metadata = {
    title: 'My App',
    description: 'Welcome!',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
        <body>{children}</body>
        </html>
    );
}
