import Link from "next/link";
import { Locale } from "@/app/i18n/config";
import { formatDate } from "@/app/i18n/format";

interface TranslationItemProps {
  link: string;
  name: string;
  gmtCreate: string;
  tagNames: string[];
  locale: Locale;
}

export function TranslationItem({link, name, gmtCreate, tagNames, locale}: TranslationItemProps) {
  const options = {year: "numeric", month: "long"} as Intl.DateTimeFormatOptions
  const date = formatDate(gmtCreate, locale, options)

  return (
    <li>
      <Link className="group flex place-content-between rounded-lg px-2 py-3 -mx-2 transition-colors hover:bg-foreground/[0.04]" href={link}>
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <span
            aria-hidden="true"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m5 8 6 6"/>
              <path d="m4 14 6-6 2-3"/>
              <path d="M2 5h12"/>
              <path d="M7 2h1"/>
              <path d="m22 22-5-10-5 10"/>
              <path d="M14 18h6"/>
            </svg>
          </span>
          <span className="truncate font-medium text-sm sm:text-base text-foreground transition-colors group-hover:text-primary">{name}</span>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden sm:flex gap-1">
            {tagNames.map((tag) => (
              <span key={tag}
                    className="blog-tag rounded-full px-2 py-1 text-xs font-light font-mono inline-flex items-center opacity-80 group-hover:opacity-100 transition-opacity">
                {tag}
              </span>
            ))}
          </div>
          <p className="font-mono text-sm text-muted-foreground whitespace-nowrap">{date}</p>
        </div>
      </Link>
    </li>
  );
}
