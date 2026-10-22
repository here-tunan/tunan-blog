import React from 'react';
import BlogsSection from '@/app/components/home/BlogsSection';
import WeeklySection from '@/app/components/home/WeeklySection';
import TranslationsSection from '@/app/components/home/TranslationsSection';
import HistorySection from '@/app/components/home/HistorySection';
import AnimatedSubtitle from '@/app/components/AnimatedSubtitle';
import { getSafeLocale } from '@/app/i18n/config';
import { getDictionary } from '@/app/i18n/get-dictionary';

export default function Home({ params }: { params: { locale: string } }) {
  const locale = getSafeLocale(params.locale);
  const dictionary = getDictionary(locale);

  return (
    <main className="min-h-screen">
      <div className="container px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Welcome Section with improved styling */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 mb-8 border-b border-border">
          <header className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-display">
              <span className="text-4xl inline-block animate-wave">👋</span>{' '}
              {dictionary.home.welcome}
            </h1>
            <AnimatedSubtitle />
          </header>
          <div className="mt-4 sm:mt-0 flex-shrink-0">
            <img
              src="/assets/me-avatar.jpeg"
              width="100"
              className="rounded-full border border-border shadow-[0_1px_3px_rgba(0,0,0,0.10)] transition-transform duration-300 hover:scale-[1.03] sm:w-[120px]"
              alt="Tunan"
            />
          </div>
        </div>

        {/* Main Content with better spacing */}
        <div className="space-y-12">
          <WeeklySection locale={locale} />
          <BlogsSection locale={locale} />
          <TranslationsSection locale={locale} />
          <HistorySection locale={locale} />
        </div>
      </div>
    </main>
  );
}
