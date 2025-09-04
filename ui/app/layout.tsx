'use client'
import "./globals.css";
import React, { useState } from "react";

import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import {ThemeProvider} from "@/app/components/theme-provider";
import CommandPalette from "@/app/components/CommandPalette";
import { ViewTracker } from "@/app/components/ViewTracker";


export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <html lang="en" suppressHydrationWarning={true}>
    <head>
      <title>tunan&apos;s blog</title>
      <link rel="shortcut icon" href="/favicon/favicon.ico?v=2"/>
      <link rel="alternate" type="application/rss+xml" title="tunan's blog RSS Feed" href="/rss.xml"/>
      <meta name="google-site-verification" content="xxxx"/>
      
      {/* 预加载本地字体文件 */}
      <link 
        rel="preload" 
        href="/fonts/LXGWWenKai-Regular.ttf" 
        as="font" 
        type="font/ttf"
        crossOrigin="anonymous"
      />
    </head>
    <body className="relative bg-skin-base">
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      // enableSystem
      disableTransitionOnChange
    >
      <CommandPalette open={commandPaletteOpen} setOpen={setCommandPaletteOpen} />
      <ViewTracker />
      <div id="layout" className="layout flex-col flex min-h-screen">

        <Navigation setCommandPaletteOpen={setCommandPaletteOpen} />

        <div className="flex-1">
          {children}
        </div>

        <div>
          <Footer/>
        </div>
      </div>
    </ThemeProvider>


    <Image
      width={1512}
      height={550}
      className='absolute left-1/2 top-0 -z-10 -translate-x-1/2'
      src='/assets/gradient-background-top.png'
      alt=''
      priority
    />

    <Image
      width={1512}
      height={447}
      className='absolute -bottom-4 left-1/2 -z-10 -translate-x-1/2'
      src='/assets/gradient-background-bottom.png'
      alt=''
      priority
    />
    </body>
    </html>
  )
}
