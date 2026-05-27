import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ServiceWorker注册 } from "@/components/shell/ServiceWorker注册";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Peel",
  description: "Peel back the assumptions about your time.",
  manifest: "/manifest.json",
  themeColor: "#FB923C",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Peel",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        {children}
        <ServiceWorker注册 />
      </body>
    </html>
  );
}
