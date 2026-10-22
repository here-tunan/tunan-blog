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

interface HistoryTimelineProps {
  events: HistoryEvent[];
  locale: Locale;
}

export default function HistoryTimeline({ events, locale }: HistoryTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-background py-12 text-center text-sm text-muted-foreground">
        No history events found
      </div>
    );
  }

  const sortedEvents = [...events].sort((a, b) => new Date(b.gmtCreate).getTime() - new Date(a.gmtCreate).getTime());

  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute bottom-6 left-[5px] top-6 w-px bg-border" />

      <div className="space-y-8">
        {sortedEvents.map((event, index) => (
          <div key={event.id} className="group relative flex gap-6">
            <span
              aria-hidden="true"
              className="relative z-10 mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full border-2 border-border bg-background transition-colors group-hover:border-primary"
            />

            <Link
              href={withLocale(locale, `/blog/${event.slug}`)}
              className="block flex-1 border-b border-border pb-8"
            >
              <div className="mb-2 flex flex-wrap items-baseline gap-3">
                <span className="font-mono text-xs text-muted-foreground">
                  #{String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {formatDate(event.gmtCreate, locale, { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>

              <h3 className="font-medium text-base text-foreground transition-colors group-hover:text-primary">
                {formatHistoryTitle(event.title)}
              </h3>

              {event.tagNames && event.tagNames.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {event.tagNames.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
