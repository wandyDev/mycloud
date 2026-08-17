import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "MyCloud — Real-Time Server Monitoring & Infrastructure",
  description:
    "High-performance real-time telemetry, server telemetry aggregation, and infrastructure monitoring platform powered by WebSockets and NestJS.",
  keywords: [
    "server monitoring",
    "real-time metrics",
    "cloud infrastructure",
    "websockets",
    "telemetry",
    "devops",
  ],
  authors: [{ name: "Wandy" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans bg-[#080c14] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200`}
      >
        {children}
      </body>
    </html>
  );
}
