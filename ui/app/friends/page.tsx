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
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="h-9 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-4 h-4 w-72 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-border bg-background p-5">
              <div className="flex items-start space-x-3">
                <div className="h-10 w-10 rounded-lg bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                  <div className="h-3 w-full rounded bg-muted" />
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
      <div className="container max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-4xl text-foreground">
            Friends &amp; Links
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Amazing websites and talented friends I&apos;d love to share with you
          </p>
          <div className="mt-5 h-px w-12 bg-border" />
        </div>

        {friendLinks.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">
              No friend links yet, coming soon...
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {friendLinks.map((link, index) => (
              <div
                key={link.id}
                className="group rounded-xl border border-border bg-background transition-colors hover:border-foreground/25"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="block p-5">
                  <div className="flex items-start space-x-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=64`}
                        alt={`${link.title} favicon`}
                        className="h-6 w-6 object-contain"
                        onError={(e) => {
                          // 如果 favicon 加载失败，显示首字母/首字符
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div
                        className="flex h-full w-full items-center justify-center font-display text-sm text-foreground"
                        style={{ display: 'none' }}
                      >
                        {/* 获取标题的第一个字符，支持中文和英文 */}
                        {link.title.trim().charAt(0).toUpperCase()}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center space-x-1.5">
                        <h3 className="truncate font-medium text-foreground transition-colors group-hover:text-primary">
                          {link.title}
                        </h3>
                        <svg
                          className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>

                      <p className="mb-1 truncate font-mono text-xs text-muted-foreground">
                        {new URL(link.url).hostname}
                      </p>

                      {link.description && (
                        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
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

        {/* Action Section */}
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {/* Apply for Friends */}
          <div className="rounded-xl border border-border bg-background p-6 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>

            <h3 className="font-display text-lg text-foreground">
              Want to be friends?
            </h3>
            <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
              If you have an amazing website, drop a comment in the article below and let&apos;s connect!
            </p>

            <a
              href="https://www.tunan.fun/blog/blog-07"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 inline-flex items-center gap-1.5 text-sm text-primary transition-colors hover:text-accent-foreground"
            >
              Apply for a friend link
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </a>
          </div>

          {/* Random Travel */}
          <div className="rounded-xl border border-border bg-background p-6 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h3 className="font-display text-lg text-foreground">
              Random Travel
            </h3>
            <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
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
              className="mt-4 rounded-full border border-primary/40 px-5 py-1.5 text-sm text-primary transition-colors hover:bg-accent active:scale-[0.98] disabled:cursor-not-allowed disabled:border-border disabled:text-muted-foreground disabled:hover:bg-transparent"
            >
              Let&apos;s Go!
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
