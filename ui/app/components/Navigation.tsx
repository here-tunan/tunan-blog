'use client'

import React, {useEffect, useState} from "react";
import NavButton from "@/app/components/NavButton";
import {useTheme} from "next-themes";
import {themes} from "@/app/themes";

// 导航内容
const items = [
  {
    "name": "Home",
    "href": "/",
    "img": "/assets/icons/home.png",
    "target": "_self",
  },
  {
    "name": "Blog",
    "href": "/blog",
    "img": "/assets/icons/blog.png",
    "target": "_self",
  },
  {
    "name": "Weekly",
    "href": "/weekly",
    "img": "/assets/icons/7-days.png",
    "target": "_self",
  },
  {
    "name": "About",
    "href": "/about",
    "img": "/assets/icons/cool.png",
    "target": "_self",
  },
  {
    "name": "Projects",
    "href": "/projects",
    "img": "/assets/icons/project.png",
    "target": "_self",
  },
  {
    "name": "Github",
    "href": "https://github.com/here-tunan",
    "img": "/assets/icons/github.png",
    "target": "_blank",
  },

]

export default function Navigation() {

  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const changeBackground = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    document.addEventListener('scroll', changeBackground)

    return () => document.removeEventListener('scroll', changeBackground)
  }, [])

  const [themeState, setThemeState] = useState(0)

  const { setTheme } = useTheme()

  const themeToggleHandler = () => {
    const newTheme = themes[(themeState + 1) % themes.length].theme
    setThemeState((themeState + 1) % themes.length)
    console.log(newTheme)
    setTheme(newTheme)
  }

  // 更新 Remark42 的主题并重新初始化
  const updateTheme = (themeState: number) => {
    if (window && window.REMARK42) {
      let theme = themes[(themeState) % themes.length].theme; // 更新主题配置
      window.REMARK42.changeTheme(theme)
    }
  };
  useEffect(() => {
    updateTheme(themeState); // 组件加载时设置主题
  }, [themeState]);

  return (
    <div
      className={`fixed z-50 flex inset-x-0 top-4 mx-auto h-[55px] max-w-screen-lg items-center justify-between rounded-2xl bg-background/30 shadow-sm saturate-100 backdrop-blur-[10px] transition-colors 
      ${isScrolled && 'bg-background/80'}`}>
      <nav className="flex items-center gap-3">
        {items.map((item, i) => (
          <NavButton item={item} key={i}/>
        ))}
      </nav>
      <button className="theme-toggle-button p-3 rounded-full border"
              onClick={themeToggleHandler}>
        <img alt="Theme" height="20px" width="25px"></img>
      </button>
    </div>

  );
}