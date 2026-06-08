import { defaultLocale, isLocale, Locale } from './config';

export function stripLocale(pathname: string) {
  const segments = pathname.split('/');
  const maybeLocale = segments[1];

  if (isLocale(maybeLocale)) {
    const path = `/${segments.slice(2).join('/')}`;
    return path === '/' ? '/' : path.replace(/\/$/, '');
  }

  return pathname || '/';
}

export function withLocale(locale: Locale, path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return normalizedPath === '/' ? `/${locale}` : `/${locale}${normalizedPath}`;
}

export function replaceLocale(pathname: string, locale: Locale) {
  return withLocale(locale, stripLocale(pathname));
}

export function getPathLocale(pathname: string): Locale {
  const maybeLocale = pathname.split('/')[1];
  return isLocale(maybeLocale) ? maybeLocale : defaultLocale;
}
