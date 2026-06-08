import React from "react";
import Link from "next/link";
import HistoryHorizontalTimeline from "@/app/components/history/HistoryHorizontalTimeline";
import { Locale } from "@/app/i18n/config";
import { getDictionary } from "@/app/i18n/get-dictionary";
import { withLocale } from "@/app/i18n/routes";
import { ARTICLE_TYPES, getArticles } from "@/lib/articles";

export default async function HistorySection({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const historyEvents = await getArticles({
    locale,
    type: ARTICLE_TYPES.history,
    pageSize: 10,
    pageIndex: 1,
  });

  // Don't render if no history events
  if (historyEvents.length === 0) {
    return null;
  }

  return (
    <section className="section mt-2">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-0.5 h-5 bg-orange-500 rounded-full"></div>
          <h3 className="font-mono font-semibold text-lg">{dictionary.home.blogEvolution}</h3>
          <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded-full">
            {dictionary.home.timeline}
          </span>
        </div>
        <Link
          href={withLocale(locale, '/history')}
          className="text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors flex items-center gap-1 group hover:gap-2"
        >
          <span>{dictionary.home.viewFullTimeline}</span>
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </header>

      <HistoryHorizontalTimeline events={historyEvents} locale={locale} />
    </section>
  )
}