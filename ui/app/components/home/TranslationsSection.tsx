import React from "react";
import Link from "next/link";
import TranslationList from "@/app/components/home/TranslationList";
import SectionHeader from "@/app/components/SectionHeader";
import { Locale } from "@/app/i18n/config";
import { getDictionary } from "@/app/i18n/get-dictionary";
import { withLocale } from "@/app/i18n/routes";
import { ARTICLE_TYPES, getArticles } from "@/lib/articles";

export default async function TranslationsSection({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const translations = await getArticles({
    locale,
    type: ARTICLE_TYPES.translation,
    pageSize: 5,
    pageIndex: 1,
  });

  // Don't render if no translations
  if (translations.length === 0) {
    return null;
  }

  return (
    <section className="section mt-2">
      <SectionHeader
        title={dictionary.home.latestTranslations}
        action={
          <Link
            href={withLocale(locale, '/translations')}
            className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <span>{dictionary.home.viewAll}</span>
            <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        }
      />

      <TranslationList translations={translations} locale={locale} />
    </section>
  )
}
