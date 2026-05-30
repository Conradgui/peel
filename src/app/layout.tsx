import type { Metadata, Viewport } from "next";
import { ServiceWorker注册 } from "@/components/shell/ServiceWorker注册";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#FB923C",
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Peel",
  description: "Peel back the assumptions about your time.",
  manifest: "/peel/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Peel",
  },
  icons: {
    icon: "/peel/icon-192.png",
    apple: "/peel/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <ServiceWorker注册 />
      </body>
    </html>
  );
}
