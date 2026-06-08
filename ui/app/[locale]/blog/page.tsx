import React from "react";
import BlogList from "@/app/components/blog/BlogList";
import Pagination from "@/app/components/Pagination";
import { getSafeLocale } from "@/app/i18n/config";
import { withLocale } from "@/app/i18n/routes";
import { ARTICLE_TYPES, getArticles } from "@/lib/articles";

export default async function Blog({ params, searchParams }: { params: { locale: string }, searchParams: { page?: string } }) {
  const locale = getSafeLocale(params.locale);
  const currentPage = Number(searchParams?.page) || 1;
  const blogs = await getArticles({
    locale,
    type: ARTICLE_TYPES.blog,
    pageSize: 10,
    pageIndex: currentPage,
  });

  const hasNextPage = blogs.length === 10;

  return (
    <main>
      <div className="container">
        <BlogList blogs={blogs} locale={locale}/>
        <Pagination basePath={withLocale(locale, '/blog')} currentPage={currentPage} hasNextPage={hasNextPage} />
      </div>
    </main>
  );
}