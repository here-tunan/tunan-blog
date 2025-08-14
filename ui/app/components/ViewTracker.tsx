'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { API_URL } from '@/lib/config';

export function ViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // 只在浏览器环境中执行
    if (typeof window === 'undefined') {
      return;
    }

    // 排除 API 路由和静态资源
    if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
      return;
    }

    fetch(`${API_URL}/view/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path: pathname }),
      keepalive: true, // 保证在页面卸载时请求也能发送
    }).catch(err => {
      console.error('Failed to track view:', err);
    });

  }, [pathname]);

  return null; // 这个组件不渲染任何UI
}
