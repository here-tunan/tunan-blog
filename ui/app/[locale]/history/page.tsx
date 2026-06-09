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
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold font-mono mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {dictionary.history.title}
            </h1>
            <p className="text-muted-foreground">
              {dictionary.history.description}
            </p>
          </header>

          <HistoryTimeline events={historyEvents} locale={locale} />
        </div>
      </div>
    </main>
  );
}