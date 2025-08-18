'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Layout, Spin } from 'antd';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        setIsAuthenticated(true);
      } else if (pathname !== '/login') {
        router.replace('/login');
      }
    }
  }, [isClient, pathname, router]);

  if (!isClient || (!isAuthenticated && pathname !== '/login')) {
    return (
      <Layout style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
      </Layout>
    );
  }

  return <>{children}</>;
}
