import Link from 'next/link';
import { Locale } from '@/app/i18n/config';
import { formatDate } from '@/app/i18n/format';
import { withLocale } from '@/app/i18n/routes';
import { formatHistoryTitle } from './utils';

interface HistoryEvent {
  id: number;
  title: string;
  content: string;
  slug: string;
  gmtCreate: string;
  tagNames: string[];
}

interface HistoryHorizontalTimelineProps {
  events: HistoryEvent[];
  locale: Locale;
}

export default function HistoryHorizontalTimeline({ events, locale }: HistoryHorizontalTimelineProps) {
  if (events.length === 0) {
    return null;
  }

  const displayEvents = [...events]
    .sort((a, b) => new Date(a.gmtCreate).getTime() - new Date(b.gmtCreate).getTime())
    .slice(-5);

  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute left-0 right-0 top-8 hidden h-px bg-border sm:block" />

      <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
        {displayEvents.map((event) => (
          <Link key={event.id} href={withLocale(locale, `/blog/${event.slug}`)} className="group flex flex-col items-center text-center">
            <span className="mb-3 font-mono text-xs text-muted-foreground">
              {formatDate(event.gmtCreate, locale, { month: 'short', year: 'numeric' })}
            </span>

            <span
              aria-hidden="true"
              className="mb-4 h-2 w-2 rounded-full bg-border transition-colors group-hover:bg-primary"
            />

            <h4 className="line-clamp-2 min-h-[2.5rem] text-[13px] font-medium leading-5 text-foreground transition-colors group-hover:text-primary">
              {formatHistoryTitle(event.title)}
            </h4>
          </Link>
        ))}
      </div>
    </div>
  );
}
