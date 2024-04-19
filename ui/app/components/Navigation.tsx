import React from "react";
import NavButton from "@/app/components/NavButton";

// 导航内容
const items = [
  {
    "name": "Home",
    "href": "/",
    "img": "assets/icons/home.png",
    "target": "_self",
  },
  {
    "name": "Blog",
    "href": "/blog",
    "img": "assets/icons/blog.png",
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

const themeLightIcon = "/assets/icons/sun.png";
const themeDarkIcon = "/assets/icons/moon.png";

interface NavigationProps {
  theme: string,
  themeToggleHandler: () => void
}

export default function Navigation({theme, themeToggleHandler}: NavigationProps) {

  return (
    <div
      className="fixed flex inset-x-0 top-4 mx-auto h-[55px] max-w-4xl items-center justify-between rounded-2xl bg-background/30 shadow-sm saturate-100 backdrop-blur-[10px]">
      <nav className="flex items-center gap-3">
        {items.map((item, i) => (
          <NavButton item={item} key={i}/>
        ))}
      </nav>
      <button className="p-3 rounded-full border"
              onClick={themeToggleHandler}>
        <img src={theme === 'light' ? themeLightIcon : themeDarkIcon} alt="Theme" height="20px" width="25px"></img>
      </button>
    </div>

  );
}