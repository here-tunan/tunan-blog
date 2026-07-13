/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      // Article detail pages: edge cache 1h, allow stale for 1 day
      {
        source: '/:locale/blog/:slug',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
        ],
      },
      // Homepage: cache briefly (article list changes when new posts land)
      {
        source: '/:locale(zh-CN|en)',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=3600' },
        ],
      },
      // Blog list page
      {
        source: '/:locale/blog',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=3600' },
        ],
      },
      // Projects page
      {
        source: '/:locale/projects',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=300, stale-while-revalidate=86400' },
        ],
      },
      // About page (rarely changes)
      {
        source: '/:locale/about',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
        ],
      },
      // Never cache API responses served through Next
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'private, no-cache, no-store, max-age=0, must-revalidate' },
        ],
      },
      // Static assets served from /public
      {
        source: '/:path*.:ext(svg|jpg|jpeg|png|webp|avif|gif|ico|woff2|woff|ttf)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
