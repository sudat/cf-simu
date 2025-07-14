import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CF Simulator - キャッシュフローシミュレーター",
  description: "モバイル向けキャッシュフロー・資産推移シミュレーター",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          background: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
        }}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
