import React from "react";
import BlogList from "@/app/components/blog/BlogList";
import Pagination from "@/app/components/Pagination";
import { getSafeLocale } from "@/app/i18n/config";
import { withLocale } from "@/app/i18n/routes";
import { ARTICLE_TYPES, getArticles } from "@/lib/articles";

export default async function Translations({ params, searchParams }: { params: { locale: string }, searchParams: { page?: string } }) {
  const locale = getSafeLocale(params.locale);
  const currentPage = Number(searchParams?.page) || 1;
  const translations = await getArticles({
    locale,
    type: ARTICLE_TYPES.translation,
    pageSize: 10,
    pageIndex: currentPage,
  });

  const hasNextPage = translations.length === 10;

  return (
    <main>
      <div className="container">
        <BlogList blogs={translations} locale={locale}/>
        <Pagination basePath={withLocale(locale, '/translations')} currentPage={currentPage} hasNextPage={hasNextPage} />
      </div>
    </main>
  );
}