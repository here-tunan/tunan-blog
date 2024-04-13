import "./globals.css";
import React from "react";
import CustomThemeProvider from "@/app/CustomThemeProvider";
import LayoutContent from "@/app/LayoutContent";

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Tunan's blog",
  description: "tunan's blog",
  icons: {
    icon: '/favicon/favicon.ico',
  }
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <CustomThemeProvider>
      <LayoutContent>
        {children}
      </LayoutContent>
    </CustomThemeProvider>
  )
}
