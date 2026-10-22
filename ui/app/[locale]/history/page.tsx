import React from "react";
import HistoryTimeline from "@/app/components/history/HistoryTimeline";
import { getSafeLocale } from "@/app/i18n/config";
import { getDictionary } from "@/app/i18n/get-dictionary";
import { ARTICLE_TYPES, getArticles } from "@/lib/articles";

export default async function History({ params }: { params: { locale: string } }) {
  const locale = getSafeLocale(params.locale);
  const dictionary = getDictionary(locale);
  const historyEvents = await getArticles({
    locale,
    type: ARTICLE_TYPES.history,
    pageSize: 999,
    pageIndex: 1,
  });

  return (
    <main>
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <header className="mb-10">
            <h1 className="font-display text-3xl text-foreground md:text-4xl">
              {dictionary.history.title}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {dictionary.history.description}
            </p>
            <div className="mt-5 h-px w-12 bg-border" />
          </header>

          <HistoryTimeline events={historyEvents} locale={locale} />
        </div>
      </div>
    </main>
  );
}