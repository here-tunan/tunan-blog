import React from 'react';
import { notFound } from 'next/navigation';
import AppShell from '@/app/components/AppShell';
import { getSafeLocale, isLocale, locales } from '@/app/i18n/config';
import { getDictionary } from '@/app/i18n/get-dictionary';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  const locale = getSafeLocale(params.locale);
  const dictionary = getDictionary(locale);

  return (
    <AppShell locale={locale} dictionary={dictionary}>
      {children}
    </AppShell>
  );
}
