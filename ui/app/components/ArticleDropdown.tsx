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
}

export default function ArticleDropdown({ items }: ArticleDropdownProps) {
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
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-md hover:scale-105 ${
          isActive 
            ? 'bg-accent text-accent-foreground shadow-sm border border-accent/30' 
            : 'hover:bg-accent/30'
        } ${isOpen ? 'shadow-lg ring-2 ring-accent/50' : ''}`}
      >
        <img 
          src="/assets/icons/blog.png" 
          alt="Articles" 
          width="20" 
          height="20" 
          className="opacity-80"
        />
        <span>Articles</span>
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
        <div className="absolute top-full left-0 mt-2 w-72 max-w-[90vw] bg-background/80 backdrop-blur-lg border border-border/50 rounded-lg shadow-xl z-50 animate-in fade-in-0 zoom-in-95 duration-200 overflow-hidden">
          <div className="p-2 space-y-1">
            {items.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-all duration-200 hover:scale-[1.01] ${
                  pathname.startsWith(item.href) 
                    ? 'bg-accent/60 text-accent-foreground shadow-sm border border-accent/30' 
                    : 'hover:bg-accent/30 hover:shadow-md'
                }`}
              >
                <div className="font-semibold text-sm">{item.name}</div>
                <div className="text-xs opacity-75 mt-1 line-clamp-2">{item.description}</div>
              </Link>
            ))}
          </div>
          <div className="absolute -top-2 left-4 w-4 h-4 bg-background/80 backdrop-blur-lg border-l border-t border-border/50 rotate-45 rounded-tl-sm"></div>
        </div>
      )}
    </div>
  );
}