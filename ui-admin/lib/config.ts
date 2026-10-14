// 同 ui/lib/config.ts:服务端有 API_URL_INTERNAL 走本机,浏览器端走公网域名
export const API_URL = process.env.NODE_ENV === 'production'
  ? (process.env.API_URL_INTERNAL || 'https://tunan.fun/api')
  : 'http://127.0.0.1:3002/api';
