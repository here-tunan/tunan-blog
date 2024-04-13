'use client'
import React, {useContext} from "react";
import {ThemeContext} from "@/app/CustomThemeProvider";
import Footer from "@/app/components/Footer";
import Navigation from "@/app/components/Navigation";

export default function LayoutContent({
                         children,
                       }: Readonly<{
  children: React.ReactNode;
}>) {
  const {theme, toggleTheme} = useContext(ThemeContext);

  return (
    <html lang="en" className={theme}>
    <body>
    <div id="layout" className="layout flex-col flex min-h-screen bg-skin-base">

      <Navigation themeToggleHandler={toggleTheme}/>

      <div className="flex-1">
        {children}
      </div>

      <div>
        <Footer/>
      </div>

    </div>
    </body>
    </html>
  );
}