import React from "react";
import Link from "next/link";
import BlogList from "@/app/components/blog/BlogList";
import { Locale } from "@/app/i18n/config";
import { getDictionary } from "@/app/i18n/get-dictionary";
import { withLocale } from "@/app/i18n/routes";
import { ARTICLE_TYPES, getArticles } from "@/lib/articles";

export default async function BlogsSection({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const blogs = await getArticles({
    locale,
    type: ARTICLE_TYPES.blog,
    pageSize: 10,
    pageIndex: 1,
  });

  return (
    <section className="section mt-2">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-0.5 h-5 bg-green-500 rounded-full"></div>
          <h3 className="font-mono font-semibold text-lg">{dictionary.home.latestBlogs}</h3>
        </div>
        <Link
          href={withLocale(locale, '/blog')}
          className="text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors flex items-center gap-1 group hover:gap-2"
        >
          <span>{dictionary.home.viewAll}</span>
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </header>

      {blogs.length > 0 && <BlogList blogs={blogs} locale={locale} />}
    </section>
  )
}