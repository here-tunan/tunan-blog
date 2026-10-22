import Link from "next/link";
import { Locale } from "@/app/i18n/config";
import { formatDate } from "@/app/i18n/format";

interface BlogItemProps {
  link: string;
  name: string;
  gmtCreate: string;
  tagNames: string[];
  locale: Locale;
}

export function BlogItem({link, name, gmtCreate, tagNames, locale}: BlogItemProps) {
  const options = {year: "numeric", month: "long"} as Intl.DateTimeFormatOptions
  const date = formatDate(gmtCreate, locale, options)

  return (
    <li>
      <Link className="group flex place-content-between rounded-lg px-2 py-3 -mx-2 transition-colors hover:bg-foreground/[0.04]" href={link}>
        <span className="font-medium text-sm sm:text-base text-foreground transition-colors group-hover:text-primary">{name}</span>
        <div className="flex items-center gap-3">
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
