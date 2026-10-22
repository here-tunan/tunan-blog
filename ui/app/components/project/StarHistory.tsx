'use client';

import { useEffect, useState } from 'react';
import SectionHeader from '@/app/components/SectionHeader';

interface StarHistoryProps {
  repos: string[];
  linkUrl: string;
}

export default function StarHistory({ repos, linkUrl }: StarHistoryProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if dark mode is enabled
    const checkDarkMode = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };

    // Initial check
    checkDarkMode();

    // Watch for changes to the html class list
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const lightUrl = `https://api.star-history.com/svg?repos=${repos.join(',')}&type=Date`;
  const darkUrl = `https://api.star-history.com/svg?repos=${repos.join(',')}&type=Date&theme=dark`;

  return (
    <div className="mt-20">
      <SectionHeader title="Star History" />
      <p className="mb-8 max-w-xl text-sm text-muted-foreground">
        Track the growth and community support of my open source projects over time
      </p>

      <div className="mx-auto max-w-5xl rounded-xl border border-border bg-background p-4 sm:p-6">
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block transition-opacity hover:opacity-90"
        >
          <img
            src={isDark ? darkUrl : lightUrl}
            alt={`Star History Chart for ${repos.join(', ')}`}
            className="max-h-96 w-full rounded-lg object-contain"
            loading="lazy"
            key={isDark ? 'dark' : 'light'} // Force re-render when theme changes
          />
        </a>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Click the chart to explore detailed star history · Tracking {repos.length} repositories
        </p>
      </div>
    </div>
  );
}
