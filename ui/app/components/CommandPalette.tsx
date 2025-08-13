'use client';

import { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/config';

interface SearchItem {
  title: string;
  url: string;
  type: string;
}

interface CommandPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const [items, setItems] = useState<SearchItem[]>([]);
  const router = useRouter();

  // Fetch search data
  useEffect(() => {
    if (items.length === 0) { // Only fetch once
      async function fetchData() {
        try {
          const res = await fetch(`${API_URL}/search`);
          const data = await res.json();
          setItems(data);
        } catch (error) {
          console.error('Failed to fetch search items:', error);
        }
      }
      fetchData();
    }
  }, [items.length]);

  // Toggle the menu when the user presses cmd+k
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, setOpen]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <Command.Dialog 
      open={open} 
      onOpenChange={setOpen} 
      label="Global Command Menu"
    >
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Dialog Content */}
      <div 
        className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
        onClick={() => setOpen(false)} // Also close when clicking in the padding area
      >
        <div
          className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing the dialog
        >
          <Command.Input 
            placeholder="Search for articles, pages..." 
            className="w-full px-4 py-3 text-lg bg-transparent border-b border-gray-200 dark:border-gray-700 focus:outline-none"
          />
          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            <Command.Empty className="p-4 text-sm text-center text-gray-500">No results found.</Command.Empty>

            <Command.Group heading="Pages" className="text-xs font-medium text-gray-400 px-2 py-1">
              {items.filter(item => item.type === 'Page').map(item => (
                <Command.Item
                  key={item.url}
                  value={item.title}
                  onSelect={() => runCommand(() => router.push(item.url))}
                  className="p-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
                >
                  {item.title}
                  <span className="text-xs text-gray-400">Page</span>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Blog" className="text-xs font-medium text-gray-400 px-2 py-1">
              {items.filter(item => item.type === 'Blog').map(item => (
                <Command.Item
                  key={item.url}
                  value={item.title}
                  onSelect={() => runCommand(() => router.push(item.url))}
                  className="p-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
                >
                  {item.title}
                  <span className="text-xs text-gray-400">Blog Post</span>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Weekly" className="text-xs font-medium text-gray-400 px-2 py-1">
              {items.filter(item => item.type === 'Weekly').map(item => (
                <Command.Item
                  key={item.url}
                  value={item.title}
                  onSelect={() => runCommand(() => router.push(item.url))}
                  className="p-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
                >
                  {item.title}
                  <span className="text-xs text-gray-400">Weekly</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </div>
      </div>
    </Command.Dialog>
  );
}
