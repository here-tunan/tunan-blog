'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { CustomThemeProvider, useTheme } from './ThemeProvider';
import AuthGuard from './components/AuthGuard';
import ThemeSwitcher from './components/ThemeSwitcher';
import { Layout, Menu, Typography, Button, theme as antdTheme } from 'antd';
import { 
  DashboardOutlined, 
  FileTextOutlined, 
  BookOutlined, 
  MenuUnfoldOutlined, 
  MenuFoldOutlined 
} from '@ant-design/icons';
import Link from 'next/link';
import './globals.css';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { token } = antdTheme.useToken();
  const { theme } = useTheme();

  const getTitle = () => {
    if (pathname.startsWith('/articles')) return 'Article Management';
    if (pathname.startsWith('/books')) return 'Book Management';
    if (pathname.startsWith('/dashboard')) return 'Dashboard';
    return 'Admin';
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Header style={{
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: theme === 'dark' ? token.colorBgLayout : '#001529',
        borderBottom: `1px solid ${token.colorBorder}`
      }}>
        <div style={{ fontSize: '20px', color: 'white', marginRight: '24px' }}>Tunan Blog</div>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ fontSize: '16px', width: 64, height: 64, color: 'white' }}
        />
        <div style={{ marginLeft: 'auto' }}><ThemeSwitcher /></div>
      </Header>
      <Layout style={{ overflow: 'hidden' }}>
        <Sider 
          width={200} 
          collapsed={collapsed} 
          collapsible 
          trigger={null}
          style={{ backgroundColor: token.colorBgContainer, borderRight: `1px solid ${token.colorBorder}` }}
        >
          <Menu 
            mode="inline"
            selectedKeys={[pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={[
              { key: '/dashboard', icon: <DashboardOutlined />, label: <Link href="/dashboard">Dashboard</Link> },
              { key: '/articles', icon: <FileTextOutlined />, label: <Link href="/articles">Articles</Link> },
              { key: '/books', icon: <BookOutlined />, label: <Link href="/books">Books</Link> },
            ]}
          />
        </Sider>
        <Content style={{ overflow: 'auto', padding: '24px' }}>
          <Title level={3} style={{ marginBottom: '24px' }}>{getTitle()}</Title>
          <div style={{ padding: 24, background: token.colorBgContainer, borderRadius: token.borderRadiusLG, color: token.colorText }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        <title>tunan&apos;s blog admin</title>
        <link rel="shortcut icon" href="/favicon/favicon.ico?v=2"/>
      </head>
      <body>
        <AntdRegistry>
          <CustomThemeProvider>
            <AuthGuard>
              {pathname === '/login' ? children : <AppLayout>{children}</AppLayout>}
            </AuthGuard>
          </CustomThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
};

export default RootLayout;

