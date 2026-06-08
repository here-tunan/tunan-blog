import React from "react";
import BlogList from "@/app/components/blog/BlogList";
import Pagination from "@/app/components/Pagination";
import { getSafeLocale } from "@/app/i18n/config";
import { withLocale } from "@/app/i18n/routes";
import { ARTICLE_TYPES, getArticles } from "@/lib/articles";

// 周报显示
export default async function Weekly({ params, searchParams }: { params: { locale: string }, searchParams: { page?: string } }) {
  const locale = getSafeLocale(params.locale);
  const currentPage = Number(searchParams?.page) || 1;
  const weeklies = await getArticles({
    locale,
    type: ARTICLE_TYPES.weekly,
    pageSize: 10,
    pageIndex: currentPage,
  });

  const hasNextPage = weeklies.length === 10;

  return (
    <main>
      <div className="container">
        <BlogList blogs={weeklies} locale={locale}/>
        <Pagination basePath={withLocale(locale, '/weekly')} currentPage={currentPage} hasNextPage={hasNextPage} />
      </div>
    </main>
  );
}