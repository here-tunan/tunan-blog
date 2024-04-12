'use client'
import "./globals.css";
import React, {useState} from "react";
import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [theme, setTheme] = useState('light')

  function themeToggleHandler() {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    window.localStorage.setItem('theme', newTheme)
    setTheme(newTheme)
  }

  return (
    <html lang="en" className={theme}>
      <body>
        <div id="layout" className="layout flex-col flex min-h-screen bg-skin-base">

          <Navigation themeToggleHandler={themeToggleHandler}/>

          <div className="flex-1">
            {children}
          </div>

          <div>
            <Footer />
          </div>

        </div>
      </body>
    </html>
  )
}
