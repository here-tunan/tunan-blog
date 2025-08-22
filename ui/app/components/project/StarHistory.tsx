'use client';

import { useEffect, useState } from 'react';

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
    <div className="mt-20 text-center">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
          ⭐ Star History
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-red-500 mx-auto rounded-full"></div>
      </div>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
        Track the growth and community support of my open source projects over time
      </p>
      
      {/* Star History Chart */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 max-w-5xl mx-auto">
        <a 
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:opacity-90 transition-opacity"
        >
          <img 
            src={isDark ? darkUrl : lightUrl}
            alt={`Star History Chart for ${repos.join(', ')}`}
            className="w-full max-h-96 object-contain rounded-lg transition-opacity duration-300"
            loading="lazy"
            key={isDark ? 'dark' : 'light'} // Force re-render when theme changes
          />
        </a>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Click the chart to explore detailed star history • Tracking {repos.length} repositories
        </p>
      </div>
    </div>
  );
}