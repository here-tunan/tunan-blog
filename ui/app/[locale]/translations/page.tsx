import React from "react";
import type { Metadata } from "next";
import BlogList from "@/app/components/blog/BlogList";
import Pagination from "@/app/components/Pagination";
import { getSafeLocale } from "@/app/i18n/config";
import { getDictionary } from "@/app/i18n/get-dictionary";
import { withLocale } from "@/app/i18n/routes";
import { ARTICLE_TYPES, getArticles } from "@/lib/articles";

// 翻译存档:个人学习记录,不对外推广——不进搜索引擎,唯一公开入口在 About 页
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = getSafeLocale(params.locale);
  const dictionary = getDictionary(locale);
  return {
    title: `${dictionary.translationsPage.title} · Tunan`,
    robots: { index: false, follow: false },
  };
}

export default async function Translations({ params, searchParams }: { params: { locale: string }, searchParams: { page?: string } }) {
  const locale = getSafeLocale(params.locale);
  const dictionary = getDictionary(locale);
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
        <header className="mb-10">
          <h1 className="font-display text-3xl text-foreground md:text-4xl">
            {dictionary.translationsPage.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            {dictionary.translationsPage.description}
          </p>
          <div className="mt-5 h-px w-12 bg-border" />
        </header>

        <BlogList blogs={translations} locale={locale}/>
        <Pagination basePath={withLocale(locale, '/translations')} currentPage={currentPage} hasNextPage={hasNextPage} />
      </div>
    </main>
  );
}
