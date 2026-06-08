import React from "react";
import Link from "next/link";

type NavItem = {
  href: string;
  img: string;
  name: string;
  target?: string;
}

export default function NavButton({item} : {item: NavItem}) {
  return (
    <div>
      <Link href={item.href} target={item.target} className="cursor-pointer flex items-center gap-2 py-2 px-3">
        <img src={item.img} alt={item.name} className="w-5 h-5"/>
        <span className="text-1.5xl">{item.name}</span>
      </Link>
    </div>
  )
}