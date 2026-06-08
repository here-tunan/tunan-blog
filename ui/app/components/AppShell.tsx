'use client'

import React, { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import CommandPalette from '@/app/components/CommandPalette';
import { ViewTracker } from '@/app/components/ViewTracker';
import { ThemeProvider } from '@/app/components/theme-provider';
import { Locale } from '@/app/i18n/config';
import { Dictionary } from '@/app/i18n/get-dictionary';
import { LocaleProvider } from '@/app/i18n/locale-context';

export default function AppShell({
  children,
  dictionary,
  locale,
}: Readonly<{
  children: React.ReactNode;
  dictionary: Dictionary;
  locale: Locale;
}>) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LocaleProvider locale={locale} dictionary={dictionary}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        disableTransitionOnChange
      >
        <CommandPalette open={commandPaletteOpen} setOpen={setCommandPaletteOpen} />
        <ViewTracker />
        <div id="layout" className="layout flex-col flex min-h-screen">
          <Suspense fallback={<div className="fixed inset-x-0 top-4 mx-auto h-[55px] max-w-screen-lg" />}>
            <Navigation setCommandPaletteOpen={setCommandPaletteOpen} />
          </Suspense>

          <div className="flex-1">
            {children}
          </div>

          <div>
            <Footer />
          </div>
        </div>
      </ThemeProvider>

      <Image
        width={1512}
        height={550}
        className="absolute left-1/2 top-0 -z-10 -translate-x-1/2"
        src="/assets/gradient-background-top.png"
        alt=""
        priority
      />

      <Image
        width={1512}
        height={447}
        className="absolute -bottom-4 left-1/2 -z-10 -translate-x-1/2"
        src="/assets/gradient-background-bottom.png"
        alt=""
        priority
      />
    </LocaleProvider>
  );
}
