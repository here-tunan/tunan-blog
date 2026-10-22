import React from "react";
import Link from "next/link";
import SectionHeader from "@/app/components/SectionHeader";
import { Locale } from "@/app/i18n/config";
import { formatDate } from "@/app/i18n/format";
import { getDictionary } from "@/app/i18n/get-dictionary";
import { withLocale } from "@/app/i18n/routes";
import { ARTICLE_TYPES, getArticles } from "@/lib/articles";

interface Weekly {
  id: number;
  title: string;
  slug: string;
  gmtCreate: string;
  viewNumber: number;
}

export default async function WeeklySection({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const weeklies = await getArticles({
    locale,
    type: ARTICLE_TYPES.weekly,
    pageSize: 3,
    pageIndex: 1,
  });

  if (weeklies.length === 0) {
    return null;
  }

  return (
    <section className="section mb-10">
      <SectionHeader
        title={dictionary.home.recentWeekly}
        action={
          <Link
            href={withLocale(locale, '/weekly')}
            className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <span>{dictionary.home.viewAll}</span>
            <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {weeklies.map((weekly: Weekly) => {
          // Extract week number from title (supports formats like "周报#21-xxx" or "Report#32-xxx")
          const weekNumberMatch = weekly.title.match(/#(\d+)/);
          const weekNumber = weekNumberMatch ? weekNumberMatch[1] : '?';

          return (
            <Link
              key={weekly.id}
              href={withLocale(locale, `/blog/${weekly.slug}`)}
              className="group block rounded-xl border border-border bg-background p-4 transition-colors hover:border-foreground/25"
            >
              <div className="mb-2 flex items-baseline justify-between gap-2">
                <span className="font-mono text-xs text-muted-foreground">#{weekNumber}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {formatDate(weekly.gmtCreate, locale, { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>

              <h3 className="line-clamp-2 font-medium text-[15px] leading-6 text-foreground transition-colors group-hover:text-primary">
                {weekly.title}
              </h3>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
