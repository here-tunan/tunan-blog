export const locales = ['en', 'zh-CN'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getSafeLocale(value: string | undefined): Locale {
  return value && isLocale(value) ? value : defaultLocale;
}

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  'zh-CN': '简体中文',
};