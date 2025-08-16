'use client';

import React from 'react';
import { Switch } from 'antd';
import { useTheme } from '../ThemeProvider';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Switch
      checked={theme === 'dark'}
      onChange={toggleTheme}
      checkedChildren={<MoonOutlined />}
      unCheckedChildren={<SunOutlined />}
    />
  );
};

export default ThemeSwitcher;
