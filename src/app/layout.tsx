import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "カスタム試験対策",
    description: "自分で問題を作成し、解くことができる試験対策サイト",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ja" suppressHydrationWarning>
            <body
                className={`${inter.className} bg-background text-foreground`}
            >
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow container mx-auto px-4 py-8">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
