'use client'

import React, {useEffect, useState} from "react";
import NavButton from "@/app/components/NavButton";
import ArticleDropdown from "@/app/components/ArticleDropdown";
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
    "name": "Projects",
    "href": "/projects",
    "img": "/assets/icons/project.png",
    "target": "_self",
  },
  {
    "name": "About",
    "href": "/about",
    "img": "/assets/icons/cool.png",
    "target": "_self",
  },
]

// 文章相关的下拉菜单内容
const articleItems = [
  {
    "name": "Blog Posts",
    "href": "/blog",
    "description": "Personal thoughts and insights"
  },
  {
    "name": "Weekly Reports",
    "href": "/weekly",
    "description": "Weekly updates and summaries"
  },
  {
    "name": "Translations",
    "href": "/translations",
    "description": "Translated articles from other languages"
  },
  {
    "name": "Blog History",
    "href": "/history",
    "description": "Timeline of blog evolution and milestones"
  },
]

export default function Navigation({ setCommandPaletteOpen }: { setCommandPaletteOpen: (open: boolean) => void }) {

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
      className={`fixed z-50 flex inset-x-0 top-4 mx-auto h-[55px] max-w-screen-lg items-center justify-between rounded-2xl bg-background/30 shadow-sm saturate-100 backdrop-blur-[10px] transition-colors px-2 sm:px-4 
      ${isScrolled && 'bg-background/80'}`}>
      <nav className="flex items-center gap-1 sm:gap-3">
        {items.map((item, i) => (
          <NavButton item={item} key={i}/>
        ))}
        <ArticleDropdown items={articleItems} />
      </nav>
      <div className="flex items-center gap-1 sm:gap-3">
        {/* Social Icons Group - hide some on small screens */}
        <div className="flex items-center gap-1">
          <a 
            href="/friends" 
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-blue-100/70 dark:hover:bg-blue-900/30 transition-colors group"
            title="friends"
          >
            <img src="/assets/icons/paper-flight.png" alt="friends" className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
          </a>

          <a 
            href="https://github.com/here-tunan" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100/70 dark:hover:bg-gray-700/30 transition-colors group"
            title="GitHub Profile"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>

          <a 
            href="https://discord.gg/AQzmnCHbNE" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full hover:bg-indigo-100/70 dark:hover:bg-indigo-900/30 transition-colors group"
            title="Join Discord Server"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-600 group-hover:text-indigo-700 transition-colors">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0003 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z"/>
            </svg>
          </a>

          <a 
            href="https://app.folo.is/share/users/56967488590381056" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full hover:bg-orange-50 dark:hover:bg-orange-950 transition-colors group"
            title="Follow on Folo"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" className="flex-shrink-0">
              <title>Folo</title>
              <path fill="#ff5c00"
                    d="M5.382 0h13.236A5.37 5.37 0 0 1 24 5.383v13.235A5.37 5.37 0 0 1 18.618 24H5.382A5.37 5.37 0 0 1 0 18.618V5.383A5.37 5.37 0 0 1 5.382.001Z"></path>
              <path fill="#fff"
                    d="M13.269 17.31a1.813 1.813 0 1 0-3.626.002 1.813 1.813 0 0 0 3.626-.002m-.535-6.527H7.213a1.813 1.813 0 1 0 0 3.624h5.521a1.813 1.813 0 1 0 0-3.624m4.417-4.712H8.87a1.813 1.813 0 1 0 0 3.625h8.283a1.813 1.813 0 1 0 0-3.624z"></path>
            </svg>
          </a>

          <a 
            href="/rss.xml" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full hover:bg-orange-100/70 dark:hover:bg-orange-900/30 transition-colors group"
            title="RSS Feed"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-orange-500 group-hover:text-orange-600 transition-colors">
              <path d="M4 11a9 9 0 0 1 9 9"></path>
              <path d="M4 4a16 16 0 0 1 16 16"></path>
              <circle cx="5" cy="19" r="1"></circle>
            </svg>
          </a>
        </div>
        
        <button 
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 rounded-full border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <span className="hidden sm:inline">Search...</span>
          <span className="sm:hidden">🔍</span>
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 md:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
        <button className="theme-toggle-button p-3 rounded-full border"
                onClick={themeToggleHandler}>
          <img alt="Theme" height="20px" width="25px"></img>
        </button>
      </div>
    </div>

  );
}