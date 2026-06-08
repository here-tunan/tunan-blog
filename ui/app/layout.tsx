import './globals.css';
import React from 'react';
import { defaultLocale } from '@/app/i18n/config';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultLocale} suppressHydrationWarning={true}>
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
