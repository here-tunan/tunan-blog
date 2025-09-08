'use client'

import React, { useState, useEffect } from 'react';
import service from '@/app/api/request';

// Add keyframes for fade in animation
const fadeInUpStyle = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

interface FriendLink {
  id: number;
  title: string;
  url: string;
  description?: string;
  sort_order: number;
}

export default function FriendsPage() {
  const [friendLinks, setFriendLinks] = useState<FriendLink[]>([]);
  const [loading, setLoading] = useState(true);

  // 为fallback生成不同的颜色主题
  const getColorTheme = (index: number) => {
    const themes = [
      'from-blue-500 via-blue-600 to-blue-700',
      'from-purple-500 via-purple-600 to-purple-700',
      'from-pink-500 via-pink-600 to-pink-700',
      'from-green-500 via-green-600 to-green-700',
      'from-yellow-500 via-yellow-600 to-yellow-700',
      'from-red-500 via-red-600 to-red-700',
      'from-indigo-500 via-indigo-600 to-indigo-700',
      'from-teal-500 via-teal-600 to-teal-700',
    ];
    return themes[index % themes.length];
  };

  useEffect(() => {
    const fetchFriendLinks = async () => {
      try {
        const response = await service.get('/friend-links');
        setFriendLinks(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch friend links:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendLinks();
  }, []);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200/50 dark:bg-gray-700/50 rounded w-32 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200/30 dark:bg-gray-700/30 rounded w-64 mx-auto mb-4"></div>
            <div className="w-24 h-1 bg-blue-500/50 mx-auto rounded-full"></div>
          </div>
        </div>
        <div className="grid gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-200/50 dark:bg-blue-800/50 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200/50 dark:bg-gray-700/50 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200/30 dark:bg-gray-700/30 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200/30 dark:bg-gray-700/30 rounded w-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{fadeInUpStyle}</style>
      <div className="container max-w-6xl mx-auto px-4 py-6">
      {/* Header with modern gradient */}
      <div className="relative mb-12 text-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-32 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-3xl rounded-full"></div>
        </div>
        <div className="relative">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Friends & Links
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Amazing websites and talented friends I&apos;d love to share with you
          </p>
        </div>
      </div>

      {friendLinks.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No friend links yet, coming soon...
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {friendLinks.map((link, index) => (
            <div
              key={link.id}
              className="group relative bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/60 dark:border-gray-700/60 p-5 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300/60 dark:hover:border-blue-600/60 transition-all duration-300 hover:-translate-y-1"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-purple-500/[0.02] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 block"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-200 shadow-lg border border-gray-200/50 dark:border-gray-600/50 overflow-hidden">
                      <img 
                        src={`https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=64`}
                        alt={`${link.title} favicon`}
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          // 如果 favicon 加载失败，显示首字母/首字符
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div 
                        className={`w-full h-full bg-gradient-to-br ${getColorTheme(index)} rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-inner`} 
                        style={{ display: 'none' }}
                      >
                        {/* 获取标题的第一个字符，支持中文和英文 */}
                        {link.title.trim().charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 truncate">
                        {link.title}
                      </h3>
                      <svg 
                        className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mb-2 truncate">
                      {new URL(link.url).hostname}
                    </p>
                    
                    {link.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                        {link.description}
                      </p>
                    )}
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Action Section - Split into two cards */}
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {/* Apply for Friends Card */}
        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-purple-950/40 p-6 border border-blue-100/50 dark:border-blue-700/40 hover:border-blue-300/80 dark:hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-500 hover:scale-[1.02]">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-300/30 via-purple-300/30 to-indigo-300/30 dark:from-blue-400/20 dark:via-purple-400/20 dark:to-indigo-400/20 rounded-full -translate-y-12 translate-x-12 transition-all duration-700 ease-out group-hover:scale-125 group-hover:-translate-y-14 group-hover:translate-x-14 group-hover:rotate-45 group-hover:opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-indigo-300/30 via-pink-300/30 to-purple-300/30 dark:from-indigo-400/20 dark:via-pink-400/20 dark:to-purple-400/20 rounded-full translate-y-10 -translate-x-10 transition-all duration-700 ease-out group-hover:scale-110 group-hover:translate-y-12 group-hover:-translate-x-12 group-hover:-rotate-45 group-hover:opacity-60"></div>
          
          <div className="relative text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/25">
              <svg className="w-6 h-6 text-white transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Want to be friends?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              If you have an amazing website, drop a comment in the article below and let&apos;s connect!
            </p>
            
            <a
              href="https://www.tunan.fun/blog/blog-07"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 border border-white/60 dark:border-gray-700/60 shadow-sm transition-all duration-300 hover:shadow-lg hover:bg-white/90 dark:hover:bg-gray-800/90 hover:scale-105 hover:border-blue-300/60 dark:hover:border-blue-600/60"
            >
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Click here to apply for friend links
              </span>
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        {/* Random Travel Card */}
        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 dark:from-emerald-950/40 dark:via-cyan-950/40 dark:to-blue-950/40 p-6 border border-emerald-100/50 dark:border-emerald-700/40 hover:border-emerald-300/80 dark:hover:border-emerald-500/60 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-500 hover:scale-[1.02]">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-300/30 via-cyan-300/30 to-blue-300/30 dark:from-emerald-400/20 dark:via-cyan-400/20 dark:to-blue-400/20 rounded-full -translate-y-12 translate-x-12 transition-all duration-700 ease-out group-hover:scale-125 group-hover:-translate-y-14 group-hover:translate-x-14 group-hover:-rotate-45 group-hover:opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-cyan-300/30 via-teal-300/30 to-emerald-300/30 dark:from-cyan-400/20 dark:via-teal-400/20 dark:to-emerald-400/20 rounded-full translate-y-10 -translate-x-10 transition-all duration-700 ease-out group-hover:scale-110 group-hover:translate-y-12 group-hover:-translate-x-12 group-hover:rotate-45 group-hover:opacity-60"></div>
          
          {/* Floating compass decoration */}
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-gradient-to-br from-emerald-400/50 to-cyan-400/50 dark:from-emerald-300/40 dark:to-cyan-300/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 group-hover:animate-spin"></div>
          
          <div className="relative text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-full flex items-center justify-center transition-all duration-500 ease-out group-hover:scale-115 group-hover:shadow-xl group-hover:shadow-emerald-500/40 group-hover:bg-gradient-to-br group-hover:from-cyan-500 group-hover:to-blue-500 cursor-pointer" onClick={() => {
              if (friendLinks.length > 0) {
                const randomLink = friendLinks[Math.floor(Math.random() * friendLinks.length)];
                window.open(randomLink.url, '_blank');
              }
            }}>
              <svg className="w-6 h-6 text-white transition-all duration-500 ease-out group-hover:translate-x-3 group-hover:-translate-y-2 group-hover:rotate-12 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.426 11.095l-17-8A.999.999 0 003.03 4.242L4.969 12 3.03 19.758a.998.998 0 001.396 1.147l17-8a1 1 0 000-1.81zM5.481 18.197l.839-3.357L12 12 6.32 9.16l-.839-3.357L18.651 12l-13.17 6.197z"/>
              </svg>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Random Travel
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Feeling adventurous? Click to randomly visit one of our amazing friend sites!
            </p>
            
            <button 
              onClick={() => {
                if (friendLinks.length > 0) {
                  const randomLink = friendLinks[Math.floor(Math.random() * friendLinks.length)];
                  window.open(randomLink.url, '_blank');
                }
              }}
              disabled={friendLinks.length === 0}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-full px-6 py-2 font-medium text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <svg className="w-4 h-4 transition-transform duration-300 hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Let&apos;s Go!</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}