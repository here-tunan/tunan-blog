'use client'
import "./globals.css";
import React from "react";

import { Metadata } from 'next';
import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import {ThemeProvider} from "@/app/components/theme-provider";


export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
    <body className="relative bg-skin-base">
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      // enableSystem
      disableTransitionOnChange
    >
      <div id="layout" className="layout flex-col flex min-h-screen">

        <Navigation/>

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
