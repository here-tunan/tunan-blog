'use client'

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ArticleItem {
  name: string;
  href: string;
  description: string;
}

interface ArticleDropdownProps {
  items: ArticleItem[];
  label: string;
}

export default function ArticleDropdown({ items, label }: ArticleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Check if current path matches any article routes
  const isActive = items.some(item => pathname.startsWith(item.href));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors sm:px-4 sm:text-[15px] ${
          isActive
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
        }`}
      >
        <span className="sr-only sm:not-sr-only">{label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 max-w-[90vw] bg-background border border-border rounded-xl shadow-xl z-50 animate-in fade-in-0 zoom-in-95 duration-200 overflow-hidden">
          <div className="p-2 space-y-1">
            {items.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  pathname.startsWith(item.href)
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <div className="font-semibold text-sm">{item.name}</div>
                <div className="text-xs opacity-75 mt-1 line-clamp-2">{item.description}</div>
              </Link>
            ))}
          </div>
          <div className="absolute -top-2 left-4 w-4 h-4 bg-background border-l border-t border-border rotate-45 rounded-tl-sm"></div>
        </div>
      )}
    </div>
  );
}