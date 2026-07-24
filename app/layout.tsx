import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "🤖 Robotan",
  description: "Protect the Henachoko.",
  icons: {
    icon: [
      { url: '/icons/robotan-icon-16.png',  sizes: '16x16',   type: 'image/png' },
      { url: '/icons/robotan-icon-32.png',  sizes: '32x32',   type: 'image/png' },
      { url: '/icons/robotan-icon-48.png',  sizes: '48x48',   type: 'image/png' },
      { url: '/icons/robotan-icon-256.png', sizes: '256x256', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full lg:overflow-hidden antialiased`}
    >
      <body className="h-full lg:overflow-hidden flex flex-col">{children}</body>
    </html>
  );
}
