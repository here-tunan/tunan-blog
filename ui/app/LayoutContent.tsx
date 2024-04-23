'use client'
import React, {useContext} from "react";
import {ThemeContext} from "@/app/CustomThemeProvider";
import Footer from "@/app/components/Footer";
import Navigation from "@/app/components/Navigation";
import Image from "next/image";

export default function LayoutContent({
                         children,
                       }: Readonly<{
  children: React.ReactNode;
}>) {
  const {theme, toggleTheme} = useContext(ThemeContext);

  return (
    <html lang="en" className={theme}>
    <body className="relative bg-skin-base">
      <div id="layout" className="layout flex-col flex min-h-screen">

        <Navigation theme={theme} themeToggleHandler={toggleTheme}/>

        <div className="flex-1">
          {children}
        </div>

        <div>
          <Footer/>
        </div>
      </div>

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
  );
}