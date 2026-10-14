// 浏览器端:走公网域名(该变量进浏览器包)
// 服务端渲染:systemd 注入 API_URL_INTERNAL=http://127.0.0.1:3002/api,本机直连,
// 不依赖公网 DNS/CDN 是否可达(客户端包里此变量会被替换为 undefined,自动回落公网地址)
export const API_URL = process.env.NODE_ENV === 'production'
  ? (process.env.API_URL_INTERNAL || 'https://tunan.fun/api')
  : 'http://127.0.0.1:3002/api';
