import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, isLocale } from '@/app/i18n/config';

const PUBLIC_FILE = /\.[^/]+$/;

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/login') ||
    pathname === '/rss.xml' ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/fonts') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const firstSegment = pathname.split('/')[1];
  if (isLocale(firstSegment)) {
    return NextResponse.next();
  }

  // standalone 模式下 Next 用 HOSTNAME/PORT 环境变量构造 URL,忽略真实 Host 头,
  // 生产环境经 Caddy 反代时必须用 x-forwarded-* 还原真实域名(见 deploy/Caddyfile)
  const forwardedHost = request.headers.get('x-forwarded-host') ?? request.nextUrl.host;
  const forwardedProto = request.headers.get('x-forwarded-proto') ?? request.nextUrl.protocol;

  const redirectPath = pathname === '/' ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(new URL(`${forwardedProto}://${forwardedHost}${redirectPath}${search}`));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
