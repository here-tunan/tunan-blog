import './globals.css';
import React from 'react';
import { Inter } from 'next/font/google';

// 英文正文字体：Next.js 会在构建期自托管，自动做 preload / 子集 / 避免 CLS
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={inter.variable} suppressHydrationWarning={true}>
      <head>
        <link rel="shortcut icon" href="/assets/beer.jpeg" />
        <link rel="alternate" type="application/rss+xml" title="tunan's blog RSS Feed" href="/rss.xml" />
        <meta name="google-site-verification" content="xxxx" />
        <link
          rel="preload"
          href="/fonts/LXGWWenKai-Regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body className="relative bg-skin-base">
        {children}
      </body>
    </html>
  );
}
