'use client'

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  name: string;
  target?: string;
}

export default function NavButton({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const active = pathname === item.href;

  return (
    <Link
      href={item.href}
      target={item.target}
      className={`group relative whitespace-nowrap px-2.5 py-2 text-sm transition-colors sm:px-3 sm:text-[15px] ${
        active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {item.name}
      <span
        aria-hidden="true"
        className={`absolute inset-x-3 bottom-0.5 h-px origin-left bg-foreground transition-transform duration-200 ${
          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`}
      />
    </Link>
  );
}
