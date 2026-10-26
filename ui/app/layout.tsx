import './globals.css';
import React from 'react';
import type { Metadata } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
// 霞鹜文楷切片 webfont:全量按 unicode-range 切成 woff2 分块,按需加载(整包 24MB TTF 已移除)
import 'lxgw-wenkai-webfont/lxgwwenkai-regular.css';

// 英文正文字体:Next.js 会在构建期自托管,自动做 preload / 子集 / 避免 CLS
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// 文章英文衬线体:和文楷同一"刊物"气质,仅 .markdown-body 使用(UI 铬件仍走 Inter)
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-serif',
});

// 站点级分享元数据:og:image 默认品牌卡,页面级 generateMetadata 只需覆写标题/摘要
export const metadata: Metadata = {
  metadataBase: new URL('https://tunan.fun'),
  openGraph: {
    images: ['/assets/og-card.png'],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${sourceSerif.variable}`} suppressHydrationWarning={true}>
      <head>
        <link rel="shortcut icon" href="/assets/beer.jpeg" />
        <link rel="alternate" type="application/rss+xml" title="tunan's blog RSS Feed" href="/rss.xml" />
        <meta name="google-site-verification" content="xxxx" />
      </head>
      <body className="relative bg-skin-base">
        {/* Cloudflare Web Analytics(手动安装模式;token 是公开埋点值,非密钥) */}
        <script
          type="module"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "8cb37c8b616f4677a7b5c3bfd4ce2c5a"}'
          async
        />
        {children}
      </body>
    </html>
  );
}
